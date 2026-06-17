"use client";

import { useMemo, useState } from "react";
import type { ErrorLogRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ErrorLogTable({ rows }: { rows: ErrorLogRow[] }) {
  const [severity, setSeverity] = useState("");
  const [feature, setFeature] = useState("");
  const [route, setRoute] = useState("");
  const [repeatedOnly, setRepeatedOnly] = useState(false);

  const repeatedKeys = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((row) => {
      const key = `${row.feature_key}::${row.error_message_sanitized}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const repeated = (repeatedKeys.get(`${row.feature_key}::${row.error_message_sanitized}`) ?? 0) > 1;
        return (
          (!severity || row.severity === severity) &&
          (!feature.trim() || row.feature_key.toLowerCase().includes(feature.trim().toLowerCase())) &&
          (!route.trim() || row.route.toLowerCase().includes(route.trim().toLowerCase())) &&
          (!repeatedOnly || repeated)
        );
      }),
    [feature, repeatedKeys, repeatedOnly, route, rows, severity],
  );

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-white/70 p-5">
        <h2 className="text-lg font-semibold">错误日志列表</h2>
        <p className="mt-1 text-sm text-zinc-500">日志只保存脱敏摘要、功能模块、路由和浏览器大致信息。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="h-12 rounded-[18px] border border-white/75 bg-white/70 px-4 text-sm outline-none">
            <option value="">全部严重程度</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <Input value={feature} onChange={(event) => setFeature(event.target.value)} placeholder="筛选功能模块" />
          <Input value={route} onChange={(event) => setRoute(event.target.value)} placeholder="筛选页面路由" />
          <label className="flex h-12 items-center gap-2 rounded-[18px] border border-white/75 bg-white/70 px-4 text-sm text-zinc-600">
            <input type="checkbox" checked={repeatedOnly} onChange={(event) => setRepeatedOnly(event.target.checked)} />
            仅看重复错误
          </label>
        </div>
      </div>
      <div className="divide-y divide-white/70">
        {filteredRows.map((row) => (
          <div key={row.id} className="grid gap-3 p-5 text-sm md:grid-cols-[130px_160px_minmax(0,1fr)_120px]">
            <div>
              <p className="font-medium">{row.severity}</p>
              <p className="text-xs text-zinc-500">{new Date(row.created_at).toLocaleString("zh-CN", { hour12: false })}</p>
            </div>
            <div className="text-zinc-600">
              <p>{row.feature_key}</p>
              <p className="text-xs">{row.route}</p>
            </div>
            <p className="break-words text-zinc-700">{row.error_message_sanitized}</p>
            <span className="h-fit rounded-full bg-white/70 px-3 py-1 text-center text-xs text-zinc-600">{row.status}</span>
          </div>
        ))}
        {filteredRows.length === 0 && <p className="p-8 text-sm text-zinc-500">暂无符合筛选条件的错误日志。</p>}
      </div>
    </Card>
  );
}
