<template>
  <div class="details">
    <div class="box-img" @click="artBack">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">返回</t-button>
      </div>
      <div class="details-title">权益详情</div>
      <div></div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">客户信息</div>
      </div>
      <div class="search-box">
        <div class="box-name nameCommon">
          <div class="name-title">
            姓名：
            <div class="name-content">
              {{ customer.clientName }}
            </div>
          </div>
          <div class="name-title">
            <div class="title-sex">性别：</div>
            <div class="name-content" v-if="customer.clientName">
              {{ customer.sex === 1 ? '男' : '女' }}
            </div>
          </div>
        </div>
        <div class="box-name">
          <div class="name-title">
            年龄：
            <div class="name-content" v-if="customer.clientName">{{ customer.age }}岁</div>
          </div>
          <div class="name-title">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：
            <div class="name-content" v-if="customer.clientName">{{ customer.phone }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">工单信息</div>
      </div>
      <div class="search-box">
        <div class="box-name nameCommon">
          <div class="name-title">
            工单编号：
            <div class="name-content">
              {{ customer.ticketsEquityCode }}
            </div>
          </div>
          <div class="name-title">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：
            <div class="name-content">
              <span v-if="customer.status == 0">已核销</span>
              <span v-if="customer.status == 1">使用中</span>
              <span v-if="customer.status == 2">已完成</span>
            </div>
          </div>
        </div>
        <div class="box-name nameCommon">
          <div class="name-title">
            权益名称：
            <div class="name-content">{{ customer.equityName }}</div>
          </div>
          <div class="name-title">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工单来源：
            <div class="name-content">{{ customer.source == 'lite' ? 'LITE端' : 'PRO端' }}</div>
          </div>
        </div>
        <div class="box-name nameCommon">
          <div class="name-title">
            核销时间：
            <div class="name-content">{{ customer.begnTime }}</div>
          </div>
          <div class="name-title">
            <div class="title-interval">激活码：</div>

            <div class="name-content">{{ customer.activeCode }}</div>
          </div>
        </div>
        <div class="box-name nameCommon">
          <div class="name-title">
            操作人员：
            <div class="name-content">{{ customer.updateUser }}</div>
          </div>
          <div class="name-title">
            &nbsp;&nbsp;&nbsp;权益有效期：
            <div class="name-content">{{ customer.endTime }}-{{ customer.endTime }}</div>
          </div>
        </div>
        <div class="box-name">
          <div class="name-title">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;描述：
            <div class="name-content">{{ customer.describe }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">服务记录</div>
      </div>
      <div class="search-box">
        <t-table row-key="id" :data="recordData" :columns="(columns as PrimaryTableCol<TableRowData>[])" :bordered="false" size="medium" table-layout="auto" />
        <t-pagination :pageSize="pageSize" :total="total" v-model:current="pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { InterestsOrderDetails, Records } from '../../request/modules/orderApi';
import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const interestsId = ref<any>('');
const interestsCode = ref<any>('');
const customer = ref<any>({});

let columns = ref([
  { colKey: 'serial-number', title: '序号', align: 'center' },
  { colKey: 'content', title: '操作内容', align: 'center' },
  { colKey: 'updateUser', title: '操作人员', align: 'center' },
  { colKey: 'updateTime', title: '操作时间', align: 'center' },
  { colKey: 'remark', title: '备注', align: 'center' }
]);
let recordData = ref<any>([]);

onMounted(() => {
  if (route.query.id) {
    interestsId.value = route.query.id;
    interestsCode.value = route.query.code;
    getOrderDetails();
    recordsList();
  }
});
//根据id查询
const getOrderDetails = () => {
  InterestsOrderDetails({ id: interestsId.value }).then((res: any) => {
    customer.value = res.data;
  });
};
const recordsList = () => {
  Records({ id: interestsCode.value, ticketsTypeId: 3, pageNum: pageNum.value, pageSize: pageSize.value }).then((res: any) => {
    recordData.value = res.data.data;
    total.value = res.data.total;
  });
};
//分页
const total = ref<any>('');
const pageSize = ref<any>(5);
const pageNum = ref<any>(1);
const pageSizeChange = (val: any) => {
  console.log('00op', val);
  pageSize.value = val;
  recordsList();
};
const currentChange = (current: number) => {
  pageNum.value = current;
  recordsList();
};
//返回
const artBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.details {
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow-y: auto;
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
    .details-title {
      font-size: 18px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #222222;
      line-height: 25px;
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
    margin-bottom: 16px;
    padding-bottom: 20px;
    .equity-box {
      margin: 20px 0 20px 28px;
      width: 319px;
      height: 97px;
      background: #f6f6f6;
      border-radius: 8px;
      .box-equity {
        display: flex;
        justify-content: space-between;

        .box-left {
          margin: 8px 0 8px 8px;
        }
        .box-right {
          position: relative;
          margin: 10px 8px 8px 8px;
          .right-name {
            width: 204px;
            height: 20px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 20px;
            overflow: hidden; //超出文本隐藏
            white-space: nowrap; //不换行，只显示一行
            text-overflow: ellipsis; //超出部分省略号显示
          }
          .right-dec {
            width: 216px;
            height: 30px;
            font-size: 10px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 15px;
            overflow: hidden; //超出文本隐藏
            text-overflow: ellipsis; ///超出部分省略号显示
            display: -webkit-box; //弹性盒模型
            -webkit-box-orient: vertical; //上下垂直
            -webkit-line-clamp: 2; //自定义行数
          }
          .right-price {
            position: absolute;
            width: 55px;
            height: 27px;
            font-size: 20px;
            font-family: Oswald, Oswald;
            font-weight: 500;
            color: #222222;
            line-height: 27px;
            right: 7px;
            .price {
              width: 9px;
              height: 20px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: bold;
              color: #222222;
              line-height: 20px;
            }
          }
        }
      }
    }
    .search-box {
      padding: 20px 0 20px 28px;

      .box-title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
        margin-bottom: 15px;

        .title-content {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 30px;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #2a2a2a;
          line-height: 18px;
          .title-bg {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 18px;
            background: #3d7eff;
            border-radius: 4px;
            border: 1px solid #3d7eff;
            margin-left: 10px;
            .bg-font {
              font-size: 11px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 16px;
            }
          }
        }
      }
      .nameCommon {
        margin-bottom: 15px;
      }

      .box-name {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name-title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #747584;
          line-height: 22px;
          flex: 1;
          .title-interval {
            margin-left: 47px;
          }

          .name-content {
            margin-left: 5px;
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #2a2a2a;
            line-height: 18px;
          }

          .intervalCommon {
            margin-left: 47px;
          }
          .title-sex {
            margin-left: 64px;
          }
        }
      }
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
      height: 15px;
      background: #5766fe;
      border-radius: 3px;
      margin-right: 4px;
    }
    .commonContent {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 25px;
    }
  }
  .meal {
    table {
      width: 100%;
      td {
        width: 25%;
        line-height: 30px;
      }
    }
  }
}
</style>
