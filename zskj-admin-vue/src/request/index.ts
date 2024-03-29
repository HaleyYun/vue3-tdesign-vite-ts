import axios from 'axios'
import { API_URL, OUT_TIME } from './config'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import router from '@/router'
import { LoadingPlugin } from 'tdesign-vue-next';

// 创建axios实例
const request = axios.create({
    baseURL: API_URL,// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: OUT_TIME, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie
    headers: {
        'Content-Type': 'application/json',//'Access-Control-Allow-Origin'
        'X-Requested-With': 'XMLHttpRequest',
    },
})
// 重新登录弹窗
let reloginShow = true;
// request拦截器
request.interceptors.request.use(
    config => {
        // LoadingPlugin(true);
        // 如果你要去localStor获取token
        let token = localStorage.getItem("x-auth-token");
        if (token && config.url != "/zskj/admin/login" && config.url != "/zskj/admin/captchaImage") {
            // 添加请求头
            config.headers["token"] = token
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)

// response 拦截器
request.interceptors.response.use(
    response => {
        // LoadingPlugin(false);
        // 对响应数据做点什么
        if (response.status == 403) {
            localStorage.clear();
            sessionStorage.clear();
            router.push("/login")
            MessagePlugin.warning("登录过期请重新登录");
        }
        if (response.data.code != 200) {
            switch (response.data.code) {
                case 405:
                    if (reloginShow) {
                        reloginShow = false
                        const confirmDia = DialogPlugin({
                            header: '登录过期',
                            body: '登录过期请重新登录！',
                            confirmBtn: '前往登录',
                            onConfirm: () => {
                                reloginShow = true;
                                localStorage.clear();
                                sessionStorage.clear();
                                router.push("/login")
                                confirmDia.hide();
                            },
                            onClose: () => {
                                reloginShow = true;
                                confirmDia.hide();
                            },
                        })
                    }
                    break;
                case 403:
                    localStorage.clear();
                    sessionStorage.clear();
                    router.push("/login")
                    MessagePlugin.warning(response.data.msg);
                    break;
                default:
                    MessagePlugin.warning(response.data.msg);
            }
        }
        return response.data
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)
export default request