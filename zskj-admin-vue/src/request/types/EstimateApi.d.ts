export interface EstimateOrderType {
    archivesNo?: string | null
    customName?: string
    estimateServeName?: string
    estimateServerType?: number
    organId?: number
    organIds?: number[]
    pageNum?: number
    pageSize?: number
    formArchives: boolean | string
    associatedUsers: string
}
export interface OrderType {
    estimateNum?: any
    type?: any
    archNo?: any
}


export interface resData {
    code: number
    msg: string
    data: {
        report: {
            firCapacityValue: number,
            secCapacityValue: number,
            thirdCapacityValue: number,
            fourthCapacityValue: number,
            firPhotoSduration: number,
            secPhotoDuration: number,
            thirdPhotoDuration: number,
            riskValue: number,
        }
        archiveInfoResponse: {
            age: null | number | string
            education: null | number | string
            name: null | string
            organName: null | string
            phone: null | string
            sex: null | number | string
            birthDay: null | number | string
        }
    }
}