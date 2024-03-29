import { API } from "../config";
import { Get, Post } from "../request";
import { IntervenListType, UpdateTrainingType, QueryTemplateType, SaveTemplateType, UpdateDTOItem, userAttendanceListData, updateDailyAdviceType } from "../types/intervene"
//干预订单
export const intervenList = (data: IntervenListType) => Post(API + "/interventionOrder/queryPage", data) // 干预订单列表
export const intervenDetails = (params: { orderId: number | string }) => Get(API + "/interventionOrder/queryOrderDetail", params) // 干预订单详情
export const batchApprove = (data: { id: number[] }) => Post(API + "/interventionOrder/batchApprove", data) // 批量审核干预单
export const updateTraining = (data: UpdateTrainingType) => Post(API + "/interventionOrder/updateTraining", data) // 修改干预单的训练周期
//干预方案
export const queryWeeKList = (data: { interventionOrderId: number | string }) => Post(API + "/planWeek/queryWeeKList", data) // 查询周列表
export const queryWeeKInfo = (data: { interventionOrderId: number, weekSequence: number }) => Post(API + "/planWeek/queryWeeKInfo", data) // 查询周方案下知识库组合
export const queryDailyAdvice = (data: { interventionOrderNumber: number, weekSequence: number }) => Post(API + "/interventionOrder/queryDailyAdvice", data) // 查询某一个周每日推荐
export const echoOrderInfo = (data: { interventionOrderNumber: number, weekSequence: number }) => Post(API + "/interventionOrder/echoOrderInfo", data) // 查询某一个周每日推荐
export const queryFuturePlanList = (data: { interventionOrderId: number | string }) => Post(API + "/planWeek/queryFuturePlanList", data) // 查询待审核订单未来的周
export const updateWeekInfo = (data: UpdateDTOItem[]) => Post(API + "/planWeek/updateWeekInfo", data) // 修改周方案
export const updateDailyAdvice = (data: updateDailyAdviceType) => Post(API + "/interventionOrder/updateDailyAdvice", data) // 修改周方案
//干预模板
export const getAllBaseInfo = (data: { knowledgeName: string }) => Post(API + "/planTemplate/getAllBaseInfo", data) // 查询所有的基础知识库信息
export const queryAll = (data: { knowledgeName: string, knowledgeType: string }) => Post(API + "/interventionOrder/queryAll", data) // 查询所有的基础知识库信息

// export const savePlanTemplate = (data: SaveTemplateType) => Post(API + "/planTemplate/save", data) // 保存方案模板列表
export const savePlanTemplate = (data: SaveTemplateType) => Post(API + "/interventionPlanTemplate/save", data) // 保存方案模板列表
// export const queryTemplate = (data: QueryTemplateType) => Post(API + "/planTemplate/queryTemplateList", data) // 干预模板列表
export const queryTemplate = (params: QueryTemplateType) => Get(API + "/interventionPlanTemplate/queryAll", params) // 干预模板列表
// export const deleteTemplate = (data: { id: number | string }) => Post(API + "/planTemplate/delete", data) // 删除方案模板
export const deleteTemplate = (params: { id: number | string }) => Get(API + "/interventionPlanTemplate/deleteTemplate", params) // 删除方案模板
//干预排期
export const userList = (data: { userName: string, timeSort: number }) => Post(API + "/interventionSchedule/userList", data) // 干预用户列表
export const userAttendanceList = (data: userAttendanceListData) => Post(API + "/interventionSchedule/userAttendanceList", data) // 根据用户档案Id查询用户打卡记录
export const userAttendanceInfo = (data: { archivesNo: string, currentInterventionOrderNum: string }) => Post(API + "/interventionSchedule/userAttendanceInfo", data) // 根据用户档案Id查询用户打卡记录

export const queryDietList = (data: { orderId: number | string }) => Get(API + "/interventionOrder/queryOrderInfo", data) // 查询饮食列表

export const weeKList = (data: { interventionOrderNumber: number | string ,weekSequence: number}) => Post(API + "/interventionOrder/queryDailyAdvice", data) // 查询周列表
