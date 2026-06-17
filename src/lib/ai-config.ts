import type { AiGenerationType } from "@/types/ai";

export const AI_MODEL = "gpt-5.5";

export const aiGenerationTypes: Array<{ value: AiGenerationType; label: string }> = [
  { value: "plan", label: "策划书" },
  { value: "application", label: "申报书" },
  { value: "defense", label: "答辩稿" },
  { value: "ppt", label: "PPT 大纲" },
  { value: "news", label: "新闻稿" },
  { value: "wechat", label: "公众号推文" },
];
