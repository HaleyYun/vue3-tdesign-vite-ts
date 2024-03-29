<template>
  <div class="user-box">
    <div class="controls">
      <div class="cancel" @click="back">
        <span class="cancelTitle">取消</span>
      </div>
      <div class="verify" @click="verify">
        <span class="verifyTitle">确认</span>
      </div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">基础信息</div>
      </div>
      <div class="search-box">
        <t-form ref="form" layout="vertical" :data="formSearch" requiredMark :colon="true">
          <t-form-item label="使用渠道" class="w50" name="name">
            <t-select size="large" :options="channelOption" v-model="formSearch.channelCode" placeholder="请选择渠道~" @change="onChangeSelect"></t-select>
          </t-form-item>
          <t-form-item label="优惠券名称" class="w50" name="name">
            <t-input size="large" :allowInputOverMax="false" :maxlength="60" placeholder="请输入优惠券名称" v-model.trim="formSearch.couponName" />
          </t-form-item>
          <t-form-item label="优惠券类型" class="w50" name="name">
            <t-select size="large" @change="onSelect" :options="typeOption" v-model="formSearch.couponType" placeholder="请选择优惠券类型"></t-select>
          </t-form-item>
          <t-form-item label="优惠券描述" class="w50" name="name">
            <t-textarea v-model="formSearch.couponDescription" @keyup="keyupDescription" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入优惠券描述" />
          </t-form-item>
          <t-form-item label="优惠额度" v-if="formSearch.couponType == 2" class="w50" name="limit">
            <t-input-number size="large" style="width: 350px" :min="0" @change="onOverMax" @keyup="overMax" placeholder="请输入优惠额度" theme="normal" v-model="formSearch.discount">
              <template #suffix><span>元</span></template>
            </t-input-number>
          </t-form-item>
          <div class="discount-box" v-if="formSearch.couponType == 1">
            <t-form-item label="优惠折扣" class="discount" name="discount">
              <t-input size="large" @change="onStatusMax" :allowInputOverMax="false" @keyup="onKeyup" tips="注:请保留一位小数" suffix="折" placeholder="请输入优惠折扣" v-model="formSearch.discount" />
            </t-form-item>
            <span class="discountTips">提示:当您输入整数2,代表原价*0.2</span>
          </div>

          <t-form-item label="库存量" class="w50" name="name">
            <t-input size="large" @keyup="formSearch.stock = formSearch.stock.replace(/^(0+)|[^\d]+/g, '')" :maxlength="3" @change="onInventory" :allowInputOverMax="false" suffix="张" placeholder="请输入库存量" v-model="formSearch.stock" />
          </t-form-item>
          <t-form-item label="单次发放数量" class="w50" name="name">
            <t-input size="large" @change="onStockMax" @keyup="formSearch.onceRelease = formSearch.onceRelease.replace(/^(0+)|[^\d]+/g, '')" :maxlength="1" :allowInputOverMax="false" suffix="张" placeholder="请输入发放数量" v-model="formSearch.onceRelease" />
          </t-form-item>
        </t-form>
      </div>
    </div>
    <div class="bindProduct">
      <div class="productCommon">
        <div class="basicsProduct">
          <div class="icon"></div>
          <div class="commonContent" style="display: flex; align-items: center">绑定产品 <span class="commonTips">该优惠券当前仅支持绑定一个服务产品</span></div>
        </div>

        <div class="productPrice" v-if="formSearch.discount && formSearch.price">
          产品优惠后价格:
          <span class="price">￥{{ formSearch.afterDiscountPrice.toFixed(2) }}</span>
        </div>
      </div>
      <div class="tab-box">
        <t-table row-key="id" style="padding: 20px" stripe lazy-load v-model:selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange" :data="tableData" :columns="(productColumns as PrimaryTableCol<TableRowData>[])" table-layout="auto" size="medium">
          <template #channelName="{ row }">
            <span class="title">小程序</span>
          </template>
          <template #prodStatus="{ row }">
            <span class="title">线上支付</span>
          </template>
          <template #serviceType="{ row }">
            <span v-if="row.serviceType == 'tc'" class="title">服务</span>
            <span v-if="row.serviceType == 'book'" class="title">预约</span>
          </template>
        </t-table>

        <t-pagination class="pagination" :pageSize="searchLogData.pageSize" :total="total" v-model:current="searchLogData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
    <div class="rulesUse">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">使用限制</div>
      </div>
      <div class="search-name">
        <t-form ref="form" layout="vertical" :data="formSearch" requiredMark :colon="true">
          <t-form-item label="消费门槛" class="w50" name="name">
            <t-input-number style="width: 350px" size="large" :min="0" @keyup="AllowMax" placeholder="请输入消费门槛" theme="normal" v-model="formSearch.threshold"> </t-input-number>
          </t-form-item>
          <t-form-item label="活动有效期" class="w50" name="name">
            <t-date-range-picker size="large" allow-input clearable @change="onChange" v-model="dateValue" placeholder="请输入活动有效期" />
          </t-form-item>
          <t-form-item label="使用有效期" class="w50" name="name">
            <t-input size="large" @keyup="onValidDays" @change="onNameChange" :allowInputOverMax="false" placeholder="请输入使用有效期" tips="注:请输入整数" v-model="formSearch.validDays" suffix="天" />
          </t-form-item>
        </t-form>
      </div>
    </div>
    <div class="mask-box" v-if="visible">
      <div class="content-boxMask">
        <h2>提示</h2>
        <p>{{ visibleTitle }}</p>
        <div class="btn-box">
          <button @click="visible = false">取消</button>
          <button @click="onConfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { productColumns } from './data/configuration';
