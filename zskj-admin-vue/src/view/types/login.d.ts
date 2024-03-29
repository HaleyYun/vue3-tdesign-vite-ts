export interface loginResType {
    code: number
    msg: string
    data: {
        token: string
    }
}

export interface routersResData {
    alwaysShow?: boolean
    hidden: boolean
    component: string
    redirect: string
    path: string
    menuName: string
    meta?: routersResDataMeat
    children?: routersResData[]
}
export interface routersResDataMeat {
    noCache?: boolean
    link?: string
    icon?: string
    title?: string
}