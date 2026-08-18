import Constants from "expo-constants";

/** Build variant, set per profile in eas.json via APP_VARIANT (see app.config.ts). */
export type AppVariant = "development" | "preview" | "production";

type Extra = { variant?: AppVariant; apiUrl?: string };

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

/** The current build variant. Defaults to "development" outside a configured build. */
export const APP_VARIANT: AppVariant = extra.variant ?? "development";

/** True in production builds — gate analytics, crash reporting, store links, etc. */
export const IS_PRODUCTION = APP_VARIANT === "production";
