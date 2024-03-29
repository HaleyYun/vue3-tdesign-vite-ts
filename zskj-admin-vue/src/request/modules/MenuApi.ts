import { API } from "../config";
import { Get, Post } from "../request";
import { AddMenuType, MenuFindByIdType, EditMenuType } from "../types/Menu"
// 登录
export const getMenu = (params?: {}) => Get(API + "/menu/list", params)// 菜单列表
export const getTreeMenu = (params?: {}) => Get(API + "/menu/treeSelect", params)// 菜单树列表
export const getTreeRoleMenuIds = (params?: { roleId?: number }) => Get(API + "/menu/getRoleMenuIds", params)// 角色所有的菜单id集合
export const addMenu = (data: AddMenuType) => Post(API + "/menu/addMenu", data) // 新增菜单
export const editMenu = (data: EditMenuType) => Post(API + "/menu/modifyMenu", data) // 编辑菜单
export const menuFindById = (params: MenuFindByIdType) => Get(API + "/menu/findById", params)// 菜单id查询
export const deleteMenu = (params: { id: number }) => Get(API + "/menu/removeMenu", params)// 删除菜单




