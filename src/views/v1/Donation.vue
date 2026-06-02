<template>
  <div class="donation-page" :class="{ 'dark-mode': isDark }">
    <!-- 极细腻流光背景 -->
    <div class="decorations">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
    </div>

    <div class="donation-container">
      <!-- 极简高端 Hero Header -->
      <header class="donation-header animate__animated animate__fadeIn">
        <div class="header-badge">
          <font-awesome-icon icon="heart" class="badge-icon" />
          <span>Sponsor Hub</span>
        </div>
        <h1 class="header-title">
          支持 <span class="text-gradient">本站的成长</span>
        </h1>
        <p class="header-subtitle">
          您的每一份支持，都将全部用于服务器运营与开源技术内容的创作。感谢与我们一路同行的赞助伙伴。
        </p>
      </header>

      <!-- 瘦身与高端化的 Stats Board -->
      <section class="stats-grid">
        <div class="stats-card">
          <div class="card-glow"></div>
          <div class="stats-icon-wrapper amt-color">
            <font-awesome-icon icon="dollar-sign" />
          </div>
          <div class="stats-info">
            <span class="stats-label">已确认赞助总额</span>
            <h3 class="stats-val">
              <span class="currency-symbol">¥</span>{{ formatNumber(stats.totalAmount) }}
            </h3>
          </div>
        </div>

        <div class="stats-card">
          <div class="card-glow"></div>
          <div class="stats-icon-wrapper people-color">
            <font-awesome-icon icon="users" />
          </div>
          <div class="stats-info">
            <span class="stats-label">赞助伙伴人次</span>
            <h3 class="stats-val">{{ stats.totalDonors }}<span class="unit">次</span></h3>
          </div>
        </div>

        <!-- 金色金属感尊享 VIP 卡片 -->
        <div class="stats-card vip-gold-card">
          <div class="vip-glow"></div>
          <div class="stats-icon-wrapper gold-icon">
            <font-awesome-icon icon="crown" />
          </div>
          <div class="stats-info">
            <span class="stats-label gold-label">尊享会员权益</span>
            <h3 class="stats-val gold-val">单次赞助达 ¥50 获 VIP 身份</h3>
          </div>
        </div>
      </section>

      <!-- Apple 风分段滑动选项卡 (Segmented Control) -->
      <div class="segmented-control-wrapper">
        <div class="segmented-control">
          <div class="slider" :style="tabSliderStyle"></div>
          <button
            class="seg-btn"
            :class="{ active: activeTab === 'pay' }"
            @click="activeTab = 'pay'"
            ref="payTabRef"
          >
            <font-awesome-icon icon="shopping-bag" class="tab-icon" />
            <span>我要赞助</span>
          </button>
          <button
            class="seg-btn"
            :class="{ active: activeTab === 'wall' }"
            @click="activeTab = 'wall'"
            ref="wallTabRef"
          >
            <font-awesome-icon icon="gem" class="tab-icon" />
            <span>赞助荣誉墙</span>
          </button>
        </div>
      </div>

      <!-- ====== 选项卡：我要赞助 ====== -->
      <div v-if="activeTab === 'pay'" class="tab-content">
        <div class="sponsor-layout-grid">
          <!-- 1. 选择支付方式与扫码框 -->
          <div class="pay-setup-card glass-panel">
            <h3 class="panel-title">1. 选择支付通道</h3>
            
            <!-- 横向扁平毛玻璃药丸选择器 -->
            <div class="horizontal-pill-selector">
              <button
                class="pill-item"
                :class="{ active: payForm.payMethod === 'alipay' }"
                @click="payForm.payMethod = 'alipay'"
              >
                <span class="icon-dot alipay-bg">支</span>
                <span>支付宝</span>
              </button>

              <button
                class="pill-item"
                :class="{ active: payForm.payMethod === 'wechat' }"
                @click="payForm.payMethod = 'wechat'"
              >
                <span class="icon-dot wechat-bg">微</span>
                <span>微信支付</span>
              </button>

              <button
                class="pill-item"
                :class="{ active: payForm.payMethod === 'crypto' }"
                @click="payForm.payMethod = 'crypto'"
              >
                <span class="icon-dot crypto-bg">链</span>
                <span>加密货币</span>
              </button>
            </div>

            <!-- 精致扫码及付款面板 -->
            <div class="payment-viewer">
              <div v-if="payForm.payMethod === 'alipay' || payForm.payMethod === 'wechat'" class="qr-panel">
                <!-- 拟真高端扫码器 -->
                <div class="scanner-frame">
                  <div class="corner top-left"></div>
                  <div class="corner top-right"></div>
                  <div class="corner bottom-left"></div>
                  <div class="corner bottom-right"></div>
                  <!-- 动态极光线 -->
                  <div class="scan-laser" :class="payForm.payMethod"></div>
                  
                  <div class="qr-mock-content">
                    <font-awesome-icon icon="store" class="qr-center-icon" />
                    <span class="qr-brand">{{ payForm.payMethod === 'alipay' ? 'ALIPAY' : 'WECHAT PAY' }}</span>
                    <span class="qr-subtext">扫一扫向作者转账</span>
                  </div>
                </div>
                <p class="qr-hint-text">请使用手机端扫码进行赞助支持，金额不限</p>
              </div>

              <!-- 加密货币地址展示 -->
              <div v-if="payForm.payMethod === 'crypto'" class="crypto-panel">
                <div class="chain-selector">
                  <span class="chain-label">选择公链网络 (USDT):</span>
                  <div class="chain-pills">
                    <button
                      v-for="net in ['TRC20', 'BSC', 'POL']"
                      :key="net"
                      class="chain-btn"
                      :class="{ active: cryptoNetwork === net }"
                      @click="cryptoNetwork = net"
                    >
                      {{ net }}
                    </button>
                  </div>
                </div>

                <div class="token-address-box">
                  <div class="address-input-group">
                    <code class="address-string">{{ getCryptoAddress(cryptoNetwork) }}</code>
                    <button class="copy-action-btn" @click="copyAddress(getCryptoAddress(cryptoNetwork))">
                      <font-awesome-icon icon="link" />
                      <span>复制</span>
                    </button>
                  </div>
                  <p class="address-tip-note">
                    * 仅接受 USDT 资产。充值非指定币种或选错链可能会导致资金永久丢失。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 登记赞助信息表单 -->
          <div class="register-info-card glass-panel">
            <h3 class="panel-title">2. 登记赞助记录</h3>
            <p class="panel-subtitle">转账完毕后请在此登记，审核通过后您的留言将展示在荣誉墙中。</p>

            <form @submit.prevent="handleFormSubmit" class="premium-form">
              <div class="form-grid">
                <div class="form-item">
                  <label class="form-label required">您的昵称</label>
                  <div class="form-input-container">
                    <font-awesome-icon icon="user" class="form-icon" />
                    <input
                      v-model="payForm.donorName"
                      type="text"
                      placeholder="支持匿名或输入昵称"
                      required
                    />
                  </div>
                </div>

                <div class="form-item">
                  <label class="form-label required">赞助金额 (CNY/USDT)</label>
                  <div class="form-input-container">
                    <font-awesome-icon icon="dollar-sign" class="form-icon" />
                    <input
                      v-model.number="payForm.amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="赞助金额（如 10.00）"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-item">
                  <label class="form-label">联系邮箱（不公开，发放VIP通知使用）</label>
                  <div class="form-input-container">
                    <font-awesome-icon icon="envelope" class="form-icon" />
                    <input
                      v-model="payForm.donorEmail"
                      type="email"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div class="form-item">
                  <label class="form-label">流水单号 / 交易哈希</label>
                  <div class="form-input-container">
                    <font-awesome-icon icon="code" class="form-icon" />
                    <input
                      v-model="payForm.tradeNo"
                      type="text"
                      placeholder="选填，便于后台快速核对"
                    />
                  </div>
                </div>
              </div>

              <div class="form-item full-width">
                <label class="form-label">赞助留言</label>
                <div class="form-textarea-container">
                  <font-awesome-icon icon="pen-nib" class="form-icon text-area-icon" />
                  <textarea
                    v-model="payForm.message"
                    rows="3"
                    placeholder="说点什么吧，留言将在通过后展示在荣誉墙上..."
                  ></textarea>
                </div>
              </div>

              <button type="submit" class="premium-submit-btn" :disabled="formSubmitting">
                <font-awesome-icon icon="spinner" spin v-if="formSubmitting" />
                <font-awesome-icon icon="paper-plane" v-else />
                <span>{{ formSubmitting ? '正在安全提交...' : '确认登记' }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- ====== 选项卡：赞助荣誉墙 ====== -->
      <div v-else class="tab-content">
        <!-- 过滤器控制栏 -->
        <div class="toolbar-panel glass-panel">
          <div class="search-box">
            <font-awesome-icon icon="magnifying-glass" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索赞助伙伴的昵称..."
            />
          </div>

          <div class="select-filters">
            <div class="filter-item">
              <span class="filter-label">通道</span>
              <select v-model="filterPayMethod">
                <option value="all">全部</option>
                <option value="alipay">支付宝</option>
                <option value="wechat">微信</option>
                <option value="crypto">加密货币</option>
              </select>
            </div>

            <div class="filter-item">
              <span class="filter-label">排序</span>
              <select v-model="sortBy">
                <option value="date_desc">最新加入</option>
                <option value="amount_desc">金额最高</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 荣誉墙列表载入态 -->
        <div class="loading-state" v-if="wallLoading">
          <font-awesome-icon icon="spinner" spin class="spinner-icon" />
          <span>正在拼命加载赞助伙伴名单...</span>
        </div>

        <div v-else>
          <!-- 缺省状态 -->
          <div v-if="filteredRecords.length === 0" class="empty-state glass-panel">
            <font-awesome-icon icon="users" class="empty-icon" />
            <h4>暂无赞助记录</h4>
            <p>期待您的支持，成为本站最珍贵的赞助人。</p>
          </div>

          <!-- 精致荣誉卡片网格 -->
          <div v-else class="honor-wall-grid">
            <div
              v-for="record in filteredRecords"
              :key="record.id"
              class="honor-card"
              :class="{ 'vip-gold-border': record.amount >= 50 }"
            >
              <!-- 顶部区域 -->
              <div class="honor-card-header">
                <div class="avatar-wrap">
                  <img
                    :src="record.donorAvatar || defaultAvatar(record.donorName)"
                    alt="Sponsor Avatar"
                    class="avatar-image"
                  />
                  <!-- 金色尊贵皇冠 -->
                  <div class="crown-icon-badge" v-if="record.amount >= 50">
                    <font-awesome-icon icon="crown" />
                  </div>
                </div>

                <div class="identity-info">
                  <div class="identity-name-row">
                    <span class="name-text" :class="{ 'gold-sparkle-text': record.amount >= 50 }">
                      {{ record.donorName }}
                    </span>
                  </div>
                  <span class="date-text">{{ formatDate(record.createdAt) }}</span>
                </div>

                <!-- 金额微章 -->
                <div class="amount-pill" :class="record.payMethod">
                  <span>¥{{ formatNumber(record.amount) }}</span>
                </div>
              </div>

              <!-- 留言气泡 -->
              <div class="message-bubble">
                <p>“ {{ record.message || '默默赞助了作者，没有留下留言。' }} ”</p>
              </div>

              <!-- 卡片底部细节 -->
              <div class="honor-card-footer">
                <div class="channel-info">
                  <font-awesome-icon :icon="getMethodIcon(record.payMethod)" class="chan-icon" />
                  <span>{{ getMethodName(record.payMethod) }}</span>
                </div>
                <span class="status-badge" :class="'status-' + record.status">
                  {{ record.status === 0 ? '核对中' : record.status === 1 ? '已确认' : '已退回' }}
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

// 主题状态
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

// 标签与滑动控制
const activeTab = ref<'pay' | 'wall'>('pay')
const payTabRef = ref<HTMLElement | null>(null)
const wallTabRef = ref<HTMLElement | null>(null)

// 选项卡背景滑块样式计算
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

// 看板状态
const stats = ref<DonationStats>({
  totalAmount: 5280.00,
  totalDonors: 128
})

// 列表数据
const rawRecords = ref<DonationRecord[]>([])
const wallLoading = ref(false)

// 过滤器
const searchQuery = ref('')
const filterPayMethod = ref<string>('all')
const sortBy = ref<'date_desc' | 'amount_desc'>('date_desc')

// 加密网络
const cryptoNetwork = ref<string>('TRC20')

// 自助表单
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
    message.success('已成功复制链上地址，感谢赞助！')
  } catch (err) {
    message.error('复制失败，请手动选择复制。')
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

// 拉取数据
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
    message.warning('请填写必要的信息')
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
      message.success('您的赞助信息已提交成功，等待核对。再次感谢您的支持！')
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
  // 确保选项卡背景在初始化时计算正确
  nextTick(() => {
    window.dispatchEvent(new Event('resize'))
  })
})
</script>

