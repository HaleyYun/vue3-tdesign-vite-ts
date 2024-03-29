<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">优惠券名称：<t-input class="ipt-slt" v-model="titleData.couponName" placeholder="请输入券名称关键字~" auto-width /></div>
      <div class="search-item search-item-font">优惠劵类型：<t-select class="ipt-slt" v-model="titleData.couponType" :options="typeOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">优惠劵状态：<t-select class="ipt-slt" v-model="titleData.status" :options="statusOption" placeholder="请选择"></t-select></div>

      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <t-button style="margin-left: 15px" theme="primary" @click="addCoupon">
        <template #icon> <AddIcon /></template>新增</t-button
      >
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1800 : 470" :bordered="false" :data="tableData" :columns="(couponColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium">
        <template #action="{ row }">
          <div class="action">
            <span>
              <t-button size="small" disabled v-if="row.status == 1 || row.status == 2" variant="text" theme="success">编辑</t-button>
              <t-button size="small" v-else variant="text" theme="success" @click="seeEdit(row)">编辑</t-button>
            </span>
            <t-button size="small" variant="text" @click="seeDetails(row)" theme="primary">查看详情</t-button>
          </div>
        </template>
        <template #couponType="{ row }">
          <div class="knowledge" v-if="row.couponType == 1">
            <img style="width: 20px; height: 20px" src="../../assets/img/knowledge/zhe.png" alt="图标" />
            <span style="color: #11aa66">折扣</span>
          </div>
          <div class="knowledge" v-if="row.couponType == 2">
            <img style="width: 20px; height: 20px" src="../../assets/img/knowledge/reduction.png" alt="图标" />
            <span style="color: #ff7744">满减</span>
          </div>
        </template>
        <template #status="{ row }">
          <span v-if="row.status == 0">待开始</span>
          <span v-if="row.status == 1">进行中</span>
          <span v-if="row.status == 2">已结束</span>
        </template>
        <template #beginTime="{ row }">
          <span>{{ row.beginTime }}-{{ row.endTime }}</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { couponColumns } from './data/configuration';
import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { AddIcon } from 'tdesign-icons-vue-next';
import { couponPage } from '../../request/modules/MarketApi';

import { useRouter } from 'vue-router';
import load from '../../components/load/load.vue';

// --------全局参数---------------
const router = useRouter();

const total = ref<any>('');

const statusOption = ref<any>([
  { label: '全部', value: '' },
  { label: '待开始', value: 0 },
  { label: '进行中', value: 1 },
  { label: '已结束', value: 2 }
]);
const typeOption = ref<any>([
  { label: '全部', value: '' },
  { label: '折扣', value: 1 },
  { label: '满减', value: 2 }
]);
let formSearch = reactive<any>({
  couponName: '',
  couponType: '',
  status: '',
  pageSize: 10,
  pageNum: 1
});
let titleData = reactive<any>({
  couponName: '',
  couponType: '',
  status: '',
  pageSize: 10,
  pageNum: 1
});

// 搜索
const searchCoupon = (values: any) => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};
const search = () => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};

const rest = () => {
  formSearch.couponName = '';
  formSearch.couponType = '';
  formSearch.status = '';
  titleData.couponName = '';
  titleData.couponType = '';
  titleData.status = '';
  formSearch.pageNum = 1;
  formSearch.pageSize = 10;
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
});

let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const tableData = ref<any>([]);
const loadTableData = () => {
  couponPage(formSearch).then((res: any) => {
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

//选择时间
const onChange = (value: DateRangeValue) => {
  titleData.estimateStaTime = value[0] as string;
  titleData.estimateEndTime = value[1] as string;
};
//详情
const seeDetails = (item: any) => {
  router.push({
    path: '/couponDetails',
    query: {
      posId: item.id, //id
      detailsId: item.channelProductRelationId, //产品id
      code: item.channelCode
    }
  });
};
//编辑优惠券
const seeEdit = (item: any) => {
  console.log(item);

  router.push({
    path: '/couponModify',
    query: {
      posId: item.id, //id
      code: item.channelCode
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

//新增优惠券
const addCoupon = () => {
  router.push({
    path: '/couponNewAdd',
    query: {}
  });
};

// //优惠劵状态
// const changeGroup = (context: any) => {
//   console.log(context);
//   formSearch.status = context;
//   loadTableData();
// };
// //优惠券类型
// const changeRadio = (context: any) => {
//   console.log(context);
//   formSearch.couponType = context;
//   loadTableData();
// };

//
// const onCoupon = val => {
//   if (val == '') {
//     formSearch.couponName = '';
//     loadTableData();
//   }
// };
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // background-color: #ffffff;
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
