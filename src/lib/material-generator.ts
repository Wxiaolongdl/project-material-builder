import type { ProjectMaterial, TeamMember } from "@/types/project";

const fallback = (value: string, placeholder: string) => value.trim() || placeholder;

const ensureSentence = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return /[。！？.!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
};

const stripTeacherSuffix = (value: string) => value.replace(/老师$/, "");

const responsibilityPhrase = (value: string) => {
  const text = fallback(value, "项目相关工作");
  return text.startsWith("负责") ? text : `负责${text}`;
};

const membersSummary = (members: TeamMember[]) => {
  if (members.length === 0) {
    return "- 暂未填写成员信息。建议至少补充项目负责人、调研执行、材料撰写、宣传影像、财务安全等岗位。";
  }

  return members
    .map(
      (member) =>
        `- ${fallback(member.name, "待补充姓名")}（${fallback(member.role, "待补充角色")}，${fallback(
          member.className,
          "待补充专业班级",
        )}）：主要负责${fallback(member.responsibility, "待补充分工")}；个人优势为${fallback(
          member.strength,
          "待补充个人优势",
        )}。`,
    )
    .join("\n");
};

const memberNarrative = (members: TeamMember[]) => {
  if (members.length === 0) {
    return "团队后续将按照“统筹负责人、调研执行、材料写作、宣传影像、财务安全”五类岗位完善分工，确保每项任务有责任人、有时间节点、有成果记录。";
  }

  return members
    .map(
      (member) =>
        `${fallback(member.name, "成员")}担任${fallback(member.role, "相关角色")}，${responsibilityPhrase(
          member.responsibility,
        )}，其优势在于${fallback(member.strength, "具备与岗位匹配的能力基础")}`,
    )
    .join("；");
};

const makeGoals = (projectType: string, outcomes: string) => `1. 调研目标：围绕${projectType}场景，完成对象需求、资源基础、现实问题和实施条件的梳理。
2. 实施目标：形成可执行的项目流程，把调研发现转化为课程、活动、服务、展示或申报成果。
3. 成果目标：沉淀可提交、可展示、可复盘的材料包，包括策划书、申报书、答辩稿、PPT 大纲、新闻稿与推文草稿。
4. 育人目标：提升团队成员的问题识别、组织协同、公众表达和项目管理能力。
5. 量化目标：${fallback(outcomes, "建议补充成果数量、服务对象规模、宣传次数、调研样本量和复盘材料清单。")}`;

const makeTimeline = () => `| 阶段 | 时间建议 | 重点任务 | 交付材料 |
| --- | --- | --- | --- |
| 准备阶段 | 第 1 周 | 明确选题、完善团队分工、联系指导老师、制定安全预案 | 项目任务书、成员分工表 |
| 调研阶段 | 第 2 周 | 开展访谈、问卷、资料收集和现场观察 | 调研记录、需求分析表 |
| 方案阶段 | 第 3 周 | 根据调研结果细化项目目标、服务内容和执行流程 | 策划书初稿、预算表 |
| 执行阶段 | 第 4-5 周 | 推进实践活动、记录过程材料、收集反馈 | 活动照片、签到表、反馈表 |
| 总结阶段 | 第 6 周 | 复盘成效、整理成果、形成答辩和宣传材料 | 申报书、答辩稿、PPT 大纲、新闻稿 |
| 展示阶段 | 第 7 周 | 完成成果展示、校内传播或评审答辩 | 成果汇编、展示海报、推文 |`;

export const createEmptyProjectMaterial = (): ProjectMaterial => ({
  project: {
    name: "",
    teamName: "",
    type: "",
    college: "",
    mentor: "",
    year: new Date().getFullYear().toString(),
    slogan: "",
    summary: "",
  },
  members: [],
  content: {
    background: "",
    significance: "",
    plan: "",
    outcomes: "",
    budget: "",
    riskControl: "",
  },
});

