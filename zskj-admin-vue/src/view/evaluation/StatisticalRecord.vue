<template>
  <div class="user-box">
    <div class="tab-box">
      <div class="operate-box" @click="handlerRest">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <div class="add-item">返回</div>
      </div>
      <t-table row-key="index" :data="tableData" :columns="(chartColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium" hover>
        <template #action="{ row }">
          <div class="btn-blue" @click="seeCharts(row)"><span class="btn-item">查看图表</span></div>
        </template>
        <template #valueUnit="{ row }">
          <span class="itemName">{{ row.valueUnit }}</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="10" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>

    <div class="box-chart">
      <echartsDom :itemData="itemData" class="echarts-box" :key="echartsKey" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import * as echarts from 'echarts';
import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { useRouter,useRoute } from 'vue-router';
import { chartColumns } from './data/configuration';
import  echartsDom  from './components/echarts.vue'
// --------全局参数---------------
const router = useRouter();
const route = useRoute();
let formSearch = reactive<any>({
  pageSize: 10,
  pageNum: 1,
  oneCharts: ''
});

//----- 加载列表数据 ---------
onMounted(() => {
  loadTableData();
});
const echartsKey = ref(0)
type ItemType = {
    name: string
    referValue: string
    value: string
    valueUnit: string
    type: string
};
const itemData = ref<ItemType>()
const tableData = ref<any>([]);
const loadTableData = () => {
  tableData.value = JSON.parse(route.query.dataList as any)  
  console.log(tableData.value +'11111111' )
};

//查看

const seeCharts = (obj: ItemType) => {
    console.log("obj", obj);
    itemData.value = obj
    // visible.value = true;
    echartsKey.value += 1;
}

//返回
const handlerRest = () => {
  router.back();
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
  display: flex;
  width: 100%;
  overflow-y: auto;

  .tab-box {
    width: calc(100% - 300px);
    background-color: #ffffff;
    padding: 21px;
    border-radius: 16px;
    .btn-blue {
      background: #f1f6ff;
      border-radius: 6px;
      text-align: center;
      cursor: default;
      .btn-item {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3d7eff;
        line-height: 17px;
      }
    }
    .itemName {
      font-size: 14px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #24c07b;
      line-height: 20px;
    }
    .operate-box {
      display: flex;
      align-items: center;
      border-radius: 16px;
      margin-bottom: 15px;
      cursor: default;
      .add-item {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 22px;
      }

      .search-item {
        margin-right: 25px;
        display: flex;
        align-items: center;
        font-size: 14px;

        .ipt-slt {
          width: 180px;
          margin-left: 5px;
        }
      }
    }
  }
  .box-chart {
    width: 25%;
    height: 400px;
    border-radius: 16px;
    background-color: #ffffff;
    padding: 20px;
    margin-left: 15px;
  }
}
</style>
