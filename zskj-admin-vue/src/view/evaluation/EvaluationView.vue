<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" v-model="titleData.customName" auto-width /></div>
      <div class="search-item search-item-font">项目名称：<t-input class="ipt-slt" v-model="titleData.prodName" auto-width /></div>
      <div class="search-item search-item-font">项目类型：<t-select class="ipt-slt" v-model="titleData.type" :options="projectOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">客户来源：<t-cascader class="ipt-slt" v-model="titleData.organizationId" clearable :options="seclectLabel" :show-all-levels="false" placeholder="请选择" check-strictly></t-cascader></div>
      <div class="search-item search-item-font">评估时间： <t-date-range-picker allow-input clearable enable-time-picker @change="onChange" v-model="titleData.timeData" /></div>

      <t-button class="search-item" theme="primary" @click="handlerSubmit">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="handlerRest">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 390" :data="tableData" :columns="(tableColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium">
        <template #action="{ row }">
          <!-- <span v-if="row.type == 4" class="btn-see-blue">查看报告</span>v-else -->
          <t-button size="small" variant="text" @click="seeDetails(row)" theme="primary">查看报告</t-button>
        </template>
        <!-- <template #estimateServerType="{ row }">
          <span v-if="row.type == 1">认知症评估</span>
          <span v-if="row.type == 2">抑郁症评估</span>
        </template> -->
        <template #type="{ row }">
          <span v-if="row.type == 1">游戏</span>
          <span v-if="row.type == 2">量表</span>
          <span v-if="row.type == 3">眼动</span>
          <span v-if="row.type == 4">抑郁</span>
        </template>
        <template #status="{ row }">
          <span v-if="row.status == 1">评估中</span>
          <span v-if="row.status == 2">评估完成-数据解析中</span>
          <span v-if="row.status == 3">评估完成</span>
          <span v-if="row.status == 4">评估失败</span>
          <span v-if="row.status == 5">无法作答</span>
          <span v-if="row.status == 9">评估异常</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { getOrganMultiSelect } from '../../request/modules/institution';
import { useRouter } from 'vue-router';
import { tableColumns, MockTableData } from './data/configuration';
import { estimateOrder, estimateOrderSeclect } from '../../request/modules/EstimateApi';
// import { dictData } from '../../request/modules/dictData';
import load from '../../components/load/load.vue';
import { number } from 'echarts';
//   import { tableColumns, MockTableData } from '../evaluation/data/configuration';
// --------全局参数---------------
const router = useRouter();
const total = ref<any>('');
const seclectLabel = ref<any>([{ label: '', value: '', children: [] }]);
let formSearch = reactive<any>({
  archivesNo: '',
  customName: '',
  formArchives: false,
  prodName: '',
  type: '',
  organizationId: '',
  organIds: [],
  pageSize: 10,
  pageNum: 1,
  timeData: []
});
let titleData = reactive<any>({
  archivesNo: '',
  customName: '',
  prodName: '',
  type: '',
  organizationId: '',
  organIds: [],
  timeData: []
});
const projectOption = ref<any>([
  { label: '全部', value: '' },
  { label: '游戏', value: 1 },
  { label: '量表', value: 2 },
  { label: '眼动', value: 3 }
]);

// 重置
const handlerRest = (values: any) => {
  formSearch.archivesNo = '';
  formSearch.customName = '';
  formSearch.prodName = '';
  formSearch.type = '';
  formSearch.organizationId = '';
  formSearch.estimateStaTime = '';
  formSearch.estimateEndTime = '';
  formSearch.timeData = [];
  formSearch.organIds = [];
  formSearch.pageSize = 10;
  formSearch.pageNum = 1;

  titleData.archivesNo = '';
  titleData.customName = '';
  titleData.prodName = '';
  titleData.type = '';
  titleData.organizationId = '';
  titleData.estimateStaTime = '';
  titleData.estimateEndTime = '';
  titleData.timeData = [];
  titleData.organIds = [];
  loadTableData();
};
// 搜索
const handlerSubmit = (values: any) => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};
const fixedTopRows = ref<boolean>(false);
//----- 加载列表数据 ---------
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  loadTableData();
  knowGetDict();
  // getEstimateData()
});
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const tableData = ref<any>([]);
const loadTableData = () => {
  estimateOrder(formSearch).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (tableData.value = []);
      } else {
        tableData.value = res.data.data;
        total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (tableData.value = []);
    }
  });
};
//有用勿动
// const getEstimateData = () => {
//       dictData({ dictType: 'estimate_type' }).then((res: any) => {
//         console.log('类型分类', res);
//         if (res.code === 200) {
//           projectOption.value = res.data.map((item: any) => {
//             return {
//               label: item.dictLabel,
//               value: Number(item.dictValue)
//             };
//           });
//         }
//       });
//     };

//选择时间
const onChange = (value: DateRangeValue) => {
  titleData.estimateStaTime = value[0] as string;
  titleData.estimateEndTime = value[1] as string;
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

//查看报告
const seeDetails = (item: any) => {
  //类型1-游戏，2-量表，3-眼动，4-抑郁
  //类型estimateServeCode: EDB-AD:是pad眼动，SMALL-GAME:是小程序小游戏，AD-8:是早期失智筛查AD8量表，YY0001:是抑郁，MoCA:是蒙特利尔量表， EDB-AD-LIET:是手机眼动,MMSE:简易智力筛查量表,HAMA:汉密尔顿焦虑量表,HAMD-24:汉密尔顿抑郁量表,ADL:生活能力量表,HADS:医院焦虑抑郁量表
  console.log(item.estimateServeCode);
  console.log(pathEnum[item.estimateServeCode]);
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
      type: item.type,
      pdfUrl: item.reportPdfUrl,
      pdfDisplay: 1
    }
  });
};
//分页
const pageSizeChange = (pageSize: any) => {
  formSearch.pageSize = pageSize;
  formSearch.pageNum = 1;
  loadTableData();
};
const currentChange = (current: any) => {
  formSearch.pageNum = current;
  loadTableData();
};
// //获取来源
// const knowGetDict = () => {
//   estimateOrderSeclect().then((res: any) => {
//     if (res.code === 200) {
//       seclectLabel.value = res.data.map((item: any) => {
//         return {
//           label: item.organizationName,
//           value: item.organizationId
//         };
//       });
//     }
//   });
// };
//获取来源
const knowGetDict = () => {
  getOrganMultiSelect().then((res: any) => {
    if (res.code === 200) {
      seclectLabel.value = res.data;
      console.log(seclectLabel.value);
    }
  });
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 280px;
        margin-left: 5px;
      }
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 15px;

    .btn-see-blue {
      background: #f2f2f2;
      color: #a2a2a2;
    }
  }
}

::v-deep(.t-table thead tr) {
  background: #fafbfd;
}

::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
}
</style>
