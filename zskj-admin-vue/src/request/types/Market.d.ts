export interface ArticleListModel {
    theme?: string
    isPublished?: boolean
    recommend?: number
    pageNum: number
    pageSize: number
    status?: number
    categoryName?: string
    articleTypeList: number[]
}
export interface ArticleTypeModel {
    statusList: number[]
    categoryName?: string
    pageNum: number
    pageSize: number
}
export interface AddArticleModel {
    articleDesc?: string
    articleSource?: string
    articleType?: number
    contentDetails?: string
    mainImage?: string
    playbackNum?: number
    releaseTime?: string
    remark?: string
    theme?: string
    recommend?: number
}
export interface AddArticleTypeModel {
    categoryName?: string
    sort?: number
    status?: number
}
export interface UpdateArticleModel {
    articleDesc?: string
    articleSource?: string
    articleType?: number
    contentDetails?: string
    id?: number
    isDelete?: number
    mainImage?: string
    playbackNum?: number
    releaseTime?: string
    remark?: string
    theme?: string
    recommend?: number
    updateTime?: string
    updateUser?: string
}
export interface UpdateArticleTypeModel {
    categoryName?: string
    id?: number
    status?: number
    sort?: number
}
export interface activityCheckType {
    activityCode?: array
    check?: boolean
    reason: string
}
export interface addActivityType {
    activityCode?: string
    activityCategory?: string
    activityDescribe?: string
    activityName?: string
    activityPeopleNumber?: number
    activityPointList?: array
    activityRule?: string
    activityWay?: string
    beginTime?: string
    endTime?: string
    isChannel?: boolean
    mainPicture?: string
    organCode?: string
    organName?: string
    playPicture?: array
    productCode?: string
    productName?: string
}
export interface enterListPageQueryType {
    activityCode?: string
    enterTimeBegin?: string
    enterTimeEnd?: string
    joinTimeBegin?: string
    joinTimeEnd?: string
    name?: string
    phone?: string
    status?: number
    ticketsCode?: string
    pageNum?: number
    pageSize?: number
}
export interface findByCodeType {
    activityCategory?: string
    activityCode?: string
    activityName?: string
    enterNumberMax?: number
    enterNumberMin?: number
    joinNumberMax?: number
    joinNumberMin?: number
    organName?: string
    productName?: string
    pageNum?: number
    pageSize?: number
}
export interface findDetailType {
    code?: string
}
export interface pointsListType {
    activityCode?: string
    address?: string
    latitude?: number
    longitude?: number
    pageNum?: number
    pageSize?: number
    phone?: number
}
export interface pageQueryType {
    pageNum?: number
    pageSize?: number
    parentOrganNum?: string
}

export interface couponModel {
    pageNum?: number
    pageSize?: number
    id?: number
    couponName?: string
    couponType?: string
    status?: string
    validDays?: string
    channelCode?: string
}
export interface activityModel {
    pageNum?: number
    pageSize?: number
    id?: number
    couponName?: string
    couponType?: string
    status?: string | number
    validDays?: string
    channelCode?: string
    activityId?: string | number | null
    activityMarketingId?: string | number | null
}