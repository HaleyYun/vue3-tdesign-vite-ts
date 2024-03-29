<template>
  <div class="evaluation">
    <div class="box-img" @click="handlerRest">
      <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
      <t-button class="img-btn" theme="default" variant="text">报告详情</t-button>
    </div>
    <div class="evaluation-tittle">
      <div class="pos"></div>
      <span class="tittle-item">脑健康筛查</span>
      <div class="button">
        <div class="btn-left" @click="print"><span class="item">打印</span></div>
        <div class="btn-right" @click="derive"><span class="item">导出</span></div>
      </div>
    </div>
    <div class="basic">
      <div class="basic-left">
        <div class="project"><span class="icon"></span><span class="project-name">项目名称</span></div>
        <div class="project-content">
          <div class="left-title">评估员：</div>
          <div class="left-content">
            <span></span><span>{{ report.assessor }}</span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">报告单号：</div>
          <div class="left-content">
            <span>{{ report?.estimateNum }}</span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">筛查类型：</div>
          <div class="left-content">
            <span v-if="report?.type == 1">游戏</span>
            <span v-if="report?.type == 2">量表</span>
            <span v-if="report?.type == 3">眼动</span>
            <span v-if="report?.type == 4">抑郁</span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">测评时间：</div>
          <div class="left-content">
            <div class="left-content">{{ report?.estimateTime }}</div>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">描述：</div>
          <div class="left-content">
            <div class="left-content">{{ report?.remark }}</div>
          </div>
        </div>
      </div>
      <div class="basic-right">
        <div class="project"><span class="icon"></span><span class="project-name">被评估人基本信息</span></div>
        <div class="basic-content">
          <div class="basic-avatar">
            <div>
              <t-avatar size="103px" image="http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/90bfdc43aa594d2abd0943357373d1d3.png" />
            </div>
            <div class="avatar-name">姓名：{{ archiveInfo.name }}</div>
          </div>
          <div class="basic-line">
            <img src="../../assets/img/knowledge/line.png" alt="" />
          </div>
          <div class="basic-line-right">
            <div class="project-content">
              <div class="left-title">来源：</div>
              <div class="left-content">
                <span></span><span>{{ archiveInfo.organName }}</span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">性别：</div>
              <div class="left-content">
                <span v-if="archiveInfo?.sex == 1">男</span>
                <span v-if="archiveInfo?.sex == 2">女</span>
                <span v-if="archiveInfo?.sex == 3">未知</span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">年龄：</div>
              <div class="left-content">{{ archiveInfo.age }}</div>
            </div>
            <div class="project-content">
              <div class="left-title">文化程度：</div>
              <div class="left-content">
                <span>{{ archiveInfo.education }}</span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">联系电话：</div>
              <div class="left-content">
                <span>{{ archiveInfo.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="assessment">
      <div class="assessment-title"><span class="icon"></span><span class="assessment-name">风险评估结果</span></div>
      <div class="assessment-article">
        <div class="assessment-cognize">认知障碍风险程度</div>
        <div class="assessment-content">
          <div class="assessment-schedule">
            <div :style="{ position: 'absolute', left: smallGameReport + '%' }">
              <img src="../../assets/img/EvaluationDetails/markers.png" alt="" />
              <div class="schedule">您的位置</div>
            </div>
            <div class="low">低</div>
            <div class="high">高</div>
          </div>
        </div>
      </div>
      <div class="assessment-description">
        <div class="description-img">
          <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
          <div class="description-title">报告说明</div>
        </div>

        <div class="description-content">您的认知障碍风险程度是根据综合分析您在任务过程中的眼动数据得出的，它反映了您患有认知功能障碍的整体风险。风险程度越靠近“10”，则意味着您面临的认知障碍风险越大。您的风险值为“{{ riskValue }}”。</div>
      </div>

      <div class="assessment-warn">请注意，该算法会根据您的年龄和成绩来计算风险值。因此，不同年龄段的成绩将会有所不同，不能直接进行比较。</div>
    </div>
    <div class="cognition">
      <div class="cognition-title"><span class="icon"></span><span class="cognition-name">分项认知能力</span></div>
      <t-table row-key="index" :data="cognizeData" :columns="cognizeColumns" size="medium" :resizable="true" hover table-layout="fixed"> </t-table>
    </div>
    <!-- 眼跳 -->
    <div class="twitchingData">
      <div class="twitchingData-left">
        <div class="left-Data">
          <div class="twitchingData-title"><span class="icon"></span><span class="twitchingData-name">眼跳任务</span></div>
          <div class="left-quest" @click="seePaly('one')">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit">任务操作回放</div>
          </div>
        </div>
        <div class="twitching-Data">
          <div class="twitchingData-time">
            <span class="time-name">注意时间</span>
          </div>
          <div class="twitchingData-clue">
            <div class="clue-content">
              <span class="clue-name">线索目标</span>
              <span class="clue-img"></span>
              <span class="clue-eye">反向眼跳</span>
            </div>

            <div class="eye">
              <div class="eye-content">
                <div class="eye-content-twitching">
                  <span class="eye-reactivity">反应延迟</span>
                  <div class="eye-line">
                    <img src="../../assets/img/EvaluationDetails/lineIcon.png" alt="" />
                  </div>
                </div>
              </div>
              <div class="twitching-eye">
                <span class="eye-name">眼跳反应</span>
              </div>
            </div>
          </div>
        </div>
        <div class="eye-img">
          <div>
            <img class="img-item" src="../../assets/img/EvaluationDetails/eyeImg1.png" alt="" />
          </div>

          <div>
            <img class="img-item" src="../../assets/img/EvaluationDetails/eyeImg2.png" alt="" />
          </div>
          <div>
            <img class="img-item" src="../../assets/img/EvaluationDetails/eyeImg3.png" alt="" />
          </div>
        </div>
        <div class="twitchingData-description">
          <div class="description-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="description-title">任务说明</div>
          </div>

          <div class="description-content">反向眼跳任务（Anti-saccade）首先要求用户看屏幕中间，当屏幕旁边出现刺激点的时候，看向屏幕另一边空白处。研究表明，反向眼跳任务的错误增加反映了大脑抑制加工的失败，可以用于表现执行功能的状况。</div>
        </div>
      </div>

      <div class="twitchingData-right">
        <div class="right-Data">
          <div class="twitchingData-title"><span class="icon"></span><span class="twitchingData-name">数据统计</span></div>
          <div class="left-quest" @click="seeData">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit">数据统计详情</div>
          </div>
        </div>
        <div class="search-box">
          <div class="search-put">
            <!-- <div class="box-chart"> -->
              <div style="width: 300px; height: 300px" id="putCharts"></div>
            <!-- </div> -->
            <div class="put">延迟时间</div>
          </div>
          <div class="search-right">
            <!-- <div class="box-chart"> -->
              <div style="width: 300px; height: 300px" id="rightCharts"></div>
            <!-- </div> -->
            <div class="right">正确率</div>
          </div>
        </div>
        <div class="memoryTask-description">
          <div class="description-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="memoryTask-title">结果说明</div>
          </div>

          <div class="memoryTask-content">
            反应延迟时间是指刺激出现与您产生首次眼动之间的时间间隔。通常认为，延迟时间越长，说明反应能力较差。正确率则衡量了您是否能够按照任务要求进行首次眼跳，并与任务要求的方向保持一致。一般而言，执行功能表现得越差，正确率就越低。图表中展示的是您的成绩与正常老人成绩的对比情况。
          </div>
        </div>
      </div>
    </div>
    <!--图片记忆任务 -->
    <div class="memoryTask">
      <div class="memoryTask-left">
        <div class="left-Data">
          <div class="memoryTask-title"><span class="icon"></span><span class="memoryTask-name">图片记忆任务</span></div>

          <div class="left-quest" @click="seePaly('two')">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit">任务操作回放</div>
          </div>
        </div>

        <div class="eye-content">
          <div class="eye-time">约3分钟</div>
          <div class="eye-img">
            <div class="eye-line">
              <img style="width: 550px" src="../../assets/img/EvaluationDetails/memory.png" alt="" />
            </div>
          </div>
        </div>
        <div class="memoryTask-dec">
          <div class="dec-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="memoryTaskTitle">任务说明</div>
          </div>

          <div class="memoryTaskTitle">
            图片记忆任务（Visual Paired
            Comparison，VPC)通过比较一个人花在看一张新图片和他们以前看过的图片的时间比例来评估识别记忆。在记忆功能正常的人中，会花更多时间看新图片。相比之下，有记忆困难的人表现在新的和熟悉的图片之间的注视时间分布比较平均。VPC任务已被证明能可靠地检测灵长类动物和人类的记忆功能障碍。
          </div>
        </div>
      </div>

      <div class="twitchingData-right">
        <div class="right-Data">
          <div class="twitchingData-title"><span class="icon"></span><span class="twitchingData-name">数据统计</span></div>
          <div class="left-quest" @click="seeGazeData">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit">数据统计详情</div>
          </div>
        </div>
        <div class="search-box">
          <div class="search-put">
            <!-- <div class="box-chart"> -->
            <div style="width: 300px; height: 300px" id="roundCharts"></div>
          <!-- </div> -->
          <div class="put">新旧停留时间</div>
          </div>
       
          <div class="search-right">
            <!-- <div class="box-chart"> -->
            <div style="width: 300px; height: 300px" id="orderCharts"></div>
          <!-- </div> -->
          <div class="right">凝视持续时间</div>
          </div>
        
        </div>
        <div class="memoryTask-description">
          <div class="description-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="memoryTask-title">结果说明</div>
          </div>

          <div class="memoryTask-content">
            新旧照片的驻留时长，体现了您在任务过程中观察新旧照片的时间。通常来说，新照片的驻留时间越长，意味着您对原有照片的记忆越清晰，表现出更强的记忆能力。凝视时长则反映了您在任务过程中对图片的关注稳定性。凝视时长越长，某种程度上表示您在关注图片时所展现出的信心更为充足。图表中展示的是您的成绩与正常老人成绩的对比情况。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from 'vue';
import * as echarts from 'echarts';
import { orderGetReport, estimateOrder } from '../../request/modules/EstimateApi';
import { useRouter, useRoute } from 'vue-router';
import { cognizeColumns } from './data/configuration';
import { json } from 'stream/consumers';
const route = useRoute();
const router = useRouter();
const cognizeData = ref<any>([]); //客户详情
let search = reactive<any>({
  putCharts: '',
  rightCharts: '',
  roundCharts: '',
  orderCharts: ''
});
// 打印
const print = () => {};
// 导出
const derive = () => {};

const estimateNum = ref<any>('');
const archivesNo = ref<any>('');
const archivesType = ref<any>('');
onMounted(() => {
  if (route.query.estimateNum) {
    estimateNum.value = route.query.estimateNum;
    archivesNo.value = route.query.archivesNo;
    archivesType.value = route.query.type;
    getReport();
  }
  //延迟时间
  let charfDom = document.getElementById('putCharts');
  search.putCharts = echarts.init(charfDom as any);
  let data = {
    key: ['用户', '常模'],
    value: ['2000', '2000']
  };
  echartsPut(data);
  //正确率
  let charsDom = document.getElementById('rightCharts');
  search.rightCharts = echarts.init(charsDom as any);
  let rightData = {
    key: ['用户', '常模'],
    value: ['100', '2002']
  };
  echartsRight(rightData);

  //环形
  let roundDom = document.getElementById('roundCharts');
  search.roundCharts = echarts.init(roundDom as any);
  let roundData = {
    key: ['用户', '常模'],
    value: ['20', '20']
  };
  echartsRound(roundData);
  //凝视时间
  let orderDom = document.getElementById('orderCharts');
  search.orderCharts = echarts.init(orderDom as any);
  let orderData = {
    key: ['用户', '常模'],
    value: ['2000', '1000']
  };
  echartsOrder(orderData);
});
onBeforeUnmount(() => {
  search.putCharts.dispose();
  search.rightCharts.dispose();
  search.roundCharts.dispose();
  search.orderCharts.dispose();
});
//眼动延迟时间
const echartsPut = (data: any) => {
  let option = {
    legend: {},
    tooltip: {},
    grid: {
      left: '60',
      // right: "5%",
      // bottom: "3%",
      // top:"2%"
      width: 'auto'
      // height: "280px",
      // containLabel: true
    },
    dataset: {
      dimensions: ['product', '用户', '常模'],
      source: [
        { product: '朝向眼跳', 用户: data.value[0] },
        { product: '反向眼跳', 常模: data.value[1] }
        // { product: '反向眼跳', 常模: 20.1, 2016: 73.4 }
      ]
    },
    xAxis: {
      type: 'category'
      //  data: ['00', '00', '00', '00']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#BCAF9F',
          shadowColor: '#654925',
          // barBorderRadius: [30, 30, 0, 0],
          borderType: 'dashed'
        }
      },
      {
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#654925',
          shadowColor: '#654925',
          // barBorderRadius: [30, 30, 0, 0],
          borderType: 'dashed'
        }
      }
    ]
  };
  option && search.putCharts.setOption(option);
};
//正确率
const echartsRight = (rightData: any) => {
  let option = {
    legend: {},
    tooltip: {},
    grid: {
      left: '60',
      // right: "5%",
      // bottom: "3%",
      // top:"2%"
      width: 'auto'
      // height: "280px",
      // containLabel: true
    },
    dataset: {
      dimensions: ['product', '用户', '常模'],
      source: [
        { product: '朝向眼跳', 用户: rightData.value[0] },
        { product: '反向眼跳', 常模: rightData.value[1] }
        // { product: '反向眼跳', 常模: 20.1, 2016: 73.4 }
      ]
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#BCAF9F',
          shadowColor: '#654925',
          borderType: 'dashed'
        }
      },

      {
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#654925',
          shadowColor: '#654925',
          // barBorderRadius: [30, 30, 0, 0],
          borderType: 'dashed'
        }
      }
    ]
  };
  option && search.rightCharts.setOption(option);
};
//环形
const echartsRound = (roundData: any) => {
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      top: -5,
      // height: 10,
      data: ['新照片', '旧照片']
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        data: [
          { value: roundData.value[0], name: '新照片' },
          { value: roundData.value[1], name: '旧照片' }
        ]
      }
    ]
  };
  option && search.roundCharts.setOption(option);
};
//凝视时间
const echartsOrder = (orderData: any) => {
  let option = {
    legend: {},
    tooltip: {},
    grid: {
      left: '60',
      // right: "5%",
      // bottom: "3%",
      // top:"2%"
      width: 'auto'
      // height: "280px",
      // containLabel: true
    },
    dataset: {
      dimensions: ['product', '用户', '常模'],
      source: [
        { product: '朝向眼跳', 用户: orderData.value[0] },
        { product: '反向眼跳', 常模: orderData.value[1] }
      ]
    },
    xAxis: {
      type: 'category'
      //  data: ['00', '00', '00', '00']
    },
    yAxis: {
      type: 'value'
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#BCAF9F',
          shadowColor: '#654925',
          // barBorderRadius: [30, 30, 0, 0],
          borderType: 'dashed'
        }
      },
      {
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#654925',
          shadowColor: '#654925',
          // barBorderRadius: [30, 30, 0, 0],
          borderType: 'dashed'
        }
      }
    ]
  };
  option && search.orderCharts.setOption(option);
};

