import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime() //
    // 7200000 || 2 * 60 * 60 * 1000 相当于2个小时
    if (time > 2 * 60 * 60 * 1000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, function (error) {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加拦截响应器
request.interceptors.response.use(function (response) {
  const { data, success, message } = response.data
  if (success) {
    Message.success(message)
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 对应响应做点什么
  return Promise.reject(error)
}
)

export default request
