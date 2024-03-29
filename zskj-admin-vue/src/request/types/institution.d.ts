export interface InstitutionListType {
    enable: number | undefined,
    organName: string,
    pageNum: number,
    pageSize: number,
    type: number | undefined,
    typeName: string
    sort: string
}

export interface OrganizationTradeTimeRequestsType {
    amTime: string
    dayTime: number | undefined
    organId?: number | undefined
    pmTime: string
}

export interface AddOrganType {
    address: string
    createUser: string
    description: string
    enable: number | undefined
    label: string
    latitude: string
    longitude: string
    organName: string
    organizationId?: number | undefined
    amTime: string
    pmTime: string
    dayTimes: number | string[]
    phone: string
    remark: string
    score: string
    showEnable: number | undefined | string,
    theme: string
    type: number | undefined | string,
    typeName: string
    updateUser: string
}

export interface UpdateOrganType extends AddOrganType {
    id: number | string
    organNum: string
}
