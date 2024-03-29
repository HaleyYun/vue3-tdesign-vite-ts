import { $API, API } from "../config";
import { Get, Post } from "../request";
import { KnowListType, AddKnowType, UploadType, AddKnowDetails, SportsListType, AddData, foodData, addFood, foodPackageModel } from "../types/knowledge"
//  AddKnowType, EditKnowType,
export const knowList = (data: KnowListType) => Post(API + "/knowledgeBaseInfo/diet/page", data) // 膳食分页列表
export const knowAddList = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/diet/save", data) // 膳食增加
export const upload = (data: UploadType) => Post(API + "/common/upload", data) // 上传
export const knowEditList = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/diet/update", data) // 膳食编辑
export const knowDelList = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/diet/delete", data) // 膳食删除
export const knowDetails = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/combo/save", data) // 膳食详情新增
export const knowComboList = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/combo/list", data) // 膳食套餐
export const knowDict = (params: { dictType: any }) => Get(API + "/dictData/type/", params) // 查询套餐分类
export const knowDelComboList = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/combo/delete", data) // 膳食套餐删除
export const knowDelEditList = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/combo/edit", data) // 膳食套餐编辑
export const knowInfoList = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/combo/query", data) // 查询已选中id的膳食


//认知接口
export const cognitiveList = (data: KnowListType) => Post(API + "/knowledgeBaseInfo/game/page", data) // 认知分页列表
export const cognitiveAdd = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/game/save", data) // 认知新增
export const cognitiveDel = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/game/delete", data) // 认知删除
export const cognitiveEdit = (data: AddKnowType) => Post(API + "/knowledgeBaseInfo/game/update", data) // 认知编辑


//运动健康
export const sportsPageList = (data: { pageNum: Number, pageSize: Number }) => Post(API + "/knowledgeBaseInfo/sports/page", data) // 运动分页列表
export const addSports = (data: AddData) => Post(API + "/knowledgeBaseInfo/sports/save", data) // 新增运动
export const updateSports = (data: AddData) => Post(API + "/knowledgeBaseInfo/sports/update", data) // 修改运动
export const sportData = (data: { id: number }) => Get(API + "/knowledgeBaseInfo/sports/query", data) // 单条查询运动
export const delSports = (data: { id: number }) => Post(API + "/knowledgeBaseInfo/sports/delete", data) // 删除运动
// export const addSports = (data: AddData) => Post(API + "/knowledgeBaseInfo/sports/save", data) // 新增运动
export const addSportsDetails = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/combo/save", data) // 运动详情新增
export const sportsInfoList = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/sportsCombo/query", data) // 查询已选中id的运动
export const updateSportsDetails = (data: AddKnowDetails) => Post(API + "/knowledgeBaseInfo/combo/edit", data) // 运动详情修改
export const sportsDelComboList = (data: { id: number }) => Post(API + "/knowledgeBaseInfo/combo/delete", data) // 膳食套餐删除

// 膳食8.10迭代
export const addUpdatefood = (data: foodPackageModel) => Post(API + "/knowledgeBaseInfo/addRecipeService", data) // 新增编辑菜品
export const deletefood = (data: { id: string }) => Get(API + "/knowledgeBaseInfo/deleteRecipeService", data) // 删除菜品
export const queryfoodList = (data: {}) => Post(API + "/knowledgeBaseInfo/pageRecipeService", data) // 膳食列表查询
export const queryfoodId = (data: { id: number }) => Get(API + "/knowledgeBaseInfo/queryById", data) // 菜谱通过ID查询单条数据



export const foodList = (data: foodData) => Post(API + "/knowledgeBaseInfo/pageIngredient", data) // 膳食食材列表
export const addIngredient = (data: addFood) => Post(API + "/knowledgeBaseInfo/addIngredient", data) // 新增食材和编辑食材
export const viewIngredient = (data: { id: string }) => Get(API + "/knowledgeBaseInfo/ingredient/one", data) // 查看反显食材
export const delIngredient = (data: { id: string }) => Get(API + "/knowledgeBaseInfo/delIngredient", data) // 删除食材
