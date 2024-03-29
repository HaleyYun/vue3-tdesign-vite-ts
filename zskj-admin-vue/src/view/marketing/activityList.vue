<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search">
        <div class="search-item search-item-font" v-if="bell">
          机构名称：
          <t-input class="ipt-slt" v-model="titleData.organName" :maxlength="30" placeholder="请输入机构名称" />
        </div>
        <div class="search-item search-item-font">
          活动编号：
          <t-input class="ipt-slt" v-model="titleData.activityCode" :maxlength="30" placeholder="请输入活动编号" />
        </div>
        <div class="search-item search-item-font">
          活动名称：
          <t-input class="ipt-slt" v-model="titleData.activityName" :maxlength="30" placeholder="请输入活动名称" />
        </div>
        <div class="search-item search-item-font">
          活动状态：
          <t-select class="ipt-slt" v-model="titleData.status" :options="bell == false ? statusOptions : statusOptions1"></t-select>
        </div>
        <div class="search-item search-item-font">
          活动类型：
          <t-select class="ipt-slt" v-model="titleData.activityCategory" :options="typeOptions"></t-select>
        </div>
        <div class="search-item search-item-font">
          报名人数：
          <t-input-group separate>
            <t-input :style="{ width: '120px' }" v-model="titleData.enterNumberMin" type="number" />
            <span :style="{ lineHeight: '32px' }">&nbsp;-&nbsp;</span>
            <t-input :style="{ width: '120px' }" v-model="titleData.enterNumberMax" type="number" />
          </t-input-group>
        </div>
        <div class="search-item search-item-font">
          参与人数：
          <t-input-group separate>
            <t-input :style="{ width: '120px' }" v-model="titleData.joinNumberMin" type="number" />
            <span :style="{ lineHeight: '32px' }">&nbsp;-&nbsp;</span>
            <t-input :style="{ width: '120px' }" v-model="titleData.joinNumberMax" type="number" />
          </t-input-group>
        </div>
        <div class="search-item search-item-font">
          关联产品：
          <t-input class="ipt-slt" v-model="titleData.productName" placeholder="请输入关联产品" />
        </div>
        <div class="search-reset">
          <t-button style="margin-right: 20px" @click="search">搜索</t-button>
          <t-button variant="outline" theme="primary" @click="reset">重置</t-button>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="permission-box" v-if="platform">
        <t-button class="publish-but" variant="outline" @click="publish" theme="primary"><img src="../../assets/img/activityList/aeroplane.png" class="aeroplane" alt="" />发布活动</t-button>
        <t-button class="pass-but" variant="outline" @click="pass" theme="success" v-if="bell"
          ><template #icon> <CheckCircleFilledIcon /> </template>通过</t-button
        >
        <t-button class="turnDown-but" variant="outline" @click="handleReject" theme="danger" v-if="bell"
          ><template #icon> <ErrorCircleFilledIcon /> </template>驳回</t-button
        >
      </div>
      <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>

      <div v-else class="tab-box">
        <t-table
          :max-height="fixedTopRows ? 1400 : 360"
          row-key="activityCode"
          :data="data"
          :bordered="false"
          v-model:selected-row-keys="selectedRowKeys"
          select-on-row-click
          :columns="((bell == false ? columns : platform == true ? columns1 : columns2) as PrimaryTableCol<TableRowData>[])"
          size="medium"
          table-layout="auto"
        >
          <template #type-slot-activityCategory="{ col, row }">
            {{ row.activityCategory == 'commonweal' ? '公益活动' : '' }}
          </template>
          <template #type-slot-status="{ col, row }">
            <div :class="row.status == 0 ? (bell == false ? 'application' : 'reviewed') : '' || row.status == 3 ? 'notStarted' : '' || row.status == 2 ? 'way' : '' || row.status == 4 ? 'ended' : '' || row.status == 1 ? 'rejected' : ''">
              {{ row.status == 0 ? (bell == false ? '申请中' : '待审核') : '' || row.status == 3 ? '未开始' : '' || row.status == 2 ? '进行中' : '' || row.status == 4 ? '已结束' : '' || row.status == 1 ? '已驳回' : '' }}
            </div>
          </template>
          <template #operation="{ row }">
            <t-button variant="text" theme="success" size="small" @click="rehandleClick(row, 'edit')">编辑 </t-button>
            <t-button variant="text" theme="primary" size="small" @click="rehandleClick(row, 'look')">查看详情</t-button>
          </template>
        </t-table>
      </div>
      <div class="pagination">
        <t-pagination :pageSize="formData.pageSize" :total="total" v-model:current="formData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
    <div class="mask-box" v-show="maskShow">
      <div class="mask-content">
        <h2>提示</h2>
        <p>确定要驳回{{ masktext.slice(0, masktext.length - 1) }}申请吗？</p>
        <t-textarea v-model="reason" placeholder="请输入内容" :maxlength="20" />
        <div class="btn-box">
          <button @click="changeMaskShow">取消</button>
          <button @click="turnDown">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, ref } from 'vue';
