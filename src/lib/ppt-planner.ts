import type { PptOutline, PptSlide } from "@/types/ppt";
import type { ProjectMaterial, TeamMember } from "@/types/project";

const fallback = (value: string, placeholder: string) => value.trim() || placeholder;

const memberLine = (members: TeamMember[]) => {
  if (members.length === 0) {
    return "建议补充负责人、执行、材料、宣传和财务安全等角色。";
  }
  return members
    .map((member) => `${fallback(member.name, "成员")}负责${fallback(member.responsibility, "待补充分工")}`)
    .join("；");
};

const createSlide = (
  page: number,
  title: string,
  coreContent: string[],
  visualSuggestion: string,
  speakerNotes: string,
): PptSlide => ({
  page,
  title,
  coreContent,
  visualSuggestion,
  speakerNotes,
});

export const createPptOutline = (data: ProjectMaterial): PptOutline => {
  const projectName = fallback(data.project.name, "未命名项目");
  const teamName = fallback(data.project.teamName, "待补充团队名称");
  const year = fallback(data.project.year, new Date().getFullYear().toString());
  const projectType = fallback(data.project.type, "待补充项目类型");
  const slogan = fallback(data.project.slogan, "待补充项目口号");
  const summary = fallback(data.project.summary, "建议补充项目简介。");
  const background = fallback(data.content.background, "建议补充项目背景、服务对象和现实需求。");
  const significance = fallback(data.content.significance, "建议补充项目意义。");
  const plan = fallback(data.content.plan, "建议补充实施计划。");
  const outcomes = fallback(data.content.outcomes, "建议补充预期成果。");
  const riskControl = fallback(data.content.riskControl, "建议补充风险控制。");
  const members = memberLine(data.members);

  const slides: PptSlide[] = [
    createSlide(
      1,
      "封面",
      [`项目名称：${projectName}`, `团队名称：${teamName}`, `项目类型：${projectType}`, `项目口号：${slogan}`],
      "使用项目名称大标题、团队名称、年份和一张柔和背景图，保持留白。",
      "用 20 秒说明团队身份、项目名称和一句话定位。",
    ),
    createSlide(
      2,
      "项目背景",
      [background, `项目简介：${summary}`],
      "使用场景照片、数据卡片或需求关键词云呈现背景。",
      "先讲真实场景，再讲项目为什么值得做。",
    ),
    createSlide(
      3,
      "痛点问题",
      ["需求识别不充分，容易停留在口号。", "执行过程缺少记录，后期难以申报和答辩。", "成果表达不系统，宣传和复盘材料不足。"],
      "用三栏痛点卡片或问题漏斗图呈现。",
      "把问题讲具体，避免泛泛说“意义重大”。",
    ),
    createSlide(
      4,
      "项目目标",
      ["完成需求调研并明确服务对象。", "形成可执行的项目流程和任务分工。", `沉淀成果：${outcomes}`],
      "用目标金字塔或 OKR 风格卡片呈现。",
      "强调目标可执行、可检查、可展示。",
    ),
    createSlide(
      5,
      "实施路径",
      ["调研诊断：访谈、问卷、资料收集。", "方案设计：目标、内容、预算和风险预案。", "组织执行：活动推进和过程留痕。", "成果沉淀：报告、答辩、宣传材料。"],
      "使用横向流程图，突出“调研-设计-执行-沉淀”。",
      "说明项目不是一次性活动，而是一套闭环流程。",
    ),
    createSlide(
      6,
      "实践计划",
      [plan, "建议分为准备、调研、执行、总结、展示五个阶段。"],
      "使用时间轴或甘特图呈现各阶段节点。",
      "讲清楚什么时候做什么、谁负责、交付什么。",
    ),
    createSlide(
      7,
      "团队分工",
      [members],
      "用成员头像/姓名卡片或分工矩阵呈现。",
      "突出团队能力与任务之间的匹配关系。",
    ),
    createSlide(
      8,
      "创新亮点",
      ["真实需求导向：以调研结果而非主观设想设计项目。", "材料同步沉淀：执行和申报材料同步形成。", "成果可复用：为后续竞赛、答辩、宣传提供基础。"],
      "使用三张亮点卡片，配轻量图标。",
      "强调创新不一定是技术创新，也可以是方法、组织和表达创新。",
    ),
    createSlide(
      9,
      "预期成果",
      [outcomes, "成果应覆盖过程记录、文本材料、展示材料和传播材料。"],
      "用成果清单、文件夹式图示或成果墙呈现。",
      "把成果说成可检查的材料，而不是抽象影响。",
    ),
    createSlide(
      10,
      "风险控制",
      [riskControl, "重点关注安全、进度、预算、舆情、数据真实性和影像授权。"],
      "使用风险矩阵，按概率和影响程度分类。",
      "说明团队已经考虑项目执行中的不确定性。",
    ),
    createSlide(
      11,
      "未来规划",
      ["完善调研样本与成果评价。", "沉淀标准化材料包。", "争取学院展示、校级立项或竞赛申报。", significance],
      "使用路线图或阶梯式规划图呈现。",
      "把未来规划落到可继续推进的下一步。",
    ),
    createSlide(
      12,
      "结尾页",
      [`${projectName} 希望把真实问题、青年行动和成果表达连接起来。`, "感谢各位老师指导，恳请批评指正。"],
      "使用简洁结束页，保留项目口号和联系方式区域。",
      "用 20 秒收束价值，主动邀请提问。",
    ),
  ];

  return {
    projectName,
    teamName,
    year,
    slideCount: slides.length,
    slides,
  };
};

export const exportPptOutlineMarkdown = (outline: PptOutline) => `# ${outline.projectName} PPT 策划大纲

**团队名称：** ${outline.teamName}  
**项目年份：** ${outline.year}  
**默认页数：** ${outline.slideCount} 页

${outline.slides
  .map(
    (slide) => `## 第 ${slide.page} 页：${slide.title}

### 核心内容
${slide.coreContent.map((item) => `- ${item}`).join("\n")}

### 建议视觉元素
${slide.visualSuggestion}

### 演讲提示
${slide.speakerNotes}`,
  )
  .join("\n\n")}
`;

export const exportPptOutlineJson = (outline: PptOutline) => JSON.stringify(outline, null, 2);

const downloadTextFile = (content: string, fileName: string, type: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const safeName = (value: string) => value.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "").trim() || "PPT大纲";

export const downloadPptOutlineMarkdown = (outline: PptOutline) => {
  downloadTextFile(
    exportPptOutlineMarkdown(outline),
    `${safeName(outline.projectName)}_PPT策划大纲_${outline.year}.md`,
    "text/markdown;charset=utf-8",
  );
};

export const downloadPptOutlineJson = (outline: PptOutline) => {
  downloadTextFile(
    exportPptOutlineJson(outline),
    `${safeName(outline.projectName)}_PPT策划大纲_${outline.year}.json`,
    "application/json;charset=utf-8",
  );
};
