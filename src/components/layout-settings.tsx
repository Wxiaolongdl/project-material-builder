"use client";

import type { PublicLayoutConfig } from "@/types/public-config";

type LayoutSettingsProps = {
  value: PublicLayoutConfig;
  onChange: (value: PublicLayoutConfig) => void;
};

const boolFields: Array<[keyof PublicLayoutConfig, string]> = [
  ["show_stats", "显示数据统计区"],
  ["show_timeline", "显示时间线"],
  ["show_members", "显示成员区"],
  ["show_materials", "显示材料区"],
  ["show_footer", "显示底部区域"],
];

export function LayoutSettings({ value, onChange }: LayoutSettingsProps) {
  const update = <K extends keyof PublicLayoutConfig>(key: K, nextValue: PublicLayoutConfig[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">页面布置</h2>
        <p className="mt-2 text-sm text-zinc-500">控制公开页的布局、模块显示和展示方式。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="首屏布局" value={value.hero_layout} options={["centered", "split"]} onChange={(next) => update("hero_layout", next as PublicLayoutConfig["hero_layout"])} />
        <Select label="成员展示" value={value.member_layout} options={["grid", "list", "cards"]} onChange={(next) => update("member_layout", next as PublicLayoutConfig["member_layout"])} />
        <Select label="材料展示" value={value.material_layout} options={["tabs", "cards", "sections"]} onChange={(next) => update("material_layout", next as PublicLayoutConfig["material_layout"])} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {boolFields.map(([key, label]) => (
          <label key={key} className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 text-sm text-zinc-700">
            {label}
            <input
              type="checkbox"
              checked={Boolean(value[key])}
              onChange={(event) => update(key, event.target.checked as PublicLayoutConfig[typeof key])}
              className="size-4 accent-teal-700"
            />
          </label>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <TextInput label="首页标题" value={value.hero_title ?? ""} onChange={(next) => update("hero_title", next)} />
        <TextInput label="首页副标题" value={value.hero_subtitle ?? ""} onChange={(next) => update("hero_subtitle", next)} />
        <TextInput label="主按钮文案" value={value.primary_button_text ?? ""} onChange={(next) => update("primary_button_text", next)} />
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm text-zinc-600">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-white/75 bg-white/62 px-4 text-sm">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm text-zinc-600">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-white/75 bg-white/62 px-4 text-sm" />
    </label>
  );
}
