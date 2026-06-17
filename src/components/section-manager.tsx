"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type { EditableProjectSection } from "@/types/public-config";
import { moveSection } from "@/lib/public-page-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SectionManagerProps = {
  value: EditableProjectSection[];
  onChange: (value: EditableProjectSection[]) => void;
};

export function SectionManager({ value, onChange }: SectionManagerProps) {
  const update = (sectionKey: string, patch: Partial<EditableProjectSection>) => {
    onChange(value.map((section) => (section.section_key === sectionKey ? { ...section, ...patch } : section)));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">内容模块管理</h2>
        <p className="mt-2 text-sm text-zinc-500">编辑公开页模块标题、内容、显示状态和排序。</p>
      </div>
      <div className="space-y-4">
        {value
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((section) => (
            <div key={section.section_key} className="rounded-[24px] border border-white/70 bg-white/45 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-zinc-600">
                  <input
                    type="checkbox"
                    checked={section.is_visible}
                    onChange={(event) => update(section.section_key, { is_visible: event.target.checked })}
                    className="size-4 accent-teal-700"
                  />
                  显示模块
                </label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onChange(moveSection(value, section.section_key, "up"))} aria-label="上移">
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onChange(moveSection(value, section.section_key, "down"))} aria-label="下移">
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
              </div>
              <Input value={section.title} onChange={(event) => update(section.section_key, { title: event.target.value })} placeholder="模块标题" />
              <Textarea className="mt-3" value={section.content} onChange={(event) => update(section.section_key, { content: event.target.value })} placeholder="模块内容" />
            </div>
          ))}
      </div>
    </div>
  );
}
