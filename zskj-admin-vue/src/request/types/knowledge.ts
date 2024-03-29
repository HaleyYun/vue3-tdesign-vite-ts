export interface AddKnowType {
    id?: any
    name?: any
    category?: any
    categoryIdList?: any
    accessUrl?: any
    interventionPlanCategory?: any,
    comboId?: any,
    redirect?: any,
    manufacturer?: any,
    difficulty?: any,
    gameDescription?: any,
    gameType?: any,
    jumpType?: any,
    gameStatus?: any
    categoryName?: any
    gameId?: any
    manufacturerName?: any
    gameDesc?: any
    redirectType?: any
    redirectUrl?: any
    gameName?: any
    rememberWeight?:any                                                
    executeWeight?:any                                                
    seeWeight?:any                                                
    countWeight?:any,
    speakWeight?:any,
    isDefault?:any,
    enable?:any,
}


export interface EditKnowType {
    id?: number
    updateUser?: string
}

export interface KnowListType {
    name?: string
    nickName?: string
    phone?: string
    pageNum: number
    pageSize: number
}

export interface UploadType {
    fileUrl: any
}

export interface AddKnowDetails {
    id?: any
    categoryIds?: any
    comboName?: any
    comboImage?: any
    relatedIds?: any
    interventionPlanCategory?: any
    comboId: any
    knowledgeType?: any
    categoryIdList?: any
    cateryIdList?: any

}

export interface SportsListType {
    id?: any
    categoryIds?: any
    comboName?: any
    comboImage?: any
    relatedIds?: any
    interventionPlanCategory?: any
    comboId: any
    knowledgeType?: any

}

export interface AddData {
    comboId: '',
    id: ''
    accessUrl?: string
    category?: string
    categoryName?: string
    name?: string
    videoDTOS?: {
        id: number,
        count: number,
        description: string,
        videoSequence: number,
        videoUrl: string,
        videoArr: any
    },

}
export interface foodData {
    pageNum: number
    pageSize: number
}

export interface addFood {
    calcium?: string | number
    carbohydrates?: string | number
    carotene?: string | number
    category?: string | number
    cholesterol?: string | number
    dietaryFiber?: string | number
    fat?: string | number
    heat?: string | number
    id?: string | number
    imgUrl?: string
    iron?: string | number
    magnesium?: string | number
    manganese?: string | number
    name?: string
    niacin?: string | number
    phosphorus?: string | number
    protein?: string | number
    retinolEquivalent?: string | number
    riboflavin?: string | number
    selenium?: string | number
    sodium?: string | number
    thiamine?: string | number
    unit?: string
    vitaminA?: string | number
    vitaminC?: string | number
    vitaminE?: string | number
    weight?: string | number
    zinc?: string | number
    addRequest?: any
}



export interface foodPackageModel {
    desc?: string
    id?: number
    ingredientRequests: foodPackageModel[]
    mealCategory?: string,
    mealNutrient?: string,
    mealTime?: string,
    name?: string,
    picUrl?: string,
    steps: steps[]
}
export interface foodPackageModel {
    dietId?: number
    quantity?: number
}
export interface steps {
    details?: string
    url?: string
}
