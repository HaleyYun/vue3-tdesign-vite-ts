<template>
  <div class="evaluation">
    <div class="box-img" @click="handlerRest">
      <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
      <t-button class="img-btn" theme="default" variant="text">报告详情</t-button>
    </div>
    <div class="evaluation-tittle">
      <span class="tittle-item"
        >项目名称：<span>{{ details.prodName ? details.prodName : '免费AMES快筛' }}</span></span
      >
      <div class="button">
        <!-- <div class="btn-left" @click="print"><span class="item">打印</span></div>
        <div class="btn-right" @click="derive"><span class="item">导出</span></div> -->
      </div>
    </div>
    <div class="basic">
      <div class="basic-left">
        <div class="project"><span class="icon"></span><span class="project-name">项目信息</span></div>
        <div class="project-content">
          <div class="left-title">评估员：</div>
          <div class="left-content">
            <span>{{ details.assessor }} </span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">报告单号：</div>
          <div class="left-content">
            <span>{{ details.estimateNum }}</span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">筛查类型：</div>
          <div class="left-content">
            <span v-if="details?.type == 1">游戏</span>
            <span v-if="details?.type == 2">量表</span>
            <span v-if="details?.type == 3">眼动</span>
          </div>
        </div>
        <div class="project-content">
          <div class="left-title">测评时间：</div>
          <div class="left-content">
            <div class="left-content">{{ details?.estimateTime }}</div>
          </div>
        </div>
        <!-- <div class="project-content">
          <div class="left-title">描述：</div>
          <div class="left-content">
            <div class="left-content">{{ details?.remark }}</div>
          </div>
        </div> -->
      </div>
      <div class="basic-right">
        <div class="project"><span class="icon"></span><span class="project-name">被评估人基本信息</span></div>
        <div class="basic-content">
          <div class="basic-avatar">
            <div>
              <t-avatar size="103px" image="http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/90bfdc43aa594d2abd0943357373d1d3.png" />
            </div>
            <div class="avatar-name">姓名：{{ baseDetails.name }}</div>
          </div>
          <div class="basic-line">
            <img src="../../assets/img/knowledge/line.png" alt="" />
          </div>
          <div class="basic-line-right">
            <div class="project-content">
              <div class="left-title">来源：</div>
              <div class="left-content">
                <span>{{ baseDetails.associatedOrganName ? baseDetails.associatedOrganName : details.customOrigin }} </span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">性别：</div>
              <div class="left-content">
                {{ baseDetails.sexDesc }}
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">年龄：</div>
              <div class="left-content">
                {{ baseDetails.age }}
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">文化程度：</div>
              <div class="left-content">
                <span>{{ baseDetails.educationDesc }}</span>
              </div>
            </div>
            <div class="project-content">
              <div class="left-title">联系电话：</div>
              <div class="left-content">
                <span>{{ baseDetails.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="assessment">
      <div class="assessment-title">
        <span class="icon"></span><span class="assessment-name">被评估人健康档案风险结果</span><span class="assessment-risk" v-if="baseDetails.riskType == '1'">低风险</span>
        <span class="assessment-risk" v-if="baseDetails.riskType == '2'">中风险</span>
        <span class="assessment-risk" v-if="baseDetails.riskType == '3'">高风险</span>
      </div>
      <!-- baseDetails.riskType -->
      <div class="assessment-article">
        <div class="assessment-schedule">
          <img src="../../assets/img/EvaluationDetails/rainbow.png" alt="" />
          <div class="assessment-cognize">高出</div>
          <div class="assessment-data">{{ baseDetails?.proportion }}%</div>
        </div>
      </div>
      <div class="assessment-description">
        <div class="description-img">
          <img src="../../assets/img/EvaluationDetails/warningPrompt.png" alt="" />
        </div>
      </div>

      <div class="assessment-warn">请注意，该算法会根据您的年龄和成绩来计算风险值。因此，不同年龄段的成绩将会有所不同，不能直接进行比较。</div>
      <div class="cognition">
        <div class="cognition-table">
          <t-table row-key="index" :data="resultsBasic" :columns="depressedColumns" size="medium" :resizable="true" hover table-layout="fixed">
            <template #parameter="{ row }">
              <span v-if="row.parameter == ''">--</span>
              <span v-else>{{ row.parameter }}</span>
            </template>
            <template #result="{ row }">
              <span v-if="row.result == ''">--</span>
              <span v-else>{{ row.result }}</span>
            </template>
          </t-table>
          <t-table style="margin: 0 30px" row-key="index" :data="resultsOneBasic" :columns="depressedColumns" size="medium" :resizable="true" hover table-layout="fixed">
            <template #parameter="{ row }">
              <span v-if="row.parameter == ''">--</span>
              <span v-else>{{ row.parameter }}</span>
            </template>
            <template #result="{ row }">
              <span v-if="row.result == ''">--</span>
              <span v-else>{{ row.result }}</span>
            </template>
          </t-table>
          <t-table row-key="index" :data="resultsTwoBasic" :columns="depressedColumns" size="medium" :resizable="true" hover table-layout="fixed">
            <template #parameter="{ row }">
              <span v-if="row.parameter == ''">--</span>
              <span v-else>{{ row.parameter }}</span>
            </template>
            <template #result="{ row }">
              <span v-if="row.result == ''">--</span>
              <span v-else>{{ row.result }}</span>
            </template>
          </t-table>
        </div>
      </div>
    </div>

    <!-- 风险指数 -->
    <div class="risk">
      <div class="risk-left">
        <div class="project"><span class="icon"></span><span class="project-name">风险指数和相关费用分析预测</span></div>
        <div class="risk-content">
          <div class="risk-title">
            预测<span>{{ smallGameReport.numResult1 }}</span
            >年后，会有患老年痴呆的风险
          </div>
          <div class="risk-figure">
            <echarts class="figure" :height="'248px'" :width="'385px'" :options="orderOption"> </echarts>
          </div>

          <div class="risk-result">
            您未来15年内，老年痴呆患病率为<span>{{ resultsItem }}%</span>
          </div>

          <div class="risk-expense">
            若患老年痴呆预计每年费用预计增加<span>{{ smallGameReport.numResult2 }}元</span>
          </div>
          <div class="risk-description">
            <div class="description-tittle">
              <img src="../../assets/img/EvaluationDetails/back.png" alt="" />
              <!-- <img src="../../assets/img/EvaluationDetails/identification.png" alt=""> -->
              <div class="tips">官方提示</div>
            </div>
            <div class="description-tittle1">
              <img class="img" src="../../assets/img/EvaluationDetails/identification.png" alt="" />
              <div class="description-content">风险预测结果来源于您的健康档案信息、AMES测评数值通过AI算法综合分析得出。</div>
            </div>
            <div class="description-tittle1">
              <img class="img" src="../../assets/img/EvaluationDetails/identification.png" alt="" />
              <div class="description-content">风险预测值仅供参考使用，如果您对预测值存在疑问可联系脑倍佳官方客服电话或通过脑倍佳小程序【线上预约服务】到线下机构做精准性筛查和相关问题咨询。</div>
            </div>
            <div class="description-tittle1">
              <img class="img" src="../../assets/img/EvaluationDetails/identification.png" alt="" />
              <div class="description-content">相关费用“主要是用于认知症患者的医疗护理和人工等相关费用。</div>
            </div>
            <div class="description-tittle1">
              <img class="img" src="../../assets/img/EvaluationDetails/identification.png" alt="" />
              <div class="description-content">注：脑卒中在国内呈高发病率、高致残率和高死亡率，目前40岁以上人群脑交中患者已达1200万以上，年增长速度达到8.7%，且趋向年轻化。脑卒中是国民死亡主要病因，已确诊中风存活患者中，约有3/4患者已不同程度丧失劳动能力，且遗留偏瘫、失语及痴呆等症状。</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-risk">
        <div class="risk-right">
          <div class="project"><span class="icon"></span><span class="project-name">脑建康认知评估风险结果</span></div>
          <div class="content-topRisk">
            <div class="topRisk-title">
              <div class="section-rank">
                <div class="rank-lamp">
                  <div class="img" style="height: 20px">
                    <img v-if="smallGameReport.riskValue >= 80 && smallGameReport.riskValue <= 1000" src="../../assets/img/EvaluationDetails/select.png" alt="" />
                  </div>

                  <div class="rank-lamp-box normal">正常</div>
                  <div class="rank-lamp-rank">80-100分</div>
                </div>
                <div class="rank-lamp">
                  <div class="img" v-if="smallGameReport.riskValue >= 71 && smallGameReport.riskValue < 80" style="height: 20px">
                    <img src="../../assets/img/EvaluationDetails/select.png" alt="" />
                  </div>

                  <div class="rank-lamp-box low">低风险</div>
                  <div class="rank-lamp-rank">71-79分</div>
                </div>
                <div class="rank-lamp">
                  <div class="img" v-if="smallGameReport.riskValue >= 11 && smallGameReport.riskValue < 71" style="height: 20px">
                    <img src="../../assets/img/EvaluationDetails/select.png" alt="" />
                  </div>

                  <div class="rank-lamp-box middle">中风险</div>
                  <div class="rank-lamp-rank">11-70分</div>
                </div>
                <div class="rank-lamp">
                  <div class="img" style="height: 20px">
                    <img v-if="smallGameReport.riskValue >= 0 && smallGameReport.riskValue < 11" src="../../assets/img/EvaluationDetails/select.png" alt="" />
                  </div>

                  <div class="rank-lamp-box high">高风险</div>
                  <div class="rank-lamp-rank">0-10分</div>
                </div>
              </div>
              <div class="section-content">
                <div class="section-title">
                  综合脑健康得分<span>{{ smallGameReport.riskValue > 100 ? 100 : smallGameReport.riskValue }}</span>
                </div>
                <div class="section-dec">
                  <span
                    >您的综合认知风险为<span v-if="smallGameReport.riskValue >= 0 && smallGameReport.riskValue < 11" class="high">高风险</span>
                    <span v-if="smallGameReport.riskValue >= 11 && smallGameReport.riskValue < 71" class="middle" style="">中风险</span>
                    <span v-if="smallGameReport.riskValue >= 71 && smallGameReport.riskValue < 80" class="low" style="">低风险</span>
                    <span v-if="smallGameReport.riskValue >= 80 && smallGameReport.riskValue <= 1000" class="normal" style="">正常</span>
                  </span>

                  <!-- <span><img src="../../assets/img/EvaluationDetails/bottom.png" alt="" /></span> -->
                </div>
              </div>
            </div>
            <div class="topRisk-table">
              <t-table row-key="index" :data="executionArr" :columns="decColumns" size="medium" :resizable="true" hover table-layout="fixed">
                <template #executionStr="{ row }">
                  <span v-if="row.executionStr">{{ row.executionStr }}</span>
                  <span v-if="row.languageAbilityStr">{{ row.languageAbilityStr }}</span>
                  <span v-if="row.memoryStr">{{ row.memoryStr }}</span>
                </template>
              </t-table>
            </div>
            <div class="bottom-topRisk">
              <span>围绕您的年龄和结果分综合分析，故判定您的脑健康属于</span>
              <span v-if="smallGameReport.riskValue >= 0 && smallGameReport.riskValue < 60"> <span class="topRisk-dec">AD</span>的风险，其中敏感性为<span class="topRisk-dec">98%</span>、特异性<span class="topRisk-dec">95%</span>。 </span>
              <span v-if="smallGameReport.riskValue >= 60 && smallGameReport.riskValue < 70"> <span class="topRisk-dec">MCI</span>的风险，其中敏感性为<span class="topRisk-dec">81.48%</span>、特异性<span class="topRisk-dec">80%</span>。 </span>
              <span v-if="smallGameReport.score >= 70 && smallGameReport.riskValue < 80"> <span class="topRisk-dec">SCD</span>的风险，其中敏感性为<span class="topRisk-dec">66.7%</span>、特异性<span class="topRisk-dec">65%</span>。 </span>
              <span v-if="smallGameReport.riskValue >= 80 && smallGameReport.riskValue <= 1000"> <span>优秀</span>。 </span>
            </div>
          </div>
        </div>
        <div class="content-bottomRisk">
          <div class="project"><span class="icon"></span><span class="project-name">认知风险能力解读</span></div>
          <div class="bottomRisk-tab">
            <t-tabs :default-value="1">
              <t-tab-panel :value="1" label="相册记忆">
                
                <div class="tab-item">
                  <t-table row-key="index" :data="reportData" :columns="reportColumns" size="medium" :resizable="true" hover table-layout="fixed"> </t-table>
                </div>
                <div class="risk-description">
                  <div class="description-tittle">
                    <img src="../../assets/img/EvaluationDetails/back.png" alt="" />
                    <div class="tips">报告解读</div>
                  </div>
                  <div class="description-tittle1">
                    <div class="description-content">{{ languageData.description }}</div>
                  </div>
                </div>
              </t-tab-panel>
              <t-tab-panel :value="2" label="数字点击">
                <div class="tab-item">
                  <t-table row-key="index" :data="memoryListData" :columns="reportColumns" size="medium" :resizable="true" hover table-layout="fixed"> </t-table>
                </div>
                <div class="risk-description">
                  <div class="description-tittle">
                    <img src="../../assets/img/EvaluationDetails/back.png" alt="" />
                    <div class="tips">报告解读</div>
                  </div>
                  <div class="description-tittle1">
                    <div class="description-content">{{ memoryData.description }}</div>
                  </div>
                </div>
              </t-tab-panel>
              <t-tab-panel :value="3" label="相册回忆">
                <div class="tab-item">
                  <t-table row-key="index" :data="carryListData" :columns="reportColumns" size="medium" :resizable="true" hover table-layout="fixed"> </t-table>
                </div>
                <div class="risk-description">
                  <div class="description-tittle">
                    <img src="../../assets/img/EvaluationDetails/back.png" alt="" />
                    <div class="tips">报告解读</div>
                  </div>
                  <div class="description-tittle1">
                    <div class="description-content">{{ carryData.description }}</div>
                  </div>
                </div>
              </t-tab-panel>
              <t-tab-panel :value="4" label="相册归类">
                <div class="tab-item">
                  <t-table row-key="index" :data="visionListData" :columns="reportColumns" size="medium" :resizable="true" hover table-layout="fixed"> </t-table>
                </div>
                <div class="risk-description">
                  <div class="description-tittle">
                    <img src="../../assets/img/EvaluationDetails/back.png" alt="" />
                    <div class="tips">报告解读</div>
                  </div>
                  <div class="description-tittle1">
                    <div class="description-content">{{ visionData.description }}</div>
                  </div>
                </div>
              </t-tab-panel>
            </t-tabs>
          </div>
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
import { depressedColumns, decColumns, reportColumns } from './data/configuration';
const route = useRoute();
const router = useRouter();
const baseDetails = ref<any>({}); //客户基本信息
const details = ref<any>({});
const smallGameReport = ref<any>({});
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
onMounted(() => {
  if (route.query.estimateNum) {
    estimateNum.value = route.query.estimateNum;
    archivesNo.value = route.query.archivesNo;
    getReport();
  }
});

const report = ref<any>({});

const resultsX = ref<any>([]);
const resultsY = ref<any>([]);
const resultsItem = ref<string>('');
const resultsBasic = ref([]); //数组1
const resultsOneBasic = ref([]); //数组2
const resultsTwoBasic = ref([]); //数组3
const executionArr = ref<any>([]);
const reportData = ref<any>([]); //报告语言
const memoryListData = ref<any>([]); //报告记忆
const carryListData = ref<any>([]); //报告执行
const visionListData = ref<any>([]); //报告视觉
const languageData = ref<any>({});
const memoryData = ref<any>({});
const visionData = ref<any>({});
const carryData = ref<any>({});
const getReport = () => {
  orderGetReport({ estimateNum: estimateNum.value, type: route.query.type }).then((res: any) => {
    if (res.code === 200) {
      report.value = res.data.estimateInfoResponse; //报告信息
      smallGameReport.value = res.data.report; //眼动信息Math.round
      //X轴信息
      resultsX.value = res.data.report.riskchatResults.map((item: any) => {
        return item.key;
      });

      //Y轴信息
      resultsY.value = res.data.report.riskchatResults.map((item: any) => {
        return item.value;
      });
      resultsItem.value = resultsY.value[resultsY.value.length - 1];
      resultsBasic.value = res.data.riskInfos[0];
      resultsOneBasic.value = res.data.riskInfos[1];
      resultsTwoBasic.value = res.data.riskInfos[2];
      let basicaArr = [] as any;
      let execution = {};

      execution = Object.assign(res.data.report.executionResult, { name: '执行能力' });
      basicaArr.push(execution);
      let language = {};

      language = Object.assign(res.data.report.languageAbilityResult, { name: '语言能力' });
      basicaArr.push(language);
      let memory = {};

      memory = Object.assign(res.data.report.memoryResult, { name: '记忆能力' });

      basicaArr.push(memory);
      executionArr.value = basicaArr;
      //报告解读
      details.value = res.data.estimateInfoResponse;
      baseDetails.value = res.data.personnelBaseInfo;
      languageData.value = res.data.report.resultsEntityList[0];
      reportData.value.push(languageData.value); //语言
      memoryData.value = res.data.report.resultsEntityList[1];
      memoryListData.value.push(memoryData.value); //记忆
      carryData.value = res.data.report.resultsEntityList[2];
      carryListData.value.push(carryData.value); //执行
      visionData.value = res.data.report.resultsEntityList[3];
      visionListData.value.push(visionData.value); //视觉
    }
  });
};
//风险
const orderOption = ref({
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
      data: resultsY,
      name: resultsX,
      type: 'line'
    }
  ]
});

