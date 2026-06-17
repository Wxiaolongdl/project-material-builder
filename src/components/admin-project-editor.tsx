"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Save } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { ProjectInfo, ProjectMaterial, TeamMember } from "@/types/project";
import type { ProjectRow } from "@/types/database";
import type { ProjectTemplateId } from "@/types/template";
import type { EditableProjectSection, PublicLayoutConfig, PublicThemeConfig } from "@/types/public-config";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { mapMaterialToProjectPatch, mapProjectRecordToMaterial } from "@/lib/supabase-mappers";
import { createEmptyProjectMaterial, generateMaterialMarkdown } from "@/lib/material-generator";
import { createPptOutline, downloadPptOutlineJson, downloadPptOutlineMarkdown } from "@/lib/ppt-planner";
import { applyProjectTemplate } from "@/lib/project-templates";
import { isValidSlug } from "@/lib/slug";
import {
  mergeDefaultSections,
  normalizeLayoutConfig,
  normalizeThemeConfig,
} from "@/lib/public-page-config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProjectInfoForm } from "@/components/project-info-form";
import { TeamMembersManager } from "@/components/team-members-manager";
import { MarkdownPreview } from "@/components/markdown-preview";
import { TemplateLibrary } from "@/components/template-library";
import { PptPlanner } from "@/components/ppt-planner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SectionManager } from "@/components/section-manager";
import { LayoutSettings } from "@/components/layout-settings";
import { ThemeSettings } from "@/components/theme-settings";
import { PublicPreviewCard } from "@/components/public-preview-card";

type AdminProjectEditorProps = {
  projectId: string;
};

