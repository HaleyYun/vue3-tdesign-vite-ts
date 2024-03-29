export interface GetBasePageListType {
    associatedUsers?: string | number
    associatedUsersSource?: string
    beginAge?: number | undefined
    beginCreateDate?: string
    education?: string
    endAge?: number | undefined
    endCreateDate?: string
    name?: string
    pageNum?: number
    pageSize?: number
    phone?: string
    sex?: number | string
}

export interface GetWechatUserPageListType {
    birthday?: string
    city?: string
    country?: string
    gender?: number | undefined
    nickname?: string
    pageNum?: number | undefined
    pageSize?: number | undefined
    phone?: string
    province?: string
    beginBirthday?: string
    endBirthday?: string
}