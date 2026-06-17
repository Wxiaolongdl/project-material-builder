import type { EditableProjectSection, PublicLayoutConfig, PublicThemeConfig } from "@/types/public-config";
import type { ProjectSectionRow } from "@/types/database";

export const defaultLayoutConfig: PublicLayoutConfig = {
  hero_layout: "split",
  member_layout: "cards",
  material_layout: "sections",
  show_stats: true,
  show_timeline: true,
  show_members: true,
  show_materials: true,
  show_footer: true,
  hero_title: "",
  hero_subtitle: "",
  primary_button_text: "下载公开材料",
};

export const defaultThemeConfig: PublicThemeConfig = {
  primary_color: "#0f766e",
  secondary_color: "#67e8f9",
  background_style: "soft-green",
  card_radius: 24,
  glass_effect: true,
  animation_level: "subtle",
};

export const defaultProjectSections: EditableProjectSection[] = [
  { section_key: "background", title: "项目背景", content: "", is_visible: true, sort_order: 1 },
  { section_key: "significance", title: "项目意义", content: "", is_visible: true, sort_order: 2 },
  { section_key: "plan", title: "实施计划", content: "", is_visible: true, sort_order: 3 },
  { section_key: "outcomes", title: "预期成果", content: "", is_visible: true, sort_order: 4 },
  { section_key: "budget", title: "经费预算", content: "", is_visible: true, sort_order: 5 },
  { section_key: "risk_control", title: "风险控制", content: "", is_visible: true, sort_order: 6 },
  { section_key: "plan_outline", title: "策划书大纲", content: "", is_visible: true, sort_order: 7 },
  { section_key: "application", title: "申报书内容", content: "", is_visible: true, sort_order: 8 },
  { section_key: "defense", title: "答辩稿", content: "", is_visible: true, sort_order: 9 },
  { section_key: "ppt", title: "PPT 大纲", content: "", is_visible: true, sort_order: 10 },
  { section_key: "news", title: "新闻稿", content: "", is_visible: true, sort_order: 11 },
  { section_key: "wechat", title: "公众号推文草稿", content: "", is_visible: true, sort_order: 12 },
];

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

export const normalizeLayoutConfig = (value: unknown): PublicLayoutConfig => {
  const record = asRecord(value);
  return {
    ...defaultLayoutConfig,
    ...record,
    hero_layout: record.hero_layout === "centered" ? "centered" : record.hero_layout === "split" ? "split" : defaultLayoutConfig.hero_layout,
    member_layout:
      record.member_layout === "grid" || record.member_layout === "list" || record.member_layout === "cards"
        ? record.member_layout
        : defaultLayoutConfig.member_layout,
    material_layout:
      record.material_layout === "tabs" || record.material_layout === "cards" || record.material_layout === "sections"
        ? record.material_layout
        : defaultLayoutConfig.material_layout,
    show_stats: typeof record.show_stats === "boolean" ? record.show_stats : defaultLayoutConfig.show_stats,
    show_timeline: typeof record.show_timeline === "boolean" ? record.show_timeline : defaultLayoutConfig.show_timeline,
    show_members: typeof record.show_members === "boolean" ? record.show_members : defaultLayoutConfig.show_members,
    show_materials: typeof record.show_materials === "boolean" ? record.show_materials : defaultLayoutConfig.show_materials,
    show_footer: typeof record.show_footer === "boolean" ? record.show_footer : defaultLayoutConfig.show_footer,
  };
};

export const normalizeThemeConfig = (value: unknown): PublicThemeConfig => {
  const record = asRecord(value);
  return {
    ...defaultThemeConfig,
    ...record,
    primary_color: typeof record.primary_color === "string" ? record.primary_color : defaultThemeConfig.primary_color,
    secondary_color: typeof record.secondary_color === "string" ? record.secondary_color : defaultThemeConfig.secondary_color,
    background_style:
      record.background_style === "clean-white" || record.background_style === "mist-blue" || record.background_style === "soft-green"
        ? record.background_style
        : defaultThemeConfig.background_style,
    card_radius: typeof record.card_radius === "number" ? record.card_radius : defaultThemeConfig.card_radius,
    glass_effect: typeof record.glass_effect === "boolean" ? record.glass_effect : defaultThemeConfig.glass_effect,
    animation_level:
      record.animation_level === "none" || record.animation_level === "rich" || record.animation_level === "subtle"
        ? record.animation_level
        : defaultThemeConfig.animation_level,
  };
};

export const mergeDefaultSections = (rows: ProjectSectionRow[] | EditableProjectSection[]): EditableProjectSection[] => {
  const byKey = new Map(rows.map((row) => [row.section_key, row]));
  return defaultProjectSections
    .map((section) => ({ ...section, ...byKey.get(section.section_key) }))
    .sort((a, b) => a.sort_order - b.sort_order);
};

export const moveSection = (
  sections: EditableProjectSection[],
  sectionKey: string,
  direction: "up" | "down",
): EditableProjectSection[] => {
  const next = sections.slice().sort((a, b) => a.sort_order - b.sort_order);
  const index = next.findIndex((section) => section.section_key === sectionKey);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || targetIndex < 0 || targetIndex >= next.length) {
    return next;
  }
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next.map((section, idx) => ({ ...section, sort_order: idx + 1 }));
};
