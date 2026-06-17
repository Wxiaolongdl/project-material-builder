import { APP_VERSION, getAnonymousSessionHash } from "./analytics";
import { sanitizeErrorText } from "./privacy";
import { createBrowserSupabaseClient } from "./supabase";

export type LogClientErrorInput = {
  projectId?: string | null;
  route: string;
  featureKey: string;
  errorType: string;
  error: unknown;
  severity?: "low" | "medium" | "high";
};

export async function logClientError(input: LogClientErrorInput) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) return;

  const error = input.error instanceof Error ? input.error : new Error(String(input.error ?? "unknown error"));

  try {
    await supabase.from("error_logs").insert({
      project_id: input.projectId ?? null,
      session_id_hash: await getAnonymousSessionHash(),
      route: input.route,
      feature_key: input.featureKey,
      error_type: input.errorType,
      error_message_sanitized: sanitizeErrorText(error.message),
      stack_sanitized: sanitizeErrorText(error.stack ?? ""),
      browser_info: sanitizeBrowserInfo(),
      app_version: APP_VERSION,
      severity: input.severity ?? "medium",
      status: "open",
    });
  } catch {
    // Error logging must never create another user-facing error.
  }
}

export function sanitizeBrowserInfo() {
  if (typeof navigator === "undefined") return "server";
  return `${navigator.userAgent}`.slice(0, 240);
}
