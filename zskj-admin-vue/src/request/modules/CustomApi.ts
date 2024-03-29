import { API } from "../config";
import { Get, Post } from "../request";
import { GetBasePageListType, GetWechatUserPageListType } from "../types/CustomApi"

export const getBasePageList = (data: GetBasePageListType) => Post(API + "/healthRecords/getBasePageList", data) // 健康档案基础信息列表
export const getWechatUserPageList = (data: GetWechatUserPageListType) => Post(API + "/getWechatUserPageList", data) // 微信档案基础信息列表
export const getHealthRecordsDetailById = (data: { archivesNo: string | number }) => Post(API + "/healthRecords/getHealthRecordsDetailByArchivesNo", data) // 健康档案基础信息列表
export const pdfBatchDownloadUriAndName = (data: GetBasePageListType) => Post(API + "/healthRecords/pdfBatchDownloadUriAndName", data) //pdf批量下载信息

