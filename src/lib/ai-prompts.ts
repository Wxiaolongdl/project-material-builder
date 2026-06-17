import type { AiGenerationType } from "@/types/ai";
import type { ProjectMaterial } from "@/types/project";

const baseInstruction = `你是高校项目申报、大学生社会实践、创新创业竞赛和答辩材料写作专家。
请使用正式、可信、可直接复制使用的中文 Markdown 输出。
要求：
- 不要编造具体获奖、数据、合作单位或政策文件。
- 如果信息不足，请用“建议补充：...”标出。
- 内容要具体、结构清晰，适合高校评审老师阅读。
- 输出只包含 Markdown 正文，不要解释你做了什么。`;

const dataBlock = (data: ProjectMaterial) => JSON.stringify(data, null, 2);

const prompts: Record<AiGenerationType, string> = {
  plan: `生成一份完整《策划书》。必须包含：项目背景、项目意义、项目目标、团队构成、实施路径、时间安排、预期成果、经费预算、风险控制、总结展望。成员信息和经费预算要适合转成表格。`,
  application: `生成一份正式《申报书核心内容》。语言要符合高校项目申报语境，重点写清申报必要性、建设内容、实施可行性、预期成效和保障措施。`,
  defense: `生成一份《5 分钟答辩稿》。必须按时间段组织：0:00-0:30 开场、0:30-1:30 背景与问题、1:30-2:30 项目方案、2:30-3:30 团队优势、3:30-4:30 成果预期、4:30-5:00 总结。`,
  ppt: `生成一份《PPT 大纲》。控制在 12-16 页，适合 5-8 分钟答辩。每页包含页码、标题、核心内容和建议呈现方式。`,
  news: `生成一篇《高校新闻稿》。符合学院/学校宣传语境，包含标题、导语、正文和后续行动，语气客观正式。`,
  wechat: `生成一篇《公众号推文》。包含标题、导语、正文小标题、项目亮点、团队介绍和结尾号召，表达生动但不夸张。`,
};

export const createAiPrompt = (type: AiGenerationType, data: ProjectMaterial) => `${baseInstruction}

本次生成类型：
${prompts[type]}

项目数据：
\`\`\`json
${dataBlock(data)}
\`\`\``;
