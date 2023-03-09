<template>
  <div class="roleManagement">
    <div class="add-delete">
      <div
        class="add"
        v-permission="'system:role:add'"
        @click="showAddDialogFormVisible"
      >
        <i class="el-icon-plus"></i>
        <span>添加</span>
      </div>
      <div
        v-permission="'system:role:batchRemove'"
        @click="batchDelete"
        class="delete"
      >删除</div>
    </div>
    <el-table
      ref="roleTable"
      class="el-table"
      :data="roleList"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="80"
      >
        <template v-slot="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        label="角色名"
      >
        <template v-slot="scope">
          {{scope.row.roleName}}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
      >
        <template v-slot="scope">
          {{scope.row.remark}}
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
                  v-permission="{ permission: 'system:role:edit', type: 'disabled'}"
                  @click.native.prevent.stop="handleEdit(scope.row)"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                  v-permission="{ permission: 'system:role:remove', type: 'disabled'}"
                  @click.native.prevent.stop="handleDelete(scope.row)"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <role-add
      :addDialogFormVisible="addDialogFormVisible"
      :menuTreeList="menuTreeList"
      @closeAddDialogFormVisible="closeAddDialogFormVisible"
    >
    </role-add>
    <role-edit
      :editDialogFormVisible="editDialogFormVisible"
      :menuTreeList="menuTreeList"
      :currentEditRoleId="currentEditRoleId"
      @closeEditDialogFormVisible="closeEditDialogFormVisible"
    >
    </role-edit>
  </div>
</template>

<script>
  import RoleModel from 'core/model/systemManagement/role'
  import RoleAdd from '@/views/systemManagement/roleManagement/roleAdd'
  import RoleEdit from '@/views/systemManagement/roleManagement/roleEdit'

  export default {
    name: 'roleManagement',
    data() {
      return {
        iconOperate: require('./icon_operate.png'),
        loading: false,
        roleList: [], // 角色列表
        menuTreeList: [], // 权限树列表
        addDialogFormVisible: false,
        editDialogFormVisible: false,
        currentEditRoleId: '' // 当前要编辑的角色id
      }
    },
    mounted() {
      this.getRoleList()
      this.getMenuTree()
    },
    methods: {
      // 获取角色列表
      async getRoleList() {
        this.loading = true
        const res = await RoleModel.roleList()
        this.loading = false
        if (res.code === 0) {
          this.roleList = res.data
        } else {
          this.roleList = []
          this.$message.error(res.msg)
        }
      },
      // 获取权限树结构
      async getMenuTree() {
        const res = await RoleModel.menuTree()
        if (res.code === 0) {
          this.menuTreeList = []
          this.menuTreeList.push(res.data)
        } else {
          this.menuTreeList = []
        }
      },
      // 显示新增页面
      showAddDialogFormVisible() {
        this.addDialogFormVisible = true
      },
      // 批量删除
      batchDelete(row) {
        const selectedArr = this.$refs.roleTable.selection
        if (selectedArr.length === 0) {
          this.$message.warning('请至少选择一项')
        } else {
          this.$confirm('确定要删除选中的角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const formData = new FormData()
            for (let i = 0; i < selectedArr.length; i++) {
              formData.append('ids[]', selectedArr[i].roleId)
            }
            const res = await RoleModel.batchRoleRemove(formData)
            if (res.data.code === 0) {
              this.$message.success('删除成功')
              await this.getRoleList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      // 打开编辑页面
      handleEdit(row) {
        this.currentEditRoleId = row.roleId
        this.editDialogFormVisible = true
      },
      // 单个删除
      async handleDelete(row) {
        this.$confirm('确定要删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          const roleId = row.roleId
          const res = await RoleModel.removeRole(roleId)
          if (res.code === 0) {
            this.$message.success('删除成功')
            await this.getRoleList()
          } else {
            this.$message.error(res.msg)
          }
        })
          .catch(err => {
            console.log(err)
          })
      },
      // 关闭新增页面
      closeAddDialogFormVisible(flag) {
        this.addDialogFormVisible = false
        if (flag === true) {
          this.getRoleList()
        }
      },
      // // 关闭编辑页面
      closeEditDialogFormVisible(flag) {
        this.editDialogFormVisible = false
        if (flag === true) {
          this.getRoleList()
        }
      }
    },
    components: {
      RoleAdd,
      RoleEdit
    }
  }
</script>

<style scoped lang="scss">
  .roleManagement{
    padding: 30px;
    .add-delete{
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
        }
      }
      .delete{
        width: 80px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #EC6E3C;
        color: #EC6E3C;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
      }
    }
    .el-table{
      margin-top: 40px;
    }
  }
</style>
