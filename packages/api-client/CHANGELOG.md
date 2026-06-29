# @repo/api-client

## 0.1.0

### Minor Changes

- Initial release. Typed HTTP client (`createHttpClient`) with base URL + `/v1`, JSON handling,
  an `HttpError` envelope, request cancellation, and single-flight 401 → refresh → retry. Auth is
  injected via a pluggable `AuthProvider` (default: JWT + `expo-secure-store`), and TanStack Query
  is wired via `ApiProvider` / `createQueryClient`.
