<template>
  <div class="user-box">
    <div class="box-img" @click="backRest">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <div class="img-btn" @click="">返回</div>
      </div>
    </div>
    <div class="search-box">
      <div class="search-data">导入日期： <t-date-range-picker allow-input clearable enable-time-picker @change="onChange" v-model="titleData.timeData" /></div>
      <div class="search-action">
        <div class="search-item" @click="handlerSubmit"><span class="searchItem">查询</span></div>
        <div class="rest-item" @click="handlerRest"><span class="rest">重置</span></div>
      </div>
    </div>
    <div class="tab-box">
      <t-table row-key="index" :data="tableData"  :columns="(tableColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium" hover>
        <template #status="{ row }">
          <div class="proceed" v-if="row.status == '1'">
            <span>
              <img src="../../assets/img/knowledge/proceed.png" alt="图标" />
            </span>

            <span>导入中...</span>
          </div>
          <div class="complete" v-if="row.status == '2'">
            <span>
              <img src="../../assets/img/knowledge/complete.png" alt="图标" />
            </span>

            <span>导入完成</span>
          </div>
        </template>
        <template #action="{ row }">
          <div v-if="row.status == '1'" class="btn-c-blue"><span class="btn-item">下载</span></div>
          <div v-else class="btn-see-blue" @click="seeDetails(row.exportExcelUrl)"><span class="blue-item">下载</span></div>
        </template>
      </t-table>
    </div>
    <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { getLogPage } from '../../request/modules/equityApi';
// --------全局参数---------------
const router = useRouter();
const total = ref<any>('');
let formSearch = reactive<any>({
  importDateBegin: '',
  importDateEnd: '',
  pageSize: 10,
  pageNum: 1,
  timeData: []
});
let titleData = reactive<any>({
  timeData: []
});

const tableColumns = [
  {
    title: '导入批次',
    colKey: 'importBatchCode',
    // width: '140px',
    align: 'center'
  },
  {
    title: '文件名称',
    colKey: 'fileName',
    // width: '220px',
    align: 'center'
  },
  {
    title: '成功条数',
    colKey: 'successCount',
    width: '100px',
    align: 'center'
  },
  {
    title: '失败条数',
    colKey: 'failCount',
    width: '100px',
    align: 'center'
  },
  {
    title: '总条数',
    colKey: 'sumCount',
    width: '100px',
    align: 'center'
  },
  {
    title: '状态',
    colKey: 'status',
    width: '140px',
    slots: { customRender: 'status' },
    align: 'center'
  },

  {
    title: '导入日期',
    colKey: 'importDate',
    // width: '180px',
    align: 'center'
  },
  {
    title: '操作',
    colKey: 'action',
    width: '120px',
    fixed: 'right',
    slots: { customRender: 'action' },
    align: 'center'
  }
];
// 重置
const handlerRest = (values: any) => {
  formSearch.importDateBegin = '';
  formSearch.importDateEnd = '';
  formSearch.timeData = [];
  formSearch.pageSize = 10;
  formSearch.pageNum = 1;
  titleData.importDateBegin = '';
  titleData.importDateEnd = '';
  titleData.timeData = [];
  loadTableData();
};
// 搜索
const handlerSubmit = (values: any) => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};
//后退
const backRest = () => {
  router.go(-1);
};
//----- 加载列表数据 ---------
onMounted(() => {
  loadTableData();
});
const tableData = ref<any>([]);
const loadTableData = () => {
  getLogPage(formSearch).then((res: any) => {
    if (res.code == '200') {
      tableData.value = res.data.data;
      total.value = res.data.total;
    }
  });
};

//选择时间
const onChange = (value: DateRangeValue) => {
  titleData.importDateBegin = value[0] as string;
  titleData.importDateEnd = value[1] as string;
};
//导出
const seeDetails = (url: string) => {
  // let a = document.createElement('a');
  // a.href = url;
  // a.click();
  url = url.replace('http://', 'https://');
  window.location.href = url
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
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;

  overflow-y: auto;
  background-color: #ffffff;
  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;

    .box-left {
      display: flex;
      align-items: center;

      .img-btn {
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 25px;
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
    // flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
    .search-data {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
    }
    .search-action {
      display: flex;
      align-items: center;
      .search-item {
        width: 90px;
        height: 32px;
        background: #3d7eff;
        box-shadow: 0px 2px 4px 0px #fafbff;
        border-radius: 6px;
        text-align: center;
        margin-right: 16px;
        cursor: default;
        .searchItem {
          font-size: 16px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          // font-weight: bold;
          color: #ffffff;
          line-height: 32px;
        }
      }
      .rest-item {
        width: 90px;
        height: 32px;
        background: #f1f6ff;
        box-shadow: 0px 2px 4px 0px #fafbff;
        border-radius: 6px;
        text-align: center;
        cursor: default;
        .rest {
          font-size: 16px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          // font-weight: bold;
          color: #3d7eff;
          line-height: 32px;
        }
      }
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    .proceed {
      display: flex;
      justify-content: center;
      font-size: 12px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #f1c02e;
      line-height: 17px;
    }
    .complete {
      display: flex;
      justify-content: center;
      font-size: 12px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #24c07b;
      line-height: 17px;
    }

    .btn-see-blue {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 26px;
      background: #f1f6ff;
      border-radius: 6px;
      cursor: default;
      .blue-item {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3d7eff;
        line-height: 17px;
        align-items: center;
        cursor: default;
      }
    }
    .btn-c-blue {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 26px;
      background: #f8f8f8;
      border-radius: 6px;
      cursor: not-allowed;
      .btn-item {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cecece;
        line-height: 17px;
        align-items: center;
        cursor: not-allowed;
      }
    }
  }
}
::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
}
</style>
