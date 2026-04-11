import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 不需要携带 token 的公开接口路径
const publicPaths = [
  '/v2/user/login',
  '/v2/user/register',
  '/v2/user/sendEmailCode',
  '/v2/user/checkUsername',
  '/v2/user/checkEmail',
  '/v2/user/refreshToken',
  '/v2/user/requestPasswordReset',
  '/v2/user/verifyResetToken',
  '/v2/user/resetPassword',
]

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    const isPublic = publicPaths.some(path => config.url?.includes(path))
    if (token && !isPublic && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 后端返回 { code, msg, data?, token?, expireTime? }
    if (res.code === 200) {
      return res
    }

    // 业务错误
    const errorMsg = res.msg || '请求失败'

    // 401：区分公开接口业务错误 vs 认证过期
    if (res.code === 401) {
      const isPublic = publicPaths.some(path => response.config.url?.includes(path))
      if (isPublic) {
        // 登录/注册等接口的 401 是业务错误（如账号密码错误），只提示
        message.error(errorMsg)
      } else {
        // 需要认证的接口 401 才是 token 过期，清除登录态并刷新
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('expireTime')
        message.error('登录已过期，请重新登录')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
      return Promise.reject(new Error(errorMsg))
    }

    // 403：封禁
    if (res.code === 403) {
      message.error('账号已被禁用')
      return Promise.reject(new Error(errorMsg))
    }

    // 其他业务错误
    message.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  },
  (error) => {
    console.error('Response error:', error)

    if (error.response) {
      const { status, data } = error.response
      const errorMsg = data?.msg || data?.message || ''

      switch (status) {
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          message.error('未授权，请重新登录')
          setTimeout(() => {
            window.location.reload()
          }, 1500)
          break
        case 403:
          message.error(errorMsg || '拒绝访问')
          break
        case 404:
          message.error('请求地址出错')
          break
        case 409:
          message.error(errorMsg || '资源冲突')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(errorMsg || '请求失败')
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default service
