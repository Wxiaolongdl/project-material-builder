import type { ImprovementSuggestionRow } from "@/types/database";
import type { ChartDatum } from "@/lib/usage-insights";
import { Card } from "@/components/ui/card";

type InsightMetrics = {
  todayFeedback: number;
  todayErrors: number;
  unsatisfied: number;
  exportFailures: number;
  frequentType: string;
  highPrioritySuggestions: number;
};

type UsageCharts = {
  totalVisits: number;
  topicBars: ChartDatum[];
  purposePie: ChartDatum[];
  materialPie: ChartDatum[];
  hourBars: ChartDatum[];
};

export function InsightDashboard({
  metrics,
  suggestions,
  usageCharts,
}: {
  metrics: InsightMetrics;
  suggestions: ImprovementSuggestionRow[];
  usageCharts: UsageCharts;
}) {
  const cards = [
    ["今日反馈数", metrics.todayFeedback],
    ["今日错误数", metrics.todayErrors],
    ["不满意生成次数", metrics.unsatisfied],
    ["导出失败次数", metrics.exportFailures],
    ["匿名访问量", usageCharts.totalVisits],
    ["高优先级建议", metrics.highPrioritySuggestions],
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart title="用户大概使用主题" data={usageCharts.topicBars} />
        <PieLikeChart title="用户使用目的" data={usageCharts.purposePie} />
        <PieLikeChart title="材料类型意图" data={usageCharts.materialPie} />
        <BarChart title="使用时间段" data={usageCharts.hourBars} compact />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">高优先级建议</h2>
        <div className="mt-4 space-y-3">
          {suggestions
            .filter((item) => item.priority === "high")
            .slice(0, 5)
            .map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/60 p-4 text-sm">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-zinc-500">{item.summary}</p>
              </div>
            ))}
          {suggestions.filter((item) => item.priority === "high").length === 0 && (
            <p className="text-sm text-zinc-500">暂无高优先级建议。</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function BarChart({ title, data, compact = false }: { title: string; data: ChartDatum[]; compact?: boolean }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-5 space-y-3">
        {data.slice(0, compact ? 8 : 6).map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/70">
              <div className="h-full rounded-full bg-teal-500/70" style={{ width: `${Math.max((item.value / max) * 100, 6)}%` }} />
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-zinc-500">暂无匿名使用画像数据。</p>}
      </div>
    </Card>
  );
}

function PieLikeChart({ title, data }: { title: string; data: ChartDatum[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const palette = ["rgba(20,184,166,0.72)", "rgba(6,182,212,0.62)", "rgba(16,185,129,0.56)", "rgba(56,189,248,0.62)", "rgba(161,161,170,0.5)"];
  const segments = data.slice(0, 5);
  let cursor = 0;
  const gradient =
    segments.length > 0
      ? segments
          .map((item, index) => {
            const start = cursor;
            const end = cursor + (item.value / total) * 100;
            cursor = end;
            return `${palette[index % palette.length]} ${start}% ${end}%`;
          })
          .join(", ")
      : "rgba(228,228,231,0.7) 0% 100%";

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-center">
        <div className="mx-auto size-32 rounded-full shadow-inner ring-8 ring-white/60" style={{ background: `conic-gradient(${gradient})` }} />
        <div className="space-y-3">
          {segments.map((item, index) => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <span className="size-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
              <span className="min-w-0 flex-1 truncate text-zinc-700">{item.label}</span>
              <span className="text-zinc-500">{Math.round((item.value / total) * 100)}%</span>
              <span className="w-8 text-right text-zinc-400">{item.value}</span>
            </div>
          ))}
          {data.length === 0 && <p className="text-sm text-zinc-500">暂无匿名使用画像数据。</p>}
        </div>
      </div>
    </Card>
  );
}
