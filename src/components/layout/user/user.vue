<template>
  <div class="user">
    <el-dropdown>
      <div class="el-dropdown-link">
        <i class="el-icon-user"></i>
        <div class="username">{{user.docName}}</div>
        <i class="right-icon el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-box">
        <div class="user-info">
          <div class="editInformation" @click="goToCenter">
            <span>编辑资料</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div
            class="signOut"
            @click="outLogin"
          >
            <span>退出登录</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'user',
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      goToCenter() {
        this.$router.push('/center')
      },
      outLogin() {
        window.location.reload(true)
        this.loginOut()
        window.localStorage.setItem('history', JSON.stringify([]))
      },
      ...mapActions([
        'loginOut'
      ])
    }
  }
</script>

<style scoped lang="scss">
  .user {
    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-icon-user{
        color:#ffffff;
        font-size:26px;
        margin-right: 10px;
      }
      .username{
        font-size: 20px;
        color: #FFFFFF;
        margin-right: 103px;
      }
      .right-icon{
        color: #FFFFFF;
      }
    }
  }
  .user-box {
    width: 250px;
    margin-bottom: 0;
    padding-bottom: 0;
    border: none;
    .user-info {
      display: flex;
      flex-direction: column;
      margin: 5px 20px;
      .editInformation, .signOut{
        height: 40px;
        font-size: 16px;
        color: #666666;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        &:hover{
          span{
            color: #EC6E3C;
          }
        }
      }
    }
  }
</style>
