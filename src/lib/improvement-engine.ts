export type InsightFeedback = {
  feedback_type?: string | null;
  rating?: string | null;
  reason_tags?: string[] | null;
  material_type?: string | null;
  message?: string | null;
};

export type InsightError = {
  feature_key?: string | null;
  error_type?: string | null;
  error_message_sanitized?: string | null;
};

export type InsightEvent = {
  event_type?: string | null;
  feature_key?: string | null;
  material_type?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type ImprovementSuggestionDraft = {
  suggestion_type: string;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  priority: "low" | "medium" | "high";
  affected_feature: string;
  suggested_action: string;
  risk_level: "L1" | "L2" | "L3" | "L4" | "L5";
};

type GenerateSuggestionInput = {
  feedback: InsightFeedback[];
  errors: InsightError[];
  events: InsightEvent[];
};

export function generateRuleBasedSuggestions(input: GenerateSuggestionInput): ImprovementSuggestionDraft[] {
  const suggestions: ImprovementSuggestionDraft[] = [];
  suggestions.push(...detectRepeatedErrors(input.errors));
  suggestions.push(...detectLowRatedMaterials(input.feedback));
  suggestions.push(...detectExportFailures(input.events));
  suggestions.push(...detectFeedbackKeywords(input.feedback));
  return suggestions;
}

export async function analyzeFeedbackWithAI(input: GenerateSuggestionInput) {
  if (!process.env.OPENAI_API_KEY) {
    return generateRuleBasedSuggestions(input);
  }

  // First version keeps AI optional. The structured JSON contract is represented by
  // ImprovementSuggestionDraft and can be wired to OpenAI without changing callers.
  return generateRuleBasedSuggestions(input);
}

function detectRepeatedErrors(errors: InsightError[]) {
  const groups = new Map<string, InsightError[]>();
  for (const error of errors) {
    const key = `${error.feature_key || "unknown"}::${error.error_type || "unknown"}::${error.error_message_sanitized || ""}`;
    groups.set(key, [...(groups.get(key) ?? []), error]);
  }

  return Array.from(groups.entries())
    .filter(([, items]) => items.length >= 3)
    .map(([key, items]) => {
      const [feature, errorType] = key.split("::");
      return {
        suggestion_type: "error_cluster",
        title: `${feature} 出现重复错误`,
        summary: `同一功能出现 ${items.length} 次相同错误，需要优先排查。`,
        evidence: { count: items.length, error_type: errorType },
        priority: "high" as const,
        affected_feature: feature,
        suggested_action: "检查该功能的异常处理、依赖调用和导出流程，先复现再修复。",
        risk_level: "L4" as const,
      };
    });
}

function detectLowRatedMaterials(feedback: InsightFeedback[]) {
  const counts = new Map<string, InsightFeedback[]>();
  for (const item of feedback.filter((entry) => entry.rating === "unsatisfied")) {
    const key = item.material_type || item.feedback_type || "material";
    counts.set(key, [...(counts.get(key) ?? []), item]);
  }

  return Array.from(counts.entries())
    .filter(([, items]) => items.length >= 3)
    .map(([materialType, items]) => ({
      suggestion_type: "template_quality",
      title: `${materialType} 生成质量需要优化`,
      summary: `该材料连续收到 ${items.length} 次不满意评价，建议增强模板结构和示例约束。`,
      evidence: { count: items.length, reason_tags: items.flatMap((item) => item.reason_tags ?? []) },
      priority: "high" as const,
      affected_feature: materialType,
      suggested_action: "补充更具体的章节要求、正式语气约束、可复制示例和高校申报语境。",
      risk_level: "L1" as const,
    }));
}

function detectExportFailures(events: InsightEvent[]) {
  const exportEvents = events.filter((event) => event.event_type === "export");
  if (exportEvents.length < 5) return [];
  const failures = exportEvents.filter((event) => event.metadata?.success === false);
  if (failures.length / exportEvents.length <= 0.1) return [];

  return [
    {
      suggestion_type: "export_reliability",
      title: "导出失败率偏高",
      summary: `近期导出失败率约为 ${Math.round((failures.length / exportEvents.length) * 100)}%。`,
      evidence: { total: exportEvents.length, failures: failures.length },
      priority: "medium" as const,
      affected_feature: "export",
      suggested_action: "检查 Markdown、Word、PPT 导出入口的错误处理和浏览器兼容性。",
      risk_level: "L4" as const,
    },
  ];
}

function detectFeedbackKeywords(feedback: InsightFeedback[]) {
  const text = feedback.map((item) => `${item.message ?? ""} ${(item.reason_tags ?? []).join(" ")}`).join(" ");
  const keywordMap: Array<[string, string]> = [
    ["空泛", "模板内容具体度"],
    ["格式", "材料格式"],
    ["逻辑", "内容逻辑"],
    ["PPT", "PPT 大纲"],
    ["Word", "Word 导出"],
  ];

  return keywordMap
    .filter(([keyword]) => (text.match(new RegExp(keyword, "g")) ?? []).length >= 2)
    .map(([keyword, feature]) => ({
      suggestion_type: "keyword_cluster",
      title: `${feature} 反馈频繁出现`,
      summary: `用户反馈中多次出现“${keyword}”，建议归类跟进。`,
      evidence: { keyword },
      priority: "medium" as const,
      affected_feature: feature,
      suggested_action: "结合反馈样本调整模板、格式提示或导出说明。",
      risk_level: "L2" as const,
    }));
}
