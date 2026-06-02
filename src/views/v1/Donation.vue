<template>
  <div class="donation-page" :class="{ 'dark-mode': isDark }">
    <!-- 奢华背景微流光 -->
    <div class="decorations">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="glow-orb orb-3"></div>
    </div>

    <div class="donation-container animate__animated animate__fadeIn">
      <!-- 极简而有力的标题栏 -->
      <header class="donation-header">
        <div class="header-badge">
          <svg viewBox="0 0 24 24" class="badge-svg-icon" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span>Sponsor Program</span>
        </div>
        <h1 class="header-title">
          支持 <span class="text-gradient">博客的持续创作</span>
        </h1>
        <p class="header-subtitle">
          您的赞助支持将用于服务器硬件扩容与高品质开源资源的开发。所有的资金流向与使用记录均公开透明。
        </p>
      </header>

      <!-- 数据面板看板 (高质感，轻盈化) -->
      <section class="stats-grid">
        <div class="stats-card">
          <div class="stats-icon-wrapper amt-color">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="stats-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.251.11a3.375 3.375 0 004.496-2.253h1.007-1.007a3.375 3.375 0 00-4.496-2.252h.008zm0-.002a3.375 3.375 0 014.496-2.253h1.007-1.007a3.375 3.375 0 00-4.496-2.252h.008z" />
            </svg>
          </div>
          <div class="stats-info">
            <span class="stats-label">累计确认赞助</span>
            <h3 class="stats-val">
              <span class="currency-symbol">¥</span>{{ formatNumber(stats.totalAmount) }}
            </h3>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-icon-wrapper people-color">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="stats-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M3 19.128v-.003c0-1.113.285-2.16.786-3.07M3 19.128v.109A11.386 11.386 0 008.5 20M12 11.625a3 3 0 100-6 3 3 0 000 6zm0 0a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
          <div class="stats-info">
            <span class="stats-label">赞助伙伴人次</span>
            <h3 class="stats-val">{{ stats.totalDonors }}<span class="unit">次</span></h3>
          </div>
        </div>

        <!-- 极具金属奢华质感的黑金VIP卡片 -->
        <div class="stats-card vip-platinum-card">
          <div class="platinum-shimmer"></div>
          <div class="stats-icon-wrapper crown-color">
            <font-awesome-icon icon="crown" />
          </div>
          <div class="stats-info">
            <span class="stats-label gold-tag">SPONSOR VIP</span>
            <h3 class="stats-val gold-title">单次赞助达 ¥50 获专属 VIP</h3>
          </div>
        </div>
      </section>

      <!-- Apple Segmented Control 选项卡 -->
      <div class="segmented-wrapper">
        <div class="segmented-bar">
          <div class="segmented-slider" :style="tabSliderStyle"></div>
          <button
            class="segment-item"
            :class="{ active: activeTab === 'pay' }"
            @click="activeTab = 'pay'"
            ref="payTabRef"
          >
            <font-awesome-icon icon="shopping-bag" class="tab-icon" />
            <span>获取通道</span>
          </button>
          <button
            class="segment-item"
            :class="{ active: activeTab === 'wall' }"
            @click="activeTab = 'wall'"
            ref="wallTabRef"
          >
            <font-awesome-icon icon="gem" class="tab-icon" />
            <span>赞助荣誉墙</span>
          </button>
        </div>
      </div>

      <!-- ====== 选项卡一：我要赞助 ====== -->
      <div v-if="activeTab === 'pay'" class="tab-content animate__animated animate__fadeIn">
        <div class="sponsor-layout">
          <!-- 1. 选择支付方式与展示码 -->
          <div class="setup-pay-card glass-panel">
            <h3 class="panel-headline">1. 赞助支付通道</h3>
            
            <!-- 扁平高档横向 Pill 导航 -->
            <div class="pill-selector">
              <button
                class="pill-btn"
                :class="{ active: payForm.payMethod === 'alipay' }"
                @click="payForm.payMethod = 'alipay'"
              >
                <!-- 支付宝图标 -->
                <svg viewBox="0 0 1024 1024" class="pill-svg-icon" fill="currentColor">
                  <path d="M784 153.2H240c-47.5 0-86 38.5-86 86v544c0 47.5 38.5 86 86 86h544c47.5 0 86-38.5 86-86V239.2c0-47.5-38.5-86-86-86zM461.3 676.8H346.7V561c0-11-9-20-20-20h-34c-11 0-20 9-20 20v115.8H187c-11 0-20 9-20 20v35.4c0 11 9 20 20 20h85.7c26 69.1 76.5 120.7 151.6 154.8 6.9 3.1 14.9 1 19.3-5l23-31.3c4.2-5.7 2.8-13.6-3.1-17.5-56-36.9-90.8-77.9-106.8-121h104.7c11 0 20-9 20-20v-35.4c0-11-9-20-20-20z m382.4 122.9H667.6c-48 0-93.5-3.3-136.2-9.9v-76.3c45.9 8.2 92.5 12.3 139.9 12.3h172.4c11 0 20-9 20-20v-35.4c0-11-9-20-20-20H694c-85.9 0-165.7-18-239-53.9-6-2.9-13.1-1.8-17.8 2.8l-26.6 26.6c-5.2 5.2-5.5 13.7-0.7 19.2 87 99.8 198.8 152 335.7 156.4 11 0.4 20-8.2 20-19.2V819c0-10.7-8.9-19.3-19.9-19.3z" fill="#1677ff"/>
                </svg>
                <span>支付宝</span>
              </button>

              <button
                class="pill-btn"
                :class="{ active: payForm.payMethod === 'wechat' }"
                @click="payForm.payMethod = 'wechat'"
              >
                <!-- 微信图标 -->
                <svg viewBox="0 0 1024 1024" class="pill-svg-icon" fill="currentColor">
                  <path d="M578.4 163.6c-175.7 0-318.1 121.7-318.1 271.8 0 83.2 44.1 157.9 114.7 209.6 15 11 9.8 24.3 7.2 33.7l-15 54.4c-3.1 11.2-9.8 13.8 0 8.8l70.1-34.9c9.8-5 21.8-2.6 31.9 2.5 35 17.5 74.3 27.2 115.8 27.2 7.7 0 15.3-0.3 22.9-0.8-13.8-31-21.7-65-21.7-100.8 0-149.2 142.1-270.2 317.4-270.2 3.1 0 6.2 0.1 9.3 0.2 0.3-0.7 0.6-1.3 0.9-2-5.5-112.5-151.7-199.5-335.5-199.5z m-149.6 136c-19.7 0-35.6-15.9-35.6-35.6s15.9-35.6 35.6-35.6c19.7 0 35.6 15.9 35.6 35.6s-15.9 35.6-35.6 35.6zm199.5 0c-19.7 0-35.6-15.9-35.6-35.6s15.9-35.6 35.6-35.6c19.7 0 35.6 15.9 35.6 35.6s-15.9 35.6-35.6 35.6z m316 230c0-128-121.8-231.8-272.2-231.8S399.9 401.6 399.9 529.6s121.8 231.8 272.2 231.8c35.6 0 69.3-8.3 99.2-23.2 8.7-4.3 19-2.2 27.4 2l60 29.8c8.4 4.2 13.8 2.1 5.3-6.4l-12.8-46.4c-2.2-8.1-1.6-19.3 4.9-24 60.1-44.1 97.7-107.9 97.7-178.6z m-346.7 82c-15 0-27.2-12.2-27.2-27.2s12.2-27.2 27.2-27.2S654.5 515.2 654.5 530.2 642.3 557.2 627.3 557.2z m149.4 0c-15 0-27.2-12.2-27.2-27.2s12.2-27.2 27.2-27.2 27.2 12.2 27.2 27.2S791.7 557.2 776.7 557.2z" fill="#07c160"/>
                </svg>
                <span>微信支付</span>
              </button>

              <button
                class="pill-btn"
                :class="{ active: payForm.payMethod === 'crypto' }"
                @click="payForm.payMethod = 'crypto'"
              >
                <!-- USDT 图标 -->
                <svg viewBox="0 0 2000 2000" class="pill-svg-icon">
                  <circle cx="1000" cy="1000" r="1000" fill="#26a17b"/>
                  <path fill="#fff" d="M1168 834v-88h299v-193H533v193h299v88C564 845 367 879 367 920c0 40 197 75 465 86v567h236v-567c268-11 465-46 465-86 0-41-197-75-465-86zm0 157v-6c-11 1-32 3-84 5-41 1-62 1-84 1-22 0-44 0-83-1-53-2-74-4-85-5v6c-214-9-368-35-368-55 0-21 154-47 368-55v78c11 1 32 3 85 5 21 0 43 1 83 1s62-1 84-1c52-2 73-4 84-5v-78c214 8 368 34 368 55 0 20-154 46-368 55z"/>
                </svg>
                <span>加密货币</span>
              </button>
            </div>

            <!-- 收款媒介展示容器 -->
            <div class="interactive-pay-window">
              <div v-if="payForm.payMethod === 'alipay' || payForm.payMethod === 'wechat'" class="qrcode-wrapper">
                <!-- 高端拟真扫码框 -->
                <div class="high-tech-scanner">
                  <!-- 四角扫描标 -->
                  <div class="g-corner tc-l"></div>
                  <div class="g-corner tc-r"></div>
                  <div class="g-corner bc-l"></div>
                  <div class="g-corner bc-r"></div>
                  <!-- 动态极光线 -->
                  <div class="laser-scanner" :class="payForm.payMethod"></div>
                  
                  <div class="mock-qr-matrix">
                    <svg viewBox="0 0 100 100" class="qr-svg-matrix" :class="payForm.payMethod">
                      <path d="M0 0h30v30H0zm40 0h20v20H40zm30 0h30v30H70zm0 40h20v20H70zm-30 0h20v20H40zm-40 30h30v30H0zM10 10h10v10H10zm70 0h10v10H80zM10 80h10v10H10z" fill="currentColor"/>
                      <circle cx="50" cy="50" r="10" fill="currentColor" />
                    </svg>
                    <span class="matrix-brand">{{ payForm.payMethod === 'alipay' ? '支付宝转账码' : '微信支付码' }}</span>
                  </div>
                </div>
                <p class="viewer-note">请使用对应App扫描上述赞助付款码</p>
              </div>

              <!-- 加密货币专属 De-Fi 面板 -->
              <div v-if="payForm.payMethod === 'crypto'" class="crypto-card-view">
                <!-- 链选择区 -->
                <div class="chain-pills-row">
                  <span class="row-label">公链网络:</span>
                  <div class="pill-group">
                    <button
                      v-for="net in ['TRC20', 'BSC', 'POL']"
                      :key="net"
                      class="chain-pill"
                      :class="{ active: cryptoNetwork === net }"
                      @click="cryptoNetwork = net"
                    >
                      <!-- 注入对应链的高清 SVG Logo -->
                      <svg v-if="net === 'TRC20'" class="chain-svg-logo" viewBox="0 0 120 120">
                        <path fill="#eb0029" d="M60 15L20 85h80z"/>
                        <path fill="#fff" d="M60 40L35 80h50z"/>
                      </svg>
                      <svg v-if="net === 'BSC'" class="chain-svg-logo" viewBox="0 0 120 120">
                        <path fill="#f0b90b" d="M60 120l-17.7-17.7L60 84.7l17.7 17.6zM24.7 84.7L7 67 24.7 49.3 42.3 67zM95.3 84.7L77.7 67l17.6-17.7L113 67zm-35.3-35L42.3 67.3l17.7 17.7 17.7-17.7zM60 0l17.7 17.7L60 35.3 42.3 17.7z"/>
                      </svg>
                      <svg v-if="net === 'POL'" class="chain-svg-logo" viewBox="0 0 24 24">
                        <path fill="#8247e5" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <span>{{ net }}</span>
                    </button>
                  </div>
                </div>

                <!-- 复制块 -->
                <div class="address-copy-deck">
                  <div class="address-strip">
                    <div class="net-indicator-label" :class="cryptoNetwork">
                      <span>{{ cryptoNetwork }}</span>
                    </div>
                    <code class="addr-val">{{ getCryptoAddress(cryptoNetwork) }}</code>
                    <button class="addr-copy-action" @click="copyAddress(getCryptoAddress(cryptoNetwork))">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="copy-svg-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                      </svg>
                      <span>复制</span>
                    </button>
                  </div>
                  <div class="note-box">
                    <span class="warning-highlight">警告:</span>
                    <span>请勿通过非 {{ cryptoNetwork }} 网络向此地址转账，否则代币将永久灭失。首选 <strong class="usdt-green">USDT</strong> 转账。</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 登记赞助信息 (极致触感输入表单) -->
          <div class="registration-form-card glass-panel">
            <h3 class="panel-headline">2. 登记赞助数据</h3>
            <p class="panel-subtitle">为保障荣誉墙即时更新，转账完成后请准确录入信息供系统校验。</p>

            <form @submit.prevent="handleFormSubmit" class="tactile-form">
              <div class="form-row-2col">
                <div class="field-item">
                  <label class="field-label required">赞助人昵称</label>
                  <div class="tactile-input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="field-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 01-7.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <input
                      v-model="payForm.donorName"
                      type="text"
                      placeholder="支持匿名称呼"
                      required
                    />
                  </div>
                </div>

                <div class="field-item">
                  <label class="field-label required">实付金额 (CNY/USDT)</label>
                  <div class="tactile-input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="field-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.251.11a3.375 3.375 0 004.496-2.253h1.007-1.007a3.375 3.375 0 00-4.496-2.252h.008zm0-.002a3.375 3.375 0 014.496-2.253h1.007-1.007a3.375 3.375 0 00-4.496-2.252h.008z" />
                    </svg>
                    <input
                      v-model.number="payForm.amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="赞助数额"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="form-row-2col">
                <div class="field-item">
                  <label class="field-label">电子邮箱 (VIP发放与回信联系)</label>
                  <div class="tactile-input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="field-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <input
                      v-model="payForm.donorEmail"
                      type="email"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div class="field-item">
                  <label class="field-label">转账流水号 / 交易 Hash</label>
                  <div class="tactile-input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="field-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                    <input
                      v-model="payForm.tradeNo"
                      type="text"
                      placeholder="支付凭证流水号"
                    />
                  </div>
                </div>
              </div>

              <div class="field-item">
                <label class="field-label">附言 / 悄悄话</label>
                <div class="tactile-textarea-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="field-icon text-area-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  <textarea
                    v-model="payForm.message"
                    rows="3"
                    placeholder="您对博客的建议，或是想对站长留下的温馨附言..."
                  ></textarea>
                </div>
              </div>

              <button type="submit" class="glare-submit-btn" :disabled="formSubmitting">
                <font-awesome-icon icon="spinner" spin v-if="formSubmitting" />
                <span v-else>确认提交赞助登记</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- ====== 选项卡二：赞助荣誉墙 ====== -->
      <div v-else class="tab-content animate__animated animate__fadeIn">
        <!-- 条件筛选面板 -->
        <div class="honor-toolbar glass-panel">
          <div class="search-bar-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="search-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="输入赞助伙伴昵称查找..."
            />
          </div>

          <div class="options-wrap">
            <div class="opt-box">
              <span class="opt-label">筛选渠道:</span>
              <select v-model="filterPayMethod">
                <option value="all">全部方式</option>
                <option value="alipay">支付宝</option>
                <option value="wechat">微信支付</option>
                <option value="crypto">加密货币</option>
              </select>
            </div>

            <div class="opt-box">
              <span class="opt-label">排序顺序:</span>
              <select v-model="sortBy">
                <option value="date_desc">最新登记</option>
                <option value="amount_desc">最高金额</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 列表载入态 -->
        <div class="loading-state" v-if="wallLoading">
          <font-awesome-icon icon="spinner" spin class="spinner-icon" />
          <span>正在加载赞助人名册...</span>
        </div>

        <div v-else>
          <!-- 空白状态 -->
          <div v-if="filteredRecords.length === 0" class="empty-state glass-panel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <h4>暂无赞助荣誉数据</h4>
            <p>感谢关注，虚位以待，期待您的名字出现在这里。</p>
          </div>

          <!-- 精致统一的荣誉墙网格（解决卡片底色不一，杜绝斜体） -->
          <div v-else class="honor-wall-grid">
            <div
              v-for="record in filteredRecords"
              :key="record.id"
              class="donor-box-card"
              :class="{ 'golden-vip-card': record.amount >= 50 }"
            >
              <!-- 顶部主体 -->
              <div class="card-head">
                <div class="avatar-ring-wrap">
                  <img
                    :src="record.donorAvatar || defaultAvatar(record.donorName)"
                    alt="Sponsor Avatar"
                    class="avatar-img"
                  />
                  <!-- 金色小皇冠徽章 -->
                  <div class="crown-overlay" v-if="record.amount >= 50">
                    <font-awesome-icon icon="crown" />
                  </div>
                </div>

                <div class="identity-block">
                  <span class="name-span" :class="{ 'gold-name': record.amount >= 50 }">
                    {{ record.donorName }}
                  </span>
                  <span class="time-span">{{ formatDate(record.createdAt) }}</span>
                </div>

                <!-- 实得金额 -->
                <div class="amt-badge" :class="record.payMethod">
                  <span>¥{{ formatNumber(record.amount) }}</span>
                </div>
              </div>

              <!-- 留言文本（杜绝斜体，统一采用常规体） -->
              <div class="message-container">
                <p class="quote-text">
                  {{ record.message || '默默赞助支持了博客的发展，没有留下多余的留言。' }}
                </p>
              </div>

              <!-- 底部状态与渠道 -->
              <div class="card-foot">
                <div class="method-indicator">
                  <!-- 注入专属 SVGs -->
                  <svg v-if="record.payMethod === 'alipay'" class="pay-badge-svg" viewBox="0 0 1024 1024">
                    <path d="M784 153.2H240c-47.5 0-86 38.5-86 86v544c0 47.5 38.5 86 86 86h544c47.5 0 86-38.5 86-86V239.2c0-47.5-38.5-86-86-86zM461.3 676.8H346.7V561c0-11-9-20-20-20h-34c-11 0-20 9-20 20v115.8H187c-11 0-20 9-20 20v35.4c0 11 9 20 20 20h85.7c26 69.1 76.5 120.7 151.6 154.8 6.9 3.1 14.9 1 19.3-5l23-31.3c4.2-5.7 2.8-13.6-3.1-17.5-56-36.9-90.8-77.9-106.8-121h104.7c11 0 20-9 20-20v-35.4c0-11-9-20-20-20z m382.4 122.9H667.6c-48 0-93.5-3.3-136.2-9.9v-76.3c45.9 8.2 92.5 12.3 139.9 12.3h172.4c11 0 20-9 20-20v-35.4c0-11-9-20-20-20H694c-85.9 0-165.7-18-239-53.9-6-2.9-13.1-1.8-17.8 2.8l-26.6 26.6c-5.2 5.2-5.5 13.7-0.7 19.2 87 99.8 198.8 152 335.7 156.4 11 0.4 20-8.2 20-19.2V819c0-10.7-8.9-19.3-19.9-19.3z" fill="#1677ff"/>
                  </svg>
                  <svg v-else-if="record.payMethod === 'wechat'" class="pay-badge-svg" viewBox="0 0 1024 1024">
                    <path d="M578.4 163.6c-175.7 0-318.1 121.7-318.1 271.8 0 83.2 44.1 157.9 114.7 209.6 15 11 9.8 24.3 7.2 33.7l-15 54.4c-3.1 11.2-9.8 13.8 0 8.8l70.1-34.9c9.8-5 21.8-2.6 31.9 2.5 35 17.5 74.3 27.2 115.8 27.2 7.7 0 15.3-0.3 22.9-0.8-13.8-31-21.7-65-21.7-100.8 0-149.2 142.1-270.2 317.4-270.2 3.1 0 6.2 0.1 9.3 0.2 0.3-0.7 0.6-1.3 0.9-2-5.5-112.5-151.7-199.5-335.5-199.5z m-149.6 136c-19.7 0-35.6-15.9-35.6-35.6s15.9-35.6 35.6-35.6c19.7 0 35.6 15.9 35.6 35.6s-15.9 35.6-35.6 35.6zm199.5 0c-19.7 0-35.6-15.9-35.6-35.6s15.9-35.6 35.6-35.6c19.7 0 35.6 15.9 35.6 35.6s-15.9 35.6-35.6 35.6z m316 230c0-128-121.8-231.8-272.2-231.8S399.9 401.6 399.9 529.6s121.8 231.8 272.2 231.8c35.6 0 69.3-8.3 99.2-23.2 8.7-4.3 19-2.2 27.4 2l60 29.8c8.4 4.2 13.8 2.1 5.3-6.4l-12.8-46.4c-2.2-8.1-1.6-19.3 4.9-24 60.1-44.1 97.7-107.9 97.7-178.6z m-346.7 82c-15 0-27.2-12.2-27.2-27.2s12.2-27.2 27.2-27.2S654.5 515.2 654.5 530.2 642.3 557.2 627.3 557.2z m149.4 0c-15 0-27.2-12.2-27.2-27.2s12.2-27.2 27.2-27.2 27.2 12.2 27.2 27.2S791.7 557.2 776.7 557.2z" fill="#07c160"/>
                  </svg>
                  <svg v-else-if="record.payMethod === 'crypto'" class="pay-badge-svg" viewBox="0 0 2000 2000">
                    <circle cx="1000" cy="1000" r="1000" fill="#26a17b"/>
                    <path fill="#fff" d="M1168 834v-88h299v-193H533v193h299v88C564 845 367 879 367 920c0 40 197 75 465 86v567h236v-567c268-11 465-46 465-86 0-41-197-75-465-86zm0 157v-6c-11 1-32 3-84 5-41 1-62 1-84 1-22 0-44 0-83-1-53-2-74-4-85-5v6c-214-9-368-35-368-55 0-21 154-47 368-55v78c11 1 32 3 85 5 21 0 43 1 83 1s62-1 84-1c52-2 73-4 84-5v-78c214 8 368 34 368 55 0 20-154 46-368 55z"/>
                  </svg>
                  <span>{{ getMethodName(record.payMethod) }}</span>
                </div>

                <span class="status-pill" :class="'status-' + record.status">
                  {{ record.status === 0 ? '核对中' : record.status === 1 ? '已确认' : '已退款' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'
import {
  getDonations,
  getDonationStats,
  submitDonation,
  type DonationRecord,
  type DonationStats,
  type PayMethod,
  type CryptoNetwork
} from '@/apis/donation'

// 主题与标签
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const activeTab = ref<'pay' | 'wall'>('pay')

const payTabRef = ref<HTMLElement | null>(null)
const wallTabRef = ref<HTMLElement | null>(null)

// iOS 滑块动画定位
const tabSliderStyle = computed(() => {
  const isPay = activeTab.value === 'pay'
  const activeEl = isPay ? payTabRef.value : wallTabRef.value
  if (!activeEl) return {}
  return {
    transform: `translateX(${activeEl.offsetLeft}px)`,
    width: `${activeEl.offsetWidth}px`,
    height: `${activeEl.offsetHeight}px`
  }
})

// 默认看板数据
const stats = ref<DonationStats>({
  totalAmount: 5280.00,
  totalDonors: 128
})

const rawRecords = ref<DonationRecord[]>([])
const wallLoading = ref(false)

// 过滤筛选
const searchQuery = ref('')
const filterPayMethod = ref<string>('all')
const sortBy = ref<'date_desc' | 'amount_desc'>('date_desc')

const cryptoNetwork = ref<string>('TRC20')

// 自助登记表单
const formSubmitting = ref(false)
const payForm = ref({
  donorName: '',
  donorEmail: '',
  amount: undefined as number | undefined,
  payMethod: 'alipay' as PayMethod,
  tradeNo: '',
  message: ''
})

const getCryptoAddress = (network: string) => {
  switch (network) {
    case 'TRC20': return 'TY3n9YqcrU2fPqEa5G6N8p8Ww4xS1vBf8A'
    case 'BSC': return '0x889c279c13ee42bc942ee4187f54c2058b8f3ef8'
    case 'POL': return '0x889c279c13ee42bc942ee4187f54c2058b8f3ef8'
    default: return 'TY3n9YqcrU2fPqEa5G6N8p8Ww4xS1vBf8A'
  }
}

const copyAddress = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success('收款地址已成功复制，感谢支持！')
  } catch (err) {
    message.error('浏览器拒绝复制，请手动选中地址进行复制。')
  }
}

