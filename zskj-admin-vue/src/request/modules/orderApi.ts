import { API } from "../config";
import { Get, Post } from "../request";
import { BookingOrderType, MealOrderType, RightsInterestsOrderType, RecordsType, RefundUpdateModel, RefundModel } from "../types/order"
// 预约工单
export const BookingOrder = (data: BookingOrderType) => Post(API + "/ticketsBooking/pageQuery", data)// 搜索和分页
export const BookingOrderDetails = (params: { id: number }) => Get(API + "/ticketsBooking/queryById", params)// 详情
// 服务工单
export const MealOrder = (data: MealOrderType) => Post(API + "/ticketsService/pageQuery", data)// 搜索和分页
export const MealOrderDetails = (params: { id: number }) => Get(API + "/ticketsService/queryById", params)// 详情

export const RightsInterestsOrderDetails = (params: { id: number }) => Get(API + "", params)// 详情
// 退款工单
export const queryRefundOrder = (data: RefundModel) => Post(API + "/ticketsRefund/pageQuery", data)// 退款工单分页查询
export const updateRefundOrder = (data: RefundUpdateModel) => Post(API + "/ticketsRefund/changeStatus", data)// 退款修改状态
// 服务记录
export const Records = (data: RecordsType) => Post(API + "/ticketsBooking/queryLogs", data)

// 权益工单
export const RightsInterestsOrder = (data: RightsInterestsOrderType) => Post(API + "/ticketsEquity/pageQuery", data)// 搜索和分页
export const InterestsOrderDetails = (data: { id: number }) => Get(API + "/ticketsEquity/queryById", data)// 详情
export const bhiDetails = (data: { archivesNo: number | string }) => Post(API + "/comprehensive/getReportByArchivesNo4Api", data)// Bhi 
