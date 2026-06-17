"use client";

import { useState } from "react";
import { submitUserFeedback } from "@/lib/feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const REASONS = ["内容太空泛", "格式不符合要求", "逻辑不清晰", "语言不正式", "PPT 大纲不好用", "Word / Markdown / PPT 导出有问题", "其他"];

type RatingPanelProps = {
  projectId?: string | null;
  materialType: string;
  excerpt?: string;
};

export function RatingPanel({ projectId, materialType, excerpt = "" }: RatingPanelProps) {
  const [rating, setRating] = useState<"satisfied" | "neutral" | "unsatisfied" | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (nextRating = rating) => {
    if (!nextRating) return;
    const result = await submitUserFeedback({
      projectId,
      feedbackType: "生成结果评价",
      rating: nextRating,
      reasonTags: reasons,
      message: message || (nextRating === "satisfied" ? "满意" : "未填写补充说明"),
      materialType,
      submittedExcerpt: excerpt.slice(0, 500),
      allowExcerptForImprovement: false,
    });
    setNotice(result.message);
  };

  const chooseRating = (nextRating: "satisfied" | "neutral" | "unsatisfied") => {
    setRating(nextRating);
    if (nextRating === "satisfied") void submit(nextRating);
  };

  return (
    <div className="rounded-[24px] border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-zinc-700">生成结果是否有帮助？</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={rating === "satisfied" ? "default" : "secondary"} onClick={() => chooseRating("satisfied")}>
            满意
          </Button>
          <Button size="sm" variant={rating === "neutral" ? "default" : "secondary"} onClick={() => chooseRating("neutral")}>
            一般
          </Button>
          <Button size="sm" variant={rating === "unsatisfied" ? "default" : "secondary"} onClick={() => chooseRating("unsatisfied")}>
            不满意
          </Button>
        </div>
      </div>
      {(rating === "neutral" || rating === "unsatisfied") && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {REASONS.map((reason) => (
              <button
                key={reason}
                className={`rounded-full px-3 py-1 text-xs ${reasons.includes(reason) ? "bg-teal-700 text-white" : "bg-white/70 text-zinc-600"}`}
                onClick={() => setReasons((current) => (current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]))}
              >
                {reason}
              </button>
            ))}
          </div>
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="可补充说明问题" />
          <Button size="sm" onClick={() => submit()}>
            提交评价
          </Button>
        </div>
      )}
      {notice && <p className="mt-3 text-sm text-teal-700">{notice}</p>}
    </div>
  );
}
