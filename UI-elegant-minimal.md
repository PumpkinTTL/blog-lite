# UI Elegant Minimal - 设计规范文档

> **风格定位**: 现代轻量玻璃风 · 精致极简 SaaS 风  
> **核心哲学**: Less is more, but less is harder (少即是多，但做到"少"更难)

---

## 📐 设计哲学

### 1. 克制的设计
- 不要大而空，每个元素都有明确功能
- 留白是主角，内容优先
- 像素级的精致感

### 2. 微妙的层次
- 通过阴影、边框、背景色创造深度
- 避免生硬的色块分割
- 毛玻璃效果增加通透感

### 3. 精致的微交互
- 悬停时边框发光 (`border-color` 渐变)
- 微上浮效果 (`translateY(-2px)`)
- 光泽扫过动画 (`::before` 伪元素)

### 4. 克制的配色
- 主背景: 浅灰 (`#fafafa`)
- 卡片: 纯白 (`#ffffff`)
- 强调色: 紫红渐变 (`#d946ef` → `#7c3aed`)
- 文字层级: 深黑 → 灰 → 浅灰

---

## 🎨 配色系统

### 主色调
```css
--accent-primary: #d946ef;      /* 洋红 */
--accent-secondary: #7c3aed;    /* 紫罗兰 */
--accent-gradient: linear-gradient(135deg, #d946ef 0%, #7c3aed 100%);
```

### 背景色
```css
--bg-primary: #fafafa;            /* 页面背景 */
--bg-card: #ffffff;               /* 卡片背景 */
--bg-hover: rgba(192, 38, 211, 0.04); /* 悬停背景 */
```

### 表面色 (Surface)
```css
--surface-50: #f8fafc;
--surface-100: #f1f5f9;
--surface-200: #e2e8f0;
--surface-300: #cbd5e1;
--surface-400: #94a3b8;
--surface-500: #64748b;
--surface-600: #475569;
--surface-700: #334155;
--surface-800: #1e293b;
--surface-900: #0f172a;
```

### 文字色
```css
--text-primary: #0f172a;          /* 标题 */
--text-secondary: #475569;        /* 正文 */
--text-muted: #64748b;            /* 次要文字 */
--text-placeholder: #94a3b8;      /* 占位符 */
```

---

## 🔤 字体系统

### 字体选择
```css
--font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

**Google Fonts 导入:**
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 字号层级
| 用途 | 字号 | 字重 | 行高 |
|------|------|------|------|
| 页面标题 | 48px (3rem) | 700 | 1.1 |
| 区块标题 | 24px (1.5rem) | 700 | 1.3 |
| 卡片标题 | 18px (1.125rem) | 600 | 1.4 |
| 正文 | 14px (0.875rem) | 400 | 1.6 |
| 小字/标签 | 12px (0.75rem) | 500 | 1.5 |
| 微小字 | 10px (0.625rem) | 500 | 1.4 |

---

## 📦 组件规范

### 1. 导航栏 (Navbar)

```css
.navbar {
  height: 56px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* 滚动后出现 */
}
```

**Logo 样式:**
- 尺寸: 28px × 28px
- 圆角: 8px
- 背景: 渐变 `accent-gradient`
- 阴影: `0 4px 12px rgba(217, 70, 239, 0.2)`

### 2. 微卡片 (Micro Card)

```css
.micro-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px; /* 或 16px */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02),
    0 8px 16px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.micro-card:hover {
  border-color: rgba(192, 38, 211, 0.3);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.02),
    0 4px 12px rgba(192, 38, 211, 0.08),
    0 12px 24px rgba(192, 38, 211, 0.06);
  transform: translateY(-2px);
}
```

### 3. 胶囊标签 (Pill)

```css
.pill {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  color: var(--surface-600);
}

