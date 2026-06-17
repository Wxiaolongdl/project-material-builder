import type { ProjectMaterial } from "@/types/project";

export type AiGenerationType = "plan" | "application" | "defense" | "ppt" | "news" | "wechat";

export type AiGenerateRequest = {
  type: AiGenerationType;
  data: ProjectMaterial;
};

export type AiGenerateResponse = {
  markdown: string;
  type: AiGenerationType;
};

export type AiGenerateError = {
  error: string;
};
