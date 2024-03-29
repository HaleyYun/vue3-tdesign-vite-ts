<template>
  <div class="details">
    <div class="customer">
      <div class="title">
        客户信息
        <div></div>
      </div>
      <table>
        <tr>
          <td>客户姓名:{{ customer.purchaser }}</td>
          <td>联系电话:{{ customer.purchaserPhone }}</td>
        </tr>
        <tr>
          <td>客户来源:{{ customer.clientResource == '1' ? '小程序' : '' || customer.clientResource == '2' ? 'app' : '' }}</td>
        </tr>
      </table>
    </div>
    <div class="order">
      <div class="title">
        工单信息
        <div></div>
      </div>
      <table>
        <tr>
          <td>服务单号:{{ customer.ticketsServiceCode }}</td>
          <td>工单状态:{{ customer.status == '1' ? '待支付' : '' || customer.status == '9' ? '服务中' : '' || customer.status == '2' ? '待使用' : '' || customer.status == '3' ? '已使用' : '' || customer.status == '4' ? '待退款' : '' || customer.status == '5' ? '已退款' : '' }}</td>
          <td>下单时间:{{ customer.createTime }}</td>
          <td>产品金额:￥{{ customer.price }}</td>
          <td>优惠金额:￥{{ customer.discount ? customer.discount : '--' }}</td>
        </tr>
        <tr>
          <td>购买项目:{{ customer.bookingServ }}</td>
          <td>描述:{{ customer.prodDescribe }}</td>
          <td>实付金额:￥{{ customer.money }}元</td>

          <td>支付方式:{{ customer.payWay == '1' ? '线上支付' : '' }}</td>
          <td>退款金额:￥{{ customer.refund_money }}元</td>
        </tr>
        <tr>
          <td>使用时间:{{ customer.useTime }}</td>
          <td></td>

          <td>退款单号:{{ customer.refund_code }}</td>
        </tr>
      </table>
    </div>
    <!-- <div class="meal">
        <div class="title">套餐信息<div></div></div>
        <table>
          <tr>
            <td>筛查项目:{{customer.checkName}}</td>
            <td>筛查地址:{{customer.website}}</td>
            <td>服务模式:{{customer.serviceMode}}</td>
            <td></td>
          </tr>
        </table>
      </div> -->
    <div class="record">
      <div class="title">
        服务记录
        <div></div>
      </div>
      <t-table row-key="id" :data="recordData" :columns="columns" bordered size="medium" hover table-layout="fixed" />
      <t-pagination :pageSize="pageSize" :total="total" v-model:current="pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
    <div class="back">
      <t-button size="large" variant="outline" @click="back">返回</t-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MealOrderDetails, Records } from '../../request/modules/orderApi';
const router = useRouter();
const route = useRoute();
const customer = ref<any>({});
let columns = ref([
  { colKey: 'serial-number', title: '序号' },
  { colKey: 'createTime', title: '操作时间' },
  { colKey: 'content', title: '操作内容' },
  { colKey: 'createUser', title: '操作人' }
]);
let recordData = ref([]);
const back = () => {
  router.go(-1);
};
const interestsId = ref<any>('');
const interestsCode = ref<any>('');
const getMealOrderDetails = () => {
  MealOrderDetails({
    id: Number(interestsId.value)
  }).then((res: any) => {
    customer.value = res.data;
  });
};
const getRecords = () => {
  Records({
    id: interestsCode.value,
    ticketsTypeId: 2
  }).then((res: any) => {
    if (res.code == 200) {
      recordData.value = res.data.data;
      total.value = res.data.total;
    }
  });
};
onMounted(() => {
  if (route.query.ticketsServiceCode) {
    interestsCode.value = route.query.ticketsServiceCode;
    getRecords();
  }
  if (route.query.id) {
    interestsId.value = route.query.id;
    getMealOrderDetails();
  }
});
//分页
const total = ref<any>('');
const pageSize = ref<any>(5);
const pageNum = ref<any>(1);
const pageSizeChange = (val: any) => {
  console.log('00op', val);
  pageSize.value = val;
  getRecords();
};
const currentChange = (current: number) => {
  pageNum.value = current;
  getRecords();
};
</script>

<style lang="scss" scoped>
.details {
  font-size: 14px;
  height: 100%;
  overflow-y: auto;
  .customer,
  .order,
  .meal {
    table {
      width: 100%;
      td {
        width: 25%;
        line-height: 30px;
      }
    }
  }
  .back {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
}
.title {
  width: 100%;
  padding: 30px 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  > div {
    flex-grow: 1;
    height: 1px;
    background-color: rgb(190, 190, 190);
  }
}
tr {
  display: flex;
}
</style>
