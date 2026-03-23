<template>
  <footer class="footer-refined-final" :class="{ 'dark': isDark }">
    <div class="footer-wrapper">
      <div class="footer-grid">
        <!-- Brand Info -->
        <div class="grid-col brand-info">
          <div class="brand-logo" @click="goHome">
            <div class="logo-box">
              <font-awesome-icon icon="book" />
            </div>
            <div class="logo-text">
              <span class="logo-zh">博客资源中心</span>
              <span class="logo-en">Resource Hub</span>
            </div>
          </div>
          <p class="brand-desc">
            探索无限可能，记录成长的每一小步。建立一个开放、包容且富有灵感的开发者社区。
          </p>
          <div class="social-links">
            <a v-for="social in socials" :key="social.name" :href="social.link" class="social-item">
              <font-awesome-icon :icon="social.icon" />
            </a>
          </div>
        </div>

        <!-- Navigation Columns -->
        <div class="grid-col">
          <h5 class="col-title">资源探索</h5>
          <div class="col-links">
            <router-link v-for="link in linkGroups[0].links" :key="link.text" :to="link.to">
              {{ link.text }}
            </router-link>
          </div>
        </div>

        <div class="grid-col">
          <h5 class="col-title">关于社区</h5>
          <div class="col-links">
            <router-link v-for="link in linkGroups[1].links" :key="link.text" :to="link.to">
              {{ link.text }}
            </router-link>
          </div>
        </div>

        <!-- Integrated Newsletter Column -->
        <div class="grid-col newsletter-col">
          <h5 class="col-title">订阅我们的动态</h5>
          <p class="news-text">第一时间获取精品技术内容与优质资源，我们绝不骚扰。</p>
          
          <!-- INTEGRATED FORM with ICON -->
          <form class="subscribe-form" @submit.prevent="handleSubscribe">
            <div class="form-integrated">
              <div class="prefix-icon">
                <font-awesome-icon icon="envelope" />
              </div>
              <input type="email" placeholder="输入邮箱地址..." required />
              <button type="submit" class="submit-btn-primary">
                <span>立即订阅</span>
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="btn-icon" />
              </button>
            </div>
          </form>

          <div class="contact-mini">
             <font-awesome-icon icon="comment" class="icon-accent" />
             <span>在线支持 (9:00 - 22:00)</span>
          </div>
        </div>
      </div>

      <!-- Bottom Credits Bar -->
      <div class="footer-bottom">
        <div class="bottom-left">
          <span class="copyright">© {{ new Date().getFullYear() }} BlogLite.</span>
          <div class="legal-nav">
             <a href="#">隐私政策</a>
             <span class="sep"></span>
             <a href="#">服务条款</a>
          </div>
        </div>
        <div class="bottom-right">
          <span class="built-info">
            Built with <font-awesome-icon icon="heart" class="heart-pulse" /> for <span class="accent-name">Developers</span>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';

const router = useRouter();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const goHome = () => router.push('/');

const socials = [
  { name: 'Github', icon: ['fab', 'github'], link: '#' },
  { name: 'Twitter', icon: ['fab', 'twitter'], link: '#' },
  { name: 'Discord', icon: ['fab', 'discord'], link: '#' },
  { name: 'RSS', icon: 'rss', link: '#' }
];

const linkGroups = [
  {
    links: [
      { text: '文章归档', to: '/blog' },
      { text: '精选资源', to: '/resources' },
      { text: '技术组件', to: '/components' }
    ]
  },
  {
    links: [
      { text: '作者简介', to: '/about' },
      { text: '反馈中心', to: '/feedback' },
      { text: '加入我们', to: '/join' }
    ]
  }
];

const handleSubscribe = () => { /* Logic */ };
</script>

<style scoped lang="scss">
.footer-refined-final {
  --bg: #ffffff;
  --text: #1e293b;
  --text-soft: #64748b;
  --text-pale: #94a3b8;
  --border: #f1f5f9;

  &.dark {
    --bg: #0f172a;
    --text: #f1f5f9;
    --text-soft: #94a3b8;
    --text-pale: #475569;
    --border: #1e293b;
  }

  position: relative;
  background: var(--bg);
  color: var(--text);
  padding: 48px 0 32px;
  border-top: 1px solid var(--border);
  transition: all 0.3s ease;
  font-family: 'OPPO Sans', sans-serif;
}

.footer-wrapper {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;

  @media (max-width: 1200px) { grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 40px; }
}

.grid-col { display: flex; flex-direction: column; }

/* Brand Segment */
.brand-logo {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px; cursor: pointer;
  .logo-box {
    width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary), #60a5fa);
    color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .logo-text {
    display: flex; flex-direction: column;
    .logo-zh { font-weight: 700; font-size: 16px; color: var(--text); }
    .logo-en { font-size: 9px; font-weight: 600; color: var(--text-pale); text-transform: uppercase; margin-top: -1px; }
  }
}
.brand-desc { font-size: 13.5px; color: var(--text-soft); line-height: 1.6; margin-bottom: 20px; max-width: 280px; }
.social-links {
  display: flex; gap: 10px;
  .social-item {
    width: 34px; height: 34px; border: 1px solid var(--border); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; color: var(--text-pale);
    font-size: 15px; transition: all 0.2s;
    &:hover { border-color: var(--primary); color: var(--primary); background: rgba(59, 130, 246, 0.05); transform: translateY(-3px); }
  }
}

/* Nav Group Columns */
.col-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
.col-links {
  display: flex; flex-direction: column; gap: 10px;
  a { font-size: 13.5px; color: var(--text-soft); font-weight: 500; transition: all 0.2s; width: fit-content; &:hover { color: var(--primary); transform: translateX(4px); } }
}

/* FORM with INTEGRATED BUTTON & ICON */
.newsletter-col {
  .news-text { font-size: 13px; color: var(--text-soft); margin-bottom: 16px; line-height: 1.5; }
  
    .form-integrated {
    display: flex;
    align-items: center;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 2px 4px;
    height: 48px;
    transition: all 0.2s;
    
    &:focus-within {
      border-color: var(--primary);
    }

    .prefix-icon {
      padding: 0 12px 0 14px;
      color: var(--text-pale);
      font-size: 14px;
    }

    input {
      flex: 1;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      font-size: 13px;
      color: var(--text);
    }

    .submit-btn-primary {
      height: 38px;
      padding: 0 16px;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 9px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover { filter: brightness(1.1); transform: none; }
      &:active { transform: scale(0.96); }

      .btn-icon { 
        width: 14px !important; 
        height: 14px !important; 
        flex-shrink: 0;
        display: inline-block;
        vertical-align: middle;
        fill: white !important;
        background: transparent !important;
        margin-top: -1px; 
      }
    }
  }

  .contact-mini {
    margin-top: 16px;
    display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; color: var(--text-soft);
    .icon-accent { color: #14b8a6; }
  }
}

/* Bottom Bar */
.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: var(--text-pale);

  @media (max-width: 640px) { flex-direction: column; gap: 12px; text-align: center; }

  .bottom-left {
    display: flex; align-items: center; gap: 16px;
    .legal-nav {
      display: flex; gap: 10px; align-items: center;
      .sep { width: 3px; height: 3px; background: var(--text-pale); border-radius: 50%; opacity: 0.3; }
      a:hover { color: var(--text-soft); }
    }
  }

  .built-info {
    font-weight: 600;
    .heart-pulse { color: #f43f5e; margin: 0 2px; animation: heartbeat 1.5s infinite; }
    .accent-name { color: var(--text-soft); font-weight: 700; }
  }
}

@keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
</style>
