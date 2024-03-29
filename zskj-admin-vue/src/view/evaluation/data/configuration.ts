export const tableColumns = [
    {
        title: '评估编号',
        colKey: 'estimateNum',
        width: '220px',
        align: 'center'
    },
    {
        title: '客户姓名',
        colKey: 'customName',
        width: '140px',
        align: 'center'
    },
    {
        title: '联系电话',
        colKey: 'customPhone',
        width: '130px',
        align: 'center'
    },
    // {
    //     title: '评估分类',
    //     colKey: 'type',
    //     slots: { customRender: 'type' },
    // },
    {
        title: '项目名称',
        colKey: 'prodName',
        width: '120px',
        align: 'center'

    },
    {
        title: '项目类型',
        colKey: 'type',
        width: '120px',
        slots: { customRender: 'type' },
        align: 'center'
    },

    {
        title: '客户来源',
        colKey: 'customOrigin',
        width: '250px',
        align: 'center'
    },

    {
        title: '评估员',
        colKey: 'assessor',
        width: '120px',
        align: 'center'
    },
    {
        title: '评估状态',
        colKey: 'status',
        width: '220px',
        align: 'center',
        slots: { customRender: 'status' },
    },
    {
        title: '评估结果',
        colKey: 'risk',
        width: '140px',
        align: 'center'
    },
    {
        title: '评估时间',
        colKey: 'estimateTime',
        width: '180px',
        align: 'center'
    },
    {
        title: '操作',
        colKey: 'action',
        align: 'center',
        width: 140, fixed: 'right',
        slots: { customRender: 'action' },
    },


]
//眼动
export const cognizeColumns = [
    {
        title: '名称',
        colKey: 'name',
    },
    {
        title: '结果',
        colKey: 'referValue',
        slots: { customRender: 'parameter' },
    },
    {
        title: '单位',
        colKey: 'valueUnit',
    },
    {
        title: '参考值/分',
        colKey: 'value',
    },

]
//眼动data 
export const cognizeData = [
    {
        name: '注意能力',
        result: '67',
        minute: '2',
        refer: '体重（BMI）',
    },
    {
        name: '执行能力',
        result: '女',
        minute: '1',
        refer: '血压',
    },
    {
        name: '记忆能力',
        result: '大学及以上',
        minute: '1',
        refer: '血脂',
    },
]
//抑郁
export const depressedColumns = [
    {
        title: '风险因素',
        colKey: 'riskFactor',
    },
    {
        title: '参数',
        colKey: 'parameter',
        slots: { customRender: 'parameter' },
    },
    {
        title: '结果',
        colKey: 'result',
        slots: { customRender: 'result' },
    },

]
//脑健康
export const decColumns = [
    {
        title: '名称',
        colKey: 'name',
    },
    {
        title: '结果',
        colKey: 'executionStr',
    },
    {
        title: '单位/分',
        colKey: 'score',
    },
    {
        title: '参考值/分',
        colKey: 'referenceValue',
    },

]
export const reportColumns = [
    {
        title: '结果',
        colKey: 'result',
    },
    {
        title: '得分',
        colKey: 'score',
    },
    {
        title: '用时',
        colKey: 'duration',
    },
    {
        title: '错误数',
        colKey: 'errorNum',
    },

]
// 这是抑郁mock 数据以后对接口会删掉
export const depressedData = [
    {
        name: '注意能力',
        result: '67',
        minute: '2',
        refer: '体重（BMI）',
    },
    {
        name: '执行能力',
        result: '女',
        minute: '1',
        refer: '血压',
    },
    {
        name: '记忆能力',
        result: '大学及以上',
        minute: '1',
        refer: '血脂',
    },
]

