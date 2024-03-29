import { API } from "../config";
import { Get, Post, PostParams } from "../request";
import { OrganizationListType } from "../types/Organization";
import { ServiceModel, QueryServiceModel, ServiceTypeModel, QueryServiceTypeModel, ServiceProdModel, serviceList, ServiceRecomdModel, ServiceAddRecomdModel, ServiceProductModel, ServiceQueryProductModel, ServiceQueryEquityModel } from "../types/Service";
// 服务列表
export const addService = (data: ServiceModel) => Post(API + "/serv/addServ", data) //新增服务
export const deleteService = (data: ServiceModel) => Post(API + "/serv/deleteServById", data) //删除服务
export const updateService = (data: ServiceModel) => Post(API + "/serv/editServ", data) //更新服务
export const getService = (params: { id?: number } = {}) => Get(API + "/serv/findById", params)// 通过id查询单条服务数据
export const queryService = (data: QueryServiceModel) => Post(API + "/serv/servPaginQuery", data) //服务分页查询
export const checkTypeService = (params: { port?: string } = {}) => Get(API + "/estimateService/getEstimateServiceSelect", params) //服务分页查询
export const exportEquityCardLog = () => PostParams(API + "/equityService/exportEquityCardLog") //生成记录导出
export const queryEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/equityCenterServiceQuery", data) //权益社区分页查询
export const getExtendOrder = (data: ServiceQueryEquityModel) => Post(API + "/posterTemplate/findSelectPage", data) //推广分页查询
// 服务类型
export const addServiceType = (data: ServiceTypeModel) => Post(API + "/servType/addServType", data) //新增服务分类
export const deleteServiceType = (data: ServiceTypeModel) => Post(API + "/servType/deleteServTypeById", data) //删除服务分类
export const updateServiceType = (data: ServiceTypeModel) => Post(API + "/servType/editServType", data) //更新服务分类
export const getServiceType = (params: { id?: number } = {}) => Get(API + "/servType/findById", params)// 通过id查询单条服务分类数据
export const queryServiceType = (data: QueryServiceTypeModel) => Post(API + "/servType/servTypePaginQuery", data) //服务分类分页查询
//绑定模板
export const equityTemplateBind = (data: ServiceProdModel) => Post(API + "/equityTemplate/equityTemplateBind", data) //绑定模板产品
export const equityTemplate = (data: ServiceProdModel) => Post(API + "/equityTemplate/equityTemplateQueryPage", data) //查询绑定
// 服务产品
export const addServiceProd = (data: ServiceProdModel) => Post(API + "/servProd/addProd", data) //新增服务产品
export const deleteServiceProd = (data: ServiceProdModel) => Post(API + "/servProd/addProd", data) //删除服务产品
export const updateServiceProd = (data: ServiceProdModel) => Post(API + "/servProd/editProd", data) //更新服务产品
export const getServiceProd = (params: { id?: number } = {}) => Get(API + "/servProd/findProdById", params)// 通过id查询单条服务产品数据
export const queryServicePro = (data: serviceList) => Post(API + "/servProd/prodPaginQuery", data) //服务产品分页查询
export const changeServicePro = (data: ServiceProdModel) => Post(API + "/servProd/changeStatus", data) //服务产品分页查询
export const channelProductSelect = (data?: {}) => Post(API + "/servProd/channelProductSelect", data) //渠道产品下拉列表
export const ProductSelect = (data?: {}) => Post(API + "/servProd/productSelect", data) //产品下拉列表


// 服务推荐
export const addServiceRecomd = (data: ServiceAddRecomdModel) => Post(API + "/recommendProduct/addRecommendedServices", data) //新增服务推荐
export const deleteServiceRecomd = (data: ServiceRecomdModel) => Post(API + "/recommendProduct/deleteRecommendedServicesById", data) //删除服务推荐
export const updateServiceRecomd = (data: ServiceRecomdModel) => Post(API + "/recommendProduct/editRecommendedServices", data) //更新服务推荐
export const getServiceRecomd = (params: { id?: number } = {}) => Get(API + "/recommendProduct/findById", params)// 通过id查询单条服务推荐数据
export const queryServiceRecomd = (data: ServiceRecomdModel) => Post(API + "/recommendProduct/recommendedServicesPaginQuery", data) //服务推荐分页查询


// 渠道产品
export const addServiceProduct = (data: ServiceProductModel) => Post(API + "/channelProduct/addChannelProduct", data) //新增渠道产品
export const deleteServiceProduct = (data: ServiceProductModel) => Post(API + "/channelProduct/deleteChannelProductById", data) //删除渠道产品
export const updateServiceProduct = (data: ServiceProductModel) => Post(API + "/channelProduct/editChannelProduct", data) //更新渠道产品
export const getServiceProduct = (params: { id?: number } = {}) => Get(API + "/channelProduct/findById", params)// 通过id查询单条渠道产品数据
export const queryServiceProduct = (data: ServiceQueryProductModel) => Post(API + "/channelProduct/channelProductPaginQuery", data) //渠道产品分页查询
export const organization = (data: OrganizationListType) => Post(API + "/organization/list", data) // 平台、渠道、机构分页查询
export const getTypeId = (data: any) => Post(API + "/channelProduct/queryRelaTypeId", data) // 平台、渠道、机构分页查询

export const organizationType = (data: {}) => Post(API + "/channelProduct/queryRelaed", data) // 渠道分类关联
export const channelSelect = (data: any) => Post(API + "/channelProduct/channelSelect", data) // 渠道下拉


// 权益服务
export const equityServiceStatus = (data: ServiceQueryEquityModel) => Post(API + "/equityService/changeEquityStatus", data) //修改状态
export const addServiceEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/addEquityService", data) //新增权益服务
export const deleteServiceEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/deleteEquityServiceById", data) //用id删除权益服务
export const updateServiceEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/editEquityService", data) //更新权益服务
export const getServiceIdEquity = (params: { id?: number } = {}) => Get(API + "/equityService/findById", params)// 通过id查询单条权益服务数据
export const queryServiceEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/equityServiceQuery", data) //权益服务分页查询
export const generServiceEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/generateEquityCard", data) //生成权益卡
export const queryGenerServiceEquity = (data: ServiceQueryEquityModel) => Post(API + "/equityService/equityCardLog", data) //查询权益卡记录

