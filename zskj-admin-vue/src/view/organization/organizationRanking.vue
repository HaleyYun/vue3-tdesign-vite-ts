<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">所属名称：<t-cascader class="ipt-slt" v-model="titleData.organId" clearable :options="seclectLabel" :show-all-levels="false" placeholder="请选择" check-strictly></t-cascader></div>
      <div class="search-item search-item-font">
        筛查频次：<t-input class="slt" v-model="titleData.checkNumberMin" theme="normal" :onKeyUp="(titleData.checkNumberMin = titleData.checkNumberMin.replace(/[^\d]/g, ''))" auto-width /><span class="to">&nbsp;至</span>

        <t-input class="slt" v-model="titleData.checkNumberMax" :onKeyUp="(titleData.checkNumberMax = titleData.checkNumberMax.replace(/[^\d]/g, ''))" theme="normal" auto-width />
      </div>
      <!-- <div class="search-item search-item-font">所属渠道:<t-input class="ipt-slt" v-model="titleData.channel" placeholder="请输入所属渠道" /></div> -->
      <div class="search-item search-item-font">时间范围：<t-date-range-picker enable-time-picker allow-input clearable @change="onChange" v-model="titleData.timeData" /></div>
      <t-button class="search-item" @click="search">
        <!-- <template #icon><SearchIcon /></template>` -->
        搜索</t-button
      >
      <t-button variant="outline" theme="primary" @click="reset">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="id" :max-height="fixedTopRows ? 1400 : 460" :data="tableData" :sort="sort" @sort-change="sortChange" @change="upChange" :bordered="false" :columns="columns" size="medium" table-layout="fixed">
        <!-- <template #title-slot-name>
          <div class="title" @click="sort">排名<UnfoldMoreIcon /></div>
        </template> -->
        <template #operation="{ row }">
          <t-button variant="text" theme="primary" size="small" class="btn-c-blue m-l" @click="rehandleClick(row)"> 员工排名 </t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRoleStore } from '../../store/modules/role';
