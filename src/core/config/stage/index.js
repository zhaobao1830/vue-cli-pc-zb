import Utils from '@/core/utils/util'
import systemManagementConfig from './systemManagement'

let homeRouter = [
  {
    title: '首页',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'views/about/about.vue',
    inNav: true,
    icon: 'icon_home',
    order: 0
  },
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'views/center/center.vue',
    inNav: false,
    icon: 'icon_home',
  },
  systemManagementConfig
]

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = target => {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      // eslint-disable-next-line no-param-reassign
      target.name = target.name || Utils.getRandomStr()
      // eslint-disable-next-line no-param-reassign
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}

deepReduceName(homeRouter)

export default homeRouter
