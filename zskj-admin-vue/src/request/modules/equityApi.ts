import { API } from "../config";
import { Get, Post } from "../request";
import { customEquityModel, logPageQueryModel, codePageModel } from "../types/equityApi";

export const queryCustomEquity = (data: customEquityModel) => Post(API + "/customerRights/getPageList", data) //获取客户权益分页查询
export const getIdEquity = (data: { id?: number | string } = {}) => Post(API + "/customerRights/info", data) //根据id获取客户权益详情
export const sendIdEquity = (data: { dataIdList?: number[] } = {}) => Post(API + "/customerRights/sendEquityCard", data) //根据id获取客户权益详情
export const getLogPage = (data: logPageQueryModel) => Post(API + "/customerRights/logPageQuery", data) //操作日志分页查询
export const getCodePage = (data: codePageModel) => Post(API + "/customerRights/getRightEstimatePage", data) //权益使用记录
export const getTemplate = (data: object) => Post(API + "/customerRights/exportTemplate", data) //权益使用记录
export const posterTemplate = (data: logPageQueryModel) => Post(API + "/posterTemplate/list", data) //模板分页查询
export const addPosterTemplate = (data: logPageQueryModel) => Post(API + "/posterTemplate/addPosterTemplate", data) //海报模版新增
export const updatePosterTemplate = (data: logPageQueryModel) => Post(API + "/posterTemplate/updatePosterTemplate", data) //海报模版编辑
export const removePosterTemplate = (data: logPageQueryModel) => Post(API + "/posterTemplate/removePosterTemplate", data) //海报模版删除
export const templateStatus = (data: { id?: number | string } = {}) => Get(API + "/posterTemplate/updateTemplateStatus", data) //海报模版状态开关