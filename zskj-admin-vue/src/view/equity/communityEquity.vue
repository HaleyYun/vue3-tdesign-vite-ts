<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">权益名称：<t-input class="ipt-slt" v-model="newSearchData.equityName" auto-width /></div>
      <div class="search-item search-item-font">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：
        <t-select class="ipt-slt" v-model="newSearchData.status" :options="proOption" placeholder="请选择"></t-select>
      </div>
      <div class="search-item search-item-font">
        生成方式：
        <t-select class="ipt-slt" v-model="newSearchData.generateType" :options="channelOptionData" placeholder="请选择"></t-select>
      </div>

      <div class="search-item search-item-font">
        权益类型：
        <t-select class="ipt-slt" v-model="newSearchData.type" :options="typeOption" placeholder="请选择权益类型"></t-select>
      </div>
      <t-button class="search-item search-item-font" theme="primary" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addProduct">推广模板</t-button>
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="qData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1800 : 425" :data="qData" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false">
        <template #status="status">
          <t-switch v-model="status.row.status" :customValue="[1, 0]" @change="(value: SwitchValue) => getResetEnable(status.row, value as number)" :key="status.row.id" />
        </template>
        <template #type="type">
          <span v-if="type.row.type == 1">线上</span>
          <span v-if="type.row.type == 2">线下</span>
        </template>
        <template #generateType="generateType">
          <span v-if="generateType.row.generateType === 1">手动生成</span>
          <span v-if="generateType.row.generateType === 2">接口生成</span>
          <span v-if="generateType.row.generateType === 3">海报生成</span>
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="{ row }">
          <t-button v-if="row.generateType === 3" size="small" variant="text" @click="selectEdit(row.id, row.havaTemplate)" theme="success">选择模板</t-button>
          <t-button size="small" variant="text" @click="details(row.id)" theme="primary">查看详情</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
  <t-dialog width="1000" :on-cancel="onCancel" v-model:visible="addVisible" :header="dialogTitle" :closeOnOverlayClick="false" showOverlay destroy-on-Close @confirm="submitExtend">
    <div>
      <div class="plate-box">
        <div class="plate-item">模板名称：<t-input class="plate-slt" placeholder="请输入模板名称" clearable v-model="newSearchLogData.templateName" auto-width /></div>
        <div class="plate-item">状态：<t-select class="plate-slt" clearable v-model="newSearchLogData.status" :options="logDataOption" placeholder="请选择"></t-select></div>
        <t-button class="plate-item search-item-font" theme="primary" @click="searchDie">搜索</t-button>
        <t-button variant="outline" theme="primary" @click="restDie">重置</t-button>
      </div>
      <div class="paginationTable" style="height: 450px">
        <div style="font-size: 18px; margin-bottom: 5px" v-if="selectedRowKeys.length != 0">
          已选择：<span style="color: red"> {{ selectedRowKeys.length }} </span>个
        </div>
        <div>
          <t-table :data="logData" row-key="id" v-model:selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange" :columns="(logColumns as PrimaryTableCol<TableRowData>[])" :bordered="false" table-layout="fixed">
            <template #templateAddress="{ row }">
              <div class="tdesign-demo-image-viewer__base">
                <t-image-viewer :images="[row.templateAddress]">
                  <template #trigger="{ open }">
                    <div class="tdesign-demo-image-viewer__ui-image">
                      <img alt="test" :src="row.templateAddress" class="tdesign-demo-image-viewer__ui-image--img" />
                      <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                        <span><BrowseIcon size="1.4em" /> 预览</span>
                      </div>
                    </div>
                  </template>
                </t-image-viewer>
              </div>
            </template>

            <template #status="{ row }">
              <t-switch v-model="row.status" :customValue="[1, 0]" disabled />
            </template>
          </t-table>
        </div>
      </div>
      <div class="paginationName">
        <t-pagination :pageSize="searchLogData.pageSize" :total="logTotal" v-model:current="searchLogData.pageNum" @page-size-change="pageLogChange" @current-change="currentLogChange" show-jumper />
      </div>
    </div>
  </t-dialog>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { AddIcon, SearchIcon, EditIcon, BooksIcon, BrowseIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, SwitchValue, TableRowData, PrimaryTableCol, SelectOptions } from 'tdesign-vue-next';
