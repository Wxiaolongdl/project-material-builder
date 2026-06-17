"use client";

import {
  FlaskConical,
  MapPinned,
  Mic2,
  Presentation,
  Rocket,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectTemplate, ProjectTemplateId } from "@/types/template";
import { projectTemplates } from "@/lib/project-templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TemplateLibraryProps = {
  selectedTemplateId?: string;
  onSelect: (templateId: ProjectTemplateId) => void;
};

const icons: Record<ProjectTemplate["icon"], LucideIcon> = {
  MapPinned,
  Rocket,
  Mic2,
  UsersRound,
  FlaskConical,
  Presentation,
};

export function TemplateLibrary({ selectedTemplateId, onSelect }: TemplateLibraryProps) {
  return (
    <Card className="overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/55 px-3 py-1.5 text-xs font-medium text-teal-800 shadow-sm backdrop-blur-xl">
            <Sparkles className="size-3.5" />
            Template Library
          </div>
          <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">项目模板库</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            选择一个模板后，系统会自动填充项目类型、材料提示、章节结构和示例字段，旧的导出与 AI 功能仍可继续使用。
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projectTemplates.map((template, index) => {
          const Icon = icons[template.icon];
          const active = selectedTemplateId === template.id;

          return (
            <motion.article
              key={template.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className={`group relative overflow-hidden rounded-[24px] border p-5 shadow-[0_16px_42px_rgba(15,23,42,0.045)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)] ${
                active ? "border-teal-300/70 bg-white/70" : "border-white/70 bg-white/45"
              }`}
            >
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${template.gradient} opacity-80`} />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white/70 text-teal-700 shadow-sm ring-1 ring-white/80">
                    <Icon className="size-5" />
                  </div>
                  {active && (
                    <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800">
                      已选择
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-950">{template.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">{template.scenario}</p>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                  <div>
                    <p className="font-medium text-zinc-800">推荐输出</p>
                    <p className="mt-1 line-clamp-2">{template.recommendedOutputs.join("、")}</p>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-800">默认章节</p>
                    <p className="mt-1 line-clamp-2">{template.defaultSections.join(" / ")}</p>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-800">字段提示</p>
                    <p className="mt-1 line-clamp-2">{template.fieldHints.summary}</p>
                  </div>
                </div>
                <Button className="mt-5 w-full" variant={active ? "default" : "secondary"} onClick={() => onSelect(template.id)}>
                  使用此模板
                </Button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Card>
  );
}
