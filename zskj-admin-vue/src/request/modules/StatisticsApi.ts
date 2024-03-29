import { API } from "../config";
import { Post } from "../request";

// getHomeData/getHomeData
export const getHomeData = (data: {} = {}) => Post(API + "/home/index", data) // 首页四大数据统计
export const getWeekTicketsData = (data: {} = {}) => Post(API + "/home/weekTicketsAndSex", data) // 首页工单数量按周查询展示
export const getLineChartData = (data: {} = {}) => Post(API + "/home/lineChart", data) // 首页折线图
export const getStatisticsData = (data: {} = {}) => Post(API + "/statistics/pageQuery", data) // 统计中台列表

export const getEmployeesRanking = (data: {} = {}) => Post(API + "/statistics/employeesRanking", data) // 统计中台员工
