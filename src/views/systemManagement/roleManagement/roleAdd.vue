<template>
  <el-dialog
    title="添加角色"
    append-to-body
    :close-on-click-modal="false"
    :before-close="handleClose"
    :visible.sync="myAddDialogFormVisible"
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
    name: 'roleAdd',
    props: {
      addDialogFormVisible: { // 控制弹出层显示/隐藏
        type: Boolean,
        default: false
      },
      menuTreeList: { // 权限树列表
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        checkStrictly: true,
        form: {
          roleName: '', // 角色名
          remark: '', // 备注
          menuIds: '' // 菜单权限
        },
        rules: {
          roleName: { required: true, message: '请输入角色名', trigger: 'blur' }
        },
        defaultProps: {
          children: 'children',
          label: 'text'
        }
      }
    },
    methods: {
      handleClose(flag) {
        this.$refs.menuTree.setCheckedKeys([])
        this.$emit('closeAddDialogFormVisible', flag)
      },
      submitForm(formName) {
        // 菜单权限列表
        const menuIdsList = this.$refs.menuTree.getCheckedKeys()
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await RoleModel.roleSave({
              menuIds: menuIdsList.length > 0 ? menuIdsList.join(',') : '',
              roleName: this.form.roleName,
              remark: this.form.remark
            })
            if (res.code === 0) {
              this.$message.success('添加角色成功')
              this.handleClose(true)
              this.resetForm(formName)
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      },
      resetForm(formName) {
        this.form.menuIdsList = []
        this.$refs.menuTree.setCheckedKeys([])
        this.$refs[formName].resetFields()
      }
    },
    computed: {
      myAddDialogFormVisible() {
        return this.addDialogFormVisible
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
