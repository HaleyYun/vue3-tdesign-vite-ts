<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">渠道名称：<t-input class="ipt-slt" v-model="newSearchData.channelName" placeholder="请输入渠道名称" auto-width /></div>
      <div class="search-item search-item-font">渠道状态：<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.status" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">服务产品：<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.productCode" :options="serviceOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">
        产品数量：<t-input class="slt" v-model="newSearchData.prodCountMin" theme="normal" :onKeyUp="(newSearchData.prodCountMin = newSearchData.prodCountMin.replace(/[^\d]/g, ''))" auto-width /><span class="search-item-font">&nbsp;至</span>

        <t-input class="slt" v-model="newSearchData.prodCountMax" :onKeyUp="(newSearchData.prodCountMax = newSearchData.prodCountMax.replace(/[^\d]/g, ''))" theme="normal" auto-width />
      </div>
      <div class="search-item search-item-font">
        操作时间：
        <t-date-range-picker enable-time-picker allow-input clearable @change="onTimeChange" v-model="newSearchData.timeData" />
      </div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addProduct">
          <template #icon> <AddIcon /></template>新增</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="chanData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1200 : 425" :data="chanData" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed" :bordered="false">
        <template #status="{ row }">
          <t-switch :value="row.status" :customValue="[1, 0]" @change="(value: SwitchValue) => onChange(row.id, value as number)" :key="row.id" />
        </template>

        <template #productName="{ row }">
          <div @click="details(row)" class="productBox">
            {{ row.productName }}
          </div>
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="{ row }">
          <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="deleteItem(row.id)">
            <t-button variant="text" theme="danger" size="small"> 删除</t-button>
          </t-popconfirm>
          <t-button variant="text" size="small" @click="edit(row)" theme="success" ghost>编辑</t-button>
          <t-button variant="text" size="small" theme="primary" ghost @click="details(row)">查看详情</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
    <t-dialog v-model:visible="addVisible" destroy-on-Close :on-cancel="onCancel" :on-close="close" :on-confirm="onConfirmProduct" :header="dialogTitle">
      <div class="dialog-group">
        <t-radio-group v-model="channelData.selectSource" @change="selectSourceChange">
          <t-radio :value="1">渠道</t-radio>
          <t-radio :disabled="btnData" :value="2">平台</t-radio>
        </t-radio-group>
      </div>

      <t-form colon :data="channelData" :rules="(formRules as FormRules<Data>)">
        <t-form-item v-if="source == 1" requiredMark label="渠道名称" name="">
          <t-select v-model="channelData.organizationName" :options="orgData" @change="typeSelectChange" placeholder="请选择渠道名称" filterable />
        </t-form-item>

        <t-form-item requiredMark label="状态" name="status">
          <t-radio-group v-model="channelData.status">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="0">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, DateRangeValue, FormRules, Data, SelectValue, SwitchValue, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';

