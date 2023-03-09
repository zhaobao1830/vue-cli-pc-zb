<template>
  <div class="userManagement">
    <div class="departmentTree">
      <div class="dTree-title">选择部门</div>
      <div class="dTree-con">
        <el-tree
          default-expand-all
          :expand-on-click-node="false"
          :data="departmentTreeList"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
    </div>
    <div class="content">
      <div class="currentDepartment">{{currentDepartment}}</div>
      <div class="search-add-delete">
        <div class="search_input">
          <img @click="searchUserList" :src="searchIcon"/>
          <input class="search-input" v-model="realName" placeholder="请输入姓名" />
        </div>
        <div class="add_delete_search">
          <div
            class="search_button"
            @click="searchUserList"
          >查询</div>
          <div
            class="add"
            v-permission="'system:user:add'"
            @click="showAddDialogFormVisible"
          >
            <i class="el-icon-plus"></i>
            <span>添加</span>
          </div>
          <div
            v-permission="'system:user:batchRemove'"
            @click="batchDelete"
            class="delete"
          >删除</div>
        </div>
      </div>
      <el-table
        ref="userTable"
        class="el-table"
        :data="userList"
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
            {{ (offset / limit) * limit + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
        >
          <template v-slot="scope">
            {{scope.row.realName}}
          </template>
        </el-table-column>
        <el-table-column
          label="用户名"
        >
          <template v-slot="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>
        <el-table-column
          label="邮箱"
          width="200"
        >
          <template v-slot="scope">
            {{scope.row.email}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="80"
        >
          <template v-slot="scope">
            <div class="statusVal" :class="scope.row.status === 1 ? 'statusNormal' : 'statusAbnormal'">{{scope.row.status === 1 ? '正常' : '禁用'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="用户类型"
          width="100"
        >
          <template v-slot="scope">
            {{scope.row.userType | userTypeFilter}}
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
                    v-permission="{ permission: 'system:user:edit', type: 'disabled' }"
                    @click.native.prevent.stop="handleEdit(scope.row)"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    v-permission="{ permission: 'system:user:remove', type: 'disabled' }"
                    @click.native.prevent.stop="handleDelete(scope.row)"
                  >删除</el-dropdown-item>
                  <el-dropdown-item
                    v-permission="{ permission: 'system:user:resetPwd', type: 'disabled' }"
                    @click.native.prevent.stop="handleResetPassword(scope.row)"
                  >重置密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination" v-if="paginationShow">
        <el-pagination
          :background="true"
          :page-size="limit"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalNum"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <user-add
        :addDialogFormVisible="addDialogFormVisible"
        :roleList="roleList"
        :departmentTreeList="departmentTreeList"
        @closeAddDialogFormVisible="closeAddDialogFormVisible"
      ></user-add>
      <user-reset-password
        :resetPwdDialogFormVisible="resetPwdDialogFormVisible"
        :currentOperatingUserId="currentOperatingUserId"
        @closeResetPwdDialogFormVisible="closeResetPwdDialogFormVisible"
      ></user-reset-password>
    </div>
    <user-edit
       :editDialogFormVisible="editDialogFormVisible"
       :departmentTreeList="departmentTreeList"
       :currentOperatingUserId="currentOperatingUserId"
       @closeEditDialogFormVisible="closeEditDialogFormVisible"
     >
     </user-edit>
  </div>
</template>

<script>
  import UserModel from 'core/model/systemManagement/user'
  import UserAdd from '@/views/systemManagement/userManagement/userAdd'
  import UserResetPassword from '@/views/systemManagement/userManagement/userResetPassword'
  import UserEdit from '@/views/systemManagement/userManagement/userEdit'

  export default {
    name: 'userManagement',
    data() {
      return {
        iconOperate: require('./icon_operate.png'),
        searchIcon: require('./icon_search.png'),
        loading: false,
        departmentTreeList: [], // 部门树状列表
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        currentDepartment: '顶级节点', // 默认选中的节点名称
        order: 'DESC', // 排序方式，固定为升序asc
        limit: 10, // 每页展示的条数
        offset: 0, // 页数 从0开始
        currentPage: 1, // 当前页码
        deptId: '', // 部门Id
        realName: '', // 用户姓名
        sort: 'id', // 排序字段
        totalNum: 0, // 总数
        userList: [], // 用户列表
        paginationShow: false, // 控制分页显示
        roleList: [], // 角色列表
        addDialogFormVisible: false,
        resetPwdDialogFormVisible: false,
        currentOperatingUserId: '', // 当前操作的用户id
        editDialogFormVisible: false
      }
    },
    created () {
      // 回车事件
      const _this = this
      document.onkeydown = function(e) {
        const key = window.event.keyCode
        if (key === 13) {
          _this.searchUserList()
        }
      }
    },
    mounted () {
      this.getDepartmentTreeList()
      this.searchUserList()
      this.getAddUserInfo()
    },
    methods: {
      // 查询用户
      searchUserList() {
        this.offset = 0
        this.currentPage = 1
        this.getUserList()
      },
      // 获取部门树状列表
      async getDepartmentTreeList() {
        const res = await UserModel.departmentTree()
        if (res.code === 0) {
          this.departmentTreeList.push(res.data)
        } else {
          this.departmentTreeList = []
        }
      },
      // 获取用户列表
      async getUserList() {
        if (this.deptId === '-1') {
          this.deptId = ''
        }
        this.loading = true
        const res = await UserModel.userList({
          order: this.order,
          limit: this.limit,
          offset: this.offset,
          deptId: this.deptId,
          realName: this.realName,
          sort: this.sort
        })
        this.loading = false
        if (res.code === 0) {
          this.userList = [...res.rows]
          this.totalNum = res.total
          if (this.totalNum > this.limit) {
            this.paginationShow = true
          } else {
            this.paginationShow = false
          }
        } else {
          this.$message.error(res.msg)
          this.userList = []
          this.totalNum = 0
          this.paginationShow = false
        }
      },
      // 获取授权码列表和角色列表
      async getAddUserInfo() {
        const res = await UserModel.addUserInfo()
        if (res.code === 0) {
          this.roleList = [...this.roleList, ...res.roles]
        }
      },
      // 点击部门树，调用用户列表方法
      handleNodeClick(data) {
        this.deptId = data.id
        this.offset = 0
        this.currentPage = 1
        this.getUserList()
      },
      // 编辑用户
      handleEdit(row) {
        this.currentOperatingUserId = row.id
        this.editDialogFormVisible = true
      },
      // 删除单个用户
      async handleDelete(row) {
        this.$confirm('确定要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          const userId = row.id
          const res = await UserModel.removeUser(userId)
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.conformDeleteSearch(1)
          } else {
            this.$message.error(res.msg)
          }
        })
          .catch(err => {
            console.log(err)
          })
      },
      // 批量删除
      batchDelete() {
        const selectedArr = this.$refs.userTable.selection
        if (selectedArr.length === 0) {
          this.$message.warning('请至少选择一项')
        } else {
          this.$confirm('确定要删除选中的用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const formData = new FormData()
            for (let i = 0; i < selectedArr.length; i++) {
              formData.append('ids[]', selectedArr[i].id)
            }
            const res = await UserModel.batchUserRemove(formData)
            if (res.data.code === 0) {
              this.$message.success('删除成功')
              this.conformDeleteSearch(selectedArr.length)
            } else {
              this.$message.error(res.data.msg)
            }
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      // 执行删除方法以后，调用查询方法
      // 删除以后判断，如果当前页有数据，就查询当前页；如果当前页的数据都删除了，就查询前一页的数据
      // 参数为删除的条数
      conformDeleteSearch(deleeNum) {
        // 总条数与每页条数的余数,如果大于零,说明当前页还有数据,反之,当前页无数据
        const residue = (this.totalNum - deleeNum) % this.limit
        if (residue > 0) {
          this.getUserList()
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.handleCurrentChange(this.currentPage)
          } else {
            this.handleCurrentChange(1)
          }
        }
      },
      // 重置密码
      handleResetPassword(row) {
        this.currentOperatingUserId = row.id
        this.resetPwdDialogFormVisible = true
      },
      // 分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.getUserList()
      },
      // 关闭添加用户的弹出层
      closeAddDialogFormVisible(flag) {
        this.addDialogFormVisible = false
        if (flag) {
          this.currentPage = 1
          this.offset = 0
          this.getUserList()
        }
      },
      // 关闭修改用户密码的弹出层
      closeResetPwdDialogFormVisible() {
        this.resetPwdDialogFormVisible = false
      },
      // 关闭编辑用户的弹出层
      closeEditDialogFormVisible(flag) {
        this.editDialogFormVisible = false
        if (flag === true) {
          this.currentPage = 1
          this.offset = 0
          this.getUserList()
        }
      },
      // 打开新增页面
      showAddDialogFormVisible() {
        this.addDialogFormVisible = true
      }
    },
    filters: {
      // 过滤用户类型
      userTypeFilter(val) {
        let newVal = ''
        if (val) {
         switch (val) {
           case 1:
             newVal = '平台管理员'
             break
           case 2:
             newVal = '普通用户'
             break
           default:
             newVal = '其他'
         }
         return newVal
        } else {
          return '其他'
        }
      }
    },
    components: {
      UserAdd,
      UserResetPassword,
      UserEdit
    }
  }
</script>

<style scoped lang="scss">
  .userManagement{
    display: flex;
    .departmentTree{
      width: 223px;
      flex: 0 0 223px;
      height: 100%;
      border-right: 2px solid #EBEBEB;
      .dTree-title{
        margin: 30px 30px 0;
        height: 33px;
        border-left: 8px solid #3370FF;
        display: flex;
        align-items: center;
        padding-left: 14px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
      }
      .dTree-con{
        margin: 20px 30px 0;
      }
    }
    .content{
      flex: 1;
      padding: 30px;
      .currentDepartment{
        width: 80px;
        height: 28px;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        line-height: 28px;
      }
      .search-add-delete{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 17px;
        .search_input{
          display: flex;
          align-items: center;
          width: 280px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid #D8D8D8;
          box-sizing: border-box;
          img{
            width: 29px;
            height: 29px;
            cursor: pointer;
            margin-left: 6px;
          }
          .search-input{
            border: none !important;
            margin-left: 5px;
            width: 220px;
            height: 38px;
          }
        }
        .add_delete_search{
          display: flex;
          .search_button{
            width: 80px;
            height: 40px;
            background: #3370FF;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 16px;
            cursor: pointer;
            font-weight: 400;
          }
          .add{
            width: 80px;
            height: 40px;
            margin-left: 20px;
            background: #3370FF;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
            font-weight: 400;
            span{
              margin-left: 3px;
            }
          }
          .delete{
            box-sizing: border-box;
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
      }
      .el-table{
        margin-top: 40px;
      }
      .statusVal{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 30px;
        border-radius: 7px;
        font-size: 16px;
        font-weight: 400;
      }
      .statusNormal{
        background: #F0F4FF;
        color: #3370FF;
      }
      .statusAbnormal{
        background: #FFF0EA;
        color: #EC6E3C;
      }
    }
  }
</style>
