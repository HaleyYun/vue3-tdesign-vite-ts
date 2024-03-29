import { defineStore } from 'pinia'
export const customStore = defineStore('serv', {
    // 相当于data
    state: () => {
        return {
            searchData: {
                name: '',
                channel: '',
                sex: '',
                phone: '',
                beginCreateDate: '',
                endCreateDate: '',
                education: '',
                beginAge: undefined,
                endAge: undefined,
                estimateStartTime: '',
                estimateEndTime: '',
                assessorSearch: '',
                pageNum: 1,
                pageSize: 10
            },
            dateValue: [],
            estimateTimeValue: [],
        }
    },
    // 相当于计算属性
    getters: {},
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {},
    //数据持久化配置 这里是当前所有变量都持久化
    persist: false
})