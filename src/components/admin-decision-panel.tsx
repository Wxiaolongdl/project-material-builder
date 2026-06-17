"use client";

import { ClipboardCopy } from "lucide-react";
import type { ImprovementSuggestionRow } from "@/types/database";
import { Button } from "@/components/ui/button";

export function CopyForCodexButton({ suggestion }: { suggestion: ImprovementSuggestionRow }) {
  const copy = async () => {
    await navigator.clipboard.writeText(
      `请根据以下质量改进建议修复 ProjectMaterialBuilder：\n\n标题：${suggestion.title}\n影响功能：${suggestion.affected_feature}\n优先级：${suggestion.priority}\n风险等级：${suggestion.risk_level}\n问题摘要：${suggestion.summary}\n建议动作：${suggestion.suggested_action}\n证据：${JSON.stringify(suggestion.evidence, null, 2)}\n\n要求：先分析原因，再修改代码，最后运行 lint 和 build。`,
    );
  };

  return (
    <Button variant="secondary" size="sm" onClick={copy}>
      <ClipboardCopy className="size-4" />
      复制给 Codex 修复
    </Button>
  );
}