import { SearchIcon, NotificationIcon, FilePasteIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, DiscountFilledIcon } from 'tdesign-icons-vue-next';
import { DateRangeValue, PrimaryTableCol, TableRowData, TabValue, MessagePlugin, TScroll } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { activityCheck, findByCode } from '../../request/modules/MarketApi';
import { useRoleStore } from '../../store/modules/role';
import Load from '../../components/load/load.vue';
const roleState = useRoleStore();
const router = useRouter();
// 表单
let formData = reactive({
  organName: '',
  activityCode: '',
  status: 6,
  activityCategory: '',
  activityName: '',
  enterNumberMin: '',
  enterNumberMax: '',
  joinNumberMin: '',
  joinNumberMax: '',
  productName: '',

  pageNum: 1,
  pageSize: 10
});
let maskShow = ref<boolean>(false);
let masktext = ref<string>('');
let reason = ref<string>('');
let titleData = reactive({
  organName: '',
  activityCode: '',
  status: 6,
  activityCategory: '',
  activityName: '',
  enterNumberMin: '',
  enterNumberMax: '',
  joinNumberMax: '',
  joinNumberMin: '',
  productName: ''
});
// 机构活动状态
let statusOptions = ref([
  { label: '全部', value: 6 },
  { label: '申请中', value: 0 },
  { label: '已驳回', value: 1 },
  { label: '进行中', value: 2 },
  { label: '未开始', value: 3 },
  { label: '已结束', value: 4 }
]);
// 渠道活动状态
let statusOptions1 = ref([
  { label: '全部', value: 6 },
  { label: '待审核', value: 0 },
  { label: '进行中', value: 2 },
  { label: '未开始', value: 3 },
  { label: '已结束', value: 4 },
  { label: '已驳回', value: 1 }
]);
// 活动类型
let typeOptions = ref([
  { label: '全部', value: '' },
  { label: '公益活动', value: 'commonweal' }
]);
// 重置按钮
const reset = () => {
  formData.organName = '';
  formData.activityCode = '';
  formData.status = 6;
  formData.activityCategory = '';
  formData.activityName = '';
  formData.enterNumberMin = '';
  formData.enterNumberMax = '';
  formData.joinNumberMin = '';
  formData.joinNumberMax = '';
  formData.productName = '';
  formData.pageNum = 1;
  formData.pageSize = 10;

  titleData.organName = '';
  titleData.activityCode = '';
  titleData.status = 6;
  titleData.activityCategory = '';
  titleData.activityName = '';
  titleData.enterNumberMin = '';
  titleData.enterNumberMax = '';
  titleData.joinNumberMin = '';
  titleData.joinNumberMax = '';
  titleData.productName = '';
  getFindByCode(formData);
};
// 搜索按钮
const search = () => {
  formData = Object.assign(formData, titleData);
  formData.pageNum = 1;
  getFindByCode(formData);
};
// 发布
const publish = () => {
  router.push({ path: '/activityRelease' });
};
// 审核活动
let selectedRowKeys = ref<any>([]);
let checkData = ref(false);
const requestActivityCheck = () => {
  activityCheck({
    activityCode: selectedRowKeys.value,
    check: checkData.value,
    reason: reason.value
  }).then((res: any) => {
    if (res.code == 200) {
      selectedRowKeys.value = [];
      maskShow.value = false;
      getFindByCode(formData);
    }
  });
};
// 通过
const pass = () => {
  checkData.value = true;
  requestActivityCheck();
};
// 驳回
const turnDown = () => {
  checkData.value = false;
  requestActivityCheck();
};
// 机构
let columns = ref([
  { colKey: 'activityCode', title: '活动编码', align: 'center' },
  { colKey: 'activityName', title: '活动名称', align: 'center' },
  { colKey: 'activityCategory', title: '活动类型', align: 'center', cell: 'type-slot-activityCategory' },
  { colKey: 'productName', title: '关联产品', align: 'center' },
  { colKey: 'status', title: '活动状态', align: 'center', cell: 'type-slot-status' },
  { colKey: 'activityEnterNumber', title: '报名人数', align: 'center' },
  { colKey: 'activityJoinNumber', title: '参与人数', align: 'center' },
  { colKey: 'operation', title: '操作', fixed: 'right', align: 'center', slots: { customRender: 'operation' }, width: '230px' }
]);
// 渠道
let columns1 = ref([
  {
    colKey: 'row-select',
    type: 'multiple',
    checkProps: (row: any) => ({ disabled: row.row.status != 0 })
  },
  { colKey: 'organName', title: '机构名称', align: 'center' },
  { colKey: 'activityCode', title: '活动编码', align: 'center' },
  { colKey: 'activityName', title: '活动名称', align: 'center' },
  { colKey: 'activityCategory', title: '活动类型', align: 'center', cell: 'type-slot-activityCategory' },
  { colKey: 'productName', title: '关联产品', align: 'center' },
  { colKey: 'status', title: '活动状态', align: 'center', cell: 'type-slot-status' },
  { colKey: 'operation', title: '操作', fixed: 'right', slots: { customRender: 'operation' }, width: '230px' }
]);
// admin
let columns2 = ref([
  { colKey: 'organName', title: '机构名称', align: 'center' },
  { colKey: 'activityCode', title: '活动编码', align: 'center' },
  { colKey: 'activityName', title: '活动名称', align: 'center' },
  { colKey: 'activityCategory', title: '活动类型', align: 'center', cell: 'type-slot-activityCategory' },
  { colKey: 'productName', title: '关联产品', align: 'center' },
  { colKey: 'status', title: '活动状态', align: 'center', cell: 'type-slot-status' },
  { colKey: 'operation', title: '操作', align: 'center', fixed: 'right', slots: { customRender: 'operation' }, width: '230px' }
]);
// 表格数据
let data = ref([
  // {status:0,organName:'1',activityCode:'1',activityName:'1',activityCategory:'1',productName:'1',activityEnterNumber:'1',activityJoinNumber:'1'},
  // {status:4,organName:'2',activityCode:'2',activityName:'2',activityCategory:'2',productName:'2',activityEnterNumber:'1',activityJoinNumber:'1'},
  // {status:3,organName:'3',activityCode:'3',activityName:'3',activityCategory:'3',productName:'3',activityEnterNumber:'1',activityJoinNumber:'1'},
  // {status:2,organName:'4',activityCode:'4',activityName:'4',activityCategory:'4',productName:'4',activityEnterNumber:'1',activityJoinNumber:'1'},
  // {status:1,organName:'5',activityCode:'5',activityName:'5',activityCategory:'5',productName:'5',activityEnterNumber:'1',activityJoinNumber:'1'},
  // {status:0,organName:'6',activityCode:'6',activityName:'6',activityCategory:'6',productName:'6',activityEnterNumber:'1',activityJoinNumber:'1'},
]);
let allData = ref<any>([]);
// 请求表格数据
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const getFindByCode = (formData: any) => {
  findByCode(formData).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (data.value = []);
      } else {
        //正常逻辑
        data.value = res.data.data;
        total.value = res.data.total;
        allData.value.push(...res.data.data);
      }
    } else {
      //接口报错
      (loadStatus.value = 'failure'), (data.value = []);
    }
  });
};
// 分页
let total = ref(0);
const pageSizeChange = (pageSize: number) => {
  formData.pageSize = pageSize;
  formData.pageNum = 1;
  getFindByCode(formData);
};
const currentChange = (current: number) => {
  formData.pageNum = current;
  getFindByCode(formData);
};
// 查看详情
const rehandleClick = (row: any, status: string) => {
  if (status === 'look') {
    router.push({
      path: '/activityDetails',
      query: {
        id: row.activityCode
      }
    });
  }
  if (status === 'edit') {
    router.push({
      path: '/activityRelease',
      query: {
        id: row.activityCode
      }
    });
  }
};
let bell = ref(true);
let platform = ref(true);
const handleReject = () => {
  let arr = formatArr(allData.value, 'activityCode');
  let activeArr: any = [];
  let organArr: any = [];
  let str = '';
  for (let i = 0; i < selectedRowKeys.value.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].activityCode == selectedRowKeys.value[i]) {
        activeArr.push(arr[j]);
      }
    }
  }
  organArr = formatArr(activeArr, 'organNum');
  for (let i = 0; i < organArr.length; i++) {
    let arr = activeArr.filter((item: any) => item.organNum === organArr[i].organNum);
    console.log(arr);
    if (arr.length > 1) {
      str = `${arr[0].organName}机构${arr[0].activityName}等${arr.length}个活动，`;
    } else if (arr.length == 1) {
      str = `${arr[0].organName}机构${arr[0].activityName}活动，`;
    }
  }
  masktext.value = str;
  maskShow.value = true;
};
let formatArr = (arr: any, uniId: string) => {
  const res = new Map();
  return arr.filter((item: any) => !res.has(item[uniId]) && res.set(item[uniId], 1));
};
const changeMaskShow = () => {
  maskShow.value = false;
  reason.value = '';
};
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  getFindByCode(formData);
  if (roleState.userInfo.organizationLevel == 1) {
    platform.value = false;
    bell.value = true;
  } else if (roleState.userInfo.organizationLevel == 2) {
    bell.value = true;
  } else {
    bell.value = false;
  }
});
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .search-box {
    background: #ffffff;
    border-radius: 10px;
    margin-bottom: 16px;
    padding-bottom: 16px;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 250px;
        margin-left: 5px;
      }
    }
  }

  .permission-box {
    display: flex;
    margin-bottom: 14px;

    .search-item {
      font-size: 16px;
      color: #747584;
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
    }
  }
}

