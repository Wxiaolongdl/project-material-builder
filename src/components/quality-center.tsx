"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb, RefreshCcw } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { ErrorLogRow, ImprovementSuggestionRow, UsageEventRow, UserFeedbackRow } from "@/types/database";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { generateRuleBasedSuggestions } from "@/lib/improvement-engine";
import { buildUsageInsightCharts } from "@/lib/usage-insights";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InsightDashboard } from "@/components/insight-dashboard";
import { FeedbackTable } from "@/components/feedback-table";
import { ErrorLogTable } from "@/components/error-log-table";
import { SuggestionCard } from "@/components/suggestion-card";

type QualityCenterProps = {
  view: "insights" | "feedback" | "errors" | "suggestions";
};

export function QualityCenter({ view }: QualityCenterProps) {
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<UserFeedbackRow[]>([]);
  const [errors, setErrors] = useState<ErrorLogRow[]>([]);
  const [events, setEvents] = useState<UsageEventRow[]>([]);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestionRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    if (!supabase) return;
    const [{ data: feedbackData }, { data: errorData }, { data: eventData }, { data: suggestionData }] = await Promise.all([
      supabase.from("user_feedback").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("error_logs").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("usage_events").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("improvement_suggestions").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setFeedback((feedbackData ?? []) as UserFeedbackRow[]);
    setErrors((errorData ?? []) as ErrorLogRow[]);
    setEvents((eventData ?? []) as UsageEventRow[]);
    setSuggestions((suggestionData ?? []) as ImprovementSuggestionRow[]);
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) void load();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) void load();
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const metrics = useMemo(() => createMetrics(feedback, errors, events, suggestions), [feedback, errors, events, suggestions]);
  const usageCharts = useMemo(() => buildUsageInsightCharts(events), [events]);

  const generateSuggestions = async () => {
    if (!supabase) return;
    const drafts = generateRuleBasedSuggestions({
      feedback: feedback.map((item) => ({
        feedback_type: item.feedback_type,
        rating: item.rating,
        reason_tags: item.reason_tags,
        material_type: item.material_type ?? "",
        message: item.message,
      })),
      errors,
      events,
    });

    if (drafts.length === 0) {
      setNotice("暂无符合规则的新增改进建议。");
      return;
    }

    const { error } = await supabase.from("improvement_suggestions").insert(
      drafts.map((draft) => ({
        ...draft,
        project_id: null,
        status: "open",
        admin_decision: "",
      })),
    );
    setNotice(error ? "生成建议失败，请检查权限。" : `已生成 ${drafts.length} 条规则建议。`);
    if (!error) void load();
  };

  const updateSuggestion = async (suggestion: ImprovementSuggestionRow, status: ImprovementSuggestionRow["status"], note: string) => {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("improvement_suggestions")
      .update({ status, admin_decision: note })
      .eq("id", suggestion.id);
    if (!error) {
      await supabase.from("admin_action_logs").insert({
        admin_user_id: user.id,
        action_type: status,
        target_table: "improvement_suggestions",
        target_id: suggestion.id,
        note,
      });
      await load();
    }
    setNotice(error ? "操作失败，请检查权限。" : "管理员决策已记录。");
  };

  if (!isSupabaseConfigured) {
    return <QualityShell>请先配置 Supabase 环境变量。</QualityShell>;
  }

  if (!user) {
    return (
      <QualityShell>
        <Card className="mx-auto max-w-md p-8">
          <h1 className="text-2xl font-semibold">需要管理员登录</h1>
          <p className="mt-3 text-sm text-zinc-500">请先进入 /admin 登录后再查看质量改进中心。</p>
          <Button className="mt-6" asChild>
            <Link href="/admin">前往登录</Link>
          </Button>
        </Card>
      </QualityShell>
    );
  }

  return (
    <QualityShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="size-4" />
                返回项目后台
              </Link>
            </Button>
            <p className="mt-6 text-sm text-teal-700">Quality Improvement Center</p>
            <h1 className="mt-2 text-4xl font-semibold">质量改进中心</h1>
            <p className="mt-3 text-sm text-zinc-500">匿名反馈、脱敏错误日志和规则改进建议集中查看。建议不会自动修改代码或部署。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void load()}>
              <RefreshCcw className="size-4" />
              刷新
            </Button>
            <Button onClick={generateSuggestions}>
              <Lightbulb className="size-4" />
              生成规则建议
            </Button>
          </div>
        </div>

        <nav className="mb-6 flex flex-wrap gap-2">
          <Tab href="/admin/insights" active={view === "insights"}>问题总览</Tab>
          <Tab href="/admin/feedback" active={view === "feedback"}>用户反馈</Tab>
          <Tab href="/admin/errors" active={view === "errors"}>错误日志</Tab>
          <Tab href="/admin/suggestions" active={view === "suggestions"}>改进建议</Tab>
        </nav>

        {notice && <p className="mb-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-teal-700 shadow-sm">{notice}</p>}

        {view === "insights" && <InsightDashboard metrics={metrics} suggestions={suggestions} usageCharts={usageCharts} />}
        {view === "feedback" && <FeedbackTable rows={feedback} />}
        {view === "errors" && <ErrorLogTable rows={errors} />}
        {view === "suggestions" && (
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} onDecision={updateSuggestion} />
            ))}
            {suggestions.length === 0 && <Card className="p-8 text-sm text-zinc-500">暂无建议，点击“生成规则建议”进行本地分析。</Card>}
          </div>
        )}
      </div>
    </QualityShell>
  );
}

function createMetrics(feedback: UserFeedbackRow[], errors: ErrorLogRow[], events: UsageEventRow[], suggestions: ImprovementSuggestionRow[]) {
  const today = new Date().toDateString();
  const isToday = (date: string) => new Date(date).toDateString() === today;
  const typeCounts = feedback.reduce<Record<string, number>>((acc, item) => {
    acc[item.feedback_type] = (acc[item.feedback_type] ?? 0) + 1;
    return acc;
  }, {});
  const frequentType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "暂无";

  return {
    todayFeedback: feedback.filter((item) => isToday(item.created_at)).length,
    todayErrors: errors.filter((item) => isToday(item.created_at)).length,
    unsatisfied: feedback.filter((item) => item.rating === "unsatisfied").length,
    exportFailures: events.filter((item) => item.event_type === "export" && item.metadata?.success === false).length,
    frequentType,
    highPrioritySuggestions: suggestions.filter((item) => item.priority === "high" && item.status === "open").length,
  };
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm transition ${active ? "bg-zinc-950 text-white shadow-lg" : "bg-white/65 text-zinc-600 hover:bg-white"}`}
    >
      {children}
    </Link>
  );
}

function QualityShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f5f8f6] px-5 py-8 text-zinc-950 sm:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_8%,rgba(187,247,208,0.42),transparent_32%),linear-gradient(180deg,#fbfdfb_0%,#eef5f2_100%)]" />
      {children}
    </main>
  );
}
