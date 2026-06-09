<script setup lang="ts">
import { ref, watch } from 'vue'
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Ticket, Loader2 } from 'lucide-vue-next'
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'login-success'): void
}>()

const loginType = ref<'password' | 'email'>('password')
const pwdForm = ref({ account: '', password: '' })
const emailForm = ref({ email: '', code: '' })
const showPwd = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

const isRegister = ref(false)
const registerForm = ref({ username: '', email: '', code: '', password: '', inviteCode: '' })
const showRegPwd = ref(false)
const isRegistering = ref(false)

const codeCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function startCooldown() {
  if (cooldownTimer) clearInterval(cooldownTimer)
  codeCooldown.value = 60
  cooldownTimer = setInterval(() => {
    codeCooldown.value--
    if (codeCooldown.value <= 0) { clearInterval(cooldownTimer!); cooldownTimer = null }
  }, 1000)
}

function sendCode() { if (codeCooldown.value <= 0) startCooldown() }

async function handleLogin() {
  isLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  isLoading.value = false
  emit('login-success')
  emit('update:open', false)
}

async function handleRegister() {
  isRegistering.value = true
  await new Promise(r => setTimeout(r, 600))
  isRegistering.value = false
  emit('login-success')
  emit('update:open', false)
}

watch(() => props.open, (val) => {
  if (val) {
    loginType.value = 'password'
    isRegister.value = false
    showPwd.value = false
    showRegPwd.value = false
    pwdForm.value = { account: '', password: '' }
    emailForm.value = { email: '', code: '' }
    registerForm.value = { username: '', email: '', code: '', password: '', inviteCode: '' }
  }
})
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
      @click="emit('update:open', false)"
    >
      <Card class="w-full max-w-[420px] shadow-none border-border/60" @click.stop>
        <CardHeader class="space-y-1 pb-4">
          <div class="flex items-center justify-between">
            <CardTitle class="text-xl">{{ isRegister ? '创建账号' : '欢迎回来' }}</CardTitle>
            <button class="text-muted-foreground hover:text-foreground transition-colors" @click="emit('update:open', false)">✕</button>
          </div>
          <CardDescription>{{ isRegister ? '使用邀请码注册，加入开发者社区' : '登录你的账号以继续' }}</CardDescription>
        </CardHeader>

        <CardContent>
          <template v-if="!isRegister">
            <Tabs v-model="loginType" default-value="password">
              <TabsList class="mb-4 w-full grid grid-cols-2">
                <button
                  class="flex items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-all cursor-pointer"
                  :class="loginType === 'password' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                  @click="loginType = 'password'"
                >
                  <Lock class="h-3.5 w-3.5" /> 密码登录
                </button>
                <button
                  class="flex items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-all cursor-pointer"
                  :class="loginType === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                  @click="loginType = 'email'"
                >
                  <Mail class="h-3.5 w-3.5" /> 验证码登录
                </button>
              </TabsList>

              <TabsContent value="password" class="space-y-3">
                <div class="space-y-1.5">
                  <Label>邮箱 / 用户名</Label>
                  <div class="relative">
                    <User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input v-model="pwdForm.account" placeholder="输入邮箱或用户名" class="pl-9" @keyup.enter="handleLogin" />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <Label>密码</Label>
                  <div class="relative">
                    <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input v-model="pwdForm.password" :type="showPwd ? 'text' : 'password'" placeholder="输入密码" class="pl-9 pr-9" @keyup.enter="handleLogin" />
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" @click="showPwd = !showPwd">
                      <Eye v-if="!showPwd" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox v-model:checked="rememberMe" />
                    <span class="text-xs font-normal text-muted-foreground">30天免登录</span>
                  </div>
                  <a href="#" class="text-xs text-muted-foreground hover:text-foreground" @click.prevent>忘记密码？</a>
                </div>
              </TabsContent>

              <TabsContent value="email" class="space-y-3">
                <div class="space-y-1.5">
                  <Label>邮箱地址</Label>
                  <div class="relative">
                    <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input v-model="emailForm.email" type="email" placeholder="输入常用邮箱" class="pl-9" @keyup.enter="handleLogin" />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <Label>验证码</Label>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <ShieldCheck class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input v-model="emailForm.code" placeholder="6位验证码" maxlength="6" class="pl-9" @keyup.enter="handleLogin" />
                    </div>
                    <Button variant="outline" size="sm" class="shrink-0 cursor-pointer" :disabled="codeCooldown > 0" @click="sendCode">
                      {{ codeCooldown > 0 ? `${codeCooldown}s` : '获取验证码' }}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button class="mt-4 w-full cursor-pointer" :disabled="isLoading" @click="handleLogin">
              <Loader2 v-if="isLoading" class="mr-1.5 h-4 w-4 animate-spin" />
              {{ isLoading ? '登录中...' : '立即登录' }}
            </Button>

            <Separator class="my-4" />
            <div class="text-center text-xs text-muted-foreground">
              还没有账号？
              <button class="font-medium text-foreground hover:underline" @click="isRegister = true">使用邀请码注册</button>
            </div>
          </template>

          <template v-else>
            <div class="space-y-3">
              <div class="space-y-1.5">
                <Label>邀请码 <span class="text-red-500 dark:text-red-400">*</span></Label>
                <div class="relative">
                  <Ticket class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input v-model="registerForm.inviteCode" placeholder="输入邀请码" class="pl-9" />
                </div>
              </div>
              <div class="space-y-1.5">
                <Label>用户名</Label>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input v-model="registerForm.username" placeholder="设置用户名（至少3个字符）" class="pl-9" />
                </div>
              </div>
              <div class="space-y-1.5">
                <Label>邮箱</Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input v-model="registerForm.email" type="email" placeholder="绑定安全邮箱" class="pl-9" />
                </div>
              </div>
              <div class="space-y-1.5">
                <Label>验证码</Label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <ShieldCheck class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input v-model="registerForm.code" placeholder="6位验证码" maxlength="6" class="pl-9" />
                  </div>
                  <Button variant="outline" size="sm" class="shrink-0 cursor-pointer" :disabled="codeCooldown > 0" @click="sendCode">
                    {{ codeCooldown > 0 ? `${codeCooldown}s` : '获取验证码' }}
                  </Button>
                </div>
              </div>
              <div class="space-y-1.5">
                <Label>密码</Label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input v-model="registerForm.password" :type="showRegPwd ? 'text' : 'password'" placeholder="设置密码（至少6个字符）" class="pl-9 pr-9" />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" @click="showRegPwd = !showRegPwd">
                    <Eye v-if="!showRegPwd" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Button class="mt-2 w-full cursor-pointer" :disabled="isRegistering" @click="handleRegister">
                <Loader2 v-if="isRegistering" class="mr-1.5 h-4 w-4 animate-spin" />
                {{ isRegistering ? '注册中...' : '立即注册' }}
              </Button>
              <p class="text-center text-xs text-muted-foreground">
                已有账号？
                <button class="font-medium text-foreground hover:underline" @click="isRegister = false">返回登录</button>
              </p>
            </div>
          </template>
        </CardContent>
      </Card>
    </div>
  </transition>
</template>