import { DateRangeValue, MessagePlugin, PrimaryTableCol, TableRowData, SelectOptions } from 'tdesign-vue-next';
import { organization } from '../../request/modules/ServiceApi';
import { channelProduct, editCoupon, couponDetail } from '../../request/modules/MarketApi';
import { useRouter } from 'vue-router';

// --------全局参数---------------
const visibleTitle = ref<string>('内容还没有保存，确定要离开吗？');
const searchLogData = ref<any>({
  channelCode: '',
  pageNum: 1,
  pageSize: 10
});
const selectStatus = ref<number>(2);
const selectedRowKeys = ref<any>([]);
const route = useRoute();
const router = useRouter();
const total = ref<any>('');

const formSearch = reactive<any>({
  id: '',
  channelCode: '',
  couponName: '',
  couponDescription: '',
  couponType: 2,
  discount: '', //折扣 额度
  //   limit: '', //额度
  stock: '', //库存
  onceRelease: '1', //发放数量
  beginTime: '',
  endTime: '',
  threshold: '',
  validDays: '',
  channelProductRelationId: '',
  afterDiscountPrice: '', //优惠后的价格
  productCode: '', //产品code
  serviceType: '',
  price: ''
});
const dateValue = ref<any>([]);
const channelOption = ref<any>([]);

const typeOption = ref<any>([
  { label: '折扣', value: 1 },
  { label: '满减', value: 2 }
]);

//----- 加载列表数据 ---------
onMounted(() => {
  if (route.query.posId && route.query.code) {
    searchLogData.value.channelCode = route.query.code.toString();
    loadTableData();
    getOrganizationList();
    getDetailList();
  }
});

// 获取xia
const getOrganizationList = () => {
  let data = {
    showChannel: true,
    pageNum: 1,
    pageSize: 999
  };
  organization(data).then((res: any) => {
    if (res.code === 200) {
      channelOption.value = res.data.data.map((item: any) => {
        return {
          label: item.organizationName,
          value: item.organizationNum
        };
      });
    }
  });
};
// id获取详情
const discountPrice = ref<any>('');
let theOldData = '';
const getDetailList = () => {
  couponDetail({ id: Number(route.query.posId) }).then((res: any) => {
    if (res.code === 200) {
      console.log(res.data);
      formSearch.id = Number(route.query.posId);
      formSearch.channelCode = res.data.channelCode;
      formSearch.couponName = res.data.couponName;
      formSearch.couponType = res.data.couponType;
      formSearch.couponDescription = res.data.couponDescription;
      formSearch.discount = res.data.discount;
      formSearch.stock = res.data.stock.toString();
      formSearch.onceRelease = res.data.onceRelease.toString();
      formSearch.threshold = res.data.threshold;
      formSearch.validDays = res.data.validDays;
      dateValue.value = [res.data.beginTime, res.data.endTime];
      formSearch.channelProductRelationId = res.data.channelProductRelationId.toString();
      selectedRowKeys.value = [res.data.channelProductRelationId];

      formSearch.afterDiscountPrice = Number(res.data.afterDiscountPrice);
      // console.log(formSearch.afterDiscountPrice.toFixed(2));

      formSearch.beginTime = res.data.beginTime;
      formSearch.endTime = res.data.endTime;
      formSearch.productCode = res.data.productCode;
      formSearch.serviceType = res.data.serviceType;

      formSearch.price = Number(res.data.price);
      theOldData = JSON.stringify(formSearch);
    }
  });
};

const tableData = ref<any>([]);
const loadTableData = () => {
  console.log(searchLogData.value);

  channelProduct(searchLogData.value as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      tableData.value = res.data.data;
      total.value = res.data.total || '';
    }
  });
};