const getMockDonors = (): DonationRecord[] => {
  return [
    {
      id: -1,
      donorName: '极客范代码侠',
      donorAvatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=geek&backgroundColor=b6e3f4',
      donorEmail: null,
      amount: 199.00,
      currency: 'CNY',
      payMethod: 'wechat',
      cryptoNetwork: null,
      cryptoTxHash: null,
      cryptoFrom: null,
      cryptoTo: null,
      message: '前端专栏的内容极其有用，学到了很多高级的 Vue 3 实战技巧。大力支持作者！',
      tradeNo: null,
      status: 1,
      isVisible: 1,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: -2,
      donorName: 'Web3_Explorer',
      donorAvatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=web3&backgroundColor=ffdf7a',
      donorEmail: null,
      amount: 66.00,
      currency: 'CNY',
      payMethod: 'crypto',
      cryptoNetwork: 'TRC20',
      cryptoTxHash: '0x3ef9...',
      cryptoFrom: null,
      cryptoTo: null,
      message: 'Great open source sharing! Transferred via TRC20.',
      tradeNo: null,
      status: 1,
      isVisible: 1,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: -3,
      donorName: '修仙的切图仔',
      donorAvatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=ninja&backgroundColor=c0aede',
      donorEmail: null,
      amount: 20.00,
      currency: 'CNY',
      payMethod: 'alipay',
      cryptoNetwork: null,
      cryptoTxHash: null,
      cryptoFrom: null,
      cryptoTo: null,
      message: '这博客设计完全戳中我的审美，UI太好看了，支持一杯咖啡！',
      tradeNo: null,
      status: 1,
      isVisible: 1,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
      id: -4,
      donorName: '快乐码农',
      donorAvatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=happy&backgroundColor=d1f4c9',
      donorEmail: null,
      amount: 50.00,
      currency: 'CNY',
      payMethod: 'wechat',
      cryptoNetwork: null,
      cryptoTxHash: null,
      cryptoFrom: null,
      cryptoTo: null,
      message: '用爱发电不易，支持一下站长的付出，希望能持续维护下去。',
      tradeNo: null,
      status: 1,
      isVisible: 1,
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
    }
  ]
}

