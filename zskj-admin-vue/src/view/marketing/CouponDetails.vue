<template>
  <div class="user-box">
    <div class="box-img" @click="back">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">返回</t-button>
      </div>
    </div>
    <div class="basicsForm">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div class="common">
          <div class="icon"></div>
          <div class="commonContent">基础信息</div>
        </div>
        <div style="font-size: 18px; margin-right: 20px; font-weight: 600">
          <span style="color: #f1c02e" v-if="formSearch.status == 0">待开始...</span>
          <span style="color: #33c484" v-if="formSearch.status == 1">进行中...</span>
          <span style="color: #f00606" v-if="formSearch.status == 2">已结束...</span>
        </div>
      </div>

      <div class="search-box">
        <t-form ref="form" layout="vertical" :data="formSearch" requiredMark :colon="true">
          <t-form-item label="使用渠道" class="w50" name="name">
            {{ formSearch.channelCode }}
          </t-form-item>
          <t-form-item label="优惠券名称" class="w50" name="name">
            {{ formSearch.couponName }}
          </t-form-item>
          <t-form-item label="优惠券类型" class="w50" name="name">
            {{ formSearch.couponType == 1 ? '折扣' : '满减' }}
          </t-form-item>
          <t-form-item label="优惠券描述" class="w50" name="name">
            {{ formSearch.couponDescription }}
          </t-form-item>
          <t-form-item v-if="formSearch.couponType == 2" label="优惠额度" class="w50" name="limit"> {{ formSearch.discount }}元 </t-form-item>
          <div v-if="formSearch.couponType == 1" class="discount-box">
            <t-form-item label="优惠折扣" class="discount" name="discount"> {{ formSearch.discount }}折 </t-form-item>
          </div>
          <t-form-item label="库存量" class="w50" name="name"> {{ formSearch.stock }}张 </t-form-item>
          <t-form-item label="单次发放数量" class="w50" name="name"> {{ formSearch.onceRelease }}张 </t-form-item>
        </t-form>
      </div>
    </div>
    <div class="bindProduct">
      <div class="productCommon">
        <div class="basicsProduct">
          <div class="icon"></div>
          <div class="commonContent" style="display: flex; align-items: center">绑定产品 <span class="commonTips">该优惠券当前仅支持绑定一个服务产品</span></div>
        </div>

        <!-- <div class="productPrice">
          产品优惠后价格:<span class="price">￥{{ formSearch.afterDiscountPrice }}</span>
        </div> -->
      </div>
      <div class="tab-box">
        <t-table row-key="id" stripe lazy-load v-model:selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange" :data="tableData" :columns="(detailsColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium" hover>
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
      </div>
    </div>
    <div class="rulesUse">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">使用限制</div>
      </div>
      <div class="search-name">
        <t-form ref="form" layout="vertical" :data="formSearch" requiredMark :colon="true">
          <t-form-item label="消费门槛" class="w50" name="name"> {{ formSearch.threshold }}元 </t-form-item>
          <t-form-item label="活动有效期" class="w50" name="name"> {{ formSearch.beginTime }} 至 {{ formSearch.endTime }}</t-form-item>
          <t-form-item label="使用有效期" class="w50" name="name"> {{ formSearch.validDays }}天 </t-form-item>
        </t-form>
      </div>
    </div>
    <div class="conditionUse">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">使用情况</div>
      </div>
      <!-- :action="uploadExcelUrl" @select-change="handleExcel"  -->
      <div class="search-name">
        <div class="showSearch">
          <div class="showName">已发放{{ formSearch.released ? formSearch.released : '0' }}张</div>
          <div class="showName">剩余{{ formSearch.stock }}张</div>
          <div class="img-btn">
            <t-upload v-if="!statusSearch" class="upload-box" :auto-upload="true" :action="uploadExcelUrl" allowUploadDuplicateFile accept=".xls,.xlsx" :headers="setArrt.headers" v-model="files" theme="custom" @fail="handleFail" @success="succUpload" :data="{ id: formProduct.id }">
              <!-- <t-button :disabled="statusSearch" theme="primary" :loading="isLoading">批量发放</t-button> -->
              <div class="verifyNotLog" :loading="isLoading">
                <span class="verifyNotTitle">批量发放</span>
              </div>
            </t-upload>
            <div v-if="statusSearch" class="verifyAddLog" :loading="isLoading">
              <span class="verifyLogTitle">批量发放</span>
            </div>
          </div>
          <div class="verifyLog" @click="addLog">
            <span class="verifyLogTitle">发放日志</span>
          </div>
        </div>
        <div class="tab-box">
          <t-table row-key="organNum" stripe lazy-load :data="showData" :columns="(conditionColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium" hover>
            <template #beginTime="{ row }">
              <span>{{ row.beginTime }}-{{ row.endTime }}</span>
            </template>
            <template #status="{ row }">
              <span v-if="row.status == 0" style="display: flex; align-items: center; justify-content: center">
                <img style="margin-right: 2px; color: #f1c02e; width: 10px; height: 10px" src="../../assets/img/knowledge/con-jian.png" alt="图标" /><span style="color: #f1c02e; font-size: 14px">待使用</span></span
              >
              <span style="display: flex; align-items: center; justify-content: center" v-if="row.status == 1"
                ><img style="margin-right: 2px; color: #33c484; width: 10px; height: 10px" src="../../assets/img/knowledge/zheng.png" alt="图标" /><span style="color: #33c484; font-size: 14px">已使用</span></span
              >
              <span style="display: flex; align-items: center; justify-content: center" v-if="row.status == 2"><img style="margin-right: 2px; width: 10px; height: 10px" src="../../assets/img/knowledge/jie.png" alt="图标" /><span style="color: #f00606; font-size: 14px">已过期</span></span>
            </template>
          </t-table>
          <t-pagination :pageSize="formProduct.pageSize" :total="total" v-model:current="formProduct.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
        </div>
      </div>
    </div>
    <t-dialog placement="center" :closeBtn="false" destroy-on-Close width="1200px" header="导入日志" v-model:visible="visibleLog" :footer="false">
      <div class="search-box">
        <div class="search-item">发放账户:<t-input class="ipt-slt" size="large" clearable v-model="titleLog.account" auto-width /></div>
        <div class="search-item">发放状态:<t-select class="ipt-slt" size="large" clearable v-model="titleLog.status" :options="proNameOption" placeholder="请选择"></t-select></div>
        <div class="verify" @click="searchItem">
          <span class="verifyTitle"><img style="margin-right: 2px; color: #33c484; width: 20px; height: 20px" src="../../assets/img/knowledge/souao.png" alt="图标" />搜索</span>
        </div>
        <div class="cancel" @click="rest">
          <span class="cancelTitle">重置</span>
        </div>

        <div class="cancelSum" @click="searchSum">
          <span class="SumTitle">确定</span>
        </div>
      </div>
      <div class="paginationTable" style="height: 350px">
        <div>
          <t-table row-key="index" :data="logData" :columns="(logColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="auto">
            <template #status="{ row }">
              <span v-if="row.status == 1" style="display: flex; align-items: center; justify-content: center"> <img style="margin-right: 2px; color: #33c484; width: 10px; height: 10px" src="../../assets/img/knowledge/zheng.png" alt="图标" /><span style="color: #24c07b">成功</span></span>
              <span style="display: flex; align-items: center; justify-content: center" v-if="row.status == 2"><img style="margin-right: 2px; color: #f00606; width: 10px; height: 10x" src="../../assets/img/knowledge/jie.png" alt="图标" /><span style="color: #f00606">失败</span></span>
            </template>
            <template #empty>
              <div style="color: rgba(0, 0, 0, 0.26)">
                <img style="width: 200px; height: 101px; margin-top: 80px" src="../../assets/img/knowledge/emptyX.png" />
                <div style="display: flex; justify-content: center">暂无导入日志～</div>
              </div>
            </template>
          </t-table>
        </div>
      </div>
      <div class="paginationName">
        <t-pagination :pageSize="searchLog.pageSize" :total="logTotal" v-model:current="searchLog.pageNum" @page-size-change="pageLogChange" @current-change="currentLogChange" show-jumper />
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { detailsColumns, conditionColumns } from './data/configuration';
import { DateRangeValue, MessagePlugin, PrimaryTableCol, TableRowData, SelectOptions } from 'tdesign-vue-next';
import { SearchIcon } from 'tdesign-icons-vue-next';

import { channelProduct, couponDetail, couponReleasePage, couponReleaseLog } from '../../request/modules/MarketApi';
import { useRouter } from 'vue-router';

// --------全局参数---------------
const visibleLog = ref<boolean>(false);
const statusSearch = ref<boolean>(false);
const route = useRoute();
const files = ref<any>([]);
const isLoading = ref<boolean>(false);
const selectedRowKeys = ref<any>([]);
const router = useRouter();
const total = ref<any>(0);
const showData = ref<any>([]);
let formProduct = reactive<any>({
  id: '',
  pageNum: 1,
  pageSize: 10
});
const logColumns = ref<any>([
  { colKey: 'releaseAccount', title: '发放账户', align: 'center' },
  { colKey: 'status', title: '发放状态', slots: { customRender: 'status' }, align: 'center' },
  { colKey: 'createTime', title: '发放时间', align: 'center' },
  {
    colKey: 'remark',
    title: '备注',
    align: 'center'
  }
]);
const searchLogData = ref<any>({
  channelCode: '',
  channelProductRelationId: ''
});
let formSearch = reactive<any>({
  id: '',
  channelCode: '',
  couponName: '',
  couponDescription: '',
  couponType: '',
  discount: '', //折扣 额度
  //   limit: '', //额度
  stock: '', //库存
  onceRelease: '', //发放数量
  beginTime: '',
  endTime: '',
  threshold: '',
  validDays: '',
  channelProductRelationId: '',
  released: '',
  status: '',
  price: ''
});
const dateValue = ref<any>([]);
const proNameOption = ref<any>([
  { label: '发放成功', value: 1 },
  { label: '发放失败', value: 2 }
]);

const typeOption = ref<any>([
  { label: '折扣', value: 1 },
  { label: '满减', value: 2 }
]);
const uploadExcelUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/coupon/couponRelease'); //导入展示/zskj/admin/coupon/couponRelease
const setArrt = reactive({
  headers: {
    token: ''
  }
});
//----- 加载列表数据 ---------
onMounted(() => {
  let token = localStorage.getItem('x-auth-token');
  setArrt.headers.token = token as string;
  if (route.query.posId && route.query.code && route.query.detailsId) {
    searchLogData.value.channelCode = route.query.code.toString();
    searchLogData.value.channelProductRelationId = route.query.detailsId;
    formProduct.id = route.query.posId;
    loadTableData();
    getDetailList();
    getReleasePage();
  }
});
//产品列表
const tableData = ref<any>([]);
const loadTableData = () => {
  channelProduct(searchLogData.value as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      tableData.value = res.data.data
        ? res.data.data.map((item: any) => {
            return {
              ...item
            };
          })
        : [];
    }
  });
};
// id获取详情
const getDetailList = () => {
  couponDetail({ id: Number(route.query.posId) }).then((res: any) => {
    if (res.code === 200) {
      console.log(res.data);
      formSearch.id = Number(route.query.posId);
      formSearch.channelCode = res.data.channelName;
      formSearch.couponName = res.data.couponName;
      formSearch.couponType = res.data.couponType;
      formSearch.couponDescription = res.data.couponDescription;
      formSearch.discount = res.data.discount;
      formSearch.stock = res.data.stock;
      formSearch.onceRelease = res.data.onceRelease;
      formSearch.threshold = res.data.threshold;
      formSearch.validDays = res.data.validDays;
      dateValue.value = [res.data.beginTime, res.data.endTime];
      selectedRowKeys.value = [res.data.channelProductRelationId];
      formSearch.afterDiscountPrice = res.data.afterDiscountPrice;
      formSearch.beginTime = res.data.beginTime;
      formSearch.endTime = res.data.endTime;
      formSearch.released = res.data.released;
      formSearch.status = res.data.status;
      formSearch.price = res.data.price;
      if (res.data.status == 1) {
        statusSearch.value = false;
      } else {
        statusSearch.value = true;
      }
    }
  });
};

