<template>
  <div class="user-box">
    <t-date-picker allow-input format="YYYY-MM-DD" v-model="dayTime" @change="onChange" />
    <div class="box">
      <!-- <div class="box-img" v-for="item in datalist">
                <div class="box-bor" :style="{ backgroundColor: item.color }"></div>
                <img class="box-log" :src="item.src">
                <p class="line"></p>
                <div class="uer-text">
                    <p class="uer-name">{{ item.name }}</p>
                    <p class="user-num">{{ item.num }}</p>
                </div>
            </div> -->
      <div class="box-img">
        <div class="box-bor" style="background-color: #f29995"></div>
        <img class="box-log" :src="getAssetsFile('all-info.png')" />
        <p class="line"></p>
        <div class="uer-text">
          <p class="uer-name">总用户数量</p>
          <p class="user-num">{{ homeData.userAllNumber }}</p>
        </div>
      </div>
      <div class="box-img">
        <div class="box-bor" style="background-color: #5d4f8b"></div>
        <img class="box-log" :src="getAssetsFile('all-info1.png')" />
        <p class="line"></p>
        <div class="uer-text">
          <p class="uer-name">已筛查用户数量</p>
          <p class="user-num">{{ homeData.estimateAllNumber }}</p>
        </div>
      </div>
      <div class="box-img">
        <div class="box-bor" style="background-color: #40b761"></div>
        <img class="box-log" :src="getAssetsFile('all-info2.png')" />
        <p class="line"></p>
        <div class="uer-text">
          <p class="uer-name">已干预人数</p>
          <p class="user-num">{{ homeData.interventionNumber }}</p>
        </div>
      </div>
      <div class="box-img">
        <div class="box-bor" style="background-color: #fdbf03"></div>
        <img class="box-log" :src="getAssetsFile('all-info3.png')" />
        <p class="line"></p>
        <div class="uer-text">
          <p class="uer-name">工单数量</p>
          <p class="user-num">{{ homeData.ticketsNumber }}</p>
        </div>
      </div>
    </div>
    <div class="search-box">
      <echarts :options="orderOption" :height="'244px'" style="background: #fff; width: 100%; margin-right: 16px"> </echarts>
      <echarts :options="sexOption" :width="'198px'" :height="'244px'" style="background: #fff"></echarts>
    </div>
    <div class="operate-box">
      <echarts :options="scrOption" :height="'340px'" style="background: #fff; width: 100%; margin-top: 16px"> </echarts>
      <echarts :options="intOption" :height="'340px'" style="background: #fff; width: 100%; margin-top: 16px"> </echarts>
      <echarts :options="addOption" :height="'340px'" style="background: #fff; width: 100%; margin-top: 16px"> </echarts>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reduce } from 'video.js/dist/types/utils/obj';
