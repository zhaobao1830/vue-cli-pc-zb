import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from '@/core/filters'
import ElementUI from 'element-ui'

import '@/assets/styles/index.scss'
import '@/assets/styles/realize/element-variable.scss'

Vue.config.productionTip = false

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