// 这是mock 数据以后对接口会删掉
export const MockTableData = [
    {
        id: 29903,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 23333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 2333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 23333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 2333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 29333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 2933,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 3333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 2993,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
    {
        id: 23333,
        name: '姜天龙',
        phone: '1568888888',
        type: '游戏',
        class: '认知证评估',
        project: '精筛服务',
        correlation: '服务产品名称',
        source: 'xx机构',
        assessor: '张三',
        status: '待评估',
        result: '正常',
        time: '2023-05-29 15:30',
    },
]

//被评估人
export const evaluatedColumns = [
    {
        title: '姓名',
        colKey: 'name',
    },
    {
        title: '年龄',
        colKey: 'years',
    },
    {
        title: '联系电话',
        colKey: 'phone',
    },
    {
        title: '性别',
        colKey: 'sex',
    },
    {
        title: '文化程度',
        colKey: 'culture',
    },
    {
        title: '渠道',
        colKey: 'channel',
    },
]
// 这是mock 数据以后对接口会删掉
export const evaluatedData = [
    {
        name: '王天龙',
        phone: '1568888888',
        years: '28',
        sex: '男',
        culture: '本科',
        channel: '保司',

    }
]
//统计
export const chartColumns = [
    // { colKey: 'serial-number', title: '序号' },
    {
        title: '项目',
        colKey: 'name',
    },
    {
        title: '结果',
        colKey: 'value',
    },
    {
        title: '参考',
        colKey: 'referValue',
    },

    {
        title: '单位',
        colKey: 'valueUnit',
        slots: { customRender: 'valueUnit' },
    },
    {
        title: '图表',
        colKey: 'action',
        slots: { customRender: 'action' },
        width: 140,
        align: 'center',
    },


]
//回放
export const palyColumns = [
    { colKey: 'serial-number', title: '序号' },
    {
        title: '项目',
        colKey: 'videoName',
    },
    {
        title: '图表',
        colKey: 'action',
        slots: { customRender: 'action' },
        width: 140,
        align: 'center',
    },

]

export const palyData = [
    {
        videoName: '抑郁报告',
        videoPath: "https://flv3.bn.netease.com/63e1edcabe7657104d45adae9c984ea83c844b9314f573055d1376474738a4e1c30d1324f20c6dd7e60462c30df1979dca8d7a2b6a9fdca8db8f31a62b3f81bbae22c319e4b1950770caffe324e9f3cb654808d94f07ab4679532d90bc469a5dadf652995fd4d576ea462999a1e28a6435f208c70df7bac5.mp4"
    },
    {
        videoName: '认知报告',
        videoPath: "https://www.w3schools.com/html/movie.mp4"
    }
]
// 这是mock 数据以后对接口会删掉
export const chartData = [
    {
        estimateNum: '抑郁报告',
        customName: '236',
        customPhone: '500',
        itemName: 'ms',
    },
    {
        estimateNum: '认知报告',
        customName: '91.22',
        customPhone: '202',
        itemName: '%',
    }
]
export const Data = {
    code: 0,
    data: {
        estimateInfoResponse: {
            assessor: "",
            customOrigin: "",
            estimateNum: "",
            estimateServerType: "",
            estimateTime: "",
            remark: "",
            type: 0
        },
        eyeReport: {
            attentionResult: {
                attention: 0,
                attentionStr: "",
                referenceValue: "",
                unit: ""
            },
            executionResult: {
                errorNum: 0,
                execution: 0,
                executionStr: "",
                referenceValue: "",
                rightNum: 0,
                score: "",
                unit: ""
            },
            eyeImageResult: {
                delayTime: "",
                errorNum: 0,
                referenceDelayTime: "",
                rigthNum: 0
            },
            eyeMovementResult: {
                gazeTime: "",
                newImageTime: "",
                oldImageTime: "",
                referenceGazeTime: ""
            },
            memoryResult: {
                errorNum: 0,
                memory: 0,
                memoryStr: "",
                referenceValue: "",
                rightNum: 0,
                score: "",
                unit: ""
            },
            riskScore: ""
        },
        scaleReport: {
            gazeTime: "",
            negativeEmotionsResult: {
                referenceValue: "",
                unit: "",
                value: ""
            },
            negativeImageTime: "",
            neutralityTime: "",
            positiveEmotionsResult: {
                referenceValue: "",
                unit: "",
                value: ""
            },
            positiveImageTime: "",
            referenceGazeTime: "",
            riskScore: "",
            sensitiveEmotionsResult: {
                referenceValue: "",
                unit: "",
                value: ""
            }
        },
        smallGameReport: {
            cognition: "",
            executionResult: {
                errorNum: 0,
                execution: 0,
                executionStr: "",
                referenceValue: "",
                rightNum: 0,
                score: "",
                unit: ""
            },
            languageAbilityResult: {
                errorNum: 0,
                languageAbility: 0,
                languageAbilityStr: "",
                referenceValue: "",
                rightNum: 0,
                score: "",
                unit: ""
            },
            memoryResult: {
                errorNum: 0,
                memory: 0,
                memoryStr: "",
                referenceValue: "",
                rightNum: 0,
                score: "",
                unit: ""
            },
            riskStage: "",
            riskchatResults: [
                {
                    key: "",
                    value: ""
                }
            ],
            score: "",
            visualSpaceResult: {
                errorNum: 0,
                referenceValue: "",
                rightNum: 0,
                score: "",
                unit: "",
                visualSpace: 0,
                visualSpaceStr: ""
            }
        }
    },
    msg: "成功"
}