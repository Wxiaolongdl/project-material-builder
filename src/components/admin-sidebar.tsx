"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const items = ["基础信息", "成员管理", "内容模块", "页面布置", "主题设置", "PPT 策划器"];

export function AdminSidebar() {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <Card className="p-5">
        <Button variant="ghost" asChild className="mb-4 w-full justify-start">
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            返回项目列表
          </Link>
        </Button>
        <nav className="space-y-2 text-sm text-zinc-600">
          {items.map((item) => (
            <a key={item} className="block rounded-2xl px-3 py-2 hover:bg-white/60" href={`#${item}`}>
              {item}
            </a>
          ))}
        </nav>
      </Card>
    </aside>
  );
}
