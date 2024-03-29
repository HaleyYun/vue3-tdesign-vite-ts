<template>
  <div class="details">
    <div class="back" @click="goActivityList">
      <ChevronLeftIcon />活动列表
    </div>
    <div class="section">
      <div class="section-title">活动详情</div>
      <div class="section-content">
        <div class="activity">
          <div class="activity-one">
            <div class="activity-one-title">机构名称:</div>
            <div class="activity-one-content">{{ customer.organName }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">活动名称:</div>
            <div class="activity-one-content">{{ customer.activityName }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">活动描述:</div>
            <div class="activity-one-content">{{ customer.activityDescribe }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">活动时间:</div>
            <div class="activity-one-content">{{ customer.activityBegnDate }}~{{ customer.activityEndDate }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">活动分类:</div>
            <div class="activity-one-content">{{ customer.activityCategory == 'commonweal' ? '公益活动' : '' }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">参与人数:</div>
            <div class="activity-one-content">{{ customer.activityJoinNumber }}人</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">报名人数:</div>
            <div class="activity-one-content">{{ customer.activityEnterNumber }}人</div>
          </div>

          <div class="activity-one">
            <div class="activity-one-title">列表图片:</div>
            <div class="activity-one-content">
              <t-image :src="customer.mainPicture" :style="{ width: '89px', height: '89px' }" overlay-trigger="hover">
                <template #overlayContent>
                  <div
                    style="background: rgba(0,0,0,.4) ; color: #fff ; height: 100% ; display: flex ; alignItems: center ; justifyContent: center ;">
                    <BrowseIcon @click="previewShow = customer.mainPicture" />
                  </div>
                </template>
              </t-image>
            </div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">详情图片:</div>
            <div class="activity-one-content preview-details-image">
              <t-image v-for="(item, index) in customer.playPictureList" :src="item"
                :style="{ width: '89px', height: '89px',marginRight: '16px' }" overlay-trigger="hover" :key="index">
                <template #overlayContent>
                  <div
                    style="background: rgba(0,0,0,.4) ; color: #fff ; height: 100% ; display: flex ; alignItems: center ; justifyContent: center ;">
                    <BrowseIcon @click="previewShow = item" />
                  </div>
                </template>
              </t-image>
            </div>
          </div>
        </div>
        <div class="activity">
          <div class="activity-one">
            <div class="activity-one-title">活动规则:</div>
            <div class="activity-one-content">{{ customer.activityRule }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">活动方式:</div>
            <div class="activity-one-content">{{ customer.activityWay == 'online' ? '线上' : '线下' }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">关联产品:</div>
            <div class="activity-one-content">{{ customer.productName }}</div>
          </div>
          <div class="activity-one">
            <div class="activity-one-title">所属渠道:</div>
            <div class="activity-one-content">{{ customer.channelName }}</div>
          </div>
          <div class="activity-one" v-if="customer.status == 1">
            <div class="activity-one-title">驳回理由:</div>
            <div class="activity-one-content">{{ customer.reason }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">活动点位</div>
      <t-table row-key="id" :data="pointData" :bordered="false"
        :columns="(pointColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed">
      </t-table>
      <div style="height: 20px;"></div>
    </div>
    <div class="section">
      <div class="section-title">报名详情</div>
      <div class="search-box">
        <div class="search-item search-item-font">
          预约单号:
          <t-input class="ipt-slt" v-model="titleData.ticketsCode" placeholder="请输入预约单号" />
        </div>
        <div class="search-item search-item-font">
          姓名:
          <t-input class="ipt-slt" v-model="titleData.name" placeholder="请输入姓名" />
        </div>
        <div class="search-item search-item-font">
          联系方式:
          <t-input class="ipt-slt" v-model="titleData.phone" placeholder="请输入联系方式" />
        </div>
        <div class="search-item search-item-font">
          报名时间:
          <t-date-range-picker enable-time-picker v-model="titleData.enterTime" allow-input clearable
            @change="enterTimeOnChange" />
        </div>
        <div class="search-item search-item-font">
          状态:
          <t-select class="ipt-slt" v-model="titleData.status" :options="options"></t-select>
        </div>
        <div class="search-item search-item-font">
          参与时间:
          <t-date-range-picker enable-time-picker v-model="titleData.joinTime" allow-input clearable
            @change="joinTimeOnChange" />
        </div>
      </div>
      <div class="search-reset">
        <t-button class="search-button" @click="search">搜索</t-button>
        <t-button class="reset-button" variant="outline" theme="primary" @click="reset">重置</t-button>
      </div>
      <t-table row-key="address	" :data="participantData" :bordered="false"
        :columns="(participantColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed">
        <template #type-slot-sex="{ col, row }">
          {{ row.sex == 1 ? '男' : '' || row.sex == 2 ? '女' : '' }}
        </template>
        <template #type-slot-status="{ col, row }">
          <div :class="row.status == 1 ? 'registered' : '' || row.status == 2 ? 'participated' : ''">
            {{ row.status == 1 ? '已报名' : '' || row.status == 2 ? '已参与' : '' }}
          </div>
        </template>
      </t-table>
      <t-pagination :pageSize="formData.pageSize" :total="total" v-model:current="formData.pageNum"
        @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      <div style="height: 20px;"></div>
    </div>
    <div class="preview-img" v-show="previewShow">
      <CloseCircleIcon class="icon" @click="previewShow = ''" />
      <img :src="customer.mainPicture" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router';
import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ChevronLeftIcon, BrowseIcon, CloseCircleIcon } from 'tdesign-icons-vue-next';
import { enterListPageQuery, findDetail, pointsList } from "../../request/modules/MarketApi";
const router = useRouter()
const route = useRoute()
const activityId = ref<any>('');
// 活动详情
const customer = ref<any>({});
let getFindDetail = () => {
  findDetail({
    code: activityId.value,
  }).then((res: any) => {
    if (res.code === 200) {
      customer.value = res.data;
    }
  })
}
let previewShow = ref('')
// 活动点位列表
let pointData = ref([
  // {address:'111',phone:'111'},
  // {address:'111',phone:'111'},
  // {address:'111',phone:'111'},
  // {address:'111',phone:'111'},
]);
let pointColumns = ref([
  { colKey: 'address', title: '活动地址' },
  { colKey: 'venueName', title: '场地名称' },
  { colKey: 'phone', title: '联系方式' },
]);
let getPointsList = () => {
  pointsList({
    activityCode: activityId.value,
    pageNum: 1,
    pageSize: 999
  }).then((res: any) => {
    pointData.value = res.data.data;
  })
}
// 表单
let formData = reactive({
  ticketsCode: '',
  name: '',
  phone: '',
  status: 3,
  enterTimeBegin: '',
  enterTimeEnd: '',
  joinTimeBegin: '',
  joinTimeEnd: '',
  enterTime: [],
  joinTime: [],

  pageNum: 1,
  pageSize: 10,
});
let titleData = reactive({
  ticketsCode: '',
  name: '',
  phone: '',
  status: 3,
  enterTimeBegin: '',
  enterTimeEnd: '',
  joinTimeBegin: '',
  joinTimeEnd: '',
  enterTime: [],
  joinTime: [],
});
// 报名列表
let participantData = ref([
  // {ticketsCode:'111',name:'111',sex:'1',phone:'111',enterTime:'111',status:'1',joinTime:'111'},
  // {ticketsCode:'111',name:'111',sex:'2',phone:'111',enterTime:'111',status:'2',joinTime:'111'},
  // {ticketsCode:'111',name:'111',sex:'111',phone:'111',enterTime:'111',status:'111',joinTime:'111'},
  // {ticketsCode:'111',name:'111',sex:'111',phone:'111',enterTime:'111',status:'111',joinTime:'111'},
]);
let participantColumns = ref([
  { colKey: 'ticketsCode', title: '预约单号' },
  { colKey: 'name', title: '姓名' },
  { colKey: 'sex', title: '性别', cell: 'type-slot-sex', },
  { colKey: 'phone', title: '联系方式' },
  { colKey: 'enterTime', title: '报名时间' },
  { colKey: 'status', title: '状态', cell: 'type-slot-status', },
  { colKey: 'joinTime', title: '参与时间' },
]);
const enterTimeOnChange = (value: any) => {
  titleData.enterTimeBegin = value[0]
  titleData.enterTimeEnd = value[1]
};
const joinTimeOnChange = (value: any) => {
  titleData.joinTimeBegin = value[0]
  titleData.joinTimeEnd = value[1]
};
let options = ref([
  { label: '全部', value: 3 },
  { label: '已报名', value: 1 },
  { label: '已参与', value: 2 },
]);
// 请求报名列表数据
const getEnterListPageQuery = () => {
  enterListPageQuery({
    activityCode: activityId.value,
    ticketsCode: formData.ticketsCode,
    name: formData.name,
    phone: formData.phone,
    status: formData.status,
    enterTimeBegin: formData.enterTimeBegin,
    enterTimeEnd: formData.enterTimeEnd,
    joinTimeBegin: formData.joinTimeBegin,
    joinTimeEnd: formData.joinTimeEnd,
    pageNum: formData.pageNum,
    pageSize: formData.pageSize,
  }).then((res: any) => {
    participantData.value = res.data.data
    total.value = res.data.total
  })
}
// 搜索按钮
const search = () => {
  formData = Object.assign(formData, titleData)
  formData.pageNum = 1;
  getEnterListPageQuery();
};
// 重置按钮
const reset = () => {
  formData.ticketsCode = '';
  formData.name = '';
  formData.phone = '';
  formData.status = 3;
  formData.enterTimeBegin = '',
    formData.enterTimeEnd = '',
    formData.joinTimeBegin = '',
    formData.joinTimeEnd = '',
    formData.enterTime = [];
  formData.joinTime = [];
  formData.pageNum = 1;
  formData.pageSize = 10;

  titleData.ticketsCode = '';
  titleData.name = '';
  titleData.phone = '';
  titleData.status = 3;
  titleData.enterTimeBegin = '',
    titleData.enterTimeEnd = '',
    titleData.joinTimeBegin = '',
    titleData.joinTimeEnd = '',
    titleData.enterTime = [];
  titleData.joinTime = [];
  getEnterListPageQuery();
};
// go活动列表
const goActivityList = () => {
  router.push("/activityList")
}
// 分页
let total = ref(0);
const pageSizeChange = (pageSize: number) => {
  formData.pageSize = pageSize;
  formData.pageNum = 1;
  getEnterListPageQuery()
};
const currentChange = (current: number) => {
  formData.pageNum = current;
  getEnterListPageQuery()
};
onMounted(() => {
  if (route.query.id) {
    activityId.value = route.query.id;
    getFindDetail();
    getPointsList()
    getEnterListPageQuery();
  }
})
</script>

<style lang="scss" scoped>
.details {
  overflow-y: auto;

  .back {
    width: fit-content;
    font-size: 18px;
    font-weight: 900;
    color: black;
    margin-bottom: 14px;
    cursor: pointer;
  }

  .section {
    background: white;
    border-radius: 10px;
    padding: 18px 28px 0 28px;
    margin-bottom: 16px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #222222;
      height: fit-content;
      position: relative;
      margin-bottom: 19px;
      padding-left: 8px;
      box-sizing: border-box;

      &::before {
        content: '';
        position: absolute;
        left: 0px;
        top: 2px;
        width: 5px;
        height: 16px;
        background-color: #5766FE;
        border-radius: 3px;
      }
    }

    .section-content {
      display: flex;
      justify-content: space-between;

      .activity {
        width: 48%;

        .activity-one {
          display: flex;
          margin-bottom: 22px;

          .activity-one-title {
            font-size: 16px;
            font-weight: bold;
            color: #747584;
            white-space: nowrap;
            width: fit-content;
            margin-right: 30px;
            line-height: 22px;
          }

          .activity-one-content {
            font-size: 16px;
            font-weight: bold;
            color: #222222;
            line-height: 22px;
          }
          .preview-details-image{
            display: flex;
          }
        }
      }
    }

    .search-box {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 0 15px;
      margin-bottom: 16px;

      .search-item {
        margin: 10px 25px 10px 0;
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

  ::v-deep(.t-table__th-cell-inner) {
    color: black !important;
    font-weight: bold !important;
  }
}

.registered {
  color: #3D7EFF;
}

.participated {
  color: #686868;
}

::v-deep(.t-pagination__jump) {
  background-color: white !important;
}

::v-deep(.t-input) {
  border-radius: 8px !important;
}

::v-deep(.t-range-input) {
  border-radius: 8px !important;
}

::v-deep(.t-table__th-address),
::v-deep(.t-table__th-venueName),
::v-deep(.t-table__th-phone),
::v-deep(.t-table__th-ticketsCode),
::v-deep(.t-table__th-name),
::v-deep(.t-table__th-sex),
::v-deep(.t-table__th-phone),
::v-deep(.t-table__th-enterTime),
::v-deep(.t-table__th-status),
::v-deep(.t-table__th-joinTime) {
  background: #FAFBFD !important;
}

.search-reset {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 26px;
}

.search-button {
  width: 122px;
  height: 44px;
  background: #3D7EFF;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  margin-right: 16px;
}

.reset-button {
  width: 122px;
  height: 44px;
  font-size: 16px;
  font-weight: bold;
  background: #F1F6FF;
  border-radius: 6px;
  border: none;
  margin-right: 14px;
}

.preview-img {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: .8);
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    color: #fff;
    font-size: 60px;
    position: absolute;
    top: 50px;
    right: 50px;
  }

  img {
    max-width: 60%;
    max-height: 60%;
  }
}
</style>
