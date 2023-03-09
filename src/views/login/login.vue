<template>
  <div class="login">
    <div class="title-logo">
      <div class="title">欢迎使用IM管理系统</div>
      <img class="logo-img" src="./logo.png">
    </div>
    <div
      class="login-form"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <div class="login-form-con">
        <div class="title">用户登录</div>
        <div class="login-tip">欢迎登陆IM管理系统</div>
        <form
          class="form-login"
          ref="loginForm"
          autocomplete="off"
          @submit.prevent="throttleLogin()"
        >
          <div class="form-item nickname">
            <span class="icon icon-landpage_icon_userID"></span>
            <input type="text" v-model="form.username" autocomplete="off" placeholder="用户名" />
          </div>
          <div class="form-item password">
            <span class="icon icon-landpage_icon_password"></span>
            <input type="password" v-model="form.password" autocomplete="off" placeholder="密码" />
          </div>
          <div class="rememberPassword">
            <label>
              <el-checkbox v-model="rememberPasswordChecked"></el-checkbox>
              <span>记住密码</span>
            </label>
          </div>
          <button class="submit-btn" type="submit">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '@/core/utils/util'
  import storage from 'good-storage'
  import { USER_NAME_PASSWORD, AUTH_TOKEN } from 'core/config/constant'
  import AppConfig from '@/core/config/index'
  import { mapActions, mapMutations } from 'vuex'
  import LoginModel from '@/core/model/login'

  export default {
    name: 'login',
    data () {
      return {
        loading: false, // 加载动画
        wait: 2000, // 2000ms之内不能重复发起请求
        throttleLogin: null, // 节流登录
        form: { // admin 111111
          username: '',
          password: ''
        },
        rememberPasswordChecked: false // 记住密码
      }
    },
    created() {
      // 节流登录
      this.throttleLogin = Utils.throttle(this.login, this.wait)

      const username_password_encrypt = storage.get(USER_NAME_PASSWORD)
      if (username_password_encrypt) {
        const username_password_object = JSON.parse(Utils.decryption(username_password_encrypt))
        this.form.username = username_password_object.username
        this.form.password = username_password_object.password
        this.rememberPasswordChecked = true
      } else {
        this.form.username = ''
        this.form.password = ''
        this.rememberPasswordChecked = false
      }
    },
    methods: {
      async login() {
        const {
          username,
          password
        } = this.form
        if (username === '') {
          this.$message.warning('用户名不能为空')
          return
        }
        if (password === '') {
          this.$message.warning('密码不能为空')
          return
        }
        if (this.rememberPasswordChecked) {
          const username_password = JSON.stringify({
            username: this.form.username,
            password: this.form.password
          })
          const username_password_encrypt = Utils.encryption(username_password)
          storage.set(USER_NAME_PASSWORD, username_password_encrypt)
        } else {
          storage.set(USER_NAME_PASSWORD, '')
        }
        this.loading = true
        const res = await LoginModel.login({
          username,
          password
        })
        if (res.code === 0) {
          this.$message.success('登录成功')
          storage.set(AUTH_TOKEN, res.data)
          await this.getPersonalDetail()
          this.setLogined()
          // reuse-tab默认展示首页
          const defaultHistory = [
            {
              path: '/about',
              routePath: '/about'
            }
          ]
          window.localStorage.setItem('history', JSON.stringify(defaultHistory))
          this.$router.push(AppConfig.defaultRoute)
        } else {
          storage.set(AUTH_TOKEN, '')
          this.$message.error(res.msg)
        }
        this.loading = false
      },
      // 获取登录用户的详细信息
      async getPersonalDetail () {
        const res = await LoginModel.personalDetail()
        let userObject = {}
        if (res.code === 0) {
          const permissions = res.permissions
          userObject = res.user
          userObject.picUrl = res.picUrl
          this.setUser(userObject)
          this.setUserPermissions(permissions)
        } else {
          this.userObject = {}
          this.$message.error(res.msg)
          this.setUserPermissions([])
          this.setUser({})
        }
      },
      ...mapMutations({
        setUser: 'SET_USER',
        setUserPermissions: 'SET_USER_PERMISSIONS'
      }),
      ...mapActions([
        'setLogined'
      ])
    }
  }
</script>

<style scoped lang="scss">
  .login{
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #76B9FF 0%, #3760C9 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-logo{
      display: flex;
      flex-direction: column;
      margin-left: 200px;
      .title{
        font-size: 34px;
        font-weight: 500;
        color: #FFFFFF;
      }
      .logo-img{
        width: 630px;
        height: 530px;
        margin-top: 47px;
      }
    }
    .login-form{
      width: 464px;
      height: 649px;
      background: #FFFFFF;
      box-shadow: 0px 0px 4px 4px rgba(51, 112, 255, 0.07);
      border-radius: 25px;
      margin-right: 200px;
      .login-form-con{
        margin: 87px 50px 170px 50px;
        display: flex;
        flex-direction: column;
        .title{
          height: 48px;
          font-size: 34px;
          font-weight: 500;
          color: #333333;
          line-height: 48px;
          display: flex;
          justify-content: left;
        }
        .login-tip{
          margin-top: 15px;
          margin-bottom: 45px;
          height: 25px;
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 25px;
          display: flex;
          justify-content: left;
        }
        .form-login {
          width: 100%;
          .form-item {
            padding: 0 13px;
            box-sizing: border-box;
            width: 100%;
            height: 48px;
            box-sizing: border-box;
            margin-bottom: 28px;
            background: #F6F6F6;
            border-radius: 4px;
            display: flex;
            align-items: center;
            .icon{
              font-size: 30px;
            }
            input {
              margin-left: 10px;
              width: 100%;
              height: 48px;
              background: transparent;
              color: #333333;
              font-size: 18px;
              box-sizing: border-box;
            }
          }
          .rememberPassword {
            label{
              display: flex;
              align-items: center;
              cursor: pointer;
              span{
                font-size: 18px;
                font-weight: 400;
                color: #999999;
                margin-left: 12px;
              }
            }
          }
          .submit-btn {
            cursor: pointer;
            margin-top: 32px;
            width: 332px;
            height: 48px;
            background: #3370FF;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            font-size: 18px;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
      }
    }
  }
</style>
