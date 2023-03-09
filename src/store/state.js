import AppConfig from '@/core/config/index'
import stageConfig from '@/core/config/stage' // 引入舞台配置

const state = {
  logined: false, // 是否登录
  user: {}, // 当前用户
  sideBarLevel: AppConfig.sideBarLevel || 3,
  defaultRoute: AppConfig.defaultRoute || '/about',
  // 推送消息
  readedMessages: [],
  unreadMessages: [],

  permissions: [], // 每个用户的所有权限
  // 舞台配置
  stageConfig,

  // 当前页信息
  currentRoute: {
    config: null,
    treePath: [],
  }
}

export default state
