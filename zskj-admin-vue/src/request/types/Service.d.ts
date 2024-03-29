export interface ServiceModel {
    checkCount?: number
    checkInterval?: number
    checkType?: string
    checkName?: string
    id?: number
    createTime?: string
    createUser?: string
    interveneCycle?: number
    isDelete?: number
    isIntervene?: number
    remark?: string
    servName?: string
    servStatus?: number
    updateTime?: string
    updateUser?: string
}
export interface QueryServiceModel {
    checkCount?: number
    checkInterval?: number,
    checkType?: string
    checkName?: string
    createTime?: string
    interveneCycle?: number
    createUser?: string
    isDelete?: number
    isIntervene?: number
    remark?: string
    servName?: string
    servStatus?: number
    updateTime?: string
    updateUser?: string
}

export interface ServiceTypeModel {
    createTime?: string
    createUser?: string
    id?: number
    isDelete?: number
    prodIdList?: number[]
    remark?: string
    servTypeName?: string
    servTypeOrder?: number
    servTypeStatus?: number
    updateTime?: string
    updateUser?: string
}

export interface QueryServiceTypeModel {
    createTime?: string
    createUser?: string
    id?: number
    isDelete?: number
    pageNum: number
    pageSize: number
    remark?: string
    servTypeName?: string
    servTypeOrder?: number
    servTypeStatus?: number
}


export interface ServiceProdModel {
    createUser?: string
    detailPic?: string
    id?: number
    isDelete?: number
    mainPic?: string
    playPicList?: number[]
    prodCode?: string
    prodDescribe?: string
    prodName?: string
    prodPrice?: number
    prodSold?: number
    prodStatus?: number
    prodStock?: number
    realPrice?: number
    remark?: string
    servId?: number
    showSold?: number
    updateUser?: string
    equityId?: number
}
export interface QueryServiceProdModel {
    createTime?: string
    createUser?: string
    isDelete?: number
    pageNum: number
    pageSize: number
    prodCode?: string
    prodDescribe?: string
    prodName?: string
    prodPrice?: number
    prodSold?: number
    prodStatus?: number
    prodStock?: number
    realPrice?: number
    remark?: string
    servId?: number
    showSold?: number
    updateTime?: string
    updateUser?: string
}



export interface serviceList {
    prodName?: string
    prodCode?: string
    prodStatus?: number
    pageNum: number
    pageSize: number
}


export interface ServiceAddRecomdModel {
    channel?: string
    channelId?: number
    createTime?: string
    createUser?: string
    isDelete?: number
    order?: number
    recomName?: string
    relaCount?: number
    relaIdList?: number[]
    remark?: string
    status?: number
}

export interface ServiceRecomdModel {
    channel?: string
    channelId?: number
    createTime?: string
    createUser?: string
    isDelete?: number
    orderNumber?: number
    recomName?: string
    relaCount?: number
    relaIdList?: number[]
    remark?: string
    status?: number
    pageNum: number
    pageSize: number
}


export interface ServiceProductModel {
    channelName?: string
    channelType?: number
    createTime?: string
    createUser?: string
    id?: number
    isDelete?: number
    prodCount?: number
    relaIdList?: any[]
    remark?: string
    updateTime?: string
    updateUser?: string
    status?: number
    pageNum?: number
    pageSize?: number
}
export interface ServiceQueryProductModel {
    channelName?: string
    channelType?: number
    createTime?: string
    createUser?: string
    isDelete?: number
    prodCount?: number
    relaIdList?: any[]
    remark?: string
    status?: number
    pageNum: number
    pageSize: number
}


export interface ServiceQueryEquityModel {
    activeCount?: number
    channel?: string
    channelCode?: string
    checkInterval?: number
    createTime?: string
    createUser?: string
    equityName?: string
    generateCount?: number
    generateType?: number
    id?: number
    isDelete?: number
    maxGenerate?: undefined
    pageNum?: number
    pageSize?: number
    prodId?: number
    remark?: string
    status?: number
    usedCount?: number
    validity?: number
    pageNum: number
    pageSize: number
}