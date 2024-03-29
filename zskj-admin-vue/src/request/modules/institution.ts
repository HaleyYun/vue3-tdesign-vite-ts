import { API } from "../config";
import { Get, Post } from "../request";
import { InstitutionListType, AddOrganType } from "../types/institution"

export const institutionList = (data: InstitutionListType) => Post(API + "/organ/list", data) // 机构分页查询
export const institutionDetails = (params: { id: number | string }) => Get(API + "/organ/findById", params) // 干预订单详情
export const addOrgan = (data: AddOrganType) => Post(API + "/organ/addOrgan", data) // 添加机构
export const updateOrgan = (data: AddOrganType) => Post(API + "/organ/updateOrgan", data) // 添加机构
export const getOrganMultiSelect = (params: {} = {}) => Get(API + "/organ/getOrganMultiSelect", params) // 获取机构下拉

