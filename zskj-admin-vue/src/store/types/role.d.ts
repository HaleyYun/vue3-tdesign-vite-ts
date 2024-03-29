import { RouteRecordRaw } from 'vue-router'

export interface State {
    routerList: RouteRecordRaw[]
    userInfo: {
        enable?: number
        id?: number
        name?: string
        nickName?: string
        organizationId?: number
        organizationLevel?: number
        organizationName?: any
        organizationNum?: any
        permissions?: string[]
        phone?: string
        roleIds?: number | string[]
        roles?: number | string[]
        sex?: number
    }
}