<template>
  <div class="departmentManagement">
    <div class="add_div">
      <div
        class="add"
        v-permission="'system:sysDept:add'"
        @click="showAddDialogFormVisible"
      >
        <i class="el-icon-plus"></i>
        <span>添加</span>
      </div>
    </div>
    <el-table
      ref="roleTable"
      class="el-table"
      :data="departmentList"
      stripe
      row-key="deptId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        label="编号"
      >
        <template v-slot="scope">
          {{scope.row.deptId}}
        </template>
      </el-table-column>
      <el-table-column
        label="部门名称"
      >
        <template v-slot="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
      >
        <template v-slot="scope">
          {{scope.row.orderNum}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="60">
        <template v-slot="scope">
          <div class="operation">
            <el-dropdown
              trigger="click"
              :hide-on-click="false"
            >
              <img class="el-dropdown-link operation-link" :src="iconOperate"/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-permission="{ permission: 'system:sysDept:add', type: 'disabled'}"
                  @click.native.prevent.stop="handleAdd(scope.row)"
                >增加</el-dropdown-item>
                <el-dropdown-item
                  v-permission="{ permission: 'system:sysDept:edit', type: 'disabled'}"
                  @click.native.prevent.stop="handleEdit(scope.row)"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                  v-permission="{ permission: 'system:sysDept:remove', type: 'disabled'}"
                  @click.native.prevent.stop="handleDelete(scope.row)"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <department-add
      :addDialogFormVisible="addDialogFormVisible"
      :parentId="parentId"
      :parentName="parentName"
      @closeAddDialogFormVisible="closeAddDialogFormVisible"
    ></department-add>
    <department-edit
      :currentDepartObject="currentDepartObject"
      :editDialogFormVisible="editDialogFormVisible"
      @closeEditDialogFormVisible="closeEditDialogFormVisible"
    ></department-edit>
  </div>
</template>

<script>
  import DepartmentModel from 'core/model/systemManagement/department'
  import DepartmentAdd from '@/views/systemManagement/departmentManagement/departmentAdd'
  import DepartmentEdit from '@/views/systemManagement/departmentManagement/departmentEdit'

  export default {
    name: 'departmentManagement',
    data() {
      return {
        iconOperate: require('./icon_operate.png'),
        loading: false,
        departmentList: [], // 部门列表
        parentId: 0, // 上级部门id
        parentName: '总部门', // 上级部门名称
        currentDepartObject: {}, // 当前被编辑的部门信息
        addDialogFormVisible: false,
        editDialogFormVisible: false
      }
    },
    async mounted () {
      await this.getSysDeptList()
    },
    methods: {
      // 获取部门列表
      async getSysDeptList() {
        const res = await DepartmentModel.sysDeptList()
        if (res.code === 0) {
          this.departmentList = res.data
        } else {
          this.departmentList = []
        }
      },
      showAddDialogFormVisible() {
        this.addDialogFormVisible = true
      },
      closeAddDialogFormVisible(flag) {
        this.addDialogFormVisible = false
        if (flag === true) {
          this.getSysDeptList()
        }
      },
      closeEditDialogFormVisible(flag) {
        this.editDialogFormVisible = false
        if (flag === true) {
          this.getSysDeptList()
        }
      },
      handleAdd(row) {
        this.parentId = row.deptId
        this.parentName = row.name
        this.addDialogFormVisible = true
      },
      handleEdit(row) {
        this.currentDepartObject = row
        this.editDialogFormVisible = true
      },
      handleDelete(row) {
        this.$confirm('确定要删除该部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const deptId = row.deptId
            const res = await DepartmentModel.sysDeptRemove(deptId)
            if (res.code === 0) {
              this.$message.success('删除成功')
              await this.getSysDeptList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    components: {
      DepartmentAdd,
      DepartmentEdit
    }
  }
</script>

<style scoped lang="scss">
  .departmentManagement{
    display: flex;
    flex-direction: column;
    padding: 30px;
    .add_div{
      display: flex;
      justify-content: flex-end;
      .add{
        width: 80px;
        height: 40px;
        background: #3370FF;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        cursor: pointer;
        span{
          margin-left: 3px;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }
</style>
