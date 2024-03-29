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
        <div class="project"><span class="icon"></span><span class="project-name">项目信息</span></div>
        <div class="project-content">
          <div class="left-title">评估员：</div>
          <div class="left-content">
            <span> </span><span>{{ report.assessor }} </span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">报告单号：</div>
          <div class="left-content">
            <span>{{ report.estimateNum }}</span>
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
            <div class="avatar-name">姓名:{{reportBase.name}}</div>
          </div>
          <div class="basic-line">
            <img src="../../assets/img/knowledge/line.png" alt="" />
          </div>
          <div class="basic-line-right">
            <div class="project-content">
              <div class="left-title">来源：</div>
              <div class="left-content">
                <span> </span><span>{{ reportBase.organName }} </span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">性别：</div>
              <div class="left-content">
                <span v-if="reportBase?.sex == 1">男</span>
                <span v-if="reportBase?.sex == 2">女</span>
                <span v-if="reportBase?.sex == 3">未知</span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">年龄：</div>
              <div class="left-content">
                {{ reportBase?.age }}
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">文化程度：</div>
              <div class="left-content">
                <span>{{ reportBase?.education }}</span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">联系电话：</div>
              <div class="left-content">
                <span>{{ reportBase?.phone }}</span>
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
            <div :style="{ position: 'absolute', left: riskValue + '%' }">
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

        <div class="description-content">您的认知障碍风险程度是根据综合分析您在任务过程中的眼动数据得出的，它反映了您患有认知功能障碍的整体风险。风险程度越靠近“10”，则意味着您面临的认知障碍风险越大。您的风险值为“xx”。</div>
      </div>

      <div class="assessment-warn">请注意，该算法会根据您的年龄和成绩来计算风险值。因此，不同年龄段的成绩将会有所不同，不能直接进行比较。</div>
    </div>
    <div class="cognition">
      <div class="cognition-title"><span class="icon"></span><span class="cognition-name">分项认知能力</span></div>
      <t-table row-key="index" :data="reportData" :columns="depressedColumns" size="medium" :resizable="true" hover table-layout="fixed"> 
        <template #referValue="{ row }">
          <div>{{ row.referValue }}{{ row.valueUnit }}</div>
        </template>
        <template #value="{ row }">
         
          <div>{{row.value*100 }}{{ row.valueUnit }}</div>
        </template>
      </t-table>
    </div>

    <!--自由观看任务 -->
    <div class="memoryTask">
      <div class="memoryTask-left">
        <div class="left-Data">
          <div class="memoryTask-title"><span class="icon"></span><span class="memoryTask-name">自由观看范式任务</span></div>
          <div class="left-quest">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit" @click="seePaly">任务操作回放</div>
          </div>
        </div>

        <div class="eye-content">
          <div class="eye-img">
            <div class="eye-line">
              <img src="../../assets/img/EvaluationDetails/liberty.png" alt="" />
            </div>
          </div>
        </div>
        <div class="memoryTask-description">
          <div class="memoryTask-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="memoryTask-title">任务说明</div>
          </div>

          <div class="memoryTask-content">自由观看范式任务（Free-viewing tasks）首先要求用户看屏幕中间数字，当屏幕出现人物相册，用户要做的事情就是自由观看这些人物表情。研究表明，不同的图像区域或对象可能引起不同的注视持续时间。可以用于表现情绪敏感性的状态。</div>
        </div>
      </div>

      <div class="twitchingData-right">
        <div class="right-Data">
          <div class="twitchingData-title"><span class="icon"></span><span class="twitchingData-name">数据统计</span></div>
          <div class="left-quest">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit" @click="seeData">数据统计详情</div>
          </div>
        </div>
        <div class="search-box">
          <echarts :options="roundOption" :width="'450px'" :height="'250px'" style="background: #fff"></echarts>
          <!-- <echarts :options="orderOption" :height="'244px'" style="background: #fff; width: 45%; margin-right: 16px"> </echarts> -->
        </div>
        <div class="memoryTask-description">
          <div class="description-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="memoryTask-title">结果说明</div>
          </div>

          <div class="memoryTask-content">它指的是一个完全集中注意力于特定的目标，研究注意力、视觉加工和视错觉等领域情况，它使视觉系统会在我们的盲点附近产生一种”填充效应”，使周围的圆圈似乎消失或淡化。一般抑郁患者更难集中注意力。</div>
        </div>
      </div>
    </div>
    <!--凝视范式任务 -->
    <div class="gazeTask">
      <div class="gazeTask-left">
        <div class="left-Data">
          <div class="gazeTask-title"><span class="icon"></span><span class="gazeTask-name">凝视范式任务</span></div>
          <div class="left-quest">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit" @click="seePaly">任务操作回放</div>
          </div>
        </div>
        <div class="content-title">
          <div class="title-left">注意环节</div>
          <div class="title-center">
            <div class="title-between">
              <span class="title-time">约20秒</span>
            </div>
            <div class="title-item">></div>
          </div>
          <div class="title-right">注意环节</div>
        </div>
        <div class="eye-content">
          <div class="eye-img">
            <div class="eye-line">
              <img src="../../assets/img/EvaluationDetails/gazeTask.png" alt="" />
            </div>
          </div>
        </div>
        <div class="gazeTask-description">
          <div class="gazeTask-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="gazeTask-title">任务说明</div>
          </div>

          <div class="gazeTask-content">凝视范式任务（Gaze Paradigm Task）用户盯着屏幕中心的红点，保持注意力直到任务结束，经调研表明，如果注意力足够集中，会发现旁边的圆圈会消失。有研究指出，抑郁患者更难集中注意力。</div>
        </div>
      </div>

      <div class="gazeTask-right">
        <div class="right-Data">
          <div class="twitchingData-title"><span class="icon"></span><span class="twitchingData-name">数据统计</span></div>
          <div class="left-quest">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit" @click="seeData">数据统计详情</div>
          </div>
        </div>
        <div class="search-box">
          <echarts :options="orderOption" :height="'244px'" style="background: #fff; width: 45%; margin-right: 16px"> </echarts>
        </div>
        <div class="gazeTask-description">
          <div class="description-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="gazeTask-title">结果说明</div>
          </div>

          <div class="gazeTask-content">它指的是一个完全集中注意力于特定的目标，研究注意力、视觉加工和视错觉等领域情况，它使视觉系统会在我们的盲点附近产生一种”填充效应”，使周围的圆圈似乎消失或淡化。一般抑郁患者更难集中注意力。</div>
        </div>
      </div>
    </div>
    <!--注意力任务 -->
    <div class="attentionTask">
      <div class="attention-left">
        <div class="left-Data">
          <div class="attention-title"><span class="icon"></span><span class="attention-name">注意力切换范式任务</span></div>
          <div class="left-quest">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit" @click="seePaly">任务操作回放</div>
          </div>
        </div>

        <div class="eye-content">
          <div class="eye-img">
            <div class="eye-line">
              <img src="../../assets/img/EvaluationDetails/attention.png" alt="" />
            </div>
          </div>
        </div>
        <div class="attention-item">
          <div class="item-left">注意环节</div>
          <div class="item-right">测试环节</div>
        </div>
        <div class="attention-description">
          <div class="attention-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="attention-title">任务说明</div>
          </div>

          <div class="attention-content">
            注意切换范式任务（Visual attention shifting task）首先屏幕左右呈现两张头像，任务开始后，会出现一个绿框提示，用户需要看向绿框提示的头像，当另一边的头像上出现绿框提示时，立刻看向另一边头像直到提示结束。研究表明，倾向于过度关注消极刺激，并且难以将注意从消极刺激转移到其他刺激上。
          </div>
        </div>
      </div>

      <div class="attention-right">
        <div class="right-Data">
          <div class="twitchingData-title"><span class="icon"></span><span class="twitchingData-name">数据统计</span></div>
          <div class="left-quest">
            <div class="quest-img"><img src="../../assets/img/EvaluationDetails/play.png" alt="" /></div>
            <div class="quest-edit" @click="seeData">数据统计详情</div>
          </div>
        </div>
        <div class="search-box">
          <echarts :options="orderOption" :height="'244px'" style="background: #fff; width: 45%; margin-right: 16px"> </echarts>
          <echarts :options="orderOption" :height="'244px'" style="background: #fff; width: 45%; margin-right: 16px"> </echarts>
        </div>
        <div class="attention-description">
          <div class="description-img">
            <img src="../../assets/img/EvaluationDetails/reportIcon.png" alt="" />
            <div class="attention-title">结果说明</div>
          </div>

          <div class="attention-content">它指的是一个人完全沉浸和深深陷入其情感、思想和经验中的能力。情感沉浸是情感处理的一个重要方面，它使一个人能够探索和理解他们对生活中事件的感受和反应。一般认为具有较强负面情感沉浸度的个体更容易产生对于负面刺激的整体性的注意偏向。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from 'vue';
