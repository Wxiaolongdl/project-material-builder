"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileText, Layers3, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { ProjectMaterial } from "@/types/project";
import { Card } from "@/components/ui/card";

type HeroPreviewCardProps = {
  data: ProjectMaterial;
};

export function HeroPreviewCard({ data }: HeroPreviewCardProps) {
  const completion = Math.round(
    ([
      data.project.name,
      data.project.teamName,
      data.project.type,
      data.project.college,
      data.project.summary,
      data.content.background,
      data.content.plan,
      data.content.outcomes,
    ].filter(Boolean).length /
      8) *
      100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-emerald-100/55 via-teal-100/30 to-white/20 blur-2xl" />
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-br from-emerald-100/75 via-teal-50/80 to-white/45" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/62 px-3 py-1.5 text-xs font-medium text-teal-800 shadow-sm ring-1 ring-white/80">
                <WandSparkles className="size-3.5" />
                Material System
              </div>
              <h2 className="mt-5 line-clamp-2 text-2xl font-semibold leading-tight text-zinc-950">
                {data.project.name || "未命名项目"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {data.project.teamName || "填写团队信息后自动生成材料结构"}
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm ring-1 ring-white/80">
              {data.project.year || "2026"}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Metric icon={<CheckCircle2 className="size-4" />} label="完成度" value={`${completion}%`} />
            <Metric icon={<Layers3 className="size-4" />} label="团队成员" value={`${data.members.length}`} />
            <Metric icon={<FileText className="size-4" />} label="生成材料" value="6 份" />
            <Metric icon={<WandSparkles className="size-4" />} label="保存方式" value="本地" />
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] bg-zinc-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Markdown Preview</span>
              <span className="rounded-full bg-emerald-300/15 px-2 py-1 text-emerald-100">Live</span>
            </div>
            <div className="mt-5 space-y-3">
              <motion.div
                className="h-3 rounded-full bg-white/82"
                animate={{ width: ["72%", "86%", "72%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="h-3 rounded-full bg-white/45"
                animate={{ width: ["58%", "76%", "58%"] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="h-3 w-5/6 rounded-full bg-white/25" />
              <div className="grid grid-cols-3 gap-2 pt-3">
                <div className="h-16 rounded-[18px] bg-emerald-200/80" />
                <div className="h-16 rounded-[18px] bg-white/18" />
                <div className="h-16 rounded-[18px] bg-teal-200/70" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/75 bg-white/58 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.055)] backdrop-blur-xl">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
