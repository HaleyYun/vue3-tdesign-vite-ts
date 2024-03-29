import { UserInfo } from "os";
import { API } from "../config";
import { Get, Post } from "../request";
import { RoleListType, RoleSwitchRoleEnableType, RoleAddRoleType, RoleEditRoleType,Info,PassWord,personinfo } from "../types/Persona";

export const getDetail= (params: { id: number }) => Get(API + "/role/findById", params)// 角色详情
export const getRoleTree = (params: { id?: number } = {}) => Get(API + "/role/getRoleTree", params)// 获取用户角色下拉
export const roleList = (data: RoleListType) => Post(API + "/role/list", data) // 角色分页查询
export const roleAddRole = (data: RoleAddRoleType) => Post(API + "/role/addRole", data) // 新建角色
export const roleEditRole = (data: RoleEditRoleType) => Post(API + "/role/modifyRole", data) // 编辑角色
export const roleSwitchRoleEnable = (data: RoleSwitchRoleEnableType) => Post(API + "/role/switchRoleEnable", data) // 编辑角色状态
export const roleremoveUser = (data: RoleEditRoleType) => Post(API + "/role/removeRole", data) //删除角色


export const userInfo = (data: Info) => Post(API + "/user/updateUserInfo", data) //修改个人信息
export const userPassWord = (data: PassWord) => Post(API + "/user/updatePassWord", data) //修改密码
export const allfomation = (data:{}) => Get(API + "/user/getUserInfoById", data) //获取全部信息





