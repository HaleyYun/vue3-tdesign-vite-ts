<template>
  <div class="user-box">
    <div class="box-img" @click="back">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">返回</t-button>
      </div>
    </div>
    <div class="search-box">
      <div class="search-item search-item-font">渠道名称：<t-input class="ipt-slt" v-model="titleData.channelName" placeholder="请输入名称关键字~" auto-width /></div>

      <t-button class="search-item" theme="primary" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table :data="tableData" :max-height="fixedTopRows ? 1800 : 470" :bordered="false" :columns="(channelColumns as PrimaryTableCol<TableRowData>[])" row-key="index" :pagination="pagination" table-layout="fixed" size="medium" lazy-load @page-change="onPageChange">
        <template #qrCode="{ row }">
          <!-- <img style="width: 50px; height: 50px" :src="'data:image/png;base64,' + row.qrCode" alt="" /> -->
          <div class="tdesign-demo-image-viewer__base">
            <t-image-viewer :images="['data:image/png;base64,' + row.qrCode]">
              <template #trigger="{ open }">
                <div class="tdesign-demo-image-viewer__ui-image">
                  <img style="width: 50px; height: 50px; background-color: #000" alt="test" :src="'data:image/png;base64,' + row.qrCode" class="tdesign-demo-image-viewer__ui-image--img" />
                  <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                    <span><BrowseIcon size="1.4em" /></span>
                  </div>
                </div>
              </template>
            </t-image-viewer>
          </div>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { channelColumns } from './data/configuration';
import { DateRangeValue, PrimaryTableCol, SwitchValue, TableRowData, MessagePlugin } from 'tdesign-vue-next';
import { channelPage } from '../../request/modules/MarketApi';
import { BrowseIcon } from 'tdesign-icons-vue-next';
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

let formSearch = reactive<any>({
  channelName: '',
  activityMarketingId: '',
  pageSize: 10,
  pageNum: 1
});
let titleData = reactive<any>({
  channelName: '',
  activityMarketingId: '',
  pageSize: 10,
  pageNum: 1
});
const back = () => {
  router.go(-1);
};
// 搜索
const search = () => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};

const rest = () => {
  formSearch.channelName = '';
  titleData.channelName = '';
  // formSearch.activityMarketingId = '';
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
  formSearch.activityMarketingId = route.query?.activityId;
  console.log(formSearch.activityMarketingId, 'route.query.activityId');
  channelPage(formSearch).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        console.log(res.data.data, 'res.data.data');
        //无数据
        (loadStatus.value = 'noData'), (tableData.value = []);
      } else {
        console.log(res.data.data, 'res.data.data');

        tableData.value = res.data.data;
        pagination.total = res.data.total;
        // total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (tableData.value = []);
    }
  });
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
.tdesign-demo-image-viewer__ui-image {
  width: 50px;
  height: 50px;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);

  overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;

  background-color: rgba(0, 0, 0, 0.6);
  // background-color: #909090;
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
  opacity: 1;
  cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
  border-radius: 5px;
  background-color: #909090;
}

.tdesign-demo-image-viewer__ui-image--footer {
  padding: 0 16px;
  height: 56px;
  width: 100%;
  line-height: 56px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
  flex: 1;
}

.tdesign-demo-popup__reference {
  margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
  cursor: pointer;
}

.tdesign-demo-image-viewer__base {
  // width: 160px;
  height: 50px;
  // border: 4px solid var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
}
</style>
