<!-- src/components/v1/auth/LoginModal.vue -->
<template>
  <transition
    enter-active-class="transition duration-250 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 transition-opacity"
        :class="isDark ? 'bg-black/60' : 'bg-gray-900/30'"
        @click="closeModal"
      ></div>

      <!-- Modal Card -->
      <transition
        enter-active-class="transition duration-250 ease-out"
        enter-from-class="opacity-0 scale-[0.96] translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-180 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-[0.97] translate-y-1"
      >
        <div
          v-if="isOpen"
          class="relative w-full max-w-[420px] rounded-[20px] overflow-hidden"
          :class="isDark
            ? 'bg-[#0d1117] border border-white/[0.08]'
            : 'bg-white border border-gray-200/70'"
          style="box-shadow: 0 20px 60px -12px rgba(0,0,0,0.25), 0 6px 20px -4px rgba(0,0,0,0.08)"
        >

          <div class="px-8 pt-7 pb-7 relative">

            <!-- Close button -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
              :class="isDark ? 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.07]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
            >
              <font-awesome-icon icon="xmark" class="text-[13px]" />
            </button>

            <!-- ── HEADER ── -->
            <div class="mb-7">
              <p class="text-[12px] font-semibold tracking-widest uppercase mb-3"
                 :class="isDark ? 'text-blue-400' : 'text-blue-600'">博客资源</p>
              <h2 class="text-[26px] font-bold tracking-tight leading-tight"
                  :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ viewMode === 'login' ? '登录账号' : '创建账号' }}
              </h2>
              <p class="text-[13.5px] mt-2"
                 :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ viewMode === 'login' ? '输入凭证以继续访问' : '免费注册，解锁全站内容' }}
              </p>
            </div>

            <!-- ── TAB SWITCHER (login mode only) ── -->
            <div
              v-if="viewMode === 'login'"
              class="flex p-[3px] mb-5 rounded-xl border"
              :class="isDark
                ? 'bg-white/[0.03] border-white/[0.06]'
                : 'bg-gray-50 border-gray-200/60'"
            >
              <button
                v-for="tab in loginTabs"
                :key="tab.key"
                @click="loginType = tab.key"
                class="flex-1 flex items-center justify-center gap-1.5 py-[9px] text-[12.5px] font-semibold rounded-[9px] transition-all duration-200"
                :class="loginType === tab.key
                  ? (isDark
                      ? 'bg-white/[0.09] text-white border border-white/[0.09] shadow-sm'
                      : 'bg-white text-gray-900 border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.07)]')
                  : (isDark
                      ? 'text-gray-500 hover:text-gray-400'
                      : 'text-gray-400 hover:text-gray-600')"
              >
                <font-awesome-icon :icon="tab.icon" class="text-[10px]" />
                {{ tab.label }}
              </button>
            </div>

            <!-- ── FORM FIELDS ── -->
            <transition name="form-fade" mode="out-in">
              <!-- Email Code Login -->
              <div v-if="viewMode === 'login' && loginType === 'email'" key="login-email" class="space-y-3">
                <div class="relative group">
                  <input
                    v-model="emailForm.account"
                    type="email"
                    placeholder="输入常用邮箱"
                    class="input-field w-full pl-[36px] pr-3.5 py-[10.5px]"
                    :class="inputCls"
                    @keyup.enter="handleEmailLogin"
                  />
                  <font-awesome-icon
                    icon="envelope"
                    class="input-icon absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                    :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                  />
                </div>
                <div class="flex gap-2">
                  <div class="relative flex-1 group">
                    <input
                      v-model="emailForm.code"
                      type="text"
                      placeholder="6位验证码"
                      maxlength="6"
                      class="input-field w-full pl-[36px] pr-3.5 py-[10.5px]"
                      :class="inputCls"
                      @keyup.enter="handleEmailLogin"
                    />
                    <font-awesome-icon
                      icon="shield-halved"
                      class="input-icon absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                      :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                    />
                  </div>
                  <button
                    class="code-btn px-3.5 text-[12px] font-semibold rounded-[10px] border whitespace-nowrap transition-all duration-150 active:scale-[0.97]"
                    :class="[codeBtnCls, { 'opacity-50 cursor-not-allowed': codeCooldown > 0 }]"
                    :disabled="codeCooldown > 0 || sendingCode"
                    @click="handleSendCode('login')"
                  >
                    {{ sendingCode ? '发送中...' : codeCooldown > 0 ? `${codeCooldown}s` : '获取验证码' }}
                  </button>
                </div>
              </div>

              <!-- Password Login -->
              <div v-else-if="viewMode === 'login' && loginType === 'password'" key="login-password" class="space-y-3">
                <div class="relative group">
                  <input
                    v-model="pwdForm.account"
                    type="text"
                    placeholder="邮箱 / 用户名"
                    class="input-field w-full pl-[36px] pr-3.5 py-[10.5px]"
                    :class="inputCls"
                    @keyup.enter="handlePwdLogin"
                  />
                  <font-awesome-icon
                    icon="user"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                    :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                  />
                </div>
                <div class="relative group">
                  <input
                    v-model="pwdForm.password"
                    :type="showPwd ? 'text' : 'password'"
                    placeholder="请输入密码"
                    class="input-field w-full pl-[36px] pr-9 py-[10.5px]"
                    :class="inputCls"
                    @keyup.enter="handlePwdLogin"
                  />
                  <font-awesome-icon
                    icon="lock"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                    :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                  />
                  <button
                    type="button"
                    @click="showPwd = !showPwd"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] transition-colors"
                    :class="isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'"
                  >
                    <font-awesome-icon :icon="showPwd ? 'eye-slash' : 'eye'" />
                  </button>
                </div>
                <div class="flex justify-between items-center px-0.5 pt-0.5">
                  <label class="flex items-center gap-1.5 cursor-pointer group/check select-none">
                    <input
                      type="checkbox"
                      v-model="rememberMe"
                      class="w-3.5 h-3.5 rounded-[4px] border appearance-none transition-all cursor-pointer"
                      :class="isDark
                        ? 'border-white/20 bg-white/[0.04] checked:bg-blue-500 checked:border-blue-500'
                        : 'border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-400'"
                    />
                    <span
                      class="text-[11.5px] font-medium"
                      :class="isDark ? 'text-gray-500 group-hover/check:text-gray-400' : 'text-gray-500 group-hover/check:text-gray-700'"
                    >30天免登录</span>
                  </label>
                  <a
                    href="#"
                    class="text-[11.5px] font-medium transition-colors"
                    :class="isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'"
                    @click.prevent
                  >忘记密码？</a>
                </div>
              </div>

              <!-- Register -->
              <div v-else-if="viewMode === 'register'" key="register" class="space-y-3">
                <div class="relative group">
                  <input
                    v-model="registerForm.username"
                    type="text"
                    placeholder="设置用户名"
                    class="input-field w-full pl-[36px] pr-3.5 py-[10.5px]"
                    :class="inputCls"
                  />
                  <font-awesome-icon
                    icon="user"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                    :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                  />
                </div>
                <div class="relative group">
                  <input
                    v-model="registerForm.email"
                    type="email"
                    placeholder="绑定安全邮箱"
                    class="input-field w-full pl-[36px] pr-3.5 py-[10.5px]"
                    :class="inputCls"
                  />
                  <font-awesome-icon
                    icon="envelope"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                    :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                  />
                </div>
                <div class="flex gap-2">
                  <div class="relative flex-1 group">
                    <input
                      v-model="registerForm.code"
                      type="text"
                      placeholder="邮箱验证码"
                      maxlength="6"
                      class="input-field w-full pl-[36px] pr-3.5 py-[10.5px]"
                      :class="inputCls"
                    />
                    <font-awesome-icon
                      icon="shield-halved"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                      :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                    />
                  </div>
                  <button
                    class="code-btn px-3.5 text-[12px] font-semibold rounded-[10px] border whitespace-nowrap transition-all duration-150 active:scale-[0.97]"
                    :class="[codeBtnCls, { 'opacity-50 cursor-not-allowed': codeCooldown > 0 }]"
                    :disabled="codeCooldown > 0 || sendingCode"
                    @click="handleSendCode('register')"
                  >
                    {{ sendingCode ? '发送中...' : codeCooldown > 0 ? `${codeCooldown}s` : '获取验证码' }}
                  </button>
                </div>
                <div class="relative group">
                  <input
                    v-model="registerForm.password"
                    :type="showPwd ? 'text' : 'password'"
                    placeholder="设置登录密码"
                    class="input-field w-full pl-[36px] pr-9 py-[10.5px]"
                    :class="inputCls"
                  />
                  <font-awesome-icon
                    icon="lock"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] pointer-events-none transition-colors"
                    :class="isDark ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'"
                  />
                  <button
                    type="button"
                    @click="showPwd = !showPwd"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] transition-colors"
                    :class="isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'"
                  >
                    <font-awesome-icon :icon="showPwd ? 'eye-slash' : 'eye'" />
                  </button>
                </div>
              </div>
            </transition>

            <!-- ── SUBMIT BUTTON ── -->
            <button
              @click="handleSubmit"
              :disabled="isLoading"
              class="submit-btn w-full mt-5 py-[11px] rounded-[11px] text-white text-[13.5px] font-bold tracking-wide flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 active:scale-[0.98]"
            >
              <span
                class="absolute inset-0 btn-gradient-base transition-opacity duration-200"
              ></span>
              <span
                class="absolute inset-0 btn-gradient-hover opacity-0 btn-hover-overlay transition-opacity duration-200"
              ></span>
              <font-awesome-icon
                v-if="!isLoading"
                :icon="viewMode === 'login' ? 'arrow-right-to-bracket' : 'user-plus'"
                class="text-[11.5px] relative z-10"
              />
              <font-awesome-icon
                v-else
                icon="spinner"
                spin
                class="text-[11.5px] relative z-10"
              />
              <span class="relative z-10">{{ isLoading ? '请稍候...' : viewMode === 'login' ? '立即登录' : '创建账号' }}</span>
            </button>

            <!-- ── SOCIAL LOGIN ── -->
            <div class="flex gap-2.5 mt-4">
              <button
                v-for="social in socialLogins"
                :key="social.key"
                class="flex-1 flex items-center justify-center gap-1.5 py-[9px] rounded-[10px] border text-[12.5px] font-semibold transition-all duration-150 active:scale-[0.97]"
                :class="isDark
                  ? 'bg-white/[0.03] border-white/[0.07] text-gray-400 hover:bg-white/[0.07] hover:text-gray-200 hover:border-white/[0.13]'
                  : 'bg-white border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'"
              >
                <font-awesome-icon :icon="['fab', social.icon]" class="text-[15px]" :style="{ color: social.color }" />
                <span>{{ social.label }}</span>
              </button>
            </div>

            <!-- ── FOOTER LINK ── -->
            <p class="mt-5 text-center text-[12px]" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
              {{ viewMode === 'login' ? '还没有账号？' : '已有账号？' }}
              <button
                @click="toggleMode"
                class="font-semibold transition-colors ml-0.5"
                :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'"
              >
                {{ viewMode === 'login' ? '免费注册' : '立即登录' }} →
              </button>
            </p>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  isDark: { type: Boolean, default: false },
  initialMode: { type: String, default: 'login' }
})

