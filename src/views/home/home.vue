<template>
  <div style="height: 100%;">
    <el-container class="el-container">
      <el-header class="header">
        <div class="header-content">
          <div class="left">
            <span class="title">PC开源项目</span>
          </div>
          <div class="right">
            <user></user>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside class="aside">
          <side-bar/>
        </el-aside>
        <div class="right-main">
          <el-main class="el-main">
            <ylvisible-main/>
          </el-main>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import { SideBar, YlvisibleMain, User } from '@/components/layout'
  import { mapActions } from 'vuex'

  export default {
    name: 'home',
    data () {
      return {
        picUrl: ''
      }
    },
    methods: {
      outLogin () {
        this.loginOut()
        window.location.reload()
      },
      ...mapActions([
        'loginOut'
      ])
    },
    components: {
      SideBar,
      YlvisibleMain,
      User
    }
  }
</script>

<style scoped lang="scss">

</style>
