import { defineStore } from 'pinia'
// useMain  可以是 useUser、useCart 之类的名字 
// defineStore('main',{..}) 在devtools 就使用 main 这个名
export const serviceStore = defineStore('serv', {
    // 相当于data
    state: () => {
        return {
            dialogTitle: "",
            checkedData: {
                checkList: [] as any
            },
            serviceData: {
                createTime: "",
                createUser: "",
                id: 0,
                isDelete: 0,
                prodIdList: [],
                pageNum: 1,
                pageSize: 10,
                remark: "",
                servTypeName: "",
                servTypeOrder: 0,
                servTypeStatus: 1,
                updateTime: "",
                updateUser: ""
            },
            searchData: {
                channel: "",
                channelId: 0,
                createTime: "",
                createUser: "",
                isDelete: 0,
                orderNumber: 0,
                recomName: "",
                relaCount: 0,
                relaIdList: [] as any,
                remark: "",
                status: 1,
                pageNum: 1,
                pageSize: 10,
            },
            channelData: {
                channelName: "",
                channelType: 0,
                createTime: "",
                createUser: "",
                id: 0,
                isDelete: 0,
                pageNum: 1,
                pageSize: 10,
                prodCount: 0,
                remark: "",
                status: 1,
                relaChannelList: [] as any,
                relaTypeList: [] as any,
                updateTime: "",
                updateUser: ""
            },
            channelIdList: [] as any,
            eQuityData: {
                activeCount: 0,
                channel: "",
                channelCode: "",
                // channelId: 0,
                checkInterval: undefined,
                validity: undefined,
                createTime: "",
                createUser: "",
                equityName: "",
                generateCount: 0,
                generateType: 0,
                isDelete: 0,
                maxGenerate: undefined,
                prod: [] as any,
                remark: "",
                status: 1,
                usedCount: 0,
                generateName: "",

            },
            eQuityId: 0,

        }
    },
    // 相当于计算属性
    getters: {

    },
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {
        // increment() {
        //   this.counter++
        // },
        // randomizeCounter() {
        //     setTimeout(() => {
        //         this.counter = Math.round(100 * Math.random())
        //     }, 0);
        // },
    },
    //数据持久化配置 这里是当前所有变量都持久化
    persist: false
})