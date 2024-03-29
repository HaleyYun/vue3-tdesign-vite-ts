import { API } from "../config";
import { Post } from "../request";


// dataScreen/getDataScreen
export const getScreenData = (data: {} = {}) => Post(API + "/dataScreen/getDataScreen", data) // 数据大屏