"use client";

import { Copy, Download, ExternalLink, Presentation } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProjectMaterial } from "@/types/project";
import type { ProjectRow, ProjectSectionRow } from "@/types/database";
import { generateMaterialMarkdown } from "@/lib/material-generator";
import { createPptOutline, downloadPptOutlineJson, downloadPptOutlineMarkdown } from "@/lib/ppt-planner";
import { downloadMarkdown } from "@/lib/export";
import { mergeDefaultSections, normalizeLayoutConfig, normalizeThemeConfig } from "@/lib/public-page-config";
import { trackUsageEvent } from "@/lib/analytics";
import { logClientError } from "@/lib/error-logger";
import { inferMaterialIntent, inferUsagePurpose } from "@/lib/usage-insights";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeedbackButton } from "@/components/feedback-button";
import { RatingPanel } from "@/components/rating-panel";
import { UsageTracker } from "@/components/usage-tracker";

type PublicProjectPageProps = {
  material: ProjectMaterial;
  project: ProjectRow;
  sections: ProjectSectionRow[];
  slug: string;
};

export function PublicProjectPage({ material, project, sections, slug }: PublicProjectPageProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const markdown = useMemo(() => generateMaterialMarkdown(material), [material]);
  const pptOutline = useMemo(() => createPptOutline(material), [material]);
  const usageProfile = useMemo(
    () => ({
      topic: material.project.type || "未分类项目",
      purpose: inferUsagePurpose(material.project.type || ""),
      materialIntent: inferMaterialIntent(material.project.type || ""),
    }),
    [material.project.type],
  );
  const layoutConfig = normalizeLayoutConfig(project.layout_config);
  const themeConfig = normalizeThemeConfig(project.theme_config);
  const visibleSections = mergeDefaultSections(sections).filter((section) => section.is_visible);
  const heroCentered = layoutConfig.hero_layout === "centered";
  const backgroundClass =
    themeConfig.background_style === "mist-blue"
      ? "bg-[#f4f8fb]"
      : themeConfig.background_style === "clean-white"
        ? "bg-[#fbfbfa]"
        : "bg-[#f5f8f6]";

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setNotice("Markdown 已复制。");
  };

  const safeExport = async (featureKey: string, action: () => void) => {
    try {
      action();
      await trackUsageEvent({
        projectId: project.id,
        route: `/p/${slug}`,
        eventType: "export",
        featureKey,
        metadata: { success: true },
      });
    } catch (error) {
      await trackUsageEvent({
        projectId: project.id,
        route: `/p/${slug}`,
        eventType: "export",
        featureKey,
        metadata: { success: false },
      });
      await logClientError({
        projectId: project.id,
        route: `/p/${slug}`,
        featureKey,
        errorType: "export_failed",
        error,
        severity: "medium",
      });
      setNotice("导出失败，已匿名记录错误摘要。");
    }
  };

  return (
    <main className={`min-h-screen ${backgroundClass} px-5 py-6 text-zinc-950 sm:px-8 lg:px-10`}>
      <UsageTracker
        projectId={project.id}
        route={`/p/${slug}`}
        usageProfile={usageProfile}
      />
      <div className="mx-auto max-w-6xl">
        <nav className="mb-10 flex items-center justify-between rounded-full border border-white/75 bg-white/58 px-5 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
          <div>
            <p className="text-sm font-semibold">ProjectMaterialBuilder</p>
            <p className="text-xs text-zinc-500">公开项目页 /p/{slug}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={copyMarkdown}>
              <Copy className="size-4" />
              复制 Markdown
            </Button>
            <Button size="sm" onClick={() => safeExport("markdown_export", () => downloadMarkdown(markdown, material.project.name || "公开材料"))}>
              <Download className="size-4" />
              下载材料
            </Button>
          </div>
        </nav>

        <section className={`grid gap-8 ${heroCentered ? "text-center" : "lg:grid-cols-[minmax(0,1fr)_360px]"}`}>
          <div className={heroCentered ? "mx-auto max-w-4xl" : ""}>
            <p className="mb-4 inline-flex rounded-full bg-white/60 px-4 py-2 text-sm text-teal-800 shadow-sm">
              {material.project.type || "项目展示"}
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
              {layoutConfig.hero_title || material.project.name || "未命名项目"}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
              {layoutConfig.hero_subtitle || material.project.summary || "暂无项目简介。"}
            </p>
            <div className={`mt-8 flex flex-wrap gap-3 text-sm text-zinc-500 ${heroCentered ? "justify-center" : ""}`}>
              <span>{material.project.teamName || "待补充团队"}</span>
              <span>{material.project.college || "待补充学院"}</span>
              <span>{material.project.year || "待补充年份"}</span>
            </div>
            {notice && <p className="mt-5 text-sm text-teal-700">{notice}</p>}
          </div>

          <Card className={`p-6 ${heroCentered ? "mx-auto w-full max-w-xl" : ""}`} style={{ borderRadius: themeConfig.card_radius }}>
            <h2 className="text-lg font-semibold">公开材料下载</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">用户端为只读页面，可复制或下载材料，不显示后台编辑入口。</p>
            <div className="mt-5 space-y-3">
              <Button className="w-full" variant="secondary" onClick={() => safeExport("ppt_markdown_export", () => downloadPptOutlineMarkdown(pptOutline))}>
                <Presentation className="size-4" />
                {layoutConfig.primary_button_text || "下载 PPT 大纲"}
              </Button>
              <Button className="w-full" variant="outline" onClick={() => safeExport("ppt_json_export", () => downloadPptOutlineJson(pptOutline))}>
                <ExternalLink className="size-4" />
                下载 PPT JSON
              </Button>
            </div>
          </Card>
        </section>

        {layoutConfig.show_stats && (
          <section className="mt-12 grid gap-4 md:grid-cols-4">
            <Stat label="成员数量" value={`${material.members.length}`} />
            <Stat label="公开模块" value={`${visibleSections.length}`} />
            <Stat label="PPT 页数" value={`${pptOutline.slideCount}`} />
            <Stat label="材料状态" value={project.status === "published" ? "已发布" : "草稿"} />
          </section>
        )}

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {layoutConfig.show_members && (
          <InfoCard title="团队成员" radius={themeConfig.card_radius}>
            {material.members.length === 0 ? (
              <p>暂无成员信息。</p>
            ) : (
              <div className={layoutConfig.member_layout === "grid" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
                {material.members.map((member) => (
                  <div key={member.id} className="rounded-2xl bg-white/55 p-4">
                    <p className="font-medium text-zinc-900">{member.name || "未命名成员"} · {member.role || "角色待补充"}</p>
                    <p className="mt-1 text-sm text-zinc-500">{member.responsibility || "分工待补充"}</p>
                  </div>
                ))}
              </div>
            )}
          </InfoCard>
          )}
          {visibleSections.map((section) => (
            <InfoCard key={section.section_key} title={section.title} radius={themeConfig.card_radius}>
              {section.content || "暂无内容。"}
            </InfoCard>
          ))}
        </section>

        {layoutConfig.show_materials && (
        <Card className="mt-8 overflow-hidden" style={{ borderRadius: themeConfig.card_radius }}>
          <div className="border-b border-white/65 p-5">
            <h2 className="text-lg font-semibold">公开 Markdown 预览</h2>
          </div>
          <div className="p-5">
            <RatingPanel projectId={project.id} materialType="full_markdown" excerpt={markdown} />
          </div>
          <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap break-words p-6 text-sm leading-7 text-zinc-700">{markdown}</pre>
        </Card>
        )}

        {layoutConfig.show_footer && (
          <footer className="py-10 text-center text-sm leading-6 text-zinc-500">
            <p>Powered by ProjectMaterialBuilder</p>
            <p className="mx-auto mt-2 max-w-3xl">
              本系统仅收集匿名使用反馈、功能错误和用户主动提交的问题描述，用于改进生成质量和修复功能问题。系统不会收集身份证、学号、精确位置、密钥或用户未授权提交的完整文件内容。
            </p>
          </footer>
        )}
      </div>
      <FeedbackButton projectId={project.id} excerpt={markdown} />
    </main>
  );
}

function InfoCard({ title, children, radius = 24 }: { title: string; children: React.ReactNode; radius?: number }) {
  return (
    <Card className="p-6" style={{ borderRadius: radius }}>
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-zinc-600">{children}</div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5 text-center">
      <p className="text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </Card>
  );
}
