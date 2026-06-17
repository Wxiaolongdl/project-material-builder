import type { ProjectContent } from "@/types/project";
import { Field } from "@/components/field";
import { Textarea } from "@/components/ui/textarea";

type ProjectContentFormProps = {
  value: ProjectContent;
  onChange: (value: ProjectContent) => void;
};

const fields: Array<{ key: keyof ProjectContent; label: string; placeholder: string }> = [
  { key: "background", label: "项目背景", placeholder: "说明问题来源、服务对象、现实需求、已有基础。" },
  { key: "significance", label: "项目意义", placeholder: "说明社会价值、专业价值、育人价值与推广价值。" },
  { key: "plan", label: "实施计划", placeholder: "按阶段写：准备、调研、执行、总结、展示。" },
  { key: "outcomes", label: "预期成果", placeholder: "写清调研报告、活动记录、课程包、视频、推文、成果展等。" },
  { key: "budget", label: "经费预算", placeholder: "按交通、物料、宣传、保险、备用金等分类。" },
  { key: "riskControl", label: "风险控制", placeholder: "覆盖安全、天气、沟通、进度、预算、舆情和数据真实性。" },
];

export function ProjectContentForm({ value, onChange }: ProjectContentFormProps) {
  const update = (key: keyof ProjectContent, nextValue: string) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="space-y-7">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">项目内容录入</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">把真实信息写得越具体，模板生成结果越接近可提交材料。</p>
      </div>
      <div className="grid gap-5">
        {fields.map((field) => (
          <Field key={field.key} label={field.label}>
            <Textarea
              value={value[field.key]}
              onChange={(event) => update(field.key, event.target.value)}
              placeholder={field.placeholder}
            />
          </Field>
        ))}
      </div>
    </div>
  );
}