export const generateMaterialMarkdown = (data: ProjectMaterial): string => {
  const { project, content, members } = data;
  const title = fallback(project.name, "未命名项目");
  const teamName = fallback(project.teamName, "待补充团队名称");
  const projectType = fallback(project.type, "待补充项目类型");
  const college = fallback(project.college, "待补充所属学院");
  const mentor = fallback(project.mentor, "待补充指导老师");
  const mentorName = stripTeacherSuffix(mentor);
  const year = fallback(project.year, new Date().getFullYear().toString());
  const slogan = fallback(project.slogan, "待补充项目口号");
  const summary = fallback(project.summary, "待补充项目简介。建议用 100-200 字说明服务对象、核心问题、实施方式和预期成果。");
  const background = fallback(
    ensureSentence(content.background),
    "待补充项目背景。建议说明问题来源、服务对象、现实需求、政策或校园语境，以及已有基础。",
  );
  const significance = fallback(
    ensureSentence(content.significance),
    "待补充项目意义。建议从社会价值、专业价值、育人价值、实践价值和可推广性展开。",
  );
  const plan = fallback(
    ensureSentence(content.plan),
    "待补充实施计划。建议按准备、调研、执行、总结、展示五个阶段拆解任务。",
  );
  const outcomes = fallback(
    ensureSentence(content.outcomes),
    "待补充预期成果。建议写明报告、课程包、活动记录、宣传稿、成果展、答辩材料等具体产出。",
  );
  const budget = fallback(
    ensureSentence(content.budget),
    "待补充经费预算。建议按交通、物料、宣传、保险、调研、备用金等分类列明金额和用途。",
  );
  const riskControl = fallback(
    ensureSentence(content.riskControl),
    "待补充风险控制。建议覆盖安全、天气、沟通、进度、预算、舆情、数据真实性和影像授权。",
  );
  const memberList = membersSummary(members);
  const memberText = memberNarrative(members);
  const templateSection = data.template
    ? `## 模板章节结构：${data.template.name}

### 适用推荐材料
${data.template.recommendedOutputs.map((item) => `- ${item}`).join("\n")}

### 默认章节结构
${data.template.defaultSections.map((item, index) => `${index + 1}. ${item}`).join("\n")}

`
    : "";

  return `# ${title}

> ${slogan}

**项目类型：** ${projectType}  
**申报团队：** ${teamName}  
**所属学院：** ${college}  
**指导老师：** ${mentor}  
**项目年份：** ${year}

## 项目简介

${summary}

${templateSection}
## 策划书

### 1. 项目背景

${background}

在高校实践育人、创新创业训练和学生综合能力培养的背景下，本项目拟以真实问题为导向，将团队专业能力与社会需求、校园需求或组织建设需求相结合，形成有调研依据、有实施路径、有成果沉淀的项目方案。

### 2. 项目意义

${significance}

项目的意义主要体现在三个层面：一是回应真实场景中的具体问题，提升项目服务对象的获得感；二是推动学生把课堂知识转化为实践能力，增强组织协调、沟通表达和材料写作能力；三是形成可展示、可复制、可迭代的成果，为后续申报、答辩、宣传和成果推广提供依据。

### 3. 项目目标

${makeGoals(projectType, outcomes)}

### 4. 团队构成

${teamName} 将按照“目标统一、分工明确、过程留痕、成果共创”的原则推进项目。团队构成如下：

${memberList}

团队协作上，建议建立周例会、任务看板、资料归档和风险反馈机制，确保项目从调研到展示均可追踪、可复盘。

### 5. 实施路径

项目实施路径拟分为“调研诊断、方案设计、组织执行、成果沉淀、展示传播”五个环节：

1. 调研诊断：通过访谈、问卷、资料检索、现场观察等方式，明确服务对象需求和项目切入点。
2. 方案设计：围绕项目目标设计活动内容、资源配置、人员分工、预算安排和风险预案。
3. 组织执行：按时间节点推进任务，保留签到表、照片、访谈记录、反馈表等过程材料。
4. 成果沉淀：整理调研报告、活动总结、案例材料、宣传稿件、答辩稿和 PPT 大纲。
5. 展示传播：通过班级、学院、学校媒体或竞赛答辩场景展示成果，扩大项目影响力。

具体实施计划为：${plan}

### 6. 时间安排

${makeTimeline()}

### 7. 预期成果

${outcomes}

建议将成果拆分为四类：过程成果，包括调研记录、访谈纪要、活动照片和反馈表；文本成果，包括策划书、申报书、总结报告和答辩稿；展示成果，包括 PPT 大纲、海报、成果展或路演材料；传播成果，包括新闻稿、公众号推文、短视频脚本或校内媒体投稿。

### 8. 经费预算

${budget}

经费使用应坚持“必要、节约、透明、可核验”的原则。建议保留采购清单、发票凭证、预算调整说明和经费使用记录，便于后续申报审核、项目结项和答辩说明。

### 9. 风险控制

${riskControl}

风险控制建议采用“事前预案、事中记录、事后复盘”的方式推进。重点关注成员安全、活动审批、未成年人保护、影像授权、数据真实性、经费合规和舆情表达，确保项目执行符合高校管理要求。

### 10. 总结展望

${title} 不仅是一项阶段性项目，更是一套可持续优化的实践方案。后续可在成果复盘基础上继续完善调研样本、优化实施流程、扩大服务对象，并将材料沉淀为可用于项目申报、竞赛答辩、社会实践结项和学院宣传的标准化成果包。

## 申报书核心内容

### 一、项目基础与申报必要性

项目拟依托${college}，在${mentor}指导下，由${teamName}围绕${projectType}方向开展《${title}》。项目聚焦的问题是：${background}

从申报必要性看，本项目具有较明确的现实基础和育人价值。一方面，项目回应了服务对象或校园场景中的具体需求；另一方面，项目能够推动学生在调研分析、组织实施、宣传表达和成果总结中提升综合能力，符合高校实践育人和项目化培养的要求。

### 二、项目建设内容

本项目将围绕“调研、执行、沉淀、传播”四项内容展开。前期通过资料收集、访谈和问卷明确问题；中期依据调研结果开展实践活动或项目服务；后期形成申报书、策划书、答辩稿、PPT 大纲、新闻稿和公众号推文等材料，并对项目效果进行复盘。

### 三、实施可行性

项目可行性主要体现在三个方面：第一，团队已具备基本分工基础，${memberText}。第二，项目计划具有阶段性安排，能够按照时间节点推进。第三，项目成果形式清晰，便于学院审核、竞赛答辩、社会实践结项和宣传推广。

### 四、预期成效

项目预期形成以下成果：${outcomes}

这些成果将服务于项目结项、评审答辩、宣传展示和后续迭代，也可作为团队继续申报校级、省级或创新创业类项目的基础材料。

### 五、保障措施

项目将在指导老师把关、团队分工负责、过程材料归档、预算记录留痕和风险预案执行的基础上推进。团队将重点做好安全管理、进度管理、质量管理和宣传审核，确保项目内容真实、过程规范、成果可信。

## 5 分钟答辩稿

### 0:00-0:30 开场

各位评委老师好，我们是${teamName}，来自${college}。我们申报的项目是《${title}》。本项目以“${slogan}”为主题，面向${projectType}场景，尝试用清晰的调研、可执行的方案和可沉淀的成果回应真实需求。

### 0:30-1:30 背景与问题

项目提出的背景是：${background}

我们认为，这一问题的关键不只是“有没有活动”，而是活动是否真正基于需求、过程是否可记录、成果是否能被复盘和传播。因此，本项目希望把零散想法转化为一套完整的项目材料和实施路径。

### 1:30-2:30 项目方案

在实施方案上，我们将按照“前期调研、中期执行、后期总结、成果展示”的逻辑推进。具体来说，${plan}

项目过程中，我们会同步建立资料归档机制，保留访谈记录、活动照片、反馈数据、预算记录和宣传素材，保证项目既能执行，也能经得起申报和答辩环节的追问。

### 2:30-3:30 团队优势

团队方面，${teamName} 的优势在于分工明确、能力互补、材料意识较强。${memberText}。

同时，我们会在指导老师${mentor}的指导下推进方案论证、过程把关和成果修改，确保项目方向符合高校项目申报和社会实践管理要求。

### 3:30-4:30 成果预期

项目预期成果包括：${outcomes}

这些成果不是单一文本，而是覆盖“调研依据、执行记录、总结复盘、答辩展示和宣传传播”的完整材料包，可用于项目申报、结项评审、学院宣传和后续迭代。

### 4:30-5:00 总结

总体来看，《${title}》的价值在于把真实问题、学生能力和成果表达连接起来。我们希望通过本项目形成一套可执行、可展示、可复制的实践方案。以上就是我们的汇报，恳请各位老师批评指正，谢谢大家。

## PPT 大纲（12-16 页，适合 5-8 分钟答辩）

1. 封面：项目名称、团队名称、学院、指导老师、年份
2. 目录：背景问题、项目方案、团队基础、成果预期、风险保障
3. 项目背景：呈现场景现状、服务对象和现实需求
4. 核心问题：用 2-3 个要点说明项目要解决的关键痛点
5. 项目定位：说明项目类型、服务对象、项目口号和核心价值
6. 项目目标：列出调研目标、实施目标、成果目标和育人目标
7. 实施路径：展示“调研-设计-执行-沉淀-传播”的流程图
8. 时间安排：用时间轴呈现准备、调研、执行、总结、展示节点
9. 团队构成：展示成员角色、专业班级、分工和个人优势
10. 经费预算：展示预算分类、金额用途和管理原则
11. 风险控制：展示安全、进度、预算、舆情、数据真实性等预案
12. 预期成果：展示报告、课程包、活动记录、宣传稿、成果展等清单
13. 项目亮点：突出真实需求、专业融合、过程留痕、成果可复用
14. 总结展望：说明项目后续推广、迭代和申报价值
15. 致谢页：感谢评委老师并预留问答

## 新闻稿

### 标题

${college}${teamName}推进《${title}》项目筹备工作

### 正文

近日，${college}${teamName}围绕《${title}》项目开展方案完善与材料准备工作。该项目以“${slogan}”为主题，聚焦${projectType}方向，计划通过前期调研、组织实施、成果沉淀和宣传展示，形成具有实践价值和育人意义的项目成果。

据介绍，项目将在${mentorName}老师指导下推进，重点围绕项目背景、实施路径、团队分工、经费预算和风险控制等内容进行系统设计。团队将坚持真实调研、规范执行和过程留痕，确保项目材料来源清晰、内容完整、成果可核验。

下一步，${teamName}将继续完善调研记录、活动方案和宣传材料，推动项目从策划阶段进入具体实施阶段，力争在实践过程中展现青年学生服务社会、参与创新和提升自我的良好风貌。

## 公众号推文草稿

### 标题

${title}：${slogan}

### 导语

一个好的项目，不只需要一个想法，更需要清晰的问题意识、可靠的执行路径和能够被看见的成果。${teamName} 正在推进《${title}》，希望把项目从“想做”推进到“能做、做好、可展示”。

### 正文

#### 一、我们为什么做这个项目

${background}

这正是《${title}》想要回应的问题。我们希望通过真实调研和持续行动，让项目不止停留在文字里，而是走进具体场景，形成可感知的改变。

#### 二、我们准备怎么做

项目将按照“调研诊断、方案设计、组织执行、成果沉淀、展示传播”的路径推进。具体计划为：${plan}

#### 三、我们的团队如何分工

${memberList}

#### 四、我们期待形成什么成果

${outcomes}

这些成果将用于项目答辩、社会实践结项、学院宣传和后续推广，也会成为团队复盘和继续优化的重要依据。

### 结尾号召

接下来，${teamName} 将继续完善方案、推进执行、记录过程。也欢迎同学和老师持续关注《${title}》，一起见证一个项目从想法走向成果。
`;
};
