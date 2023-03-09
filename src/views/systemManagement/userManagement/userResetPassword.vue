<template>
  <el-dialog
    title="修改用户密码"
    append-to-body
    :close-on-click-modal="false"
    :before-close="handleClose"
    :visible.sync="myResetPwdDialogFormVisible"
  >
    <div style="margin-top:-25px;">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        label-position="right"
        ref="form"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="新密码" prop="pwdNew">
          <el-input v-model="form.pwdNew" type="password" placeholder="请输入新密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitForm('form')">保 存</el-button>
          <el-button @click="resetForm('form')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import UserModel from 'core/model/systemManagement/user'

  const validatePwdNew = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码长度不能少于6位数'))
    } else {
      callback()
    }
  }

  export default {
    name: 'userResetPassword',
    props: {
      resetPwdDialogFormVisible: { // 控制弹出层显示/隐藏
        type: Boolean,
        default: true
      },
      currentOperatingUserId: { // 当前操作的用户id
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {
          pwdNew: '' // 新密码
        },
        rules: {
          pwdNew: { validator: validatePwdNew, required: true, trigger: 'blur' }
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeResetPwdDialogFormVisible')
      },
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await UserModel.userResetPwd({
              id: this.currentOperatingUserId,
              pwdNew: this.form.pwdNew
            })
            if (res.code === 0) {
              this.$message.success('修改密码成功')
              this.handleClose()
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    computed: {
      myResetPwdDialogFormVisible() {
        return this.resetPwdDialogFormVisible
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
