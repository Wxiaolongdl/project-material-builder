"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { WordExportType } from "@/lib/word-export";
import { wordExportTypes } from "@/lib/word-export";
import { Textarea } from "@/components/ui/textarea";

type MarkdownPreviewProps = {
  markdown: string;
  onExport: () => void;
  onWordExport: () => void;
  wordExportType: WordExportType;
  onWordExportTypeChange: (type: WordExportType) => void;
  editable?: boolean;
  onMarkdownChange?: (markdown: string) => void;
};

export function MarkdownPreview({
  markdown,
  onExport,
  onWordExport,
  wordExportType,
  onWordExportTypeChange,
  editable = false,
  onMarkdownChange,
}: MarkdownPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="sticky top-28 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/65 bg-white/30 p-5 backdrop-blur-xl">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">实时 Markdown 预览</h2>
          <p className="mt-1 text-xs text-zinc-500">根据左侧输入自动更新</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={copyMarkdown} aria-label="复制 Markdown">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
          <Button variant="default" size="icon" onClick={onExport} aria-label="导出 Markdown">
            <Download className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b border-white/55 bg-white/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={wordExportType}
          onChange={(event) => onWordExportTypeChange(event.target.value as WordExportType)}
          className="h-11 rounded-full border border-white/75 bg-white/65 px-4 text-sm text-zinc-800 shadow-[0_10px_28px_rgba(15,23,42,0.05)] outline-none backdrop-blur-xl transition focus:ring-4 focus:ring-teal-700/[0.06]"
          aria-label="选择 Word 导出内容"
        >
          {wordExportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={onWordExport}>
          <Download className="size-4" />
          导出 Word
        </Button>
      </div>
      {editable ? (
        <div className="bg-white/24 p-5 sm:p-6">
          <Textarea
            value={markdown}
            onChange={(event) => onMarkdownChange?.(event.target.value)}
            className="min-h-[520px] border-white/60 bg-white/60 font-mono text-sm leading-7"
            aria-label="编辑 AI 生成内容"
          />
        </div>
      ) : (
        <pre className="max-h-[calc(100vh-11rem)] overflow-auto whitespace-pre-wrap break-words bg-white/24 p-6 text-sm leading-7 text-zinc-700 sm:p-7">
          {markdown}
        </pre>
      )}
    </Card>
  );
}