export function AdminProjectEditor({ projectId }: AdminProjectEditorProps) {
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [projectRow, setProjectRow] = useState<ProjectRow | null>(null);
  const [data, setData] = useState<ProjectMaterial>(createEmptyProjectMaterial());
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [sections, setSections] = useState<EditableProjectSection[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<PublicLayoutConfig>(normalizeLayoutConfig({}));
  const [themeConfig, setThemeConfig] = useState<PublicThemeConfig>(normalizeThemeConfig({}));
  const [notice, setNotice] = useState<string | null>(null);

  const markdown = useMemo(() => generateMaterialMarkdown(data), [data]);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: authData }) => setUser(authData.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const load = async () => {
      if (!supabase || !user) return;
      const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).maybeSingle();
      if (!project) {
        setNotice("未找到项目。");
        return;
      }
      const [{ data: members }, { data: sections }, { data: materials }] = await Promise.all([
        supabase.from("members").select("*").eq("project_id", projectId).order("sort_order"),
        supabase.from("project_sections").select("*").eq("project_id", projectId).order("sort_order"),
        supabase.from("generated_materials").select("*").eq("project_id", projectId),
      ]);
      const typedProject = project as ProjectRow;
      setProjectRow(typedProject);
      setSlug(typedProject.slug);
      setStatus(typedProject.status);
      setLayoutConfig(normalizeLayoutConfig(typedProject.layout_config));
      setThemeConfig(normalizeThemeConfig(typedProject.theme_config));
      const mergedSections = mergeDefaultSections(sections ?? []);
      setSections(mergedSections);
      setData(
        mapProjectRecordToMaterial({
          project: typedProject,
          members: members ?? [],
          sections: sections ?? [],
          materials: materials ?? [],
        }),
      );
    };
    void load();
  }, [projectId, supabase, user]);

  const updateProject = (project: ProjectInfo) => setData((current) => ({ ...current, project }));
  const updateMembers = (members: TeamMember[]) => setData((current) => ({ ...current, members }));
  const selectTemplate = (templateId: ProjectTemplateId) => {
    const next = applyProjectTemplate(data, templateId);
    setData(next);
    updateSections(
      sections.map((section) => {
        const contentByKey: Record<string, string> = {
          background: next.content.background,
          significance: next.content.significance,
          plan: next.content.plan,
          outcomes: next.content.outcomes,
          budget: next.content.budget,
          risk_control: next.content.riskControl,
        };
        return { ...section, content: contentByKey[section.section_key] ?? section.content };
      }),
    );
  };

  const updateSections = (nextSections: EditableProjectSection[]) => {
    setSections(nextSections);
    const byKey = new Map(nextSections.map((section) => [section.section_key, section.content]));
    setData((current) => ({
      ...current,
      content: {
        background: byKey.get("background") ?? current.content.background,
        significance: byKey.get("significance") ?? current.content.significance,
        plan: byKey.get("plan") ?? current.content.plan,
        outcomes: byKey.get("outcomes") ?? current.content.outcomes,
        budget: byKey.get("budget") ?? current.content.budget,
        riskControl: byKey.get("risk_control") ?? current.content.riskControl,
      },
    }));
  };

  const save = async () => {
    if (!supabase || !projectRow) return;
    if (!isValidSlug(slug)) {
      setNotice("slug 只能包含小写英文、数字和连字符，且不能以连字符开头或结尾。");
      return;
    }
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        ...mapMaterialToProjectPatch(data),
        slug,
        status,
        theme_config: themeConfig,
        layout_config: layoutConfig,
      })
      .eq("id", projectRow.id);

    if (projectError) {
      const isDuplicate = projectError.code === "23505" || projectError.message.toLowerCase().includes("duplicate");
      setNotice(isDuplicate ? "slug 已存在，请修改后保存。" : "项目信息保存失败，请检查权限或数据库配置。");
      return;
    }

    await supabase.from("members").delete().eq("project_id", projectRow.id);
    if (data.members.length > 0) {
      await supabase.from("members").insert(
        data.members.map((member, index) => ({
          id: member.id,
          project_id: projectRow.id,
          name: member.name,
          role: member.role,
          class_name: member.className,
          responsibility: member.responsibility,
          strength: member.strength,
          avatar_url: member.avatarUrl ?? "",
          sort_order: index + 1,
        })),
      );
    }

    await supabase.from("project_sections").upsert(sections.map((section) => ({ ...section, project_id: projectRow.id })), {
      onConflict: "project_id,section_key",
    });
    await supabase.from("generated_materials").upsert(
      {
        project_id: projectRow.id,
        material_type: "full_markdown",
        title: `${data.project.name || "未命名项目"}完整材料`,
        content: markdown,
      },
      { onConflict: "project_id,material_type" },
    );
    setNotice("已保存，用户端公开页会同步更新。");
  };

  if (!isSupabaseConfigured) {
    return <EditorShell>请先配置 Supabase 环境变量。</EditorShell>;
  }

  if (!user) {
    return (
      <EditorShell>
        <Card className="mx-auto max-w-md p-8">
          <h1 className="text-2xl font-semibold">需要管理员登录</h1>
          <p className="mt-3 text-sm text-zinc-500">请先进入 /admin 使用 Supabase Auth 登录。</p>
          <Button className="mt-6" asChild>
            <Link href="/admin">前往登录</Link>
          </Button>
        </Card>
      </EditorShell>
    );
  }

  return (
    <EditorShell>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_440px]">
        <AdminSidebar />

        <section className="space-y-6">
          <Card className="p-6" id="基础信息">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-teal-700">Admin Editor</p>
                <h1 className="text-3xl font-semibold">项目编辑</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/p/${slug}`}>
                    <ExternalLink className="size-4" />
                    公开链接
                  </Link>
                </Button>
                <Button onClick={save}>
                  <Save className="size-4" />
                  保存并同步
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase())} placeholder="公开链接 slug" />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as "draft" | "published")}
                className="h-12 rounded-[18px] border border-white/75 bg-white/62 px-4 text-sm"
              >
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>
            <div className="mt-6">
              <ProjectInfoForm value={data.project} onChange={updateProject} />
            </div>
          </Card>

          <div id="模板库">
            <TemplateLibrary selectedTemplateId={data.template?.id} onSelect={selectTemplate} />
          </div>
          <Card className="p-6" id="成员管理">
            <TeamMembersManager value={data.members} onChange={updateMembers} />
          </Card>
          <Card className="p-6" id="内容模块">
            <SectionManager value={sections} onChange={updateSections} />
          </Card>
          <Card className="p-6" id="页面布置">
            <LayoutSettings value={layoutConfig} onChange={setLayoutConfig} />
          </Card>
          <Card className="p-6" id="主题设置">
            <ThemeSettings value={themeConfig} onChange={setThemeConfig} />
          </Card>
          <div id="PPT 策划器">
            <PptPlanner outline={createPptOutline(data)} onExportMarkdown={() => downloadPptOutlineMarkdown(createPptOutline(data))} onExportJson={() => downloadPptOutlineJson(createPptOutline(data))} />
          </div>
          {notice && <p className="text-sm text-teal-700">{notice}</p>}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <PublicPreviewCard material={data} slug={slug} layoutConfig={layoutConfig} themeConfig={themeConfig} />
          <div className="mt-6" />
          <MarkdownPreview
            markdown={markdown}
            onExport={() => {}}
            onWordExport={() => {}}
            wordExportType="all"
            onWordExportTypeChange={() => {}}
          />
        </aside>
      </div>
    </EditorShell>
  );
}

function EditorShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f5f8f6] px-5 py-6 text-zinc-950 sm:px-8">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </main>
  );
}
