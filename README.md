# ProjectMaterialBuilder

项目材料自动生成工作台，用于大学生社会实践、创新创业、竞选答辩、项目申报、策划书制作等场景。

## 功能概览

- 用户端公开页：`/p/[slug]`，普通用户只读访问、复制 Markdown、下载公开材料。
- 管理端后台：`/admin`，管理员登录后管理项目、成员、内容模块、页面布局、主题和公开链接。
- 项目编辑页：`/admin/projects/[id]`，支持实时预览并同步到用户端公开页。
- 本地模板生成：策划书、申报书、答辩稿、PPT 大纲、新闻稿、公众号推文。
- AI 优化生成：服务端 API Route 调用 OpenAI，不在前端暴露 API Key。
- 导出能力：Markdown、Word `.docx`、PPT 大纲 Markdown / JSON。
- 模板库：社会实践、创新创业、竞选答辩、班级活动、实验报告、比赛路演。

## 本地运行

```bash
npm install
npm run dev
```

Windows PowerShell 如果阻止 `npm.ps1`，可使用：

```powershell
npm.cmd run dev
```

本地入口：

```text
http://localhost:3000
http://localhost:3000/admin
http://localhost:3000/p/[slug]
```

## 环境变量

复制 `.env.example` 为 `.env.local`，再填入真实值：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

安全规则：

- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 可以被前端读取。
- `SUPABASE_SERVICE_ROLE_KEY` 只能用于服务端，不能写入前端组件，不能加 `NEXT_PUBLIC_`。
- `OPENAI_API_KEY` 只能用于服务端 API Route，不能写入前端组件，不能加 `NEXT_PUBLIC_`。
- 不要提交 `.env.local` 或任何真实密钥。

## Supabase 配置

1. 在 Supabase 创建新项目。
2. 进入 SQL Editor，执行 `supabase/schema.sql`。
3. 确认已创建以下数据表：
   - `projects`
   - `members`
   - `project_sections`
   - `generated_materials`
4. 确认 Row Level Security 已开启。
5. 在 Authentication 中创建管理员用户，建议第一版使用 Email / Password 登录。
6. 将 Supabase 项目的 URL、anon key、service role key 配置到本地 `.env.local` 或部署平台环境变量中。

公开访问策略：

- 未登录用户可以读取 `status = 'published'` 的项目公开页。
- 管理端 `/admin` 和 `/admin/projects/[id]` 需要 Supabase Auth 登录。
- 后台保存项目后，用户端 `/p/[slug]` 刷新即可看到更新。

## Vercel 部署

1. 将仓库推送到 GitHub。
2. 在 Vercel 导入该 GitHub 仓库。
3. Framework Preset 选择 Next.js。
4. 在 Vercel Project Settings 中配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`（如果需要 AI 生成功能）
5. 部署前先在 Supabase 执行 `supabase/schema.sql`。
6. 部署完成后访问：
   - 用户端公开链接：`https://你的域名/p/[slug]`
   - 管理端后台链接：`https://你的域名/admin`

## Slug 规则

新建项目时会根据项目名称自动生成 slug，并追加短时间戳降低重复概率。slug 规则：

- 只能包含小写英文、数字和连字符。
- 不能以连字符开头或结尾。
- 数据库层有唯一约束。
- 如果重复，后台会提示修改 slug 后再保存。

示例：

```text
项目名称：Project Material Builder
用户端链接：https://你的域名/p/project-material-builder-xxxxx
管理端链接：https://你的域名/admin
```

## 匿名反馈与质量改进

用户端 `/p/[slug]` 提供右下角“反馈问题”入口，并在公开 Markdown 预览区提供生成结果评价。系统还会对导出失败、页面错误、未处理 Promise 异常进行脱敏记录。该模块不是普通访问统计系统，不记录默认页面浏览量。

管理端质量改进入口：

```text
/admin/insights
/admin/feedback
/admin/errors
/admin/suggestions
```

质量改进系统只允许收集非敏感质量数据：匿名 `session_id_hash`、项目 slug / id、页面路由、功能模块、反馈/评价/导出/错误等质量相关操作类型、材料类型、评价结果、问题类型、用户主动填写的反馈、用户主动授权提交的片段、导出状态、脱敏错误摘要、浏览器大致信息、时间戳、模板版本号和应用版本号。

为了让管理员了解产品使用方向，系统还会记录匿名聚合使用画像：项目主题分类、推断使用目的、材料意图、小时段和访问量。该数据只用于 `/admin/insights` 的柱状图和占比图展示，不记录用户身份、IP、精确位置、完整文件内容或生成正文。

系统明确不收集：身份证号、学号、精确地理位置、用户本地文件原文、用户上传的私人文件内容、完整 IP、敏感 Cookie、API Key、任何密钥、用户未授权提交的完整生成材料内容。

第一版自动分析使用本地规则引擎。`analyzeFeedbackWithAI()` 已预留 AI 分析入口；没有 `OPENAI_API_KEY` 时会回退到本地规则。系统不会自动修改生产代码或自动部署，管理员需要在 `/admin/suggestions` 中确认、忽略、标记已解决、创建任务或复制给 Codex 修复。

## 验证命令

```bash
npm run lint
npm run build
npm test
```
