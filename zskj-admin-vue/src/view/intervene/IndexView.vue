<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" v-model="titleData.customerName" placeholder="请输入用户昵称" auto-width /></div>
      <div class="search-item search-item-font">联系电话：<t-input class="ipt-slt" v-model="titleData.contactNumber" placeholder="请输入手机号" auto-width /></div>
      <div class="search-item search-item-font">服务来源：<t-cascader class="ipt-slt" v-model="titleData.customerSource" clearable :show-all-levels="false" :options="organOption" check-strictly></t-cascader></div>
      <div class="search-item search-item-font">干预周期：<t-date-range-picker v-model="timeList" allow-input clearable @change="dateChange" /></div>

      <t-button class="search-item" theme="primary" @click="searchList">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="resetting">重置</t-button>
    </div>

    <!-- <t-tabs v-model="searchData.status" @change="tabsChange" style="width: 100%">
      <t-tab-panel :value="item.id" v-for="(item, index) in tabList" :label="item.title" :destroy-on-hide="false" :key="index"></t-tab-panel>
    </t-tabs> -->
    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <div class="tabs-box">
        <t-tabs v-model="searchData.status" :list="tabList" @change="tabsChange" />
      </div>
      <div class="operate-box">
        <t-button v-if="searchData.status === 'UN_APPROVAL'" class="btn-item" theme="primary" @click="traverseApprove"> 通过审核 </t-button>
        <!-- <t-button class="btn-item" theme="success" disabled>
                          <template #icon>
                              <EditIcon />
                          </template>修改
                      </t-button>
                      <t-button class="btn-item" theme="danger" disabled>
                          <template #icon>
                              <DeleteIcon />
                          </template>删除
                      </t-button>
                      <t-button class="btn-item" theme="warning" disabled>
                          <template #icon>
                              <DownloadIcon />
                          </template>导出
                      </t-button> -->
      </div>
      <t-table style="width: 100%" row-key="id" :data="tableData" table-layout="fixed" hover :bordered="false" tableContentWidth="1800px" :columns="(columns as PrimaryTableCol<TableRowData>[])" :max-height="fixedTopRows ? 1400 : 362" @select-change="rehandleSelectChange">
        <template #cycle="{ row }"> {{ row.interventionStart }} 至 {{ row.interventionEnd }} </template>
        <template #action="{ row }">
          <t-button size="small" variant="text" theme="primary" @click="goDetails(row, 'look')">干预详情</t-button>
          <!-- <t-button size="small" variant="text" theme="success"
                              @click="goDetails(row, 'edit', row.interventionOrderStatus)">
                              <template #icon>
                                  <EditIcon />
                              </template>
                              修改</t-button> -->
        </template>
      </t-table>
      <t-pagination :total="total" :defaultPageSize="searchData.pageSize" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="searchData.pageNum" />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { DateRangeValue, PrimaryTableCol, TableRowData, TabValue, MessagePlugin, TScroll } from 'tdesign-vue-next';
