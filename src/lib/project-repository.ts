import { createServerSupabaseClient } from "@/lib/supabase";
import { mapProjectRecordToMaterial } from "@/lib/supabase-mappers";
import type { ProjectBundle, ProjectRow } from "@/types/database";
import type { ProjectMaterial } from "@/types/project";

export type LoadedProject = {
  project: ProjectRow;
  material: ProjectMaterial;
  bundle: ProjectBundle;
};

export const loadProjectBySlug = async (slug: string): Promise<LoadedProject | null> => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data: project } = await supabase.from("projects").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!project) return null;

  const [{ data: members }, { data: sections }, { data: materials }] = await Promise.all([
    supabase.from("members").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_sections").select("*").eq("project_id", project.id).eq("is_visible", true).order("sort_order"),
    supabase.from("generated_materials").select("*").eq("project_id", project.id).order("updated_at", { ascending: false }),
  ]);

  const bundle = {
    project,
    members: members ?? [],
    sections: sections ?? [],
    materials: materials ?? [],
  } as ProjectBundle;

  return { project, bundle, material: mapProjectRecordToMaterial(bundle) };
};

export const loadProjectById = async (id: string): Promise<LoadedProject | null> => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) return null;

  const [{ data: members }, { data: sections }, { data: materials }] = await Promise.all([
    supabase.from("members").select("*").eq("project_id", id).order("sort_order"),
    supabase.from("project_sections").select("*").eq("project_id", id).order("sort_order"),
    supabase.from("generated_materials").select("*").eq("project_id", id).order("updated_at", { ascending: false }),
  ]);

  const bundle = {
    project,
    members: members ?? [],
    sections: sections ?? [],
    materials: materials ?? [],
  } as ProjectBundle;

  return { project, bundle, material: mapProjectRecordToMaterial(bundle) };
};

export const listProjects = async () => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
  return (data ?? []) as ProjectRow[];
};
