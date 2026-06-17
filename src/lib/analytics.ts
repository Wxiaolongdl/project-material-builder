import { createBrowserSupabaseClient } from "./supabase";
import { createSessionIdHash } from "./privacy";

export const APP_VERSION = "0.1.0";

export type TrackUsageInput = {
  projectId?: string | null;
  route: string;
  eventType: string;
  featureKey: string;
  materialType?: string;
  metadata?: Record<string, unknown>;
};

const QUALITY_EVENT_TYPES = new Set(["export", "generation_rating", "feedback_submit", "error", "usage_profile"]);

export function shouldTrackUsageEvent(eventType: string) {
  return QUALITY_EVENT_TYPES.has(eventType);
}

export async function getAnonymousSessionHash() {
  const key = "pmb_anonymous_session";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return createSessionIdHash(sessionId);
}

export async function trackUsageEvent(input: TrackUsageInput) {
  if (!shouldTrackUsageEvent(input.eventType)) return;

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from("usage_events").insert({
      project_id: input.projectId ?? null,
      session_id_hash: await getAnonymousSessionHash(),
      route: input.route,
      event_type: input.eventType,
      feature_key: input.featureKey,
      material_type: input.materialType ?? "",
      metadata: input.metadata ?? {},
      app_version: APP_VERSION,
    });
  } catch {
    // Analytics must never interrupt the user workflow.
  }
}

export type UsageProfileInput = {
  projectId?: string | null;
  route: string;
  topic: string;
  purpose: string;
  materialIntent: string;
};

export async function trackUsageProfile(input: UsageProfileInput) {
  const now = new Date();
  await trackUsageEvent({
    projectId: input.projectId,
    route: input.route,
    eventType: "usage_profile",
    featureKey: "public_usage_profile",
    materialType: input.materialIntent,
    metadata: {
      topic: sanitizeProfileValue(input.topic),
      purpose: sanitizeProfileValue(input.purpose),
      hour_bucket: `${String(now.getHours()).padStart(2, "0")}:00`,
      date_bucket: now.toISOString().slice(0, 10),
    },
  });
}

function sanitizeProfileValue(value: string) {
  return value.replace(/[^\p{L}\p{N}\s/_-]/gu, "").trim().slice(0, 40) || "未分类";
}
