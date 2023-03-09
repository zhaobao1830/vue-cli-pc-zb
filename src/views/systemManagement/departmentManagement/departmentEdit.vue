<template>
  <el-dialog
    title="编辑部门"
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
        <el-form-item label="上级部门" prop="parentName">
          <el-input v-model="form.parentName" placeholder="请输入上级部门" :disabled="true" autocomplete="off"></el-input>
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
    name: 'departmentEdit',
    props: {
      editDialogFormVisible: { // 控制弹出层显示/隐藏
        type: Boolean,
        default: false
      },
      currentDepartObject: { // 当前被编辑的部门信息
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        form: {
          parentId: '', // 上级部门id
          deptId: '', // 部门id
          parentName: '', // 上级部门名称
          name: '', // 部门名称
          orderNum: '' // 排序
        },
        rules: {
          name: { required: true, message: '请输入部门名称', trigger: 'blur' }
        }
      }
    },
    methods: {
      // 根据部门ID查询上级部门名称
      async getSysDeptParentNameBydeptId() {
        const res = await DepartmentModel.sysDeptParentNameByDeptId(this.currentDepartObject.deptId)
        if (res.code === 0) {
          this.form.parentName = res.parentDeptName === '无' ? '总部门' : res.parentDeptName
        }
      },
      handleClose(flag) {
        this.$emit('closeEditDialogFormVisible', flag)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const res = await DepartmentModel.sysDeptUpdate({
              deptId: this.form.deptId,
              parentId: this.form.parentId,
              name: this.form.name,
              orderNum: this.form.orderNum
            })
            if (res.code === 0) {
              this.$message.success('修改部门成功')
              this.handleClose(true)
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      },
      resetForm(formName) {
        this.parameterAssignment(this.currentDepartObject)
      },
      // 参数赋值
      parameterAssignment(object) {
        this.form.parentId = object.parentId // 上级部门id
        this.form.deptId = object.deptId // 部门id
        this.form.name = object.name // 部门名称
        this.form.orderNum = object.orderNum // 排序
      }
    },
    watch: {
      editDialogFormVisible: {
        handler(newVal, oldVal) {
          if (newVal === true) {
            this.parameterAssignment(this.currentDepartObject)
            this.getSysDeptParentNameBydeptId()
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
