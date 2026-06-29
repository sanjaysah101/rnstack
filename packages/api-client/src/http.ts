import { type AuthProvider, anonymousAuthProvider } from "@repo/api-client/auth/types";

/** Thrown for any non-2xx response. Carries the status and parsed body. */
export class HttpError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export type HttpClientConfig = {
  /**
   * API origin WITHOUT a trailing path, e.g. https://api.example.com.
   * `/v1` is appended automatically (configurable via `apiPrefix`).
   */
  baseUrl: string;
  /** Path prefix appended to baseUrl. Defaults to "/v1". Pass "" to disable. */
  apiPrefix?: string;
  /** Auth strategy. Defaults to anonymous (no Authorization header, no refresh). */
  auth?: AuthProvider;
};

export type RequestOptions = Omit<RequestInit, "body"> & {
  /** JSON-serializable body; sets Content-Type and stringifies automatically. */
  json?: unknown;
  /** Query params appended to the URL. */
  params?: Record<string, string | number | boolean | null | undefined>;
};

export type HttpClient = {
  request: <T>(path: string, options?: RequestOptions) => Promise<T>;
  get: <T>(path: string, options?: RequestOptions) => Promise<T>;
  post: <T>(path: string, json?: unknown, options?: RequestOptions) => Promise<T>;
  put: <T>(path: string, json?: unknown, options?: RequestOptions) => Promise<T>;
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) => Promise<T>;
  delete: <T>(path: string, options?: RequestOptions) => Promise<T>;
};

function buildUrl(
  base: string,
  prefix: string,
  path: string,
  params?: RequestOptions["params"]
): string {
  const root = `${base.replace(/\/$/, "")}${prefix}`;
  const url = new URL(`${root}${path.startsWith("/") ? path : `/${path}`}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) {
    return null;
  }
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Create a typed HTTP client. The client is auth-agnostic: it delegates token
 * retrieval and refresh to the injected AuthProvider. On a 401 it refreshes
 * exactly once for a burst of concurrent failures (single-flight) and retries
 * the original request with the new token.
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  const auth = config.auth ?? anonymousAuthProvider;
  const prefix = config.apiPrefix ?? "/v1";

  // Single-flight: concurrent 401s share one in-flight refresh promise.
  let refreshing: Promise<string | null> | null = null;
  function refreshOnce(): Promise<string | null> {
    if (!refreshing) {
      refreshing = auth.refresh().finally(() => {
        refreshing = null;
      });
    }
    return refreshing;
  }

  async function send(
    path: string,
    options: RequestOptions,
    accessToken: string | null
  ): Promise<Response> {
    const { json, params, headers, ...rest } = options;
    const finalHeaders = new Headers(headers);
    if (json !== undefined) {
      finalHeaders.set("Content-Type", "application/json");
    }
    if (accessToken) {
      finalHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch(buildUrl(config.baseUrl, prefix, path, params), {
      ...rest,
      headers: finalHeaders,
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  }

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    let res = await send(path, options, await auth.getAccessToken());

    if (res.status === 401) {
      const newToken = await refreshOnce();
      if (newToken) {
        res = await send(path, options, newToken);
      } else {
        await auth.onAuthError?.();
      }
    }

    const body = await parseBody(res);
    if (!res.ok) {
      throw new HttpError(res.status, body);
    }
    return body as T;
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, json, options) => request(path, { ...options, method: "POST", json }),
    put: (path, json, options) => request(path, { ...options, method: "PUT", json }),
    patch: (path, json, options) => request(path, { ...options, method: "PATCH", json }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
  };
}
