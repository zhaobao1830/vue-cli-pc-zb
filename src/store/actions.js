import * as types from './mutation-types'

export const loginOut = function ({ commit }) {
  commit(types.REMOVE_LOGINED, false)
}

// 登录以后给logined赋值
export const setLogined = function ({ commit }, user) {
  // 如果登陆成功，设置logined标志位
  commit(types.SET_LOGINED, true)
}

// 登录以后给user赋值
export const setUser = function ({ commit }, user) {
  // 设置全局用户状态
  commit(types.SET_USER, user)
}
