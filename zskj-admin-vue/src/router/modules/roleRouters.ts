const roleRouters = [
    // {
    //     path: '/',
    //     name: 'index',
    //     redirect: '/statistics',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../../view/index/IndexView.vue'),
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
    //             component: () => import('../../view/statistics/StatisticsView.vue'),
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
        path: '/intervene',
        name: 'intervene',
        redirect: '/interveneDefault',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "干预中台",
            icon: 'dashboard',
            icon_active: 'intervene_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/InterveneDetails',
                name: 'InterveneDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/intervene/InterveneDetails.vue'),
                meta: {
                    title: "干预详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/InterveneModify',
                name: 'InterveneModify',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/intervene/InterveneModify.vue'),
                meta: {
                    title: "干预方案",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            }
        ],
    },
    {
        path: '/user',
        name: 'user',
        redirect: '/custom',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "客户管理",
            icon: 'dashboard',
            icon_active: 'custom_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/customDetails',
                name: 'customDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/custom/CustomDetails.vue'),
                meta: {
                    title: "客户详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/weChatDetails',
                name: 'weChatDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/custom/WeChatDetails.vue'),
                meta: {
                    title: "微信详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },
    {
        path: '/service',
        name: 'service',
        redirect: '/ServiceView',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "服务中台",
            icon: 'dashboard',
            icon_active: 'service_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/ServiceEdit',
                name: 'ServiceEdit',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/service/ServiceEdit.vue'),
                meta: {
                    title: "新增产品",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/EquityServiceDetails',
                name: 'EquityServiceDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/service/EquityServiceDetails.vue'),
                meta: {
                    title: "权益服务详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/serviceNewProduct',
                name: 'ServiceNewProduct',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/service/ServiceNewProduct.vue'),
                meta: {
                    title: "新增渠道产品",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },
    // {
    //     path: '/channelList',
    //     name: 'channelIndex',
    //     redirect: '/channel',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../../view/index/IndexView.vue'),
    //     meta: {
    //         title: "渠道管理",
    //         icon: 'dashboard',
    //         icon_active: 'channel_active',
    //         role: true,
    //         tab_show: true,
    //     },
    //     children: [
    //         {
    //             path: '/channel',
    //             name: 'channel',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../../view/channel/ChannelView.vue'),
    //             meta: {
    //                 title: "渠道管理",
    //                 icon: 'dashboard',
    //                 role: true,
    //                 tab_show: true,
    //             }
    //         },
    //     ],
    // },
    // {
    //     path: '/personnelList',
    //     name: 'personnelIndex',
    //     redirect: '/personnel',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../../view/index/IndexView.vue'),
    //     meta: {
    //         title: "员工管理",
    //         icon: 'dashboard',
    //         icon_active: 'personnel_active',
    //         role: true,
    //         tab_show: true,
    //     },
    //     children: [
    //         {
    //             path: '/personnel',
    //             name: 'personnel',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../../view/personnel/PersonnelView.vue'),
    //             meta: {
    //                 title: "员工管理",
    //                 icon: 'dashboard',
    //                 role: true,
    //                 tab_show: true,
    //             }
    //         },
    //         {
    //             path: '/position',
    //             name: 'position',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../../view/personnel/PositionView.vue'),
    //             meta: {
    //                 title: "岗位管理",
    //                 icon: 'dashboard',
    //                 role: true,
    //                 tab_show: true,
    //             }
    //         },
    //     ],
    // },
    // {
    //     path: '/financeList',
    //     name: 'financeIndex',
    //     redirect: '/finance',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../../view/index/IndexView.vue'),
    //     meta: {
    //         title: "财务管理",
    //         icon: 'dashboard',
    //         icon_active: 'finance_active',
    //         role: true,
    //         tab_show: true,
    //     },
    //     children: [
    //         {
    //             path: '/income',
    //             name: 'income',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../../view/finance/income.vue'),
    //             meta: {
    //                 title: "收入列表",
    //                 icon: 'dashboard',
    //                 role: true,
    //                 tab_show: true,
    //             }
    //         },
    //         {
    //             path: '/expend',
    //             name: 'expend',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../../view/finance/expend.vue'),
    //             meta: {
    //                 title: "支出列表",
    //                 icon: 'dashboard',
    //                 role: true,
    //                 tab_show: true,
    //             }
    //         },
    //     ],
    // },
    // {
    //     path: '/agreementList',
    //     name: 'agreementList',
    //     redirect: '/agreement',
    //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //     component: () => import('../../view/index/IndexView.vue'),
    //     meta: {
    //         title: "协议管理",
    //         icon: 'dashboard',
    //         icon_active: 'agreement_active',
    //         role: true,
    //         tab_show: true,
    //     },
    //     children: [
    //         {
    //             path: '/agreement',
    //             name: 'agreement',
    //             //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    //             component: () => import('../../view/agreement/agreement.vue'),
    //             meta: {
    //                 title: "评估列表",
    //                 icon: 'dashboard',
    //                 role: true,
    //                 tab_show: true,
    //             }
    //         }
    //     ],
    // },
    {
        path: '/marketing',
        name: 'marketing',
        redirect: '/ArticleListView',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "营销中台",
            icon: 'dashboard',
            icon_active: 'marketing_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/ArticleDetailsView',
                name: 'articleDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/marketing/ArticleDetailsView.vue'),
                meta: {
                    title: "文章详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/activityRelease',
                name: 'ActivityRelease',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/marketing/activityRelease.vue'),
                meta: {
                    title: "发布活动",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/activityDetails',
                name: 'ActivityDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/marketing/activityDetails.vue'),
                meta: {
                    title: "活动详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            // {
            //     path: '/CouponList',
            //     name: 'CouponList',
            //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
            //     component: () => import('../../view/marketing/CouponList.vue'),
            //     meta: {
            //         title: "优惠券列表",
            //         icon: 'dashboard',
            //         role: true,
            //         tab_show: false,
            //     }
            // },

            // {
            //     path: '/marketingActivity',
            //     name: 'MarketingActivity',
            //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
            //     component: () => import('../../view/marketing/marketingActivity.vue'),
            //     meta: {
            //         title: "营销活动",
            //         icon: 'dashboard',
            //         role: true,
            //         tab_show: false,
            //     }
            // },
            {
                path: '/MarketingContent',
                name: 'MarketingContent',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/marketing/MarketingContent.vue'),
                meta: {
                    title: "活动配置",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/MarketingInstitution',
                name: 'MarketingInstitution',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/marketing/MarketingInstitution.vue'),
                meta: {
                    title: "配置活动",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/MarketingParticipate',
                name: 'MarketingParticipate',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/marketing/MarketingParticipate.vue'),
                meta: {
                    title: "活动参与",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },
    {
        path: '/dictionaryList',
        name: 'dictionaryIndex',
        redirect: '/list',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "数据字典",
            icon: 'dashboard',
            icon_active: 'dictionary_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/database',
                name: 'database',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/dictinary/database.vue'),
                meta: {
                    title: "字典数据",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },

    {
        path: '/evaluationList',
        name: 'evaluationIndex',
        redirect: '/evaluation',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "评估管理",
            icon: 'dashboard',
            icon_active: 'evaluation_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/evaluationDetails',
                name: 'evaluationDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationDetails.vue'),
                meta: {
                    title: "查看评估",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/evaluationDepressed',
                name: 'evaluationDepressed',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationDepressed.vue'),
                meta: {
                    title: "认知评估",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/EvaluationDepression',
                name: 'EvaluationDepression',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationDepression.vue'),
                meta: {
                    title: "抑郁报告",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/evaluationCognize',
                name: 'evaluationCognize',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationCognize.vue'),
                meta: {
                    title: "认知评估",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/evaluationAdReport',
                name: 'evaluationAdReport',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationAdReport.vue'),
                meta: {
                    title: "AD8",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/evaluationMoca',
                name: 'EvaluationMoca',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationMoca.vue'),
                meta: {
                    title: "MoCa",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/evaluationMocaDetail',
                name: 'EvaluationMocaDetail',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationMocaDetail.vue'),
                meta: {
                    title: "moca详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/EvaluationCognizeH5',
                name: 'EvaluationCognizeH5',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationCognizeH5.vue'),
                meta: {
                    title: "手机眼动",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/HbiDetails',
                name: 'HbiDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/HbiDetails.vue'),
                meta: {
                    title: "hbi",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/evaluationHbiDetails',
                name: 'EvaluationHbiDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/EvaluationHbiDetails.vue'),
                meta: {
                    title: "csHbi",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },

            // {
            //     path: '/adReport',
            //     name: 'adReport',
            //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
            //     component: () => import('../../view/evaluation/adReport.vue'),
            //     meta: {
            //         title: "AD8报告",
            //         icon: 'dashboard',
            //         role: true,
            //         tab_show: false,
            //     }
            // },


            {
                path: '/playbackRecord',
                name: 'PlaybackRecord',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/PlaybackRecord.vue'),
                meta: {
                    title: "回放",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/statisticalRecord',
                name: 'StatisticalRecord',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/evaluation/StatisticalRecord.vue'),
                meta: {
                    title: "统计",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },
    {
        path: '/knowLedgeBase',
        name: 'knowLedgeBase',
        redirect: '/KnowLedgeView',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "知识库",
            icon: 'dashboard',
            icon_active: 'knowLedgeBase_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/knowDetails',
                name: 'knowDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/knowLedgeBase/KnowDetails.vue'),
                meta: {
                    title: "套餐详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                    keepAlive: true,
                }
            },
            {
                path: '/knowEditDetails',
                name: 'knowEditDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/knowLedgeBase/KnowEditDetails.vue'),
                meta: {
                    title: "套餐编辑",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/SportsDetails',
                name: 'SportsDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/knowLedgeBase/SportsDetails.vue'),
                meta: {
                    title: "新增运动",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/sportsEditDetails',
                name: 'sportsEditDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/knowLedgeBase/SportsEditDetails.vue'),
                meta: {
                    title: "编辑运动",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            //全部菜品
            {
                path: '/foodList',
                name: 'FoodList',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/knowLedgeBase/FoodList.vue'),
                meta: {
                    title: "全部菜品",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false
                }
            },
            //新增菜品
            {
                path: '/foodEditView',
                name: 'foodEditView',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/knowLedgeBase/FoodEditView.vue'),
                meta: {
                    title: "新增菜品",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },
    {
        path: '/order',
        name: 'order',
        redirect: '/BookingOrder',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "工单中台",
            icon: 'dashboard',
            icon_active: 'knowLedgeBase_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/RightsInterestsDetails',
                name: 'RightsInterestsDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/order/RightsInterestsDetails.vue'),
                meta: {
                    title: "权益工单详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/MealDetails',
                name: 'MealDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/order/MealDetails.vue'),
                meta: {
                    title: "服务工单详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/BookingDetails',
                name: 'BookingDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/order/BookingDetails.vue'),
                meta: {
                    title: "预约工单详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
        ],
    },
    {
        path: '/organization',
        name: 'organization',
        redirect: '/organizationRanking',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "服务统计",
            icon: 'dashboard',
            icon_active: 'knowLedgeBase_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/employeeRanking',
                name: 'employeeRanking',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/organization/employeeRanking.vue'),
                meta: {
                    title: "员工排名",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },

        ],
    },
    {
        path: '/institution',
        name: 'institution',
        redirect: '/institutionList',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "机构中台",
            icon: 'dashboard',
            icon_active: 'knowLedgeBase_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/institutionModify',
                name: 'institutionModify',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/institution/InstitutionModify.vue'),
                meta: {
                    title: "机构详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },

        ],
    },
    {
        path: '/equity',
        name: 'equity',
        redirect: '/equityList',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "权益中台",
            icon: 'dashboard',
            icon_active: 'equity_active',
            role: true,
            tab_show: true,
        },
        children: [
            // {
            //     path: '/equity',
            //     name: 'equity',
            //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
            //     component: () => import('../../view/equity/CustomEquity.vue'),
            //     meta: {
            //         title: "保险权益",
            //         icon: 'dashboard',
            //         role: true,
            //         tab_show: false,
            //     }
            // },
            // {
            //     path: '/communityEquity',
            //     name: 'communityEquity',
            //     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
            //     component: () => import('../../view/equity/communityEquity.vue'),
            //     meta: {
            //         title: "社区权益",
            //         icon: 'dashboard',
            //         role: true,
            //         tab_show: false,
            //     }
            // },
            {
                path: '/templateEquity',
                name: 'templateEquity',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/equity/TemplateEquity.vue'),
                meta: {
                    title: "模板列表",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/operationLog',
                name: 'operationLog',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/equity/OperationLog.vue'),
                meta: {
                    title: "操作日志",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },
            {
                path: '/customEquityDetails',
                name: 'customEquityDetails',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/equity/CustomEquityDetails.vue'),
                meta: {
                    title: "客户权益详情",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },

        ],
    },
    {
        path: '/derive',
        name: 'derive',
        redirect: '/deriveList',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../../view/index/IndexView.vue'),
        meta: {
            title: "导出中台",
            icon: 'dashboard',
            icon_active: 'equity_active',
            role: true,
            tab_show: true,
        },
        children: [
            {
                path: '/deriveList',
                name: 'DeriveList',
                //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
                component: () => import('../../view/derive/DeriveList.vue'),
                meta: {
                    title: "导出中台",
                    icon: 'dashboard',
                    role: true,
                    tab_show: false,
                }
            },


        ],
    },
]

export default roleRouters
