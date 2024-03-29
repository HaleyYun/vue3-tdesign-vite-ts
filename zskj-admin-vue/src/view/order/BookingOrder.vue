<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">工单编号：<t-input class="ipt-slt" v-model="titleData.ticketsBookingCode" placeholder="请输入工单编号" /></div>
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" v-model="titleData.clientName" placeholder="请输入客户姓名" /></div>
      <div class="search-item search-item-font">联系电话：<t-input class="ipt-slt" v-model="titleData.phone" placeholder="请输入联系电话" /></div>
      <div class="search-item search-item-font">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：<t-select class="ipt-slt" v-model="titleData.status" :options="options"></t-select></div>
      <div class="search-item search-item-font">创建时间：<t-date-range-picker enable-time-picker allow-input clearable @change="onChange" v-model="titleData.timeData" /></div>
      <t-button class="search-item" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="reset">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="id" :data="data" :max-height="fixedTopRows ? 1400 : 420" :bordered="false" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #operation="{ row }">
          <t-button variant="text" theme="primary" size="small" class="btn-c-blue m-l" @click="rehandleClick(row)"> 查看详情 </t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="formData.pageSize" :total="total" v-model:current="formData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { SearchIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { DateRangeValue, PrimaryTableCol, TableRowData, TabValue, MessagePlugin, TScroll } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { BookingOrder } from '../../request/modules/orderApi';
import load from '../../components/load/load.vue';
const router = useRouter();
// 表单
let formData = reactive({
  clientName: '',
  createTimeBegn: '',
  createTimeEnd: '',
  pageNum: 1,
  pageSize: 10,
  status: 7,
  ticketsBookingCode: '',
  phone: '',
  timeData: []
});
let titleData = reactive({
  clientName: '',
  createTimeBegn: '',
  createTimeEnd: '',
  status: 7,
  ticketsBookingCode: '',
  phone: '',
  timeData: []
});
let options = ref([
  { label: '全部', value: 7 },
  { label: '待支付', value: 1 },
  { label: '已预约', value: 2 },
  { label: '已完成', value: 3 },
  { label: '待退款', value: 4 },
  { label: '已退款', value: 5 }
]);
const onChange = (value: any) => {
  titleData.createTimeBegn = value[0];
  titleData.createTimeEnd = value[1];
};
// 搜索按钮
const search = () => {
  formData = Object.assign(formData, titleData);
  formData.pageNum = 1;
  getBookingOrder(formData);
};
// 重置按钮
const reset = () => {
  formData.clientName = '';
  formData.createTimeBegn = '';
  formData.createTimeEnd = '';
  formData.ticketsBookingCode = '';
  formData.phone = '';
  formData.status = 7;
  formData.pageNum = 1;
  formData.pageSize = 10;
  formData.timeData = [];

  titleData.clientName = '';
  titleData.createTimeBegn = '';
  titleData.createTimeEnd = '';
  titleData.ticketsBookingCode = '';
  titleData.phone = '';
  titleData.status = 7;
  titleData.timeData = [];
  getBookingOrder(formData);
};
// 表格
let columns = ref([
  { colKey: 'ticketsBookingCode', title: '预约单号', align: 'center', width: '190px' },
  { colKey: 'servName', title: '预约服务', align: 'center', width: '230px' },
  { colKey: 'clientName', title: '客户姓名', align: 'center' },
  { colKey: 'phone', title: '联系电话', align: 'center', width: '140px' },
  { colKey: 'bookingTime', title: '预约时间', width: '280px', align: 'center' },
  { colKey: 'institutionName', title: '预约机构', align: 'center', width: '200px' },
  { colKey: 'money', title: '支付金额', align: 'center' },
  { colKey: 'statusName', title: '状态', align: 'center', width: '80px' },
  { colKey: 'createTime', title: '创建时间', align: 'center', width: '180px' },
  { colKey: 'operation', title: '操作', fixed: 'right', slots: { customRender: 'operation' }, align: 'center', width: '180px' }
]);
let data = ref([]);
const rehandleClick = (row: any) => {
  router.push({
    path: '/BookingDetails',
    query: {
      ticketsBookingCode: row.ticketsBookingCode,
      id: row.id
    }
  });
};
// 分页
let total = ref(0);
const pageSizeChange = (pageSize: number) => {
  formData.pageSize = pageSize;
  formData.pageNum = 1;
  getBookingOrder(formData);
};
const currentChange = (current: number) => {
  formData.pageNum = current;
  getBookingOrder(formData);
};
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
// 请求
const getBookingOrder = (formData: any) => {
  BookingOrder(formData).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (data.value = []);
      } else {
        data.value = res.data.data;
        total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (data.value = []);
    }
  });
};
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  getBookingOrder(formData);
});
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
  padding: 10px;
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
