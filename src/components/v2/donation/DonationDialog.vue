<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import {
  Heart, Copy, Check, ArrowRight, ArrowLeft,
  Wallet, QrCode, Minus, Plus,
} from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const props = defineProps<{
  open: boolean
  amount?: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submitted': [data: DonationFormData]
}>()

export interface DonationFormData {
  donorName: string
  donorEmail: string
  amount: number
  message: string
  payMethod: 'wechat' | 'alipay' | 'crypto'
  cryptoNetwork: 'TRC20' | 'BSC' | 'POL'
  cryptoTxHash: string
}

const step = ref(1)
const totalSteps = 3
const copied = ref(false)
const donationId = ref('')

const form = ref<DonationFormData>({
  donorName: '',
  donorEmail: '',
  amount: props.amount ?? 0,
  message: '',
  payMethod: 'crypto',
  cryptoNetwork: 'TRC20',
  cryptoTxHash: '',
})

watch(() => props.open, (v) => {
  if (v) {
    step.value = 1
    donationId.value = ''
    if (props.amount) form.value.amount = props.amount
  }
})

// TODO: 从后端设置接口获取
const walletAddresses: Record<string, string> = {
  TRC20: 'TJYeasTPa6gpVh7ZsAPDfnBrLaaTSE3qKr',
  BSC: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  POL: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
}

const currentAddress = computed(() => walletAddresses[form.value.cryptoNetwork] ?? '')

// 加密货币排最前（推荐），然后支付宝，最后微信
const payMethods = [
  { value: 'crypto' as const, label: '加密货币', color: '#F7931A', recommended: true },
  { value: 'alipay' as const, label: '支付宝', color: '#1677FF', recommended: false },
  { value: 'wechat' as const, label: '微信支付', color: '#07C160', recommended: false },
]

const networkOptions = [
  { value: 'TRC20' as const, label: 'TRC20', color: '#50AF95', desc: 'Tron · USDT/TRX', recommended: false },
  { value: 'BSC' as const, label: 'BSC', color: '#F0B90B', desc: 'BNB Chain · BEP-20', recommended: true },
  { value: 'POL' as const, label: 'Polygon', color: '#8247E5', desc: 'MATIC / ERC-20', recommended: true },
]

const stepLabels = ['填写信息', '选择支付', '确认提交']

const currentNetworkDesc = computed(() => networkOptions.find(n => n.value === form.value.cryptoNetwork)?.desc ?? '')

const USDT_RATE = 7
const usdtAmount = computed(() => (form.value.amount / USDT_RATE).toFixed(2))

