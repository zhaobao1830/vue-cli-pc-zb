<template>
  <el-dialog
    title="编辑角色"
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
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="form.roleName" maxlength="100" placeholder="请输入角色名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" maxlength="100" placeholder="请输入备注" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuTreeList"
            show-checkbox
            :check-strictly="checkStrictly"
            node-key="id"
            :default-expanded-keys="['-1']"
            :props="defaultProps"
            ref="menuTree"
          >
          </el-tree>
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
  import RoleModel from 'core/model/systemManagement/role'

  export default {
    name: 'roleEdit',
    props: {
      editDialogFormVisible: { // 控制弹出层显示/隐藏
        type: Boolean,
        default: false
      },
      menuTreeList: { // 权限树列表
        type: Array,
        default() {
          return []
        }
      },
      currentEditRoleId: { // 当前编辑的角色id
        type: String,
        default: ''
      }
    },
    data() {
      return {
        checkStrictly: true,
        form: {
          roleName: '', // 角色名
          remark: '', // 备注
          menuIds: [] // 菜单权限
        },
        rules: {
          roleName: { required: true, message: '请输入角色名', trigger: 'blur' }
        },
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        roleObject: {}
      }
    },
    methods: {
      // 获取角色信息
      async getEditRoleInfo() {
        const res = await RoleModel.editRoleInfo(this.currentEditRoleId)
        if (res.code === 0) {
          this.roleObject = res.role
          this.parameterAssignment(this.roleObject)
        } else {
          this.$message.error(res.msg)
          this.form.roleName = ''
          this.form.remark = ''
          const menuIds = []
          this.$refs.menuTree.setCheckedKeys(menuIds)
        }
      },
      handleClose(flag) {
        this.$emit('closeEditDialogFormVisible', flag)
        this.form.roleName = ''
        this.form.remark = ''
        this.$refs.menuTree.setCheckedKeys([])
      },
      submitForm(formName) {
        // 菜单权限列表
        const menuIdsList = this.$refs.menuTree.getCheckedKeys()
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await RoleModel.roleUpdate({
              roleId: this.currentEditRoleId,
              menuIds: menuIdsList.length > 0 ? menuIdsList.join(',') : '',
              roleName: this.form.roleName,
              remark: this.form.remark
            })
            if (res.code === 0) {
              this.$message.success('修改角色成功')
              this.handleClose(true)
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      },
      resetForm(formName) {
        this.parameterAssignment(this.roleObject)
      },
      // 参数赋值
      parameterAssignment(object) {
        this.form.roleName = object.roleName
        this.form.remark = object.remark
        const menuIds = object.menuIds
        this.$refs.menuTree.setCheckedKeys(menuIds)
      }
    },
    watch: {
      editDialogFormVisible: {
        handler(newVal, oldVal) {
          if (newVal === true) {
            this.getEditRoleInfo()
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
