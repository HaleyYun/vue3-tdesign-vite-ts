import { API } from "../config";
import { Get, Post } from "../request";
import { UserListType, UserAddRoleType, UserEditRoleType, UserSwitchRoleEnableType, Agreement } from "../types/User"

export const getuser = (params: { id: number }) => Get(API + "/user/findById", params)// 用户详情
export const userList = (data: UserListType) => Post(API + "/user/list", data) // 用户分页查询
export const userAddRole = (data: UserAddRoleType) => Post(API + "/user/addUser", data) // 新建用户
export const userEditRole = (data: UserEditRoleType) => Post(API + "/user/modifyUser", data) // 编辑用户
export const userSwitchRoleEnable = (data: UserSwitchRoleEnableType) => Post(API + "/user/switchRoleEnable", data) // 编辑用户状态
export const userRemoveUser = (data: { id: number, isDelete: number }) => Post(API + "/user/removeUser", data) // 删除用户
export const resetPassWord = (params: { id: number }) => Get(API + "/user/resetPassWord", params) // 重置密码

//用户协议
export const getAgreement = (params: { channelSource: number }) => Get(API + "/agreement/query", params)// 获取协议
export const update = (data: Agreement) => Post(API + "/agreement/update", data) // 更新协议
// export const add = (data: AddAgreement) => Post(API + "/agreement/add", data) // 新增协议