import { queryEquity, equityServiceStatus, getExtendOrder, equityTemplateBind, equityTemplate } from '../../request/modules/ServiceApi';
import load from '../../components/load/load.vue';
import { debounce } from '../../utils/tools';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    BooksIcon,
    BrowseIcon,
    load
  },
  setup() {
    const selectId = ref('');
    const productOption = ref([]);
    const router = useRouter();
    const selectedRowKeys = ref<any>([]);
    const logData = ref([]);
    const setArrt = reactive({
      texts: '',
      searchData: {
        equityName: '',
        prod: [] as any,
        status: '',
        type: '',
        usedCount: 0,
        pageNum: 1,
        pageSize: 10,
        channel: '',
        generateType: '',
        prodName: ''
      },
      newSearchData: {
        equityName: '',
        prod: [] as any,
        status: '',
        type: '',
        usedCount: 0,
        channel: '',
        generateType: '',
        prodName: ''
      },

      formData: {
        type: 1, //权益类型
        activeCount: 0,
        channel: '',
        product: '',
        generateType: '',
        equityChannelPrice: '',
        validity: undefined,
        createTime: '',
        createUser: '',
        equityName: '',
        generateCount: 0,
        isDelete: 0,
        maxGenerate: undefined,
        prod: {} as any,
        remark: '',
        status: 1,
        usedCount: 0,
        prodName: ''
      },
      relaList: [] as any,
      relationProduct: {
        id: 0,
        prodName: '',
        relaId: ''
      },
      id: 0,
      seleted: 4,
      dialogTitle: '选择推广模板',

      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1, title: '请选择' },
        { label: '禁用', value: 0 }
      ],
      typeOption: [
        { label: '全部', value: '' },
        { label: '线上', value: 1 },
        { label: '线下', value: 2 }
      ],
      channelOptionData: [
        { label: '全部', value: '' },
        { label: '手动生成', value: 1 },
        { label: '接口生成', value: 2 },
        { label: '海报生成', value: 3 }
      ],
      channelOption: [] as any,

      qData: [],
      total: 0,
      columns: [
        { colKey: 'id', title: '序号', align: 'center' },
        {
          colKey: 'type',
          title: '权益类型',
          width: '140px',
          slots: { customRender: 'type' },
          align: 'center'
        },
        { colKey: 'equityName', title: '权益名称', align: 'center', width: '230px' },
        { colKey: 'generateCount', title: '已生成数量(张)', align: 'center', width: '180px' },

        {
          colKey: 'generateType',
          title: '生成方式',
          align: 'center',
          slots: { customRender: 'generateType' }
        },
        {
          colKey: 'status',
          title: '状态',
          align: 'center',
          slots: { customRender: 'status' }
        },
        {
          colKey: 'prodName',
          title: '关联产品',
          align: 'center',
          width: '280px'
        },
        {
          colKey: 'updateUser',
          title: '操作人员',
          width: '180px',
          align: 'center'
        },
        {
          colKey: 'updateTime',
          title: '操作时间',
          width: '180px',
          align: 'center',
          slots: { customRender: 'updateTime' }
        },
        {
          title: '操作',
          colKey: 'action',
          align: 'center',
          width: '180px',
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ],
      addVisible: false,
      serviceType: '',
      //选择模板列表
      logTotal: 0,
      searchLogData: {
        pageNum: 1,
        pageSize: 5,
        equityId: selectId.value,
        templateName: '',
        status: ''
      },
      newSearchLogData: {
        templateName: '',
        status: '',
        equityId: selectId.value
      },
      logDataOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
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
      getEquityList();
    });

    //编辑

    const selectEdit = (id: any, isShow: boolean) => {
      setArrt.searchLogData.pageNum = 1;
      setArrt.searchLogData.pageSize = 5;
      setArrt.searchLogData.templateName = '';
      setArrt.searchLogData.status = '';
      setArrt.newSearchLogData.templateName = '';
      setArrt.newSearchLogData.status = '';
      setArrt.searchLogData.equityId = id;
      selectId.value = id;
      let params = {
        equityId: selectId.value
      };
      selectedRowKeys.value = [];
      getExtendList();
      setArrt.addVisible = true;
      //编辑
      if (isShow) {
        equityTemplate(params as any).then((res: any) => {
          if (res.code === 200) {
            let templateIds = res.data.map((item: any) => {
              return item.templateId;
            });
            selectedRowKeys.value = templateIds;
            console.log(selectedRowKeys.value, 'erwwe.value');
          }
        });
      } else {
        selectedRowKeys.value = [];
      }
    };
    //详情
    const details = (value: number) => {
      router.push({
        path: '/EquityServiceDetails',
        query: {
          id: value
        }
      });
    };
    // 获取权益列表
    let loadStatus = ref<string>('loading'); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getEquityList = () => {
      queryEquity(setArrt.searchData as any).then((res: any) => {
        if (res.code == 200) {
          if (res.data.total == 0) {
            (loadStatus.value = 'noData'), (setArrt.qData = []);
          } else {
            setArrt.qData = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.qData = []);
        }
      });
    };
    //新增
    const addProduct = () => {
      router.push({
        path: '/TemplateEquity'
      });
    };

    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getEquityList();
    };

    const rest = () => {
      setArrt.searchData = {
        equityName: '',
        prod: 0,
        status: '',
        type: '',
        usedCount: 0,
        pageNum: 1,
        pageSize: 10,
        channel: '',
        generateType: '',
        prodName: ''
      };
      setArrt.newSearchData = {
        equityName: '',
        prod: 0,
        status: '',
        type: '',
        usedCount: 0,
        channel: '',
        generateType: '',
        prodName: ''
      };
      getEquityList();
    };

    //分页
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getEquityList();
    };

    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getEquityList();
    };

    //编辑状态
    const getResetEnable = (val: any, proAble: Number) => {
      let params = {
        id: val.id,
        status: proAble
      };
      equityServiceStatus(params as any).then((res: any) => {
        if (res.code === 200) {
          // MessagePlugin.success('修改成功');
          getEquityList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    //确定
    const submitExtend = debounce(
      () => {
        let params = {
          equityId: selectId.value,
          templateIdList: selectedRowKeys.value
        };
        equityTemplateBind(params as any).then((res: any) => {
          if (res.code === 200) {
            setArrt.addVisible = false;
            getEquityList();
          }
        });
      },
      300,
      false
    );
    //弹窗列表分页
    const pageLogChange = (pageSize: any) => {
      setArrt.newSearchLogData.equityId = selectId.value;
      setArrt.searchLogData.equityId = selectId.value;
      setArrt.searchLogData.pageSize = pageSize;
      getExtendList();
    };
    const currentLogChange = (current: number) => {
      setArrt.newSearchLogData.equityId = selectId.value;
      setArrt.searchLogData.equityId = selectId.value;
      setArrt.searchLogData.pageNum = current;
      getExtendList();
    };
    //弹窗选中
    const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
      selectedRowKeys.value = RowKeys;
      // checkTypeList.value = options.selectedRowData;
      console.log(selectedRowKeys.value, 'selectedRowKeys');
    };
    //选中列表
    const getExtendList = () => {
      getExtendOrder(setArrt.searchLogData as any).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          logData.value = res.data.data
            ? res.data.data.map((item: any) => {
                return {
                  ...item
                };
              })
            : [];

          setArrt.logTotal = res.data.total || '';
        }
      });
    };
    const logColumns = ref([
      {
        colKey: 'row-select',
        type: 'multiple',
        width: '30px',
        checkProps: (data: any) => ({ disabled: data.row.status ? false : true })
      },
      { colKey: 'templateName', title: '模板名称', align: 'center' },
      { colKey: 'templateAddress', title: '预览效果', slots: { customRender: 'templateAddress' }, align: 'center' },

      { colKey: 'status', title: '状态', slots: { customRender: 'status' }, align: 'center' },
      { colKey: 'updateUser', title: '操作人', slots: { customRender: 'updateUser' }, align: 'center' },
      { colKey: 'updateTime', title: '操作日期', slots: { customRender: 'updateTime' }, align: 'center' }
    ]);

    //选择模板
    const searchDie = () => {
      setArrt.newSearchLogData.equityId = selectId.value;
      setArrt.searchLogData.equityId = selectId.value;
      setArrt.searchLogData = Object.assign(setArrt.searchLogData, setArrt.newSearchLogData);
      setArrt.searchLogData.pageNum = 1;
      getExtendList();
    };
    const restDie = () => {
      setArrt.newSearchLogData = {
        templateName: '',
        status: '',
        equityId: selectId.value
      };
      setArrt.searchLogData = {
        pageNum: 1,
        pageSize: 5,
        templateName: '',
        status: '',
        equityId: selectId.value
      };
      getExtendList();
    };
    const onCancel = () => {
      setArrt.newSearchLogData.equityId = '';
      setArrt.searchLogData.equityId = '';
    };
    return {
      ...toRefs(setArrt),
      rehandleSelectChange,
      logColumns,
      onCancel,
      getExtendList,
      selectedRowKeys,
      logData,
      productOption,
      fixedTopRows,
      pageSizeChange,
      currentChange,
      addProduct,
      details,
      search,
      rest,
      searchDie,
      restDie,
      selectEdit,
      getResetEnable,
      submitExtend,
      pageLogChange,
      currentLogChange,
      loadStatus,
      schedule
    };
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 15px;
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
    .btn-item {
      margin-left: 20px;
    }
  }

  .tags {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: center;
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;
  }

  .t-pagination {
    margin-top: 30px;
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
}
.paginationName {
  margin-top: 20px;
}
.paginationTable {
  overflow-y: auto;
}
::v-deep(.t-input--auto-width) {
  width: 120px;
}
.plate-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px;
  margin-bottom: 16px;
  background-color: #ffffff;

  .plate-item {
    margin: 10px 25px 10px 0;
    display: flex;
    align-items: center;
    font-size: 14px;

    .plate-slt {
      width: 210px;
      margin-left: 5px;
    }
  }
}
.tdesign-demo-image-viewer__ui-image {
  width: 100%;
  height: 100%;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  // background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
  opacity: 1;
  cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
  border-radius: 5px;
}

.tdesign-demo-image-viewer__ui-image--footer {
  padding: 0 16px;
  height: 56px;
  width: 100%;
  line-height: 56px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
  flex: 1;
}

.tdesign-demo-popup__reference {
  margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
  cursor: pointer;
}

.tdesign-demo-image-viewer__base {
  // width: 160px;
  height: 50px;
  // border: 4px solid var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
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
