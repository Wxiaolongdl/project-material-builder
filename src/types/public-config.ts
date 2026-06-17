export type HeroLayout = "centered" | "split";
export type MemberLayout = "grid" | "list" | "cards";
export type MaterialLayout = "tabs" | "cards" | "sections";
export type BackgroundStyle = "soft-green" | "clean-white" | "mist-blue";
export type AnimationLevel = "none" | "subtle" | "rich";

export type PublicLayoutConfig = {
  hero_layout: HeroLayout;
  member_layout: MemberLayout;
  material_layout: MaterialLayout;
  show_stats: boolean;
  show_timeline: boolean;
  show_members: boolean;
  show_materials: boolean;
  show_footer: boolean;
  hero_title?: string;
  hero_subtitle?: string;
  primary_button_text?: string;
};

export type PublicThemeConfig = {
  primary_color: string;
  secondary_color: string;
  background_style: BackgroundStyle;
  card_radius: number;
  glass_effect: boolean;
  animation_level: AnimationLevel;
};

export type EditableProjectSection = {
  id?: string;
  project_id?: string;
  section_key: string;
  title: string;
  content: string;
  is_visible: boolean;
  sort_order: number;
};
