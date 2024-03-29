export interface employeeType {
    pageNum?: number,
    pageSize?: number,
}
export interface addEmployee {
    pageNum?: number,
    pageSize?: number,
}

export interface MenuFindByIdType {
    id: number
}

export interface getPostList {
    pageNum?: number,
    pageSize?: number,
    posName?:any,
    able?:any,
    organName?:any,
  
}