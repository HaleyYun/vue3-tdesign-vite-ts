import { API } from "../config";
import { Get, Post } from "../request";
import { addEmployee, employeeType, getPostList } from "../types/employee"

// 员工列表
export const employeeLoad = (data: employeeType) => Post(API + "/employee/list", data)// 搜索和分页
export const logLoadList = (data: employeeType) => Post(API + "/employee/findImportLogPage", data)// 导入搜索和分页
export const addEmployeeLoad = (data: addEmployee) => Post(API + "/employee/addEmployee", data)// 新增
export const editEmployeeLoad = (data: addEmployee) => Post(API + "/employee/updateEmployee", data)// 编辑
export const resetEmployeeLoad = (data: { id: number }) => Post(API + "/employee/resetPassword", data)// 重置
export const resetQueryOrganList = (data: {} = {}) => Get(API + "/organ/getOrganSelect", data)// 获取机构列表
export const resetSwitchRoleEnable = (data: addEmployee) => Post(API + "/employee/switchProEnable", data)// 启用状态  
export const setSwitchBind = (data: { employeeId: number }) => Post(API + "/employee/switchBind", data)// 启用状态  
export const sethBind = (data: {}) => Get(API + "/employee/unbindDevice", data)// 解绑
export const positionList = (data: { organId: number }) => Get(API + "/position/findPositionListByOrganId", data)// 员工岗位
export const positionByOrganId = (data: {} = {}) => Post(API + "/position/getPositionList", data)// 查询员工岗位
export const switchStatus = (data: {} = {}) => Post(API + "/employee/switchStatus", data)// 修改员工在职状态
export const getPosition = (data: object) => Post(API + "/employee/exportExcel", data) //下载
export const listEmployeeEquity = (data: object) => Post(API + "/employeeEquityCount/listEmployeeEquity", data) //营销权益配置列表
export const saveBatchEquity = (data: object) => Post(API + "/employeeEquityCount/saveBatchEmployeeEquity", data) //营销权益配置编辑时确定
export const employeeDetail = (data: {} = {}) => Get(API + "/employee/detail", data) //员工详情接口

//岗位列表

//岗位列表
export const postList = (data: getPostList) => Post(API + "/position/list", data)// 岗位列表
export const positionRoleEnable = (data: getPostList) => Post(API + "/position/switchProEnable", data)// 启用状态
export const positionAddPosition = (data: getPostList) => Post(API + "/position/addPosition", data)// 新增
export const positionUpdatePosition = (data: getPostList) => Post(API + "/position/updatePosition", data)// 编辑
export const getOrganSelect = (params?: {}) => Get(API + "/organ/getOrganSelect", params)// 获取岗位下拉
export const getPositionList = (params: { id?: number } = {}) => Get(API + "/position/getPositionList", params)// 通过id获取岗位下拉