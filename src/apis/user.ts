import request from '@/utils/request'

// ── 类型定义 ──

/** 角色信息 */
export interface RoleInfo {
  name: string
  iden: string
  description: string
}

/** 会员信息 */
export interface PremiumInfo {
  id: number
  user_id: number
  expiration_time: string
  is_active: boolean
  remark: string
}

/** 用户信息（V2 客户端版） */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  avatar: string
  gender: number
  signature: string
  phone: string
  status: boolean
  last_login: string
  register_source: string
  roles: RoleInfo[]
  premium: PremiumInfo | null
}

/** 登录响应 */
export interface LoginResponse {
  code: number
  msg: string
  token: string
  expireTime: number
  data: UserInfo
}

/** 通用响应 */
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

/** 注册响应 data */
export interface RegisterData {
  id: number
  username: string
  email: string
  roles: RoleInfo[]
}

/** 检查可用性响应 */
export interface CheckAvailabilityData {
  username?: string
  email?: string
  available: boolean
}

/** 会员状态 */
export interface MembershipData {
  is_premium: boolean
  premium_id?: number
  expiration_time: string | null
  is_active: boolean
  days_remaining?: number
  remark?: string
}

// ── 请求参数 ──

/** 密码登录参数 */
export interface PasswordLoginParams {
  account: string
  password: string
  action: 'pwd'
}

/** 验证码登录参数 */
export interface CodeLoginParams {
  account: string
  password: string
  action: 'code'
  invite_code?: string
}

/** 注册参数 */
export interface RegisterParams {
  username: string
  password: string
  email: string
  nickname?: string
  gender?: number
}

/** 发送验证码参数 */
export interface SendEmailCodeParams {
  email: string
}

/** 检查用户名参数 */
export interface CheckUsernameParams {
  username: string
}

/** 检查邮箱参数 */
export interface CheckEmailParams {
  email: string
}

/** Token 续签参数 */
export interface RefreshTokenParams {
  token: string
}

/** 更新个人资料参数 */
export interface UpdateProfileParams {
  nickname?: string
  gender?: number
  signature?: string
  avatar?: string
}

/** 修改密码参数 */
export interface ChangePasswordParams {
  old_password: string
  new_password: string
}

/** 注销账号参数 */
export interface DeleteAccountParams {
  password: string
  confirmation: string
}

/** 请求密码重置参数 */
export interface RequestPasswordResetParams {
  email: string
}

/** 校验重置令牌参数 */
export interface VerifyResetTokenParams {
  token: string
}

/** 重置密码参数 */
export interface ResetPasswordParams {
  token: string
  new_password: string
}

// ── 接口方法 ──

/** 密码登录 */
export function loginByPassword(data: PasswordLoginParams) {
  return request.post<any, LoginResponse>('/v2/user/login', data)
}

/** 验证码登录（自动注册） */
export function loginByCode(data: CodeLoginParams) {
  return request.post<any, LoginResponse>('/v2/user/login', data)
}

/** 用户名注册 */
export function register(data: RegisterParams) {
  return request.post<any, ApiResponse<RegisterData>>('/v2/user/register', data)
}

/** 发送邮箱验证码 */
export function sendEmailCode(data: SendEmailCodeParams) {
  return request.post<any, ApiResponse>('/v2/user/sendEmailCode', data)
}

/** 检查用户名是否可用 */
export function checkUsername(data: CheckUsernameParams) {
  return request.post<any, ApiResponse<CheckAvailabilityData>>('/v2/user/checkUsername', data)
}

/** 检查邮箱是否可用 */
export function checkEmail(data: CheckEmailParams) {
  return request.post<any, ApiResponse<CheckAvailabilityData>>('/v2/user/checkEmail', data)
}

/** Token 续签 */
export function refreshToken(data: RefreshTokenParams) {
  return request.post<any, LoginResponse>('/v2/user/refreshToken', data)
}

/** 获取当前用户信息 */
export function getProfile() {
  return request.post<any, ApiResponse<UserInfo>>('/v2/user/profile')
}

/** 更新个人资料 */
export function updateProfile(data: UpdateProfileParams) {
  return request.post<any, ApiResponse<UserInfo>>('/v2/user/update', data)
}

/** 修改密码 */
export function changePassword(data: ChangePasswordParams) {
  return request.post<any, ApiResponse>('/v2/user/changePassword', data)
}

/** 获取会员状态 */
export function getMembership() {
  return request.post<any, ApiResponse<MembershipData>>('/v2/user/membership')
}

/** 注销账号（软删除） */
export function deleteAccount(data: DeleteAccountParams) {
  return request.post<any, ApiResponse>('/v2/user/delete', data)
}

/** 退出登录 */
export function logout() {
  return request.post<any, ApiResponse>('/v2/user/logout')
}

/** 请求密码重置邮件 */
export function requestPasswordReset(data: RequestPasswordResetParams) {
  return request.post<any, ApiResponse>('/v2/user/requestPasswordReset', data)
}

/** 校验重置令牌 */
export function verifyResetToken(data: VerifyResetTokenParams) {
  return request.post<any, ApiResponse>('/v2/user/verifyResetToken', data)
}

/** 重置密码 */
export function resetPassword(data: ResetPasswordParams) {
  return request.post<any, ApiResponse>('/v2/user/resetPassword', data)
}
