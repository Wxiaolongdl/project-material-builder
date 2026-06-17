"use client";

import type { PublicThemeConfig } from "@/types/public-config";
import { Input } from "@/components/ui/input";

type ThemeSettingsProps = {
  value: PublicThemeConfig;
  onChange: (value: PublicThemeConfig) => void;
};

export function ThemeSettings({ value, onChange }: ThemeSettingsProps) {
  const update = <K extends keyof PublicThemeConfig>(key: K, nextValue: PublicThemeConfig[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">主题设置</h2>
        <p className="mt-2 text-sm text-zinc-500">配置公开页主题色、背景、圆角、玻璃效果和动效强度。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input value={value.primary_color} onChange={(event) => update("primary_color", event.target.value)} placeholder="primary_color" />
        <Input value={value.secondary_color} onChange={(event) => update("secondary_color", event.target.value)} placeholder="secondary_color" />
        <select value={value.background_style} onChange={(event) => update("background_style", event.target.value as PublicThemeConfig["background_style"])} className="h-12 rounded-[18px] border border-white/75 bg-white/62 px-4 text-sm">
          <option value="soft-green">soft-green</option>
          <option value="clean-white">clean-white</option>
          <option value="mist-blue">mist-blue</option>
        </select>
        <select value={value.animation_level} onChange={(event) => update("animation_level", event.target.value as PublicThemeConfig["animation_level"])} className="h-12 rounded-[18px] border border-white/75 bg-white/62 px-4 text-sm">
          <option value="none">none</option>
          <option value="subtle">subtle</option>
          <option value="rich">rich</option>
        </select>
        <Input type="number" value={value.card_radius} onChange={(event) => update("card_radius", Number(event.target.value))} placeholder="card_radius" />
        <label className="flex h-12 items-center justify-between rounded-[18px] border border-white/75 bg-white/62 px-4 text-sm text-zinc-700">
          glass_effect
          <input type="checkbox" checked={value.glass_effect} onChange={(event) => update("glass_effect", event.target.checked)} className="size-4 accent-teal-700" />
        </label>
      </div>
    </div>
  );
}
