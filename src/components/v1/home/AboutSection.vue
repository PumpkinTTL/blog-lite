<template>
  <section id="about" ref="aboutRef" class="about-section" :class="{ 'dark-mode': isDark }">
    <!-- Header -->
    <div
      :class="[
        'section-header',
        { 'animate__animated animate__fadeInUp': animated }
      ]"
      style="animation-delay: 0.2s"
    >
      <div class="header-content">
        <div class="badge">关于我们</div>
        <h2 class="title">探索技术与创意的边界</h2>
        <p class="subtitle">
          我们致力于打造一个极致、高品质的技术资源分享社区，为每一位开发者提供最前沿的灵感与支持。
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-container">
      <div 
        v-for="(stat, index) in stats" 
        :key="stat.label"
        :class="[
          'stat-card',
          { 'animate__animated animate__zoomIn': animated }
        ]"
        :style="{ animationDelay: `${0.4 + index * 0.1}s` }"
      >
        <div class="stat-icon-wrapper" :style="{ background: stat.color + '15' }">
          <font-awesome-icon :icon="stat.icon" :style="{ color: stat.color }" class="stat-icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="about-main-grid">
      <!-- Left side: Story/Philosophy -->
      <div 
        :class="[
          'about-story',
          { 'animate__animated animate__fadeInLeft': animated }
        ]"
        style="animation-delay: 0.7s"
      >
        <div class="story-card">
          <div class="card-glow"></div>
          <h3 class="story-title">我们的愿景</h3>
          <p class="story-text">
            在这个信息爆炸的时代，我们相信知识的深度胜过广度。Blog-Lite 不仅仅是一个博客系统，它是一个不断生长的生态，连接着对技术有追求的灵魂。
          </p>
          <p class="story-text">
            从第一行代码到现在的全功能社区，我们始终坚持「品质优先」的原则，确保每一份资源、每一篇文章都能为用户带来真实的价值。
          </p>
          <div class="story-footer">
            <div class="founding-date">
              <font-awesome-icon icon="calendar-days" class="mr-2 opacity-60" />
              始于 2024 · 持续连接中
            </div>
            <div class="social-links">
              <a href="#" class="social-icon"><font-awesome-icon :icon="['fab', 'github']" /></a>
              <a href="#" class="social-icon"><font-awesome-icon :icon="['fab', 'twitter']" /></a>
              <a href="#" class="social-icon"><font-awesome-icon :icon="['fab', 'discord']" /></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Core Values -->
      <div class="values-grid">
        <div 
          v-for="(value, index) in coreValues" 
          :key="value.title"
          :class="[
            'value-card',
            { 'animate__animated animate__fadeInRight': animated }
          ]"
          :style="{ animationDelay: `${0.8 + index * 0.1}s` }"
        >
          <div class="value-icon">
            <font-awesome-icon :icon="value.icon" />
          </div>
          <div class="value-content">
            <h4 class="value-title">{{ value.title }}</h4>
            <p class="value-desc">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Community Banner -->
    <div 
      :class="[
        'community-banner',
        { 'animate__animated animate__fadeInUp': animated }
      ]"
      style="animation-delay: 1.2s"
    >
      <div class="banner-content">
        <div class="banner-text">
          <h3 class="banner-title">加入我们的开发者社区</h3>
          <p class="banner-desc">与数千名开发者交流、学习，共同构建更美好的互联网世界。</p>
        </div>
        <button class="join-btn">
          立即加入
          <font-awesome-icon icon="paper-plane" class="ml-2" />
        </button>
      </div>
      <!-- Decorative Elements -->
      <div class="decor-circle circle-1"></div>
      <div class="decor-circle circle-2"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const aboutRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );

  if (aboutRef.value) {
    observer.observe(aboutRef.value);
  }
});

// Rename animated to something else to avoid confusion or just use isVisible
const animated = computed(() => isVisible.value);

