export interface RoleListType {
    beginTime?: string
    endTime?: string
    roleName?: string
    roleNameCn?: string
    enable?: number
    pageNum: number
    pageSize: number
}

export interface RoleSwitchRoleEnableType {
    id: number
    enable?: number
}

export interface RoleAddRoleType {
    enable: number
    menuIds: number[]
    organizationId: number
    roleAuthority: string
    roleName: string
    roleNameCn: string
    roleSort: number
}

export interface RoleEditRoleType {
    id: number,
}

export interface Info {
    nickName:string,
    phone:string,
    sex:number
}
export interface PassWord {
    oldPassWord:string,
    passWord:string,
    confirmPassWord:string
}
export interface personinfo {
    id:number
}