const emit = defineEmits(['close', 'login-success'])

const userStore = useUserStore()

const viewMode = ref<'login' | 'register'>('login')
const loginType = ref<'email' | 'password'>('password')
const showPwd = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const sendingCode = ref(false)
const codeCooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval> | null = null

// ── 表单数据 ──
const pwdForm = ref({ account: '', password: '' })
const emailForm = ref({ account: '', code: '' })
const registerForm = ref({ username: '', email: '', code: '', password: '' })

const loginTabs = [
  { key: 'password' as const, label: '密码登录', icon: 'lock' },
  { key: 'email' as const, label: '验证码登录', icon: 'envelope' },
]

const socialLogins = [
  { key: 'github', icon: 'github', label: 'GitHub', color: '#6e7681' },
  { key: 'google', icon: 'google', label: 'Google', color: '#ea4335' },
]

// Shared input classes
const inputCls = computed(() =>
  props.isDark
    ? 'bg-white/[0.04] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-blue-500/50 focus:ring-blue-500/15 hover:border-white/[0.14]'
    : 'bg-gray-50/70 border-gray-200/80 text-gray-900 placeholder-gray-400 focus:border-blue-500/60 focus:ring-blue-500/10 hover:border-gray-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
)

const codeBtnCls = computed(() =>
  props.isDark
    ? 'bg-white/[0.05] border-white/[0.08] text-gray-300 hover:bg-white/[0.09] hover:text-white'
    : 'bg-white border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
)

