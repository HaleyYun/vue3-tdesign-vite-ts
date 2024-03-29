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
      <div class="assessment-text">
        <div class="leftText"><span>0</span><span style="margin-left: 5px">低</span></div>
        <div class="assessment-article">
          <div class="assessment-cognize">综合脑健康得分</div>
          <div class="assessment-content">
            <div class="assessment-schedule">
              <div :style="{ position: 'absolute', left: smallGameReport + '%' }">
                <img src="../../assets/img/EvaluationDetails/markers.png" alt="" />
                <div class="schedule">
                  您的位置 <span style="color: #3d7eff">{{ reportData }}</span>
                </div>
              </div>
              <!-- <div class="low">低</div>
            <div class="high">高</div> -->
            </div>
          </div>
        </div>
        <div class="rightText"><span>高</span><span style="margin-left: 5px">8</span></div>
      </div>

      <div class="assessment-description">
        <div class="description-img">
          <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
          <div class="description-title">报告说明</div>
        </div>

        <div class="description-content">
          您的AD-8测评风险程度是根据综合分析您在任务过程中执行数据得出，它反映了您患有认知障碍的整体风险，风险程度2分及以上可能存在认知障碍。您的风险值为“<span>{{ reportData }}</span
          >”。
        </div>
      </div>

      <div class="assessment-warn">请注意，该算法会根据您的年龄和成绩来计算风险值。因此，不同年龄段的成绩将会有所不同，不能直接进行比较。</div>
    </div>
    <div class="cognition">
      <div class="cognition-right">
        <div class="project"><span class="icon"></span><span class="project-name">数据统计</span></div>
        <div class="cognition-chart">
          <div style="width: 420px; height: 400px" id="putCharts"></div>
          <!-- <div class="cognition-dec">(年龄)</div> -->
          <div class="cognition-cover"></div>
        </div>
        <div class="statistics-content-result">
          <div class="statistics-content-result-title">结果说明：</div>
          <div class="statistics-content-result-content">
            如果以上问题，您回答“是，有变化”达2项及以上，您需要去医生处就诊，并向医生描述您在您家人身上观察到的变化。很多因素会导致健忘，一些是可逆的。您也许并没有在您家人身上观察到以上这些具体表现，但是也许您对他们最近一些行为举止的改变感到担忧；这张筛查表能帮助您确定是否存在问题，但是，请注意，只有医生能诊断阿尔茨海默症或者其他类型痴呆，请和您的医生一起来确定您的家人究竟发生了什么问题。
          </div>
        </div>
      </div>
      <div class="cognition-left">
        <div class="project"><span class="icon"></span><span class="project-name">脑健康综合能力分析</span></div>
        <div class="analyze-content">
          <div class="analyze">
            <div class="analyze-chart">
              <div style="width: 500px; height: 470px" id="analyzeCharts"></div>
            </div>
            <div class="analyze-tips">
              <div class="tips-name">
                <div class="name-icon"></div>
                <div>用户数据</div>
              </div>
              <div class="tips-edge">
                <div class="edge-icon"></div>
                <div>边界值</div>
              </div>
            </div>
            <div class="analyze-note">注：脑健康能力值在分界线以上均为正常</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-statement">
        AD-8记忆障碍自评量表是美国华盛顿大学于2005年开发的8题探访问卷，是临床使用的用于极早期痴呆症筛查的医学量表。它也可供家属使用，作为疾病风险的评估。就临床而言，痴呆可能是源于阿尔茨海默症、血管形痴呆、路易体痴呆或额颞叶痴呆。本量表侧重于患者是否产生了八种特定的“变化”，通过观察回答来帮助家属筛查痴呆症状。建议家属定期使用本量表，对比患者是否有特定的情形变化。
      </div>
      <div class="footer-lable">注意：</div>
      <div class="footer-declaration">该筛查表不能用来诊断您的家人是否存在疾病，只能确定他／她是否需要就诊检查。</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from 'vue';
