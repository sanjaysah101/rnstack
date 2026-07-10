import { writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Overwrite the scaffolded root README with a project-specific one that credits
 * the generator (name, version, link back to rnstack).
 */
export async function writeGeneratedReadme(
  projectRoot: string,
  name: string,
  cliVersion: string
): Promise<void> {
  const content = `# ${name}

A React Native monorepo (Expo + Turborepo) — mobile-first, with NativeWind v5, React Native
Reusables, and a typed API layer.

## Getting started

\`\`\`sh
pnpm install
cp .env.example apps/<app>/.env     # set EXPO_PUBLIC_API_BASE_URL
pnpm start                          # expo start (press a / i / w)
\`\`\`

## Quality gate

\`\`\`sh
pnpm lint && pnpm typecheck
\`\`\`

See \`AGENTS.md\` for architecture, conventions, and native gotchas (also read by AI coding agents).

---

_Generated with [create-rnstack](https://github.com/sanjaysah101/rnstack) v${cliVersion}._
`;
  await writeFile(join(projectRoot, "README.md"), content, "utf8");
}
