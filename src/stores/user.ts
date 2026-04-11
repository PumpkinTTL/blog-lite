import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  loginByPassword,
  loginByCode,
  register,
  sendEmailCode,
  getProfile,
  updateProfile,
  getMembership,
  changePassword as changePasswordApi,
  deleteAccount as deleteAccountApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  checkUsername,
  checkEmail,
  type UserInfo,
  type UpdateProfileParams,
  type ChangePasswordParams,
  type DeleteAccountParams,
  type PasswordLoginParams,
  type CodeLoginParams,
  type RegisterParams,
  type MembershipData,
} from '@/apis/user'

export const useUserStore = defineStore('user', () => {
  // ── State ──
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const expireTime = ref<number>(0)

  // ── Getters ──
  const isLoggedIn = computed(() => !!token.value)
  const isVip = computed(() => {
    const premium = userInfo.value?.premium
    if (!premium) return false
    // is_active 登录响应可能不返回，默认视为 true；只有明确为 false 才排除
    if (premium.is_active === false) return false
    return new Date(premium.expiration_time).getTime() > Date.now()
  })
  const username = computed(() => userInfo.value?.nickname || userInfo.value?.username || '用户')
  const avatar = computed(() => userInfo.value?.avatar || '')
  const email = computed(() => userInfo.value?.email || '')
  const roles = computed(() => userInfo.value?.roles || [])

  // ── Actions ──

  /** 从 localStorage 恢复用户信息 */
  function loadFromStorage() {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        userInfo.value = JSON.parse(stored)
      } catch {
        userInfo.value = null
      }
    }
    const storedExpire = localStorage.getItem('expireTime')
    if (storedExpire) {
      expireTime.value = Number(storedExpire)
    }
  }

  /** 保存登录状态到 localStorage */
  function saveToStorage() {
    if (token.value) {
      localStorage.setItem('token', token.value)
    } else {
      localStorage.removeItem('token')
    }
    if (userInfo.value) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    } else {
      localStorage.removeItem('userInfo')
    }
    if (expireTime.value) {
      localStorage.setItem('expireTime', String(expireTime.value))
    } else {
      localStorage.removeItem('expireTime')
    }
  }

  /** 处理登录成功 */
  function handleLoginSuccess(res: { token: string; expireTime: number; data: UserInfo }) {
    token.value = res.token
    expireTime.value = res.expireTime
    userInfo.value = res.data
    saveToStorage()
  }

  /** 密码登录 */
  async function loginByPwd(params: Omit<PasswordLoginParams, 'action'>) {
    const res = await loginByPassword({ ...params, action: 'pwd' })
    handleLoginSuccess(res)
    return res
  }

  /** 验证码登录 */
  async function loginByVerificationCode(params: Omit<CodeLoginParams, 'action'>) {
    const res = await loginByCode({ ...params, action: 'code' })
    handleLoginSuccess(res)
    return res
  }

  /** 注册 */
  async function registerAccount(params: RegisterParams) {
    const res = await register(params)
    return res
  }

  /** 发送邮箱验证码 */
  async function sendCode(email: string) {
    const res = await sendEmailCode({ email })
    return res
  }

  /** 检查用户名是否可用 */
  async function checkUsernameAvailability(username: string) {
    const res = await checkUsername({ username })
    return res
  }

  /** 检查邮箱是否可用 */
  async function checkEmailAvailability(email: string) {
    const res = await checkEmail({ email })
    return res
  }

  /** 获取当前用户信息（从服务端刷新） */
  async function fetchProfile() {
    const res = await getProfile()
    if (res.data) {
      userInfo.value = res.data
      saveToStorage()
    }
    return res
  }

  /** 更新个人资料 */
  async function updateUserProfile(params: UpdateProfileParams) {
    const res = await updateProfile(params)
    if (res.data) {
      userInfo.value = res.data
      saveToStorage()
    }
    return res
  }

  /** 获取会员状态 */
  async function fetchMembership() {
    const res = await getMembership()
    return res
  }

  /** 修改密码 */
  async function changePassword(params: ChangePasswordParams) {
    const res = await changePasswordApi(params)
    // 修改密码后 token 失效，需要重新登录
    await logout()
    return res
  }

  /** 注销账号（软删除） */
  async function deleteAccount(params: DeleteAccountParams) {
    const res = await deleteAccountApi(params)
    // 注销后清除本地登录态
    token.value = ''
    userInfo.value = null
    expireTime.value = 0
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('expireTime')
    return res
  }

  /** 退出登录 */
  async function logout() {
    try {
      await logoutApi()
    } catch {
      // 即使接口失败也清除本地状态
    }
    token.value = ''
    userInfo.value = null
    expireTime.value = 0
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('expireTime')
  }

  /** Token 续签 */
  async function refreshTokenAction() {
    if (!token.value) return
    try {
      const res = await refreshTokenApi({ token: token.value })
      token.value = res.token
      expireTime.value = res.expireTime
      saveToStorage()
    } catch {
      // 续签失败，清除登录态
      await logout()
    }
  }

  // ── 初始化 ──
  loadFromStorage()

  return {
    // state
    token,
    userInfo,
    expireTime,
    // getters
    isLoggedIn,
    isVip,
    username,
    avatar,
    email,
    roles,
    // actions
    loginByPwd,
    loginByVerificationCode,
    registerAccount,
    sendCode,
    checkUsernameAvailability,
    checkEmailAvailability,
    fetchProfile,
    updateUserProfile,
    fetchMembership,
    changePassword,
    deleteAccount,
    logout,
    refreshTokenAction,
  }
})
