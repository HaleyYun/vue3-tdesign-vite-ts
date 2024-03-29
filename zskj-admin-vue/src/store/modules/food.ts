import { defineStore } from 'pinia'
export const foodDataStore = defineStore('serv', {
    // 相当于data
    state: () => {
        return {
            id: 0,
            title: "",
            disUpload: false,
            checkList: [] as any,
            foodData: {
                name: "",
                mealCategory: '',
                mealTypeName: "",
                desc: "",
                ingredientRequests: [] as any,
                mealNutrient: [
                    // { type: 'default', showClose: true }
                ],
                mealTime: '1',
                picUrl: "",
            },
            newFoodData: {
                name: "",
                mealCategory: '',
                mealTypeName: "",
                desc: "",
                ingredientRequests: [],
                mealNutrient: [
                    // { type: 'default', showClose: true }
                ],
                mealTime: '1',
                picUrl: "",
            }
        }
    },
    // 相当于计算属性
    getters: {},
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {},
    //数据持久化配置 这里是当前所有变量都持久化
    persist: false
})