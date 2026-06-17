import { getAnonymousSessionHash, trackUsageEvent } from "./analytics";
import { sanitizeExcerpt, sanitizeOptionalContact, sanitizeUserMessage } from "./privacy";
import { createBrowserSupabaseClient } from "./supabase";

export type SubmitFeedbackInput = {
  projectId?: string | null;
  feedbackType: string;
  rating?: "satisfied" | "neutral" | "unsatisfied" | null;
  reasonTags?: string[];
  message: string;
  contactOptional?: string;
  submittedExcerpt?: string;
  allowExcerptForImprovement?: boolean;
  materialType?: string;
};

export async function submitUserFeedback(input: SubmitFeedbackInput) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, message: "Supabase 尚未配置，暂时无法提交反馈。" };

  const allowExcerpt = Boolean(input.allowExcerptForImprovement);
  const { error } = await supabase.from("user_feedback").insert({
    project_id: input.projectId ?? null,
    session_id_hash: await getAnonymousSessionHash(),
    feedback_type: input.feedbackType,
    rating: input.rating ?? null,
    reason_tags: input.reasonTags ?? [],
    message: sanitizeUserMessage(input.message),
    contact_optional: sanitizeOptionalContact(input.contactOptional ?? ""),
    submitted_excerpt: sanitizeExcerpt(input.submittedExcerpt ?? "", allowExcerpt),
    allow_excerpt_for_improvement: allowExcerpt,
    material_type: input.materialType ?? "",
    status: "open",
  });

  if (!error) {
    await trackUsageEvent({
      projectId: input.projectId,
      route: typeof window === "undefined" ? "" : window.location.pathname,
      eventType: input.rating ? "generation_rating" : "feedback_submit",
      featureKey: input.rating ? "rating_panel" : "feedback_modal",
      materialType: input.materialType ?? "",
      metadata: {
        rating: input.rating ?? null,
        feedback_type: input.feedbackType,
        has_message: Boolean(input.message.trim()),
        allow_excerpt_for_improvement: allowExcerpt,
      },
    });
  }

  return error ? { ok: false, message: "反馈提交失败，请稍后再试。" } : { ok: true, message: "反馈已提交，感谢帮助改进。" };
}
