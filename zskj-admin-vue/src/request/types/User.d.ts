export interface UserAddRoleType {
    createUser?: string
    enable?: number
    name?: string
    nickName?: string
    organizationId?: number | string
    organizationLevel?: number
    passWord?: string
    phone?: string
    roleIds?: number[]
    roles?: string
    sex?: number
}

export interface UserEditRoleType extends UserAddRoleType {
    id?: number
    updateUser?: string
    
}

export interface UserListType {
    name?: string
    nickName?: string
    phone?: string
    pageNum: number
    pageSize: number
}

export interface UserSwitchRoleEnableType {
    id: number
    enable: number
}
export interface Agreement {
    channelSource:number,
    privacyAgreement: string
    serviceAgreement: string
}