import { SearchIcon, FilePasteIcon, UnfoldMoreIcon } from 'tdesign-icons-vue-next';
import { getOrganMultiSelect } from '../../request/modules/institution';
import { DateRangeValue } from 'tdesign-vue-next';
import { getStatisticsData } from '../../request/modules/StatisticsApi';
import { useRouter } from 'vue-router';
import load from '../../components/load/load.vue';
const router = useRouter();
const roleState = useRoleStore();
const seclectLabel = ref<any>([{ label: '', value: '', children: [] }]);
// 表单
const formData = reactive({
  organization: '',
  min: '',
  max: '',
  channel: ''
});
const sort = ref<any>({
  sortBy: 'status',
  descending: true
});
const onChange = (value: DateRangeValue) => {
  titleData.beginTime = value[0] as string;
  titleData.endTime = value[1] as string;
};
//----- 加载列表数据 ---------
let formSearch = reactive<any>({
  account: '',
  checkNumberMax: '',
  checkNumberMin: '',
  name: '',
  orderFieldOneSequence: '',
  orderFieldTwoSequence: '',
  organId: '',
  organNum: '',
  pageNum: 1,
  pageSize: 10,
  timeData: []
});
let titleData = reactive<any>({
  account: '',
  checkNumberMax: '',
  checkNumberMin: '',
  name: '',
  orderFieldOneSequence: '',
  orderFieldTwoSequence: '',
  organId: '',
  organNum: '',
  pageNum: 1,
  pageSize: 10,
  timeData: []
});
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  if (roleState.userInfo.organizationLevel == 3) {
    router.push({ path: '/employeeRanking' });
  } else {
    loadTableData();
    knowGetDict();
  }
});
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const tableData = ref<any>([]);
const loadTableData = () => {
  getStatisticsData(formSearch).then((res: any) => {
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
// 搜索按钮
const search = () => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};
// 重置按钮
const reset = () => {
  formSearch.account = '';
  formSearch.checkNumberMax = '';
  formSearch.checkNumberMin = '';
  formSearch.name = '';
  formSearch.orderFieldOneSequence = '';
  formSearch.orderFieldTwoSequence = '';
  formSearch.organId = '';
  formSearch.organNum = '';
  formSearch.timeData = [];
  formSearch.pageSize = 10;
  formSearch.pageNum = 1;
  formSearch.beginTime = '';
  formSearch.endTime = '';
  sort.value = {};
  titleData.beginTime = '';
  titleData.endTime = '';
  titleData.account = '';
  titleData.checkNumberMax = '';
  titleData.checkNumberMin = '';
  titleData.name = '';
  titleData.orderFieldOneSequence = '';
  titleData.orderFieldTwoSequence = '';
  titleData.organId = '';
  titleData.organNum = '';
  titleData.timeData = [];
  titleData.pageSize = 10;
  titleData.pageNum = 1;
  loadTableData();
};
// 表格
let columns = ref<any>([
  { colKey: 'orderNum', title: '排名', align: 'center', sortType: 'all', sorter: true },
  { colKey: 'organName', title: '机构名称', width: '180px', align: 'center' },
  { colKey: 'checkNumber', title: '筛查频次', align: 'center' },
  { colKey: 'assessorNumber', title: '员工数量', align: 'center' },
  { colKey: 'channelName', title: '所属渠道', width: '180px', align: 'center' },
  { colKey: 'operation', title: '操作', align: 'center' }
]);
let data = ref<any>([
  { id: 1, name: '脑健康体检30天', num: '3', type: '1', state: '1' },
  { id: 2, name: '脑健康体检30天', num: '3', type: '1', state: '1' }
]);
const rehandleClick = (row: any) => {
  console.log(row);
  router.push({
    path: '/employeeRanking',
    query: {
      channelCode: row.channelNum,
      organNum: row.organNum
    }
  });
};
const request = sort => {
  //进行数据排序
  if (sort) {
    if (sort.descending) {
      formSearch.orderFieldOneSequence = 'desc';
      loadTableData();
    } else {
      formSearch.orderFieldOneSequence = '';
      loadTableData();
    }
  } else {
    formSearch.orderFieldOneSequence = '';
    loadTableData();
  }
};
// 排序
// const sort = () => {
//   console.log('排序');
// };
const sortChange = val => {
  console.log(val, 'val');

  sort.value = val;
  request(val);
};
// 排序、分页、过滤等发生变化时会出发 change 事件
const upChange = (info, context) => {
  console.log('change', info, context);
};

// 分页
let total = ref(0);
const pageSizeChange = (pageSize: any) => {
  formSearch.pageSize = pageSize;
  formSearch.pageNum = 1;
  loadTableData();
};
const currentChange = (current: any) => {
  formSearch.pageNum = current;
  loadTableData();
};
//获取来源
const knowGetDict = () => {
  getOrganMultiSelect().then((res: any) => {
    if (res.code === 200) {
      seclectLabel.value = res.data;
      console.log(seclectLabel.value);
    }
  });
};
// const onChangNum = value => {
//   //正则
//   //判断不能为负数不可以为0
//   let special = /^([0]|[1-9][0-9]*)$/;
//   if (!special.test(value)) {
//     // titleData.checkNumberMin = '';
//     // formSearch.checkNumberMin = '';
//   }
// };
// const onChangMax = val => {
//   let special = /^([0]|[1-9][0-9]*)$/;
//   if (!special.test(val)) {
//     // titleData.checkNumberMax = '';
//     // formSearch.checkNumberMax = '';
//   }
// };
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
    padding: 0 15px;
    margin-bottom: 16px;
    background-color: #ffffff;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 180px;
        margin-left: 5px;
      }
      .slt {
        width: 80px;
        margin-left: 5px;
      }
    }
  }
}
.tab-box {
  height: auto;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 15px;
}
.t-pagination__total {
  width: auto;
}
.t-pagination {
  margin-top: 30px;
}
::v-deep(.t-pagination__total) {
  flex: none !important;
}

.to {
  margin: 0 5px;
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
