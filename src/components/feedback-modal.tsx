"use client";

import { useState } from "react";
import { submitUserFeedback } from "@/lib/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FEEDBACK_TYPES = ["生成内容不满意", "导出失败", "页面显示异常", "功能无法使用", "建议优化", "其他"];

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
  projectId?: string | null;
  excerpt?: string;
};

export function FeedbackModal({ open, onClose, projectId, excerpt = "" }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState(FEEDBACK_TYPES[0]);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [allowExcerpt, setAllowExcerpt] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!open) return null;

  const submit = async () => {
    const result = await submitUserFeedback({
      projectId,
      feedbackType,
      message,
      contactOptional: contact,
      submittedExcerpt: excerpt.slice(0, 500),
      allowExcerptForImprovement: allowExcerpt,
    });
    setNotice(result.message);
    if (result.ok) {
      setMessage("");
      setContact("");
      setAllowExcerpt(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/20 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">反馈问题</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">匿名提交问题描述，帮助我们改进生成质量和功能稳定性。</p>
          </div>
          <button className="rounded-full px-3 py-1 text-sm text-zinc-500 hover:bg-zinc-100" onClick={onClose}>
            关闭
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <select
            value={feedbackType}
            onChange={(event) => setFeedbackType(event.target.value)}
            className="h-12 w-full rounded-[18px] border border-white/75 bg-white/70 px-4 text-sm outline-none"
          >
            {FEEDBACK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="请描述你遇到的问题或建议" />
          <Input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="联系方式，可选" />
          <label className="flex gap-3 rounded-2xl bg-white/60 p-4 text-sm leading-6 text-zinc-600">
            <input type="checkbox" checked={allowExcerpt} onChange={(event) => setAllowExcerpt(event.target.checked)} />
            允许提交当前生成结果片段用于改进，默认不提交完整材料内容。
          </label>
          <p className="text-xs leading-5 text-zinc-500">
            本系统仅收集匿名使用反馈、功能错误和用户主动提交的问题描述，用于改进生成质量和修复功能问题。系统不会收集身份证、学号、精确位置、密钥或用户未授权提交的完整文件内容。
          </p>
          <Button className="w-full" onClick={submit} disabled={!message.trim()}>
            提交反馈
          </Button>
          {notice && <p className="text-sm text-teal-700">{notice}</p>}
        </div>
      </div>
    </div>
  );
}
