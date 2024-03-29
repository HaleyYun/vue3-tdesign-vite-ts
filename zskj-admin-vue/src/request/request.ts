import request from "./index";

export const Get = (url: string, params: any) => request.get(url, { params: params });

export const Post = (url: string, data: any) => request.post(url, data);

export const PostParams = (url: string) => request.post(url);

export const Put = (url: string, data: any) => request.put(url, data);

export const Delete = (url: string, data: any) => request.delete(url, data);