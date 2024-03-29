<template>
  <div class="cunstom-details">
    <t-tabs v-model:value="tabsActiveValue" theme="card" @change="tabsChange">
      <!-- <t-tab-panel value="1" label="家庭成员">
        <div class="tab-box">
          <t-table row-key="index" :data="data" :columns="columns" size="medium" hover :bordered="false" table-layout="fixed">
            <template #action="{ row }">
              <span class="btn-c-blue" @click="lookDetaile(row.id, row.archivesNo)">查看基础信息</span>
            </template>
          </t-table>
        </div>
      </t-tab-panel> -->
      <t-tab-panel value="2" label="工单记录">
        <t-tabs v-model:value="workOrderValue" @change="orderTabChange">
          <t-tab-panel :value="1" label="预约工单" :destroy-on-hide="false">
            <div class="tab-box">
              <!-- :columns="(columns as PrimaryTableCol<TableRowData>[])" -->
              <t-table row-key="index" :data="estimateData" :columns="(reservationColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover :bordered="false" table-layout="auto">
                <template #discount="{ row }">
                  <span>{{ row.discount ? row.discount : '--' }}</span>
                </template>
              </t-table>
              <t-pagination :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" :defaultPageSize="bookingOrderReq.pageSize" show-jumper v-model:current="bookingOrderReq.pageNum" />
            </div>
          </t-tab-panel>
          <t-tab-panel :value="2" label="服务工单" :destroy-on-hide="false">
            <div class="tab-box">
              <t-table row-key="index" :data="estimateData" :columns="(serveColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover :bordered="false" table-layout="auto">
                <template #discount="{ row }">
                  <span>{{ row.discount ? row.discount : '--' }}</span>
                </template>
              </t-table>
              <t-pagination :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" :defaultPageSize="mealOrderReq.pageSize" show-jumper v-model:current="mealOrderReq.pageNum" />
            </div>
          </t-tab-panel>
          <t-tab-panel :value="3" label="权益工单" :destroy-on-hide="false">
            <div class="tab-box">
              <t-table row-key="index" :data="estimateData" :columns="(equityColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover :bordered="false" table-layout="auto">
                <template #statusItem="{ row }">
                  <span v-if="row.status == '0'">已核销</span>
                  <span v-if="row.status == '1'">使用中</span>
                  <span v-if="row.status == '2'">已完成</span>
                </template>
                <template #source="{ row }">
                  <span v-if="row.source == 'lite'">LIET端</span>
                  <span v-if="row.source == 'pro'">PRO端</span>
                </template>
                <template #begnTime="{ row }">
                  <span>{{ row.begnTime }}-{{ row.endTime }}</span>
                </template>
              </t-table>
              <t-pagination :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" :defaultPageSize="RightsInterestsOrderReq.pageSize" show-jumper v-model:current="RightsInterestsOrderReq.pageNum" />
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script lang="ts">
import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { reactive, toRefs, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBasePageList } from '../../request/modules/CustomApi';
import { TabValue } from 'tdesign-vue-next';
import { BookingOrder, MealOrder, RightsInterestsOrder } from '../../request/modules/orderApi';
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const setArrt = reactive({
      tabsActiveValue: '2',
      foundationInfoState: true,
      data: [],
      columns: [
        { colKey: 'serial-number', title: '序号' },
        { colKey: 'name', title: '客户姓名' },
        { colKey: 'relationsDesc', title: '关系' },
        { colKey: 'phone', title: '联系方式' },
        { colKey: 'createTime', title: '操作时间' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' }
        }
      ],
      workOrderValue: 1,
      bookingOrderReq: {
        userId: route.query.id as string | number,
        pageNum: 1,
        pageSize: 10
      },
      mealOrderReq: {
        userId: route.query.id as string | number,
        pageNum: 1,
        pageSize: 10
      },
      RightsInterestsOrderReq: {
        userId: route.query.id as string | number,
        phone: route.query.phone as string,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      estimateData: [],
      reservationColumns: [
        { colKey: 'ticketsBookingCode', title: '预约单号' },
        { colKey: 'servName', title: '预约服务' },
        { colKey: 'clientName', title: '客户姓名' },
        { colKey: 'bookingTime', title: '预约时间' },
        { colKey: 'institutionName', title: '预约机构' },
        { colKey: 'price', title: '产品金额', align: 'center' },
        { colKey: 'discount', title: '优惠金额', slots: { customRender: 'discount' }, align: 'center' },
        { colKey: 'money', title: '实付金额', align: 'center' },
        { colKey: 'statusName', title: '状态' },
        { colKey: 'createTime', title: '创建时间' }
      ],
      serveColumns: [
        { colKey: 'ticketsServiceCode', title: '套餐单号' },
        { colKey: 'bookingServ', title: '套餐名称' },
        { colKey: 'purchaser', title: '客户姓名' },
        { colKey: 'statusName', title: '状态' },
        { colKey: 'price', title: '产品金额', align: 'center' },
        { colKey: 'discount', title: '优惠金额', slots: { customRender: 'discount' }, align: 'center' },
        { colKey: 'money', title: '实付金额', align: 'center' },
        { colKey: 'createTime', title: '下单时间' },
        { colKey: 'useTime', title: '使用时间' }
      ],
      equityColumns: [
        { colKey: 'ticketsEquityCode', title: '工单编号' },
        { colKey: 'equityName', title: '权益名称' },
        { colKey: 'clientName', title: '客户姓名' },
        { colKey: 'phone', title: '联系电话' },
        { colKey: 'serviceTimes', title: '服务次数' },
        { colKey: 'status', title: '状态' },
        { colKey: 'activeCode', title: '激活码' },
        { colKey: 'source', title: '工单来源' },
        { colKey: 'updateUser', title: '操作人员' },
        { colKey: 'updateTime', title: '操作时间' },
        { colKey: 'begnTime', title: '有效期' },
        { colKey: 'operation', title: '操作', slots: { customRender: 'operation' }, width: 140, fixed: 'right' }
      ]
    });
    onMounted(() => {
      // getList();
      getBookingOrder();
    });
    const getList = () => {
      getBasePageList({ associatedUsers: route.query.id as number | string, pageNum: 1, pageSize: 30 }).then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          setArrt.data = res.data?.data || [];
        }
      });
    };
    const getIcon = (name: string) => {
      return new URL(`../../assets/img/custom/${name}.png`, import.meta.url).href;
    };
    const lookDetaile = (id: number | string, archivesNo: string = '') => {
      router.push({ path: '/customDetails', query: { id, archivesNo, display: 'false' } });
    };
    const getBookingOrder = () => {
      BookingOrder(setArrt.bookingOrderReq).then((res: any) => {
        if (res.code === 200) {
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const getMealOrder = () => {
      MealOrder(setArrt.mealOrderReq).then((res: any) => {
        if (res.code === 200) {
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const getRightsInterestsOrder = () => {
      RightsInterestsOrder(setArrt.RightsInterestsOrderReq).then((res: any) => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            switch (res.data.data[i].status) {
              case 0:
                res.data.data[i].status = '已核销';
                break;
              case 1:
                res.data.data[i].status = '使用中';
                break;
              case 2:
                res.data.data[i].status = '已完成';
                break;
              default:
                break;
            }
          }
          setArrt.estimateData = res.data.data || [];
          setArrt.total = res.data.total || 0;
        } else {
          setArrt.estimateData = [];
          setArrt.total = 0;
        }
      });
    };
    const orderTabChange = (value: TabValue) => {
      switch (value) {
        case 1:
          getBookingOrder();
          break;
        case 2:
          getMealOrder();
          break;
        case 3:
          getRightsInterestsOrder();
          break;

        default:
          break;
      }
    };
    const pageSizeChange = (pageSize: number) => {
      switch (setArrt.tabsActiveValue) {
        case '1':
          getList();
          break;
        case '2':
          switch (setArrt.workOrderValue) {
            case 1:
              setArrt.bookingOrderReq.pageSize = pageSize;
              setArrt.bookingOrderReq.pageNum = 1;
              getBookingOrder();
              break;
            case 2:
              setArrt.mealOrderReq.pageSize = pageSize;
              setArrt.mealOrderReq.pageNum = 1;
              getMealOrder();
              break;
            case 3:
              setArrt.RightsInterestsOrderReq.pageSize = pageSize;
              setArrt.RightsInterestsOrderReq.pageNum = 1;
              getRightsInterestsOrder();
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    };
    const currentChange = (current: number) => {
      switch (setArrt.tabsActiveValue) {
        case '1':
          getList();
          break;
        case '2':
          switch (setArrt.workOrderValue) {
            case 1:
              setArrt.bookingOrderReq.pageNum = current;
              getBookingOrder();
              break;
            case 2:
              setArrt.mealOrderReq.pageNum = current;
              getMealOrder();
              break;
            case 3:
              setArrt.RightsInterestsOrderReq.pageNum = current;
              getRightsInterestsOrder();
              break;

            default:
              break;
          }
          break;
        default:
          break;
      }
    };
    const tabsChange = (value: TabValue) => {
      switch (value) {
        case '1':
          getList();
          break;
        case '2':
          setArrt.bookingOrderReq.pageNum = 1;
          getBookingOrder();
          break;
        default:
          break;
      }
    };
    return {
      ...toRefs(setArrt),
      getIcon,
      lookDetaile,
      orderTabChange,
      pageSizeChange,
      currentChange,
      tabsChange
    };
  }
};
</script>

<style lang="scss" scoped>
.cunstom-details {
  .t-tabs {
    height: 100%;
    border-radius: 18px;
  }

  .info-box {
    padding: 20px;

    .foundation-info,
    .health-files {
      // width: 871.36px;
      height: 256px;
      background: #ffffff;
      box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
      border-radius: 10.72px;
      padding: 14.72px 36.8px;
      box-sizing: border-box;

      .title-box {
        display: flex;
        align-items: center;
        padding-bottom: 5.44px;

        .line {
          width: 4px;
          height: 14.72px;
          background: #5766fe;
          border-radius: 14.72px;
        }

        .title {
          font-weight: 600;
          font-size: 14.72px;
          color: #222222;
          margin-left: 4px;
        }
      }

      .info-dateil {
        display: flex;
        justify-content: space-between;
        align-content: center;
        flex-wrap: wrap;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-content: center;
          margin-top: 9.28px;

          p {
            font-size: 14.72px;
            line-height: 20px;

            &:nth-child(1) {
              color: #747474;
            }

            &:nth-child(2) {
              color: #222222;
              font-weight: bold;
            }
          }

          .nullText {
            color: #a0a0a0 !important;
          }
        }

        .item-1 {
          width: 52%;
        }

        .item-2 {
          width: 43%;
        }
      }
    }

    .foundation-info {
      height: 136px;
      overflow: hidden;
      transition: height 0.5s;

      .title-or-operate {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .operate-box {
          display: flex;
          align-items: center;

          img {
            width: 12px;
            height: 6.72px;
            margin-right: 3.36px;
          }

          font-size: 14.72px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }
    }

    .foundation-info-develop {
      height: 256px;
    }

    .foundation-info-contract {
      height: 136px;
    }

    .health-files {
      margin-top: 17.6px;
      overflow: hidden;
      transition: all 0.5s;
    }

    .health-files-develop {
      margin-top: 17.6px;
      height: 256px;
    }

    .health-files-contract {
      padding: 0;
      margin-top: 0px;
      height: 0;
    }

    .other-files {
      margin-top: 17.6px;
      display: flex;
      justify-content: space-between;

      .medical-files {
        width: 575.08px;
        background: #ffffff;
        box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
        border-radius: 10.72px;
        padding: 18.08px 30.08px;
        box-sizing: border-box;

        .title-box {
          display: flex;
          align-items: center;
          padding-bottom: 5.44px;

          .line {
            width: 4px;
            height: 14.72px;
            background: #5766fe;
            border-radius: 14.72px;
          }

          .title {
            font-weight: 600;
            font-size: 14.72px;
            color: #222222;
            margin-left: 4px;
          }
        }

        .class-item {
          padding: 9.6px 0;
          font-size: 14.72px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #747474;
          line-height: 20px;
          display: flex;

          .class-name {
            flex: 0 0 auto;
            width: 86.08px;
          }

          .class-details {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            p {
              margin-bottom: 9.28px;
              padding: 0 11.2px;
            }

            .keynote {
              font-weight: bold;
              color: #222222;
            }
          }
        }
      }

      .habit-or-motion {
        width: 575.08px;

        .habit {
          width: 575.08px;
          background: #ffffff;
          box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
          border-radius: 10.72px;
          padding: 18.08px 30.08px;
          box-sizing: border-box;

          .title-box {
            display: flex;
            align-items: center;
            padding-bottom: 5.44px;

            .line {
              width: 4px;
              height: 14.72px;
              background: #5766fe;
              border-radius: 14.72px;
            }

            .title {
              font-weight: 600;
              font-size: 14.72px;
              color: #222222;
              margin-left: 4px;
            }
          }

          .class-item {
            display: flex;
            flex-wrap: wrap;
            font-size: 14.72px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #747474;
            line-height: 20px;

            p {
              flex: 0 0 auto;
              padding: 8px 0;

              span {
                font-weight: bold;
                color: #222222;
                padding: 0 12.8px;
              }
            }
          }
        }

        .motion {
          width: 575.08px;
          background: #ffffff;
          box-shadow: 0px 1.28px 12px 0px rgba(87, 102, 254, 0.07);
          border-radius: 10.72px;
          padding: 18.08px 30.08px;
          box-sizing: border-box;
          margin-top: 16px;

          .title-box {
            display: flex;
            align-items: center;
            padding-bottom: 5.44px;

            .line {
              width: 4px;
              height: 14.72px;
              background: #5766fe;
              border-radius: 14.72px;
            }

            .title {
              font-weight: 600;
              font-size: 14.72px;
              color: #222222;
              margin-left: 4px;
            }
          }

          .class-item {
            padding: 9.6px 0;
            font-size: 14.72px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #747474;
            line-height: 20px;
            display: flex;

            .class-name {
              flex: 0 0 auto;
              width: 86.08px;
            }

            .class-details {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;

              p {
                margin-bottom: 9.28px;
                padding: 0 11.2px;
              }

              .keynote {
                font-weight: bold;
                color: #222222;
              }
            }
          }
        }
      }
    }
  }

  .tab-box {
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
