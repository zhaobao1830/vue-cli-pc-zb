import { formDataPost, get } from 'core/axios/axios'
import _axios from 'axios'
import ApiService from 'core/config/apiService'
import storage from 'good-storage'
import { AUTH_TOKEN } from 'core/config/constant'

// 用户
export default class User {
  /**
   * 更新用户信息
   * @param id required
   * @param username 用户名
   * @param realName 姓名 required
   * @param sex 性别 96男  97女 required
   * @param birth 出生年月 yyyy-mm-dd required
   * @param mobile 手机号 required
   * @param email 邮箱 required
   * @param province 省 required
   * @param city 市 required
   * @param district 县 required
   * @param liveAddress 联系地址 required
   * @param hobby 爱好
   * @returns {AxiosPromise<any>}
   */
  static async updatePeronal({
    id,
    username,
    realName,
    sex,
    birth,
    mobile,
    email,
    province,
    city,
    district,
    liveAddress,
    hobby
}) {
    return formDataPost(ApiService.updatePersonal, {
      id,
      username,
      realName,
      sex,
      birth,
      mobile,
      email,
      province,
      city,
      district,
      liveAddress,
      hobby
    })
  }

  /**
   * 修改用户信息头像
   * @param avatar_data 图片宽高 {"x":0,"y":0,"height":398,"width":398,"rotate":0}
   * @param avatar_file 图片流
   * @returns {AxiosPromise<any>}
   */
  static async uploadIm({
    avatar_data,
    avatar_file
  }) {
    return formDataPost(ApiService.uploadImg, {
      avatar_data,
      avatar_file
    })
  }

  /**
   * 修改密码
   * @param id required
   * @param pwdOld 旧密码 required
   * @param pwdNew 新密码 required
   * @param confirm_password 确认密码 required
   * @returns {AxiosPromise<any>}
   */
  static async resetPwd({
    id,
    pwdOld,
    pwdNew,
    confirm_password
  }) {
     return formDataPost(ApiService.resetPwd, {
       id,
       pwdOld,
       pwdNew,
       confirm_password
     })
  }

  /**
   * 部门树状数据
   * @returns {AxiosPromise<any>}
   */
  static async departmentTree() {
    return get(ApiService.departmentTree)
  }

  /**
   * 获取用户列表
   * @param order 排序 默认是升序asc
   * @param limit 每页条数 required
   * @param offset 查询条数偏移量 从0开始 required
   * @param deptId 部门id
   * @param realName 用户姓名
   * @param sort 排序字段
   * @returns {AxiosPromise<any>}
   */
  static async userList({
    limit = 10,
    offset = 0,
    order = 'asc',
    deptId,
    realName,
    sort
  }) {
    return get(ApiService.userList, {
      order,
      limit,
      offset,
      deptId,
      realName,
      sort
    })
  }

  /**
   * 获取授权码列表和角色列表
   * @returns {AxiosPromise<any>}
   */
  static async addUserInfo() {
    return get(ApiService.addUserInfo)
  }

  /**
   * 添加用户
   * @param realName 姓名
   * @param username 用户名 required
   * @param authNo 授权码 required
   * @param password 密码 required
   * @param deptId 部门Id
   * @param deptName 部门名称
   * @param email 邮箱
   * @param status 状态 1 正常 0 禁用 required
   * @param userType 用户类型 1 平台管理员 2 普通用户 required
   * @param roleIds 角色id字符串
   * @returns {AxiosPromise<any>}
   */
  static async saveUser({
    realName,
    username,
    authNo,
    password,
    deptId,
    deptName,
    email,
    status,
    userType,
    roleIds
  }) {
    return formDataPost(ApiService.saveUser, {
      realName,
      username,
      authNo,
      password,
      deptId,
      deptName,
      email,
      status,
      userType,
      roleIds
    })
  }

  /**
   * 获取用户信息
   * @param id
   * @returns {AxiosPromise<any>}
   */
  static async editUserInfo(id) {
    return get(ApiService.editUserInfo, {
      id
    })
  }

  /**
   * 编辑用户信息
   * @param id 用户Id
   * @param realName 姓名
   * @param username 用户名 required
   * @param password
   * @param deptId 部门Id
   * @param deptName 部门名称
   * @param email 邮箱
   * @param status 状态 1 正常 0 禁用 required
   * @param roleIds 角色id字符串
   * @returns {AxiosPromise<any>}
   */
  static async userUpdate({
    id,
    realName,
    username,
    password,
    deptId,
    deptName,
    email,
    status,
    roleIds
  }) {
    return formDataPost(ApiService.userUpdate, {
     id,
     realName,
     username,
     password,
     deptId,
     deptName,
     email,
     status,
     roleIds
   })
  }

  /**
   * 删除用户信息
   * @param id 用户id
   * @returns {AxiosPromise<any>}
   */
  static async removeUser(id) {
    return formDataPost(ApiService.removeUser, {
      id
    })
  }

  /**
   * 批量删除用户
   * @param data its[] 用户id 使用FormData赋值
   * @returns {AxiosPromise<any>}
   */
  static async batchUserRemove(data) {
    return _axios({
      method: 'post',
      url: ApiService.batchUserRemove,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        authToken: storage.get(AUTH_TOKEN, '')
      }
    })
  }

  /**
   * 修改用户密码
   * @param id 用户Id required
   * @param pwdNew 新密码 required
   * @returns {AxiosPromise<any>}
   */
  static async userResetPwd({
    id,
    pwdNew
  }) {
    return formDataPost(ApiService.userResetPwd, {
      id,
      pwdNew
    })
  }
}