::v-deep(.t-table__th-organName),
::v-deep(.t-table__th-activityCode),
::v-deep(.t-table__th-activityName),
::v-deep(.t-table__th-activityCategory),
::v-deep(.t-table__th-productName),
::v-deep(.t-table__th-status),
::v-deep(.t-table__th-operation),
::v-deep(.t-table__th-row-select),
::v-deep(.t-table__th-activityEnterNumber),
::v-deep(.t-table__th-activityJoinNumber) {
  background: #fafbfd !important;
}

.tab-box {
  overflow-y: auto;
}

.t-pagination__total {
  width: auto;
}

.t-pagination {
  margin-top: 30px;
}

.application {
  color: #3d7eff;
}

.reviewed {
  color: #e39210;
}

.notStarted {
  color: #686868;
}

.way {
  color: #5dad66;
}

.ended {
  color: #c4c4c4;
  text-decoration: line-through;
}

.rejected {
  color: #f51f1f;
}

.search {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 15px;
}

.search-reset {
  display: flex;
  justify-content: flex-end;
}

.search-button {
  width: 122px;
  height: 44px;
  background: #3d7eff;
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
  background: #f1f6ff;
  border-radius: 6px;
  border: none;
  margin-right: 14px;
}

.aeroplane {
  width: 19px;
  height: 18px;
  margin-top: 2px;
  margin-right: 1px;
}

