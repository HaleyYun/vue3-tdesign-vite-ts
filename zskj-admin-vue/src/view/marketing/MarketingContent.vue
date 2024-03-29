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
        <div class="commonContent">活动配置</div>
      </div>
      <div class="search-box">
        <!-- activityName -->
        <t-form ref="form" layout="vertical" :data="formSearch" :colon="true">
          <t-form-item label="活动名称" class="w50" requiredMark name="name">
            <t-input size="large" :allowInputOverMax="false" :maxlength="30" show-limit-number placeholder="请填写活动名称" v-model.trim="formSearch.activityName" />
          </t-form-item>
          <t-form-item label="活动描述" class="w50" name="name">
            <t-textarea v-model="formSearch.activityDescribe" :maxlength="50" @keyup="keyupDescription" :autosize="{ minRows: 4, maxRows: 6 }" placeholder="请输入活动描述" />
          </t-form-item>
          <t-form-item label="活动ID" class="w50" requiredMark name="name">
            <t-input size="large" :disabled="isDisabled" :allowInputOverMax="false" @keyup="overMax" :maxlength="11" placeholder="请输入活动ID" v-model.trim="formSearch.activityId" />
          </t-form-item>

          <t-form-item label="活动周期" name="limit">
            <t-date-range-picker enable-time-picker size="large" allow-input clearable @change="onChange" v-model="dateValue" placeholder="请输入活动周期" />
            <!-- <t-date-range-picker v-model="dateValue" @change="onChange" :presets="presets" placeholder="请输入活动周期" enable-time-picker /> -->
          </t-form-item>
          <t-form-item label="活动渠道" class="w50" name="name">
            <div class="channel">
              <t-button @click="goEdit">去选择</t-button>
              <div v-if="selectedRowKeys.length != 0" class="channelItem">已选择{{ selectedRowKeys.length }}个渠道</div>
            </div>
          </t-form-item>
          <t-form-item label="状态" requiredMark class="w50" name="name">
            <t-switch v-model="formSearch.status" :customValue="[1, 0]" />
          </t-form-item>
        </t-form>
      </div>
    </div>
  </div>
  <t-dialog placement="center" :closeOnOverlayClick="false" :on-close="backModel" destroy-on-Close width="1200px" :on-confirm="verifyModel" v-model:visible="visibleLog">
    <div class="paginationTable" style="height: 600px">
      <div>
        <t-table
          :data="logData"
          row-key="id"
          v-model:selected-row-keys="selectedRowKeys"
          @select-change="rehandleSelectChange"
          :columns="(logColumns as PrimaryTableCol<TableRowData>[])"
          :reserve-selected-row-on-paginate="true"
          :bordered="false"
          size="medium"
          @page-change="onPageChange"
          table-layout="fixed"
          :pagination="pagination"
        >
          <template #type="{ row }">
            <div v-if="row.type == '1'">保险</div>
            <div v-if="row.type == '2'">社区</div>
            <div v-if="row.type == '3'">医疗</div>
          </template>
          <template #enable="{ row }">
            <div v-if="row.enable == 1">启用</div>
            <div v-if="row.enable == 0">禁用</div>
          </template>
        </t-table>
      </div>
    </div>

    <!-- <div class="paginationName">
      <t-pagination :pageSize="searchLogData.pageSize" :total="total" v-model:current="searchLogData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div> -->
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { DateRangeValue, MessagePlugin, SelectOptions, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { addActivityMarketing, activityChannel, findActivity, updateActivityMarketing } from '../../request/modules/MarketApi';
// import dayjs from 'dayjs';
import { organization } from '../../request/modules/ServiceApi';
import { useRouter, useRoute } from 'vue-router';
import load from '../../components/load/load.vue';
import { useRoleStore } from '../../store/modules/role';
import { debounce } from '../../utils/tools';
// --------全局参数---------------
const route = useRoute();
const visibleLog = ref<boolean>(false);
const router = useRouter();
// const presets = ref<any>({
//   最近7天: [dayjs().add(6, 'day'), dayjs()],
//   最近3天: [dayjs().add(2, 'day'), dayjs()],
//   今天: [dayjs(), dayjs()]
// });
// store.setactivityName = 'ppp';
// storeactivityName
const formSearch = reactive<any>({
  activityName: '',
  activityId: '',
  activityDescribe: '',
  status: 0,
  prodCode: '', //目前写死
  beginTime: '',
  endTime: '',
  channels: [],
  id: ''
});

const dateValue = ref<any>([]);
const editID = ref<any>('');
// 弹框信息
const logData = ref<any>([]);
const total = ref<number>(0);
const logColumns = ref([
  {
    colKey: 'row-select',
    type: 'multiple',
    align: 'center',
    checkProps: (data: any) => ({ disabled: data.row.enable == '0' ? true : false }),
    width: 50
  },
  { colKey: 'organizationNum', title: '渠道编码', align: 'center' },
  { colKey: 'organizationName', title: '渠道名称', align: 'center' },
  { colKey: 'type', title: '渠道分类', slots: { customRender: 'type' }, align: 'center' },
  {
    colKey: 'enable',
    title: '状态',
    slots: { customRender: 'enable' },
    align: 'center'
  }
]);
const roleState = useRoleStore();
console.log(roleState.userInfo.organizationLevel, '等级');
//1平台 2渠道 3 机构
const searchLogData = ref<any>({
  // showChannel: roleState.userInfo.organizationLevel == 1 ? true : false,
  showChannel: false,
  pageNum: 1,
  pageSize: 99
});

//----- 加载列表数据 ---------
const isDisabled = ref<boolean>(false); //编辑时不可修改活动id
onMounted(() => {
  //编辑
  if (route.query.markID) {
    console.log('编辑');
    editID.value = route.query.markID;
    editDetails();
  }
});
//
const overMax = limit => {
  formSearch.activityId = limit.replace(/[^\d]/g, ''); //只能输入数;
};
//编辑回显
const editDetails = () => {
  findActivity({ id: route.query.markID as any }).then((res: any) => {
    if (res.code === 200) {
      isDisabled.value = true;
      formSearch.activityName = res.data.activityName;
      formSearch.activityId = res.data.activityId;
      formSearch.activityDescribe = res.data.activityDescribe;
      formSearch.status = res.data.status;
      formSearch.prodCode = res.data.prodCode;
      if (res.data.beginTime && res.data.endTime) {
        dateValue.value = [res.data.beginTime, res.data.endTime];
      }

      getInstitutionList(route.query.markID);
    }
  });
};
const history = ref<any>([]);
//已选择回显
const getInstitutionList = markID => {
  console.log(markID, 'markID');

  activityChannel({ activityMarketingId: markID }).then((res: any) => {
    if (res.code == 200) {
      //处理回显 []
      selectedRowKeys.value = res.data.map((val: any) => {
        return val.channelId;
      });

      //处理历史数据
      history.value = res.data.map((val: any) => {
        return {
          channelCode: val.channelCode,
          channelId: val.channelId,
          id: val.id
        };
      });
    }
  });
};

//时间
const onChange = (value: DateRangeValue) => {
  formSearch.beginTime = value[0] as string;
  formSearch.endTime = value[1] as string;
};

//确认
const verify = () => {
  if (formSearch.activityName == '') {
    MessagePlugin.error('请填写活动名称');
    return;
  }
  if (formSearch.activityId == '') {
    MessagePlugin.error('请输入活动ID');
    return;
  }
  let newArr = checkTypeList.value.map((val: any) => {
    return {
      channelCode: val.organizationNum,
      channelId: val.id,
      id: ''
    };
  });

  for (let i = 0; i < newArr.length; i++) {
    for (let index = 0; index < history.value.length; index++) {
      if (history.value[index].channelId === newArr[i].channelId) {
        newArr[i].id = history.value[index].id;
      }
    }
  }
  let arr = history.value.map((val: any) => {
    return val.channelId;
  });
  if (JSON.stringify(arr.sort()) === JSON.stringify(selectedRowKeys.value.sort())) {
    formSearch.channels = history.value;
  } else {
    formSearch.channels = newArr;
  }
  console.log(newArr, 'newArr');

  formSearch.id = editID.value;
  //编辑
  if (editID.value) {
    updateActivityMarketing(formSearch as any).then((res: any) => {
      if (res.code == 200) {
        MessagePlugin.success('保存成功');
        router.push({
          path: '/MarketingActivity',
          query: {}
        });
      }
    });
  } else {
    addActivityMarketing(formSearch as any).then((res: any) => {
      if (res.code == 200) {
        MessagePlugin.success('保存成功');
        router.push({
          path: '/MarketingActivity',
          query: {}
        });
      }
    });
  }
};
// 获取来源
const getOrganizationList = () => {
  organization(searchLogData.value as any).then((res: any) => {
    if (res.code === 200) {
      //接口正常
      logData.value = res.data.data;
      // total.value = res.data.total || '';
      pagination.total = res.data.total;
    }
  });
};

//不能输空格
const keyupDescription = val => {
  formSearch.activityDescribe = val.replace(/[ ]/g, '');
};

//去选择
const goEdit = () => {
  searchLogData.value.pageNum = 1;

  visibleLog.value = true;
  getOrganizationList();
};
const back = () => {
  router.push({
    path: '/MarketingActivity',
    query: {}
  });
};
const checkTypeList = ref<any>([]);
const selectedRowKeys = ref<any>([]);

const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
  selectedRowKeys.value = RowKeys;
  checkTypeList.value = options.selectedRowData;
  console.log(selectedRowKeys.value, '这是用id做的分页');
  console.log(checkTypeList.value, '这是用数据过滤做的分页');
  // console.log(selectedRowKeys.value, '这是用id做的分页,回显时只要id');
  // console.log(checkTypeList.value, '这是用数据过滤做的分页,回显时第二页的数据不翻页只能请求到10条所以第一页以后有undefined，然后还要过滤完for循环拼成要的数组');
};
//分页
const pageSizeChange = (pageSize: any) => {
  searchLogData.value.pageSize = pageSize;
  searchLogData.value.pageNum = 1;
  getOrganizationList();
};
const currentChange = (current: number) => {
  searchLogData.value.pageNum = current;
  getOrganizationList();
};

