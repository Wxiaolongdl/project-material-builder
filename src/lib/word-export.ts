import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { ProjectMaterial, TeamMember } from "@/types/project";

export type WordExportType = "plan" | "application" | "defense" | "news" | "all";

export const wordExportTypes: Array<{ value: WordExportType; label: string }> = [
  { value: "plan", label: "策划书" },
  { value: "application", label: "申报书" },
  { value: "defense", label: "答辩稿" },
  { value: "news", label: "新闻稿" },
  { value: "all", label: "全部材料包" },
];

const font = "宋体";
const fallback = (value: string, placeholder: string) => value.trim() || placeholder;
const sanitizeFileName = (value: string) => value.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "").trim();
const labelFor = (type: WordExportType) => wordExportTypes.find((item) => item.value === type)?.label ?? "材料";

export const createWordExportFileName = (data: ProjectMaterial, type: WordExportType) => {
  const projectName = sanitizeFileName(fallback(data.project.name, "未命名项目"));
  const year = sanitizeFileName(fallback(data.project.year, new Date().getFullYear().toString()));
  return `${projectName}_${labelFor(type)}_${year}.docx`;
};

const text = (value: string, options?: { bold?: boolean; size?: number }) =>
  new TextRun({
    text: value,
    bold: options?.bold,
    size: options?.size ?? 24,
    font,
  });

const paragraph = (value: string) =>
  new Paragraph({
    children: [text(value)],
    spacing: { after: 180, line: 360 },
  });

const title = (value: string) =>
  new Paragraph({
    children: [text(value, { bold: true, size: 36 })],
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
  });

const heading = (value: string) =>
  new Paragraph({
    children: [text(value, { bold: true, size: 30 })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
  });

const bullet = (value: string) =>
  new Paragraph({
    children: [text(value)],
    bullet: { level: 0 },
    spacing: { after: 120, line: 320 },
  });

const metadata = (data: ProjectMaterial) => [
  paragraph(`项目名称：${fallback(data.project.name, "未命名项目")}`),
  paragraph(`团队名称：${fallback(data.project.teamName, "待补充团队名称")}`),
  paragraph(`项目年份：${fallback(data.project.year, new Date().getFullYear().toString())}`),
  paragraph(`项目类型：${fallback(data.project.type, "待补充项目类型")}`),
  paragraph(`所属学院：${fallback(data.project.college, "待补充所属学院")}`),
  paragraph(`指导老师：${fallback(data.project.mentor, "待补充指导老师")}`),
];

const cell = (value: string, bold = false) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [text(value, { bold })],
        spacing: { after: 80, line: 300 },
      }),
    ],
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
  });

const table = (rows: string[][]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "D7DEE2" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "D7DEE2" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "D7DEE2" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "D7DEE2" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D7DEE2" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "D7DEE2" },
    },
    rows: rows.map(
      (row, rowIndex) =>
        new TableRow({
          children: row.map((item) => cell(item, rowIndex === 0)),
        }),
    ),
  });

const memberTable = (members: TeamMember[]) =>
  table([
    ["姓名", "角色", "专业班级", "分工", "个人优势"],
    ...(members.length > 0
      ? members.map((member) => [
          fallback(member.name, "待补充"),
          fallback(member.role, "待补充"),
          fallback(member.className, "待补充"),
          fallback(member.responsibility, "待补充"),
          fallback(member.strength, "待补充"),
        ])
      : [["待补充", "待补充", "待补充", "待补充", "待补充"]]),
  ]);

