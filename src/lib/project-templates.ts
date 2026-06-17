import type { ProjectMaterial } from "@/types/project";
import type { ProjectTemplate, ProjectTemplateId } from "@/types/template";

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "summer-practice",
    name: "大学生暑期社会实践",
    scenario: "适用于三下乡、返家乡、社区服务、乡村调研、公益实践等暑期实践项目。",
    recommendedOutputs: ["社会实践策划书", "调研报告", "实践日志", "新闻稿", "公众号推文", "答辩 PPT"],
    defaultSections: ["实践背景", "实践主题", "调研对象", "服务内容", "行程安排", "安全预案", "成果沉淀"],
    fieldHints: {
      projectName: "如：乡村振兴背景下基层美育服务实践",
      teamName: "如：青春筑梦实践队",
      summary: "写清实践地点、服务对象、调研主题和预期成果。",
      background: "说明实践地需求、政策背景、服务对象痛点和团队前期基础。",
      plan: "按前期联系、实地调研、服务开展、成果整理、宣传展示拆解。",
      outcomes: "调研报告、实践照片、访谈纪要、新闻稿、推文、成果册。",
    },
    icon: "MapPinned",
    gradient: "from-emerald-100 via-teal-50 to-white",
  },
  {
    id: "innovation",
    name: "创新创业项目",
    scenario: "适用于大创项目、互联网+、挑战杯、创业训练和产品原型申报。",
    recommendedOutputs: ["项目申报书", "商业计划书", "路演稿", "PPT 大纲", "用户调研报告", "财务预算"],
    defaultSections: ["市场痛点", "解决方案", "产品功能", "商业模式", "市场验证", "竞争分析", "财务规划"],
    fieldHints: {
      projectName: "如：面向校园社团的活动管理创新创业平台",
      teamName: "如：启航创新团队",
      summary: "写清用户群体、产品/服务方案、商业模式和验证计划。",
      background: "说明市场需求、用户痛点、竞品不足和机会窗口。",
      plan: "按用户调研、原型设计、MVP 测试、市场验证、路演优化拆解。",
      outcomes: "产品原型、用户调研、商业计划书、路演 PPT、财务测算。",
    },
    icon: "Rocket",
    gradient: "from-cyan-100 via-emerald-50 to-white",
  },
  {
    id: "campaign",
    name: "学生会竞选答辩",
    scenario: "适用于学生会、社团、班委、团学组织竞选和述职答辩。",
    recommendedOutputs: ["竞选答辩稿", "个人陈述", "工作设想", "PPT 大纲", "竞选海报"],
    defaultSections: ["个人介绍", "岗位认知", "过往经历", "竞选优势", "工作规划", "服务承诺", "总结陈词"],
    fieldHints: {
      projectName: "如：学生会主席团竞选答辩",
      teamName: "可填写个人姓名或竞选小组名称",
      summary: "写清竞选岗位、个人基础、组织理解和工作愿景。",
      background: "说明竞选组织现状、岗位职责和你观察到的问题。",
      plan: "按组织建设、活动运营、权益服务、宣传沟通设计工作计划。",
      outcomes: "任期工作清单、活动机制优化、服务反馈渠道、组织建设方案。",
    },
    icon: "Mic2",
    gradient: "from-sky-100 via-teal-50 to-white",
  },
  {
    id: "class-activity",
    name: "班级活动策划",
    scenario: "适用于主题班会、团日活动、班级建设、志愿活动和校园文化活动。",
    recommendedOutputs: ["活动策划书", "执行清单", "主持稿", "宣传文案", "活动总结"],
    defaultSections: ["活动主题", "活动目的", "参与对象", "流程设计", "物资预算", "人员分工", "应急预案"],
    fieldHints: {
      projectName: "如：凝心聚力主题班级建设活动",
      teamName: "如：软件 2301 班委会",
      summary: "写清活动主题、参与对象、活动形式和预期效果。",
      background: "说明班级建设需求、同学参与情况和活动开展背景。",
      plan: "按筹备、宣传、签到、互动环节、总结反馈拆解。",
      outcomes: "活动照片、签到表、反馈问卷、总结推文、班级凝聚力提升。",
    },
    icon: "UsersRound",
    gradient: "from-lime-100 via-emerald-50 to-white",
  },
  {
    id: "lab-report",
    name: "课程实验报告",
    scenario: "适用于课程实验、课程设计、调研作业、工程实践和结课展示。",
    recommendedOutputs: ["实验报告", "实验记录", "数据分析", "结论反思", "展示 PPT"],
    defaultSections: ["实验目的", "实验原理", "实验环境", "实验步骤", "数据记录", "结果分析", "问题反思"],
    fieldHints: {
      projectName: "如：数据可视化课程实验报告",
      teamName: "如：第 3 实验小组",
      summary: "写清实验任务、使用方法、数据来源和结论。",
      background: "说明课程要求、实验目的、理论基础和问题定义。",
      plan: "按环境准备、数据采集、实验操作、结果记录、分析总结拆解。",
      outcomes: "实验报告、数据表、图表结果、问题分析、改进建议。",
    },
    icon: "FlaskConical",
    gradient: "from-teal-100 via-cyan-50 to-white",
  },
  {
    id: "roadshow",
    name: "比赛路演项目",
    scenario: "适用于创新创业比赛、商业计划路演、项目展示和评审答辩。",
    recommendedOutputs: ["路演稿", "商业计划书", "PPT 大纲", "评委问答", "项目摘要"],
    defaultSections: ["开场钩子", "市场机会", "用户痛点", "解决方案", "竞争优势", "商业模式", "融资/资源需求"],
    fieldHints: {
      projectName: "如：校园低碳积分平台路演项目",
      teamName: "如：GreenLoop 团队",
      summary: "写清项目定位、目标用户、核心方案、增长路径和竞争优势。",
      background: "说明行业趋势、用户痛点、市场规模和现有方案不足。",
      plan: "按产品验证、用户增长、渠道合作、商业化测试、路演优化拆解。",
      outcomes: "路演 PPT、商业计划书、用户验证数据、Demo 原型、答辩问答库。",
    },
    icon: "Presentation",
    gradient: "from-blue-100 via-teal-50 to-white",
  },
];

export const getProjectTemplate = (id: ProjectTemplateId) => projectTemplates.find((template) => template.id === id);

export const applyProjectTemplate = (data: ProjectMaterial, templateId: ProjectTemplateId): ProjectMaterial => {
  const template = getProjectTemplate(templateId);
  if (!template) {
    return data;
  }

  return {
    ...data,
    project: {
      ...data.project,
      name: template.fieldHints.projectName.replace(/^如：/, ""),
      teamName: template.fieldHints.teamName.replace(/^如：/, ""),
      type: template.name,
      slogan: data.project.slogan || template.defaultSections[0],
      summary: template.fieldHints.summary,
    },
    content: {
      ...data.content,
      background: template.fieldHints.background,
      significance: `本项目适用于${template.scenario}，能够帮助团队形成结构清晰、证据充分、便于展示和复盘的项目材料。`,
      plan: template.fieldHints.plan,
      outcomes: template.fieldHints.outcomes,
      budget: data.content.budget || "建议按人员交通、物资采购、宣传制作、场地设备、备用金等分类填写。",
      riskControl: data.content.riskControl || "建议补充安全、进度、沟通、预算、数据真实性和突发情况预案。",
    },
    template: {
      id: template.id,
      name: template.name,
      defaultSections: template.defaultSections,
      recommendedOutputs: template.recommendedOutputs,
    },
  };
};