import echarts from '../../component/baseEcharts.vue';
import { getHomeData, getWeekTicketsData, getLineChartData } from '../../request/modules/StatisticsApi';
import dayjs from 'dayjs';
// // 获取assets静态资源
const getAssetsFile = (url: string) => {
  return new URL(`../../assets/img/index/${url}`, import.meta.url).href;
};
let dayTime = ref('');
let homeData = ref({
  userAllNumber: '',
  ticketsNumber: '',
  interventionNumber: '',
  estimateAllNumber: ''
});
let orderOptionData = ref<any>([]);
let sexOptionData = ref<any>([]);
let scrOptionXData = ref<any>([]);
let scrOptionData = ref<any>([]);
let intOptionXData = ref<any>([]);
let intOptionData = ref<any>([]);
let addOptionXData = ref<any>([]);
let addOptionData = ref<any>([]);
const orderOption = ref<any>({
  title: {
    text: '每周服务单量',
    padding: [20, 20, 20, 20],
    top: -10,
    textStyle: {
      fontSize: 14,
      top: 50,
      color: '#232323'
    }
  },
  legend: {
    left: 20,
    top: 30
  },
  tooltip: {},
  dataset: {
    dimensions: ['product', '预约工单', '服务工单', '权益工单'],
    source: orderOptionData
    // source: [
    //   { product: '04.24-04.28', 预约工单: 10, 服务工单: 75, 权益工单: 52 },
    //   { product: '04.29-05.02', 预约工单: 42, 服务工单: 100, 权益工单: 52 },
    //   { product: '05.03-05.07', 预约工单: 42, 服务工单: 10, 权益工单: 52 },
    //   { product: '05.08-05.12', 预约工单: 42, 服务工单: 100, 权益工单: 10 }
    // ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [
    {
      type: 'bar',
      barWidth: '12%',
      itemStyle: {
        color: '#FF7E7E',
        shadowColor: '#91cc75',
        barBorderRadius: [30, 30, 0, 0],
        borderType: 'dashed'
      },
      label: {
        show: true,
        position: 'top',
        color: '#222222'
      }
    },
    {
      type: 'bar',
      barWidth: '12%',
      itemStyle: {
        color: '#FEC000',
        shadowColor: '#91cc75',
        barBorderRadius: [30, 30, 0, 0],
        borderType: 'dashed'
      },
      label: {
        show: true,
        position: 'top',
        color: '#222222'
      }
    },
    {
      type: 'bar',
      barWidth: '12%',
      itemStyle: {
        color: '#3FB560',
        shadowColor: '#91cc75',
        barBorderRadius: [30, 30, 0, 0],
        borderType: 'dashed'
      },
      label: {
        show: true,
        position: 'top',
        color: '#222222'
      }
    }
  ]
});
const sexOption = ref<any>({
  title: {
    text: '男女占比',
    padding: [20, 20, 20, 20],
    textStyle: {
      fontSize: 14,
      color: '#232323'
    }
  },
  legend: {
    bottom: 10,
    left: 'center',
    data: ['男', '女', '未知']
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} :{d}%'
  },
  showEmptyCircle: true,
  series: [
    {
      type: 'pie',
      label: {
        show: true,
        position: 'inside',
        formatter: '{d}%'
      },
      data: sexOptionData
      // data: [
      //     {
      //         value: 25,
      //         name: '未知',
      //         itemStyle: {
      //             color: '#686868',
      //         }
      //     },
      //     {
      //         value: 10,
      //         name: '男',
      //         itemStyle: {
      //             color: '#18BAC5',
      //         }
      //     },
      //     {
      //         value: 65,
      //         name: '女',
      //         itemStyle: {
      //             color: '#6ADC86',
      //         }
      //     },
      // ]
    }
  ]
});
const scrOption = ref<any>({
  title: {
    text: '每天筛查人次走势图',
    padding: [20, 20, 20, 20],
    textStyle: {
      fontSize: 14,
      color: '#232323'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['筛查人次']
  },
  xAxis: {
    type: 'category',
    data: scrOptionXData
    // data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08', '01-09', '01-10']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: scrOptionData,
      // data: [150, 230, 224, 218, 135, 147, 260, 230, 203, 168],
      type: 'line',
      name: '筛查人次',
      // label: {
      //     show: true,
      //     position: 'top',
      //     color: '#222222'
      // },
      itemStyle: {
        normal: { label: { show: true } }
      },
      lineStyle: {
        normal: {
          color: '#4E4EFA',
          width: 1
        }
      }
    }
  ]
});
const intOption = ref<any>({
  title: {
    text: '每天新增干预人走势图',
    padding: [20, 20, 20, 20],
    textStyle: {
      fontSize: 14,
      color: '#232323'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增人数']
  },
  xAxis: {
    type: 'category',
    data: intOptionXData
    // data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08', '01-09', '01-10']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: intOptionData,
      // data: [150, 230, 224, 218, 135, 147, 260, 230, 203, 168],
      type: 'line',
      name: '新增人数',
      itemStyle: {
        normal: { label: { show: true } }
      },
      lineStyle: {
        normal: {
          color: '#04B12F',
          width: 1
        }
      }
    }
  ]
});
const addOption = ref<any>({
  title: {
    text: '每天新增人数走势图',
    padding: [20, 20, 20, 20],
    textStyle: {
      fontSize: 14,
      color: '#232323'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增人数走势']
  },
  xAxis: {
    type: 'category',
    data: addOptionXData
    // data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08', '01-09', '01-10']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: addOptionData,
      // data: [150, 230, 224, 218, 135, 147, 260, 230, 203, 168],
      type: 'line',
      name: '新增人数走势',
      itemStyle: {
        normal: { label: { show: true } }
      },
      lineStyle: {
        normal: {
          color: '#C9A205',
          width: 1
        }
      }
    }
  ]
});
const setArrt = reactive({});

const datalist = [
  {
    color: '#F29995',
    src: 'http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/81c7514a074b4e0c8e4b10c4f0768768.png',
    name: '总用户数量',
    num: 6597
  },
  {
    color: '#5D4F8B',
    src: 'http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/6522c67d8b824f99847116a917f8a4a1.png',
    name: '已筛查用户数量',
    num: 6597
  },
  {
    color: '#40B761',
    src: 'http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/a14ef588ccea464499de292a17b77352.png',
    name: '已干预人数',
    num: 6597
  },
  {
    color: '#FDBF03',
    src: 'http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/527afbfde7fe4c1788f7995513845ae8.png',
    name: '工单数量',
    num: 6597
  }
];
onMounted(() => {
  dayTime.value = dayjs().format('YYYY-MM-DD');
  getHomeList(dayTime.value);
  getWeekTicketsDataList(dayTime.value);
  getLineChartDataList(dayTime.value);
});