//分页
const pageSizeChange = (pageSize: any) => {
  searchLogData.value.pageSize = pageSize;
  searchLogData.value.pageNum = 1;
  loadTableData();
};
const currentChange = (current: any) => {
  searchLogData.value.pageNum = current;
  loadTableData();
};
//时间
const onChange = (value: DateRangeValue) => {
  formSearch.beginTime = value[0] as string;
  formSearch.endTime = value[1] as string;
};
const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
  selectedRowKeys.value = RowKeys;
  formSearch.channelProductRelationId = RowKeys.toString();
  formSearch.productCode = options.currentRowData.prodCode;
  formSearch.serviceType = options.currentRowData.serviceType;
  formSearch.price = options.currentRowData.prodPrice;
  if (formSearch.couponType == 2) {
    formSearch.afterDiscountPrice = formSearch.price - formSearch.discount;
  }
  if (formSearch.couponType == 1) {
    formSearch.afterDiscountPrice = formSearch.price * formSearch.discount;
  }
};

//确认
const verify = () => {
  console.log(formSearch.discount);

  if (formSearch.couponType == 2) {
    if (formSearch.discount == '') {
      MessagePlugin.error('优惠额度不能为空');
      return;
    }
  } else {
    if (formSearch.discount == '') {
      MessagePlugin.error('折扣不能为空');
      return;
    }
  }
  if (formSearch.threshold == '') {
    MessagePlugin.error('消费门槛不能为空');
    return;
  }
  // if (formSearch.threshold) {
  //   if (formSearch.discount > formSearch.threshold) {
  //     MessagePlugin.error('优惠额度不能超出消费门槛');
  //     return;
  //   }
  // }
  // if (formSearch.discount) {
  //   if (formSearch.discount > formSearch.threshold) {
  //     MessagePlugin.error('优惠额度不能超出消费门槛');
  //     return;
  //   }
  // }
  // if (prodPrice.value == '') {
  //   MessagePlugin.error('请先选择产品');
  //   return;
  // }
  if (dateValue.value.length < 1) {
    MessagePlugin.error('活动有效期不能为空');
    return;
  }

  editCoupon(formSearch as any).then((res: any) => {
    if (res.code == 200) {
      router.go(-1);
    } else {
      // MessagePlugin.success(res.msg);
    }
  });
};
//渠道出全部
const onChangeSelect = (value: any, context: { option?: any; e?: MouseEvent | KeyboardEvent }) => {
  searchLogData.value.channelCode = value.toString();
  selectedRowKeys.value = [];
  formSearch.channelProductRelationId = '';
  loadTableData();
};

//优惠券金额计算
//  优惠后的价格formSearch.afterDiscountPrice
//产品价格  prodPrice.value
//优惠额度

