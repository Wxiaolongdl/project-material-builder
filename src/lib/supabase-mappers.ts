import { createEmptyProjectMaterial } from "./material-generator";
import type { ProjectMaterial } from "../types/project";
import type { MemberRow, ProjectBundle, ProjectSectionRow } from "../types/database";

const sectionValue = (sections: ProjectSectionRow[], key: string) =>
  sections.find((section) => section.section_key === key)?.content ?? "";

export const mapProjectRecordToMaterial = (bundle: ProjectBundle): ProjectMaterial => ({
  ...createEmptyProjectMaterial(),
  project: {
    name: bundle.project.title,
    teamName: bundle.project.team_name,
    type: bundle.project.project_type,
    college: bundle.project.college,
    mentor: bundle.project.advisor,
    year: bundle.project.year,
    slogan: bundle.project.slogan,
    summary: bundle.project.summary,
  },
  members: bundle.members
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((member: MemberRow) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      className: member.class_name,
      responsibility: member.responsibility,
      strength: member.strength,
      avatarUrl: member.avatar_url,
    })),
  content: {
    background: sectionValue(bundle.sections, "background"),
    significance: sectionValue(bundle.sections, "significance"),
    plan: sectionValue(bundle.sections, "plan"),
    outcomes: sectionValue(bundle.sections, "outcomes"),
    budget: sectionValue(bundle.sections, "budget"),
    riskControl: sectionValue(bundle.sections, "risk_control"),
  },
});

export const mapMaterialToProjectPatch = (material: ProjectMaterial) => ({
  title: material.project.name,
  team_name: material.project.teamName,
  project_type: material.project.type,
  college: material.project.college,
  advisor: material.project.mentor,
  year: material.project.year,
  slogan: material.project.slogan,
  summary: material.project.summary,
});

export const materialSections = (projectId: string, material: ProjectMaterial) => [
  { project_id: projectId, section_key: "background", title: "项目背景", content: material.content.background, is_visible: true, sort_order: 1 },
  { project_id: projectId, section_key: "significance", title: "项目意义", content: material.content.significance, is_visible: true, sort_order: 2 },
  { project_id: projectId, section_key: "plan", title: "实施计划", content: material.content.plan, is_visible: true, sort_order: 3 },
  { project_id: projectId, section_key: "outcomes", title: "预期成果", content: material.content.outcomes, is_visible: true, sort_order: 4 },
  { project_id: projectId, section_key: "budget", title: "经费预算", content: material.content.budget, is_visible: true, sort_order: 5 },
  { project_id: projectId, section_key: "risk_control", title: "风险控制", content: material.content.riskControl, is_visible: true, sort_order: 6 },
];
