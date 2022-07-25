import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {

  }
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setuserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state, payload) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state, payload) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    try {
      const res = await login(data)
      console.log(res)

      context.commit('setToken', res)
      setToken(res)
      setTime(Date.now())
    } catch (err) {
      return Promise.reject(new Error('登录失败，请重试'))
    }
  },
  async getInfo (context, data) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    // console.log(res)
    // console.log(res1)
    context.commit('setuserInfo', { ...res, ...res1 })
  },
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