import echarts from '../../component/baseEcharts.vue';
import { Data } from './data/configuration';
import { getHealthRecordsDetailById } from '../../request/modules/CustomApi';
import { orderGetReport } from '../../request/modules/EstimateApi';
import { useRouter, useRoute } from 'vue-router';
import { estimateOrder } from '../../request/modules/EstimateApi';
import { depressedColumns, depressedData } from './data/configuration';
const route = useRoute();
const router = useRouter();
const recordDetails = <any>{}; //客户基本信息
const recordsDetailHealth = <any>{}; //客户详情
const smallReport = ref<any>(); //风险指数
// 打印
const print = () => {};
// 导出
const derive = () => {};

let messageData = ref([{ id: 1, name: '张大大', sex: '男', age: '50', educational: '小学', telephone: '1586486465', channel: '小程序' }]);
// 评估人风险
let result = ref('高风险');

let resultData = ref([{ id: 1, name: '张大大', sex: '男', age: '50', educational: '小学', telephone: '1586486465', channel: '小程序', hyperlipemia: 'aaaaa', hypertension: 'bbbbbbb', Hyperglycemia: 'ccccccc' }]);

const tab = ref(1);
const handlerChange = (newValue: any) => {
  console.log(newValue);
};
// 图形识别
let graphColumns = ref([
  { colKey: 'mistake', title: '错误数' },
  { colKey: 'correct', title: '正确数' },
  { colKey: 'score', title: '得分' },
  { colKey: 'result', title: '结果' }
]);
let graphData = ref([{ id: 1, mistake: '55', correct: '55', score: '80', result: '偏低' }]);
// echarts
const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 150, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};

