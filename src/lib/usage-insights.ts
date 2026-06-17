type UsageInsightEvent = {
  event_type: string;
  material_type?: string | null;
  created_at: string;
  metadata?: Record<string, unknown> | null;
};

export type ChartDatum = {
  label: string;
  value: number;
};

export function buildUsageInsightCharts(events: UsageInsightEvent[]) {
  const usageEvents = events.filter((event) => event.event_type === "usage_profile");

  return {
    totalVisits: usageEvents.length,
    topicBars: countBy(usageEvents, (event) => readMetadataString(event, "topic")),
    purposePie: countBy(usageEvents, (event) => readMetadataString(event, "purpose")),
    materialPie: countBy(usageEvents, (event) => event.material_type || "未分类"),
    hourBars: countBy(usageEvents, (event) => readMetadataString(event, "hour_bucket", hourFromCreatedAt(event.created_at))),
  };
}

export function inferUsagePurpose(projectType: string) {
  if (/创新|创业|路演|比赛/.test(projectType)) return "创新创业 / 比赛路演";
  if (/竞选|答辩/.test(projectType)) return "竞选答辩";
  if (/实验|课程|报告/.test(projectType)) return "课程报告";
  if (/社会实践|实践|调研/.test(projectType)) return "社会实践 / 项目申报";
  if (/活动|策划/.test(projectType)) return "活动策划";
  return "项目材料制作";
}

export function inferMaterialIntent(projectType: string) {
  if (/PPT|答辩|路演|竞选/.test(projectType)) return "ppt_outline";
  if (/申报|创新|创业/.test(projectType)) return "proposal";
  if (/新闻|宣传|公众号/.test(projectType)) return "publicity";
  if (/实验|报告/.test(projectType)) return "report";
  return "planning_doc";
}

function countBy(events: UsageInsightEvent[], selector: (event: UsageInsightEvent) => string): ChartDatum[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    const key = selector(event) || "未分类";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "zh-CN"));
}

function readMetadataString(event: UsageInsightEvent, key: string, fallback = "未分类") {
  const value = event.metadata?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function hourFromCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "未分类";
  return `${String(date.getHours()).padStart(2, "0")}:00`;
}
