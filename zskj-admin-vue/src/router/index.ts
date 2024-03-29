import { createRouter, createWebHashHistory } from "vue-router";
// import roleRouters from "./modules/roleRouters"


let routes = [
    {
        path: '/login',
        name: 'login',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/login/IndexView.vue'),
        meta: {
            title: "登录",
            icon: 'dashboard',
            icon_active: 'index_active',
            role: true,
            tab_show: false,
        }
    },
    {
        path: '/screen',
        name: 'screen',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/screen/Screen.vue'),
        meta: {
            title: "数据大屏",
            icon: 'screen',
            icon_active: 'screen_active',
            role: true,
            tab_show: true,
        },
    },
    // {
    //     path: '/',
    //     name: 'index',
    //     redirect: '/statistics',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../view/index/IndexView.vue'),
    //     meta: {
    //         title: "首页",
    //         icon: 'dashboard',
    //         icon_active: 'index_active',
    //         role: true,
    //         tab_show: true,
    //     },
    //     children: [
    //         {
    //             path: '/statistics',
    //             name: 'statistics',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../view/statistics/StatisticsView.vue'),
    //             meta: {
    //                 title: "首页",
    //                 icon: 'dashboard',
    //                 tab_show: true,
    //                 role: true,
    //             }
    //         }
    //     ],
    // },
    {
        path: '/userInfo',
        name: 'index',
        redirect: '/userCenter',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/index/IndexView.vue'),
        meta: {
            title: "首页",
            icon: 'dashboard',
            icon_active: 'index_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/userCenter',
                name: 'userCenter',
                component: () => import('../view/userCenter/userInfor.vue'),
                meta: {
                    title: "个人中心",
                    icon: 'dashboard',
                    icon_active: 'index_active',
                    role: true,
                    tab_show: false,
                }
            }
        ],
    },
    // {
    //     path: '/userInfo',
    //     name: 'index',
    //     redirect: '/userCenter',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../view/index/IndexView.vue'),
    //     meta: {
    //         title: "首页",
    //         icon: 'dashboard',
    //         icon_active: 'index_active',
    //         role: true,
    //         tab_show: true,
    //     },
    //     children: [
    //         {
    //             path: '/activityList',
    //             name: 'activityList',
    //             component: () => import('../view/marketing/activityList.vue'),
    //             meta: {
    //                 title: "活动列表",
    //                 icon: 'dashboard',
    //                 icon_active: 'index_active',
    //                 role: true,
    //                 tab_show: false,
    //                 examine_show:true,
    //             }
    //         }
    //     ],
    // },
    // ...roleRouters
]
// 路由
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const whiteList = ['/login']
    if ((localStorage.getItem("userinfo") && localStorage.getItem("x-auth-token")) || whiteList.includes(to.path)) {
        next()
    } else {
        sessionStorage.clear();
        localStorage.clear();
        next({
            path: '/login',
            query: {
                code: to.query.code
            }
        })
    }

})

// 导出
export default router 