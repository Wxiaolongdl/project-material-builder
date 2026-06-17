export type ProjectInfo = {
  name: string;
  teamName: string;
  type: string;
  college: string;
  mentor: string;
  year: string;
  slogan: string;
  summary: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  className: string;
  responsibility: string;
  strength: string;
  avatarUrl?: string;
};

export type ProjectContent = {
  background: string;
  significance: string;
  plan: string;
  outcomes: string;
  budget: string;
  riskControl: string;
};

export type ProjectMaterial = {
  project: ProjectInfo;
  members: TeamMember[];
  content: ProjectContent;
  template?: {
    id: string;
    name: string;
    defaultSections: string[];
    recommendedOutputs: string[];
  };
};
