import { Plus, Trash2 } from "lucide-react";
import type { TeamMember } from "@/types/project";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TeamMembersManagerProps = {
  value: TeamMember[];
  onChange: (value: TeamMember[]) => void;
};

const createMember = (): TeamMember => ({
  id: crypto.randomUUID(),
  name: "",
  role: "",
  className: "",
  responsibility: "",
  strength: "",
  avatarUrl: "",
});

export function TeamMembersManager({ value, onChange }: TeamMembersManagerProps) {
  const addMember = () => onChange([...value, createMember()]);
  const deleteMember = (id: string) => onChange(value.filter((member) => member.id !== id));
  const updateMember = (id: string, key: keyof TeamMember, nextValue: string) => {
    onChange(value.map((member) => (member.id === id ? { ...member, [key]: nextValue } : member)));
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">团队成员管理</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">支持添加、编辑、删除成员，生成稿会自动整合角色分工与个人优势。</p>
        </div>
        <Button variant="secondary" size="sm" onClick={addMember}>
          <Plus className="size-4" />
          添加成员
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-teal-200/70 bg-white/42 p-8 text-sm leading-6 text-zinc-500 backdrop-blur-xl">
          还没有成员。点击“添加成员”开始录入负责人、执行、文案、影像、财务等角色。
        </div>
      ) : (
        <div className="space-y-5">
          {value.map((member, index) => (
            <div key={member.id} className="rounded-[24px] border border-white/70 bg-white/48 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.045)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-700">成员 {index + 1}</p>
                <Button variant="ghost" size="icon" onClick={() => deleteMember(member.id)} aria-label="删除成员">
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="姓名">
                  <Input value={member.name} onChange={(event) => updateMember(member.id, "name", event.target.value)} />
                </Field>
                <Field label="角色">
                  <Input value={member.role} onChange={(event) => updateMember(member.id, "role", event.target.value)} placeholder="负责人 / 文案 / 摄影" />
                </Field>
                <Field label="专业班级">
                  <Input value={member.className} onChange={(event) => updateMember(member.id, "className", event.target.value)} />
                </Field>
                <Field label="分工">
                  <Input value={member.responsibility} onChange={(event) => updateMember(member.id, "responsibility", event.target.value)} />
                </Field>
                <Field label="头像链接">
                  <Input value={member.avatarUrl ?? ""} onChange={(event) => updateMember(member.id, "avatarUrl", event.target.value)} placeholder="avatar_url" />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="个人优势">
                  <Textarea value={member.strength} onChange={(event) => updateMember(member.id, "strength", event.target.value)} className="min-h-24" />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
