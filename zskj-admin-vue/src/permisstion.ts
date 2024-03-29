//路由守卫
import router from '@/router'
import { customStore } from '@/store/modules/custom'
router.beforeEach(async (to: any, from: any, next: any) => {
    // console.log(to);
    console.log(from);
    const custom = customStore()
    if(from.path!='/customDetails'&&from.path!='/custom'){
        next()
        custom.searchData = {
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
        custom.dateValue =  []
        custom.estimateTimeValue = []
    }else{
        next()
    }
    
})