import { intervenList, batchApprove } from '../../request/modules/intervene';
import { getOrganMultiSelect } from '../../request/modules/institution';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RefreshIcon,
    FilePasteIcon,
    load
  },
  setup() {
    const setAttr = reactive({
      searchData: {
        customerName: '',
        contactNumber: '',
        customerSource: '',
        interventionStart: '',
        interventionEnd: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      },
      titleData: {
        customerName: '',
        contactNumber: '',
        customerSource: '',
        interventionStart: '',
        interventionEnd: '',
        status: ''
      },
      tabList: [
        { label: '全部', value: '' },
        { label: '待审核', value: 'UN_APPROVAL' },
        { label: '待开始', value: 'UN_START' },
        { label: '训练中', value: 'TRAINING' },
        { label: '快到期', value: 'TO_EXPIRED' },
        { label: '已到期', value: 'EXPIRED' }
      ],
      organOption: [{ label: '', value: '', children: [] }],
      tableData: [],
      columns: [
        { colKey: 'row-select', type: 'multiple', width: 50, fixed: 'left' },
        { colKey: 'interventionOrderNumber', width: 130, title: '干预单号', align: 'center' },
        { colKey: 'customerName', width: 70, title: '客户', align: 'center' },
        { colKey: 'contactNumber', width: 100, title: '联系电话', align: 'center' },
        { colKey: 'screeningServiceName', width: 120, align: 'center', title: '关联服务' },
        { colKey: 'cycle', title: '干预周期', width: 200, slots: { customRender: 'cycle' }, align: 'center' },
        { colKey: 'totalTrainingDays', width: 100, title: '训练天数', align: 'center' },
        { colKey: 'interventionOrderStatusName', width: 100, title: '状态', align: 'center' },
        { colKey: 'makerName', width: 70, title: '制定人', align: 'center' },
        { colKey: 'interventionSourceName', width: 100, title: '干预来源', align: 'center' },
        { colKey: 'updateTime', width: 140, title: '操作时间', align: 'center' },
        { colKey: 'action', title: '操作', width: 140, fixed: 'right', slots: { customRender: 'action' }, align: 'center' }
      ],
      total: 0,
      approveIds: [],
      timeList: []
    });
    const router = useRouter();
    const fixedTopRows = ref<boolean>(false);
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      getList();
      getSelectList();
    });
    const dateChange = (value: DateRangeValue) => {
      setAttr.titleData.interventionStart = value[0] as string;
      setAttr.titleData.interventionEnd = value[1] as string;
    };
    const rehandleSelectChange = (value: Array<string | number>) => {
      console.log(value);
      setAttr.approveIds = value as never[];
    };
    const pageSizeChange = (pageSize: number) => {
      setAttr.searchData.pageSize = pageSize;
      setAttr.searchData.pageNum = 1;
      getList();
    };
    const currentChange = (current: number) => {
      setAttr.searchData.pageNum = current;
      getList();
    };
    const searchList = () => {
      setAttr.searchData = Object.assign(setAttr.searchData, setAttr.titleData);
      setAttr.searchData.pageNum = 1;
      getList();
    };
    const resetting = () => {
      setAttr.timeList = [];
      setAttr.searchData = {
        customerName: '',
        contactNumber: '',
        customerSource: '',
        interventionStart: '',
        interventionEnd: '',
        pageSize: setAttr.searchData.pageSize,
        status: '',
        pageNum: 1
      };
      setAttr.titleData = {
        customerName: '',
        contactNumber: '',
        customerSource: '',
        interventionStart: '',
        interventionEnd: '',
        status: ''
      };
      getList();
    };
    const tabsChange = (value: TabValue) => {
      setAttr.searchData.status = value as string;
      setAttr.searchData.pageSize = 10;
      setAttr.searchData.pageNum = 1;
      getList();
    };
    const traverseApprove = () => {
      if (setAttr.approveIds.length === 0) {
        MessagePlugin.warning('请选择需要审核的数据');
      } else {
        batchApprove({ id: setAttr.approveIds }).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success('操作成功');
            getList();
          }
        });
      }
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getList = () => {
      intervenList(setAttr.searchData).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setAttr.tableData = []);
          } else {
            setAttr.tableData = res.data.data;
            setAttr.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setAttr.tableData = []);
        }
      });
    };
    const goDetails = (val, type: string, status?: string) => {
      router.push({
        path: '/interveneDetails',
        query: {
          id: val.id,
          OrderNumber: val.interventionOrderNumber,
          type,
          status
        }
      });
    };
    const getSelectList = () => {
      getOrganMultiSelect().then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          setAttr.organOption = res.data;
        }
      });
    };
    return {
      ...toRefs(setAttr),
      dateChange,
      rehandleSelectChange,
      pageSizeChange,
      currentChange,
      resetting,
      tabsChange,
      traverseApprove,
      goDetails,
      getList,
      searchList,
      loadStatus,
      schedule,
      fixedTopRows
    };
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;
    background-color: #ffffff;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 280px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    width: 100%;
    margin: 8px 0;

    .btn-item {
      margin-right: 25px;
    }
  }
}
.tabs-box {
  height: 48px;
}
.tab-box {
  overflow-y: auto;
  background-color: #ffffff;
  padding: 15px;
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
</style>
