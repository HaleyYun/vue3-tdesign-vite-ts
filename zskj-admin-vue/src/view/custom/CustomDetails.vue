<template>
  <div class="cunstom-details">
    <t-tabs v-model:value="tabsActiveValue" theme="card" @change="tabsChange">
      <t-tab-panel value="1" label="基础信息">
        <div class="basic">
          <div class="basic-right">
            <div class="project">
              <span class="icon"></span><span class="project-name">{{ healthRecordsBaseInfo?.name }}</span
              ><span class="project-person"><span class="person">本人</span></span>
            </div>
            <div class="basic-content">
              <div class="basic-avatar">
                <div class="avatar-box">
                  <t-avatar size="103px" image="http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/8a0f5fd442b344b18c76e0ed4d42278e.png" />
                </div>
              </div>
              <div class="basic-line-right">
                <div class="project-content">
                  <div class="left-title">年&nbsp;&nbsp;龄：</div>
                  <div class="left-content">
                    <span> </span><span>{{ formSearch.age }} </span>
                  </div>
                </div>
                <div class="project-content">
                  <div class="left-title">性&nbsp;&nbsp;别：</div>
                  <div class="left-content">
                    <span>{{ healthRecordsBaseInfo?.sexDesc }}</span>
                  </div>
                </div>
                <div class="project-content">
                  <div class="left-title">出生日期：</div>
                  <div class="left-content">
                    {{ healthRecordsBaseInfo?.birthday }}
                  </div>
                </div>
                <div class="project-content">
                  <div class="left-title">手机号码：</div>
                  <div class="left-content">
                    <span>{{ healthRecordsBaseInfo?.phone }}</span>
                  </div>
                </div>
                <div class="project-content">
                  <div class="left-title">教育背景:</div>
                  <div class="left-content">
                    <span>{{ healthRecordsBaseInfo?.educationDesc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isShow" class="basic-left">
            <div class="project">
              <span class="icon"></span><span class="project-name">脑健康指数（BHI）</span>
              <div class="project-right" v-if="bhiResponse?.bhi">
                <div class="box-btn" @click="goDetails">
                  <span class="box-item">查看详情</span>
                </div>
                <div v-if="reportPDF != ''" class="box-btn" @click="downReport">
                  <img src="../../assets/img/knowledge/download.png" alt="图标" />
                  <span class="box-item">下载报告</span>
                </div>
              </div>
            </div>
            <h2 v-if="!bhiResponse?.bhi">暂无脑健康指数~</h2>
            <div class="project-basic" v-else>
              <div class="basic-title">脑健康指数（BHI）</div>
              <div class="basic-num">
                <span v-if="bhiResponse?.riskType == '1'" style="color: #3c86fe">{{ bhiResponse?.bhi }}</span>
                <span v-if="bhiResponse?.riskType == '2'" style="color: #ffe96d">{{ bhiResponse?.bhi }}</span>
                <span v-if="bhiResponse?.riskType == '3'" style="color: #ffa76d">{{ bhiResponse?.bhi }}</span>
                <span v-if="bhiResponse?.riskType == '4'" style="color: #ff7474">{{ bhiResponse?.bhi }}</span>
              </div>
              <div class="evaluation">
                综合评价:认知风险为:
                <span v-if="bhiResponse?.riskType == '1'" style="color: #3c86fe">{{ bhiResponse?.riskTypeDesc }}</span>
                <span v-if="bhiResponse?.riskType == '2'" style="color: #ffe96d">{{ bhiResponse?.riskTypeDesc }}</span>
                <span v-if="bhiResponse?.riskType == '3'" style="color: #ffa76d">{{ bhiResponse?.riskTypeDesc }}</span>
                <span v-if="bhiResponse?.riskType == '4'" style="color: #ff7474">{{ bhiResponse?.riskTypeDesc }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="info-box">
          <div class="health-files">
            <div class="title-box">
              <div class="line"></div>
              <div class="title">健康档案</div>
            </div>
            <div class="info-dateil">
              <div class="info-item item-1">
                <p>身高:</p>
                <p :class="!healthList.hea_height ? 'nullText' : ''">
                  {{ healthList.hea_height ? healthList.hea_height + 'cm' : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>糖尿病:</p>
                <p :class="!healthList.hea_diabet ? 'nullText' : ''">
                  {{ healthList.hea_diabet ? healthList.hea_diabet : '未知-' }}
                </p>
              </div>
              <div class="info-item item-1">
                <p>体重:</p>
                <p :class="!healthList.hea_weight ? 'nullText' : ''">
                  {{ healthList.hea_weight ? healthList.hea_weight + 'kg' : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>收缩压:</p>
                <p :class="!healthList.hea_press_up ? 'nullText' : ''">
                  {{ healthList.hea_press_up ? healthList.hea_press_up + 'mmHg ' : '未知-' }}
                </p>
              </div>
              <div class="info-item item-1">
                <p>血压情况:</p>
                <p :class="!healthList.hea_press ? 'nullText' : ''">
                  {{ healthList.hea_press ? pressEnum[healthList.hea_press] : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>舒张压:</p>
                <p :class="!healthList.hea_press_down ? 'nullText' : ''">
                  {{ healthList.hea_press_down ? healthList.hea_press_down + 'mmHg ' : '未知-' }}
                </p>
              </div>
              <div class="info-item item-1">
                <p>血脂情况:</p>
                <p :class="!healthList.hea_tc ? 'nullText' : ''">
                  {{ healthList.hea_tc ? tcEnum[healthList.hea_tc] : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>总胆固醇:</p>
                <p :class="!healthList.hea_tc_num ? 'nullText' : ''">
                  {{ healthList.hea_tc_num ? healthList.hea_tc_num + 'mmol/L' : '未知-' }}
                </p>
              </div>
              <div class="info-item item-1">
                <p>运动量:</p>
                <p :class="!healthList.hea_motion ? 'nullText' : ''">
                  {{ healthList.hea_motion ? healthList.hea_motion + '次/周' : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>脑血管:</p>
                <p :class="!healthList.hea_brain ? 'nullText' : ''">
                  {{ healthList.hea_brain ? heartEnum[healthList.hea_brain] : '未知-' }}
                </p>
              </div>
              <div class="info-item item-1">
                <p>心脏病:</p>
                <p :class="!healthList.hea_heart ? 'nullText' : ''">
                  {{ healthList.hea_heart ? heartEnum[healthList.hea_heart] : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>比历史记忆更差:</p>
                <p :class="!healthList.hea_memory_loss ? 'nullText' : ''">
                  {{ healthList.hea_memory_loss ? heartEnum[healthList.hea_memory_loss] : '未知-' }}
                </p>
              </div>
              <div class="info-item item-1">
                <p>抑郁状态:</p>
                <p :class="!healthList.hea_dpe ? 'nullText' : ''">
                  {{ healthList.hea_dpe ? heartEnum[healthList.hea_dpe] : '未知-' }}
                </p>
              </div>
              <div class="info-item item-2">
                <p>APOE 4基因类型:</p>
                <p :class="!healthList.hea_aope ? 'nullText' : ''">
                  {{ healthList.hea_aope ? heartEnum[healthList.hea_aope] : '未知-' }}
                </p>
              </div>
            </div>
          </div>
          <div class="medical-files">
            <div class="title-box">
              <div class="line"></div>
              <div class="title">病史档案</div>
            </div>
            <div class="class-item" v-for="(item, index) in medicalList" :key="index">
              <div class="class-name">{{ item.name }}</div>
              <div class="class-details">
                <p v-for="(arrItem, arrIndex) in item.arr" :key="arrIndex" :class="item.name == '患病情况:' ? 'keynote' : ''">
                  {{ arrItem }}
                </p>
              </div>
            </div>
          </div>
          <div class="habit-or-motion">
            <div class="habit">
              <div class="title-box">
                <div class="line"></div>
                <div class="title">生活习惯</div>
              </div>
              <div class="class-item">
                <p>
                  吸烟:<span>{{ smokingData[LivingHabit.smoking] }}</span>
                </p>
                <p>
                  饮酒:<span>{{ drinkingData[LivingHabit.drinking] }}</span>
                </p>
                <p>
                  饮食:<span>{{ lifeDataEnum.life_diet_type[lifeData.life_diet_type] }}</span
                  ><span>{{ lifeDataEnum.life_diet_flavor[lifeData.life_diet_flavor] }}</span
                  ><span>{{ lifeDataEnum.life_diet_teast[lifeData.life_diet_teast] }}</span>
                </p>
              </div>
            </div>
            <div class="motion">
              <div class="title-box">
                <div class="line"></div>
                <div class="title">运动爱好</div>
              </div>
              <div class="class-item">
                <div class="class-name">运动爱好:</div>
                <div class="class-details">
                  <p v-for="(item, index) in motionList" :key="index" class="keynote">
                    {{ item }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="medical-files">
            <div class="title-box">
              <div class="line"></div>
              <div class="title">操作记录</div>
            </div>
            <div class="tab-box">
              <t-table row-key="index" :data="tableData" :bordered="true" :columns="(tableColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium" hover> </t-table>
            </div>
            <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeRecordsChange" @current-change="currentRecordsChange" show-jumper />
          </div>
        </div>
      </t-tab-panel>
      <t-tab-panel value="2" label="评估记录" v-if="route.query.display !== 'false'">
        <div class="tab-box">
          <t-table row-key="index" :data="estimateData" :columns="(estimateColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover :bordered="false" table-layout="fixed" tableContentWidth="2000px">
            <template #estimateServerType="{ row }">
              <span v-if="row.type == 1">游戏</span>
              <span v-if="row.type == 2">量表</span>
              <span v-if="row.type == 3">眼动</span>
              <span v-if="row.type == 4">抑郁</span>
            </template>
            <template #action="{ row }">
              <span class="btn-c-blue" @click="seeDetails(row)">查看详情</span>
            </template>
          </t-table>
          <t-pagination :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" :defaultPageSize="estimateOrderReq.pageSize" show-jumper v-model:current="estimateOrderReq.pageNum" />
        </div>
      </t-tab-panel>
      <t-tab-panel value="3" label="干预记录" v-if="route.query.display !== 'false'">
        <div class="tab-box">
          <t-table row-key="index" :data="estimateData" :columns="interveneColumns" size="medium" hover :bordered="false" table-layout="fixed">
            <template #action="{ row }">
              <span class="btn-c-blue" @click="lookDetaile(row)">查看干预方案</span>
            </template>
          </t-table>
          <t-pagination :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" :defaultPageSize="intervenListReq.pageSize" show-jumper v-model:current="intervenListReq.pageNum" />
        </div>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TabValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { getHealthRecordsDetailById } from '../../request/modules/CustomApi';
import { tableColumns } from './data/configuration';
import { intervenList } from '../../request/modules/intervene';
import { estimateOrder, orderHealthRecords } from '../../request/modules/EstimateApi';
import { BookingOrder, MealOrder, RightsInterestsOrder, bhiDetails } from '../../request/modules/orderApi';
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    let formSearch = reactive<any>({
      archivesNo: '',
      age: '',
      pageSize: 10,
      pageNum: 1
    });
    const eyeReportInfo = ref<any>({}); //报告结果
    const bhiResponse = ref<any>({}); //HBI信息
    const healthRecordsBaseInfo = ref<any>({}); //基础信息
    const setArrt = reactive({
      tabsActiveValue: '1',
      foundationInfoState: true,
      userInfoList: [
        { title: '姓名:', value: '' },
        // { title: '医保卡号:', value: '' },
        { title: '性别:', value: '' },
        // { title: '备用联系人:', value: '' },
        { title: '出生日期:', value: '' },
        // { title: '备用联系电话:', value: '' },
        { title: '教育背景:', value: '' },
        // { title: '家庭地址:', value: '' },
        { title: '手机号码:', value: '' }
        // { title: '街道:', value: '' },
        // { title: '身份证号:', value: '' },
        // { title: '居委会:', value: '' },
        // { title: '院方ID:', value: '' },
        // { title: '详细地址:', value: '' }
      ],
      total: 0,
      intervenListReq: {
        healthRecordNumber: route.query.archivesNo as string,
        pageNum: 1,
        pageSize: 20
      },
      bookingOrderReq: {
        clientId: route.query.archivesNo as string,
        pageNum: 1,
        pageSize: 20
      },
      mealOrderReq: {
        clientId: route.query.archivesNo as string,
        pageNum: 1,
        pageSize: 20
      },
      RightsInterestsOrderReq: {
        clientId: route.query.archivesNo as string,
        pageNum: 1,
        pageSize: 20
      },
      estimateOrderReq: {
        formArchives: true,
        associatedUsers: '',
        archivesNo: (route.query.archivesNo as string) || null,
        pageNum: 1,
        pageSize: 20
      },
      healthList: {
        hea_height: '',
        hea_diabet: 0,
        hea_weight: '',
        hea_press_up: '',
        hea_press: 0,
        hea_press_down: '',
        hea_tc: 0,
        hea_tc_num: '',
        hea_motion: '',
        hea_brain: 0,
        hea_heart: 0,
        hea_memory_loss: 0,
        hea_dpe: 0,
        hea_aope: 0
      },
      // healthList: [
      //     { title: "身高:", value: "" },
      //     { title: "糖尿病:", value: "" },
      //     { title: "体重:", value: "" },
      //     { title: "收缩压:", value: "" },
      //     { title: "血压情况:", value: "" },
      //     { title: "舒张压:", value: "" },
      //     { title: "血脂情况:", value: "" },
      //     { title: "总胆固醇:", value: "" },
      //     { title: "运动量:", value: "" },
      //     { title: "脑血管:", value: "" },
      //     { title: "心脏病:", value: "" },
      //     { title: "比历史记忆更差:", value: "" },
      //     { title: "抑郁状态:", value: "" },
      //     { title: "APOE 4基因类型::", value: "" },
      // ],
      heartEnum: ['', '是', '否', '不知道'],
      pressEnum: ['', '正常', '高血压', '低血压'],
      tcEnum: ['', '正常', '高血脂', '低血脂'],
      diabetEnum: ['', '是', '否', '不知道'],
      lifeDataEnum: {
        life_drink: ['', '偶尔', '经常', '嗜烟', '不喝酒/戒酒'],
        life_smoke: ['', '偶尔', '经常', '嗜烟', '不吸烟/戒烟'],
        life_diet_type: ['', '纯素', '偏素', '荤素搭配', '偏荤'],
        life_diet_flavor: ['', '清淡', '适中', '重口味'],
        life_diet_teast: ['', '偏酸', '偏甜', '偏辣']
      },
      medicalList: [
        { name: '基础能力:', arr: [] },
        { name: '患病情况:', arr: [] },
        { name: '家族病史:', arr: [] }
      ],
      lifeData: {
        life_smoke: '0',
        life_drink: 0,
        life_diet_type: 0,
        life_diet_flavor: 0,
        life_diet_teast: 0
      },
      motionList: [],
      data: [],
      columns: [
        { colKey: 'id', title: '微信昵称' },
        { colKey: 'name', title: '客户姓名' },
        { colKey: 'relationship', title: '关系' },
        { colKey: 'phone', title: '联系方式' },
        { colKey: 'time', title: '出生日期' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' }
        }
      ],
      estimateData: [],
      estimateColumns: [
        { colKey: 'estimateNum', title: '评估编号' },
        { colKey: 'customName', title: '客户姓名' },
        { colKey: 'customPhone', title: '联系方式' },
        { colKey: 'estimateServerType', title: '项目类型', slots: { customRender: 'estimateServerType' } },
        // { colKey: 'type', title: '评估分类' },
        { colKey: 'estimateServeName', title: '项目名称' },
        { colKey: 'prodName', title: '关联服务' },
        { colKey: 'customOrigin', title: '客户来源' },
        { colKey: 'assessor', title: '评估员' },
        { colKey: 'risk', title: '评估结果' },
        { colKey: 'estimateTime', title: '评估时间' },
        {
          title: '操作',
          colKey: 'action',
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ],
      interveneColumns: [
        { colKey: 'interventionOrderNumber', title: '干预单号' },
        { colKey: 'customerName', title: '客户姓名' },
        { colKey: 'contactNumber', title: '联系方式' },
        { colKey: 'screeningServiceName', title: '关联服务' },
        { colKey: 'cycle', title: '干预周期', slots: { customRender: 'cycle' } },
        { colKey: 'totalTrainingDays', title: '训练天数' },
        { colKey: 'sex', title: '状态' },
        { colKey: 'makerName', title: '制定人' },
        { colKey: 'customerSource', title: '客户来源' },
        { colKey: 'time', title: '出生日期' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' }
        }
      ],
      workOrderValue: 1,
      reservationColumns: [
        { colKey: 'ticketsServiceId', title: '预约单号' },
        { colKey: 'bookingServ', title: '预约服务' },
        { colKey: 'clientName', title: '客户姓名' },
        { colKey: 'useTime', title: '预约时间' },
        { colKey: 'education', title: '预约机构' },
        { colKey: 'money', title: '支付金额' },
        { colKey: 'status', title: '状态' },
        { colKey: 'createTime', title: '创建时间' }
      ],
      serveColumns: [
        { colKey: 'ticketsServiceCode', title: '套餐单号' },
        { colKey: 'bookingServ', title: '套餐名称' },
        { colKey: 'clientName', title: '客户姓名' },
        { colKey: 'status', title: '状态' },
        { colKey: 'money', title: '支付金额' },
        { colKey: 'createTime', title: '下单时间' },
        { colKey: 'useTime', title: '使用时间' }
      ],
      equityColumns: [
        { colKey: 'ticketsEquityCode', title: '权益单号' },
        { colKey: 'equityName', title: '权益卡包名称' },
        { colKey: 'clientName', title: '客户姓名' },
        { colKey: 'status', title: '状态' },
        { colKey: 'price', title: '权益卡价格' },
        { colKey: 'begnTime', title: '激活时间' },
        { colKey: 'useTime', title: '使用时间' }
      ]
    });
    const MockTableData = [
      {
        mockSort: '正常',
        channel: '>20',
        align: 'right'
      },
      {
        mockSort: '低风险',
        channel: '10-20',
        align: 'center'
      },
      {
        mockSort: '中风险',
        channel: '5-10',
        align: 'center'
      },
      {
        mockSort: '高风险',
        channel: '0-5',
        align: 'center'
      }
    ];
    const LivingHabit = ref<any>({});
    const smokingData = ['偶尔', '经常', '不吸烟/戒烟'];
    const drinkingData = ['偶尔', '经常', '嗜酒', '不喝酒/戒酒'];
    const dietData1 = ['纯素', '偏素', '荤素搭配', '偏荤'];
    const dietData2 = ['清淡', '适中', '重口味'];
    const dietData3 = ['偏酸', '偏甜', '偏辣'];
    onMounted(() => {
      if (route.query.status == '2') {
        setArrt.tabsActiveValue = String(route.query.status);
        setArrt.estimateOrderReq.associatedUsers = String(route.query.associatedUsers);
        setArrt.estimateOrderReq.archivesNo = String(route.query.archivesNo);
        console.log(route.query.archivesNo, 'route.query.archivesNo');
        getEstimateOrder();
      } else {
        getDetails();
      }
      formSearch.age = String(route.query.age);
      formSearch.archivesNo = String(route.query.archivesNo);

      getDetailsBHI();
      loadTableData();
      // else if((route.query.status =='3')) {
      //   setArrt.tabsActiveValue = String(route.query.status);
      //   getIntervenList()
      // }
    });
    const Xshaft = ref<any>([]); //X轴
    const isShow = ref(true); //false
    const Yshaft = ref<any>([]); //Y轴
    const riskList = ref<any>([]); //风险因素
    const baseResponse = ref<any>([]); //风险因素
    const getDetailsBHI = () => {
      bhiDetails({ archivesNo: route.query.archivesNo as string }).then((res: any) => {
        if (res.code == 200) {
          let analyzeData = ['0', '0', '0', '0', '0', '0'];
          bhiResponse.value = res.data.healthBhiResponse;
          baseResponse.value = res.data?.healthRecordsBaseResponse;
          let memory = res.data.radarChartResponse?.memoryScore ? res.data.radarChartResponse.memoryScore : 0;
          let depending = res.data.radarChartResponse?.visualSpatialAbilityScore ? res.data.radarChartResponse?.visualSpatialAbilityScore : 0;
          let carry = res.data.radarChartResponse?.executionAbilityScore ? res.data.radarChartResponse?.executionAbilityScore : 0;
          let mathematics = res.data.radarChartResponse?.mathematicalLogicScore ? res.data.radarChartResponse?.mathematicalLogicScore : 0;
          let speech = res.data.radarChartResponse?.languageAbilityScore ? res.data.radarChartResponse?.languageAbilityScore : 0;
          let emotionalStateScore = res.data.radarChartResponse?.emotionalStateScore ? res.data.radarChartResponse?.emotionalStateScore : 0;
          analyzeData = [memory, depending, carry, mathematics, speech, emotionalStateScore];

          // echartsAnalyze(analyzeData);
          //风险因素
          riskList.value = res.data?.healthRiskFactors;
        } else {
          isShow.value = false;
        }
      });
    };
    const tableData = ref<any>([]);
    const total = ref<any>([]);
    const reportPDF = ref<string>('');
    const reportPDFName = ref<string>('');
    const loadTableData = () => {
      orderHealthRecords(formSearch).then((res: any) => {
        //解决档案历史列表无数据时控制台报错
        if (res.code == '200' && res.data) {
          tableData.value = res.data.data;
          total.value = res.data.total;
        }
      });
    };
    const getDetails = () => {
      getHealthRecordsDetailById({ archivesNo: route.query.archivesNo as string }).then((res: any) => {
        if (res.code === 200) {
          reportPDF.value = res.data.pdfPath;
          //pdf名称使用档案名称加手机号后四位
          reportPDFName.value = res.data.healthRecordsBase.name + res.data.healthRecordsBase.phone.slice(-4) + '.pdf';
          console.log(res);
          LivingHabit.value = res.data.healthRecordsDetail;
          healthRecordsBaseInfo.value = res.data.healthRecordsBase;
          setArrt.estimateOrderReq.associatedUsers = res.data.healthRecordsBase.associatedUsers;
          setArrt.userInfoList = [
            { title: '姓名:', value: res.data.healthRecordsBase.name },
            // { title: '医保卡号:', value: res.data.healthRecordsBase.medicalInsuranceCard },
            { title: '性别:', value: res.data.healthRecordsBase.sexDesc },
            // { title: '备用联系人:', value: res.data.healthRecordsBase.alternateContact },
            { title: '出生日期:', value: res.data.healthRecordsBase.birthday },
            // { title: '备用联系电话:', value: res.data.healthRecordsBase.contactPhone },
            { title: '教育背景:', value: res.data.healthRecordsBase.educationDesc },
            // { title: '家庭地址:', value: res.data.healthRecordsBase.homeAddress },
            { title: '手机号码:', value: res.data.healthRecordsBase.phone }
            // { title: '街道:', value: res.data.healthRecordsBase.street },
            // { title: '身份证号:', value: res.data.healthRecordsBase.idNo },
            // { title: '居委会:', value: res.data.healthRecordsBase.neighborhoodCommittee },
            // { title: '院方ID:', value: res.data.healthRecordsBase.hospitalId },
            // { title: '详细地址:', value: res.data.healthRecordsBase.address }
          ];
          setArrt.healthList = {
            hea_height: res.data.healthRecordsDetail.height,
            hea_diabet: res.data.healthRecordsDetail.diabetesDesc, //糖尿病
            hea_weight: res.data.healthRecordsDetail.weight,
            hea_press_up: res.data.healthRecordsDetail.diastolicPressure,
            hea_press: res.data.healthRecordsDetail.bloodPressureSituation, //血压
            hea_press_down: res.data.healthRecordsDetail.systolicPressure,
            hea_tc: res.data.healthRecordsDetail.lipidStatus,
            hea_tc_num: res.data.healthRecordsDetail.totalCholesterol,
            hea_motion: res.data.healthRecordsDetail.weeklyExerciseFrequency,
            hea_brain: res.data.healthRecordsDetail.cerebrovascularDisease,
            hea_heart: res.data.healthRecordsDetail.heartDisease,
            hea_memory_loss: res.data.healthRecordsDetail.memory,
            hea_dpe: res.data.healthRecordsDetail.depressiveState,
            hea_aope: res.data.healthRecordsDetail.carryApoe
          };

          for (let i = 0; i < res.data.sportsHobbiesList.length; i++) {
            setArrt.motionList.push(res.data.sportsHobbiesList[i].sportsEventsDesc as never);
          }
          setArrt.medicalList[0].arr = res.data.capabilityDescList;
          setArrt.medicalList[1].arr = res.data.familyHistoryDescList;
          setArrt.medicalList[2].arr = res.data.prevalenceDescList;
        }
      });
    };
    const getIcon = (name: string) => {
      return new URL(`../../assets/img/custom/${name}.png`, import.meta.url).href;
    };
    const lookDetaile = item => {
      switch (setArrt.tabsActiveValue) {
        case '1':
          break;
        case '2':
          break;
        case '3':
          router.push({
            path: '/interveneDetails',
            query: {
              id: item.id,
              interventionNum: item.interventionOrderNumber,
              type: 'look'
            }
          });
          break;
        case '4':
          break;

        default:
          break;
      }
    };
    onBeforeUnmount(() => {
      // search.putCharts.dispose();
      // search.analyzeCharts.dispose();
    });
    const getIntervenList = () => {
      intervenList(setArrt.intervenListReq).then((res: any) => {
        if (res.code === 200) {
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const getBookingOrder = () => {
      BookingOrder(setArrt.bookingOrderReq).then((res: any) => {
        if (res.code === 200) {
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const getMealOrder = () => {
      MealOrder(setArrt.mealOrderReq).then((res: any) => {
        if (res.code === 200) {
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const getEstimateOrder = () => {
      estimateOrder(setArrt.estimateOrderReq).then((res: any) => {
        if (res.code === 200) {
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const getRightsInterestsOrder = () => {
      RightsInterestsOrder(setArrt.RightsInterestsOrderReq).then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const tabsChange = (value: TabValue) => {
      console.log(value);
      switch (value) {
        case '1':
          getDetails();
          getDetailsBHI();
          break;
        case '2':
          getEstimateOrder();
          break;
        case '3':
          getIntervenList();
          break;
        case '4':
          getBookingOrder();
          break;

        default:
          break;
      }
    };
    const orderTabChange = (value: TabValue) => {
      switch (value) {
        case 1:
          getBookingOrder();
          break;
        case 2:
          getMealOrder();
          break;
        case 3:
          getRightsInterestsOrder();
          break;

        default:
          break;
      }
    };
    const pageSizeChange = (pageSize: number) => {
      switch (setArrt.tabsActiveValue) {
        case '1':
          getDetails();
          break;
        case '2':
          setArrt.estimateOrderReq.pageSize = pageSize;
          setArrt.estimateOrderReq.pageNum = 1;
          getEstimateOrder();
          break;
        case '3':
          setArrt.intervenListReq.pageSize = pageSize;
          setArrt.intervenListReq.pageNum = 1;
          getIntervenList();
          break;
        case '4':
          switch (setArrt.workOrderValue) {
            case 1:
              setArrt.bookingOrderReq.pageSize = pageSize;
              setArrt.bookingOrderReq.pageNum = 1;
              getBookingOrder();
              break;
            case 2:
              setArrt.mealOrderReq.pageSize = pageSize;
              setArrt.mealOrderReq.pageNum = 1;
              getMealOrder();
              break;
            case 3:
              setArrt.RightsInterestsOrderReq.pageSize = pageSize;
              setArrt.RightsInterestsOrderReq.pageNum = 1;
              getRightsInterestsOrder();
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    };
    const currentChange = (current: number) => {
      switch (setArrt.tabsActiveValue) {
        case '1':
          getDetails();
          break;
        case '2':
          setArrt.estimateOrderReq.pageNum = current;
          getEstimateOrder();
          break;
        case '3':
          setArrt.intervenListReq.pageNum = current;
          getIntervenList();
          break;
        case '4':
          switch (setArrt.workOrderValue) {
            case 1:
              setArrt.bookingOrderReq.pageNum = current;
              getBookingOrder();
              break;
            case 2:
              setArrt.mealOrderReq.pageNum = current;
              getMealOrder();
              break;
            case 3:
              setArrt.RightsInterestsOrderReq.pageNum = current;
              getRightsInterestsOrder();
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    };
    interface pathTypr {
      [key: string]: string;
    }
    const pathEnum: pathTypr = {
      'AD-8': '/EvaluationMoca', //早期失智筛查AD8量表
      'AD-8-LIET': '/EvaluationMoca', //早期失智筛查AD8量表
      'EDB-AD': '/EvaluationCognize', //pad眼动
      'SMALL-GAME': '/EvaluationDetails', //小程序小游戏
      'EDB-AD-LIET': '/EvaluationCognizeH5', //小程序手机眼动
      YY0001: '/EvaluationDepression', //抑郁
      MoCA: '/EvaluationMoca', //MoCA蒙特利尔量表
      MMSE: '/EvaluationMoca', //MMSE简易智力筛查量表
      HAMA: '/EvaluationMoca', //HAMA汉密尔顿焦虑量表
      'HAMD-24': '/EvaluationMoca', //HAMD-24汉密尔顿抑郁量表
      ADL: '/EvaluationMoca', //ADL生活能力量表
      HADS: '/EvaluationMoca', //HADS医院焦虑抑郁量表
      FAQ: '/EvaluationMoca',
      'PHQ-9': '/EvaluationMoca',
      'GAD-7': '/EvaluationMoca',
      'NPI-Q': '/EvaluationMoca',
      'Mini-cog': '/EvaluationMoca',
      CFT: '/EvaluationMoca',
      'NINDS-CSN': '/EvaluationMoca',
      DS: '/EvaluationMoca'
    };
    const seeDetails = (item: any) => {
      //类型1-游戏，2-量表，3-眼动，4-抑郁
      //类型estimateServeCode: EDB-AD:是pad眼动，SMALL-GAME:是小程序小游戏，AD-8:是早期失智筛查AD8量表，YY0001:是抑郁，MoCA:是蒙特利尔量表， EDB-AD-LIET:是手机眼动,MMSE:简易智力筛查量表,HAMA:汉密尔顿焦虑量表,HAMD-24:汉密尔顿抑郁量表,ADL:生活能力量表,HADS:医院焦虑抑郁量表
      console.log(item.estimateServeCode);
      console.log(pathEnum[item.estimateServeCode]);
      console.log(item.archivesNo);
      if (item.type === 4 && item.estimateServeCode == '') {
        // 简版抑郁报告单独判断
        router.push({
          path: '/EvaluationDepression',
          query: {
            estimateNum: item.estimateNum,
            archivesNo: item.archivesNo,
            type: item.type,
            pdfUrl: item.reportPdfUrl,
            pdfDisplay: 1
          }
        });
      }
      router.push({
        path: pathEnum[item.estimateServeCode],
        query: {
          estimateNum: item.estimateNum,
          archivesNo: item.archivesNo,
          archives: route.query.archivesNo,
          type: item.type,
          status: '2',
          associatedUsers: setArrt.estimateOrderReq.associatedUsers,
          pdfUrl: item.reportPdfUrl,
          pdfDisplay: 1
        }
      });
    };
    //分页
    const pageSizeRecordsChange = (pageSize: any) => {
      formSearch.pageSize = pageSize;
      formSearch.pageNum = 1;
      loadTableData();
    };
    const currentRecordsChange = (current: any) => {
      formSearch.pageNum = current;
      loadTableData();
    };
    //下载报告
    const downReport = () => {
      //let a = document.createElement('a');
      if (reportPDF.value) {
        var request = new XMLHttpRequest();
        request.responseType = 'blob'; //定义响应类型
        request.open('GET', reportPDF.value.replace('http://', 'https://'));

        request.onload = function () {
          var url = window.URL.createObjectURL(this.response);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = reportPDFName.value;
          a.click();
        };
        request.send();
        // a.href = reportPDF.value;
        // a.target = "_blank";
        // a.click();
      }
    };
    const goDetails = () => {
      router.push({
        path: '/evaluationHbiDetails',
        query: {
          archivesNo: bhiResponse.value.archivesNo
        }
      });
    };
    return {
      ...toRefs(setArrt),
      getIcon,
      pageSizeChange,
      lookDetaile,
      tabsChange,
      orderTabChange,
      pageSizeRecordsChange,
      currentChange,
      currentRecordsChange,
      seeDetails,
      downReport,
      smokingData,
      drinkingData,
      dietData1,
      dietData2,
      dietData3,
      LivingHabit,
      reportPDF,
      reportPDFName,
      tableData,
      Xshaft,
      isShow,
      Yshaft,
      riskList,
      baseResponse,
      route,
      eyeReportInfo,
      healthRecordsBaseInfo,
      bhiResponse,
      MockTableData,
      formSearch,
      total,
      tableColumns,
      goDetails
    };
  }
};
</script>

<style lang="scss" scoped>
.cunstom-details {
  overflow: hidden;

  //基本信息
  .basic {
    display: flex;
    justify-content: space-between;
    padding: 20px;

    .basic-left {
      width: 49%;
      background: #ffffff;
      box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;

      h2 {
        text-align: center;
        font-size: 32px;
        color: #999999;
        line-height: 190px;
      }

      .project {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        .project-right {
          display: flex;
        }

        .icon {
          position: absolute;
          left: 25px;
          top: 33px;
          width: 5px;
          height: 14px;
          background: #5766fe;
          border-radius: 5px;
        }

        .box-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 11px;
          width: 116px;
          height: 40px;
          background: #3c86fe;
          box-shadow: 0px 2px 4px 0px #fafbff;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          margin-right: 20px;

          .box-item {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 22px;
            cursor: pointer;
          }
        }

        .project-name {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 48px;
          margin-left: 40px;
          margin-top: 15px;
        }
      }

      .project-basic {
        margin: 0 auto;
        margin-top: 36px;
        width: 331px;
        height: 182px;
        background: url('../../assets/img/EvaluationDetails/projectBg.png');

        .basic-title {
          text-align: center;
          padding-top: 9px;
          font-size: 21px;
          font-family: MiSans-Bold, MiSans;
          font-weight: bold;
          color: #ffffff;
          line-height: 28px;
        }

        .basic-num {
          text-align: center;
          padding-top: 25px;
          font-size: 50px;
          font-family: MiSans-Bold, MiSans;
          font-weight: bold;
          color: #3c86fe;
          line-height: 66px;
          letter-spacing: 2px;
        }

        .evaluation {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 306px;
          margin: 0 auto;
          height: 35px;
          background: #fafafa;
          border-radius: 4px;
          margin-top: 7px;
          border: 1px solid #ededed;
          font-size: 14px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 20px;
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
          top: 33px;
          width: 5px;
          height: 14px;
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
          margin-top: 16px;
        }

        .project-person {
          width: 62px;
          height: 25px;
          background: linear-gradient(147deg, #6d64ff 0%, #3493ff 100%);
          box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
          border-radius: 13px;
          border: 1px solid #ffffff;
          margin-left: 5px;
          margin-top: 26px;
          text-align: center;

          .person {
            font-size: 13px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #ffffff;
            line-height: 25px;
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

          .avatar-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

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
  }

  //年龄认知
  .cognition {
    display: flex;
    justify-content: space-between;
    padding: 20px;

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
          width: 5px;
          height: 14px;
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
          margin-top: 16px;
        }
      }
    }

    .cognition-right {
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
          top: 33px;
          width: 5px;
          height: 14px;
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
          margin-top: 16px;
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

  //健康风险
  .health {
    display: flex;
    justify-content: space-between;
    padding: 20px;

    .basic-health {
      width: 100%;
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
          width: 5px;
          height: 14px;
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
          margin-top: 15px;
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
          top: 33px;
          width: 5px;
          height: 14px;
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
          margin-top: 15px;
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
  }

  //分析
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
        margin-top: 7px;
      }

      .analyze-tips {
        display: flex;
        justify-content: center;
        font-size: 13px;
        margin-top: 5px;
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
        margin-top: 19px;
        // padding: 0 0.6933rem;
      }
    }
  }

  //健康风险因素
  .factor {
    margin: 0 7px;
    margin-bottom: 6px;

    .factor-head {
      display: flex;
      align-items: center;
      height: 17px;
      width: 100%;
      background: #3c86fe;
      border-radius: 4px 4px 0px 0px;

      .factor-title {
        padding-left: 6px;
        font-size: 7px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #ffffff;
        line-height: 7px;
      }
    }

    .replenishment {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      text-align: center;
      color: #8d8d8d;

      .replenishItem {
        color: #ff0000;
      }
    }
  }

  .swiper-box {
    padding: 30px;

    .projectItem {
      display: flex;
      // justify-content: center;
      flex-direction: column;
      // align-items: center;
      height: 245px;
      background: linear-gradient(180deg, #faffff 0%, #fafeff 100%);
      box-shadow: inset 0px 1px 1px 0 rgba(0, 0, 0, 0.05);
      border-radius: 3px;
      border: 1px solid #f1f6fc;
      padding-bottom: 22px;
      box-sizing: border-box;
      justify-content: center;

      .ment {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 7px auto;
        width: 126px;
        height: 126px;
        border-radius: 50%;
        border: 8px solid #ffa895;
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #505050;
        line-height: 22px;
        text-align: center;
      }

      .description {
        height: 54px;
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #6c6b72;
        line-height: 27px;
        padding: 0 15px;
      }
    }
  }

  .t-tabs {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    border-radius: 18px;
  }

  .info-box {
    padding: 20px;

    .foundation-info,
    .health-files {
      // width: 871.36px;
      height: 256px;
      background: #ffffff;
      box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
      border-radius: 10.72px;
      padding: 14.72px 36.8px;
      box-sizing: border-box;

      .title-box {
        display: flex;
        align-items: center;
        padding-bottom: 5.44px;

        .line {
          width: 4px;
          height: 14.72px;
          background: #5766fe;
          border-radius: 14.72px;
        }

        .title {
          font-weight: 600;
          font-size: 14.72px;
          color: #222222;
          margin-left: 4px;
        }
      }

      .info-dateil {
        display: flex;
        justify-content: space-between;
        align-content: center;
        flex-wrap: wrap;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-content: center;
          margin-top: 9.28px;

          p {
            font-size: 14.72px;
            line-height: 20px;

            &:nth-child(1) {
              color: #747474;
            }

            &:nth-child(2) {
              color: #222222;
              font-weight: bold;
            }
          }

          .nullText {
            color: #a0a0a0 !important;
          }
        }

        .item-1 {
          width: 52%;
        }

        .item-2 {
          width: 43%;
        }
      }
    }

    .foundation-info {
      height: 136px;
      overflow: hidden;
      transition: height 0.5s;

      .title-or-operate {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .operate-box {
          display: flex;
          align-items: center;

          img {
            width: 12px;
            height: 6.72px;
            margin-right: 3.36px;
          }

          font-size: 14.72px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }
    }

    .foundation-info-develop {
      height: 136px;
    }

    .foundation-info-contract {
      height: 136px;
    }

    .health-files {
      margin-top: 17.6px;
      overflow: hidden;
      transition: all 0.5s;
    }

    .health-files-develop {
      margin-top: 17.6px;
      height: 256px;
    }

    .health-files-contract {
      padding: 0;
      margin-top: 0px;
      height: 0;
    }

    .medical-files {
      background: #ffffff;
      box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
      border-radius: 10.72px;
      padding: 18.08px 30.08px;
      margin-top: 18px;
      box-sizing: border-box;

      .title-box {
        display: flex;
        align-items: center;
        padding-bottom: 5.44px;

        .line {
          width: 4px;
          height: 14.72px;
          background: #5766fe;
          border-radius: 14.72px;
        }

        .title {
          font-weight: 600;
          font-size: 14.72px;
          color: #222222;
          margin-left: 4px;
        }
      }

      .class-item {
        padding: 9.6px 0;
        font-size: 14.72px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #747474;
        line-height: 20px;
        display: flex;

        .class-name {
          flex: 0 0 auto;
          width: 86.08px;
        }

        .class-details {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          p {
            margin-bottom: 9.28px;
            padding: 0 11.2px;
          }

          .keynote {
            font-weight: bold;
            color: #222222;
          }
        }
      }
    }

    .habit-or-motion {
      display: flex;
      justify-content: space-between;
      margin-top: 18px;

      .habit {
        flex: 1;
        background: #ffffff;
        box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
        border-radius: 10.72px;
        padding: 18.08px 30.08px;
        margin-right: 9px;
        box-sizing: border-box;

        .title-box {
          display: flex;
          align-items: center;
          padding-bottom: 5.44px;

          .line {
            width: 4px;
            height: 14.72px;
            background: #5766fe;
            border-radius: 14.72px;
          }

          .title {
            font-weight: 600;
            font-size: 14.72px;
            color: #222222;
            margin-left: 4px;
          }
        }

        .class-item {
          display: flex;
          flex-wrap: wrap;
          font-size: 14.72px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #747474;
          line-height: 20px;

          p {
            flex: 0 0 auto;
            padding: 8px 0;

            span {
              font-weight: bold;
              color: #222222;
              padding: 0 12.8px;
            }
          }
        }
      }

      .motion {
        flex: 1;
        background: #ffffff;
        box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
        border-radius: 10.72px;
        padding: 18.08px 30.08px;
        box-sizing: border-box;
        margin-left: 9px;

        .title-box {
          display: flex;
          align-items: center;
          padding-bottom: 5.44px;

          .line {
            width: 4px;
            height: 14.72px;
            background: #5766fe;
            border-radius: 14.72px;
          }

          .title {
            font-weight: 600;
            font-size: 14.72px;
            color: #222222;
            margin-left: 4px;
          }
        }

        .class-item {
          padding: 9.6px 0;
          font-size: 14.72px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #747474;
          line-height: 20px;
          display: flex;

          .class-name {
            flex: 0 0 auto;
            width: 86.08px;
          }

          .class-details {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            p {
              margin-bottom: 9.28px;
              padding: 0 11.2px;
            }

            .keynote {
              font-weight: bold;
              color: #222222;
            }
          }
        }
      }
    }
  }

  .tab-box {
    padding: 10px;
    box-sizing: border-box;

    .btn-see-blue {
      background: #f2f2f2;
      color: #a2a2a2;
    }
  }

  ::v-deep(.t-swiper__arrow--default .t-swiper__arrow-right) {
    color: #3e76f5;
    background: #f2f8ff;
    border-radius: 25px;
    width: 35px;
    height: 35px;
  }

  ::v-deep(.t-swiper__arrow--default .t-swiper__arrow-left) {
    color: #3e76f5;
    background: #f2f8ff;
    border-radius: 25px;
    width: 35px;
    height: 35px;
  }
}
</style>