// 发放优惠券列表
const getReleasePage = () => {
  couponReleasePage(formProduct).then((res: any) => {
    if (res.code === 200) {
      console.log(res.data);
      showData.value = res.data.data;
      total.value = res.data.total || 0;
    }
  });
};

//分页
const pageSizeChange = (pageSize: any) => {
  formProduct.pageSize = pageSize;
  formProduct.pageNum = 1;
  getReleasePage();
};
const currentChange = (current: any) => {
  formProduct.pageNum = current;
  getReleasePage();
};

const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
  selectedRowKeys.value = RowKeys;
};
//上传成功
const succUpload = (file: any) => {
  if (file.response.code == 200) {
    MessagePlugin.success(file.response.msg);
    getReleasePage();
    getDetailList();
  } else {
    MessagePlugin.error(file.response.msg);
  }
};
const handleFail = (file: any) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
const logTotal = ref<any>('');
const searchLog = ref<any>({
  id: formSearch.id,
  account: '',
  status: '',
  pageNum: 1,
  pageSize: 5
});

const titleLog = ref<any>({
  id: formSearch.id,
  account: '',
  status: '',
  pageNum: 1,
  pageSize: 5
});
//导入日志
//查询
const searchItem = () => {
  searchLog.value = Object.assign(searchLog.value, titleLog.value);
  searchLog.value.pageNum = 1;
  getLogList();
};
//重置
const rest = () => {
  searchLog.value = {
    id: formSearch.id,
    account: '',
    status: '',
    pageNum: 1,
    pageSize: 5
  };
  titleLog.value = {
    id: formSearch.id,
    account: '',
    status: '',
    pageNum: 1,
    pageSize: 5
  };
  getLogList();
};
const addLog = () => {
  searchLog.value = {
    id: formSearch.id,
    account: '',
    status: '',
    pageNum: 1,
    pageSize: 5
  };
  titleLog.value = {
    id: formSearch.id,
    account: '',
    status: '',
    pageNum: 1,
    pageSize: 5
  };
  getLogList();
  visibleLog.value = true;
};
const searchSum = () => {
  visibleLog.value = false;
};
//分页
const pageLogChange = (pageSize: any) => {
  searchLog.value.pageSize = pageSize;

  searchLog.value.pageNum = 1;
  getLogList();
};
const currentLogChange = (current: number) => {
  searchLog.value.pageNum = current;
  getLogList();
};
//导入列表
const logData = ref<any>([]);
const getLogList = () => {
  couponReleaseLog(searchLog.value as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      logData.value = res.data.data ? res.data.data : [];
      logTotal.value = res.data.total;
    }
  });
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
  padding: 15px;

  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
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
  .conditionUse {
    margin-top: 15px;
    background: #ffffff;
    border-radius: 10px;
    padding-bottom: 50px;
    .showSearch {
      display: flex;
      align-items: center;
      .showName {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #686868;
        line-height: 20px;
        margin: 15px 15px 20px 15px;
      }
      .img-btn {
        margin: 0 15px;
      }
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 200px;
        margin-left: 5px;
      }
    }
  }
  .paginationName {
    margin-top: 20px;
  }
  .paginationTable {
    overflow-y: auto;
  }
  ::v-deep(.t-pagination__total) {
    flex: none !important;
  }
  ::v-deep(.t-input--auto-width) {
    width: 120px;
  }
  .verify {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 122px;
    height: 44px;
    background: #f5f8fd;
    border-radius: 22px;
    border: 1px solid #3d7eff;
    cursor: pointer;
    .verifyTitle {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      color: #3d7eff;
      line-height: 22px;
    }
  }
  .cancel {
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 78px;
    height: 44px;
    background: #f5f8fd;
    border-radius: 22px;
    border: 1px solid #3d7eff;
    cursor: pointer;
    .cancelTitle {
      font-size: 16px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      color: #3d7eff;
      line-height: 22px;
    }
  }
  .cancelSum {
    margin-left: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 122px;
    height: 44px;
    background: #3d7eff;
    box-shadow: 0px 2px 4px 0px #fafbff;
    border-radius: 6px;
    cursor: pointer;
    .SumTitle {
      font-size: 16px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      color: #ffffff;
      line-height: 22px;
    }
  }
}
.verifyLog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 30px;
  background: #3d7eff;
  border-radius: 6px;
  border: 1px solid #3d7eff;
  margin-left: 16px;
  cursor: pointer;
  margin-bottom: 5px;
  .verifyLogTitle {
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 17px;
  }
}
.verifyAddLog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 30px;
  background: #f4f4f4;
  border-radius: 6px;
  border: 1px solid #f4f4f4;
  margin-left: 16px;
  cursor: not-allowed;
  margin-bottom: 5px;
  .verifyLogTitle {
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #909090;
    line-height: 17px;
  }
}
.verifyNotLog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 30px;
  background: #f1f6ff;
  border-radius: 6px;
  border: 1px solid #3d7eff;
  margin-left: 16px;
  cursor: pointer;
  margin-bottom: 5px;
  .verifyNotTitle {
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #3d7eff;
    line-height: 17px;
  }
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
::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
}
</style>
