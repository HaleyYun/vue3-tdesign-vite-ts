<template>
  <div class="user-box">
    <div class="box-img" @click="back">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">返回</t-button>
      </div>
    </div>
    <div class="search-box">
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" v-model="titleData.name" placeholder="请输入客户姓名~" auto-width /></div>
      <div class="search-item search-item-font">联系电话：<t-input class="ipt-slt" v-model="titleData.phone" placeholder="请输入联系电话~" auto-width /></div>
      <div class="search-item search-item-font">状态：<t-select class="ipt-slt" v-model="titleData.status" :options="statusOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">活动渠道： <t-select class="ipt-slt" v-model="titleData.channelCode" :options="orgData" placeholder="请选择渠道名称" filterable /></div>
      <div class="search-item search-item-font">操作时间： <t-date-range-picker enable-time-picker allow-input clearable @change="onTimeChange" v-model="timeData" /></div>

      <t-button class="search-item" theme="primary" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
    </div>
    <div style="font-size: 18px; margin-bottom: 20px">本次活动页面访问总量：{{ joinArr.visitNumber }}人次，参与测试人数：{{ joinArr.joinNumber }}人，领取奖励人数{{ joinArr.shareNumber }}人</div>
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table :data="tableData" :max-height="fixedTopRows ? 1800 : 470" :bordered="false" :columns="(joinLogColumns as PrimaryTableCol<TableRowData>[])" row-key="index" :pagination="pagination" table-layout="fixed" size="medium" lazy-load @page-change="onPageChange">
        <template #status="{ row }">
          <span v-if="row.status == '1'">待支付</span>
          <span v-if="row.status == '3'">已使用</span>
          <span v-if="row.status == '6'">已取消 </span>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { joinLogColumns } from './data/configuration';
import { DateRangeValue, PrimaryTableCol, SwitchValue, TableRowData, MessagePlugin } from 'tdesign-vue-next';
import { marketingJoinLog } from '../../request/modules/MarketApi';
import { channelSelect } from '../../request/modules/ServiceApi';
import { useRouter } from 'vue-router';
import { debounce } from '../../utils/tools';
import load from '../../components/load/load.vue';
import { log } from 'console';

const pagination = reactive<any>({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true
});
const timeData = ref<any>([]);
const statusOption = ref<any>([
  { label: '全部', value: '' },
  { label: '待支付', value: 1 },
  { label: '已使用', value: 3 },
  { label: '已取消', value: 6 }
]);
// const dataImage=ref<any>('data:image/png;base64')
// BaseTable 中只有 page-change 事件，没有 change 事件
const onPageChange = debounce((pageInfo, context) => {
  console.log('page-change', pageInfo);
  if (pageInfo.pageSize != pagination.pageSize) {
    console.log('22');
    pagination.current = 1;
    formSearch.pageNum = 1;
    pagination.pageSize = pageInfo.pageSize;
    formSearch.pageSize = pageInfo.pageSize;
  } else {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize;
    formSearch.pageSize = pageInfo.pageSize;
    formSearch.pageNum = pageInfo.current;
  }
  console.log('333');
  loadTableData();
}, 500);

// --------全局参数---------------
const router = useRouter();
const route = useRoute();
const total = ref<any>('');
const joinArr = reactive<any>({
  joinNumber: 0,
  shareNumber: 0,
  visitNumber: 0
});
let formSearch = reactive<any>({
  activityId: '',
  channelCode: '',
  beginTime: '',
  endTime: '',
  phone: '',
  status: '',
  name: '',
  id: '',
  pageSize: 10,
  pageNum: 1
});
let titleData = reactive<any>({
  activityId: '',
  channelCode: '',
  beginTime: '',
  endTime: '',
  phone: '',
  status: '',
  name: '',
  id: '',
  pageSize: 10,
  pageNum: 1
});

// 搜索
const search = () => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};

const rest = () => {
  formSearch.channelCode = '';
  formSearch.activityId = '';
  formSearch.beginTime = '';
  formSearch.endTime = '';
  formSearch.phone = '';
  formSearch.status = '';
  formSearch.id = '';
  formSearch.name = '';
  formSearch.pageNum = 1;
  formSearch.pageSize = 10;
  titleData.channelCode = '';
  titleData.activityId = '';
  titleData.beginTime = '';
  titleData.endTime = '';
  titleData.phone = '';
  titleData.status = '';
  titleData.id = '';
  titleData.name = '';
  timeData.value = [];
  loadTableData();
};

