import axios from 'axios'
import Config from '@/core/config'
import storage from 'good-storage'
import store from '@/store'
import { AUTH_TOKEN } from 'core/config/constant'

const config = {
  baseURL: Config.baseUrl,
  timeout: 5 * 10000, // 请求超时时间设置
  // 跨域时允许携带凭证
  widthCredentials: true
}

// 创建请求实例
const _axios = axios.create(config)
_axios.defaults.headers.post['Content-Type'] = 'multipart/form-data; charset=UTF-8'

// 对axios的request配置
_axios.interceptors.request.use(async config => {
  const authToken = storage.get(AUTH_TOKEN, '')
  if (config.url !== 'login') {
    config.headers.authToken = authToken
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 对axios的response配置
_axios.interceptors.response.use(response => {
  const res = response.data
  if (res.code === 501) {
    setTimeout(() => {
      store.dispatch('loginOut')
      window.location.href = Config.loginUrl
    }, 3000)
    return Promise.reject(response)
  } else {
    return Promise.resolve(res)
  }
})

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post (url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get (url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put (url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete (url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params
  })
}

/**
 * 参数二次加工，生成formData格式
 * @param url
 * @param data
 * @returns {AxiosPromise}
 */
export function formDataPost(url, data) {
  const formData = new FormData()
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const ele = data[key]
      formData.append(key, ele)
    }
  }
  return post(url, formData)
}

export default _axios
