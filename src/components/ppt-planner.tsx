"use client";

import { Download, FileJson, Presentation } from "lucide-react";
import type { PptOutline } from "@/types/ppt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PptPlannerProps = {
  outline: PptOutline;
  onExportMarkdown: () => void;
  onExportJson: () => void;
};

export function PptPlanner({ outline, onExportMarkdown, onExportJson }: PptPlannerProps) {
  return (
    <Card className="overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/55 px-3 py-1.5 text-xs font-medium text-teal-800 shadow-sm backdrop-blur-xl">
            <Presentation className="size-3.5" />
            PPT Planner
          </div>
          <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">PPT 策划器</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            根据项目资料自动生成 12 页答辩型 PPT 大纲，每页包含核心内容、视觉建议和演讲提示。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={onExportMarkdown}>
            <Download className="size-4" />
            导出 Markdown
          </Button>
          <Button variant="outline" onClick={onExportJson}>
            <FileJson className="size-4" />
            导出 JSON
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {outline.slides.map((slide) => (
          <article
            key={slide.page}
            className="rounded-[24px] border border-white/70 bg-white/45 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.045)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-teal-700">第 {slide.page} 页</p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-950">{slide.title}</h3>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                {slide.page}/12
              </span>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-600">
              <div>
                <p className="font-medium text-zinc-800">核心内容</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {slide.coreContent.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-800">建议视觉元素</p>
                <p className="mt-1">{slide.visualSuggestion}</p>
              </div>
              <div>
                <p className="font-medium text-zinc-800">演讲提示</p>
                <p className="mt-1">{slide.speakerNotes}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
