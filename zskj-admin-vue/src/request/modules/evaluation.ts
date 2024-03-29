import { API } from "../config";
import { Get, Post } from "../request";
import { evaluationType } from "../types/evaluation"

export const evaluationList = (data: evaluationType) => Post(API + "/estimateOrder/list", data) // 评估分页查询