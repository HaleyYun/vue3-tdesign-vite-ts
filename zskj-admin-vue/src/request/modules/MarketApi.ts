import { API } from "../config";
import { Get, Post } from "../request";
import { pointsListType, findDetailType, pageQueryType, findByCodeType, enterListPageQueryType, addActivityType, activityCheckType, ArticleListModel, ArticleTypeModel, AddArticleModel, AddArticleTypeModel, UpdateArticleModel, UpdateArticleTypeModel, couponModel, activityModel } from "../types/Market";

// 活动
export const activityCheck = (data: activityCheckType) => Post(API + "/activity/activityCheck", data) // 审核活动
export const addActivity = (data: addActivityType) => Post(API + "/activity/addActivity", data) // 发布活动
export const editActivity = (data: addActivityType) => Post(API + "/activity/editActivity", data) // 发布活动
export const enterListPageQuery = (data: enterListPageQueryType) => Post(API + "/activity/enterListPageQuery", data) // 报名列表
export const findByCode = (data: findByCodeType) => Post(API + "/activity/pageQuery", data) // 活动列表
export const findDetail = (params: findDetailType) => Get(API + "/activity/findDetail", params) // 活动详情
export const pointsList = (data: pointsListType) => Post(API + "/activity/pointsList", data) // 点位列表
export const pageQuery = (data: pageQueryType) => Post(API + "/activityApprove/pageQuery", data) // 活动审批列表



export const articleTypeRemove = (params: { id: number }) => Get(API + "/marketingCenter/deleteArticleCategoryById", params)// 删除文章类型
export const addArticleType = (data: AddArticleTypeModel) => Post(API + "/marketingCenter/saveArticleCategory", data) // 新增文章类型
export const queryArticleType = (data: ArticleTypeModel) => Post(API + "/marketingCenter/getPageArticleCategory", data) // 文章类型查询
export const updateArticleType = (data: UpdateArticleTypeModel) => Post(API + "/marketingCenter/updateArticleCategoryById", data) // 更新文章类型


export const addArticle = (data: AddArticleModel) => Post(API + "/marketingCenter/saveArticle", data) // 新增文章
export const updateArticle = (data: UpdateArticleModel) => Post(API + "/marketingCenter/updateArticle", data) // 更新文章
export const queryArticleDetails = (params: { id: number }) => Get(API + "/marketingCenter/getArticleById", params)// id查询文章详情
export const articleRemove = (params: { id: number }) => Get(API + "/marketingCenter/deleteArticleById", params)// 删除文章
export const queryArticleList = (data: ArticleListModel) => Post(API + "/marketingCenter/getPageArticle", data) // 文章分页查询

//优惠券
export const couponPage = (data: couponModel) => Post(API + "/coupon/couponPage", data) // 优惠券分页查询

export const channelProduct = (data: couponModel) => Post(API + "/channelProduct/couponProductSelect", data) // 优惠卷条件查询产品选择
export const addCoupon = (data: couponModel) => Post(API + "/coupon/addCoupon", data) // 优惠卷新增
export const editCoupon = (data: couponModel) => Post(API + "/coupon/editCoupon", data) // 优惠卷编辑
export const couponDetail = (data: couponModel) => Get(API + "/coupon/couponDetail", data) // 优惠卷详情接口

export const couponReleasePage = (data: couponModel) => Post(API + "/coupon/couponReleasePage", data) // 优惠卷发放优惠券接口skj/admin/coupon/couponRelease
export const couponReleaseLog = (data: couponModel) => Post(API + "/coupon/releaseLog", data) // 优惠券导入日志接口

//营销活动接口/zskj/admin/activityMarketingChannel/findActivityMarketingChannelsByActivityId
export const findPage = (data: activityModel) => Post(API + "/activityMarketing/findPage", data) // 营销活动分页查询
export const addActivityMarketing = (data: activityModel) => Post(API + "/activityMarketing/addActivityMarketing", data) // 营销活动配置新增
export const activityChannel = (data: activityModel) => Get(API + "/activityMarketingChannel/findActivityMarketingChannelsByActivityMarketingId", data) // 营销活动配置
export const marketingStatus = (data: activityModel) => Post(API + "/activityMarketing/updateActivityMarketingStatus", data) // 营销活动页面编辑状态
export const channelPage = (data: activityModel) => Post(API + "/activityMarketingChannel/findActivityMarketingChannelPage", data) // 查看营销活动页面
export const removeActivity = (params: { id: number }) => Get(API + "/activityMarketing/removeActivityMarketing", params) // 删除营销活动页面
export const findActivity = (params: { id: number }) => Get(API + "/activityMarketing/findActivityMarketingById", params) // 回显编辑营销活动页面

export const updateActivityMarketing = (data: activityModel) => Post(API + "/activityMarketing/updateActivityMarketing", data) // 编辑营销活动

export const marketingJoinLog = (data: activityModel) => Post(API + "/activityMarketing/marketingActivityJoinLog", data) // 活动参与


