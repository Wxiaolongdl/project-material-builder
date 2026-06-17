"use client";

import { useMemo, useState } from "react";
import type { ImprovementSuggestionRow } from "@/types/database";
import { buildCodexRepairPrompt } from "@/lib/codex-repair-prompt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type SuggestionCardProps = {
  suggestion: ImprovementSuggestionRow;
  onDecision: (suggestion: ImprovementSuggestionRow, status: ImprovementSuggestionRow["status"], note: string) => void;
};

export function SuggestionCard({ suggestion, onDecision }: SuggestionCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [copied, setCopied] = useState(false);
  const codexPrompt = useMemo(() => buildCodexRepairPrompt(suggestion), [suggestion]);
  const canAutoApply = suggestion.risk_level === "L1" || suggestion.risk_level === "L2";

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(codexPrompt);
    setCopied(true);
  };

  const handoffToCodex = () => {
    onDecision(suggestion, "task_created", adminNote.trim() || "已转交 Codex 修复。");
  };

  const applyLowRiskSuggestion = () => {
    if (!canAutoApply) return;
    onDecision(suggestion, "accepted", adminNote.trim() || `${suggestion.risk_level} 低风险建议已由管理员确认一键应用。`);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700">{suggestion.priority}</span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-zinc-600">风险：{suggestion.risk_level}</span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-zinc-600">{riskPolicyText(suggestion.risk_level)}</span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-zinc-600">{suggestion.status}</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{suggestion.title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{suggestion.summary}</p>
          <p className="mt-3 text-sm text-zinc-500">影响功能：{suggestion.affected_feature}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">建议动作：{suggestion.suggested_action}</p>
        </div>
        <div className="flex min-w-[260px] flex-wrap gap-2 lg:justify-end">
          <Button size="sm" onClick={() => onDecision(suggestion, "accepted", "接受建议，进入人工确认流程。")}>
            接受建议
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDecision(suggestion, "deferred", "暂不处理。")}>
            暂不处理
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDecision(suggestion, "resolved", "已解决。")}>
            标记为已解决
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDecision(suggestion, "task_created", "已创建修复任务。")}>
            创建修复任务
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowPrompt((value) => !value)}>
            生成 Codex 修复指令
          </Button>
          {canAutoApply ? (
            <Button size="sm" onClick={applyLowRiskSuggestion}>
              一键应用低风险建议
            </Button>
          ) : (
            <span className="rounded-full bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {suggestion.risk_level} 仅允许生成修复建议
            </span>
          )}
        </div>
      </div>

      {showPrompt && (
        <div className="mt-5 rounded-[24px] border border-white/70 bg-white/55 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Codex 修复指令</h3>
              <p className="mt-1 text-xs text-zinc-500">复制后可直接发给 Codex。系统只生成指令，不会自动修改代码或部署。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={copyPrompt}>
                {copied ? "已复制" : "复制"}
              </Button>
              <Button size="sm" onClick={handoffToCodex}>
                标记为已转交 Codex
              </Button>
            </div>
          </div>
          <Textarea className="mt-4 min-h-[360px] font-mono text-xs" value={codexPrompt} readOnly />
          <Textarea
            className="mt-3 min-h-24"
            value={adminNote}
            onChange={(event) => setAdminNote(event.target.value)}
            placeholder="添加管理员备注，例如：优先修复移动端复现路径，保留现有导出 API。"
          />
        </div>
      )}
    </Card>
  );
}

function riskPolicyText(riskLevel: ImprovementSuggestionRow["risk_level"]) {
  if (riskLevel === "L1" || riskLevel === "L2") return "可确认后一键应用";
  return "仅建议，不自动修改";
}