import * as echarts from 'echarts';
import { orderGetADReport } from '../../request/modules/EstimateApi';
import { useRouter, useRoute } from 'vue-router';
import { estimateOrder } from '../../request/modules/EstimateApi';
const route = useRoute();
const router = useRouter();
let search = reactive<any>({
  putCharts: '',
  analyzeCharts: ''
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
  let chartfDom = document.getElementById('putCharts');
  search.putCharts = echarts.init(chartfDom as any);
  let data = [0, 0];

  echartsPut(data); //data

  let analyzeDom = document.getElementById('analyzeCharts');
  search.analyzeCharts = echarts.init(analyzeDom as any);
  let analyzeData = ['0', '0', '0', '0'];

  echartsAnalyze(analyzeData);
});
onBeforeUnmount(() => {
  search.putCharts.dispose();
  search.analyzeCharts.dispose();
});
//认知
const echartsPut = (data: any) => {
  let option = {
    color: ['#3A84FE', '#FFD00C', '#FF980C'],
    legend: {
      orient: 'vertical',
      right: 'right'
    },

    series: [
      {
        type: 'pie',
        radius: '70%',
        label: {
          normal: {
            show: true,
            position: 'inner',
            formatter: '{c}',
            color: '#ffffff'
          }
        },
        data: [
          { value: data.firPhotoSduration == 0 ? '' : data.firPhotoSduration, name: '是' },
          { value: data.secPhotoDuration == 0 ? '' : data.secPhotoDuration, name: '否' },
          { value: data.thirdPhotoDuration == 0 ? '' : data.thirdPhotoDuration, name: '不知道' }
        ]
      }
    ]
  };
  option && search.putCharts.setOption(option);
};
//分析analyzeData: any
const echartsAnalyze = (analyzeData: any) => {
  let option = {
    // tooltip: {
    //   formatter: '{c}%' //这是关键，在需要的地方加上就行了
    // },
    color: ['#3A84FE', '#3A84FE', '#3A84FE', '#3A84FE'],
    grid: {
      left: '2%',
      right: '4%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['记忆力', '数理能力', '语言能力', '情绪状态'],
        // axisTick: {
        //   alignWithLabel: true
        // },
        axisTick: {
          show: true, // 是否显示坐标轴刻度
          inside: true, // 坐标轴刻度是否朝内，默认朝外
          length: 6, //坐标轴刻度的长度
          lineStyle: {
            color: '#FFF', //刻度线的颜色
            width: 10, //坐标轴刻度线宽
            type: 'solid' //坐标轴线线的类型（solid实线类型；dashed虚线类型；dotted点状类型）
          }
        },
        axisLabel: {
          show: true,
          interval: 0,
          // rotate: 30,
          fontSize: '13px',
          textStyle: {
            color: '#7BA4CB'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        minInterval: 1,
        maxInterval: 100,
        interval: 2, // 步长
        min: 0, // 起始
        max: 10, // 终止
        axisLabel: {
          show: true,
          // formatter: '{value}%',
          textStyle: {
            color: '#A8C3DC'
          }
        }
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '30%',
        data: analyzeData,
        // data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          normal: {
            //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
            // barBorderRadius: [4, 4, 0, 0],
            label: {
              show: true,
              position: 'top'
              // formatter: '\n{c}%' //这是关键，在需要的地方加上就行了
            }
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#222222'
        },
        markLine: {
          symbol: ['none', 'none'], //去掉箭头
          itemStyle: {
            normal: {
              lineStyle: { type: 'solid', color: '#FFBC44', width: 3 }, // 样式： 线型、颜色、线宽
              label: {
                show: false,
                position: 'middle'
              }
            }
          },
          data: [
            {
              yAxis: 8
            }
          ]
        }
      }
    ]
  };
  option && search.analyzeCharts.setOption(option);
};

