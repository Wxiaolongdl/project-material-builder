"use client";

import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import type { ProjectMaterial } from "@/types/project";
import type { PublicLayoutConfig, PublicThemeConfig } from "@/types/public-config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PublicPreviewCardProps = {
  material: ProjectMaterial;
  slug: string;
  layoutConfig: PublicLayoutConfig;
  themeConfig: PublicThemeConfig;
};

export function PublicPreviewCard({ material, slug, layoutConfig, themeConfig }: PublicPreviewCardProps) {
  const publicPath = `/p/${slug || "project-slug"}`;

  const copy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
  };

  return (
    <Card className="overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-teal-700">Public Preview</p>
          <h2 className="mt-2 text-lg font-semibold">实时公开页预览</h2>
        </div>
        <div className="size-5 rounded-full" style={{ backgroundColor: themeConfig.primary_color }} />
      </div>
      <div className="mt-5 rounded-[22px] border border-white/70 bg-white/50 p-5">
        <p className="text-xs text-zinc-500">{layoutConfig.hero_layout} / {layoutConfig.member_layout} / {layoutConfig.material_layout}</p>
        <h3 className="mt-3 text-2xl font-semibold leading-tight">{layoutConfig.hero_title || material.project.name || "未命名项目"}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">{layoutConfig.hero_subtitle || material.project.summary || "项目简介待补充。"}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
          <div className="rounded-2xl bg-white/60 p-3">成员 {material.members.length}</div>
          <div className="rounded-2xl bg-white/60 p-3">{layoutConfig.show_materials ? "材料显示" : "材料隐藏"}</div>
          <div className="rounded-2xl bg-white/60 p-3">{layoutConfig.show_footer ? "页脚显示" : "页脚隐藏"}</div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link href={publicPath}>
            <ExternalLink className="size-4" />
            打开用户端链接
          </Link>
        </Button>
        <Button variant="outline" onClick={copy}>
          <Copy className="size-4" />
          复制用户端链接
        </Button>
      </div>
    </Card>
  );
}
