# 项目记忆

## 用户偏好
- 用户注重 UI 细节和视觉效果
- 不喜欢多余的毛玻璃效果
- 看重组件定位和滚动行为的准确性

## 项目信息
- 项目类型：Vue 3 博客系统
- 主要组件：FilterBar（过滤组件）、PostFeed（文章列表）、Pagination（分页）
- 布局特点：使用 CSS Grid 和 Flexbox，支持响应式设计

## 技术架构
- UI 库：ant-design-vue 4.x（消息提示用 `message` from ant-design-vue，不用 element-plus）
- 后端 API 基础路径：`/v1/user`
- 认证方式：JWT Bearer Token，存 localStorage
- 后端地址（开发）：localhost:8888，通过 Vite proxy `/api` 代理
- 响应结构：`{ code, msg, data?, token?, expireTime? }`，code=200 为成功
- 登录方式：密码登录（action=pwd）+ 验证码登录（action=code，自动注册）
- 用户信息字段：id, username, nickname, avatar, status, roles, premium

## 已完成
- 2026-04-11：完成 user 模块 API 接入
  - 配置 Vite proxy 跨域代理（/api → localhost:8888）
  - 修复 request.ts（移除 element-plus 依赖，改用 ant-design-vue message）
  - 重写 apis/user.ts（按接口文档对齐全部9个接口）
  - 创建 stores/user.ts（Pinia 全局用户状态管理）
  - 接入 LoginModal.vue（表单绑定 + 真实 API + 验证码倒计时）
  - 接入 BlogHeader.vue（从 store 读取用户状态 + 退出登录调 API）
  - 接入 ProfileCenter.vue（从 store 读取用户信息，saveChanges 待对接更新API）
