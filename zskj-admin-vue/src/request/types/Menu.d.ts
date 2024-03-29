export interface AddMenuType {
    component?: string
    createUser?: string
    enable?: number
    icon?: string
    isFrame?: string
    menuName?: string
    menuType?: number
    parentId?: number | undefined
    path?: string
    perms?: string
    sort?: number
    visible?: number
}

export interface EditMenuType extends AddMenuType {
    id?: number
    updateUser?: string
}

export interface MenuFindByIdType {
    id: number
}