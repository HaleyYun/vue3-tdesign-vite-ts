<template>
  <div class="details">
    <div class="box-img" @click="back">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">权益详情</t-button>
      </div>
    </div>
    <div class="customer">
      <div class="title">服务信息</div>

      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            主险产品名称:
            <span class="titleItem"> {{ detailsData?.insuranceProductsName }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            主险产品编号:<span class="titleItem"> {{ detailsData?.insuranceProductsNo }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            服务包名称:
            <span class="titleItem"> {{ detailsData?.servicePackageName }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            服务包编码:<span class="titleItem"> {{ detailsData?.servicePackageNo }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            服务项目名称:
            <span class="titleItem"> {{ detailsData?.serviceProjectName }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            项目编码:<span class="titleItem"> {{ detailsData?.serviceProjectNo }}</span>
          </div>
        </t-col>
      </t-row>
    </div>
    <div class="customer">
      <div class="title">保单信息</div>

      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            保单号码:
            <span class="titleItem"> {{ detailsData?.policyNumber }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            保单生效日期:<span class="titleItem"> {{ detailsData?.effectiveDate }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            投保人:
            <span class="titleItem"> {{ detailsData?.applicantName }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            投保人ID:<span class="titleItem"> {{ detailsData?.applicantId }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            投保人手机:
            <span class="titleItem"> {{ detailsData?.applicantPhone }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            被保人ID:<span class="titleItem"> {{ detailsData?.insuredId }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            主线期限类型:
            <span class="titleItem"> {{ detailsData?.coverageType }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            被保人姓名:<span class="titleItem"> {{ detailsData?.insuredName }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            导入批次:
            <span class="titleItem"> {{ detailsData?.importBatchCode }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            被保人手机:<span class="titleItem"> {{ detailsData?.insuredPhone }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            导入日期:<span class="titleItem"> {{ detailsData?.updateTime }}</span>
          </div>
        </t-col>
      </t-row>
    </div>
    <div class="customer">
      <div class="title">权益信息</div>

      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            权益名称:
            <span class="titleItem"> {{ detailsData.equityInfo?.equityName }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            权益码:<span v-if="detailsData.sendStatus == '2'" class="titleItem">--</span>
            <span v-else class="titleItem"> {{ detailsData.equityInfo?.activeCode }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            权益发放日期:
            <span class="titleItem"> {{ detailsData?.createTime }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            发送手机:<span class="titleItem"> {{ detailsData.equityInfo?.phone }}</span>
          </div>
        </t-col>
      </t-row>
      <t-row style="margin: 15px 0">
        <t-col :flex="3">
          <div class="titleDetails">
            权益激活日期:
            <span class="titleItem"> {{ detailsData.equityInfo?.activeDate }}</span>
          </div>
        </t-col>
        <t-col :flex="2">
          <div class="titleDetails">
            权益使用人:<span class="titleItem"> {{ detailsData.equityInfo?.user }}</span>
          </div>
        </t-col>
      </t-row>
    </div>
    <div class="customer">
      <div class="title itemHeight">权益使用记录</div>
      <t-table row-key="id" :data="getTableData" :columns="(columns as PrimaryTableCol<TableRowData>[])" bordered size="medium" hover table-layout="fixed">
        <template #status="{ row }">
          <span class="customerStatus">已评估</span>
        </template>
        <template #estimateResult="{ row }">
          <span>{{ row.estimateResult.substring(9) }}</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { BookingOrderDetails, Records } from '../../request/modules/orderApi';
import { getIdEquity, getCodePage } from '../../request/modules/equityApi';

import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
// --------全局参数---------------
const router = useRouter();
const route = useRoute();
let columns = ref([
  { colKey: 'estimateNum', title: '评估工单', align: 'center' },
  { colKey: 'estimateTime', title: '日期', align: 'center' },
  { colKey: 'estimateServeName', title: '筛查项目', align: 'center' },
  { colKey: 'estimateResult', title: '评估结果', align: 'center', slots: { customRender: 'estimateResult' } },
  { colKey: 'assessor', title: '评估员', align: 'center' },
  { colKey: 'status', title: '状态', width: '120px', slots: { customRender: 'status' }, align: 'center' }
  //   { colKey: 'createUser', title: '操作' },
]);
//----- 加载数据 ---------
onMounted(() => {
  if (route.query.id) {
    loadTableData(route.query.id);
  }
  tableData();
});
let formSearch = reactive<any>({
  pageSize: 10,
  pageNum: 1,
  phone: route.query.phone,
  prodCode: route.query.prodCode
  // phone:'13319166661',
  // prodCode: '59810282'
});
const total = ref<any>('');
const detailsData = ref<any>('');
const getTableData = ref([]);
//详情
const loadTableData = val => {
  getIdEquity({
    id: val
  }).then((res: any) => {
    if (res.code == '200') {
      detailsData.value = res.data;
    }
  });
};
const tableData = () => {
  getCodePage(formSearch).then((res: any) => {
    if (res.code == '200') {
      getTableData.value = res.data.data;
      total.value = res.data.total;
    }
  });
};
const back = () => {
  router.go(-1);
};
//分页
const pageSizeChange = (pageSize: any) => {
  formSearch.pageSize = pageSize;
  formSearch.pageNum = 1;
  tableData();
};
const currentChange = (current: any) => {
  formSearch.pageNum = current;
  tableData();
};
</script>

<style lang="scss" scoped>
.details {
  width: 100%;
  background: #fff;
  padding: 15px;
  overflow-y: auto;
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
  .customer {
    .title {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #222222;
      line-height: 25px;
    }
    .titleDetails {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      line-height: 22px;
      .titleItem {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
      }
    }
    .customerStatus {
      color: #2bc015;
    }
  }
  .back {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .itemHeight {
    margin-bottom: 15px;
  }
}
</style>
