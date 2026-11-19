# 默契圣诞树

中文好友默契小游戏。创建者可以自由设置 1～20 道单选题、每题 2～6 个选项和正确答案，生成邀请链接。访客输入昵称后答题，服务端计算得分，结果存入 D1 数据库；得分决定装饰球在圣诞树上的高度。

## 行为

- 草稿自动保存在当前浏览器。生成后的题库固定，编辑草稿会生成新的树和邀请链接。
- 分享接口只返回题目和选项，不返回正确答案。
- 同一浏览器在同一棵树上保留第一次成绩。清除浏览器数据或更换设备会视作新访客。
- 排行榜读取前 100 条记录；页面列出前 10 位，树上展示前 18 位。
- 体验模式只在浏览器中演示，不写入数据库。
- 网站初次部署为仅自己可见。朋友使用前，需要将网站访问范围改为允许分享。

## 开发

使用 React 界面和 Worker ESM 服务。D1 绑定为 `DB`，数据库表定义在 `db/schema.ts`。`node scripts/build-portable.mjs` 将界面、样式和共享 API 路由打包到 `dist/server/index.js`，通过 Sites 流程发布。界面资源内嵌，无需外部 CDN。

`node scripts/local-preview.mjs` 启动本地预览，SQLite 数据保存在忽略的 `.sites-runtime` 目录。`node scripts/check-built-worker.mjs` 启动构建产物的临时验证服务；`node scripts/check-flow.mjs http://127.0.0.1:5174` 检查该产物的 API 流程。

迁移已由 Drizzle 生成，位于 `drizzle/`，发布时由平台应用。生成新迁移前运行 `node scripts/generate-portable-schema.mjs`，再执行 `node node_modules/drizzle-kit/bin.cjs generate --config .sites-runtime/drizzle.config.cjs`。

`node --test lib/quiz.test.mjs` 验证自定义正确答案、计分以及非法或未完成的答题提交。
