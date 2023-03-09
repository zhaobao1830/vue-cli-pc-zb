import { get, formDataPost } from 'core/axios/axios'
import ApiService from 'core/config/apiService'

export default class Department {
  /**
   * 获取部门列表
   * @returns {AxiosPromise<any>}
   */
  static async sysDeptList() {
    return get(ApiService.sysDeptList)
  }

  /**
   * 新增部门
   * @param parentId 上级部门ID required
   * @param name 部门名称 required
   * @param orderNum 排序
   * @returns {AxiosPromise<any>}
   */
  static async sysDeptSave({
    parentId,
    name,
    orderNum
  }) {
    return formDataPost(ApiService.sysDeptSave, {
      parentId,
      name,
      orderNum
    })
  }

  /**
   * 根据部门ID查询上级部门名称
   * @param deptId 部门ID required
   * @returns {AxiosPromise<any>}
   */
  static async sysDeptParentNameByDeptId(deptId) {
    return get(ApiService.sysDeptParentName, {
      deptId
    })
  }

  /**
   * 更新部门
   * @param deptId 部门id required
   * @param parentId 上级部门id required
   * @param name 部门名称 required
   * @param orderNum 排序（数值 1，2，3这种  暂时无用）
   * @returns {AxiosPromise<any>}
   */
  static async sysDeptUpdate({
    deptId,
    parentId,
    name,
    orderNum
  }) {
    return get(ApiService.sysDeptUpdate, {
      deptId,
      parentId,
      name,
      orderNum
    })
  }

  /**
   * 删除部门
   * @param deptId 部门id required
   * @returns {AxiosPromise<any>}
   */
  static async sysDeptRemove(deptId) {
    return formDataPost(ApiService.sysDeptRemove, {
      deptId
    })
  }
}