<style scoped lang="scss">
// 页面配色系统与高质感极简设计
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
    background: var(--bg, #090d16);
    color: var(--text, #f8fafc);
  }
}

// 动态炫光背景
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
  filter: blur(120px);
  opacity: 0.1;
  transition: opacity 0.5s ease;

  .dark-mode & {
    opacity: 0.22;
  }
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c026d3 0%, transparent 70%);
  top: -150px;
  right: 15%;
}

.orb-2 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  bottom: -100px;
  left: -150px;
}

.donation-container {
  position: relative;
  max-width: 1140px;
  margin: 0 auto;
  z-index: 10;
}

// Hero Header
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
    padding: 5px 14px;
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.12);
    color: #7c3aed;
    font-size: 11.5px;
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

    .badge-icon {
      font-size: 10px;
      animation: heartbeat 1.8s infinite;
    }
  }

  .header-title {
    font-size: 38px;
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
      font-size: 30px;
    }
  }

  .header-subtitle {
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--text-secondary, #475569);
    max-width: 580px;

    .dark-mode & {
      color: var(--text-secondary, #94a3b8);
    }
  }
}

// 看板卡片重做：极淡边框、扁平紧凑、超多重立体软投影
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
  padding: 20px 24px;
  overflow: hidden;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.01),
    0 4px 12px rgba(0, 0, 0, 0.015),
    0 10px 28px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .dark-mode & {
    background: #111b2d;
    border-color: rgba(255, 255, 255, 0.04);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 12px 30px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(124, 58, 237, 0.25);
    box-shadow: 
      0 4px 6px rgba(124, 58, 237, 0.02),
      0 12px 36px rgba(124, 58, 237, 0.05);

    .dark-mode & {
      border-color: rgba(167, 139, 250, 0.2);
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.2),
        0 16px 40px rgba(167, 139, 250, 0.08);
    }
  }

  .card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.02) 0%, transparent 60%);
    pointer-events: none;
    z-index: 1;
  }

  .stats-icon-wrapper {
    position: relative;
    z-index: 5;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;

    &.amt-color {
      background: rgba(37, 99, 235, 0.06);
      color: #2563eb;
    }
    &.people-color {
      background: rgba(16, 185, 129, 0.06);
      color: #10b981;
    }
    &.gold-icon {
      background: rgba(217, 119, 6, 0.08);
      color: #d97706;
    }
  }

  .stats-info {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stats-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted, #64748b);
    letter-spacing: 0.02em;

    .dark-mode & {
      color: #64748b;
    }
  }

  .stats-val {
    font-size: 24px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;

    .currency-symbol {
      font-size: 15px;
      font-weight: 700;
      margin-right: 1px;
    }

    .unit {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted, #64748b);
      margin-left: 2px;
    }
  }

  // 尊享黄金金属质感卡片
  &.vip-gold-card {
    background: linear-gradient(135deg, #1e1b12 0%, #15130d 100%);
    border: 1px solid rgba(234, 179, 8, 0.15);
    box-shadow: 0 10px 30px rgba(234, 179, 8, 0.03);

    .vip-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(234, 179, 8, 0.1) 0%, transparent 65%);
      pointer-events: none;
    }

    .gold-label {
      color: rgba(234, 179, 8, 0.7) !important;
    }

    .gold-val {
      color: #fbbf24 !important;
      font-size: 16px;
      font-weight: 700;
    }

    &:hover {
      border-color: rgba(234, 179, 8, 0.35);
      box-shadow: 0 12px 36px rgba(234, 179, 8, 0.1);
    }
  }
}

