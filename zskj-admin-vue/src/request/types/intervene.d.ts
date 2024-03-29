export interface IntervenListType {
    contactNumber?: string
    customerName?: string
    customerSource?: string
    interventionEnd?: string
    interventionStart?: string
    status?: string
    healthRecordNumber?: string
    pageNum: number
    pageSize: number
}

export interface UpdateTrainingType {
    id: number | string
    interventionEnd: string
    interventionStart: string
}

export interface QueryTemplateType {
    templateName: string
}

export interface SaveTemplateType {
    templateName: string
    weekPlanInfoDTO: weekPlanInfoDTOType[]
}

interface weekPlanInfoDTOType {
    accessUrl: string
    category: string
    categoryName?: string
    count: number
    interventionKnowledgeType?: string
    knowledgeBaseId?: number
    recommendDate?: string
    relatedContent?: string
    templatePlanId?: number
    timePoint?: string
}

export interface UpdateDTOItem {
    baseInfoDTOList: BaseInfoDTOListItem[]
    id: number
}

export interface BaseInfoDTOListItem {
    accessUrl?: string | number
    category?: string | number
    categoryName?: string | number
    count?: string | number
    knowledgeBaseId?: string | number
    knowledgeType?: string | number
    relatedContent?: string | number
}

// interface baseInfoDTOList {
//     accessUrl: string
//     category: string
//     categoryName: string
//     count: string | number
//     knowledgeBaseInfoId: string | number
//     knowledgeType: string
//     relatedContent: string
// }

interface userAttendanceListData {
    archivesNo: string
    currentInterventionOrderNum: string
    weekPlanId: string | number
    weekStartDay: string
}

export interface updateDailyAdviceType {
    interventionOrderNumber: string
    weekSequence: string
    echoOrderInfoResponseList: baseWeekPlanUpdateListType[]
}
export interface baseWeekPlanUpdateListType {
    gamesList: gamesListType[]
    recipesList: recipesListType[]
    sportsResponseList: sportsResponseListType[]
    recommendDate: string
}
export interface gamesListType {
    accessUrl: string
    gameCount: number
    gameName: string
    gameType: string
    id: number
}
export interface recipesListType {
    id: number
    mealTime: string
    picUrl: string
    recipesCount: number
    recipesName: string
    recipesType: string
}
export interface sportsResponseListType {
    accessUrl: string
    id: number
    sportsCount: number
    sportsName: string
    sportsType: string
}

export interface selectAllItemListType {
    id?: number
    accessUrl?: string
    sportsCount?: number
    sportsName?: string
    sportsType?: string
    mealTime?: string
    picUrl?: string
    recipesCount?: number
    recipesName?: string
    recipesType?: string
    gameCount?: number
    gameName?: string
    gameType?: string
    relatedContent?: string
    type?: ""
    knowledgeBaseId?: number
}