const onOverMax = limit => {
  if (limit < 0) {
    formSearch.discount = '';
  }

  // formSearch.discount = limit.replace(/[^(\d||.)]/g, '');
  formSearch.afterDiscountPrice = formSearch.price - Math.abs(limit);
  if (isNaN(formSearch.afterDiscountPrice)) {
    formSearch.discount = '';
    MessagePlugin.error('您计算的不是一个数字，请正确输入');
  }
};
const overMax = limit => {
  if (limit < 0) {
    formSearch.discount = '';
  }
  formSearch.discount = limit.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数;
};
//类型
const onSelect = (value: any, context: { option?: any; e?: MouseEvent | KeyboardEvent }) => {
  selectStatus.value = value;
  formSearch.discount = '';
  console.log(value, 'value');
};
//折扣
const onStatusMax = discount => {
  formSearch.discount = discount.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');

  formSearch.afterDiscountPrice = formSearch.price * (discount / 10);
};
const onKeyup = limit => {
  console.log('11');
  formSearch.discount = limit.replace(/[^(\d||.)]/g, '');
  if (limit > 10 || limit < 0) {
    console.log('0000');

    formSearch.discount = '';
  }
};
//库存
const onInventory = val => {
  formSearch.stock = val.replace(/[^(\d||.)]/g, '');
};
//放
const onStockMax = val => {
  if (val > 5) {
    formSearch.onceRelease = '';
  }
  // formSearch.onceRelease = val.replace(/[^(\d||.)]/g, '');
};
//门槛
// const onAllowMax = sill => {
//   formSearch.threshold = sill.replace(/[^(\d||.)]/g, '');
// };
const AllowMax = sill => {
  formSearch.threshold = sill.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数;
};
const onValidDays = limit => {
  formSearch.validDays = limit.replace(/^(0+)|[^\d]+/g, '');
};
const onNameChange = val => {
  // if (val < 2) {
  //   formSearch.validDays = '';
  // }
};
//不能输空格
const keyupDescription = val => {
  formSearch.couponDescription = val.replace(/[ ]/g, '');
};
const visible = ref<boolean>(false);
const back = () => {
  let newData = JSON.stringify(formSearch);
  console.log(newData, 'newData');
  console.log(theOldData, 'theOldData');
  console.log(newData == theOldData);
  if (newData == theOldData) {
    router.go(-1);
  } else {
    visible.value = true;
  }
};
const onConfirm = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  padding: 0 15px 15px 0;
  overflow-y: auto;
  .controls {
    display: flex;
    justify-content: right;
    align-items: center;
    padding-bottom: 15px;
    .cancel {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 122px;
      height: 44px;
      background: #f1f6ff;
      border-radius: 6px;
      border: 1px solid #3d7eff;
      cursor: pointer;
      .cancelTitle {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #3d7eff;
        line-height: 22px;
      }
    }
    .verify {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 122px;
      height: 44px;
      background: #3d7eff;
      border-radius: 6px;
      margin-left: 16px;
      cursor: pointer;
      .verifyTitle {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 22px;
      }
    }
  }
  .basicsForm {
    background: #ffffff;
    border-radius: 10px;
    .search-box {
      padding-bottom: 20px;
    }
  }
  //通用
  .common {
    display: flex;
    align-items: center;
    padding-top: 26px;
    padding-left: 20px;

    .icon {
      width: 6px;
      height: 14px;
      background: #5766fe;
      border-radius: 3px;
      margin-right: 4px;
      margin-bottom: 2px;
    }
    .commonContent {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 25px;
    }
  }
  .w50 {
    width: 450px;
    margin-left: 20px;
    margin-top: 20px;
  }
  // 不要删
  ::v-deep(.t-form:not(.t-form-inline) .t-form__item:last-of-type) {
    margin-left: 20px;
    margin-top: 20px;
  }
  ::v-deep(.t-input__tips--default) {
    color: #ff0004;
  }
  .discount-box {
    display: flex;
    align-items: center;
    .discount {
      width: 450px;
      margin-left: 20px;
      margin-bottom: 15px;
    }
    margin-top: 20px;
    .discountTips {
      color: #ff0004;
      margin-left: 10px;
    }
  }
  .bindProduct {
    margin-top: 15px;
    background: #ffffff;
    border-radius: 10px;
    .productCommon {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .basicsProduct {
        display: flex;
        align-items: center;
        padding-top: 26px;
        padding-left: 20px;
        .icon {
          width: 6px;
          height: 14px;
          background: #5766fe;
          border-radius: 3px;
          margin-right: 4px;
          margin-bottom: 2px;
        }
        .commonContent {
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: 25px;
          .commonTips {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff0004;
            line-height: 17px;
            margin-left: 10px;
          }
        }
      }

      .productPrice {
        padding-top: 26px;
        padding-right: 20px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #7a7a7a;
        line-height: 25px;
        .price {
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ff0004;
          line-height: 25px;
        }
      }
    }
  }
  .rulesUse {
    margin-top: 15px;
    background: #ffffff;
    border-radius: 10px;
    padding-bottom: 50px;
  }
  .mask-box {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    .content-boxMask {
      width: 444px;
      height: 258px;
      background: #ffffff;
      border-radius: 14px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;

      h2 {
        padding: 25px 0 36px 0;
        text-align: center;
        font-size: 23px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #222222;
        line-height: 33px;
      }

      p {
        padding-bottom: 39px;
        text-align: center;
        font-size: 25px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 36px;
      }

      .btn-box {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        line-height: 18px;

        button {
          width: 144px;
          height: 48px;
          border-radius: 24px;
          font-weight: bold;

          border: none;

          &:nth-child(1) {
            color: #3d7eff;
            background: #f5f8fd;
            margin-right: 28px;
          }

          &:nth-child(2) {
            color: #ffffff;
            background: #3d7eff;
            margin-left: 28px;
          }
        }
      }
    }
  }
  .pagination {
    padding-right: 22px;
    padding-bottom: 21px;
  }
  ::v-deep(.t-form__label--right) {
    font-size: 16px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #4c4d53;
    margin-right: 15px;
    margin-top: 3px;
  }
  ::v-deep(.t-input__inner) {
    font-size: 16px;
  }
  ::v-deep(.t-textarea .t-resize-none) {
    font-size: 16px;
    margin-top: 5px;
  }
  ::v-deep(.t-form__controls-content) {
    margin-left: 10px;
  }
  ::v-deep(.t-input.t-size-l) {
    border-radius: 8px;
  }
  ::v-deep(.t-input-number.t-size-l .t-input) {
    border-radius: 8px;
  }
  ::v-deep(.t-textarea .t-resize-none) {
    border-radius: 8px;
  }
  ::v-deep(.t-range-input.t-size-l) {
    border-radius: 8px;
  }
}
</style>