const report = ref<any>({}); //基本信息
const archiveInfo = ref<any>({}); //被评估信息
const smallGameReport = ref<any>(); //风险指数
const riskValue = ref('');
const putOffData = ref<any>({}); //眼动数据图表
const roundList = ref<any>({}); //照片数据图表

const getReport = () => {
  orderGetReport({ estimateNum: route.query.estimateNum, type: archivesType.value }).then((res: any) => {
    if (res.code == 200) {
      cognizeData.value = res.data.report.capabilityTable;
      archiveInfo.value = res.data.archiveInfoResponse;
      report.value = res.data.estimateInfoResponse; //报告基本信息
      smallGameReport.value = res.data.report.riskValue == 0 ? -2.5 : res.data.report.riskValue * 10 - 3; //眼动信息
      putOffData.value = res.data.report.eyeTable;
      riskValue.value = res.data.report.riskValue;
      roundList.value = res.data.report.imageMemoryTable;
      let data = {
        value: [putOffData.value[0].referValue, putOffData.value[3].referValue]
      };
      echartsPut(data);
      //正确率
      let rightData = {
        value: [putOffData.value[1].referValue, putOffData.value[2].referValue],
        key: ['用户', '常模']
      };
      echartsRight(rightData);

      //环形
      let roundData = {
        value: [roundList.value[0].referValue, roundList.value[1].referValue],
        key: ['用户', '常模']
      };
      echartsRound(roundData);
      //凝视
      let orderData = {
        value: [roundList.value[4].referValue, roundList.value[3].referValue],
        key: ['用户', '常模']
      };
      echartsOrder(orderData);
    }
  });
};

