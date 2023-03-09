<template>
  <div v-if="histories.length > 0" ref="resueTab" class="reuse-tab">
    <div class="reuse-tab-con">
      <swiper :options="swiperOption" class="reuse-tab-wrap">
        <swiper-slide v-for="(item, index) in histories" :key="item.path">
          <router-link
            class="reuse-tab-item"
            :class="item.path === $route.path ? 'active' : ''"
            :to="item.path"
            @contextmenu.prevent.native="onTags(index, $event)"
          >
            <span>{{ stageList[item.stageId].title }}</span>
            <img v-show="stageList[item.stageId].title !== '首页'" class="icon-close" :src="icon_close" @click.prevent.stop="close(index)"/>
          </router-link>
        </swiper-slide>
      </swiper>
      <div class="right-con"></div>
    </div>

    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeAll">关闭所有</li>
      <li @click="closeOthers">关闭其他</li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css' // eslint-disable-line

  export default {
    name: 'reuse-tab',
    data() {
      return {
        icon_close: require('./icon_close.png'),
        histories: [],
        visible: false,
        top: 0,
        left: 0,
        index: 0,
        swiperOption: {
          slidesPerView: 'auto',
          initialSlide: 0,
          effect: 'slide',
          spaceBetween: 1,
          preventClicks: false,
          freeMode: true,
          mousewheel: {
            sensitivity: 1.5,
          },
        },
      }
    },
    created() {
      // // 关闭窗口时执行
      window.onbeforeunload = () => {
        // 缓存历史记录
        window.localStorage.setItem('history', JSON.stringify(this.histories))
      }
    },
    mounted() {
      this.init()
      this.eventBus.$on('clearTap', () => {
        this.histories = []
      })
    },
    methods: {
      init() {
        const histories = []

        // 获取当前的历史记录, 可能从本地存储, 可能直接获取当前的
        let localHistory
        if (this.histories.length > 0) {
          localHistory = [...this.histories]
        } else {
          localHistory = window.localStorage.getItem('history') || '[]'
          localHistory = JSON.parse(localHistory)
        }

        localHistory.forEach(item => {
          let findResult
          if (item.name) {
            findResult = this.getStageByName(item.name)
          } else {
            findResult = this.getStageByRoute(item.routePath)
          }
          if (!findResult) {
            return
          }
          histories.push({
            ...item,
            stageId: findResult.name,
          })
          this.histories = histories
        })
      },
      filterIcon(icon) {
        if (!icon) {
          return false
        }
        return icon.indexOf('/') !== -1
      },
      closeAll() {
        if (this.histories.length === 1 && this.histories[0].path === this.defaultRoute) {
          return
        }
        if (this.$route.path === this.defaultRoute) {
         this.closeOthers()
        } else {
          this.histories = []
          this.$router.push(this.defaultRoute)
        }
      },
      closeOthers() {
        this.$router.push(this.histories[this.index].path)
        const newHistories = this.histories[this.index]
        this.histories = []
        this.histories.push(newHistories)
      },
      onTags(index, event) {
        this.closeMenu()
        const menuMinWidth = 126
        const offsetLeft = this.$el.getBoundingClientRect().left
        const { offsetWidth } = this.$el
        const maxLeft = offsetWidth - menuMinWidth
        const left = event.clientX - offsetLeft + 15

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = 18
        this.index = index
        this.visible = true
      },
      closeMenu() {
        this.visible = false
      },
      close(index) {
        // 检测是否是当前页, 如果是当前页则自动切换路由
        if (this.$route.path === this.histories[index].path) {
          if (index > 0) {
            this.$router.push(this.histories[index - 1].path)
          } else if (this.histories.length > 1) {
            this.$router.push(this.histories[1].path)
          } else {
            this.$router.push(this.defaultRoute)
          }
        }
        // 删除该历史记录,如果历史记录里只有about，就return
        if (this.histories.length === 1 && this.histories[0].path === this.defaultRoute) {
          return
        }
        this.histories.splice(index, 1)
        this.histories = [...this.histories]
        window.localStorage.setItem('history', JSON.stringify(this.histories))
      },
    },
    computed: {
      logined() {
        return this.$store.state.logined
      },
      defaultRoute() {
        return this.$store.state.defaultRoute
      },
      ...mapGetters([
        'getStageByRoute',
        'getStageByName',
        'stageList'
      ])
    },
    watch: {
      $route(to) {
        // 对路由变化作出响应...
        const { histories } = this
        const flag = histories.find(item => item.path === to.path)
        if (flag) {
          return
        }
        const ele = {}
        ele.stageId = to.name
        ele.path = to.path
        ele.routePath = to.matched[to.matched.length - 1].path
        this.histories = [...histories, ele]
        window.localStorage.setItem('history', JSON.stringify(this.histories))
      },
      logined(val) {
        if (val) {
          return
        }
        this.closeAll()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      },
      // 舞台改变时触发
      stageList() {
        this.init()
      },
      histories(arr) {
        if (arr.length < 2) {
          this.eventBus.$emit('noReuse')
        } else {
          this.eventBus.$emit('hasReuse')
        }
      },
    },
    inject: ['eventBus'],
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style scoped lang="scss">
  .swiper-slide {
    width: auto;
    display: flex;
    height: 67px;
    flex-direction: column;
    justify-content: center;
    background-color: #FFFFFF;
    margin-right: 0 !important;
    box-sizing: content-box;
    a{
      padding: 0 25px;
      span{
        font-size: 20px;
        font-weight: 400;
        color: #4A5162;
      }
    }
  }

  .reuse-tab-wrap {
    bottom: 0;
    left: 0;
    user-select: none;
    height: 67px;
    font-size: 14px;
    color: #8c98ae;
    display: flex;
    align-items: center;
    overflow: hidden;

    .reuse-tab-item {
      width: auto;
      height: 67px;
      min-width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      white-space: nowrap;
      border-width: 4px 2px 2px 2px;
      border-color: #EBEBEB;
      border-top-color: transparent;
      border-style: solid;

      > i {
        color: #4A5162;
      }

      .icon-close {
        width: 20px;
        height: 20px;
        margin-left: 15px;
      }

      //&:hover {
      //  border-top-color: #3370FF;
      //  height: 67px;
      //  .el-icon-close {
      //    position: absolute;
      //    display: inline-block;
      //    width: 14px;
      //    height: 14px;
      //    top: 0;
      //    right: 0;
      //    opacity: 1;
      //    border-radius: 0 0 0 14px;
      //    background: rgba(51, 112, 255, 0.3);
      //
      //    &::before {
      //      font-size: 12px;
      //      position: absolute;
      //      right: -1px;
      //      transform: scale(0.7);
      //    }
      //  }
      //}
    }

    .active {
      border-top-color: #3370FF;
      border-bottom-color: transparent;
      height: 67px;
      position: relative;

      > i {
        color: #fff;
      }

      .el-icon-close {
        position: absolute;
        display: inline-block;
        width: 14px;
        height: 14px;
        top: 0;
        right: 0;
        opacity: 1;
        border-radius: 0 0 0 14px;
        background: rgba(51, 112, 255, 0.3);

        &::before {
          font-size: 12px;
          position: absolute;
          right: -1px;
          transform: scale(0.7);
        }
      }
    }

    .reuse-tab-wrap {
      height: 100%;
    }
  }
  .reuse-tab {
    position: relative;
    flex: 0 0 67px;
    .reuse-tab-con{
      display: flex;
    }
    .right-con{
      box-sizing: border-box;
      flex: 1;
      height: 67px;
      border-bottom: 2px solid #EBEBEB;
    }
    .contextmenu {
      margin: 0;
      background: #ffffff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #596c8e;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
      li {
        margin: 0;
        padding: 10px 20px;
        cursor: pointer;
        &:hover {
          background: #ebeff8;
          color: #6182c9;
        }
      }
    }
  }
</style>
