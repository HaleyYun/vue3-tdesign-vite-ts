import * as echarts from 'echarts'
export default function echartsFun(el:any) {
    //初始化echarts
    let myChart = echarts.init(el);
    //设置配置项
    let setOptions = (options:any)=>{
        myChart.setOption(options)
    }
    let resize = ()=>{
        myChart.resize()
    }
    return{
        setOptions,
        resize
    }
}