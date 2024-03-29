<template>
    <div class="scr-box">
        <header class="scr-header">
            <div class="btn-title"></div>
            <div class="text-title">
                <span>{{ dayTime }}</span>
                <span style="margin: 0 15px;">星期{{ week[weekDay] }}</span>
                <div class="icon-title" @click="goHome"></div>
            </div>
        </header>
        <div class="scr-content">
            <div class="content-left">
                <!-- 数据总览 -->
                <div class="data-box">
                    <div class="datas">
                        <div class="data-list">
                            <img src="../../assets/img/screen/img5.png">
                            <div>
                                <p style="color: #fff;font-size: 12px;">当前客户</p>
                                <p class="numbs"><i>{{ screenData.currentCustomersNum }}</i>人</p>
                            </div>
                        </div>
                        <div class="data-list">
                            <img src="../../assets/img/screen/img5.png">
                            <div>
                                <p style="color: #fff;">认知风险/正常用户</p>
                                <p class="numbs">
                                    <i style="font-size: 19px;">{{ screenData.perceivedRiskCustomersNum }}</i>
                                    <span style="font-size: 14px;">人/<i>{{ screenData.normalCustomersNum
                                    }}</i><span>人</span></span>
                                </p>
                            </div>
                        </div>
                        <div class="data-list">
                            <img src="../../assets/img/screen/img5.png">
                            <div>
                                <p style="color: #fff;font-size: 12px;">已筛查用户</p>
                                <p class="numbs"><i>{{ screenData.screenedCustomersNum }}</i>人</p>
                            </div>
                        </div>
                        <div class="data-list">
                            <img src="../../assets/img/screen/img5.png">
                            <div>
                                <p style="color: #fff;font-size: 12px;">未筛查用户</p>
                                <p class="numbs"><i>{{ screenData.unscreenedCustomersNum }}</i>人</p>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- 认知风险圆环图 -->
                <div class="risk-box">
                    <echarts :options="riskOption" :height="'300px'" style="width: 100%;">
                    </echarts>
                </div>
                <!-- 员工统计 -->
                <div class="pers-box">
                    <vue3-seamless-scroll class="user-list-box" :hover-stop="true" :list="screenData?.positionEmployeeNum"
                        :hover="true" :step="0.5">
                        <div v-for="(item, index) in screenData.positionEmployeeNum" :key="index">
                            <div class="t-progress-domo-margin" style="color: #C6DFFF;margin-bottom: 5px;">
                                {{ item.positionName }}</div>
                            <t-progress class="progress-one" theme="plump" :label="item.count + '人'" />
                        </div>
                    </vue3-seamless-scroll>
                </div>
            </div>
            <div class="content-middle">
                <!-- 今日概括 -->
                <div class="date-box">
                    <div class="date-item">
                        <img src="../../assets/img/screen/img1.png">
                        <div>
                            <p class="date-name">今日新增用户</p>
                            <p class="date-text">{{ screenData.todayAddCustomersNum }}人</p>
                        </div>
                    </div>
                    <div class="date-item">
                        <img src="../../assets/img/screen/img1.png">
                        <div>
                            <p class="date-name">今日已筛查用户</p>
                            <p class="date-text">{{ screenData.todayScreenedCustomersNum }}人</p>
                        </div>
                    </div>
                    <div class="date-item">
                        <img src="../../assets/img/screen/img1.png">
                        <div>
                            <p class="date-name">今日未筛查用户</p>
                            <p class="date-text">{{ screenData.todayUnscreenedCustomersNum }}人</p>
                        </div>
                    </div>
                </div>
                <!-- 服务分布地图 -->
                <div class="map-box">
                    <div style="position: relative;">
                        <div class="Map" id="container"></div>
                        <!-- <div class="Map" ref="map" id="container"></div> -->
                        <!-- <div class="MapPrompt" id="panel" @click="changeMarker"></div> -->
                    </div>
                </div>
                <!-- 筛查服务 -->
                <div class="scre-box">
                    <echarts :options="orderOption" :height="'300px'" style="width: 100%;">
                    </echarts>
                </div>
            </div>
            <div class="content-right">
                <!-- 机构列表 -->
                <div class="instion-box" v-if="state == 1">
                    <vue3-seamless-scroll class="list-box" :hover-stop="true" :list="screenData?.organizationList"
                        :hover="true" :step="0.5">
                        <div v-for="(item, index) in screenData.organizationList" :key="index" class="item scr-contents"
                            style="padding: 5px; margin: 5px; font-size: 14px">
                            <div class="inst-text">{{ item.organizationName }}</div>
                        </div>
                    </vue3-seamless-scroll>
                </div>
                <div class="message-box" v-else>
                    <div class="message-box-list">
                        <img src="../../assets/img/screen/img21.png">
                        <div class="msg-box">
                            <div class="msg-text">已完成筛查人数</div>
                            <div class="msg-num">3000.00</div>
                        </div>
                    </div>
                    <div class="message-box-list">
                        <img src="../../assets/img/screen/img21.png">
                        <div class="msg-box">
                            <div class="msg-text">待复评人数</div>
                            <div class="msg-num">356</div>
                        </div>
                    </div>

                </div>
                <!-- 实时筛查 -->
                <div class="scr-list">
                    <div class="scr-title">
                        <p>筛查机构</p>
                        <p>评估员</p>
                        <p>被评估人</p>
                    </div>
                    <vue3-seamless-scroll class="list-box" :hover-stop="true" :list="screeningActualTime" :hover="true"
                        :step="0.5" v-if="screeningActualTime.length > 10">
                        <div v-for="(item, index) in screeningActualTime" :key="index" class="item scr-contents">
                            <div> {{ item.organName }} </div>
                            <div> {{ item.assessor }} </div>
                            <div> {{ item.name }} </div>
                        </div>
                    </vue3-seamless-scroll>
                    <div v-for="(item, index) in screeningActualTime" :key="index" class="item scr-contents"
                        v-if="screeningActualTime.length < 10">
                        <div> {{ item.organName }} </div>
                        <div> {{ item.assessor }} </div>
                        <div> {{ item.name }} </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, toRefs, onMounted, ref, nextTick } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from '@vue/reactivity';
