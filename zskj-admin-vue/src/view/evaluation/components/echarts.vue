<template>
    <div class="chartBox">
        <div class="chart" id="topChart" :style="{ width: width + 'px', height: height + 'px' }"></div>
    </div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import { onMounted, nextTick, onUnmounted } from 'vue';
type EChartsOption = echarts.EChartsOption;
type ECharts = echarts.ECharts;
type ItemType = {
    name: string
    referValue: string
    value: string
    valueUnit: string
    type: string
    columns?: number[]
};
type PieType = {
    name: string
    value: number
}
export default {
    props: {
        itemData: {
            default: { name: "错误率", referValue: "50.0", value: "0.55", valueUnit: "%", type: "bar" }
        },
        width: { default: 345 },
        height: { default: 300 }
    },
    setup(props: { itemData: ItemType }) {
        let myChart: ECharts | null = null
        const initChart = (item: ItemType = { name: "错误率", referValue: "50.0", value: "0.55", valueUnit: "%", type: "bar" }) => {
            console.log("子item", item)
            if (myChart) myChart.clear()
            let barOption = bardata(item)
            if (item.type == "bar") {
                barOption = bardata(item)
            } else if (item.type == "pie") {
                let arr = item.value.split(":")
                barOption = pieData([{ name: "新照片", value: Number(arr[0]) }, { name: "旧照片", value: Number(arr[1]) }], item.name)
            } else if (item.type == "boxplot") {
                barOption = boxplotData(item)
            }
            nextTick(() => {
                if (!myChart) {
                    let chartDom:any = document.getElementById('topChart')
                    myChart = echarts.init(chartDom)
                }
                myChart.setOption(barOption)
            })
        }

        // 返回柱状图数据结构
        const bardata = (item: ItemType): EChartsOption => {
            return {
                title: {
                    text: item.name,
                    left: 'center'
                },
                xAxis: {
                    type: 'category',
                    // axisLine: { // x轴线的颜色以及宽度
                    //     show: true,
                    //     lineStyle: {
                    //         color: "#654925",
                    //         width: 1,
                    //         type: "solid"
                    //     }
                    // },
                    axisLabel: {
                        fontSize: 18
                    },
                    axisTick: {
                        show: false
                    },
                    data: ['用户', '常模']
                },
                yAxis: {
                    name: item.valueUnit == '%' ? '百分比（%）' : '时间（ms）',
                    type: 'value',
                    // splitLine: {
                    //     show: false,
                    // },
                    // axisLine: { // x轴线的颜色以及宽度
                    //     show: true,
                    //     lineStyle: {
                    //         color: "#654925",
                    //         width: 1,
                    //         type: "solid"
                    //     }
                    // }
                },
                grid: {
                    top: "100px",
                    right: "10px",
                    left: "50px",
                    bottom: "40px",
                },
                series: [{
                    data: [item.valueUnit === '%' ? Number(item.value) * 100 : Number(item.value), Number(item.referValue)],
                    type: 'bar',
                    barWidth:50,
                    // itemStyle: {
                    //     normal: {
                    //         //这里是颜色
                    //         color: function (params) {
                    //             //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                    //             let colorList = ['#b7ab95', '#654925', '#b7ab95', '#654925'];
                    //             return colorList[params.dataIndex]
                    //         }
                    //     }
                    // },
                }]
            }
        }

        
        // 返回饼图数据结构
        const pieData = (item: PieType[], name: string): EChartsOption => {
            return {
                //鼠标移入显示文字
                title: {
                    text: name,
                    left: 'center'
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{d}%"
                },
                legend: {
                    orient: 'vertical',
                    left: '10%',
                    top: '10%',
                    // textStyle: {
                    //     fontSize: 20
                    // }
                },
                series: [{
                    type: "pie",
                    radius: [0, "60%"], //饼图大小设置
                    center: ["50%", "60%"], // 距离左边，距离上边距离
                    //数据文字内部展示
                    data: item,
                    // emphasis: {
                    //     label: {
                    //         fontSize: 24
                    //     },
                    // }
                }]
            }
        }
        // 返回箱型图数据结构
        const boxplotData = (item: ItemType): EChartsOption => {
            return {
                title: [
                    {
                        text: item.name,
                        left: 'center'
                    }
                ],
                dataset: [
                    {
                        // prettier-ignore
                        source: [
                            item.columns as number[]
                        ]
                    },
                    {
                        transform: {
                            type: 'boxplot',
                            config: { itemNameFormatter: item.name }
                        }
                    },
                    {
                        fromDatasetIndex: 1,
                        fromTransformResult: 1
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                    top: '15%'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    nameGap: 30,
                    axisLabel: {
                        fontSize: 18
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: item.valueUnit,
                    splitArea: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        datasetIndex: 1
                    }
                ]
            }
        }
        onMounted(() => {
            console.log("props.itemData", props.itemData)
            initChart(props.itemData)
        })
        onUnmounted(() => {
            myChart!.dispose()
            myChart = null
        })

    }

}
</script>

 <style lang="scss" scoped>
// .chartBox {
//     width: 1000px;
//     height: 600px;
// } 
</style>
