<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">退款单号：<t-input class="ipt-slt" :maxlength="16" v-model="newSearchData.refundCode" placeholder="请输入退款单号" /></div>
      <div class="search-item search-item-font">工单单号：<t-input class="ipt-slt" :maxlength="16" v-model="newSearchData.ticketsCode" placeholder="请输入工单编号" /></div>
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" :maxlength="16" v-model="newSearchData.clientName" placeholder="请输入客户姓名" /></div>
      <div class="search-item search-item-font">工单类型：<t-select class="ipt-slt" v-model="newSearchData.ticketsType" :options="orderOptions"></t-select></div>
      <div class="search-item search-item-font">
        退款金额：
        <t-input-group style="margin-left: 5px" separate>
          <t-input-number :min="0" :max="9999999" theme="column" suffix="元" :style="{ width: '112px' }" v-model="newSearchData.refundMoneyMin" />
          <span :style="{ lineHeight: '32px' }">&nbsp;至 &nbsp;</span>
          <t-input-number :min="0" :max="99999999" theme="column" suffix="元" :style="{ width: '112px' }" v-model="newSearchData.refundMoneyMax" />
        </t-input-group>
      </div>
      <div class="search-item search-item-font">工单状态：<t-select class="ipt-slt" v-model="newSearchData.status" :options="options"></t-select></div>
      <t-button class="search-item" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="reset">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="refundData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="id" :max-height="fixedTopRows ? 1400 : 410" :data="refundData" :bordered="false" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #ticketsType="{ row }">
          <span>{{ row.ticketsType == 1 ? '预约工单' : '服务工单' }}</span>
        </template>
        <template #ticketsCode="{ row }">
          <t-link hover="color" theme="primary" @click="clickLink(row)"> {{ row.ticketsCode }} </t-link>
        </template>
        <template #status="{ row }">
          <span v-if="row.status === 0">待退款</span>
          <span v-if="row.status === 1">退款中</span>
          <span v-if="row.status === 2">已退款</span>
          <span v-if="row.status === 3">退款失败</span>
        </template>
        <template #action="{ row }">
          <t-button variant="text" theme="primary" size="small" :disabled="row.status != 0" @click="byRefund(row)"> 通过退款</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
    <t-dialog v-model:visible="visible" header="确认退款吗" :confirm-on-enter="true" :on-cancel="onCancel" :on-close="close" :on-confirm="onConfirmAnother" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { SearchIcon, BarcodeIcon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router';
import { queryRefundOrder, updateRefundOrder } from '../../request/modules/orderApi';
import { MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import load from '../../components/load/load.vue';
const router = useRouter();
// 分页
let current = ref(1);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
const visible = ref(false);
let searchData = reactive({
  clientName: '',
  refundCode: '',
  refundMoneyMax: undefined,
  refundMoneyMin: undefined,
  status: undefined,
  ticketsCode: '',
  ticketsType: '',
  pageNum: 1,
  pageSize: 10
});
let newSearchData = reactive({
  clientName: '',
  refundCode: '',
  refundMoneyMax: undefined,
  refundMoneyMin: undefined,
  status: undefined,
  ticketsCode: '',
  ticketsType: ''
});
let columns = ref([
  { colKey: 'refundCode', title: '退款单号', align: 'center' },
  { colKey: 'ticketsType', title: '工单类型', align: 'center' },
  {
    colKey: 'ticketsCode',
    title: '工单单号',
    width: '170px',
    align: 'center',
    slots: { customRender: 'ticketsCode' }
  },
  { colKey: 'clientName', title: '客户姓名', align: 'center' },
  { colKey: 'money', title: '订单金额', align: 'center' },
  { colKey: 'refundMoney', title: '退款金额', align: 'center' },
  { colKey: 'createTime', title: '创建时间', align: 'center' },
  {
    colKey: 'status',
    title: '工单状态',
    slots: { customRender: 'status' },
    align: 'center'
  },
  { colKey: 'action', title: '操作', fixed: 'right', slots: { customRender: 'action' }, width: '180px' }
]);
let refundData = ref([]);
// 表单
const formData = reactive({
  refundCode: '',
  orderCode: '',
  name: '',
  refundState: 0,
  orderState: 1,
  minPic: 0,
  maxPic: 100
});
const clickLink = (row: any) => {
  // row.ticketsId, row.ticketsType
  console.log(row);
  if (row.ticketsType == 1) {
    // 跳转预约工单
    router.push({
      path: '/BookingDetails',
      query: {
        ticketsBookingCode: row.ticketsCode,
        id: row.ticketsId
      }
    });
  } else {
    // 跳转服务工单
    router.push({
      path: '/MealDetails',
      query: {
        ticketsServiceCode: row.ticketsCode,
        id: row.ticketsId
      }
    });
  }
};
let orderOptions = ref([
  { label: '全部', value: '' },
  { label: '预约工单', value: 1 },
  { label: '服务工单', value: 2 }
]);

let options = ref([
  { label: '全部', value: undefined },
  { label: '待退款', value: 0 },
  { label: '已退款', value: 2 }
  // { label: '已拒绝', value: 2 },
]);
let rowData = ref<any>({});
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  getRerundOrder();
});
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
// 获取退款工单列表
const getRerundOrder = () => {
  queryRefundOrder(searchData as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (refundData.value = []);
      } else {
        refundData.value = res.data.data;
        total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (refundData.value = []);
    }
  });
};

// 点击退款
const byRefund = (data: any) => {
  visible.value = true;
  rowData.value = data;
};

const onConfirmAnother = () => {
  rowData.value.status = 1;
  updateRefundOrder(rowData.value).then((res: any) => {
    console.log(res);
    if (res.code === 200) {
      MessagePlugin.success(res.msg);
      visible.value = false;
      getRerundOrder();
    }
  });
};

const close = (context: any) => {
  visible.value = false;
};
const onCancel = (context: any) => {
  visible.value = false;
};
// 搜索按钮
const search = () => {
  searchData = Object.assign(searchData, newSearchData);
  searchData.pageNum = 1;
  getRerundOrder();
};
// 重置按钮
const reset = () => {
  searchData.clientName = '';
  searchData.refundCode = '';
  searchData.refundMoneyMin = undefined;
  searchData.refundMoneyMax = undefined;
  searchData.status = undefined;
  searchData.ticketsCode = '';
  searchData.ticketsType = '';
  searchData.pageNum = 1;
  searchData.pageSize = 10;

  newSearchData.clientName = '';
  newSearchData.refundCode = '';
  newSearchData.refundMoneyMin = undefined;
  newSearchData.refundMoneyMax = undefined;
  newSearchData.status = undefined;
  newSearchData.ticketsCode = '';
  newSearchData.ticketsType = '';
  getRerundOrder();
};

const pageSizeChange = (pageSize: number) => {
  searchData.pageSize = pageSize;
  searchData.pageNum = 1;
  getRerundOrder();
};
const currentChange = (current: number) => {
  searchData.pageNum = current;
  getRerundOrder();
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
        width: 250px;
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
