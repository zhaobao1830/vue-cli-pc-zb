const systemManagementRouter = {
  route: null,
  name: null,
  title: '系统管理',
  type: 'folder',
  icon: 'icon_system_manage',
  filePath: 'views/systemManagement/',
  order: null,
  inNav: true,
  children: [
    {
      title: '用户管理',
      type: 'view',
      name: 'userManagement',
      route: '/systemManagement/userManagement/userManagement',
      filePath: 'views/systemManagement/userManagement/userManagement.vue',
      inNav: true,
      permission: ['system:user:user']
    },
    {
      title: '角色管理',
      type: 'view',
      name: 'roleManagement',
      route: '/systemManagement/roleManagement/roleManagement',
      filePath: 'views/systemManagement/roleManagement/roleManagement.vue',
      inNav: true,
      permission: ['system:role:role']
    },
    {
      title: '部门管理',
      type: 'view',
      name: 'departmentManagement',
      route: '/systemManagement/departmentManagement/departmentManagement',
      filePath: 'views/systemManagement/departmentManagement/departmentManagement.vue',
      inNav: true,
      permission: ['system:sysDept:sysDept']
    }
  ]
}

export default systemManagementRouter