watch(() => props.isOpen, (val) => {
  if (val) {
    viewMode.value = props.initialMode as 'login' | 'register'
    loginType.value = 'password'
    showPwd.value = false
    rememberMe.value = false
    isLoading.value = false
    resetForms()
    clearCooldown()
  }
})

function resetForms() {
  pwdForm.value = { account: '', password: '' }
  emailForm.value = { account: '', code: '' }
  registerForm.value = { username: '', email: '', code: '', password: '' }
}

function clearCooldown() {
  codeCooldown.value = 0
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
}

function startCooldown() {
  clearCooldown()
  codeCooldown.value = 60
  cooldownTimer = setInterval(() => {
    codeCooldown.value--
    if (codeCooldown.value <= 0) {
      clearCooldown()
    }
  }, 1000)
}

const closeModal = () => emit('close')

const toggleMode = () => {
  viewMode.value = viewMode.value === 'login' ? 'register' : 'login'
  showPwd.value = false
}

// ── 发送验证码 ──
async function handleSendCode(mode: 'login' | 'register') {
  const email = mode === 'login' ? emailForm.value.account : registerForm.value.email
  if (!email) {
    message.warning('请先输入邮箱地址')
    return
  }
  // 简单邮箱格式校验
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.warning('请输入有效的邮箱地址')
    return
  }

  sendingCode.value = true
  try {
    await userStore.sendCode(email)
    message.success('验证码已发送，请查看邮箱')
    startCooldown()
  } catch {
    // 错误已在 request.ts 拦截器中处理
  } finally {
    sendingCode.value = false
  }
}

