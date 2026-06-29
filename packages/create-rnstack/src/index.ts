import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  note,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import pc from "picocolors";
import tiged from "tiged";
import { generateApps } from "./apps.js";
import { removePath, replaceInTree } from "./fs-utils.js";

// The template is this repo. Pinned to a release tag for reproducible scaffolds
// (bump this when cutting a new template release). Override with
// RNSTACK_TEMPLATE_REF for local testing against a branch.
const TEMPLATE_REPO = "sanjaysah101/rnstack";
const TEMPLATE_REF = process.env.RNSTACK_TEMPLATE_REF ?? "v0.1.0";

// Paths inside the template that must NOT end up in a scaffolded project.
const STRIP_PATHS = [".claude", ".turbo", ".husky", "packages/create-rnstack"];

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

function exit(message: string): never {
  cancel(message);
  process.exit(1);
}

function isValidName(name: string | undefined): boolean {
  return !!name && /^[a-z0-9][a-z0-9-]*$/.test(name);
}

async function run(cmd: string, args: string[], cwd: string): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "ignore", shell: process.platform === "win32" });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${cmd} exited with code ${code}`))
    );
  });
}

/** Parse `--flag value` / `--flag=value` / `--no-flag` / `-y` from argv. */
function parseFlags(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] as string;
    if (a.startsWith("--")) {
      const [k, inlineVal] = a.slice(2).split("=", 2);
      if (inlineVal !== undefined) {
        flags[k as string] = inlineVal;
      } else if (k?.startsWith("no-")) {
        flags[k.slice(3)] = false;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          flags[k as string] = next;
          i++;
        } else {
          flags[k as string] = true;
        }
      }
    } else if (a === "-y") {
      flags.yes = true;
    } else {
      positionals.push(a);
    }
  }
  return { flags, positionals };
}

async function main() {
  intro(pc.bgCyan(pc.black(" create-rnstack ")));

  const { flags, positionals } = parseFlags(process.argv.slice(2));
  const yes = flags.yes === true;

  // 1. Project name (positional or prompt)
  let projectName = positionals[0];
  if (projectName === undefined) {
    const answer = await text({
      message: "Project name?",
      placeholder: "my-app",
      validate: (v) =>
        isValidName(v) ? undefined : "Use lowercase letters, numbers, and dashes only.",
    });
    if (isCancel(answer)) {
      exit("Cancelled.");
    }
    projectName = answer;
  } else if (!isValidName(projectName)) {
    exit(`Invalid project name "${projectName}" — use lowercase letters, numbers, and dashes.`);
  }
  // projectName is a valid string from here on.
  const name: string = projectName;

  const targetDir = resolve(process.cwd(), name);
  if (existsSync(targetDir)) {
    exit(`Directory "${name}" already exists.`);
  }

  // 2. Apps to create (--apps a,b or prompt; defaults to "mobile" with -y)
  function parseApps(value: string): string[] {
    const names = value.split(",").map((n) => n.trim());
    if (names.some((n) => !isValidName(n))) {
      return [];
    }
    return new Set(names).size === names.length ? names : [];
  }
  let appNames: string[];
  if (typeof flags.apps === "string" || yes) {
    appNames = parseApps(typeof flags.apps === "string" ? flags.apps : "mobile");
    if (appNames.length === 0) {
      exit("Invalid --apps: names must be unique, lowercase letters/numbers/dashes.");
    }
  } else {
    const appsAnswer = await text({
      message: "App name(s) under apps/ (comma-separated)",
      placeholder: "mobile",
      defaultValue: "mobile",
      validate: (v) =>
        parseApps(v || "mobile").length ? undefined : "Invalid or duplicate names.",
    });
    if (isCancel(appsAnswer)) {
      exit("Cancelled.");
    }
    appNames = parseApps(appsAnswer || "mobile");
  }

  // 3. Package manager (--pm or prompt; defaults to pnpm with -y)
  const PMS: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];
  let pm: PackageManager;
  if (typeof flags.pm === "string" || yes) {
    pm = (typeof flags.pm === "string" ? flags.pm : "pnpm") as PackageManager;
    if (!PMS.includes(pm)) {
      exit(`Invalid --pm "${pm}". Use one of: ${PMS.join(", ")}.`);
    }
  } else {
    const pmAnswer = await select({
      message: "Package manager?",
      options: PMS.map((p) => ({ value: p, label: p === "pnpm" ? "pnpm (recommended)" : p })),
      initialValue: "pnpm" as PackageManager,
    });
    if (isCancel(pmAnswer)) {
      exit("Cancelled.");
    }
    pm = pmAnswer as PackageManager;
  }

  // 4. Install now? (--no-install to skip; -y installs)
  let doInstall: boolean;
  if (flags.install === false) {
    doInstall = false;
  } else if (yes || flags.install === true) {
    doInstall = true;
  } else {
    const answer = await confirm({ message: "Install dependencies now?", initialValue: true });
    if (isCancel(answer)) {
      exit("Cancelled.");
    }
    doInstall = answer;
  }

  // 5. Fetch template
  const s = spinner();
  s.start(`Fetching template (${TEMPLATE_REPO}#${TEMPLATE_REF})`);
  try {
    const emitter = tiged(`${TEMPLATE_REPO}#${TEMPLATE_REF}`, { cache: false, force: true });
    await emitter.clone(targetDir);
  } catch (err) {
    s.stop("Failed to fetch template");
    exit(err instanceof Error ? err.message : String(err));
  }
  s.stop("Template fetched");

  // 6. Strip CLI-internal / dev-only paths
  s.start("Cleaning up");
  await Promise.all(STRIP_PATHS.map((p) => removePath(join(targetDir, p))));
  s.stop("Cleaned up");

  // 7. Rebrand: replace the rnstack project name with the new one
  s.start("Configuring project");
  await replaceInTree(targetDir, [["rnstack", name]]);
  // 8. Generate the requested apps
  await generateApps(targetDir, appNames);
  s.stop("Project configured");

  // 9. Install
  if (doInstall) {
    s.start(`Installing dependencies with ${pm}`);
    try {
      await run(pm, ["install"], targetDir);
      s.stop("Dependencies installed");
    } catch (err) {
      s.stop("Install failed — you can run it manually");
      log.warn(err instanceof Error ? err.message : String(err));
    }
  }

  // 10. Next steps
  const firstApp = appNames[0];
  note(
    [
      `cd ${name}`,
      doInstall ? null : `${pm} install`,
      `cp .env.example apps/${firstApp}/.env   # set EXPO_PUBLIC_API_BASE_URL`,
      `${pm === "npm" ? "npm run" : pm} start                        # expo start`,
    ]
      .filter(Boolean)
      .join("\n"),
    "Next steps"
  );

  outro(pc.green("Your rnstack monorepo is ready 🎉"));
}

main().catch((err) => {
  exit(err instanceof Error ? err.message : String(err));
});
