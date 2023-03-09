<template>
  <div class="app-sidebar">
    <el-menu
      class="el-menu-vertical-demo"
      ref="meun"
      :default-active="defaultActive"
    >
      <template v-for="item in sideBarList">
        <el-submenu
          class="subMenuContent"
          v-if="item.children"
          :key="idMap[item.name]"
          :index="idMap[item.name]"
          popper-class="abc">
          <template slot="title">
            <img  :src="filterIcon(item.icon)" class="imgIcon" alt="imgIcon"/>
            <span slot="title">{{item.title}}</span>
          </template>

          <!-- 二级菜单 -->
          <template v-for="(subItem) in item.children">
            <el-submenu v-if="subItem.children" :key="idMap[subItem.name]" :index="idMap[subItem.name]" class="subMenuContent">
              <template slot="title">
                <i class="iconfont icon-erjizhibiao"></i>
                <span slot="title" class="two-folder">{{subItem.title}}</span>
              </template>

              <!-- 三级菜单 -->
              <router-link
                v-for="(grandchildItem) in subItem.children"
                :key="idMap[grandchildItem.name]"
                :to="grandchildItem.path"
                class="circle third">
                <el-menu-item :index="idMap[grandchildItem.name]" style="padding-left: 80px;" class="subMenuContent">
                  {{grandchildItem.title}}
                </el-menu-item>
              </router-link>
            </el-submenu>
            <!-- 二级else -->
            <router-link
              :to="subItem.path"
              :key="subItem.name"
              class="circle"
              v-else>
              <el-menu-item :index="idMap[subItem.name]" style="padding-left: 85px;" class="subMenuContent">
                {{subItem.title}}
              </el-menu-item>
            </router-link>

          </template>
        </el-submenu>

        <!-- 一级else -->
        <el-menu-item
          class="subMenuContent firstMenu"
          :index="idMap[item.name]"
          @click="goto(item.path)"
          v-else
          :key="idMap[item.name]">
          <img :src="filterIcon(item.icon)" class="imgIcon" alt="imgIcon"/>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import Utils from '@/core/utils/util'
  import { mapGetters } from 'vuex'

  export default {
    name: 'side-bar',
    methods: {
      goto (path) {
        this.$router.push({
          path
        })
      },
      // 路由标记位
      indexToString (num) {
        this.itemIndex = num
        return num.toString()
      },
      filterIcon(icon) {
        return require(`./${icon}.png`)
      }
    },
    computed: {
      // 根据当前路由设置激活侧边栏
      defaultActive() {
        for (let i = (this.stageInfo.length - 1); i >= 0; i -= 1) {
          if (this.idMap[this.stageInfo[i].name]) {
            return this.idMap[this.stageInfo[i].name]
          }
        }
        return ''
      },
      stageInfo() {
        return this.getStageInfo(this.$route.name)
      },
      // 由于index不支持symbol格式, 因此使用 idMap 进行映射
      idMap() {
        const { sideBarList } = this
        const mapData = {}
        const deepTravel = (obj, fuc) => {
          if (Array.isArray(obj)) {
            obj.forEach(item => {
              deepTravel(item, fuc)
            })
            return
          }
          if (obj && obj.children) {
            fuc(obj)
            deepTravel(obj.children, fuc)
            return
          }
          if (obj.name) {
            fuc(obj)
          }
        }
        deepTravel(sideBarList, item => {
          mapData[item.name] = Utils.getRandomStr()
        })
        return mapData
      },
      ...mapGetters([
        'sideBarList',
        'getStageInfo'
      ])
    }
  }
</script>

<style scoped lang="scss">
  .el-menu{
    border-right: none;
  }
  ::v-deep(.is-opened .el-submenu__title) {
    background-color: #DFEBFC;
    span{
      color:#4186FB;
    }
  }
  .el-submenu{
    color:#666666;
    font-weight: bold;
    background-color: #F6F6F6;
    border-bottom: 3px solid #ffffff;
  }
  .el-menu-item{
    display: flex;
    font-size: 18px;
    font-weight: 400;
    color: #4A5162;
  }
  .el-menu-item.is-active.firstMenu{
    color:#4186FB;
    padding-left: 12px !important;
  }
  .el-menu-item.is-active{
    color:#4186FB;
  }
  .imgIcon{
    width: 30px;
    height: 30px;
  }
  span{
    font-size: 18px;
    color: #4A5162;
    margin-left: 17px;
    font-weight: 500;
  }
</style>