const parseBudgetRows = (budget: string) => {
  const source = fallback(budget, "交通费 待补充，物料费 待补充，宣传费 待补充，备用金 待补充");
  const parts = source
    .split(/[，,；;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    ["类别", "预算说明"],
    ...parts.map((item) => {
      const match = item.match(/^(.+?)(\d+(?:\.\d+)?\s*元.*)$/);
      return match ? [match[1].trim(), match[2].trim()] : ["预算项", item];
    }),
  ];
};

const budgetTable = (budget: string) => table(parseBudgetRows(budget));

const planChildren = (data: ProjectMaterial) => [
  title(`${fallback(data.project.name, "未命名项目")}策划书`),
  ...metadata(data),
  heading("一、项目背景"),
  paragraph(fallback(data.content.background, "待补充项目背景。")),
  heading("二、项目意义"),
  paragraph(fallback(data.content.significance, "待补充项目意义。")),
  heading("三、项目目标"),
  bullet("完成项目需求调研，明确服务对象、现实问题与执行条件。"),
  bullet("形成可执行的实施方案，保证任务有节点、有责任人、有成果物。"),
  bullet("沉淀可用于申报、答辩、宣传和结项的完整材料包。"),
  heading("四、团队构成"),
  memberTable(data.members),
  heading("五、实施路径"),
  paragraph(fallback(data.content.plan, "待补充实施计划。")),
  heading("六、预期成果"),
  paragraph(fallback(data.content.outcomes, "待补充预期成果。")),
  heading("七、经费预算"),
  budgetTable(data.content.budget),
  heading("八、风险控制"),
  paragraph(fallback(data.content.riskControl, "待补充风险控制。")),
  heading("九、总结展望"),
  paragraph("项目后续将围绕成果复盘、材料完善和推广应用持续迭代，形成可复制、可展示、可申报的实践成果。"),
];

const applicationChildren = (data: ProjectMaterial) => [
  title(`${fallback(data.project.name, "未命名项目")}申报书核心内容`),
  ...metadata(data),
  heading("一、项目基础与申报必要性"),
  paragraph(`项目拟依托${fallback(data.project.college, "待补充所属学院")}，在${fallback(data.project.mentor, "待补充指导老师")}指导下，由${fallback(data.project.teamName, "待补充团队名称")}围绕${fallback(data.project.type, "待补充项目类型")}方向开展。${fallback(data.content.background, "待补充项目背景。")}`),
  heading("二、建设内容"),
  paragraph(fallback(data.content.plan, "待补充实施计划。")),
  heading("三、团队基础"),
  memberTable(data.members),
  heading("四、经费预算"),
  budgetTable(data.content.budget),
  heading("五、预期成效"),
  paragraph(fallback(data.content.outcomes, "待补充预期成果。")),
  heading("六、保障措施"),
  paragraph(fallback(data.content.riskControl, "待补充风险控制。")),
];

const defenseChildren = (data: ProjectMaterial) => [
  title(`${fallback(data.project.name, "未命名项目")}5 分钟答辩稿`),
  ...metadata(data),
  heading("0:00-0:30 开场"),
  paragraph(`各位评委老师好，我们是${fallback(data.project.teamName, "待补充团队名称")}。我们申报的项目是《${fallback(data.project.name, "未命名项目")}》。`),
  heading("0:30-1:30 背景与问题"),
  paragraph(fallback(data.content.background, "待补充项目背景。")),
  heading("1:30-2:30 项目方案"),
  paragraph(fallback(data.content.plan, "待补充实施计划。")),
  heading("2:30-3:30 团队优势"),
  memberTable(data.members),
  heading("3:30-4:30 成果预期"),
  paragraph(fallback(data.content.outcomes, "待补充预期成果。")),
  heading("4:30-5:00 总结"),
  paragraph("以上就是我们的汇报，恳请各位老师批评指正，谢谢大家。"),
];

const newsChildren = (data: ProjectMaterial) => [
  title(`${fallback(data.project.name, "未命名项目")}新闻稿`),
  heading("标题"),
  paragraph(`${fallback(data.project.college, "学院")}${fallback(data.project.teamName, "团队")}推进《${fallback(data.project.name, "未命名项目")}》项目`),
  heading("正文"),
  paragraph(`近日，${fallback(data.project.college, "学院")}${fallback(data.project.teamName, "团队")}围绕《${fallback(data.project.name, "未命名项目")}》开展方案完善与材料准备工作。项目聚焦${fallback(data.project.type, "项目申报")}方向，计划通过调研、执行、总结和宣传展示形成具有实践价值的成果。`),
  paragraph(`下一步，团队将在${fallback(data.project.mentor, "指导老师")}指导下继续完善项目材料，推动项目进入具体实施阶段。`),
];

const childrenFor = (data: ProjectMaterial, type: WordExportType) => {
  if (type === "plan") return planChildren(data);
  if (type === "application") return applicationChildren(data);
  if (type === "defense") return defenseChildren(data);
  if (type === "news") return newsChildren(data);
  return [
    ...planChildren(data),
    new Paragraph({ pageBreakBefore: true, children: [] }),
    ...applicationChildren(data),
    new Paragraph({ pageBreakBefore: true, children: [] }),
    ...defenseChildren(data),
    new Paragraph({ pageBreakBefore: true, children: [] }),
    ...newsChildren(data),
  ];
};

export const createWordDocument = (data: ProjectMaterial, type: WordExportType) =>
  new Document({
    creator: "ProjectMaterialBuilder",
    description: "项目材料自动生成工作台导出的 Word 文档",
    styles: {
      default: {
        document: {
          run: { font, size: 24 },
          paragraph: { spacing: { line: 360, after: 160 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: childrenFor(data, type),
      },
    ],
  });

export const exportWordDocument = async (data: ProjectMaterial, type: WordExportType) => {
  if (typeof window === "undefined") {
    return;
  }

  const blob = await Packer.toBlob(createWordDocument(data, type));
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = createWordExportFileName(data, type);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