import echarts from '../../component/baseEcharts.vue';
import router from '@/router';
import dayjs from 'dayjs';
import { getScreenData } from '../../request/modules/screenApi';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
let screenData = ref<any>({})
let sexOptionData = ref<any>([])
let resultsX = ref<any>([])
let results = ref<any>([])
let listData = ref<any>([])
let state = ref<number>(1)
let map = shallowRef<any>(null);
let geocoder = ref<any>(undefined)
let marker = ref<any>(undefined)
let placeSearch = ref<any>(undefined)
let screeningActualTime = ref<any>([])
let week = ['日', '一', '二', '三', '四', '五', '六']
let dayTime = dayjs().format('YYYY年MM月DD日')
let weekDay = dayjs().day()
onMounted(() => {
    nextTick(() => {
        changeScale()
        window.addEventListener('resize', changeScale)
    })
    getDataScreen()
})

// 获取大屏数据
const getDataScreen = () => {
    getScreenData().then((res: any) => {
        if (res.code === 200) {
            //筛查服务X轴信息
            resultsX.value = res.data.screeningServicesList.map((item) => {
                return item.dateStr;
            });
            //筛查服务Y轴信息
            results.value = res.data.screeningServicesList.map((item) => {
                return item.count;
            });
            // 认知风险等级分布
            res.data.cognitiveRiskDistributionResponseList.forEach((el) => {
                let color = "";
                if (el.riskTypeDesc == "正常") {
                    color = "#16CABE";
                } else if (el.riskTypeDesc == "低风险") {
                    color = "#FFD200";
                } else if (el.riskTypeDesc == "中风险") {
                    color = "#EBA101"
                } else {
                    color = "#FF0000"
                }
                sexOptionData.value.push({
                    'value': el.proportion,
                    'name': el.riskTypeDesc,
                    'itemStyle': {
                        color: color
                    }
                })
            });
            screeningActualTime = res.data.screeningActualTime
            screenData.value = res.data
            listData.value = res.data.organizationList
            ininMap();
        }
    })
}

