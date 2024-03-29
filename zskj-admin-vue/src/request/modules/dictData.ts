import { API } from "../config";
import { Get } from "../request";

export const dictData = (params: { dictType: string }) => Get(API + "/dictData/type", params) // 通过字典类型查询对应的字典数据列表
