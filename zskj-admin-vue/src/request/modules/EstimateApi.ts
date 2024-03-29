import { API } from "../config";
import { Get, Post } from "../request";
import { EstimateOrderType, OrderType } from "../types/EstimateApi"

export const estimateOrder = (data: EstimateOrderType) => Post(API + "/estimateOrder/list", data)// 评估列表搜索和分页

export const estimateOrderSeclect = (data: {} = {}) => Post(API + "/organization/getOrganizationSeclect", data)// 获取机构下拉
export const getEstimateOrder = (data: {} = {}) => Post(API + "/organization/queryOrganByChannel", data)// 获取机构

export const getProductSelect = (data: {} = {}) => Post(API + "/channelProduct/productSelect", data)// 获取机构产品
export const addProductSelect = (data: {} = {}) => Post(API + "/channelProduct/addChannelProduct", data)// 新增机构产品
export const editProductSelect = (data: {} = {}) => Post(API + "/channelProduct/editChannelProduct", data)// 编辑机构产品
export const orderGetReport = (data: OrderType) => Post(API + "/estimateOrder/getReport", data)// 获取报告

export const findProdById = (data: {} = {}) => Get(API + "/channelProduct/findById", data)//根据id查询

export const dictList = (data: OrderType) => Post(API + "/dict/list", data)// 数据字典
export const dictAddDictType = (data: OrderType) => Post(API + "/dict/addDictType", data)// 数据字典新增

export const dictUpdatePosition = (data: OrderType) => Post(API + "/dict/updatePosition", data)// 数据字典新增

export const dictDataPosition = (data: OrderType) => Post(API + "/dictData/addDictData", data)// 字典数据新增
export const dictDataList = (data: OrderType) => Post(API + "/dictData/list", data)// 字典数据列表

export const dictUpdateDictData = (data: OrderType) => Post(API + "/dictData/updateDictData", data)// 字典数据修改
export const dictUpdateUpdateDictType = (data: OrderType) => Post(API + "/dict/updateDictType", data)// 数据字典修改/
export const getEstimateResult = (data: { estimateNum: string }) => Post(API + "/report/getReport", data)// 数据字典修改/

export const getEstimateVideo = (data: {
    estimateNum: string,
    taskType: number,
    type: number,
}) => Post(API + "/estimateOrder/getEstimateVideo", data)// 获取视频列表




export const orderGetADReport = (data: OrderType) => Post(API + "/estimateService/getReport", data)// 获取报告
export const ReportMoca = (data: OrderType) => Post(API + "/estimateScale/answerDetails", data)// 获取报告
export const orderHealthRecords = (data: OrderType) => Post(API + "/healthRecords/getHealthRecordHistory", data)// 获取操作


export const drawEstimateVideo = (data: {
    estimateNum: string
    index: number
    taskType: number
    type: number
}) => Post(API + "/estimateVideo/drawEstimateVideo", data)// 获取视频列表