const estimateNum = ref<any>('');
const archivesNo = ref<any>('');
const archivesType = ref<any>('');
onMounted(() => {
  if (route.query.estimateNum) {
    estimateNum.value = route.query.estimateNum;
    archivesNo.value = route.query.archivesNo;
    archivesType.value = route.query.type;
    getHealthRecords();
    getReport();
  }
});

const getHealthRecords = () => {
  getHealthRecordsDetailById({ archivesNo: archivesNo.value }).then((res: any) => {
    if (res.code === 200) {
      recordDetails.value = res.data.healthRecordsBase;
      recordsDetailHealth.value = res.data.healthRecordsDetail;
      console.log(recordsDetailHealth.value, 'wwwwww');
    }
  });
};
const report = ref<any>({});
const riskValue = ref<any>({});
  
const smallGameReport = ref<any>({});
const reportBase = ref<any>({});
const reportData = ref<any>([]); //客户详情
const getReport = () => {
  orderGetReport({ estimateNum: estimateNum.value, type: archivesType.value }).then((res: any) => {
    if (res.code === 200) {
      report.value = res.data.estimateInfoResponse; //报告信息
      reportBase.value=res.data.archiveInfoResponse; //被评估人信息
      smallGameReport.value = res.data.smallGameReport; //眼动信息
      console.log(smallGameReport.value, ' smallGameReport.value');
    }
    reportData.value = res.data.report.capabilityTable;
    riskValue.value=res.data.report.riskValue == 0 ? -2.5 : res.data.report.riskValue * 10 - 3; //眼动信息;
    smallReport.value = res.data.report;//报告信息
  });
};
//抑郁
const orderOption = ref({
  legend: {},
  tooltip: {},
  dataset: {
    dimensions: ['product', '2015', '2016'],
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

//ba
const roundOption = ref({
  tooltip: {
    trigger: 'item'
    // formatter: '{b} : {c} ({d}%)'
  },
  title: {
    text: '照片停留时间',
    // padding: [20, 20, 20, 20],
    left: 'center',
    bottom: -5,
    textStyle: {
      fontSize: 18,
      color: '#222222'
    }
  },
  legend: {
    orient: 'vertical',
    x: 'right',
    align: 'left',
    right: 8,
    data: ['积极照片', '消极照片', '中立照片'],
    textStyle: {
      fontSize: 15, //字体大小
      color: '#222222' //字体颜色
    }
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
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
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      data: [
        {
          value: 25,
          name: '中立照片',
          itemStyle: {
            color: '#D0D4FF'
          }
        }, //字体颜色
        {
          value: 25,
          name: '消极照片',
          itemStyle: {
            color: '#5766FE' //字体颜色
          }
        },
        {
          value: 50,
          name: '积极照片',
          itemStyle: {
            color: '#ACB3FF' //字体颜色
          }
        }
      ]
    }
  ]
});
//----- 加载列表数据 ---------
onMounted(() => {
  // loadTableData();
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
  router.push('/StatisticalRecord');
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
      padding: 10px 0;
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
      // padding: 10px 0;
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
            // margin: 16px 27px 0 60px;
          }
        }
        .basic-line {
          // margin: 0 12px;
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
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 48px;
        margin-left: 40px;
        margin-top: 22px;
      }
    }
  }

  //自由观看任务
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

      .memoryTask-description {
        margin: 29px 23px 13px 32px;
        .memoryTask-img {
          display: flex;
          margin-bottom: 5px;
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

    .eye-content {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;
      margin-top: 91px;

      .eye-img {
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-left: 25px;

        .eye-line {
          border: 1px dashed #f06c18;
          width: 88%;
          margin-left: 26px;
          img {
            width: 100%;
          }
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
        margin-right: 30px;
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
      .search-box {
        // background: #FFFFFF;
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 49px;
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
  //凝视范式任务
  .gazeTask {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;
    margin: 20px 0;
    .gazeTask-left {
      width: 48%;

      .left-Data {
        display: flex;
        justify-content: space-between;
        .gazeTask-title {
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
          .gazeTask-name {
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

      .gazeTask-description {
        margin: 29px 23px 13px 32px;
        .gazeTask-img {
          display: flex;
          margin-bottom: 5px;
          .gazeTask-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .gazeTask-content {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 20px;
        }
      }
    }
    .content-title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 67px;
      margin-bottom: 14px;
      .title-left {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #505050;
        line-height: 22px;
      }
      .title-center {
        display: flex;
        align-items: center;
        margin: 0 30px;
        .title-between {
          position: relative;
          border-bottom: 1px dashed #f06c18;
          width: 180px;
          .title-time {
            position: absolute;
            left: 61px;
            bottom: 12px;
            font-size: 22px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #f06c18;
            line-height: 23px;
          }
        }
        .title-item {
          color: #f06c18;
        }
      }

      .title-right {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #505050;
        line-height: 22px;
      }
    }
    .eye-content {
      // display: flex;
      width: 100%;

      // align-items: center;
      // flex-direction: column;

      .eye-img {
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-left: 25px;

        .eye-line {
          border: 1px dashed #f06c18;
          width: 88%;
          margin-left: 26px;
          img {
            width: 100%;
          }
        }
      }
    }

    .gazeTask-right {
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
        margin-right: 30px;
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
      .search-box {
        // background: #FFFFFF;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        margin-top: -1px;
      }
      .gazeTask-description {
        margin: 29px 23px 13px 32px;
        .description-img {
          display: flex;
          margin-bottom: 5px;
          .gazeTask-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .gazeTask-content {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 25px;
        }
      }
    }
  }

  //注意力任务
  .attentionTask {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;
    margin: 20px 0;
    .attention-left {
      width: 48%;

      .left-Data {
        display: flex;
        justify-content: space-between;
        .attention-title {
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
          .attention-name {
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

      .attention-description {
        margin: 29px 23px 13px 32px;
        .attention-img {
          display: flex;
          margin-bottom: 5px;
          .attention-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .attention-content {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 20px;
        }
      }
    }
    .eye-content {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;

      .eye-img {
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-left: 25px;
        margin-top: 81px;

        .eye-line {
          border: 1px dashed #f06c18;
          width: 88%;
          margin-left: 26px;
          img {
            width: 100%;
          }
        }
      }
    }
    .attention-item {
      display: flex;
      justify-content: space-around;
      margin-top: 17px;
      .item-left {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #505050;
        line-height: 22px;
      }
      .item-right {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #505050;
        line-height: 22px;
      }
    }

    .attention-right {
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
        margin-right: 30px;
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
      .search-box {
        // background: #FFFFFF;
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 11px;
      }
      .attention-description {
        margin: 29px 23px 13px 32px;
        .description-img {
          display: flex;
          .attention-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 14px;
          }
        }
        .attention-content {
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
