import { NextResponse } from "next/server";
import { AI_MODEL, aiGenerationTypes } from "@/lib/ai-config";
import { createAiPrompt } from "@/lib/ai-prompts";
import type { AiGenerateRequest, AiGenerateResponse, AiGenerationType } from "@/types/ai";

const isGenerationType = (value: unknown): value is AiGenerationType =>
  typeof value === "string" && aiGenerationTypes.some((type) => type.value === value);

const extractOutputText = (payload: unknown) => {
  if (typeof payload !== "object" || payload === null) {
    return "";
  }

  const maybeOutputText = (payload as { output_text?: unknown }).output_text;
  if (typeof maybeOutputText === "string") {
    return maybeOutputText;
  }

  const output = (payload as { output?: Array<{ content?: Array<{ text?: string }> }> }).output;
  return (
    output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter(Boolean)
      .join("\n") ?? ""
  );
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "未配置 OPENAI_API_KEY。请在服务端环境变量中配置后重试。" }, { status: 500 });
  }

  let body: AiGenerateRequest;
  try {
    body = (await request.json()) as AiGenerateRequest;
  } catch {
    return NextResponse.json({ error: "请求格式无效，请刷新页面后重试。" }, { status: 400 });
  }

  if (!isGenerationType(body.type) || !body.data?.project || !body.data?.content || !Array.isArray(body.data.members)) {
    return NextResponse.json({ error: "请求参数不完整，请检查项目资料后重试。" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        input: createAiPrompt(body.type, body.data),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI 生成服务暂时不可用，请稍后重试。" }, { status: response.status });
    }

    const payload = (await response.json()) as unknown;
    const markdown = extractOutputText(payload).trim();

    if (!markdown) {
      return NextResponse.json({ error: "AI 未返回可用内容，请稍后重试。" }, { status: 502 });
    }

    const result: AiGenerateResponse = { markdown, type: body.type };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "AI 调用失败，请检查网络或服务端配置后重试。" }, { status: 500 });
  }
}