function nextStep() {
  if (step.value < totalSteps) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

function copyAddress() {
  navigator.clipboard.writeText(currentAddress.value).then(() => {
    copied.value = true
    toast({ title: '已复制钱包地址', duration: 2000 })
    setTimeout(() => { copied.value = false }, 2000)
  })
}

/* ═══ 生成捐赠唯一凭证 ═══ */
function generateDonationId(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `DN-${ts}-${rand}`
}

/* ═══ 礼花粒子特效 ═══ */
let confettiTimers: ReturnType<typeof setTimeout>[] = []

interface ConfettiPiece {
  id: number
  x: number
  y: number
  emoji: string
  size: number
  duration: number
  delay: number
  sway: number
  rotate: number
  isColor: boolean
  color: string
}

const confettiPieces = ref<ConfettiPiece[]>([])

const confettiEmojis = ['🎉', '❤️', '✨', '🌟', '💖', '🥳', '👏', '🎊']
const confettiColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e']

function spawnConfetti() {
  const pieces: ConfettiPiece[] = []
  for (let i = 0; i < 35; i++) {
    const isEmoji = Math.random() > 0.45
    pieces.push({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
      size: isEmoji ? 14 + Math.random() * 14 : 6 + Math.random() * 6,
      duration: 1.8 + Math.random() * 2.2,
      delay: Math.random() * 0.6,
      sway: -40 + Math.random() * 80,
      rotate: Math.random() * 720 - 360,
      isColor: !isEmoji,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    })
  }
  confettiPieces.value = pieces
  const t = setTimeout(() => { confettiPieces.value = [] }, 4500)
  confettiTimers.push(t)
}

onUnmounted(() => {
  confettiTimers.forEach(clearTimeout)
})

function handleSubmit() {
  donationId.value = generateDonationId()
  emit('submitted', { ...form.value })
  toast({ title: '感谢赞助！我们会尽快确认您的支付。', duration: 3000 })
  step.value = 4
  nextTick(() => { spawnConfetti() })
}

function closeSuccess() {
  emit('update:open', false)
}

const canNext = computed(() => {
  if (step.value === 1) {
    return form.value.amount > 0
  }
  return true
})

const payMethodLabel = computed(() => payMethods.find(m => m.value === form.value.payMethod)?.label ?? '')
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="w-[calc(100%-2rem)] sm:w-full sm:max-w-[480px] max-h-[92vh] gap-0 p-0 overflow-y-auto rounded-lg">

      <!-- ═══ 成功页 (step === 4) ═══ -->
      <template v-if="step === 4">
        <!-- 礼花容器 -->
        <div class="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div
            v-for="p in confettiPieces"
            :key="p.id"
            class="donation-confetti"
            :style="{
              left: p.x + '%',
              top: p.y + '%',
              animationDuration: p.duration + 's',
              animationDelay: p.delay + 's',
              '--sway': p.sway + 'px',
              '--rotate': p.rotate + 'deg',
            }"
          >
            <span v-if="!p.isColor" :style="{ fontSize: p.size + 'px' }">{{ p.emoji }}</span>
            <span
              v-else
              class="block rounded-sm"
              :style="{ width: p.size + 'px', height: p.size * 0.6 + 'px', backgroundColor: p.color }"
            />
          </div>
        </div>

        <div class="donation-success-page">
          <!-- 礼炮 -->
          <div class="donation-success-emoji text-6xl">🎉</div>

          <!-- 金额突出 -->
          <div class="donation-success-amount mt-4">
            <span class="text-base text-primary/40">¥</span>
            <span class="text-5xl font-extrabold tracking-tight text-primary">{{ form.amount }}</span>
          </div>

          <!-- 标题 -->
          <h3 class="donation-success-title mt-3 text-base font-bold">赞助成功</h3>

          <!-- 感谢语 — 多行有内容 -->
          <div class="donation-success-desc mt-3 space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
            <p>每一份支持，都是对创作的最大鼓励。</p>
            <p>你的慷慨让这里变得更好，</p>
            <p>感谢你选择成为这段旅程的一部分 ✨</p>
          </div>

          <!-- 收据信息 -->
          <div class="donation-success-detail mt-5 w-full rounded-xl bg-muted/30 px-4 py-3 text-left">
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-muted-foreground/60">支付方式</span>
              <span class="text-xs font-medium">{{ payMethodLabel }}</span>
            </div>
            <div v-if="form.donorName" class="mt-1.5 flex items-center justify-between">
              <span class="text-[11px] text-muted-foreground/60">赞助者</span>
              <span class="text-xs font-medium">{{ form.donorName }}</span>
            </div>
            <div v-if="form.message" class="mt-1.5 flex items-center justify-between">
              <span class="text-[11px] text-muted-foreground/60">留言</span>
              <span class="max-w-[160px] truncate text-xs font-medium">{{ form.message }}</span>
            </div>
          </div>

          <!-- 凭证 -->
          <div class="donation-success-voucher mt-3 flex items-center gap-1.5">
            <code class="font-mono text-[10px] text-muted-foreground/40">{{ donationId }}</code>
            <button
              type="button"
              class="cursor-pointer text-muted-foreground/25 hover:text-foreground transition-colors"
              @click="() => { navigator.clipboard.writeText(donationId); toast({ title: '已复制', duration: 1500 }) }"
            >
              <Copy class="h-2.5 w-2.5" />
            </button>
          </div>

          <!-- 完成按钮 -->
          <Button class="donation-success-btn mt-6 cursor-pointer rounded-full px-10" @click="closeSuccess">
            完成
          </Button>
        </div>
      </template>

      <!-- ═══ 正常步骤页 (step 1-3) ═══ -->
      <template v-else>
        <!-- 头部 -->
        <div class="pr-8 pl-4 pt-4 pb-2 sm:px-7 sm:pt-6 sm:pb-4">
          <DialogTitle class="text-base font-semibold">赞助支持</DialogTitle>
          <div class="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2">
            <template v-for="i in totalSteps" :key="i">
              <div
                class="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-medium transition-all duration-300"
                :class="i < step
                  ? 'bg-primary text-primary-foreground'
                  : i === step
                    ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                    : 'bg-muted text-muted-foreground'"
              >{{ i }}</div>
              <div v-if="i < totalSteps" class="h-px flex-1 bg-border/50" />
            </template>
            <span class="ml-1 text-[10px] sm:text-[11px] text-muted-foreground">{{ stepLabels[step - 1] }}</span>
          </div>
        </div>

        <Separator class="opacity-50" />

        <!-- 内容区 -->
        <div class="donation-step-content overflow-y-auto px-4 py-3 sm:px-7 sm:py-5">

          <!-- Step 1: 基本信息 -->
          <div v-if="step === 1" class="space-y-5">
            <div class="space-y-2">
              <label for="donor-amount" class="text-xs font-medium text-foreground/70">
                赞助金额 <span class="text-primary">*</span>
              </label>
              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  class="h-9 w-9 shrink-0 cursor-pointer rounded-lg"
                  :disabled="form.amount <= 1 || (amount != null && amount > 0)"
                  @click="form.amount = Math.max(1, form.amount - 1)"
                >
                  <Minus class="h-3.5 w-3.5" />
                </Button>
                <div class="relative flex-1">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">¥</span>
                  <Input
                    id="donor-amount"
                    v-model.number="form.amount"
                    type="number"
                    min="1"
                    class="h-10 pl-8 text-center text-base font-semibold"
                    :disabled="amount != null && amount > 0"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  class="h-9 w-9 shrink-0 cursor-pointer rounded-lg"
                  :disabled="amount != null && amount > 0"
                  @click="form.amount = form.amount + 1"
                >
                  <Plus class="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div class="space-y-2">
              <label for="donor-name" class="text-xs font-medium text-foreground/70">联系方式<span class="ml-1 text-[10px] font-normal text-muted-foreground/50">选填</span></label>
              <Input
                id="donor-name"
                v-model="form.donorName"
                placeholder="昵称 / 邮箱 / TG"
                maxlength="50"
              />
            </div>

            <div class="space-y-2">
              <label for="donor-message" class="text-xs font-medium text-foreground/70">留言<span class="ml-1 text-[10px] font-normal text-muted-foreground/50">选填</span></label>
              <Input
                id="donor-message"
                v-model="form.message"
                placeholder="想对作者说的话..."
                maxlength="200"
              />
            </div>
          </div>

          <!-- Step 2: 支付方式 -->
          <div v-if="step === 2" class="space-y-5">
            <div class="space-y-2.5">
              <label class="text-xs font-medium text-foreground/70">选择支付方式</label>
              <div class="grid grid-cols-3 gap-2.5">
                <button
                  v-for="m in payMethods"
                  :key="m.value"
                  type="button"
                  class="donation-pay-btn relative flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all cursor-pointer"
                  :class="form.payMethod === m.value
                    ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                    : 'border-border/60 hover:border-primary/30 hover:shadow-sm'"
                  @click="form.payMethod = m.value"
                >
                  <!-- Bitcoin icon -->
                  <svg v-if="m.value === 'crypto'" class="h-5 w-5" viewBox="0 0 24 24" fill="#F7931A"><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/></svg>
                  <!-- Alipay icon -->
                  <svg v-else-if="m.value === 'alipay'" class="h-5 w-5" viewBox="0 0 24 24" fill="#1677FF"><path d="M19.695 15.07c3.426 1.158 4.203 1.22 4.203 1.22V3.846c0-2.124-1.705-3.845-3.81-3.845H3.914C1.808.001.102 1.722.102 3.846v16.31c0 2.123 1.706 3.845 3.813 3.845h16.173c2.105 0 3.81-1.722 3.81-3.845v-.157s-6.19-2.602-9.315-4.119c-2.096 2.602-4.8 4.181-7.607 4.181-4.75 0-6.361-4.19-4.112-6.949.49-.602 1.324-1.175 2.617-1.497 2.025-.502 5.247.313 8.266 1.317a16.796 16.796 0 0 0 1.341-3.302H5.781v-.952h4.799V6.975H4.77v-.953h5.81V3.591s0-.409.411-.409h2.347v2.84h5.744v.951h-5.744v1.704h4.69a19.453 19.453 0 0 1-1.986 5.06c1.424.52 2.702 1.011 3.654 1.333m-13.81-2.032c-.596.06-1.71.325-2.321.869-1.83 1.608-.735 4.55 2.968 4.55 2.151 0 4.301-1.388 5.99-3.61-2.403-1.182-4.438-2.028-6.637-1.809"/></svg>
                  <!-- WeChat icon -->
                  <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="#07C160"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>
                  <span class="text-xs font-medium">{{ m.label }}</span>
                  <span v-if="m.recommended" class="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">推荐</span>
                </button>
              </div>
            </div>

            <!-- 微信 / 支付宝 -->
            <div v-if="form.payMethod !== 'crypto'" class="space-y-3">
              <div class="flex justify-center">
                <div class="flex h-40 w-40 items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20">
                  <div class="text-center text-muted-foreground">
                    <QrCode class="mx-auto h-7 w-7" />
                    <p class="mt-1.5 text-[11px]">{{ form.payMethod === 'wechat' ? '微信' : '支付宝' }}收款码</p>
                  </div>
                </div>
              </div>
              <p class="text-center text-[11px] text-muted-foreground">
                请扫码赞助 <span class="font-semibold text-foreground">¥{{ form.amount }}</span>，转账备注你的昵称方便确认。
              </p>
            </div>

            <!-- 加密货币 -->
            <div v-if="form.payMethod === 'crypto'" class="space-y-5">
              <!-- 网络选择 -->
              <div class="space-y-2.5">
                <label class="text-xs font-medium text-foreground/70">选择网络</label>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="net in networkOptions"
                    :key="net.value"
                    type="button"
                    class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-all cursor-pointer"
                    :class="form.cryptoNetwork === net.value
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                      : 'border-border/60 hover:border-primary/30'"
                    @click="form.cryptoNetwork = net.value"
                  >
                    <svg v-if="net.value === 'TRC20'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#50AF95"><path d="M18.7538 10.5176c0 .6251-2.2379 1.1483-5.2381 1.2812l.0028.0007c-.0848.0064-.5233.0325-1.5012.0325-.7778 0-1.33-.0233-1.5237-.0325-3.0059-.1322-5.2495-.6555-5.2495-1.2819s2.2436-1.149 5.2495-1.2834v2.0442c.1965.0142.7594.0474 1.5372.0474.9334 0 1.4008-.0389 1.4849-.0466V9.2356c2.9994.1337 5.2381.657 5.2381 1.282zm5.19.5466L12.1248 22.389a.1803.1803 0 0 1-.2496 0L.0562 11.0635a.1781.1781 0 0 1-.0382-.2079l4.3762-9.1921a.1767.1767 0 0 1 .1626-.1026h14.8878a.1768.1768 0 0 1 .1612.1032l4.3762 9.1922a.1782.1782 0 0 1-.0382.2079zm-4.478-.4038c0-.8068-2.5515-1.4799-5.9473-1.6369V7.195h4.186V4.4055H6.3076V7.195h4.1852v1.8286c-3.4018.1562-5.9601.83-5.9601 1.6376 0 .8075 2.5583 1.4806 5.9601 1.6376v5.8618h3.025v-5.8639c3.394-.1563 5.948-.8295 5.948-1.6363z"/></svg>
                    <svg v-else-if="net.value === 'BSC'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#F0B90B"><path d="M5.631 3.676 12.001 0l6.367 3.676-2.34 1.358L12 2.716 7.972 5.034l-2.34-1.358Zm12.737 4.636-2.34-1.358L12 9.272 7.972 6.954l-2.34 1.358v2.716l4.026 2.318v4.636L12 19.341l2.341-1.359v-4.636l4.027-2.318V8.312Zm0 7.352v-2.716l-2.34 1.358v2.716l2.34-1.358Zm1.663.96-4.027 2.318v2.717l6.368-3.677V10.63l-2.34 1.358v4.636Zm-2.34-10.63 2.34 1.358v2.716l2.341-1.358V5.994l-2.34-1.358-2.342 1.358ZM9.657 19.926v2.716L12 24l2.341-1.358v-2.716l-2.34 1.358-2.343-1.358Zm-4.027-4.262 2.341 1.358v-2.716l-2.34-1.358v2.716Zm4.027-9.67L12 7.352l2.341-1.358-2.34-1.358-2.343 1.358Zm-5.69 1.358L6.31 5.994 3.968 4.636l-2.34 1.358V8.71l2.34 1.358V7.352Zm0 4.636-2.34-1.358v7.352l6.368 3.677v-2.717l-4.028-2.318v-4.636Z"/></svg>
                    <svg v-else class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#7B3FE4"><path d="m17.82 16.342 5.692-3.287A.98.98 0 0 0 24 12.21V5.635a.98.98 0 0 0-.488-.846l-5.693-3.286a.98.98 0 0 0-.977 0L11.15 4.789a.98.98 0 0 0-.489.846v11.747L6.67 19.686l-3.992-2.304v-4.61l3.992-2.304 2.633 1.52V8.896L7.158 7.658a.98.98 0 0 0-.977 0L.488 10.945a.98.98 0 0 0-.488.846v6.573a.98.98 0 0 0 .488.847l5.693 3.286a.981.981 0 0 0 .977 0l5.692-3.286a.98.98 0 0 0 .489-.846V6.618l.072-.041 3.92-2.263 3.99 2.305v4.609l-3.99 2.304-2.63-1.517v3.092l2.14 1.236a.981.981 0 0 0 .978 0v-.001Z"/></svg>
                    <span class="text-[11px] font-medium">{{ net.label }}</span>
                    <span v-if="net.recommended" class="rounded bg-primary/10 px-1 py-px text-[8px] font-medium text-primary">推荐</span>
                  </button>
                </div>
              </div>

              <!-- 支付信息卡片 -->
              <div class="rounded-xl border border-border/50 bg-card overflow-hidden text-xs sm:text-sm">
                <!-- 顶栏：金额 -->
                <div class="flex items-center justify-between border-b border-border/30 px-3 py-2 sm:px-4 sm:py-2.5">
                  <span class="text-[10px] sm:text-[11px] text-muted-foreground">转账金额</span>
                  <div class="text-right">
                    <span class="text-xs sm:text-sm font-bold tracking-tight">¥{{ form.amount }}</span>
                    <span class="ml-1.5 text-[10px] sm:text-[11px] text-primary/70 font-medium">≈ ${{ usdtAmount }} USDT</span>
                  </div>
                </div>
                <!-- 主体：移动端上下，桌面端左右 -->
                <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-4 p-3 sm:p-4">
                  <!-- 左：地址 + 警告 -->
                  <div class="flex min-w-0 flex-1 flex-col">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] sm:text-[11px] font-medium text-foreground/60">{{ form.cryptoNetwork }} 收款地址</span>
                      <button
                        type="button"
                        class="flex items-center gap-1 rounded-md border border-border/50 px-2 py-0.5 text-[10px] text-foreground/60 hover:text-foreground hover:border-border transition-colors cursor-pointer bg-background"
                        @click="copyAddress"
                      >
                        <component :is="copied ? Check : Copy" class="h-3 w-3" />
                        {{ copied ? '已复制' : '复制' }}
                      </button>
                    </div>
                    <div class="mt-1.5 rounded-lg bg-muted/30 p-2 sm:p-2.5">
                      <p class="break-all font-mono text-[9px] sm:text-[10px] leading-relaxed select-all">{{ currentAddress }}</p>
                    </div>
                    <div class="mt-2 rounded-md border border-amber-500/20 bg-amber-500/8 px-2.5 py-1.5">
                      <p class="text-[10px] sm:text-[11px] leading-relaxed text-amber-600 dark:text-amber-400 font-medium">
                        ⚠ 仅限 {{ currentNetworkDesc }} 资产，其他网络无法到账。
                      </p>
                    </div>
                  </div>
                  <!-- 右：二维码 -->
                  <div class="flex h-20 w-20 sm:h-[132px] sm:w-[132px] shrink-0 mx-auto sm:mx-0 items-center justify-center rounded-lg bg-muted/20">
                    <div class="text-center text-muted-foreground/40">
                      <QrCode class="mx-auto h-4 w-4 sm:h-6 sm:w-6" />
                      <p class="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px]">扫码</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: 确认 -->
          <div v-if="step === 3" class="space-y-5">
            <div class="rounded-xl border border-border/60 divide-y divide-border/40">
              <div class="flex justify-between px-4 py-3">
                <span class="text-xs text-muted-foreground/60">联系方式</span>
                <span class="text-xs font-medium">{{ form.donorName || '未填写' }}</span>
              </div>
              <div class="flex justify-between px-4 py-3">
                <span class="text-xs text-muted-foreground/60">金额</span>
                <span class="text-xs font-semibold">¥{{ form.amount }}</span>
              </div>
              <div class="flex justify-between px-4 py-3">
                <span class="text-xs text-muted-foreground/60">支付方式</span>
                <span class="text-xs font-medium">{{ payMethodLabel }}</span>
              </div>
              <div v-if="form.payMethod === 'crypto'" class="flex justify-between px-4 py-3">
                <span class="text-xs text-muted-foreground/60">网络</span>
                <span class="text-xs font-medium">{{ form.cryptoNetwork }}</span>
              </div>
              <div v-if="form.message" class="flex justify-between px-4 py-3">
                <span class="text-xs text-muted-foreground/60">留言</span>
                <span class="max-w-[180px] truncate text-xs font-medium">{{ form.message }}</span>
              </div>
            </div>

            <div v-if="form.payMethod === 'crypto'" class="space-y-2">
              <label class="text-xs font-medium text-foreground/70">
                <Wallet class="mr-1 inline h-3 w-3" />
                交易哈希<span class="ml-1 text-[10px] font-normal text-muted-foreground/50">选填</span>
              </label>
              <Input
                v-model="form.cryptoTxHash"
                placeholder="0x... 或 链上交易 Hash"
                class="font-mono text-xs h-9"
              />
              <p class="text-[11px] text-muted-foreground">
                填写可加速确认，不填也可以提交。
              </p>
            </div>

            <div v-else class="rounded-lg bg-muted/30 px-4 py-3 text-center">
              <p class="text-xs text-muted-foreground">请确认已完成扫码支付</p>
              <p class="mt-0.5 text-[11px] text-muted-foreground/60">提交后我们会人工核实到账情况</p>
            </div>
          </div>
        </div>

        <Separator class="opacity-50" />

        <!-- 底部按钮 -->
        <div class="flex items-center justify-between px-4 py-2.5 sm:px-7 sm:py-4">
          <Button
            v-if="step > 1"
            variant="ghost"
            size="sm"
            class="cursor-pointer"
            @click="prevStep"
          >
            <ArrowLeft class="mr-1 h-3.5 w-3.5" />
            上一步
          </Button>
          <div v-else />

          <Button
            v-if="step < totalSteps"
            size="sm"
            class="cursor-pointer rounded-lg"
            :disabled="!canNext"
            @click="nextStep"
          >
            下一步
            <ArrowRight class="ml-1 h-3.5 w-3.5" />
          </Button>
          <Button
            v-else
            size="sm"
            class="cursor-pointer rounded-lg"
            @click="handleSubmit"
          >
            <Heart class="mr-1 h-3.5 w-3.5 fill-current" />
            提交赞助
          </Button>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
/* ═══ 礼花粒子动画 ═══ */
@keyframes confetti-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(420px) translateX(var(--sway)) rotate(var(--rotate));
    opacity: 0;
  }
}

.donation-confetti {
  position: absolute;
  animation: confetti-fall cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* ═══ 成功页 ═══ */
.donation-success-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
}

@media (min-width: 640px) {
  .donation-success-page {
    padding: 2.5rem 2rem 2rem;
  }
}

@keyframes success-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.donation-success-emoji {
  display: inline-block;
  animation: success-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes success-bounce {
  0% { transform: scale(0.3) rotate(-15deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(4deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.donation-success-amount {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  animation: success-fade-up 0.4s 0.15s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.donation-success-title {
  animation: success-fade-up 0.4s 0.22s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.donation-success-desc {
  animation: success-fade-up 0.4s 0.28s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.donation-success-detail {
  animation: success-fade-up 0.4s 0.34s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.donation-success-voucher {
  animation: success-fade-up 0.4s 0.38s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.donation-success-btn {
  animation: success-fade-up 0.4s 0.44s cubic-bezier(0.4, 0, 0.2, 1) both;
}
</style>