const orderOption = ref({
  legend: {},
  tooltip: {},
  dataset: {
    dimensions: ['product', '用户', '常模'],
    source: [
      { product: '朝向眼跳', 2015: 43.3, 2016: 85.8 },
      { product: '反向眼跳', 2015: 20.1, 2016: 73.4 }
    ]
  },
  xAxis: {
    type: 'category'
    //  data: ['00', '00', '00', '00']
  },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [
    {
      type: 'bar',
      barWidth: '15%',
      itemStyle: {
        color: '#BCAF9F',
        shadowColor: '#654925',
        // barBorderRadius: [30, 30, 0, 0],
        borderType: 'dashed'
      }
    },
    {
      type: 'bar',
      barWidth: '15%',
      itemStyle: {
        color: '#654925',
        shadowColor: '#654925',
        // barBorderRadius: [30, 30, 0, 0],
        borderType: 'dashed'
      }
    }
  ]
});

const tableData = ref<any>([]);
const formSearch = reactive<any>({
  archivesNo: '',
  customName: '',
  estimateServeName: '',
  estimateServerType: '',
  organId: '',
  organIds: [],
  pageSize: 10,
  pageNum: 1,
  timeData: []
});
const loadTableData = () => {
  estimateOrder(formSearch).then((res: any) => {
    if (res.code == '200') {
      tableData.value = res.data.data;
      console.log(tableData.value);
    }
  });
};
const handlerRest = () => {
  router.go(-1);
};
//查看回放
const seePaly = (el: string) => {
  router.push({
    path: '/PlaybackRecord',
    query: {
      str: el,
      estimateNum: estimateNum.value
    }
  });
};
//查看数据
const seeData = () => {
  let path = '/StatisticalRecord';
  router.push({
    path,
    query: {
      dataList: JSON.stringify(putOffData.value)
    }
  });
};
//查看凝视
const seeGazeData = () => {
  let path = '/StatisticalRecord';
  router.push({
    path,
    query: {
      dataList: JSON.stringify(roundList.value)
    }
  });
};
</script>

