<template>
  <el-dialog
    title="添加部门"
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
        <el-form-item label="上级部门" prop="parentName">
          <el-input :value="parentName" placeholder="请输入上级部门" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" maxlength="50" placeholder="请输入部门名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序" autocomplete="off"></el-input>
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
  import DepartmentModel from 'core/model/systemManagement/department'

  export default {
    name: 'departmentAdd',
    props: {
      addDialogFormVisible: { // 控制弹出层显示/隐藏
        type: Boolean,
        default: false
      },
      parentId: { // 上级部门id
        type: Number,
        default: 0
      },
      parentName: { // 上级部门名称
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {
          name: '', // 部门名称
          orderNum: '' // 排序
        },
        rules: {
          name: { required: true, message: '请输入部门名称', trigger: 'blur' }
        }
      }
    },
    methods: {
      handleClose(flag) {
        this.$emit('closeAddDialogFormVisible', flag)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await DepartmentModel.sysDeptSave({
              parentId: this.parentId,
              name: this.form.name,
              orderNum: this.form.orderNum
            })
            if (res.code === 0) {
              this.$message.success('添加部门成功')
              this.handleClose(true)
              this.resetForm(formName)
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
      myAddDialogFormVisible() {
        return this.addDialogFormVisible
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
