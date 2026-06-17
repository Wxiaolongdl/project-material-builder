export type ProjectTemplateId = "summer-practice" | "innovation" | "campaign" | "class-activity" | "lab-report" | "roadshow";

export type ProjectTemplate = {
  id: ProjectTemplateId;
  name: string;
  scenario: string;
  recommendedOutputs: string[];
  defaultSections: string[];
  fieldHints: {
    projectName: string;
    teamName: string;
    summary: string;
    background: string;
    plan: string;
    outcomes: string;
  };
  icon: string;
  gradient: string;
};
