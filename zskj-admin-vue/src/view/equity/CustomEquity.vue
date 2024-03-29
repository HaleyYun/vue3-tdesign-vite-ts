<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item"><span class="item-title">保单号码：</span><t-input class="ipt-slt" v-model="newSearchData.policyNumber" auto-width /></div>

      <div class="search-item"><span class="item-title">权益码：</span><t-input class="ipt-slt" v-model="newSearchData.activeCode" auto-width /></div>
      <div class="search-item"><span class="item-title">主险期限类型：</span><t-select class="ipt-slt" v-model="newSearchData.coverageType" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item"><span class="item-title">投保人ID：</span><t-input class="ipt-slt" v-model="newSearchData.applicantId" auto-width /></div>
      <div class="search-item"><span class="item-title">投保人姓名：</span><t-input class="ipt-slt" v-model="newSearchData.applicantName" auto-width /></div>
      <div class="search-item"><span class="item-title">投保人手机：</span><t-input class="ipt-slt" v-model="newSearchData.applicantPhone" auto-width /></div>
      <div class="search-item"><span class="item-title">导入批次：</span><t-input class="ipt-slt" v-model="newSearchData.importBatchCode" auto-width /></div>
      <div class="search-item"><span class="item-title">被保人ID：</span><t-input class="ipt-slt" v-model="newSearchData.insuredId" auto-width /></div>
      <div class="search-item"><span class="item-title">被保人姓名：</span><t-input class="ipt-slt" v-model="newSearchData.insuredName" auto-width /></div>
      <div class="search-item search-item-font"><span class="item-title">保单生效日期：</span><t-date-range-picker v-model="dateValue" allow-input clearable @change="onDateChange" /></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
    </div>
    <div class="operate-box">
      <div class="operate-box-left">
        <t-upload class="upload-box" :auto-upload="true" :action="uploadUrl" allowUploadDuplicateFile accept=".xls,.xlsx" :headers="setArrt.headers" v-model="files" theme="custom" @fail="handleFail" @success="succUpload">
          <t-button class="btn-item" :loading="isLoading">
            <template #icon>
              <AddIcon />
            </template>
            导入信息
          </t-button>
        </t-upload>
        <!-- <t-button class="btn-item" :loading="isLoading" v-if="!isLoading" @click="importFile">导入信息</t-button> -->
        <t-button class="btn-item" theme="success" @click="sendCode">
          <template #icon> <EditIcon /> </template>发送权益码
        </t-button>
        <t-button class="btn-item" theme="success" @click="download">
          <template #icon> <DownloadIcon /> </template>下载导入模板
        </t-button>
      </div>

      <t-button class="btn-item" theme="success" @click="linkLog">
        <template #icon> <EditIcon /> </template>操作日志
      </t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="setArrt.data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table
        :max-height="fixedTopRows ? 1400 : 274"
        :data="setArrt.data"
        row-key="id"
        :columns="(setArrt.columns as PrimaryTableCol<TableRowData>[])"
        v-model:selected-row-keys="selectedRowKeys"
        size="medium"
        hover
        table-layout="fixed"
        :bordered="false"
        select-on-row-click
        @select-change="rehandleSelectChange"
      >
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #coverageType="type">
          <span style="color: #16a56f" v-if="type.row.coverageType == '短期险'"> {{ type.row.coverageType }}</span>
          <span style="color: #3d7eff" v-if="type.row.coverageType == '长期险'"> {{ type.row.coverageType }}</span>
        </template>
        <template #activeCode="code">
          <span v-if="code.row.sendStatus == '2'">--</span>
          <span v-else>{{ code.row.activeCode }}</span>
        </template>
        <template #action="detail">
          <t-button variant="text" theme="primary" size="small" @click="goDetails(detail.row)"> 查看详情 </t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AddIcon, SearchIcon, EditIcon, FilePasteIcon, DownloadIcon } from 'tdesign-icons-vue-next';
