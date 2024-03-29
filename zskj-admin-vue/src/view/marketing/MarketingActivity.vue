<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">活动名称：<t-input class="ipt-slt" v-model="titleData.activityName" placeholder="请输入名称关键字~" auto-width /></div>
      <div class="search-item search-item-font">活动ID：<t-input class="ipt-slt" v-model="titleData.activityId" placeholder="请输入完整的活动ID~" auto-width /></div>
      <div class="search-item search-item-font">状态：<t-select class="ipt-slt" v-model="titleData.status" :options="statusOption" placeholder="请选择"></t-select></div>

      <t-button class="search-item" theme="primary" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <t-button style="margin-left: 15px" theme="primary" @click="addEvents">
        <template #icon> <AddIcon /></template>新增</t-button
      >
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table :data="tableData" :max-height="fixedTopRows ? 1800 : 470" :bordered="false" :columns="(eventsColumns as PrimaryTableCol<TableRowData>[])" row-key="index" :pagination="pagination" table-layout="fixed" size="medium" lazy-load @page-change="onPageChange">
        <template #prodCode="{ row }">
          <t-button variant="text" size="small" @click="seeEdit(row)" theme="primary" ghost>查看</t-button>
        </template>
        <template #status="{ row }">
          <t-switch :value="row.status" :customValue="[1, 0]" @change="(value: SwitchValue) => onTemplate(row, value as number)" :key="row.id" />
        </template>
        <template #action="{ row }">
          <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="deleteItem(row.id)">
            <t-button variant="text" theme="danger" size="small"> 删除</t-button>
          </t-popconfirm>
          <t-button variant="text" size="small" @click="edit(row)" theme="success" ghost>编辑</t-button>
          <t-button variant="text" size="small" theme="primary" ghost @click="details(row)">活动参与</t-button>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { eventsColumns } from './data/configuration';
import { DateRangeValue, PrimaryTableCol, SwitchValue, TableRowData, MessagePlugin } from 'tdesign-vue-next';
import { AddIcon } from 'tdesign-icons-vue-next';
import { findPage, marketingStatus, removeActivity } from '../../request/modules/MarketApi';
import { debounce } from '../../utils/tools';
import { useRouter } from 'vue-router';
import load from '../../components/load/load.vue';
import { log } from 'console';

const pagination = reactive<any>({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true
});

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

const total = ref<any>('');

const statusOption = ref<any>([
  { label: '全部', value: '' },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]);

let formSearch = reactive<any>({
  activityName: '',
  activityId: '',
  status: '',
  pageSize: 10,
  pageNum: 1
});
let titleData = reactive<any>({
  activityName: '',
  activityId: '',
  status: '',
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
  formSearch.activityName = '';
  formSearch.activityId = '';
  formSearch.status = '';
  titleData.activityName = '';
  titleData.activityId = '';
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
  findPage(formSearch).then((res: any) => {
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
        total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (tableData.value = []);
    }
  });
};
//改变状态
const onTemplate = (row: any, num: number) => {
  let data = {
    id: row.id,
    status: num,
    endTime: row.endTime
  };

  marketingStatus(data).then((res: any) => {
    if (res.code === 200) {
      loadTableData();
    } else {
      // MessagePlugin.error(res.msg);
    }
  });
};

//分页
const pageSizeChange = (pageSize: any) => {
  console.log('pageSize', pageSize);

  formSearch.pageSize = pageSize;
  formSearch.pageNum = 1;
  loadTableData();
};
// 序号=（当前页码 - 1）* 每页条数 + 索引 + 1
// 序号 = （pageNum - 1） * pageSize + index + 1
//新增
const addEvents = () => {
  router.push({
    path: '/MarketingContent',
    query: {}
  });
};
//删除
const deleteItem = (id: number) => {
  removeActivity({ id }).then((res: any) => {
    if (res.code === 200) {
      MessagePlugin.success('删除成功');
      loadTableData();
    }
  });
};
//编辑
const edit = (value: any) => {
  router.push({
    path: '/MarketingContent',
    query: {
      markID: value.id //渠道id
    }
  });
};
//查看活动参与
const details = (value: any) => {
  router.push({
    path: '/MarketingParticipate',
    query: {
      activityId: value.activityId, //活动id
      detailsID: value.id //id
    }
  });
};
//查看
const seeEdit = (value: any) => {
  router.push({
    path: '/MarketingInstitution',
    query: {
      activityId: value.id //活动id
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
