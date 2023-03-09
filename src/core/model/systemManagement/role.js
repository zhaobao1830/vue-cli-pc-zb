import { formDataPost, get } from 'core/axios/axios'
import ApiService from 'core/config/apiService'
import _axios from 'axios'
import storage from 'good-storage'
import { AUTH_TOKEN } from 'core/config/constant'

// 角色
export default class Role {
  /**
   * 获取角色列表
   * @returns {Promise<*>}
   */
  static async roleList() {
    return get(ApiService.roleList)
  }

  /**
   * 获取权限树结构
   * @returns {Promise<*>}
   */
  static async menuTree() {
    return get(ApiService.menuTree)
  }

  /**
   * 添加角色
   * @param menuIds 菜单权限
   * @param roleName 角色名 required
   * @param remark 备注
   * @returns {AxiosPromise<any>}
   */
  static async roleSave({
    menuIds,
    roleName,
    remark
  }) {
   return formDataPost(ApiService.roleSave, {
     menuIds,
     roleName,
     remark
   })
  }

  /**
   * 删除单个角色
   * @param id 角色Id required
   * @returns {AxiosPromise<any>}
   */
  static async removeRole(id) {
    return formDataPost(ApiService.removeRole, {
      id
    })
  }

  /**
   * 批量删除角色
   * @param data its[] 角色id 使用FormData赋值
   * @returns {AxiosPromise<any>}
   */
  static async batchRoleRemove(data) {
    return _axios({
      method: 'post',
      url: ApiService.batchRoleRemove,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        authToken: storage.get(AUTH_TOKEN, '')
      }
    })
  }

  /**
   * 获取角色信息
   * @param id 角色id required
   * @returns {AxiosPromise<any>}
   */
  static async editRoleInfo(id) {
    return get(ApiService.editRoleInfo, {
      id
    })
  }

  /**
   * 修改角色信息
   * @param roleId 角色id
   * @param menuIds 权限 String
   * @param roleName 角色名称 required
   * @param remark 角色备注
   * @returns {AxiosPromise<any>}
   */
  static async roleUpdate({
    roleId,
    menuIds,
    roleName,
    remark
  }) {
    return formDataPost(ApiService.roleUpdate, {
      roleId,
      menuIds,
      roleName,
      remark
    })
  }
}
