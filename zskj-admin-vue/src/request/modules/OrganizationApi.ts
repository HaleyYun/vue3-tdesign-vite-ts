import { API } from "../config";
import { Get, Post } from "../request";
import { OrganizationListType, AddOrganizationType, EditOrganizationType, OrganizationSwitchRoleEnableType, activityConfig, proConfig } from "../types/Organization"

export const getOrganization = (params: { id: number }) => Get(API + "/organization/findById", params)// 平台、渠道、机构详情
export const getOrganizationTree = (data?: { organizationLevel: number }) => Post(API + "/organization/getOrganizationTree", data)// 新增账号时平台、渠道、机构下拉
export const organization = (data: OrganizationListType) => Post(API + "/organization/list", data) // 平台、渠道、机构分页查询
export const addOrganization = (data: AddOrganizationType) => Post(API + "/organization/addOrganization", data) // 新建平台、渠道、机构
export const EditOrganization = (data: EditOrganizationType) => Post(API + "/organization/modifyOrganization", data) // 编辑平台、渠道、机构
export const switchOrganizationEnable = (data: OrganizationSwitchRoleEnableType) => Post(API + "/organization/switchOrganizationEnable", data) // 编辑平台、渠道、机构状态
export const removeOrganization = (data: { id: number }) => Post(API + "/organization/removeOrganization", data) // 删除平台、渠道、机构
export const addMarket = (data: { channelCode: number }) => Post(API + "/organization/produceMarketingWebsite", data) // 一键生成营销地址接口
export const queryCity = (params: {} = {}) => Get(API + "/cityCode/provinceCodeSelect", params) // 获取渠道地区
export const addActivityConfig = (data: activityConfig) => Post(API + "/organization/saveH5ChannelDisposition", data)//渠道H5配置页查询
export const queryProConfig = (params: { id: number }) => Get(API + "/disposition/findProDisposition", params)//渠道pro配置页查询

export const addProConfig = (data: proConfig) => Post(API + "/disposition/addOrganization", data)//给组织编号增加pro配置



