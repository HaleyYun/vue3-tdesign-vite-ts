<template>
  <div class="employee">
    <div v-if="roleState.userInfo.organizationLevel != 3" class="box-img" @click="back">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text" @click="">员工列表</t-button>
      </div>
    </div>
    <div class="form-box">
      <t-form ref="form" :data="formData" :colon="true">
        <t-form-item label="员工姓名" initial-data="TDesign">
          <t-input class="ipt-slt" v-model="titleData.name" placeholder="请输入员工姓名" />
        </t-form-item>
        <t-form-item label="员工账号" initial-data="TDesign">
          <t-input class="ipt-slt" v-model="titleData.account" placeholder="请输入员工账号" />
        </t-form-item>
        <t-form-item label="筛查频次" initial-data="TDesign">
          <t-input class="slt" v-model="titleData.checkNumberMin" theme="normal" auto-width :onKeyUp="(titleData.checkNumberMin = titleData.checkNumberMin.replace(/[^\d]/g, ''))" /><span class="to">至</span>
          <t-input class="slt" v-model="titleData.checkNumberMax" theme="normal" auto-width :onKeyUp="(titleData.checkNumberMax = titleData.checkNumberMax.replace(/[^\d]/g, ''))" />
        </t-form-item>
        <t-form-item label="时间范围" initial-data="TDesign">
          <t-space direction="vertical">
            <t-date-range-picker enable-time-picker allow-input clearable @change="onChange" v-model="titleData.timeData" />
          </t-space>
        </t-form-item>
        <t-button class="search-item" @click="search">
          <!-- <template #icon>
          <SearchIcon /> </template> -->
          搜索
        </t-button>
        <t-button variant="outline" theme="primary" @click="reset">重置</t-button>
      </t-form>
    </div>

    <div class="tab-box">
      <t-table :max-height="fixedTopRows ? 1400 : 350" row-key="id" :data="tableData" :sort="sort" @sort-change="sortChange" @change="upChange" :bordered="false" :columns="columns" size="medium" table-layout="fixed">
        <!-- <template #title-slot-name>
        <div class="title" @click="sort">
          排名
          <UnfoldMoreIcon />
        </div>
      </template> -->
      </t-table>
    </div>
    <div class="pagination">
      <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { SearchIcon, UnfoldMoreIcon } from 'tdesign-icons-vue-next';
import { useRoleStore } from '../../store/modules/role';
import { useRouter, useRoute } from 'vue-router';
import { DateRangeValue } from 'tdesign-vue-next';
import { link } from 'fs';
import { getEmployeesRanking } from '../../request/modules/StatisticsApi';
const roleState = useRoleStore();
const router = useRouter();
const route = useRoute();
// 表单
const formData = reactive({
  organization: '',
  min: '',
  max: '',
  channel: ''
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
  channelCode: route.query.channelCode,
  orderFieldOneSequence: '',
  orderFieldTwoSequence: '',
  organId: '',
  organNum: route.query.organNum,
  pageNum: 1,
  pageSize: 10,
  timeData: []
});
let titleData = reactive<any>({
  account: '',
  checkNumberMax: '',
  checkNumberMin: '',
  name: '',
  channelCode: route.query.channelCode,
  orderFieldOneSequence: '',
  orderFieldTwoSequence: '',
  organId: '',
  organNum: route.query.organNum,
  pageNum: 1,
  pageSize: 10,
  timeData: []
});
// const channelCode = ref<any>('');
// const organNum = ref<any>('');
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  if (route.query) {
    loadTableData();
  }
});
const tableData = ref<any>([]);
const loadTableData = () => {
  getEmployeesRanking(formSearch).then((res: any) => {
    if (res.code == '200') {
      tableData.value = res.data.data;
      total.value = res.data.total;
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
  formSearch.channelCode = route.query.channelCode;
  formSearch.orderFieldOneSequence = '';
  formSearch.orderFieldTwoSequence = '';
  formSearch.organId = '';
  formSearch.organNum = route.query.organNum;
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
  titleData.channelCode = route.query.channelCode;
  titleData.orderFieldOneSequence = '';
  titleData.orderFieldTwoSequence = '';
  titleData.organId = '';
  titleData.organNum = route.query.organNum;
  titleData.timeData = [];
  titleData.pageSize = 10;
  titleData.pageNum = 1;
  loadTableData();
};
// 表格
let columns = ref<any>([
  { colKey: 'name', title: '员工姓名', align: 'center' },
  { colKey: 'organOrder', title: '机构排名', align: 'center', sortType: 'all', sorter: true },
  { colKey: 'channelOrder', title: '渠道排名', align: 'center', sortType: 'all', sorter: true },
  { colKey: 'account', title: '员工账号', align: 'center' },
  { colKey: 'checkNumber', title: '筛查频次', align: 'center' }
]);
let data = ref([
  { id: 1, name: '脑健康体检20天', num: '2', type: '1', state: '1' },
  { id: 2, name: '脑健康体检30天', num: '3', type: '1', state: '1' }
]);
const sort = ref<any>({
  sortBy: 'status',
  descending: true
});
const request = sort => {
  console.log(sort, 'sort');

  //进行数据排序
  if (sort) {
    if (sort.sortBy == 'organOrder') {
      if (sort.descending) {
        formSearch.orderFieldOneSequence = 'desc';
        formSearch.orderFieldTwoSequence = '';
        loadTableData();
      } else {
        formSearch.orderFieldOneSequence = '';
        formSearch.orderFieldTwoSequence = '';
        loadTableData();
      }
    } else if (sort.sortBy == 'channelOrder') {
      if (sort.descending) {
        formSearch.orderFieldTwoSequence = 'desc';
        formSearch.orderFieldOneSequence = '';
        loadTableData();
      } else {
        formSearch.orderFieldTwoSequence = '';
        formSearch.orderFieldOneSequence = '';
        loadTableData();
      }
    }
  } else {
    formSearch.orderFieldTwoSequence = '';
    formSearch.orderFieldOneSequence = '';
    loadTableData();
  }
};
// 排序
// const sort = () => {
//   console.log('排序');
// };
const sortChange = val => {
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
// const onChangNum = value => {
//   //正则
//   //判断不能为负数可以为0
//   let special = /^([0]|[1-9][0-9]*)$/;
//   if (!special.test(value)) {
//     titleData.checkNumberMin = '';
//     formSearch.checkNumberMin = '';
//   }
// };
// const onChangMax = val => {
//   let special = /^([0]|[1-9][0-9]*)$/;
//   if (!special.test(val)) {
//     titleData.checkNumberMax = '';
//     formSearch.checkNumberMax = '';
//   }
// };
const back = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.employee {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .box-left {
      display: flex;
      align-items: center;

      .img-btn {
        font-size: 18px;
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
  .form-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
  }
  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 15px;
  }
  .t-form {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0 0 0;
  }

  .search-item {
    margin: 0 20px;
  }

  .to {
    margin: 0 5px;
  }

  .title {
    display: flex;
    align-items: center;
  }

  .t-pagination {
    margin-top: 30px;
  }

  ::v-deep(.t-pagination__total) {
    flex: none !important;
  }
  .slt {
    width: 140px;
  }
  .ipt-slt {
    width: 250px;
    margin-left: 5px;
  }

  ::v-deep(.t-form__label) {
    padding-right: none !important;
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
}
</style>