// ── 密码登录 ──
async function handlePwdLogin() {
  if (!pwdForm.value.account) {
    message.warning('请输入用户名或邮箱')
    return
  }
  if (!pwdForm.value.password) {
    message.warning('请输入密码')
    return
  }

  isLoading.value = true
  try {
    await userStore.loginByPwd({
      account: pwdForm.value.account,
      password: pwdForm.value.password,
    })
    message.success('登录成功')
    emit('login-success')
    closeModal()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    isLoading.value = false
  }
}

// ── 验证码登录 ──
async function handleEmailLogin() {
  if (!emailForm.value.account) {
    message.warning('请输入邮箱地址')
    return
  }
  if (!emailForm.value.code || emailForm.value.code.length !== 6) {
    message.warning('请输入6位验证码')
    return
  }

  isLoading.value = true
  try {
    await userStore.loginByVerificationCode({
      account: emailForm.value.account,
      password: emailForm.value.code,
    })
    message.success('登录成功')
    emit('login-success')
    closeModal()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    isLoading.value = false
  }
}

// ── 注册 ──
async function handleRegister() {
  if (!registerForm.value.username) {
    message.warning('请设置用户名')
    return
  }
  if (registerForm.value.username.length < 3) {
    message.warning('用户名至少3个字符')
    return
  }
  if (!registerForm.value.email) {
    message.warning('请输入邮箱')
    return
  }
  if (!registerForm.value.code || registerForm.value.code.length !== 6) {
    message.warning('请输入6位验证码')
    return
  }
  if (!registerForm.value.password || registerForm.value.password.length < 6) {
    message.warning('密码至少6个字符')
    return
  }

  isLoading.value = true
  try {
    // 注册接口使用用户名+密码+邮箱
    await userStore.registerAccount({
      username: registerForm.value.username,
      password: registerForm.value.password,
      email: registerForm.value.email,
    })
    message.success('注册成功，请登录')
    viewMode.value = 'login'
    loginType.value = 'password'
    pwdForm.value.account = registerForm.value.username
    pwdForm.value.password = ''
  } catch {
    // 错误已在拦截器中处理
  } finally {
    isLoading.value = false
  }
}

// ── 统一提交 ──
function handleSubmit() {
  if (isLoading.value) return

  if (viewMode.value === 'login') {
    if (loginType.value === 'email') {
      handleEmailLogin()
    } else {
      handlePwdLogin()
    }
  } else {
    handleRegister()
  }
}
</script>

<style scoped>

/* ── Input field base ── */
.input-field {
  font-size: 13px;
  font-weight: 500;
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.input-field:focus {
  box-shadow: 0 0 0 2.5px var(--ring-color, rgba(59,130,246,0.12));
}

/* ── Code button shared height sync ── */
.code-btn {
  height: 100%;
  min-height: 38px;
}

/* ── Submit button gradient ── */
.btn-gradient-base {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3), inset 0 1px 1px rgba(255,255,255,0.15);
  border-radius: 11px;
}
.btn-gradient-hover {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border-radius: 11px;
}

.submit-btn:hover .btn-hover-overlay {
  opacity: 1;
}
.submit-btn:hover {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.38), inset 0 1px 1px rgba(255,255,255,0.2);
  transform: translateY(-0.5px);
}
.submit-btn:active {
  transform: translateY(0) scale(0.98);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* ── Form transition ── */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.form-fade-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