import { addServiceProduct, updateServiceProduct, getServiceProduct, queryServiceProduct, organization, getTypeId, deleteServiceProduct, organizationType, channelSelect, queryServicePro } from '../../request/modules/ServiceApi';
import { useRouter } from 'vue-router';
import { serviceStore } from '../../store/modules/serv';
import { dictData } from '@/request/modules/dictData';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    load
  },
  setup() {
    const source = ref<number>(1);
    const sourceId = ref<string>('');
    const sourceName = ref<string>('');
    const channelName = ref<string>('');
    const servStore = serviceStore();
    const router = useRouter();
    const setArrt = reactive({
      searchData: {
        channelName: '',
        status: '',
        productCode: '',
        prodCountMax: '',
        prodCountMin: '',
        beginTime: '',
        endTime: '',
        timeData: [],
        pageNum: 1,
        pageSize: 10
      },
      newSearchData: {
        channelName: '',
        status: '',
        productCode: '',
        prodCountMax: '',
        prodCountMin: '',
        beginTime: '',
        endTime: '',
        timeData: []
      },
      channelData: {
        channelName: '',
        selectSource: 1,
        channelType: 0,
        createTime: '',
        createUser: '',
        organizationName: '',
        id: 0,
        isDelete: 0,
        pageNum: 1,
        pageSize: 10,
        prodCount: 0,
        remark: '',
        status: 1,
        relaChannelList: [] as any,
        // relaTypeList: [] as any,
        updateTime: '',
        updateUser: '',
        showPort: '',
        showPortName: ''
        // showPortList: ''
      },
      dialogTitle: '选择',
      total: 0,
      seleted: 3,
      formRules: {
        relaChannelList: [{ required: true, message: '渠道名必填', trigger: 'blur' }],
        relaIdList: [{ required: true, message: '关联产品必填', trigger: 'blur' }],
        showPortData: [{ required: true, message: '产品展示必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'blur' }]
      },
      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      chanData: [],
      columns: [
        { colKey: 'serial-number', width: 80, title: '序号', align: 'center' },
        { colKey: 'channelName', title: '渠道名称', align: 'center' },
        { colKey: 'productName', title: '服务产品', align: 'center', width: '160px', slots: { customRender: 'productName' } },
        {
          colKey: 'relaProductNum',
          title: '产品数量',
          align: 'center'
        },
        {
          colKey: 'status',
          title: '状态',
          slots: { customRender: 'status' },
          align: 'center'
        },
        {
          colKey: 'updateTime',
          title: '操作时间',
          slots: { customRender: 'updateTime' },
          align: 'center'
        },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' },
          align: 'center'
        }
      ],
      addVisible: false,
      btnDisable: false,
      orgData: [] as any,

      channelIdList: [] as any,
      showPortData: [{ dictLabel: '', dictValue: '' }]
    });
    const serviceOption = ref<any>([]);

    const btnData = ref<any>('');
    const fixedTopRows = ref<boolean>(false);
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      if (servStore.channelData?.relaTypeList.length > 0) {
        setArrt.addVisible = true;
        setArrt.channelData = JSON.parse(JSON.stringify(servStore.channelData));
        // setArrt.dialogTitle = servStore.dialogTitle;
        getChannelList();
        getOrganizationList();
        getDictData();
        getServicePro();
      } else {
        getChannelList();
        getOrganizationList();
        getDictData();
        getServicePro();
      }
    });

    onUnmounted(() => {
      // servStore.channelData.relaTypeList = [];
    });

    // 获取产品展示渠道字典
    const getDictData = () => {
      dictData({ dictType: 'show_port' }).then((res: any) => {
        if (res.code === 200) {
          setArrt.showPortData = res.data;
        }
      });
    };

    const deleteItem = (id: number) => {
      deleteServiceProduct({ id }).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('删除成功');
          getChannelList();
          getOrganizationList();
        }
      });
    };

    const onChange = (id: number, num: number) => {
      let data = {
        id: id,
        status: num
      };
      updateServiceProduct(data).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
          getChannelList();
        }
      });
    };

    // 获取渠道产品
    let loadStatus = ref<string>('loading'); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getChannelList = () => {
      queryServiceProduct(setArrt.searchData as any).then((res: any) => {
        if (res.code == 200) {
          if (res.data.data == '' || res.data.total == null) {
            (loadStatus.value = 'noData'), (setArrt.chanData = []);
          } else {
            setArrt.showPortData.forEach((el: any) => {
              res.data.data.find((item: any, index: number) => {
                if (item.showPort === el.dictValue) {
                  res.data.data[index].showPortName = el.dictLabel;
                }
              });
            });
            setArrt.chanData = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.chanData = []);
        }
      });
    };
    // 获取渠道
    const getOrganizationList = () => {
      let data = {
        pageNum: 1,
        pageSize: 999
      };
      channelSelect(data).then((res: any) => {
        if (res.code === 200) {
          setArrt.orgData = res.data.data.map((item: any) => {
            return {
              label: item.organizationName,
              value: item.organizationNum,
              disabled: item.choosed
            };
          });
        }
      });
    };

    const typeSelectChange = (value: any, context: any) => {
      sourceId.value = value;
      sourceName.value = context.selectedOptions[0].label;
    };
    const selectSourceChange = (val: any) => {
      source.value = val;
      console.log(val);
    };

    // 获取已关联id list
    const getTypeIdList = (val: number) => {
      getTypeId({ channelId: val }).then((res: any) => {
        if (res.code === 200) {
          setArrt.channelIdList = res.data;
          servStore.channelIdList = setArrt.channelIdList;
          setArrt.btnDisable = false;
        }
      });
    };

    const onSearch = () => {
      setArrt.orgData = setArrt.orgData.filter((item: any) => {
        item.label.indexOf(setArrt.orgData) !== -1;
      });
    };

    const onConfirmProduct = () => {
      if (source.value == 1) {
        if (sourceId.value && setArrt.channelData.organizationName != '') {
          router.push({
            path: '/serviceNewProduct',
            query: {
              posName: sourceId.value, //渠道名
              source: source.value, //渠道或者平台
              status: setArrt.channelData.status, //渠道或者平台
              rowName: sourceName.value //渠道或者平台
            }
          });
          getOrganizationList();
        } else {
          MessagePlugin.error('请先选择渠道名称');
        }
      } else {
        console.log(source.value);

        if (btnData.value) {
          MessagePlugin.error('平台已有关联产品');
        } else {
          router.push({
            path: '/serviceNewProduct',
            query: {
              posName: sourceId.value, //渠道名
              source: source.value, //渠道或者平台
              status: setArrt.channelData.status, //渠道或者平台
              rowName: sourceName.value //渠道或者平台
            }
          });
        }
      }
    };

    const channelProduct = () => {
      organizationType({}).then((res: any) => {
        if (res.code === 200) {
          btnData.value = res.data.platformIsRelation;
        }
      });
    };
    const addProduct = () => {
      setArrt.channelData.organizationName = '';
      setArrt.channelData.selectSource = 1;
      setArrt.channelData.status = 1;
      source.value = 1;
      channelProduct();
      setArrt.addVisible = true;
    };
    //编辑
    const edit = (value: any) => {
      router.push({
        path: '/serviceNewProduct',
        query: {
          posId: value.id, //渠道id
          source: source.value, //渠道或者平台
          posName: value.channelCode || '', //渠道名
          status: setArrt.channelData.status, //渠道或者平台
          newName: value.channelName,
          type: value.type //渠道或者平台
        }
      });
    };
    //详情

    const details = (value: any) => {
      router.push({
        path: '/serviceNewProduct',
        query: {
          posId: value.id, //渠道id
          source: source.value, //渠道或者平台
          posName: value.channelCode || '', //渠道名
          status: setArrt.channelData.status, //渠道或者平台
          rowName: sourceName.value, //渠道或者平台
          details: 'details',
          type: value.type
        }
      });
    };
    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getChannelList();
    };
    const rest = () => {
      setArrt.searchData = {
        channelName: '',
        status: '',
        productCode: '',
        prodCountMax: '',
        prodCountMin: '',
        beginTime: '',
        endTime: '',
        timeData: [],
        pageNum: 1,
        pageSize: 10
      };
      setArrt.newSearchData = {
        channelName: '',
        status: '',
        productCode: '',
        prodCountMax: '',
        prodCountMin: '',
        beginTime: '',
        endTime: '',
        timeData: []
      };
      getChannelList();
    };

    const onCancel = () => {
      // servStore.channelData.relaTypeList = [];
      // servStore.checkedData.checkList = [];
      // servStore.channelIdList = [];
      setArrt.addVisible = false;
    };
    const close = () => {
      // servStore.channelData.relaTypeList = [];
      // servStore.checkedData.checkList = [];
      // servStore.channelIdList = [];
      setArrt.addVisible = false;
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getChannelList();
    };

    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getChannelList();
    };
    // 产品分类
    const getServicePro = () => {
      let data = {
        prodName: '',
        prodCode: '',
        serviceType: '',
        prodStatus: undefined,
        pageNum: 1,
        pageSize: 99,
        typeId: ''
      };
      queryServicePro(data).then((res: any) => {
        if (res.code === 200) {
          serviceOption.value = res.data.data.map((item: any) => {
            return {
              label: item.prodName,
              value: item.prodCode
            };
          });
        }
      });
    };
    const onTimeChange = (value: DateRangeValue) => {
      setArrt.newSearchData.beginTime = value[0] as string;
      setArrt.newSearchData.endTime = value[1] as string;
    };
    return {
      ...toRefs(setArrt),
      onConfirmProduct,
      typeSelectChange,
      selectSourceChange,
      // portSelectChange,
      pageSizeChange,
      currentChange,
      // handleClose,
      addProduct,
      deleteItem,
      onTimeChange,
      // goProduct,
      onChange,
      onCancel,
      onSearch,
      search,
      close,
      edit,
      rest,
      details,
      btnData,
      serviceOption,
      source,
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
  overflow-y: auto;
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
      .slt {
        width: 127px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    .btn-item {
      margin-left: 20px;
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;
    .productBox {
      width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #3476ff;
    }
  }

  .tags {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: center;
  }

  .t-pagination {
    margin-top: 30px;
  }
  .dialog-group {
    padding: 20px 30px;
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
</style>
