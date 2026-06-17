"use client";

import { useMemo, useState } from "react";
import type { UserFeedbackRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FeedbackTable({ rows }: { rows: UserFeedbackRow[] }) {
  const [typeFilter, setTypeFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const text = `${row.project_id ?? ""} ${row.feedback_type} ${row.message} ${row.reason_tags.join(" ")}`.toLowerCase();
        return (
          (!typeFilter || row.feedback_type === typeFilter) &&
          (!ratingFilter || row.rating === ratingFilter) &&
          (!statusFilter || row.status === statusFilter) &&
          (!query.trim() || text.includes(query.trim().toLowerCase()))
        );
      }),
    [query, ratingFilter, rows, statusFilter, typeFilter],
  );

  const types = Array.from(new Set(rows.map((row) => row.feedback_type).filter(Boolean)));

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-white/70 p-5">
        <h2 className="text-lg font-semibold">用户反馈列表</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目、描述或标签" />
          <Select value={typeFilter} onChange={setTypeFilter} options={types} placeholder="全部问题类型" />
          <Select
            value={ratingFilter}
            onChange={setRatingFilter}
            options={["satisfied", "neutral", "unsatisfied"]}
            labels={{ satisfied: "满意", neutral: "一般", unsatisfied: "不满意" }}
            placeholder="全部评分"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={["open", "reviewed", "converted", "resolved", "ignored"]}
            labels={{ open: "未处理", reviewed: "已查看", converted: "已转建议", resolved: "已解决", ignored: "已忽略" }}
            placeholder="全部状态"
          />
        </div>
      </div>
      <div className="divide-y divide-white/70">
        {filteredRows.map((row) => (
          <div key={row.id} className="grid gap-3 p-5 text-sm md:grid-cols-[180px_140px_minmax(0,1fr)_120px]">
            <div>
              <p className="font-medium">{row.feedback_type}</p>
              <p className="text-xs text-zinc-500">{new Date(row.created_at).toLocaleString("zh-CN", { hour12: false })}</p>
            </div>
            <p className="text-zinc-600">{ratingLabel(row.rating)}</p>
            <div>
              <p className="text-zinc-700">{row.message}</p>
              {row.reason_tags.length > 0 && <p className="mt-1 text-xs text-teal-700">{row.reason_tags.join(" / ")}</p>}
            </div>
            <span className="h-fit rounded-full bg-white/70 px-3 py-1 text-center text-xs text-zinc-600">{statusLabel(row.status)}</span>
          </div>
        ))}
        {filteredRows.length === 0 && <p className="p-8 text-sm text-zinc-500">暂无符合筛选条件的反馈。</p>}
      </div>
    </Card>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  labels = {},
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  labels?: Record<string, string>;
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-[18px] border border-white/75 bg-white/70 px-4 text-sm outline-none">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option] ?? option}
        </option>
      ))}
    </select>
  );
}

function ratingLabel(rating: UserFeedbackRow["rating"]) {
  if (rating === "satisfied") return "满意";
  if (rating === "neutral") return "一般";
  if (rating === "unsatisfied") return "不满意";
  return "未评分";
}

function statusLabel(status: UserFeedbackRow["status"]) {
  return { open: "未处理", reviewed: "已查看", converted: "已转建议", resolved: "已解决", ignored: "已忽略" }[status];
}