const riskOption = ref({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        bottom: '0',
        left: 'center',
        textStyle: {
            fontSize: 15,//字体大小
            color: '#FFFFFF'//字体颜色
        },
    },
    series: [
        {
            name: '认知风险等级',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: sexOptionData
            // data: [
            //     {
            //         value: 25,
            //         name: '低风险',
            //         itemStyle: {
            //             color: '#FFD200'
            //         }
            //     },
            //     {
            //         value: 25,
            //         name: '高风险',
            //         textStyle: {
            //             color: '#FF0000'
            //         },
            //         itemStyle: {
            //             color: '#FF0000'
            //         }
            //     },
            //     {
            //         value: 15,
            //         name: '中风险',
            //         itemStyle: {
            //             color: '#EBA101'
            //         }
            //     },
            //     {
            //         value: 35,
            //         name: '正常',
            //         itemStyle: {
            //             color: '#16CABE'
            //         }
            //     }
            // ]
        }
    ]
});

const orderOption = ref({
    title: {
        text: "筛查频次（次）",
        padding: [20, 20, 20, 20],
        left: "right",
        top: "top",
        textStyle: {
            fontSize: 14,
            color: '#ACC8EC',
        },
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: resultsX
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: results,
            type: 'bar',
            barWidth: '10%', itemStyle: {
                color: '#0F8AFE',
                shadowColor: '#91cc75',
                barBorderRadius: [30, 30, 0, 0],
                borderType: 'dashed',
            }
        }
    ]
    // series: [{
    //     type: 'bar', barWidth: '10%', itemStyle: {
    //         color: '#0F8AFE',
    //         shadowColor: '#91cc75',
    //         barBorderRadius: [30, 30, 0, 0],
    //         borderType: 'dashed',
    //     }
    // }]
});

