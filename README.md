## 介绍

基于 Shadcn UI 进行二次开发，Shadcn UI 偏向 B 端组件库，C 端能力需要补充

## 开发说明

### 目录

├── src
│ ├── components 组件代码
│ │ ├── index.ts 组件代码通用导出
│ ├── pages demo 代码

### 发布

```bash
# 1. 更新 log
pnpm pkg:update
# 2. 更新 version
pnpm pkg:version
# 3. 提交代码触发自动发版
```
