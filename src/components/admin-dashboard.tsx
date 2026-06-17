"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Copy, ExternalLink, LogIn, Pencil, Plus, ShieldCheck } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { createSlugFromTitle } from "@/lib/slug";
import type { ProjectRow } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("未命名项目");
  const [notice, setNotice] = useState<string | null>(null);
  const supabase = createBrowserSupabaseClient();

  const loadProjects = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
    setProjects((data ?? []) as ProjectRow[]);
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) void loadProjects();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) void loadProjects();
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const getPublicUrl = (slug: string) => {
    if (typeof window === "undefined") return `/p/${slug}`;
    return `${window.location.origin}/p/${slug}`;
  };

  const login = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setNotice(error ? "登录失败，请检查邮箱、密码或 Supabase Auth 配置。" : "登录成功。");
  };

  const copyPublicLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(getPublicUrl(slug));
      setNotice("用户端公开链接已复制。");
    } catch {
      setNotice("复制失败，请手动复制公开链接。");
    }
  };

  const createProject = async () => {
    if (!supabase) return;
    const title = newProjectTitle.trim() || "未命名项目";
    const slug = `${createSlugFromTitle(title)}-${Date.now().toString(36)}`;
    const { data, error } = await supabase
      .from("projects")
      .insert({
        slug,
        title,
        team_name: "待补充团队",
        project_type: "大学生暑期社会实践",
        status: "draft",
      })
      .select("*")
      .single();

    if (error || !data) {
      const isDuplicate = error?.code === "23505" || error?.message.toLowerCase().includes("duplicate");
      setNotice(isDuplicate ? "slug 已存在，请修改项目名称后重试。" : "创建失败，请检查数据库权限。");
      return;
    }

    window.location.href = `/admin/projects/${(data as ProjectRow).id}`;
  };

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <Card className="mx-auto max-w-2xl p-8">
          <h1 className="text-2xl font-semibold">需要配置 Supabase</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            请在 `.env.local` 中配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`，并执行
            `supabase/schema.sql`。
          </p>
        </Card>
      </AdminShell>
    );
  }

  if (!user) {
    return (
      <AdminShell>
        <Card className="mx-auto max-w-md p-8">
          <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="text-2xl font-semibold">管理员登录</h1>
          <p className="mt-2 text-sm text-zinc-500">使用 Supabase Auth 管理员账号登录后台。</p>
          <div className="mt-6 space-y-4">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="邮箱" />
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="密码" />
            <Button className="w-full" onClick={login}>
              <LogIn className="size-4" />
              登录
            </Button>
          </div>
          {notice && <p className="mt-4 text-sm text-zinc-500">{notice}</p>}
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-teal-700">Admin Workspace</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">管理者后台</h1>
            <p className="mt-3 text-sm text-zinc-500">管理项目内容、生成材料、主题配置和公开链接。</p>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-[24px] border border-white/70 bg-white/60 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:w-auto md:min-w-[420px] md:flex-row">
            <Input
              value={newProjectTitle}
              onChange={(event) => setNewProjectTitle(event.target.value)}
              placeholder="新项目名称"
            />
            <Button onClick={createProject} className="shrink-0">
              <Plus className="size-4" />
              新建项目
            </Button>
          </div>
        </div>

        <Card className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">质量改进中心</h2>
            <p className="mt-1 text-sm text-zinc-500">查看匿名反馈、脱敏错误日志，并生成本地规则改进建议。</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/admin/insights">
              <BarChart3 className="size-4" />
              打开质量看板
            </Link>
          </Button>
        </Card>

        {notice && <p className="mb-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-teal-700 shadow-sm">{notice}</p>}

        <div className="grid gap-4">
          {projects.map((project) => {
            const publicPath = `/p/${project.slug}`;
            const publicUrl = getPublicUrl(project.slug);
            const updatedAt = project.updated_at
              ? new Date(project.updated_at).toLocaleString("zh-CN", { hour12: false })
              : "暂无记录";

            return (
              <Card key={project.id} className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">{project.title}</h2>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700">
                        {project.status === "published" ? "已发布" : "草稿"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-zinc-500 sm:grid-cols-2">
                      <p>
                        <span className="text-zinc-400">slug：</span>
                        <span className="font-medium text-zinc-700">{project.slug}</span>
                      </p>
                      <p>
                        <span className="text-zinc-400">最近更新：</span>
                        {updatedAt}
                      </p>
                      <p className="break-all sm:col-span-2">
                        <span className="text-zinc-400">用户端公开链接：</span>
                        <span className="font-medium text-zinc-700">{publicUrl}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => copyPublicLink(project.slug)}>
                      <Copy className="size-4" />
                      复制用户端链接
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link href={publicPath}>
                        <ExternalLink className="size-4" />
                        打开用户端页面
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/admin/projects/${project.id}`}>
                        <Pencil className="size-4" />
                        进入管理编辑
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {projects.length === 0 && <Card className="p-8 text-sm text-zinc-500">暂无项目，输入项目名称后点击“新建项目”开始。</Card>}
        </div>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f5f8f6] px-5 py-8 text-zinc-950 sm:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_8%,rgba(187,247,208,0.42),transparent_32%),linear-gradient(180deg,#fbfdfb_0%,#eef5f2_100%)]" />
      {children}
    </main>
  );
}