const report = ref<any>({}); //基本信息
const reportNot = ref<any>({}); //是否不知道
const reportData = ref<any>({}); //分数
const archiveInfo = ref<any>({}); //被评估信息
const smallGameReport = ref<any>(); //风险指数
const putOffData = ref<any>({}); //眼动数据图表
const roundList = ref<any>({}); //照片数据图表
const getReport = () => {
  orderGetADReport({ estimateNum: estimateNum.value, type: archivesType.value }).then((res: any) => {
    if (res.code == 200) {
      archiveInfo.value = res.data.archiveInfoResponse;
      report.value = res.data.estimateInfoResponse; //报告基本信息
      smallGameReport.value = res.data.report.riskValue == 0 ? -2.5 : res.data.report.riskValue * 10 - 3; //眼动信息
      putOffData.value = res.data.report.eyeTable;
      reportData.value = res.data.report.riskValue;
      roundList.value = res.data.report.imageMemoryTable;
      reportNot.value = res.data.report;

      echartsPut(reportNot.value);
      let analyzeData = [reportNot.value.thirdCapacityValue, reportNot.value.secCapacityValue, reportNot.value.fourthCapacityValue, reportNot.value.firCapacityValue];
      echartsAnalyze(analyzeData);
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
const seePaly = () => {
  router.push('/PlaybackRecord');
};
//查看数据
const seeData = () => {
  let path = '/StatisticalRecord';
  router.push({
    path,
    query: {
      estimateNum: estimateNum.value,
      archivesNo: archivesNo.value,
      type: 3,
      status: 0
    }
  });
};
//查看凝视
const seeGazeData = () => {
  let path = '/StatisticalRecord';
  router.push({
    path,
    query: {
      estimateNum: estimateNum.value,
      archivesNo: archivesNo.value,
      type: 3,
      status: 1
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
    .assessment-text {
      display: flex;
      text-align: center;
      width: 100%;
      padding: 0 10px;
      .leftText {
        display: flex;
        width: 80px;
        height: 40px;
        justify-content: center;
        margin-right: 5px;
        margin-top: 42px;
        align-items: center;
        background: url(../../assets/img/EvaluationDetails/proLeft.png);
        & > span {
          display: block;
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #757575;
          line-height: 30px;
          // margin-right: 5px;
        }
      }
      .assessment-article {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        .assessment-cognize {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 42px;
        }
        .assessment-content {
          width: 100%;
          // padding: 0 10px;
          .assessment-schedule {
            position: relative;
            width: 100%;
            height: 42px;
            background: linear-gradient(90deg, #2eae1d 0%, #29d30e 26%, #ffbc0c 62%, #d42114 100%);
            border-radius: 25px;
            .schedule {
              font-size: 18px;
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
      .rightText {
        width: 80px;
        height: 40px;
        display: flex;
        margin-left: 5px;
        margin-right: 28px;
        margin-top: 45px;
        justify-content: center;
        align-items: center;
        background: url(../../assets/img/EvaluationDetails/proRight.png);
        & > span {
          display: block;
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #757575;
          line-height: 30px;
          margin-left: 5px;
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
  //年龄认知
  .cognition {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .cognition-left {
      width: 49%;
      background: #ffffff;
      box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;

      .project {
        display: flex;
        flex-direction: row;
        position: relative;
        .icon {
          position: absolute;
          left: 25px;
          top: 33px;
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
          margin-top: 18px;
        }
      }
    }
    .cognition-right {
      width: 49%;
      background: #ffffff;
      box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;
      // padding: 10px 0;
      .statistics-content-result {
        margin: 20px;
        padding: 14px;
        background: linear-gradient(180deg, #faffff 0%, #fafeff 100%);
        box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        border: 1px solid #f1f6fc;
        .statistics-content-result-title {
          font-size: 20px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #6c6b72;
          line-height: 18px;
        }
        .statistics-content-result-content {
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6c6b72;
          line-height: 30px;
        }
      }

      .project {
        display: flex;
        flex-direction: row;
        position: relative;
        .icon {
          position: absolute;
          left: 25px;
          top: 33px;
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
          margin-top: 18px;
        }
        .project-person {
          width: 62px;
          height: 25px;
          background: linear-gradient(147deg, #6d64ff 0%, #3493ff 100%);
          box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
          border-radius: 13px;
          border: 2px solid #ffffff;
          margin-left: 5px;
          margin-top: 31px;
          text-align: center;

          .person {
            font-size: 13px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #ffffff;
            line-height: 18px;
            text-align: center;
          }
        }
      }

      .basic-content {
        display: flex;
        align-items: center;
        margin-bottom: 35px;
        .basic-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 110px;
          margin-right: 57px;

          .avatar-name {
            width: 168px;
            height: 33px;
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 33px;
            text-align: center;
            // margin: 16px 27px 0 60px;
          }
        }

        .basic-line-right {
          // flex-grow: 3;
          .project-content {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            .left-title {
              font-size: 18px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #222222;
              line-height: 25px;
              margin-right: 38px;
            }
            .left-content {
              font-size: 18px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #222222;
              line-height: 25px;
              display: inline-block;
              width: 120px;
              text-align: justify;
              text-justify: distribute-all-lines;
            }
          }
        }
      }
    }
    .head-dec {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 6px;
      .dec-content {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 5px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 6px;
      }
      .content-icon {
        width: 22px;
        height: 22px;
        border-radius: 13px;
        margin-left: 8px;
        margin-right: 2px;
      }
    }

    .cognition-chart {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .cognition-dec {
        position: absolute;
        font-size: 5px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #989898;
        line-height: 6px;
        bottom: 35px;
        right: 172px;
      }
      // .cognition-cover{
      //   position: absolute;
      //   width: 1.12rem;
      //   height: .9067rem;
      //   background: red;
      //   left: .08rem;
      //   top: 5.76rem;
      // }
    }
  }
  .analyze-content {
    // padding: 0.32rem;
    margin: 0 7px;
    background: #ffffff;
    // background: url('../../assets/image/report/back.png');
    .analyze {
      margin: 0 7px;
      margin-bottom: 22px;
      .analyze-head {
        display: flex;
        align-items: center;
        height: 17px;
        width: 100%;
        background: #3c86fe;
        border-radius: 4px 4px 0 0;
        .analyze-title {
          padding-left: 6px;
          font-size: 7px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #ffffff;
          line-height: 7px;
        }
      }
      .analyze-chart {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 86px;
      }
      .analyze-tips {
        display: flex;
        justify-content: center;
        font-size: 13px;
        margin-top: 25px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        .tips-name {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 9px;
          .name-icon {
            width: 22px;
            height: 8px;
            background: linear-gradient(180deg, #5e99ff 0%, #3a84fe 100%);
            border-radius: 1px;
            margin-right: 3px;
          }
        }
        .tips-edge {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 9px;
          .edge-icon {
            width: 22px;
            height: 8px;
            background: #ffbc44;
            border-radius: 1px;
            margin-right: 3px;
          }
        }
      }
      .analyze-note {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8d8d8d;
        line-height: 7px;
        margin-top: 36px;
        // padding: 0 0.6933rem;
      }
    }
  }
  .footer {
    padding: 20px;
    text-align: center;
    margin-bottom: 50px;
    .footer-statement {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a0a0a0;
      line-height: 26px;
    }
    .footer-lable,
    .footer-declaration {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #767676;
      line-height: 24px;
    }
  }
}
</style>