<style lang="scss" scoped>
.evaluation {
  width: 100%;
  overflow-y: scroll;
  .box-img {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .img-btn {
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 30px;
    }
  }
  .evaluation-tittle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 100%;
    height: 100px;
    background-color: #5766fe;
    .pos {
      width: 350px;
    }
    .tittle-item {
      font-size: 30px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }

    .button {
      display: flex;
      .btn-left {
        // width: 160px;
        // height: 58px;
        margin: 0 50px;
        background: #ffffff;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 8px;
        line-height: 58px;
        text-align: center;
        .item {
          font-size: 20px;
          padding: 30px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #5766fe;
          line-height: 28px;
          text-align: center;
        }
      }
      .btn-right {
        // width: 160px;
        // height: 58px;
        margin-right: 50px;
        background: #ffffff;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 8px;
        line-height: 58px;
        text-align: center;
        .item {
          font-size: 20px;
          padding: 30px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #5766fe;
          line-height: 28px;
        }
      }
    }
  }
  //基本信息
  .basic {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    .basic-left {
      width: 49%;
      background: #ffffff;
      box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;
      // padding: 14px 41px 32px 44px;
      .project {
        display: flex;
        flex-direction: row;
        position: relative;
        .icon {
          position: absolute;
          left: 25px;
          top: 35px;
          width: 6px;
          height: 23px;
          background: #5766fe;
          border-radius: 5px;
        }
        .project-name {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 48px;
          margin-left: 40px;
          margin-top: 22px;
        }
      }

      .project-content {
        display: flex;
        justify-content: space-between;
        padding: 14px 40px;
        .left-title {
          font-size: 14px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #7c7c7c;
          line-height: 33px;
        }
        .left-content {
          font-size: 14px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 33px;
        }
      }
    }
    .basic-right {
      width: 49%;
      background: #ffffff;
      box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;
      // padding: 14px 60px 32px 44px;
      .project {
        display: flex;
        flex-direction: row;
        position: relative;
        .icon {
          position: absolute;
          left: 25px;
          top: 35px;
          width: 6px;
          height: 23px;
          background: #5766fe;
          border-radius: 5px;
        }
        .project-name {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 48px;
          margin-left: 40px;
          margin-top: 22px;
        }
      }
      .basic-content {
        display: flex;
        align-items: center;
        .basic-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-grow: 1;
          .avatar-name {
            width: 168px;
            height: 33px;
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 33px;
            text-align: center;
          }
        }
        .basic-line {
        }
        .basic-line-right {
          flex-grow: 3;
          .project-content {
            display: flex;
            justify-content: space-between;
            padding: 14px 40px;
            .left-title {
              font-size: 14px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #7c7c7c;
              line-height: 33px;
            }
            .left-content {
              font-size: 14px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #222222;
              line-height: 33px;
            }
          }
        }
      }
    }
  }
  // 风险评估结果
  .assessment {
    background: #ffffff;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;

    .assessment-title {
      display: flex;
      flex-direction: row;
      position: relative;
      .icon {
        position: absolute;
        left: 25px;
        top: 35px;
        width: 6px;
        height: 23px;
        background: #5766fe;
        border-radius: 5px;
      }
      .assessment-name {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 48px;
        margin-left: 40px;
        margin-top: 22px;
      }
    }

    .assessment-article {
      display: flex;
      align-items: center;
      flex-direction: column;
      .assessment-cognize {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 42px;
      }
      .assessment-content {
        width: 85%;
        // padding: 0 10px;
        .assessment-schedule {
          position: relative;
          width: 100%;
          height: 42px;
          background: linear-gradient(90deg, #2eae1d 0%, #29d30e 26%, #ffbc0c 62%, #d42114 100%);
          border-radius: 25px;
          .schedule {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #636262;
          }
          .low {
            position: absolute;
            left: 20px;
            top: 7px;
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 28px;
            text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
          }
          .high {
            position: absolute;
            right: 20px;
            top: 7px;
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 28px;
            text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
    .assessment-description {
      margin: 56px 23px 13px 32px;
      .description-img {
        display: flex;
        .description-title {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 14px;
        }
      }
      .description-content {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 25px;
      }
    }
    .assessment-warn {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #b7b7b7;
      line-height: 22px;
      text-align: center;
      padding-bottom: 14px;
    }
  }
  //分项认知能力
  .cognition {
    background: #ffffff;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;
    margin: 20px 0;
    .cognition-title {
      display: flex;
      flex-direction: row;
      position: relative;
      .icon {
        position: absolute;
        left: 25px;
        top: 35px;
        width: 6px;
        height: 23px;
        background: #5766fe;
        border-radius: 5px;
      }
      .cognition-name {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 48px;
        margin-left: 40px;
        margin-top: 22px;
      }
    }
  }
  //眼跳数据
  .twitchingData {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;
    margin: 20px 0;
    .twitchingData-left {
      width: 48%;
      .left-Data {
        display: flex;
        justify-content: space-between;
        .twitchingData-title {
          display: flex;
          flex-direction: row;
          position: relative;

          .icon {
            position: absolute;
            left: 25px;
            top: 35px;
            width: 6px;
            height: 23px;
            background: #5766fe;
            border-radius: 5px;
          }
          .twitchingData-name {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 48px;
            margin-left: 40px;
            margin-top: 22px;
          }
        }
        .left-quest {
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
          border-radius: 50px;
          border: 1px solid #5766fe;
          margin-top: 31px;
          cursor: pointer;
          .quest-img {
            margin-left: 13px;
          }
          .quest-edit {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5766fe;
            margin: 0 10px;
            line-height: 20px;
          }
        }
      }

      .twitchingData-description {
        margin: 29px 23px 13px 32px;
        .description-img {
          display: flex;
          .description-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .description-content {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 25px;
        }
      }
      .twitching-Data {
        display: flex;
        .twitchingData-time {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 210px;
          height: 37px;
          margin-top: 36px;
          margin-left: 25px;

          background: #3d7eff;
          border-radius: 19px;
          .time-name {
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #ffffff;
            line-height: 22px;
          }
        }
        .twitchingData-clue {
          width: 100%;
          margin-top: 75px;

          .clue-content {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            background: #ffffff;
            border-radius: 19px;
            border: 1px solid #5766fe;
            margin-bottom: 8px;
            .clue-name {
              font-size: 16px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #5766fe;
              line-height: 30px;
              margin-right: 16px;
            }
            .clue-img {
              width: 16px;
              height: 16px;
              background: #ff0000;
              border-radius: 19px;
            }
            .clue-eye {
              font-size: 16px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #ff0000;
              line-height: 22px;
            }
          }
          .eye {
            display: flex;
            align-items: center;
            justify-content: center;
            .eye-content {
              // width: 20%;

              .eye-content-twitching {
                .eye-line {
                  margin-bottom: 10px;
                }
                .eye-reactivity {
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #f06c18;
                  margin-left: 35px;
                  line-height: 17px;
                }
              }
            }

            .twitching-eye {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 80%;
              background: #3d7eff;
              border-radius: 19px;
              .eye-name {
                font-size: 16px;
                font-family: PingFang-SC-Bold, PingFang-SC;
                font-weight: bold;
                color: #ffffff;
                line-height: 30px;
              }
            }
          }
        }
      }
    }
    .eye-img {
      display: flex;
      justify-content: space-between;
      margin-left: 27px;
      margin-top: 40px;
      .img-item {
        width: 177px;
        height: 150px;
      }
    }
    .twitchingData-right {
      width: 48%;
      .right-Data {
        display: flex;
        justify-content: space-between;
        .twitchingData-title {
          display: flex;
          flex-direction: row;
          position: relative;

          .icon {
            position: absolute;
            left: 25px;
            top: 35px;
            width: 6px;
            height: 23px;
            background: #5766fe;
            border-radius: 5px;
          }
          .twitchingData-name {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 48px;
            margin-left: 40px;
            margin-top: 22px;
          }
        }
        .left-quest {
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
          border-radius: 50px;
          border: 1px solid #5766fe;
          margin-top: 31px;
          margin-right: 20px;
          cursor: pointer;
          .quest-img {
            margin-left: 13px;
          }
          .quest-edit {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5766fe;
            margin: 0 15px;
            line-height: 20px;
          }
        }
      }
      .right-Data {
        display: flex;
        justify-content: space-between;
        .twitchingData-title {
          display: flex;
          flex-direction: row;
          position: relative;
          .icon {
            position: absolute;
            left: 25px;
            top: 35px;
            width: 6px;
            height: 23px;
            background: #5766fe;
            border-radius: 5px;
          }
          .twitchingData-name {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 48px;
            margin-left: 40px;
            margin-top: 22px;
          }
        }
      }

      .search-box {
        // background: #FFFFFF;
        display: flex;
        justify-content: space-between;

        margin-top: 20px;
        .search-put {
          display: flex;
          flex-direction: column;
          align-items: center;
          .box-chart {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400px;
            border-radius: 16px;
            background-color: #ffffff;
          }
          .put {
        
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 25px;
            text-align: center;
          }
        }
        .search-right {
          display: flex;
          flex-direction: column;
          align-items: center;

          .box-chart {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400px;
            border-radius: 16px;
            background-color: #ffffff;
          }
          .right {
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 25px;
          }
        }
      }
      .memoryTask-description {
        margin: 29px 23px 13px 32px;
        .description-img {
          display: flex;
          .memoryTask-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .memoryTask-content {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 25px;
        }
      }
    }
  }
  //图片记忆任务
  .memoryTask {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;
    margin: 20px 0;
    .memoryTask-left {
      width: 48%;
      

      .left-Data {
        display: flex;
        justify-content: space-between;

        .memoryTask-title {
          display: flex;
          flex-direction: row;
          position: relative;

          .icon {
            position: absolute;
            left: 25px;
            top: 35px;
            width: 6px;
            height: 23px;
            background: #5766fe;
            border-radius: 5px;
          }
          .memoryTask-name {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 48px;
            margin-left: 40px;
            margin-top: 22px;
          }
        }
        .left-quest {
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
          border-radius: 50px;
          border: 1px solid #5766fe;
          margin-top: 31px;
          cursor: pointer;
          .quest-img {
            margin-left: 13px;
          }
          .quest-edit {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5766fe;
            margin: 0 10px;
            line-height: 20px;
          }
        }
        
      }

    
    .eye-content {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;
      margin-top: 70px;
      .eye-time {
        font-size: 22px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #f06c18;
        line-height: 23px;
        margin-bottom: 5px;
      }

      .eye-img {
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-left: 25px;
        // margin-top: 25px;

        .eye-line {
          border: 1px dashed #f06c18;
          // width: 85%;
          margin-left: 20px;
        }
      }
    }
    .memoryTask-dec {
        margin: 120px 23px 13px 32px;
        .dec-img {
          display: flex;
          .memoryTaskTitle {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .memoryTaskTitle {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 25px;
        }
      }
    }
   

    .twitchingData-right {
      width: 48%;
      .right-Data {
        display: flex;
        justify-content: space-between;
        .twitchingData-title {
          display: flex;
          flex-direction: row;
          position: relative;

          .icon {
            position: absolute;
            left: 25px;
            top: 35px;
            width: 6px;
            height: 23px;
            background: #5766fe;
            border-radius: 5px;
          }
          .twitchingData-name {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 48px;
            margin-left: 40px;
            margin-top: 22px;
          }
        }
      }
      .left-quest {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 50px;
        border: 1px solid #5766fe;
        margin-top: 31px;
        margin-right: 20px;
        cursor: pointer;
        .quest-img {
          margin-left: 13px;
        }
        .quest-edit {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5766fe;
          margin: 0 15px;
          line-height: 20px;
        }
      }
      .search-box {
        // background: #FFFFFF;
        display: flex;
        justify-content: space-between;
        margin-top: 41px;
        .search-put {
          // display: flex;
          // flex-direction: column;
          // align-items: center;
          .box-chart {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400px;
            border-radius: 16px;
            background-color: #ffffff;
          }
          .put {
            text-align: center;
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 25px;
          }
        }
        .search-right {
          display: flex;
          flex-direction: column;
          align-items: center;

          .box-chart {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400px;
            border-radius: 16px;
            background-color: #ffffff;
          }
          .right {
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 25px;
          }
        }
      }
      .memoryTask-description {
        margin: 29px 23px 13px 32px;
        .description-img {
          display: flex;
          .memoryTask-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .memoryTask-content {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 25px;
        }
      }
    }
  }
}
</style>
