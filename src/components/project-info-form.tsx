import type { ProjectInfo } from "@/types/project";
import { Field } from "@/components/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProjectInfoFormProps = {
  value: ProjectInfo;
  onChange: (value: ProjectInfo) => void;
};

const projectTypes = ["大学生社会实践", "创新创业项目", "竞选答辩", "项目申报", "策划书制作", "志愿服务"];

export function ProjectInfoForm({ value, onChange }: ProjectInfoFormProps) {
  const update = (key: keyof ProjectInfo, nextValue: string) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="space-y-7">
      <SectionHeader title="项目信息" description="建立材料生成的基础身份信息，后续内容会围绕这里自动展开。" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="项目名称">
          <Input value={value.name} onChange={(event) => update("name", event.target.value)} placeholder="如：乡村美育共创计划" />
        </Field>
        <Field label="团队名称">
          <Input value={value.teamName} onChange={(event) => update("teamName", event.target.value)} placeholder="如：星火实践队" />
        </Field>
        <Field label="项目类型">
          <select
            value={value.type}
            onChange={(event) => update("type", event.target.value)}
            className="h-12 w-full rounded-[18px] border border-white/75 bg-white/62 px-4 text-sm text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_22px_rgba(15,23,42,0.035)] outline-none transition focus:border-teal-200/80 focus:bg-white/82 focus:ring-4 focus:ring-teal-700/[0.06]"
          >
            <option value="">请选择项目类型</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="所属学院">
          <Input value={value.college} onChange={(event) => update("college", event.target.value)} placeholder="如：艺术与传媒学院" />
        </Field>
        <Field label="指导老师">
          <Input value={value.mentor} onChange={(event) => update("mentor", event.target.value)} placeholder="如：王老师" />
        </Field>
        <Field label="项目年份">
          <Input value={value.year} onChange={(event) => update("year", event.target.value)} placeholder="2026" />
        </Field>
      </div>
      <Field label="项目口号">
        <Input value={value.slogan} onChange={(event) => update("slogan", event.target.value)} placeholder="一句适合答辩和传播的表达" />
      </Field>
      <Field label="项目简介">
        <Textarea
          value={value.summary}
          onChange={(event) => update("summary", event.target.value)}
          placeholder="用 100-200 字说明项目要解决的问题、行动方式和预期成果。"
        />
      </Field>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}