const onChange = (value: any) => {
  dayTime.value = value;
  getHomeList(dayTime.value);
  getWeekTicketsDataList(dayTime.value);
  getLineChartDataList(dayTime.value);
};

// 获取四大数据
const getHomeList = (value: string) => {
  getHomeData({ createTime: value }).then((res: any) => {
    if (res.code === 200) {
      // //筛查服务X轴信息
      // resultsX.value = res.data.screeningServicesList.map((item) => {
      //     return item.dateStr;
      // });
      // //筛查服务Y轴信息
      // results.value = res.data.screeningServicesList.map((item) => {
      //     return item.count;
      // });
      homeData.value = res.data;
    }
  });
};
// 获取工单数和男女占比
const getWeekTicketsDataList = (value: string) => {
  getWeekTicketsData({ createTime: value }).then((res: any) => {
    if (res.code === 200) {
      sexOptionData.value = [
        {
          value: res.data.sexData.unknown != 0 ? res.data.sexData.unknown : null,
          name: '未知',
          itemStyle: {
            color: '#686868'
          }
        },
        {
          value: res.data.sexData.man != 0 ? res.data.sexData.man : null,
          name: '男',
          itemStyle: {
            color: '#18BAC5'
          }
        },
        {
          value: res.data.sexData.woman != 0 ? res.data.sexData.woman : null,
          name: '女',
          itemStyle: {
            color: '#6ADC86'
          }
        }
      ];
      //   res.data.weekTickets.forEach((el: any) => {
      //     orderOptionData.value.push({
      //       product: el.week,
      //       预约工单: el.bookNum,
      //       服务工单: el.serviceNum,
      //       权益工单: el.equityNum
      //     });
      //   });
      orderOptionData.value = res.data.weekTickets.map((item: any) => {
        return {
          product: item.week,
          预约工单: item.bookNum,
          服务工单: item.serviceNum,
          权益工单: item.equityNum
        };
      });
    }
  });
};
// 获取折线图
const getLineChartDataList = (value: string) => {
  getLineChartData({ createTime: value }).then((res: any) => {
    if (res.code === 200) {
      // 筛查折线图X轴信息
      scrOptionXData.value = res.data.checkLine.map((item: any) => {
        return item.date;
      });
      // 筛查折线图Y轴信息
      scrOptionData.value = res.data.checkLine.map((item: any) => {
        return item.number;
      });
      // 干预折线图X轴信息
      intOptionXData.value = res.data.interventionLine.map((item: any) => {
        return item.date;
      });
      // 干预折线图Y轴信息
      intOptionData.value = res.data.interventionLine.map((item: any) => {
        return item.number;
      });
      // 筛查折线图X轴信息
      addOptionXData.value = res.data.peopleLine.map((item: any) => {
        return item.date;
      });
      // 筛查折线图Y轴信息
      addOptionData.value = res.data.peopleLine.map((item: any) => {
        return item.number;
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  overflow-y: auto;

  .box {
    display: flex;
    flex-wrap: nowrap;

    .box-img {
      margin-top: 22px;
      display: flex;
      flex-grow: 1;
      flex-wrap: nowrap;
      align-items: center;
      height: 92px;
      // width: 285px;
      margin-right: 15px;
      background: #ffffff;

      .box-bor {
        width: 6px;
        height: 92px;
        border-radius: 11px;
        line-height: 92px;
      }

      img {
        width: 80px;
        height: 80px;
        line-height: 92px;
        margin: 0 15px;
      }

      .line {
        width: 1px;
        height: 39px;
        opacity: 0.14;
        border: 1px solid #979797;
        line-height: 92px;
      }

      .uer-text {
        padding: 20px 10px;
        text-align: right;

        .uer-name {
          font-size: 16px;
          color: #323233;
          line-height: 22px;
          font-weight: 400;
        }
      }

      .user-num {
        font-size: 25px;
        font-family: MiSans-Bold, MiSans;
        font-weight: bold;
        color: #323233;
        line-height: 33px;
      }
    }
  }

  .search-box {
    // background: #FFFFFF;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex: 1;
    margin-top: 20px;
  }

  .operate-box {
    margin-bottom: 8px;

    .btn-item {
      margin-right: 25px;
    }
  }
}
</style>
