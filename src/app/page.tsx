import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f8f6] px-5 py-8 text-zinc-950 sm:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(187,247,208,0.42),transparent_34%),radial-gradient(circle_at_86%_16%,rgba(153,246,228,0.32),transparent_30%),linear-gradient(180deg,#fbfdfb_0%,#eef5f2_100%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/58 px-4 py-2 text-sm text-teal-800 shadow-sm backdrop-blur-2xl">
            <Sparkles className="size-4" />
            双入口模式
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
            ProjectMaterialBuilder
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            同一套 Next.js 项目中提供用户端公开展示入口和管理者后台入口。公开页只读，管理端负责内容、材料、模板、主题和布局配置。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin">
                进入管理后台
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/p/project-material-builder">查看用户端示例</Link>
            </Button>
          </div>
        </section>
        <Card className="p-7">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <ShieldCheck className="size-5" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">路由入口</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-zinc-600">
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="font-medium text-zinc-950">用户端</p>
              <p>/p/[slug]，只读展示，支持复制和下载公开材料。</p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="font-medium text-zinc-950">管理端</p>
              <p>/admin 和 /admin/projects/[id]，登录后管理项目内容并同步公开页。</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