const defaultAvatar = (name: string) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7c3aed`
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getMethodIcon = (method: PayMethod) => {
  switch (method) {
    case 'wechat': return 'circle-check'
    case 'alipay': return 'circle-check'
    case 'crypto': return 'link'
    default: return 'dollar-sign'
  }
}

const getMethodName = (method: PayMethod) => {
  switch (method) {
    case 'wechat': return '微信支付'
    case 'alipay': return '支付宝'
    case 'crypto': return '加密货币'
    default: return '其他支付'
  }
}

const fetchData = async () => {
  wallLoading.value = true
  try {
    const [statsRes, listRes] = await Promise.all([
      getDonationStats().catch(() => null),
      getDonations({ page: 1, pageSize: 100 }).catch(() => null)
    ])

    if (statsRes && statsRes.data) {
      stats.value = statsRes.data
    }

    let dbRecords: DonationRecord[] = []
    if (listRes && listRes.data && listRes.data.list) {
      dbRecords = listRes.data.list
    }

    if (dbRecords.length === 0) {
      rawRecords.value = getMockDonors()
    } else {
      rawRecords.value = dbRecords
    }
  } catch (err) {
    console.error('Fetch error:', err)
    rawRecords.value = getMockDonors()
  } finally {
    wallLoading.value = false
  }
}

const filteredRecords = computed(() => {
  let list = [...rawRecords.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r => r.donorName.toLowerCase().includes(q))
  }

  if (filterPayMethod.value !== 'all') {
    list = list.filter(r => r.payMethod === filterPayMethod.value)
  }

  if (sortBy.value === 'amount_desc') {
    list.sort((a, b) => b.amount - a.amount)
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return list
})

const handleFormSubmit = async () => {
  if (!payForm.value.donorName || !payForm.value.amount) {
    message.warning('请将必要信息填写完整')
    return
  }

  formSubmitting.value = true
  try {
    const submitData = {
      donorName: payForm.value.donorName,
      donorEmail: payForm.value.donorEmail || undefined,
      amount: Number(payForm.value.amount),
      payMethod: payForm.value.payMethod,
      tradeNo: payForm.value.tradeNo || undefined,
      message: payForm.value.message || undefined,
      cryptoNetwork: payForm.value.payMethod === 'crypto' ? (cryptoNetwork.value as CryptoNetwork) : undefined
    }

    const res = await submitDonation(submitData)
    if (res.success) {
      message.success('已提交成功，感谢您的赞助！')
      payForm.value = {
        donorName: '',
        donorEmail: '',
        amount: undefined,
        payMethod: 'alipay',
        tradeNo: '',
        message: ''
      }
      activeTab.value = 'wall'
      await fetchData()
    } else {
      message.error(res.message || '登记失败')
    }
  } catch (err: any) {
    message.error(err.message || '请求错误，请重试')
  } finally {
    formSubmitting.value = false
  }
}

onMounted(() => {
  fetchData()
  nextTick(() => {
    window.dispatchEvent(new Event('resize'))
  })
})
</script>

<style scoped lang="scss">
// 奢华质感极简系统
.donation-page {
  position: relative;
  min-height: 100vh;
  background: var(--bg, #f8fafc);
  color: var(--text, #0f172a);
  padding: 60px 24px 120px;
  overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.dark-mode {
    background: var(--bg, #080d16);
    color: var(--text, #f8fafc);
  }
}

// 柔美浮动霓虹球
.decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.08;
  transition: opacity 0.5s ease;

  .dark-mode & {
    opacity: 0.18;
  }
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #d946ef 0%, transparent 70%);
  top: -150px;
  right: 10%;
}

.orb-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
  bottom: -100px;
  left: -150px;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  top: 40%;
  right: -100px;
}

.donation-container {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  z-index: 10;
}

// Header
.donation-header {
  text-align: center;
  margin-bottom: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.12);
    color: #7c3aed;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 100px;
    margin-bottom: 16px;

    .dark-mode & {
      color: #a78bfa;
      background: rgba(167, 139, 250, 0.08);
      border-color: rgba(167, 139, 250, 0.15);
    }

    .badge-svg-icon {
      width: 11px;
      height: 11px;
      animation: heartbeat 1.8s infinite;
    }
  }

  .header-title {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin-bottom: 12px;

    .text-gradient {
      background: linear-gradient(135deg, #c026d3 0%, #7c3aed 50%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @media (max-width: 640px) {
      font-size: 28px;
    }
  }

  .header-subtitle {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary, #475569);
    max-width: 580px;

    .dark-mode & {
      color: var(--text-secondary, #94a3b8);
    }
  }
}

// 统计看板 (紧凑扁平化，双阴影)
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}

.stats-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-card, #ffffff);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.01),
    0 4px 10px rgba(0, 0, 0, 0.015);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .dark-mode & {
    background: #0f1624;
    border-color: rgba(255, 255, 255, 0.03);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(124, 58, 237, 0.25);
    box-shadow: 
      0 4px 8px rgba(124, 58, 237, 0.02),
      0 12px 30px rgba(124, 58, 237, 0.05);

    .dark-mode & {
      border-color: rgba(167, 139, 250, 0.2);
      box-shadow: 0 12px 36px rgba(167, 139, 250, 0.08);
    }
  }

  .stats-svg {
    width: 18px;
    height: 18px;
  }

  .stats-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;

    &.amt-color {
      background: rgba(37, 99, 235, 0.06);
      color: #2563eb;
    }
    &.people-color {
      background: rgba(16, 185, 129, 0.06);
      color: #10b981;
    }
    &.crown-color {
      background: rgba(217, 119, 6, 0.08);
      color: #d97706;
    }
  }

  .stats-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stats-label {
    font-size: 11.5px;
    font-weight: 700;
    color: var(--text-muted, #64748b);
    letter-spacing: 0.02em;
  }

  .stats-val {
    font-size: 22px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;

    .currency-symbol {
      font-size: 14px;
      font-weight: 700;
      margin-right: 1px;
    }

    .unit {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted, #64748b);
      margin-left: 1px;
    }
  }

  // 黑金VIP权益面板
  &.vip-platinum-card {
    background: linear-gradient(135deg, #181510 0%, #0c0a07 100%);
    border: 1px solid rgba(234, 179, 8, 0.15);
    box-shadow: 0 10px 30px rgba(234, 179, 8, 0.02);

    .platinum-shimmer {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(234, 179, 8, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .gold-tag {
      color: rgba(234, 179, 8, 0.7) !important;
    }

    .gold-title {
      color: #f59e0b !important;
      font-size: 14.5px;
      font-weight: 700;
    }

    &:hover {
      border-color: rgba(234, 179, 8, 0.35);
      box-shadow: 0 12px 30px rgba(234, 179, 8, 0.08);
    }
  }
}

// Apple iOS Segmented Control
.segmented-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.segmented-bar {
  position: relative;
  display: flex;
  background: rgba(226, 232, 240, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3px;
  border-radius: 11px;
  width: 280px;
  backdrop-filter: blur(10px);

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
    border-color: rgba(255, 255, 255, 0.03);
  }

  .segmented-slider {
    position: absolute;
    left: 0;
    top: 0;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s ease;
    z-index: 1;

    .dark-mode & {
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
    }
  }

  .segment-item {
    position: relative;
    z-index: 5;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: var(--text-secondary, #475569);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: color 0.35s;

    .dark-mode & {
      color: #94a3b8;
    }

    .tab-icon {
      font-size: 11.5px;
    }

    &.active {
      color: var(--text, #0f172a);

      .dark-mode & {
        color: #ffffff;
      }
    }
  }
}

// 玻璃态面板基类
.glass-panel {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.01),
    0 10px 30px rgba(0, 0, 0, 0.012);

  .dark-mode & {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(20px);
    border-color: rgba(255, 255, 255, 0.02);
    box-shadow: 
      0 1px 5px rgba(0, 0, 0, 0.1),
      0 20px 50px rgba(0, 0, 0, 0.2);
  }

  .panel-headline {
    font-size: 15.5px;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }

  .panel-subtitle {
    font-size: 12px;
    color: var(--text-muted, #64748b);
    line-height: 1.5;
    margin-bottom: 24px;
  }

  @media (max-width: 640px) {
    padding: 20px;
  }
}

// ====== 我要赞助 ======
.sponsor-layout {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

// 扁平高档横向 Pill 选择器
.pill-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;

  .pill-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--bg, #f1f5f9);
    border: 1px solid rgba(226, 232, 240, 0.6);
    border-radius: 9px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text-secondary, #475569);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    .dark-mode & {
      background: #0d121d;
      border-color: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
    }

    &:hover {
      border-color: rgba(124, 58, 237, 0.2);
      background: rgba(124, 58, 237, 0.02);
    }

    .pill-svg-icon {
      width: 15px;
      height: 15px;
      border-radius: 3px;
    }

    &.active {
      border-color: #7c3aed;
      background: rgba(124, 58, 237, 0.04);
      color: #7c3aed;
      box-shadow: 0 4px 10px rgba(124, 58, 237, 0.05);

      .dark-mode & {
        border-color: #a78bfa;
        background: rgba(167, 139, 250, 0.06);
        color: #a78bfa;
      }
    }
  }
}

// 收款渲染区
.interactive-pay-window {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg, #fafafa);
  border: 1px solid rgba(226, 232, 240, 0.5);
  border-radius: 12px;
  padding: 24px;
  min-height: 270px;

  .dark-mode & {
    background: rgba(9, 13, 22, 0.3);
    border-color: rgba(255, 255, 255, 0.02);
  }
}

// 拟真扫码组件
.qrcode-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.high-tech-scanner {
  position: relative;
  width: 160px;
  height: 160px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .dark-mode & {
    background: #0d121d;
  }

  // 四个对角边框
  .g-corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #7c3aed;
    pointer-events: none;
    z-index: 10;

    .dark-mode & {
      border-color: #a78bfa;
    }

    &.tc-l { top: 12px; left: 12px; border-right: none; border-bottom: none; }
    &.tc-r { top: 12px; right: 12px; border-left: none; border-bottom: none; }
    &.bc-l { bottom: 12px; left: 12px; border-right: none; border-top: none; }
    &.bc-r { bottom: 12px; right: 12px; border-left: none; border-top: none; }
  }

  // 极光扫描条
  .laser-scanner {
    position: absolute;
    left: 14px;
    right: 14px;
    height: 1px;
    z-index: 8;
    animation: scan-move 2.5s ease-in-out infinite;

    &.alipay {
      background: linear-gradient(90deg, transparent, #1677ff, transparent);
      box-shadow: 0 0 6px #1677ff;
    }
    &.wechat {
      background: linear-gradient(90deg, transparent, #07c160, transparent);
      box-shadow: 0 0 6px #07c160;
    }
  }

  .mock-qr-matrix {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 5;

    .qr-svg-matrix {
      width: 64px;
      height: 64px;
      opacity: 0.85;

      &.alipay { color: #1677ff; }
      &.wechat { color: #07c160; }
    }

    .matrix-brand {
      font-size: 10px;
      font-weight: 800;
      color: var(--text-secondary, #475569);
      letter-spacing: 0.05em;

      .dark-mode & {
        color: #94a3b8;
      }
    }
  }
}

.viewer-note {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted, #64748b);
}

// 加密货币De-Fi面板
.crypto-card-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .chain-pills-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;

    .pill-group {
      display: flex;
      gap: 6px;
    }

    .chain-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 7px;
      border: 1px solid rgba(226, 232, 240, 0.8);
      background: var(--bg-card, #ffffff);
      color: var(--text-secondary, #475569);
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;

      .dark-mode & {
        border-color: rgba(255, 255, 255, 0.03);
        background: #0d121d;
        color: #94a3b8;
      }

      &:hover {
        border-color: #7c3aed;
        color: #7c3aed;
      }

      .chain-svg-logo {
        width: 12px;
        height: 12px;
      }

      &.active {
        background: #7c3aed;
        border-color: #7c3aed;
        color: white;

        .dark-mode & {
          background: #a78bfa;
          border-color: #a78bfa;
          color: #0f172a;
        }
      }
    }
  }

  .address-copy-deck {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .address-strip {
      display: flex;
      align-items: center;
      background: var(--bg-card, #ffffff);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 8px;
      padding: 6px 8px;
      overflow: hidden;

      .dark-mode & {
        background: #0d121d;
        border-color: rgba(255, 255, 255, 0.03);
      }

      .net-indicator-label {
        font-size: 10px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 8px;
        color: white;

        &.TRC20 { background: #eb0029; }
        &.BSC { background: #f0b90b; color: #000; }
        &.POL { background: #8247e5; }
      }

      .addr-val {
        flex: 1;
        font-family: var(--font-mono, monospace);
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text, #0f172a);
        padding-right: 8px;

        .dark-mode & {
          color: #f8fafc;
        }
      }

      .addr-copy-action {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(124, 58, 237, 0.05);
        border: 1px solid rgba(124, 58, 237, 0.12);
        color: #7c3aed;
        padding: 4px 8px;
        border-radius: 5px;
        font-size: 10.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #7c3aed;
          color: white;
        }

        .copy-svg-icon {
          width: 11px;
          height: 11px;
        }

        .dark-mode & {
          color: #a78bfa;
          background: rgba(167, 139, 250, 0.08);
          border-color: rgba(167, 139, 250, 0.15);

          &:hover {
            background: #a78bfa;
            color: #0f172a;
          }
        }
      }
    }

    .note-box {
      font-size: 11px;
      line-height: 1.45;
      color: var(--text-tertiary, #94a3b8);
      display: flex;
      gap: 4px;

      .warning-highlight {
        font-weight: 800;
        color: var(--error, #ef4444);
      }

      .usdt-green {
        color: #26a17b;
      }
    }
  }
}

// ====== 高端触感表单 ======
.tactile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .form-row-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .field-item {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .field-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-secondary, #475569);

      .dark-mode & {
        color: #94a3b8;
      }

      &.required::after {
        content: ' *';
        color: var(--error, #ef4444);
      }
    }
  }

  .tactile-input-wrapper, .tactile-textarea-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    .field-icon {
      position: absolute;
      left: 12px;
      width: 13px;
      height: 13px;
      color: var(--text-tertiary, #94a3b8);
      pointer-events: none;

      &.text-area-icon {
        top: 12px;
      }
    }

    input, textarea {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 9px;
      padding: 9px 12px 9px 34px;
      font-size: 12.5px;
      color: var(--text, #0f172a);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      .dark-mode & {
        border-color: rgba(255, 255, 255, 0.05);
        color: #f8fafc;
      }

      &::placeholder {
        color: #cbd5e1;

        .dark-mode & {
          color: #475569;
        }
      }

      &:focus {
        border-color: #7c3aed;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08);
        outline: none;

        .dark-mode & {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
        }
      }
    }

    textarea {
      resize: none;
    }
  }

  // 流光扫过按钮
  .glare-submit-btn {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #c026d3 0%, #7c3aed 100%);
    color: white;
    padding: 11px 20px;
    border-radius: 9px;
    border: none;
    font-weight: 700;
    font-size: 13.5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.15);
    margin-top: 6px;

    .dark-mode & {
      box-shadow: 0 4px 20px rgba(167, 139, 250, 0.15);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.6s ease;
    }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25);

      &::before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }
}

// ====== 荣誉墙页面 ======
.honor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;

    .search-svg {
      position: absolute;
      left: 12px;
      width: 14px;
      height: 14px;
      color: var(--text-tertiary, #94a3b8);
    }

    input {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 9px;
      padding: 7px 12px 7px 34px;
      font-size: 12.5px;
      color: var(--text, #0f172a);
      transition: all 0.2s;

      .dark-mode & {
        border-color: rgba(255, 255, 255, 0.05);
        color: #f8fafc;
      }

      &:focus {
        border-color: #7c3aed;
        outline: none;

        .dark-mode & {
          border-color: #a78bfa;
        }
      }
    }
  }

  .options-wrap {
    display: flex;
    gap: 12px;

    @media (max-width: 640px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .opt-box {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;

      .opt-label {
        font-weight: 700;
        color: var(--text-secondary, #475569);

        .dark-mode & {
          color: #94a3b8;
        }
      }

      select {
        background: transparent;
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 7px;
        padding: 5px 8px;
        font-size: 12px;
        color: var(--text, #0f172a);
        font-weight: 600;
        cursor: pointer;
        outline: none;

        .dark-mode & {
          border-color: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          background: #0d121d;
        }

        &:focus {
          border-color: #7c3aed;
        }
      }
    }
  }
}

// 卡片网格及卡片
.honor-wall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

// 统一所有荣誉卡片底色（彻底解决底色不一，杜绝斜体文字）
.donor-box-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #ffffff);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.005),
    0 4px 10px rgba(0, 0, 0, 0.01);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  .dark-mode & {
    background: #0f1624;
    border-color: rgba(255, 255, 255, 0.02);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }

  &:hover {
    transform: translateY(-1.5px);
    border-color: rgba(124, 58, 237, 0.2);
    box-shadow: 
      0 4px 6px rgba(124, 58, 237, 0.01),
      0 12px 24px rgba(124, 58, 237, 0.04);
  }

  // 大额金卡特效
  &.golden-vip-card {
    border-color: rgba(234, 179, 8, 0.22);
    background: linear-gradient(180deg, rgba(234, 179, 8, 0.008) 0%, transparent 100%), var(--bg-card);

    .dark-mode & {
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.012) 0%, transparent 100%), #0f1624;
    }

    &:hover {
      border-color: rgba(234, 179, 8, 0.45);
      box-shadow: 0 8px 24px rgba(234, 179, 8, 0.06);
    }
  }

  .card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .avatar-ring-wrap {
    position: relative;
    width: 36px;
    height: 36px;
    flex-shrink: 0;

    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 7px;
      object-fit: cover;
    }

    .crown-overlay {
      position: absolute;
      top: -5px;
      right: -5px;
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
      color: white;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6px;
      border: 1px solid white;

      .dark-mode & {
        border-color: #0f1624;
      }
    }
  }

  .identity-block {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  .name-span {
    font-size: 13px;
    font-weight: 750;
    color: var(--text, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .dark-mode & {
      color: #f8fafc;
    }

    &.gold-name {
      background: linear-gradient(90deg, #d97706 0%, #fbbf24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 850;
    }
  }

  .time-span {
    font-size: 10px;
    color: var(--text-tertiary, #94a3b8);
  }

  .amt-badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 800;
    font-size: 12px;
    flex-shrink: 0;

    &.wechat {
      background: rgba(7, 193, 96, 0.05);
      color: #07c160;
    }
    &.alipay {
      background: rgba(22, 119, 255, 0.05);
      color: #1677ff;
    }
    &.crypto {
      background: rgba(0, 147, 135, 0.05);
      color: #009387;
    }
  }

  .message-container {
    flex: 1;
    background: var(--bg, #f8fafc);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 11.5px;
    line-height: 1.45;
    margin-bottom: 12px;

    .dark-mode & {
      background: rgba(9, 13, 22, 0.45);
    }

    // 杜绝任何斜体样式，统一为常规体，提升排版整洁度
    .quote-text {
      color: var(--text-secondary, #475569);
      font-style: normal; // 杜绝斜体

      .dark-mode & {
        color: #94a3b8;
      }
    }
  }

  .card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10.5px;
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    padding-top: 10px;

    .dark-mode & {
      border-color: rgba(255, 255, 255, 0.02);
    }

    .method-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-tertiary, #94a3b8);

      .pay-badge-svg {
        width: 11px;
        height: 11px;
      }
    }

    .status-pill {
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9.5px;

      &.status-0 {
        background: rgba(245, 158, 11, 0.06);
        color: #d97706;
      }
      &.status-1 {
        background: rgba(16, 185, 129, 0.06);
        color: #10b981;
      }
      &.status-2 {
        background: rgba(239, 68, 68, 0.06);
        color: #ef4444;
      }
    }
  }
}

// 空白与异常指示 SVG
.empty-svg {
  width: 36px;
  height: 36px;
  color: var(--text-tertiary, #cbd5e1);
  opacity: 0.4;
  margin-bottom: 12px;
}

@keyframes scan-move {
  0% { top: 14px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 146px; opacity: 0; }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}
</style>