::v-deep(.t-pagination__total) {
  flex: none !important;
}

::v-deep(.t-table__th-cell-inner) {
  color: black !important;
  font-weight: bold !important;
}

.details {
  width: 72px;
  height: 26px;
  background: #f1f6ff;
  border: none;
  color: #3d7eff;
  border-radius: 6px;
  font-size: 12px;
}

.list {
  height: auto;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 10px;
}

.publish-but {
  width: 122px;
  height: 40px;
  background: #f4f8ff;
  border-radius: 6px;
}

.pass-but {
  width: 100px;
  height: 40px;
  background: #f2faf4;
  margin: 0 14px;
  border-radius: 6px;
}

.turnDown-but {
  width: 100px;
  height: 40px;
  background: #faf2f2;
  border-radius: 6px;
}

// ::v-deep(.t-input) {
//   border-radius: 8px !important;
// }

// ::v-deep(.t-range-input) {
//   border-radius: 8px !important;
// }

::v-deep(.t-pagination__jump) {
  background-color: white !important;
}

.mask-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.8);
  z-index: 99;

  .mask-content {
    width: 613px;
    background: #ffffff;
    border-radius: 14px;
    padding: 23px 40px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    h2 {
      text-align: center;
      font-size: 25px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #222222;
      line-height: 36px;
      padding-bottom: 15px;
    }

    p {
      font-size: 20px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 27px;
      padding-bottom: 18px;
    }

    .btn-box {
      margin-top: 37px;
      display: flex;
      justify-content: center;

      button {
        width: 144px;
        height: 48px;
        border-radius: 24px;
        font-size: 20px;
        border: none;

        &:nth-child(1) {
          background: #f5f8fd;
          color: #3d7eff;
          margin-right: 28px;
        }

        &:nth-child(2) {
          margin-left: 28px;
          background: #3d7eff;
          color: #ffffff;
        }
      }
    }
  }
}
</style>

<style>
.mask-content .t-textarea__limit {
  position: relative;
  bottom: 25px;
  right: 12px;
}
</style>
