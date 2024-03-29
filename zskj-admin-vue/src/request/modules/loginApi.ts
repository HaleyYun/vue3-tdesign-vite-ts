import { API } from "../config";
import { Get, Post } from "../request";
import { loginType } from "../types/login";

// 登录
export const login = (data: loginType) => Post(API + "/login", data)// 登录
export const getInfo = (params?: {}) => Get(API + "/getInfo", params)// 获取用户信息
export const getRouters = (params?: {}) => Get(API + "/getRouters", params)// 获取用户路由信息
export const logout = (params?: {}) => Post(API + "/logout", params)// 登录


export const getCodeImg = (params?: {}) => Get(API + "/captchaImage", params)// 获取验证码图片




