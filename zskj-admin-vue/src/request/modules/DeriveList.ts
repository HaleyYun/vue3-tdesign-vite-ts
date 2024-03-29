import { API } from "../config";
import { Get, Post } from "../request";
// 导出中台
export const getRecordslist = (data: {} = {}) => Post(API + "/exportPlat/findExportBhiRecordsPage", data) //员工列表分页
export const exportGetRecordslist = (data: {} = {}) => Post(API + "/exportPlat/export/excelExportBhiRecordsPage",data) // 导出员工列表

export const getFindlist = (data: {} = {}) => Post(API + "/exportPlat/findEmployPage", data) //员工列表分页
export const exportGetFindlist = (data: {} = {}) => Post(API + "/exportPlat/export/excelFindEmployPage",data) // 导出员工列表
export const getFindOrganList = (data: {} = {}) => Post(API + "/exportPlat/findOrganPage", data) // 机构列表分页
export const exportFindOrganList = (data: {} = {}) => Post(API + "/exportPlat/export/excelFindOrganPage", data) // 导出机构列表


