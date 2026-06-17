"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Plus, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectContent, ProjectInfo, ProjectMaterial, TeamMember } from "@/types/project";
import type { AiGenerateError, AiGenerateResponse, AiGenerationType } from "@/types/ai";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { createEmptyProjectMaterial, generateMaterialMarkdown } from "@/lib/material-generator";
import { downloadMarkdown } from "@/lib/export";
import { exportWordDocument, type WordExportType, wordExportTypes } from "@/lib/word-export";
import { aiGenerationTypes } from "@/lib/ai-config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectInfoForm } from "@/components/project-info-form";
import { TeamMembersManager } from "@/components/team-members-manager";
import { ProjectContentForm } from "@/components/project-content-form";
import { MarkdownPreview } from "@/components/markdown-preview";
import { HeroPreviewCard } from "@/components/hero-preview-card";
import { PptPlanner } from "@/components/ppt-planner";
import { createPptOutline, downloadPptOutlineJson, downloadPptOutlineMarkdown } from "@/lib/ppt-planner";
import { TemplateLibrary } from "@/components/template-library";
import { applyProjectTemplate } from "@/lib/project-templates";
import type { ProjectTemplateId } from "@/types/template";

const storageKey = "project-material-builder:data:v1";

const sectionMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

export function AppShell() {
  const { value: data, setValue, error, hydrated } = useLocalStorage<ProjectMaterial>(
    storageKey,
    createEmptyProjectMaterial(),
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [wordExportType, setWordExportType] = useState<WordExportType>("all");
  const [aiGenerationType, setAiGenerationType] = useState<AiGenerationType>("plan");
  const [aiMarkdown, setAiMarkdown] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const localMarkdown = useMemo(() => generateMaterialMarkdown(data), [data]);
  const pptOutline = useMemo(() => createPptOutline(data), [data]);
  const previewMarkdown = aiMarkdown ?? localMarkdown;

  const updateProject = (project: ProjectInfo) => setValue((current) => ({ ...current, project }));
  const updateMembers = (members: TeamMember[]) => setValue((current) => ({ ...current, members }));
  const updateContent = (content: ProjectContent) => setValue((current) => ({ ...current, content }));

  const createNewProject = () => {
    setValue(createEmptyProjectMaterial());
    setAiMarkdown(null);
    setNotice("已创建空白项目。");
  };

  const exportMarkdown = () => {
    try {
      downloadMarkdown(previewMarkdown, data.project.name || "项目材料自动生成工作台");
      setNotice("Markdown 文件已开始下载。");
    } catch {
      setNotice("导出失败，请稍后重试。");
    }
  };

  const exportWord = async () => {
    try {
      await exportWordDocument(data, wordExportType);
      setNotice("Word 文件已开始下载。");
    } catch {
      setNotice("Word 导出失败，请稍后重试。");
    }
  };

  const generateWithAi = async () => {
    setIsGenerating(true);
    setNotice(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: aiGenerationType, data }),
      });

      const payload = (await response.json()) as AiGenerateResponse | AiGenerateError;

      if (!response.ok || "error" in payload) {
        setNotice("error" in payload ? payload.error : "AI 生成失败，请稍后重试。");
        return;
      }

      setAiMarkdown(payload.markdown);
      setNotice("AI 优化内容已生成，可在右侧继续编辑。");
    } catch {
      setNotice("AI 生成请求失败，请检查服务端是否已启动。");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectTemplate = (templateId: ProjectTemplateId) => {
    setValue((current) => applyProjectTemplate(current, templateId));
    setAiMarkdown(null);
    setNotice("已应用项目模板，字段结构和生成材料将按模板更新。");
  };

  const exportPptMarkdown = () => {
    try {
      downloadPptOutlineMarkdown(pptOutline);
      setNotice("PPT 大纲 Markdown 已开始下载。");
    } catch {
      setNotice("PPT 大纲 Markdown 导出失败，请稍后重试。");
    }
  };

  const exportPptJson = () => {
    try {
      downloadPptOutlineJson(pptOutline);
      setNotice("PPT 大纲 JSON 已开始下载。");
    } catch {
      setNotice("PPT 大纲 JSON 导出失败，请稍后重试。");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f8f6] text-zinc-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(187,247,208,0.42),transparent_34%),radial-gradient(circle_at_88%_8%,rgba(153,246,228,0.34),transparent_30%),linear-gradient(180deg,#fbfdfb_0%,#f4f8f6_48%,#eef5f2_100%)]" />
        <div className="absolute left-1/2 top-28 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-teal-100/24 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/75 bg-white/58 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-normal">ProjectMaterialBuilder</p>
              <p className="hidden text-xs text-zinc-500 sm:block">项目材料自动生成工作台</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" onClick={createNewProject}>
              <Plus className="size-4" />
              新建项目
            </Button>
            <Button variant="secondary" size="sm" onClick={exportMarkdown}>
              <Download className="size-4" />
              导出材料
            </Button>
            <Button variant="outline" size="sm" onClick={exportWord}>
              <FileText className="size-4" />
              导出 Word
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="size-4" />
              设置
            </Button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="secondary" size="icon" onClick={createNewProject} aria-label="新建项目">
              <Plus className="size-4" />
            </Button>
            <Button size="icon" onClick={exportMarkdown} aria-label="导出材料">
              <Download className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={exportWord} aria-label="导出 Word">
              <FileText className="size-4" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-7 lg:px-8 lg:pb-28 lg:pt-20">
        <section className="grid min-h-[680px] items-center gap-12 py-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/58 px-4 py-2.5 text-sm text-zinc-600 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
              <FileText className="size-4 text-teal-700" />
              本地稳定生成，后续可平滑接入 AI
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-normal text-zinc-950 sm:text-6xl lg:text-7xl">
              项目材料自动生成工作台
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              输入项目资料，自动生成策划书、申报书、答辩稿、PPT 大纲与宣传文案。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={exportMarkdown}>
                <Download className="size-4" />
                导出 Markdown
              </Button>
              <Button variant="secondary" onClick={exportWord}>
                <FileText className="size-4" />
                导出 Word
              </Button>
              <Button variant="outline" onClick={generateWithAi} disabled={isGenerating}>
                <Sparkles className="size-4" />
                {isGenerating ? "AI 生成中..." : "AI 优化生成"}
              </Button>
              <Button variant="secondary" onClick={createNewProject}>
                <Plus className="size-4" />
                新建项目
              </Button>
            </div>
            <div className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row sm:items-center">
              <label className="text-sm text-zinc-500" htmlFor="ai-generation-type">
                AI 生成类型
              </label>
              <select
                id="ai-generation-type"
                value={aiGenerationType}
                onChange={(event) => setAiGenerationType(event.target.value as AiGenerationType)}
                className="h-11 rounded-full border border-white/75 bg-white/62 px-4 text-sm text-zinc-800 shadow-[0_10px_28px_rgba(15,23,42,0.05)] outline-none backdrop-blur-xl transition focus:ring-4 focus:ring-teal-700/[0.06]"
              >
                {aiGenerationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex max-w-md flex-col gap-2 sm:flex-row sm:items-center">
              <label className="text-sm text-zinc-500" htmlFor="word-export-type">
                Word 导出内容
              </label>
              <select
                id="word-export-type"
                value={wordExportType}
                onChange={(event) => setWordExportType(event.target.value as WordExportType)}
                className="h-11 rounded-full border border-white/75 bg-white/62 px-4 text-sm text-zinc-800 shadow-[0_10px_28px_rgba(15,23,42,0.05)] outline-none backdrop-blur-xl transition focus:ring-4 focus:ring-teal-700/[0.06]"
              >
                {wordExportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {(error || notice || !hydrated) && (
              <p className="mt-6 text-sm text-zinc-500">{error || notice || "正在读取本地保存的数据..."}</p>
            )}
          </motion.div>

          <HeroPreviewCard data={data} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
          <div className="space-y-8">
            <motion.div {...sectionMotion}>
              <TemplateLibrary selectedTemplateId={data.template?.id} onSelect={selectTemplate} />
            </motion.div>
            <motion.div {...sectionMotion}>
              <Card className="p-6 sm:p-8 lg:p-10">
                <ProjectInfoForm value={data.project} onChange={updateProject} />
              </Card>
            </motion.div>
            <motion.div {...sectionMotion}>
              <Card className="p-6 sm:p-8 lg:p-10">
                <TeamMembersManager value={data.members} onChange={updateMembers} />
              </Card>
            </motion.div>
            <motion.div {...sectionMotion}>
              <Card className="p-6 sm:p-8 lg:p-10">
                <ProjectContentForm value={data.content} onChange={updateContent} />
              </Card>
            </motion.div>
            <motion.div {...sectionMotion}>
              <PptPlanner outline={pptOutline} onExportMarkdown={exportPptMarkdown} onExportJson={exportPptJson} />
            </motion.div>
          </div>
          <motion.div {...sectionMotion}>
            <MarkdownPreview
              markdown={previewMarkdown}
              onExport={exportMarkdown}
              onWordExport={exportWord}
              wordExportType={wordExportType}
              onWordExportTypeChange={setWordExportType}
              editable={aiMarkdown !== null}
              onMarkdownChange={setAiMarkdown}
            />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
