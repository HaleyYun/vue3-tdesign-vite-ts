<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">工单编号：<t-input class="ipt-slt" v-model="titleData.ticketsEquityCode" placeholder="请输入工单编号" /></div>
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" v-model="titleData.clientName" placeholder="请输入客户姓名" /></div>
      <div class="search-item search-item-font">联系电话：<t-input class="ipt-slt" v-model="titleData.phone" placeholder="请输入联系电话" /></div>
      <div class="search-item search-item-font">&nbsp;&nbsp;&nbsp;&nbsp;激活码：<t-input class="ipt-slt" v-model="titleData.activeCode" placeholder="请输入激活码关键字~" /></div>
      <div class="search-item search-item-font">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：<t-select class="ipt-slt" v-model="titleData.status" :options="options"></t-select></div>
      <div class="search-item search-item-font">操作人员：<t-input class="ipt-slt" v-model="titleData.updateUser" placeholder="请输入操作人员账户~" /></div>
      <div class="search-item search-item-font">工单来源：<t-select class="ipt-slt" v-model="titleData.source" :options="sourceOptions"></t-select></div>
      <div class="search-item search-item-font">操作时间：<t-date-range-picker allow-input clearable enable-time-picker @change="onChange" v-model="titleData.timeData" /></div>

      <t-button class="search-item" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="reset">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="orderList?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="id" :max-height="fixedTopRows ? 1400 : 362" :data="orderList" :bordered="false" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #operation="{ row }">
          <t-button variant="text" theme="primary" size="small" class="btn-c-blue m-l" @click="rehandleClick(row)"> 查看详情 </t-button>
        </template>
        <template #statusItem="{ row }">
          <span v-if="row.status == '0'">已核销</span>
          <span v-if="row.status == '1'">使用中</span>
          <span v-if="row.status == '2'">已完成</span>
        </template>
        <template #source="{ row }">
          <span v-if="row.source == 'lite'">LIET端</span>
          <span v-if="row.source == 'pro'">PRO端</span>
        </template>
        <template #begnTime="{ row }">
          <span>{{ row.begnTime }}-{{ row.endTime }}</span>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { SearchIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { DateValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { RightsInterestsOrder } from '../../request/modules/orderApi';
import load from '../../components/load/load.vue';
const router = useRouter();
const orderList = ref<any>([]);
let searchData = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  begnTime: '',
  endTime: '',
  clientId: '',
  clientName: '',
  equityId: '',
  equityName: '',
  payWay: '',
  phone: '',
  activeCode: '',
  source: '',
  updateUser: '',
  status: '',
  clientResourceChannel: '',
  ticketsEquityCode: '',
  timeData: []
});
let titleData = reactive<any>({
  begnTime: '',
  endTime: '',
  clientId: '',
  clientName: '',
  equityId: '',
  equityName: '',
  payWay: '',
  phone: '',
  activeCode: '',
  source: '',
  updateUser: '',
  status: '',
  clientResourceChannel: '',
  ticketsEquityCode: '',
  timeData: []
});
const total = ref<any>('');
let options = ref([
  { label: '全部', value: '' },
  { label: '已核销', value: '0' },
  { label: '使用中', value: '1' },
  { label: '已完成', value: '2' }
]);
let sourceOptions = ref([
  { label: '全部', value: '' },
  { label: 'LITE端', value: 'lite' },
  { label: 'PRO端', value: 'pro' }
]);

// const onChange = (value: any, context: any) => {
//   console.log('onChange:', value, context);
//   console.log(
//     'timestamp:',
//     context.dayjsValue.map((d: any) => d.valueOf())
//   );
//   console.log(
//     'YYYYMMDD:',
//     context.dayjsValue.map((d: any) => d.format('YYYYMMDD'))
//   );
// };
const onChange = (value: DateValue[]) => {
  titleData.begnTime = value[0] as string;
  titleData.endTime = value[1] as string;
};
// 搜索按钮
const search = () => {
  searchData = Object.assign(searchData, titleData);
  searchData.pageNum = 1;
  interestsOrder();
};
// 重置按钮
const reset = () => {
  searchData.pageNum = 1;
  searchData.pageSize = 10;
  searchData.begnTime = '';
  searchData.endTime = '';
  searchData.clientId = '';
  searchData.clientName = '';
  searchData.equityId = '';
  searchData.equityName = '';
  searchData.payWay = '';
  searchData.phone = '';
  searchData.activeCode = '';
  searchData.source = '';
  searchData.updateUser = '';
  searchData.status = '';
  searchData.ticketsEquityCode = '';
  searchData.timeData = [];

  titleData.begnTime = '';
  titleData.endTime = '';
  titleData.clientId = '';
  titleData.clientName = '';
  titleData.equityId = '';
  titleData.equityName = '';
  titleData.payWay = '';
  titleData.phone = '';
  titleData.activeCode = '';
  titleData.source = '';
  titleData.updateUser = '';
  titleData.status = '';
  titleData.ticketsEquityCode = '';
  titleData.timeData = [];
  interestsOrder();
};
// 表格
const columns = ref([
  { colKey: 'ticketsEquityCode', title: '工单编号', align: 'center', width: '140px' },
  { colKey: 'equityName', title: '权益名称', align: 'center', width: '140px' },
  { colKey: 'clientName', title: '客户姓名', align: 'center' },
  { colKey: 'phone', title: '联系电话', align: 'center', width: '140px' },
  { colKey: 'serviceTimes', title: '服务次数', align: 'center' },
  { colKey: 'statusItem', title: '状态', align: 'center' },
  { colKey: 'activeCode', title: '激活码', align: 'center', width: '140px' },
  { colKey: 'source', title: '工单来源', align: 'center' },
  { colKey: 'updateUser', title: '操作人员', align: 'center' },
  { colKey: 'updateTime', title: '操作时间', align: 'center', width: '180px' },
  { colKey: 'begnTime', title: '有效期', align: 'center', width: '180px' },
  { colKey: 'operation', title: '操作', align: 'center', slots: { customRender: 'operation' }, width: '140px', fixed: 'right' }
]);

const rehandleClick = (row: any) => {
  router.push({
    path: '/RightsInterestsDetails',
    query: {
      id: row.id,
      code: row.ticketsEquityCode
    }
  });
};
//分页
const pageSizeChange = (pageSize: any) => {
  searchData.pageSize = pageSize;
  searchData.pageNum = 1;
  interestsOrder();
};
const currentChange = (current: number) => {
  searchData.pageNum = current;
  interestsOrder();
};
const fixedTopRows = ref<boolean>(false);
onMounted(async () => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  interestsOrder();
});
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const interestsOrder = () => {
  RightsInterestsOrder(searchData as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (orderList.value = []);
      } else {
        orderList.value = res.data.data;
        total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (orderList.value = []);
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
    padding: 0 15px;
    margin-bottom: 16px;
    background-color: #ffffff;

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
}
.tab-box {
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
