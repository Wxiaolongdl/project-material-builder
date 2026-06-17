type CodexRepairPromptInput = {
  title: string;
  summary: string;
  affected_feature: string;
  suggested_action: string;
  risk_level: string;
  priority: string;
  evidence: Record<string, unknown>;
};

export function buildCodexRepairPrompt(suggestion: CodexRepairPromptInput) {
  const evidence = formatEvidence(suggestion.evidence);
  const route = extractRoute(suggestion.evidence);

  return `请你修复 ProjectMaterialBuilder 中的以下问题：

【问题背景】
${suggestion.title}
${suggestion.summary}

【受影响功能】
${suggestion.affected_feature}

【复现路径】
${route}

【证据摘要】
优先级：${suggestion.priority}
风险等级：${suggestion.risk_level}
相关反馈摘要、错误日志摘要或统计证据：
${evidence}

【期望修复】
${suggestion.suggested_action}
修复后应确保相关功能稳定可用，错误处理友好，并保持匿名反馈与隐私边界不被破坏。

【限制要求】

1. 不要破坏现有用户端 /p/[slug]
2. 不要破坏管理端 /admin
3. 不要破坏 Supabase Auth
4. 不要暴露任何密钥
5. 不要收集敏感数据
6. 保持苹果式 UI 风格

【完成后检查】
请运行：
npm run lint
npm run build

如果有测试命令，也请运行测试。
完成后请说明修改了哪些文件、修复了什么问题、是否还有限制。`;
}

function extractRoute(evidence: Record<string, unknown>) {
  if (typeof evidence.route === "string" && evidence.route.trim()) return evidence.route;
  if (typeof evidence.page === "string" && evidence.page.trim()) return evidence.page;
  return "请根据受影响功能在本地复现；优先检查 /p/[slug]、/admin 和相关导出/生成入口。";
}

function formatEvidence(evidence: Record<string, unknown>) {
  const text = JSON.stringify(evidence, null, 2);
  return text === "{}" ? "暂无结构化证据，请结合质量改进中心中的反馈与错误日志排查。" : text;
}
