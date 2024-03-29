export interface customEquityModel {
    activeCode?: string
    applicantId?: number
    applicantName?: string
    applicantPhone?: string
    channelCode?: string
    channelId?: number
    coverageType?: string
    createTime?: string
    createUser?: string
    effectiveDate?: string
    id?: number
    importBatchCode?: string
    insuredId?: number
    insuredName?: string
    insuredPhone?: string
    isDelete?: boolean
    policyNumber?: string
    importDateBegin?: string,
    importDateEnd?: string,
    remark?: string
    updateTime?: string
    updateUser?: string
    pageNum: number
    pageSize: number
}

export interface logPageQueryModel {
    importDateBegin?: string
    importDateEnd?: number
    pageNum: number
    pageSize: number
}

export interface codePageModel {
    phone?: string
    prodCode?: string
    pageNum: number
    pageSize: number
}