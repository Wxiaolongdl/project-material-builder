export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  team_name: string;
  project_type: string;
  college: string;
  advisor: string;
  year: string;
  slogan: string;
  summary: string;
  cover_image: string;
  status: "draft" | "published";
  theme_config: Record<string, unknown>;
  layout_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type MemberRow = {
  id: string;
  project_id: string;
  name: string;
  role: string;
  class_name: string;
  responsibility: string;
  strength: string;
  avatar_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectSectionRow = {
  id: string;
  project_id: string;
  section_key: string;
  title: string;
  content: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GeneratedMaterialRow = {
  id: string;
  project_id: string;
  material_type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type UsageEventRow = {
  id: string;
  project_id: string | null;
  session_id_hash: string;
  route: string;
  event_type: string;
  feature_key: string;
  material_type: string;
  metadata: Record<string, unknown>;
  app_version: string;
  created_at: string;
};

export type UserFeedbackRow = {
  id: string;
  project_id: string | null;
  session_id_hash: string;
  feedback_type: string;
  rating: "satisfied" | "neutral" | "unsatisfied" | null;
  reason_tags: string[];
  message: string;
  contact_optional: string;
  submitted_excerpt: string;
  allow_excerpt_for_improvement: boolean;
  status: "open" | "reviewed" | "converted" | "resolved" | "ignored";
  material_type?: string | null;
  created_at: string;
  updated_at: string;
};

export type ErrorLogRow = {
  id: string;
  project_id: string | null;
  session_id_hash: string;
  route: string;
  feature_key: string;
  error_type: string;
  error_message_sanitized: string;
  stack_sanitized: string;
  browser_info: string;
  app_version: string;
  severity: "low" | "medium" | "high";
  status: "open" | "reviewed" | "resolved" | "ignored";
  created_at: string;
};

export type ImprovementSuggestionRow = {
  id: string;
  project_id: string | null;
  suggestion_type: string;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  priority: "low" | "medium" | "high";
  affected_feature: string;
  suggested_action: string;
  risk_level: "L1" | "L2" | "L3" | "L4" | "L5";
  status: "open" | "accepted" | "deferred" | "resolved" | "task_created" | "ignored";
  admin_decision: string;
  created_at: string;
  updated_at: string;
};

export type AdminActionLogRow = {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_table: string;
  target_id: string;
  note: string;
  created_at: string;
};

export type ProjectBundle = {
  project: ProjectRow;
  members: MemberRow[];
  sections: ProjectSectionRow[];
  materials: GeneratedMaterialRow[];
};
