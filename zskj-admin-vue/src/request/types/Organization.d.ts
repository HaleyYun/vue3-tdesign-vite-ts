export interface AddOrganizationType {
    address?: string
    createUser?: string
    enable?: number
    interfaceSwitch?: number
    latitude?: string
    longitude?: string
    level?: number
    organizationName?: string
    organizationNum?: string
    parentId?: number
    phone?: string
    type?: string
    appLogo?: string
    marketingCover?: string
    marketingVideo?: string
}

export interface EditOrganizationType extends AddOrganizationType {
    id: number
}

export interface OrganizationListType {
    organizationName?: String
    pageNum: number
    pageSize: number
}

export interface OrganizationSwitchRoleEnableType {
    id: number
    enable: number
}


export interface activityConfig {
    id?: number
    keySwitch: number
    key: string
    marketingCover: string
    marketingVideo: string
}

export interface proConfig {
    id?: number
    ids: number[]
    appLogo: string
}