/* 激活状态 */
.pill.active {
  background: var(--accent-50);
  border-color: var(--accent-100);
  color: var(--accent-700);
}
```

### 4. 优雅按钮 (Elegant Button)

**主按钮:**
```css
.btn-elegant {
  position: relative;
  background: linear-gradient(135deg, #c026d3 0%, #7c3aed 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  overflow: hidden;
}

/* 光泽扫过效果 */
.btn-elegant::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn-elegant:hover::before {
  left: 100%;
}
```

**幽灵按钮:**
```css
.btn-ghost {
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #475569;
}

.btn-ghost:hover {
  border-color: #c026d3;
  color: #c026d3;
  background: rgba(192, 38, 211, 0.04);
}
```

### 5. 输入框 (Input)

```css
.input-elegant {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.input-elegant:focus {
  border-color: #c026d3;
  box-shadow: 0 0 0 3px rgba(192, 38, 211, 0.1);
  outline: none;
}
```

---

## ✨ 交互规范

### 悬停效果

**导航链接:**
```css
.nav-link {
  position: relative;
  color: #64748b;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: linear-gradient(90deg, #c026d3, #7c3aed);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

**图片缩放:**
```css
.img-zoom {
  overflow: hidden;
}

.img-zoom img {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover .img-zoom img {
  transform: scale(1.05);
}
```

**头像光环:**
```css
.avatar-ring {
  position: relative;
}

.avatar-ring::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c026d3, #7c3aed);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .avatar-ring::after {
  opacity: 1;
}
```

### 过渡动画

**基础过渡:**
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**快速交互:**
```css
transition: all 0.2s ease;
```

**慢速强调:**
```css
transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 📐 布局原则

### 容器宽度
```css
.container {
  max-width: 1152px; /* 72rem / 6xl */
  margin: 0 auto;
  padding: 0 24px;
}
```

### 间距系统
| 名称 | 数值 | 用途 |
|------|------|------|
| xs | 4px | 图标间距 |
| sm | 8px | 紧凑间距 |
| md | 16px | 卡片内边距 |
| lg | 24px | 区块间距 |
| xl | 32px | 大区块间距 |
| 2xl | 48px | Hero 区域 |

### 网格系统
- 移动端: 单列
- 平板: 2 列
- 桌面: 3 列
- 间距: 16px

---

## 🎭 特殊效果

### 噪点纹理
```css
.noise {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.015;
  z-index: 9999;
  background-image: url("data:image/svg+xml,...");
}
```

### 柔和发光
```css
.glow-subtle {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(192, 38, 211, 0.08) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}
```

### 渐变文字
```css
.text-gradient {
  background: linear-gradient(135deg, #c026d3 0%, #7c3aed 50%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 📱 响应式断点

```css
/* 手机 */
@media (max-width: 640px) { }

/* 平板 */
@media (min-width: 640px) and (max-width: 1024px) { }

/* 桌面 */
@media (min-width: 1024px) { }
```

---

## 💡 设计检查清单

- [ ] 背景使用 `#fafafa`，不是纯白
- [ ] 卡片使用 `#ffffff` + 柔和阴影
- [ ] 边框使用 `rgba(226, 232, 240, 0.8)` 半透明白灰
- [ ] 强调色使用紫红渐变，不要纯色
- [ ] 圆角控制在 8-16px，不要太小或太大
- [ ] 文字使用深灰层级，避免纯黑刺眼
- [ ] 交互有微动画，但不要太花哨
- [ ] 悬停效果使用边框发光而非背景变色
- [ ] 每个元素都有明确的功能和层级
- [ ] 留白充足，呼吸感强

---

## 🌟 参考产品

这种风格常见于这些精致的产品：

- **Linear** - 项目管理 (linear.app)
- **Notion** - 文档协作
- **Vercel** - 部署平台
- **Stripe** - 支付系统
- **Raycast** - 效率工具
- **Arc Browser** - 浏览器

---

## 📝 提示词模板

如果你要让别人生成这种风格，可以用这个提示词：

```
创建一个精致的博客首页，使用「UI Elegant Minimal」设计规范：

**风格要求：**
- 浅灰背景 (#fafafa) + 纯白卡片
- 紫红渐变强调色 (#d946ef → #7c3aed)
- 玻璃拟态导航栏 (glass effect)
- Plus Jakarta Sans 字体
- 微卡片设计，柔和多层阴影
- 12-16px 圆角
- 细腻悬停动画（边框发光 + 微上浮）

**布局：**
- 紧凑导航栏 (56px)
- Hero 区域简洁，渐变文字标题
- 3列文章卡片网格
- 充足的留白，呼吸感强

**交互：**
- 导航下划线渐变动画
- 卡片悬停边框发光
- 图片悬停微缩放
- 按钮光泽扫过效果

**参考：** Linear、Notion、Vercel 的精致极简风格
```

---

> 🎯 **核心记忆**: 克制、精致、通透、微交互