import { DateRangeValue, MessagePlugin, PrimaryTableCol, SelectOptions, TableRowData, UploadFile } from 'tdesign-vue-next';
import { queryCustomEquity, sendIdEquity, getTemplate } from '../../request/modules/equityApi';
import { debounce } from '@/utils/tools';
import load from '../../components/load/load.vue';
const router = useRouter();
const files = ref<any>([]);
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/customerRights/uploadExcel'); //图片展示
const total = ref(0);
const isLoading = ref<boolean>(false);
const proOption = ref([
  { label: '全部', value: '' },
  { label: '长期险', value: '长期险' },
  { label: '短期险', value: '短期险' }
]);
const checkTypeList = ref<any>([]);
const dateValue = ref<any>([]);
const selectedRowKeys = ref<any>([]);
const newSearchData = ref<any>({
  policyNumber: '',
  effectiveDate: '',
  activeCode: '',
  coverageType: '',
  applicantId: '',
  applicantName: '',
  applicantPhone: '',
  importBatchCode: '',
  insuredId: '',
  insuredName: '',
  importDateBegin: '',
  importDateEnd: ''
});
const searchData = ref<any>({
  policyNumber: '',
  effectiveDate: '',
  activeCode: '',
  coverageType: '',
  applicantId: '',
  applicantName: '',
  applicantPhone: '',
  importBatchCode: '',
  insuredId: '',
  insuredName: '',
  importDateBegin: '',
  importDateEnd: '',
  pageNum: 1,
  pageSize: 10
});
const setArrt = reactive({
  headers: {
    token: ''
  },
  columns: [
    { colKey: 'row-select', type: 'multiple', width: '30px', checkProps: (data: any) => ({ disabled: data.row.sendStatus == '2' ? false : true }) },
    //1是成功导入的，2是失败的
    { colKey: 'insuranceProductsName', title: '主险产品名称', width: 320, align: 'center' },
    { colKey: 'insuranceProductsNo', title: '主险产品编号', width: '147px', align: 'center' },
    { colKey: 'servicePackageName', title: '服务包名称', width: 350, align: 'center' },
    { colKey: 'servicePackageNo', title: '服务包编码', width: '147px', align: 'center' },
    { colKey: 'serviceProjectName', title: '服务项目名称', width: '147px', align: 'center' },
    { colKey: 'serviceProjectNo', title: '项目编码', width: '147px', align: 'center' },
    { colKey: 'policyNumber', title: '保单号码', width: '167px', align: 'center' },
    { colKey: 'effectiveDate', title: '保单生效日期', width: '140px', align: 'center' },
    { colKey: 'coverageType', title: '主险期限类型', width: '140px', slots: { customRender: 'coverageType' }, align: 'center' },
    { colKey: 'applicantId', title: '投保人ID', align: 'center' },
    { colKey: 'applicantName', title: '投保人姓名', width: '140px', align: 'center' },
    { colKey: 'applicantPhone', title: '投保人手机号', width: '140px', align: 'center' },
    { colKey: 'insuredId', title: '被保人ID', align: 'center' },
    { colKey: 'insuredName', title: '被保人姓名', width: '140px', align: 'center' },
    { colKey: 'insuredPhone', title: '被保人手机号', width: '140px', align: 'center' },
    { colKey: 'importBatchCode', title: '导入批次', width: '235px', align: 'center' },
    { colKey: 'activeCode', title: '权益码', width: '180px', align: 'center', slots: { customRender: 'activeCode' } },
    { title: '操作', colKey: 'action', fixed: 'right', slots: { customRender: 'action' }, align: 'center' }
  ],
  data: []
});
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  let token = localStorage.getItem('x-auth-token');
  setArrt.headers.token = token as string;
  getCustomEquityList();
});
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const getCustomEquityList = () => {
  queryCustomEquity(searchData.value).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (setArrt.data = []);
      } else {
        setArrt.data = res.data.data;
        total.value = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (setArrt.data = []);
    }
  });
};