const ininMap = () => {
    map = AMapLoader.load({
        key: '44adef0d737a37ba5a8481be9f231816', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then(AMap => {
        let zoom = 10;
        map = new AMap.Map('container', {
            //设置地图容器id
            viewMode: '3D', //是否为3D地图模式
            zoom: zoom, //初始化地图级别
            // center: center //初始化地图中心点位置
        });
        AMap.plugin(['AMap.PlaceSearch'], () => {
            //构造地点查询类
            placeSearch = new AMap.PlaceSearch({
                pageSize: 25, // 单页显示结果条数
                pageIndex: 1, // 页码
                map: map, // 展现结果的地图实例
                panel: 'panel', // 结果列表将在此容器中进行展示。
                autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            });
        });
        AMap.plugin('AMap.Geocoder', () => {
            geocoder = new AMap.Geocoder({
                radius: 1000 //范围，默认：500,
            });
        });
        let markerList = [] as any;
        console.log(listData.value)
        listData.value.forEach((item: any) => {
            let center = [Number(item.longitude), Number(item.latitude)];
            marker = new AMap.Marker({
                icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                position: center,
                offset: new AMap.Pixel(-13, -30)
            });
            markerList.push(marker)
        })
        map.add(markerList);
        marker = new AMap.Marker();
    }).catch(e => {
        // console.log(e);
    });
};

const changeScale = () => {
    let targetX = 1920
    let x = document.documentElement.clientWidth;
    let scaleX = x / targetX;
    //动态缩放
    (document.querySelector('.scr-box') as HTMLElement).setAttribute('style', `transform:scale(${scaleX}`)
}

const goHome = () => {
    router.back()
    map.destroy()
}

onBeforeUnmount(() => {
    map.destroy()
    window.removeEventListener('resize', changeScale)
})
</script>

<style  lang="scss" scoped>
.scr-box {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 1920px;
    height: 100%;
    background: #0C1D3B;
    transform-origin: left top;

    .scr-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        width: 1920px;
        padding: 0 20px;
        height: 88px;
        background: no-repeat;
        background-size: 100% 100%;
        background-image: url(../../assets/img/screen/img4.png);

        .btn-title {
            width: 112px;
            height: 42px;
            text-align: center;
            background: no-repeat;
            cursor: pointer;
            background-image: url(../../assets/img/screen/img16.png);
        }

        .text-title {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            color: #7CA6D6;
            font-size: 16px;
        }

        .icon-title {
            width: 28px;
            height: 27px;
            background: no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
            background-image: url(../../assets/img/screen/img17.png);
        }
    }

    .scr-content {
        display: flex;
        width: 1920px;
        padding: 0 20px;
        box-sizing: border-box;

        .content-left {
            display: flex;
            flex-direction: column;
            margin-right: 10px;

            .data-box {
                width: 466px;
                height: 250px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                background: no-repeat;
                background-size: 100% 100%;
                background-image: url(../../assets/img/screen/img9.png);

                .datas {
                    width: 100%;
                    height: 100%;
                    padding: 55px 30px 15px 30px;
                    display: flex;
                    flex-wrap: wrap;
                    box-sizing: border-box;
                    align-items: center;

                    .data-list {
                        display: flex;
                        // width: 45%;
                        height: 74px;
                        align-items: center;
                        margin-bottom: 10px;

                        img {
                            width: 50px;
                            height: 60px;
                            margin-right: 4px;
                        }

                        p {
                            margin-top: 5px;
                        }

                        .names {
                            font-size: 12px;
                            color: #FFFFFF;
                        }

                        .numbs {
                            font-size: 19px;
                            font-weight: bolder;
                        }

                        &:nth-child(1) {
                            .numbs {
                                color: #4ADBDB !important;
                            }
                        }

                        &:nth-child(2) {
                            .numbs {
                                color: #4ADBDB !important;
                            }
                        }

                        &:nth-child(3) {
                            .numbs {
                                color: #EFEC14 !important;
                            }
                        }

                        &:nth-child(4) {
                            .numbs {
                                color: #FDA800 !important;
                            }
                        }
                    }

                    .data-list:nth-of-type(2n+1) {
                        margin-right: 30px;
                    }
                }
            }

            .risk-box {
                width: 466px;
                height: 353px;
                margin-top: 6px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                background: no-repeat;
                background-size: 100% 100%;
                background-image: url(../../assets/img/screen/img11.png);
            }

            .pers-box {
                width: 466px;
                height: 351px;
                margin-top: 6px;
                box-sizing: border-box;
                align-items: center;
                background: no-repeat;
                background-size: 100% 100%;
                // padding: 100px 30px;
                background-image: url(../../assets/img/screen/img12.png);
                overflow: hidden;

                .user-list-box {
                    margin-top: 80px;
                    height: 230px;
                    overflow: hidden;
                    padding: 0 30px;
                }

                ::v-deep(.t-progress) {
                    margin-bottom: 30px;
                }

                ::v-deep(.t-progress__bar) {
                    background: rgb(17, 78, 133);
                }

                ::v-deep(.progress-one .t-progress__inner) {
                    background: linear-gradient(90deg, #00E5FA 0%, #39EEAF 100%);
                }

                ::v-deep(.progress-two .t-progress__inner) {
                    background: linear-gradient(90deg, #20D2FC 0%, #0C7CFF 100%);
                }

                ::v-deep(.progress-three .t-progress__inner) {
                    background: linear-gradient(90deg, #FCAE20 0%, #EDFF0C 100%);
                }
            }
        }

        .content-middle {
            display: flex;
            flex-direction: column;
            margin-right: 10px;

            .date-box {
                width: 932px;
                height: 171px;
                box-sizing: border-box;
                background: no-repeat;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                background-image: url(../../assets/img/screen/img8.png);

                .date-item {
                    display: flex;
                    align-items: center;

                    .date-name {
                        font-size: 12px;
                        color: #ffffff;
                    }

                    .date-text {
                        font-size: 35px;
                    }

                    &:nth-child(1) {
                        .date-text {
                            color: #EDFF0C !important;
                        }

                    }

                    &:nth-child(2) {
                        .date-text {
                            color: #39EF14 !important;
                        }

                    }

                    &:nth-child(3) {
                        .date-text {
                            color: #FDA800 !important;
                        }

                    }

                    img {
                        margin-right: 10px;
                    }

                    p {
                        margin-bottom: 5px;
                    }
                }

            }

            .map-box {
                width: 932px;
                height: 429px;
                margin-top: 10px;
                box-sizing: border-box;
                background: no-repeat;
                background-size: 100% 100%;
                background-image: url(../../assets/img/screen/img19.png);

                .Map {
                    width: 865px;
                    height: 361px;
                    padding: 0px;
                    border-radius: 5px;
                    margin: 45px auto;
                }

                // .MapPrompt {
                //     width: 300px;
                //     height: 500px;
                //     overflow-y: auto;
                //     position: absolute;
                //     top: 40px;
                //     right: 40px;
                // }
            }

            .scre-box {
                width: 932px;
                height: 351px;
                margin-top: 6px;
                box-sizing: border-box;
                background: no-repeat;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                background-image: url(../../assets/img/screen/img13.png);
            }
        }

        .content-right {
            display: flex;
            flex-direction: column;

            .instion-box {
                width: 472px;
                height: 249px;
                box-sizing: border-box;
                display: flex;
                overflow: hidden;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: no-repeat;
                background-size: 100% 100%;
                background-image: url(../../assets/img/screen/img10.png);

                .list-box {
                    padding: 45px 20px 20px 20px;
                    height: 100px;
                    overflow: hidden;
                }

                .inst-text {
                    width: 408px;
                    height: 52px;
                    line-height: 48px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #FFFFFF;
                    cursor: pointer;
                    // margin-top: 10px;
                    text-align: center;
                    background: no-repeat;
                    background-size: 100% 100%;
                    background-image: url(../../assets/img/screen/img18.png);
                }

                .inst-text:hover {
                    background: #0854B2;
                }
            }

            .message-box {
                width: 472px;
                height: 249px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: no-repeat;
                background-size: 100% 100%;
                background-image: url(../../assets/img/screen/img20.png);

                .message-box-list {
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: center;
                    align-items: center;
                    margin-top: 20px;
                    width: 360px;
                }

                .msg-box {
                    width: 100%;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid;
                    padding: 11px 20px;
                    border-image: linear-gradient(90deg, rgba(6, 211, 239, 0), rgba(0, 231, 242, 1), rgba(151, 151, 151, 0)) 2 2;

                    .msg-text {
                        font-size: 16px;
                        color: #FFFFFF;
                        font-weight: 600;

                    }

                    .msg-num {
                        font-size: 25px;
                        color: #4ADBDB;
                    }
                }
            }

            .scr-list {
                width: 472px;
                height: 713px;
                margin: 5px 0;
                padding: 45px 20px 20px 20px;
                box-sizing: border-box;
                background: no-repeat;
                background-size: 100% 100%;
                background-image: url(../../assets/img/screen/img14.png);

                .scr-title {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    margin-bottom: 15px;

                    p {
                        font-size: 14px;
                        font-weight: 600;
                        color: #C6DFFF;
                    }
                }

                .list-box {
                    height: 93%;
                    overflow-y: auto;

                    white-space: nowrap;
                    /* 隐藏滚动条 */
                    overflow-y: hidden;
                    /* 隐藏滚动条 */
                    scrollbar-width: none;
                    /* 隐藏滚动条 */
                    -ms-overflow-style: none;
                    /* 隐藏滚动条 */
                }

                .scr-contents {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: flex-start;
                    border-radius: 17px;
                    padding: 10px 20px;
                    margin-bottom: 5px;
                    border: 1px solid rgba(255, 255, 255, 0.17);
                    background: linear-gradient(180deg, rgba(0, 116, 195, 0.19) 0%, rgba(17, 85, 144, 0.4) 49%, rgba(0, 64, 144, 0.61) 100%);
                    box-shadow: inset 0px 1px 3px 0px rgba(255, 255, 255, 0.18);

                    div {
                        font-size: 14px;
                        font-weight: 600;
                        color: #C6DFFF;
                        text-align: left;
                        width: 30%;
                    }

                    div:nth-of-type(1) {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-weight: 600;
                        color: #C6DFFF;
                        margin-right: 100px;
                    }

                    div:nth-of-type(2) {
                        font-weight: 600;
                        color: #C6DFFF;
                        text-align: left;
                        margin-right: 75px;
                    }
                }
            }
        }
    }
}
</style>