// Apple 风格的分段滑动选项卡（Segmented Control）
.segmented-control-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.segmented-control {
  position: relative;
  display: flex;
  background: rgba(226, 232, 240, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3px;
  border-radius: 12px;
  width: 290px;
  backdrop-filter: blur(10px);

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
    border-color: rgba(255, 255, 255, 0.04);
  }

  .slider {
    position: absolute;
    left: 0;
    top: 0;
    background: #ffffff;
    border-radius: 9px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s ease;
    z-index: 1;

    .dark-mode & {
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
    }
  }

  .seg-btn {
    position: relative;
    z-index: 5;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: var(--text-secondary, #475569);
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: color 0.35s;

    .dark-mode & {
      color: #94a3b8;
    }

    .tab-icon {
      font-size: 12px;
    }

    &.active {
      color: var(--text, #0f172a);

      .dark-mode & {
        color: #ffffff;
      }
    }
  }
}

// 毛玻璃卡片面板
.glass-panel {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.01),
    0 10px 30px rgba(0, 0, 0, 0.015);

  .dark-mode & {
    background: rgba(17, 27, 45, 0.5);
    backdrop-filter: blur(20px);
    border-color: rgba(255, 255, 255, 0.03);
    box-shadow: 
      0 1px 5px rgba(0, 0, 0, 0.1),
      0 20px 50px rgba(0, 0, 0, 0.25);
  }

  .panel-title {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }

  .panel-subtitle {
    font-size: 12.5px;
    color: var(--text-muted, #64748b);
    line-height: 1.5;
    margin-bottom: 24px;
  }

  @media (max-width: 640px) {
    padding: 20px;
  }
}

// ====== 我要赞助：核心布局 ======
.sponsor-layout-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

// 横向胶囊支付选择器
.horizontal-pill-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;

  .pill-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--bg, #f1f5f9);
    border: 1px solid rgba(226, 232, 240, 0.6);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary, #475569);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    .dark-mode & {
      background: #0d131f;
      border-color: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
    }

    &:hover {
      border-color: rgba(124, 58, 237, 0.2);
      background: rgba(124, 58, 237, 0.02);
    }

    .icon-dot {
      width: 18px;
      height: 18px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: white;
      font-weight: 800;

      &.alipay-bg { background: #1677ff; }
      &.wechat-bg { background: #07c160; }
      &.crypto-bg { background: #009387; }
    }

    &.active {
      border-color: #7c3aed;
      background: rgba(124, 58, 237, 0.04);
      color: #7c3aed;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.05);

      .dark-mode & {
        border-color: #a78bfa;
        background: rgba(167, 139, 250, 0.06);
        color: #a78bfa;
      }
    }
  }
}

// 支付展示区
.payment-viewer {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg, #fafafa);
  border: 1px solid rgba(226, 232, 240, 0.5);
  border-radius: 12px;
  padding: 24px;
  min-height: 270px;

  .dark-mode & {
    background: rgba(15, 23, 42, 0.3);
    border-color: rgba(255, 255, 255, 0.03);
  }
}

// 重做：拟真扫码框
.qr-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.scanner-frame {
  position: relative;
  width: 170px;
  height: 170px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .dark-mode & {
    background: #0d131f;
  }

  // 四个扫描角标
  .corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid #7c3aed;
    pointer-events: none;
    z-index: 10;

    .dark-mode & {
      border-color: #a78bfa;
    }

    &.top-left {
      top: 12px;
      left: 12px;
      border-right: none;
      border-bottom: none;
    }
    &.top-right {
      top: 12px;
      right: 12px;
      border-left: none;
      border-bottom: none;
    }
    &.bottom-left {
      bottom: 12px;
      left: 12px;
      border-right: none;
      border-top: none;
    }
    &.bottom-right {
      bottom: 12px;
      right: 12px;
      border-left: none;
      border-top: none;
    }
  }

  // 动态极光激光扫描线
  .scan-laser {
    position: absolute;
    left: 16px;
    right: 16px;
    height: 1.5px;
    z-index: 8;
    animation: scan-move 2.5s ease-in-out infinite;

    &.alipay {
      background: linear-gradient(90deg, transparent, #1677ff, transparent);
      box-shadow: 0 0 8px #1677ff;
    }
    &.wechat {
      background: linear-gradient(90deg, transparent, #07c160, transparent);
      box-shadow: 0 0 8px #07c160;
    }
  }

  .qr-mock-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    z-index: 5;
    opacity: 0.85;

    .qr-center-icon {
      font-size: 26px;
      color: var(--text-muted, #64748b);
      margin-bottom: 2px;
    }
    .qr-brand {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--text, #0f172a);

      .dark-mode & {
        color: #f8fafc;
      }
    }
    .qr-subtext {
      font-size: 10px;
      color: var(--text-tertiary, #9ca3af);
    }
  }
}

@keyframes scan-move {
  0% { top: 16px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 154px; opacity: 0; }
}

.qr-hint-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted, #64748b);
}

// 加密面板
.crypto-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .chain-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    font-weight: 700;

    .chain-pills {
      display: flex;
      gap: 6px;
    }

    .chain-btn {
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
        background: #0d131f;
        color: #94a3b8;
      }

      &:hover {
        border-color: #7c3aed;
        color: #7c3aed;
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

  .token-address-box {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .address-input-group {
      display: flex;
      align-items: center;
      background: var(--bg-card, #ffffff);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 9px;
      padding: 8px 10px;
      overflow: hidden;

      .dark-mode & {
        background: #0d131f;
        border-color: rgba(255, 255, 255, 0.03);
      }

      .address-string {
        flex: 1;
        font-family: var(--font-mono, monospace);
        font-size: 11.5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text, #0f172a);
        padding-right: 10px;

        .dark-mode & {
          color: #f8fafc;
        }
      }

      .copy-action-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(124, 58, 237, 0.05);
        border: 1px solid rgba(124, 58, 237, 0.12);
        color: #7c3aed;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #7c3aed;
          color: white;
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

    .address-tip-note {
      font-size: 11px;
      color: var(--text-tertiary, #94a3b8);
      line-height: 1.4;
    }
  }
}

// ====== 高端表单设计：无背景细边框、聚焦流光外发光 ======
.premium-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 5px;

    &.full-width {
      grid-column: span 1;
    }

    .form-label {
      font-size: 12.5px;
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

  .form-input-container, .form-textarea-container {
    position: relative;
    display: flex;
    align-items: center;

    .form-icon {
      position: absolute;
      left: 12px;
      font-size: 13px;
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
      font-size: 13px;
      color: var(--text, #0f172a);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      .dark-mode & {
        border-color: rgba(255, 255, 255, 0.06);
        color: #f8fafc;
      }

      &::placeholder {
        color: var(--text-placeholder, #cbd5e1);

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
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
        }
      }
    }

    textarea {
      resize: none;
    }
  }

  // 极具流光特效的提交按钮
  .premium-submit-btn {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, #c026d3 0%, #7c3aed 100%);
    color: white;
    padding: 11px 20px;
    border-radius: 9px;
    border: none;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.15);
    margin-top: 6px;

    .dark-mode & {
      box-shadow: 0 4px 20px rgba(167, 139, 250, 0.15);
    }

    // 光泽扫过效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent);
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

// ====== 荣誉墙页面细节 ======
.toolbar-panel {
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

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;

    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 13px;
      color: var(--text-tertiary, #94a3b8);
    }

    input {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 9px;
      padding: 7px 12px 7px 34px;
      font-size: 13px;
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

  .select-filters {
    display: flex;
    gap: 12px;

    @media (max-width: 640px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;

      .filter-label {
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
        font-size: 12.5px;
        color: var(--text, #0f172a);
        font-weight: 600;
        cursor: pointer;
        outline: none;

        .dark-mode & {
          border-color: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          background: #0d131f;
        }

        &:focus {
          border-color: #7c3aed;
        }
      }
    }
  }
}

// 状态加载
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 0;
  color: var(--text-secondary, #475569);
  font-size: 13.5px;

  .spinner-icon {
    font-size: 24px;
    color: #7c3aed;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .empty-icon {
    font-size: 40px;
    color: var(--text-tertiary, #cbd5e1);
    opacity: 0.35;
    margin-bottom: 12px;
  }

  h4 {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  p {
    font-size: 12.5px;
    color: var(--text-secondary, #475569);
  }
}

// 荣誉卡片网格与细节
.honor-wall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
}

.honor-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #ffffff);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.005),
    0 4px 12px rgba(0, 0, 0, 0.01);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  .dark-mode & {
    background: #111b2d;
    border-color: rgba(255, 255, 255, 0.03);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  &:hover {
    transform: translateY(-1.5px);
    border-color: rgba(124, 58, 237, 0.2);
    box-shadow: 
      0 4px 6px rgba(124, 58, 237, 0.015),
      0 10px 20px rgba(124, 58, 237, 0.04);
  }

  // 大额赞助者金卡效果
  &.vip-gold-border {
    border-color: rgba(234, 179, 8, 0.2);
    background: linear-gradient(180deg, rgba(234, 179, 8, 0.008) 0%, transparent 100%), var(--bg-card);

    .dark-mode & {
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.012) 0%, transparent 100%), #111b2d;
    }

    &:hover {
      border-color: rgba(234, 179, 8, 0.45);
      box-shadow: 0 8px 24px rgba(234, 179, 8, 0.06);
    }
  }

  .honor-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .avatar-wrap {
    position: relative;
    width: 38px;
    height: 38px;
    flex-shrink: 0;

    .avatar-image {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      object-fit: cover;
    }

    .crown-icon-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
      color: white;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6px;
      border: 1px solid white;

      .dark-mode & {
        border-color: #111b2d;
      }
    }
  }

  .identity-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  .identity-name-row {
    display: flex;
    align-items: center;

    .name-text {
      font-size: 13.5px;
      font-weight: 750;
      color: var(--text, #0f172a);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .dark-mode & {
        color: #f8fafc;
      }

      &.gold-sparkle-text {
        background: linear-gradient(90deg, #d97706 0%, #fbbf24 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 850;
      }
    }
  }

  .date-text {
    font-size: 10.5px;
    color: var(--text-tertiary, #94a3b8);
  }

  .amount-pill {
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 800;
    font-size: 12.5px;
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

  .message-bubble {
    flex: 1;
    background: var(--bg, #f8fafc);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.45;
    margin-bottom: 12px;

    .dark-mode & {
      background: rgba(9, 13, 22, 0.4);
    }

    p {
      color: var(--text-secondary, #475569);
      font-style: italic;

      .dark-mode & {
        color: #94a3b8;
      }
    }
  }

  .honor-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    padding-top: 10px;

    .dark-mode & {
      border-color: rgba(255, 255, 255, 0.02);
    }

    .channel-info {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-tertiary, #94a3b8);

      .chan-icon {
        font-size: 10px;
      }
    }

    .status-badge {
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 10px;

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

// 心跳动画
@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}
</style>
