import { defineStore } from 'pinia'
// useMain  可以是 useUser、useCart 之类的名字 
// defineStore('main',{..}) 在devtools 就使用 main 这个名
import { State } from '../types/role'
import router from '../../router/index'
import { routersResData } from "../../view/types/login"
import { RouteRecordRaw } from 'vue-router'
import { getRouters } from "../../request/modules/loginApi"
import { MessagePlugin } from "tdesign-vue-next"
import roleRouters from "../../router/modules/roleRouters"

export const useRoleStore = defineStore('role', {
    // 相当于data
    state: (): State => {
        return {
            // 所有这些属性都将自动推断其类型,如果推断失败可以试下 as xxx
            routerList: [],
            userInfo: {}
        }
    },
    // 相当于计算属性
    getters: {
        getRouterList(): State["routerList"] {
            let arr: State["routerList"]
            function arrhandle(arr: State["routerList"]): State["routerList"] {
                let routerList: State["routerList"] = []
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].children && (arr[i].children as State["routerList"])?.length > 0) {
                        arr[i].children = arrhandle(arr[i].children as State["routerList"])
                    }
                    if (arr[i].meta!.tab_show) {
                        routerList.push(arr[i])
                    }
                }
                return routerList
            }
            arr = arrhandle(this.routerList)
            arr = arr.filter(item => (item.children as State["routerList"])?.length > 0 || item.path === '/screen')// 兼容数据大屏
            return arr
        }
    },
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {
        SetRouterList() {
            getRouters().then((routersRes: any) => {
                if (routersRes.code === 200) {
                    if (routersRes.data.length == 0) {
                        MessagePlugin.warning("请联系管理员分配权限")
                        return
                    }
                    // this.routerList = this.HandleRouteRecordRaw(routersRes.data);
                    // debugger
                    // this.mergeList(roleRouters, this.routerList);
                    this.routerList = this.mergeList(roleRouters, this.HandleRouteRecordRaw(routersRes.data));
                    console.log("routerList", this.routerList, roleRouters)
                    this.routerList.forEach((route: RouteRecordRaw) => {
                        router.addRoute(route)
                    })
                    router.replace(this.routerList[0].path)
                }
            })
        },
        HandleRouteRecordRaw(routers: routersResData[]): RouteRecordRaw[] {
            const modules = this.HandleModules()
            // console.log("modules", modules)
            let routerList: RouteRecordRaw[] = []
            for (let i = 0; i < routers.length; i++) {
                const dir = '../../view' + routers[i].component + '.vue';
                let obj: RouteRecordRaw = {
                    path: routers[i].path,
                    name: routers[i].menuName,
                    redirect: routers[i].redirect,
                    component: modules[dir],
                    meta: {
                        title: routers[i].meta!.title,
                        icon: routers[i].meta!.icon,
                        tab_show: !routers[i].hidden
                    },
                    children: []
                }
                if (routers[i].children && routers[i].children!.length > 0) {
                    obj.children = this.HandleRouteRecordRaw(routers[i].children as routersResData[])
                }
                routerList.push(obj)
            }
            return routerList
        },
        mergeList(roleRouters: RouteRecordRaw[], routerList: RouteRecordRaw[]): RouteRecordRaw[] {
            for (let i = 0; i < roleRouters.length; i++) {
                let index = routerList.findIndex(item => item.path === roleRouters[i].path);
                if (index === -1) {
                    routerList.push(roleRouters[i]);
                } else {
                    if (roleRouters[i]?.children && (roleRouters[i].children as RouteRecordRaw[])?.length > 0) {
                        for (let k = 0; k < (roleRouters[i].children as RouteRecordRaw[]).length; k++) {
                            (routerList[index].children as RouteRecordRaw[]).push((roleRouters[i].children as RouteRecordRaw[])[k]);
                        }
                    }
                }
            }
            return routerList
        },
        HandleModules() {
            return import.meta.glob('../../view/**/*.vue')
        },
        SetUserInfo(userInfo: State["userInfo"]) {
            this.userInfo = userInfo
        }
        // const modules = import.meta.glob('./../view/**/*.vue')
    },
    //数据持久化配置 这里是当前所有变量都持久化
    persist: true
})