const stats = [
  { label: "活跃资源", value: "2.4k+", icon: "box-open", color: "#3b82f6" },
  { label: "注册用户", value: "18k+", icon: "users", color: "#a855f7" },
  { label: "每日访问", value: "50k+", icon: "chart-line", color: "#10b981" },
  { label: "精品内容", value: "1.2k+", icon: "gem", color: "#f59e0b" },
];

const coreValues = [
  { 
    title: "极简主义", 
    desc: "我们摒弃冗余，只保留最核心的价值，确保用户体验纯净且高效。", 
    icon: "bolt" 
  },
  { 
    title: "开放资源", 
    desc: "高质量的模板、插件与代码片段，助力开发者跳过繁琐环节，专注创意实现。", 
    icon: "code" 
  },
  { 
    title: "智能推荐", 
    desc: "基于兴趣的学习路径推荐，让每一位用户都能在知识海洋中精准定位。", 
    icon: "robot" 
  },
  { 
    title: "极致安全", 
    desc: "严苛的审核机制与安全策略，确保每一份下载与交互都令人安心。", 
    icon: "shield-halved" 
  }
];
</script>

<style scoped lang="scss">
.about-section {
  padding: 80px 0 100px;
  scroll-margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

/* Header */
.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.badge {
  padding: 6px 16px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-size: 12px;
  font-weight: 800;
  border-radius: 99px;
  letter-spacing: 0.1em;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.title {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.subtitle {
  margin: 0;
  font-size: 16px;
  color: #64748b;
  max-width: 600px;
  line-height: 1.6;
}

/* Stats */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 30px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);

  &:hover {
    transform: translateY(-5px);
    background: white;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
    border-color: rgba(59, 130, 246, 0.3);
  }
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

/* Main Grid */
.about-main-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.story-card {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 50px;
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    padding: 30px;
  }
}

.card-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  z-index: 0;
}

.story-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 24px;
  color: #0f172a;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 4px;
    background: #3b82f6;
    border-radius: 2px;
  }
}

.story-text {
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.story-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #f1f5f9;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
}

.founding-date {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #0f172a;
    color: white;
    transform: translateY(-3px);
  }
}

/* Values Grid */
.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.value-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  gap: 20px;
  transition: all 0.3s;

  &:hover {
    background: white;
    border-color: #3b82f640;
    transform: translateX(10px);
  }
}

.value-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.value-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #1e293b;
}

.value-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Community Banner */
.community-banner {
  margin-top: 40px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 60px;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);

  @media (max-width: 768px) {
    padding: 40px;
  }
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
}

.banner-title {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0 0 12px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
}

.banner-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 500px;
}

.join-btn {
  padding: 16px 36px;
  background: white;
  color: #0f172a;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    background: #f8fafc;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  }
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: rgba(59, 130, 246, 0.15);
  top: -150px;
  left: -50px;
}

.circle-2 {
  width: 250px;
  height: 250px;
  background: rgba(168, 85, 247, 0.15);
  bottom: -125px;
  right: -25px;
}

/* Dark Mode Overrides */
.dark-mode {
  .title {
    background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }

  .subtitle {
    color: #94a3b8;
  }

  .stat-card {
    background: #1e293b90;
    border-color: #334155;
    
    &:hover {
      background: #1e293b;
      border-color: #3b82f660;
    }
  }

  .stat-value {
    color: #f1f5f9;
  }

  .stat-label {
    color: #94a3b8;
  }

  .story-card {
    background: #1e293b;
    border-color: #334155;
  }

  .story-title {
    color: #f1f5f9;
  }

  .story-text {
    color: #cbd5e1;
  }

  .story-footer {
    border-color: #334155;
  }

  .social-icon {
    background: #0f172a;
    border-color: #334155;
    color: #94a3b8;

    &:hover {
      background: #3b82f6;
      color: white;
    }
  }

  .value-card {
    background: #1e293b60;
    border-color: #334155;

    &:hover {
      background: #1e293b;
      border-color: #3b82f640;
    }
  }

  .value-icon {
    background: #0f172a;
    border-color: #334155;
  }

  .value-title {
    color: #f1f5f9;
  }

  .value-desc {
    color: #94a3b8;
  }

  .community-banner {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid #334155;
  }
}
</style>