//----- 加载列表数据 ---------
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }

  loadTableData();
  getOrganizationList();
});
const orgData = ref([]);
// 获取渠道
const getOrganizationList = () => {
  let data = {
    pageNum: 1,
    pageSize: 999
  };
  channelSelect(data).then((res: any) => {
    if (res.code === 200) {
      orgData.value = res.data.data.map((item: any) => {
        return {
          label: item.organizationName,
          value: item.organizationNum
        };
      });
    }
  });
};
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const tableData = ref<any>([]);
const loadTableData = () => {
  formSearch.activityId = route.query?.activityId;
  formSearch.id = route.query?.detailsID;
  console.log(formSearch.activityId, 'route.query.activityId');
  marketingJoinLog(formSearch).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data.joinList == null || res.data.joinList.total == 0) {
        console.log(res.data.joinList.data, 'res.data.data');
        //无数据
        (loadStatus.value = 'noData'), (tableData.value = []);
      } else {
        console.log(res.data.joinList.data, 'res.data.data');
        joinArr.joinNumber = res.data.joinNumber;
        joinArr.shareNumber = res.data.shareNumber;
        joinArr.visitNumber = res.data.visitNumber;
        tableData.value = res.data.joinList.data;
        pagination.total = res.data.joinList.total;
        total.value = res.data.joinList.total;
      }
    } else {
      (loadStatus.value = 'failure'), (tableData.value = []);
    }
  });
};
const onTimeChange = (value: DateRangeValue) => {
  titleData.beginTime = value[0] as string;
  titleData.endTime = value[1] as string;
};
const back = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // background-color: #ffffff;
  display: flex;
  flex-direction: column;
  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;

    .box-left {
      display: flex;
      align-items: center;

      .img-btn {
        font-size: 22px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 30px;
      }
    }

    .expansion {
      margin-right: 50px;
      font-size: 20px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #919191;
      line-height: 28px;

      img {
        width: 12px;
        height: 6.72px;
        margin-right: 3.36px;
      }
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;
    background-color: #ffffff;

    .search-item {
      margin: 10px 15px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 225px;
        margin-left: 5px;
      }
    }
  }
  .coupon-type {
    display: flex;
    align-items: center;
    padding: 24px 0 16px 12px;
    .couponGroup {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
      padding: 0 15px;
    }
  }
  .coupon-status {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    padding-left: 12px;
    .couponGroup {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
      padding: 0 15px;
    }
  }
  .action {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-Edit {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 52px;
      height: 26px;
      background: #f4f4f4;
      margin-right: 8px;
      border-radius: 6px;
      cursor: pointer;
      .title {
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #909090;
        line-height: 17px;
      }
    }
    .btn-seedEdit {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffedd5;
      border-radius: 6px;
      width: 52px;
      height: 26px;
      margin-right: 8px;
      cursor: pointer;
      .title {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ee8317;
        line-height: 17px;
      }
    }
    .btn-Details {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 76px;
      height: 26px;
      background: #f1f6ff;
      border-radius: 6px;
      cursor: pointer;
      .title {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3d7eff;
        line-height: 17px;
      }
    }
  }
  .knowledge {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
}
::v-deep(.t-checkbox.t-is-disabled .t-checkbox__input) {
  background-color: #dcdce0;
}
::v-deep(.t-radio-group .t-radio-button.t-is-checked + .t-radio-button) {
}
::v-deep(.t-radio-group.t-radio-group__outline.t-size-m .t-radio-button) {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  border: none;
  background: #f1f6ff;
  border-radius: 6px;
  width: 80px;
  height: 30px;
}

::v-deep(.t-radio-group.t-size-m .t-radio-button) {
  font-size: 12px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #3d7eff;
  line-height: 17px;
}
::v-deep(.t-radio-group.t-size-m .t-radio-button.t-is-checked) {
  font-size: 12px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 17px;
}
::v-deep(.t-radio-group.t-radio-group__outline .t-radio-button.t-is-checked) {
  width: 80px;
  height: 30px;
  background: #3d7eff;
  border-radius: 6px;
}
::v-deep(.t-table .t-table__content .t-table--layout-auto .t-table__header tr) {
  background-color: #fafbfd;
}
::v-deep(.t-input.t-size-l) {
  border-radius: 8px;
}
.tab-box {
  height: auto;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 10px;
}
</style>