//ba
const roundOption = ref({
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
        { value: 335, name: '新照片' },
        { value: 1548, name: '旧照片' }
      ]
    }
  ]
});
//----- 加载列表数据 ---------
// onMounted(() => {
//   // loadTableData();
// });
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
  if (route.query.status) {
    router.push({
      path: '/customDetails',
      query: {
        status: route.query.status,
        archivesNo: route.query.archives,
        associatedUsers: route.query.associatedUsers
      }
    });
  } else {
    router.back();
  }
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
    .tittle-item {
      font-size: 30px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      margin-left: 50px;
    }
    .button {
      display: flex;
      margin: 0 15px;
      .btn-left {
        width: 160px;
        height: 58px;
        margin-right: 50px;
        background: #ffffff;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 8px;
        line-height: 58px;
        text-align: center;
        .item {
          font-size: 20px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #5766fe;
          line-height: 28px;
          text-align: center;
        }
      }
      .btn-right {
        width: 160px;
        height: 58px;
        margin-right: 50px;
        background: #ffffff;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 8px;
        line-height: 58px;
        text-align: center;
        .item {
          font-size: 20px;
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
      .basic-content {
        display: flex;
        align-items: center;
        // justify-content: space-between;
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
            // margin: 16px 27px 0 60px;
            text-align: center;
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
      .assessment-risk {
        font-size: 20px;
        margin-top: 34px;
        font-family: MiSans-Bold, MiSans;
        font-weight: bold;
        color: #ff2800;
        line-height: 23px;
      }
    }

    .assessment-article {
      display: flex;
      align-items: center;
      flex-direction: column;
      .assessment-schedule {
        position: relative;
        .assessment-cognize {
          position: absolute;
          left: 233px;
          top: 100px;
          font-size: 28px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #ff8e07;
          line-height: 40px;
        }
        .assessment-data {
          position: absolute;
          left: 218px;
          top: 145px;
          font-size: 52px;
          font-family: MiSans-Bold, MiSans;
          font-weight: bold;
          color: #ff8e07;
          line-height: 69px;
        }
      }
    }
    .assessment-description {
      margin: 16px 23px 13px 32px;
      .description-img {
        display: flex;
        align-items: center;
        justify-content: center;
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
    //风险因素
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
      .cognition-table {
        display: flex;
      }
    }
  }
  //风险指数
  .risk {
    width: 100%;
    display: flex;
    .risk-left {
      width: 33%;
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
      .risk-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        .risk-title {
          font-size: 18px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #1b659d;
          line-height: 25px;
          span {
            font-size: 18px;
            font-family: MiSans-Bold, MiSans;
            font-weight: bold;
            color: #ff2800;
            line-height: 27px;
          }
        }
        .risk-figure {
          margin-bottom: 20px;
          .figure {
            width: 385px;
            height: 248px;
            background: #f9fcff;
          }
        }
        .risk-result {
          font-size: 17px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #1b659d;
          line-height: 24px;
          span {
            font-size: 17px;
            font-family: MiSans-Bold, MiSans;
            font-weight: bold;
            color: #ff2800;
            line-height: 27px;
          }
        }
        .risk-expense {
          font-size: 18px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #1b659d;
          line-height: 25px;
          span {
            font-size: 18px;
            font-family: MiSans-Bold, MiSans;
            font-weight: bold;
            color: #ff2800;
            line-height: 27px;
          }
        }
        .risk-description {
          background: #f5f9ff;
          border-radius: 6px;
          margin: 20px 19px;
          padding: 13px;
          .description-tittle {
            position: relative;
            .tips {
              position: absolute;
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              left: 17px;
              top: 1px;
            }
          }
          .description-tittle1 {
            display: flex;
            .description-content {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #6583a0;
              line-height: 19px;
              margin: 6px;
            }
            .img {
              width: 9px;
              height: 9px;
              margin-top: 10px;
            }
          }
        }
      }
    }

    .content-risk {
      width: 66%;
      display: flex;
      flex-direction: column;
      .risk-right {
        background: #ffffff;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 16px;
        // width: 66%;
        margin-left: 20px;
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
        .content-topRisk {
          .topRisk-title {
            margin-top: 14px;
            display: flex;
            justify-content: space-between;
            .section-rank {
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-left: 35px;
              .rank-lamp {
                position: relative;
                .img {
                  position: absolute;
                  left: 31px;
                  top: -12px;
                }
              }
              .rank-lamp-box {
                width: 76px;
                height: 26px;
                border-radius: 13px;
                margin-right: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
              }
              .normal {
                background: linear-gradient(169deg, #62e69f 0%, #5bd494 100%);
              }
              .low {
                background: linear-gradient(90deg, #fac46a 0%, #f1b04c 100%);
              }
              .middle {
                background: linear-gradient(93deg, #f1b04c 0%, #ed563b 100%);
              }
              .high {
                background: linear-gradient(87deg, #ed563b 0%, #ff0000 100%);
              }
              .rank-lamp-rank {
                font-size: 11px;
                font-weight: bold;
                color: #7ba4cb;
                margin-top: 7px;
                margin-left: 15px;
              }
            }
            .section-content {
              display: flex;
              margin-right: 29px;
              .section-title {
                font-size: 18px;
                font-family: PingFang-SC-Bold, PingFang-SC;
                font-weight: bold;
                color: #222222;
                padding-bottom: 26px;
                span {
                  font-size: 28px;
                  font-family: MiSans-Bold, MiSans;
                  font-weight: bold;
                  color: #55c38a;
                  line-height: 37px;
                }
              }
              .section-dec {
                font-size: 14px;
                font-family: PingFang-SC-Bold, PingFang-SC;
                font-weight: bold;
                color: #55c38a;
                line-height: 40px;
                margin-left: 35px;
                .dec {
                  color: #ff2800;
                  font-size: 14px;
                  line-height: 29px;
                }
              }
            }
          }
          .topRisk-table {
            padding: 30px;
          }
          .bottom-topRisk {
            // width: 576px;
            font-size: 14px;
            // font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #7c7c7c;
            line-height: 29px;
            text-align: center;
            padding-bottom: 30px;
            .topRisk-dec {
              color: #ff2800;
              font-size: 14px;
            }
          }
        }
      }
      .content-bottomRisk {
        background: #ffffff;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 16px;
        margin-left: 20px;
        margin-top: 20px;
        padding-bottom: 22px;
        .project {
          display: flex;
          flex-direction: row;
          position: relative;
          .icon {
            position: absolute;
            left: 25px;
            top: 15px;
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
            // margin-top: 22px;
          }
        }
        .bottomRisk-tab {
          padding: 10px 20px;
          .tab-item {
            padding-top: 40px;
          }
        }
        .risk-description {
          background: #f5f9ff;
          border-radius: 6px;
          padding: 23px;
          margin-top: 60px;
          .description-tittle {
            position: relative;
            .tips {
              position: absolute;
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              left: 17px;
              top: 1px;
            }
          }
          .description-tittle1 {
            display: flex;
            .description-content {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #6583a0;
              line-height: 19px;
              margin: 6px;
            }
            .img {
              width: 9px;
              height: 9px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
  .normal {
    color: #5bd494;
  }
  .low {
    color: #f1b04c;
  }
  .middle {
    color: #ed563b;
  }
  .high {
    color: #ff0000;
  }
}
</style>