//分页
const pagination = reactive<any>({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true
});
const onPageChange = debounce((pageInfo, context) => {
  console.log('page-change', pageInfo);
  if (pageInfo.pageSize != pagination.pageSize) {
    console.log('22');
    pagination.current = 1;
    searchLogData.value.pageNum = 1;
    pagination.pageSize = pageInfo.pageSize;
    searchLogData.value.pageSize = pageInfo.pageSize;
  } else {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize;
    searchLogData.value.pageSize = pageInfo.pageSize;
    searchLogData.value.pageNum = pageInfo.current;
  }
  console.log('333');
  getOrganizationList();
}, 500);

//弹框确认
const verifyModel = () => {
  visibleLog.value = false;
};
//弹框取消
const backModel = () => {
  if (editID.value) {
    getInstitutionList(editID.value);
    getOrganizationList();
  } else {
    selectedRowKeys.value = [];
  }

  visibleLog.value = false;
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
    .channel {
      display: flex;
      justify-content: center;
      align-items: center;
      .channelItem {
        font-size: 16px;
        margin-left: 10px;
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
  // ::v-deep(.t-input__wrap) {
  //   margin-left: 20px;
  // }
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
  .add-Model {
    position: relative;
    .dialog-img {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 10px;
      top: 9px;
    }
  }
}
::v-deep(.t-table thead tr) {
  background: #fafbfd;
}
::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
}
.controlsModel {
  display: flex;
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
</style>
