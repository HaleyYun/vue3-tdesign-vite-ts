import { RouteRecordRaw } from 'vue-router'

interface BreadcrumbOptionType {
    content?: string
}

export interface SetArrt {
    tabList: RouteRecordRaw[]
    collapsed: boolean
    nickName: string
    menuValue: string
    breadcrumbOption: BreadcrumbOptionType[]
    visible:boolean,
    bell:boolean,
    title:number,
    pageQueryList:array,
    timeInter:any,
}