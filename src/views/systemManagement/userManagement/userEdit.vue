<template>
  <el-dialog
    title="编辑用户"
    append-to-body
    :close-on-click-modal="false"
    :before-close="handleClose"
    :visible.sync="myEditDialogFormVisible"
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
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" maxlength="100" placeholder="请输入姓名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" maxlength="50" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" maxlength="50" placeholder="请输入密码" @keyup.native="btKeyUp" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-select v-model="form.deptName" placeholder="请选择部门" ref="deptSelect">
            <el-option v-model="form.deptId" style="height: auto">
              <el-tree
                default-expand-all
                :expand-on-click-node="false"
                :data="departmentTreeList"
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="form.email" placeholder="请输入email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="(item, index) in form.statusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色权限" prop="roleIds">
          <el-checkbox-group
            class="add-edit-checkbox"
            v-model="form.roleIdsList"
          >
            <el-checkbox
              v-for="item in form.roleList"
              :label="item.roleId"
              :key="item.roleId"
            >{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
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

  const validateEmail = (rule, value, callback) => {
    if (value === '') {
      callback()
    } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  }
  const validateUsername = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入用户名'))
    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error('用户名不能输入中文'))
    } else {
      callback()
    }
  }
  const validatePassword = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码至少六位'))
    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error('密码不能输入中文'))
    } else {
      callback()
    }
  }

  export default {
    name: 'userEdit',
    props: {
      editDialogFormVisible: { // 控制弹出层显示/隐藏
        type: Boolean,
        default: false
      },
      departmentTreeList: { // 部门树列表
        type: Array,
        default() {
          return []
        }
      },
      currentOperatingUserId: { // 当前操作的用户Id
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {
          realName: '', // 姓名
          username: '', // 用户名
          password: '', // 密码
          authNo: '', // 授权码
          deptId: '', // 部门Id
          deptName: '', // 部门名称
          email: '',
          status: '1', // 状态
          statusList: [
            {
              label: '正常',
              value: '1'
            },
            {
              label: '禁用',
              value: '0'
            }
          ],
          roleIds: '', // 角色id字符串
          roleList: [], // 角色列表
          roleIdsList: [] // el-checkbox-grounp绑定的值必须是数组
        },
        rules: {
          username: { validator: validateUsername, required: true, trigger: 'blur' },
          password: { validator: validatePassword, required: true, trigger: 'blur' },
          email: { validator: validateEmail },
          status: { required: true, message: '请选择状态', trigger: 'change' }
        },
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        treeShow: false,
        userObject: {}, // 用户信息
        userRoles: [] // 用户权限
      }
    },
    methods: {
      // 获取用户信息
      async getEditUserInfo() {
        const res = await UserModel.editUserInfo(this.currentOperatingUserId)
        if (res.code === 0) {
          // 给其他字段赋值
          this.userObject = res.user
          this.userRoles = res.roles
          this.parameterAssignment(this.userObject, this.userRoles)
        } else {
          this.$message.error(res.msg)
          this.form.roleList = []
          this.form.roleIdsList = []
        }
      },
      handleClose(flag) {
        this.$refs.form.resetFields()
        this.$emit('closeEditDialogFormVisible', flag)
      },
      handleNodeClick(data) {
        this.form.deptId = data.id
        this.form.deptName = data.text
        this.$refs.deptSelect.blur()
      },
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await UserModel.userUpdate({
              id: this.userObject.id,
              realName: this.form.realName,
              username: this.form.username,
              password: this.form.password,
              deptId: this.form.deptId,
              deptName: this.form.deptName,
              email: this.form.email,
              status: this.form.status,
              roleIds: this.form.roleIdsList.join(',')
            })
            if (res.code === 0) {
              this.$message.success('修改用户成功')
              this.handleClose(true)
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      },
      resetForm() {
        this.parameterAssignment(this.userObject, this.userRoles)
      },
      // 参数赋值
      parameterAssignment(object, roles) {
        this.form.realName = object.realName
        this.form.username = object.username
        this.form.deptId = object.deptId === null ? '' : object.deptId
        this.form.deptName = object.deptName
        this.form.email = object.email === null ? '' : object.email
        this.form.status = object.status === null ? '1' : object.status.toString()

        // 获取角色权限内容
        const rolesList = roles
        this.form.roleList = []
        this.form.roleIdsList = []
        if (rolesList.length > 0) {
          for (let i = 0; i < rolesList.length; i++) {
            this.form.roleList.push({
              roleId: rolesList[i].roleId,
              roleName: rolesList[i].roleName
            })
            if (rolesList[i].roleSign === 'true') {
              this.form.roleIdsList.push(rolesList[i].roleId)
            }
          }
        }
      },
      btKeyUp(e) {
        this.form.password = e.target.value.replace(/[\u4e00-\u9fa5]|(^\s+)|(\s+$)/ig, '')
      }
    },
    watch: {
      editDialogFormVisible: {
        handler(newVal, oldVal) {
          if (newVal === true) {
            this.getEditUserInfo()
          }
        },
        immediate: true
      }
    },
    computed: {
      myEditDialogFormVisible() {
        return this.editDialogFormVisible
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