const sendCode = debounce(
  () => {
    sendIdEquity({ dataIdList: selectedRowKeys.value }).then((res: any) => {
      console.log(res);
      if (res.code === 200) {
        if (res.data.containFail == '0') {
          MessagePlugin.success(res.data.sendMsg);
        } else {
          MessagePlugin.error(res.data.sendMsg);
        }
        getCustomEquityList();
      }
    });
  },
  300,
  false
);
const download = () => {
  getTemplate({}).then((res: any) => {
    window.location.href = res.data;
  });
};
const linkLog = () => {
  router.push({
    path: '/OperationLog'
  });
};
const goDetails = (row: any) => {
  let personPhone = '';
  if (row.coverageType == '长期险') {
    personPhone = row.applicantPhone;
  } else if (row.coverageType == '短期险') {
    personPhone = row.applicantPhone ? row.applicantPhone : row.insuredPhone;
  }
  router.push({
    path: '/CustomEquityDetails',
    query: {
      id: row.id,
      phone: personPhone,
      prodCode: row.prodCode
    }
  });
};
const search = () => {
  searchData.value = Object.assign(searchData.value, newSearchData.value);
  searchData.value.pageNum = 1;
  getCustomEquityList();
};
const rest = () => {
  dateValue.value = [];
  newSearchData.value = {
    policyNumber: '',
    effectiveDate: '',
    activeCode: '',
    coverageType: '',
    applicantId: '',
    applicantName: '',
    applicantPhone: '',
    importBatchCode: '',
    insuredId: '',
    insuredName: '',
    beginBirthday: '',
    endBirthday: ''
  };
  searchData.value = {
    policyNumber: '',
    effectiveDate: '',
    activeCode: '',
    coverageType: '',
    applicantId: '',
    applicantName: '',
    applicantPhone: '',
    importBatchCode: '',
    insuredId: '',
    insuredName: '',
    beginBirthday: '',
    endBirthday: '',
    pageNum: 1,
    pageSize: 10
  };
  getCustomEquityList();
};
const succUpload = (file: any) => {
  console.log('000000');
  if (file.response.code == 200) {
    MessagePlugin.success(file.response.msg);
    // getCustomEquityList()
    router.push({
      path: '/OperationLog'
    });
  } else {
    MessagePlugin.error(file.response.msg);
  }
};
const beforeUpload = (file: UploadFile) => {
  // if (file.size > 5 * 1024 * 1024) {
  //     MessagePlugin.warning('上传的图片不能大于5M');
  //     return false;
  // }
  // return true;
};
const handleFail = (file: any) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};

const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
  console.log(RowKeys);
  console.log(options);
  checkTypeList.value = options.selectedRowData;
  console.log(checkTypeList.value);
};

const onDateChange = (value: DateRangeValue) => {
  newSearchData.value.importDateBegin = value[0];
  newSearchData.value.importDateEnd = value[1];
};
const pageSizeChange = (pageSize: number) => {
  searchData.value.pageSize = pageSize;
  searchData.value.pageNum = 1;
  getCustomEquityList();
};
const currentChange = (current: number) => {
  searchData.value.pageNum = current;
  getCustomEquityList();
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;

  display: flex;
  flex-direction: column;

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
        width: 250px;
        margin-left: 5px;
      }
      .item-title {
        width: 110px;
        text-align: right;
      }
    }
  }

  .operate-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 0 15px;
    .operate-box-left {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .t-icon,
      .t-icon-add {
        color: #ffffff;
      }
    }

    .btn-item {
      margin-right: 25px;
    }
  }

  .zs-log {
    width: 50px;
    height: 50px;
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 15px;
  }

  .t-pagination {
    margin-top: 30px;
  }
}

::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
}

::v-deep(.t-checkbox.t-is-disabled .t-checkbox__input) {
  background-color: #dcdce0;
}
</style>
