export interface SetArrtType {
    addFormData: {
        component: string,
        sort: undefined | number,
        perms: string,
        path: string,
        parentId: undefined | number,
        menuType: undefined | number,
        menuName: string,
        isFrame: string,
        icon: string,
        enable: undefined | number,
        createUser: string,
        id?: undefined | number
    }
}

export interface ItemChildrenType {
    component: string
    createTime: string
    icon: string
    enable: boolean
    id: number
    isFrame: string
    menuName: string
    menuType: number
    parentId: number
    path: string
    visible: string
    perms: string
    sort: number
    children: ItemChildrenType | null
}