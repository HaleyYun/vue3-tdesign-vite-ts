<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">分类名称:<t-input class="ipt-slt" v-model="newSearchData.servTypeName" auto-width /></div>
      <div class="search-item search-item-font">分类状态:<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.servTypeStatus" :options="proOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" v-if="seleted <= 1" @click="addType">
          <template #icon> <AddIcon /> </template>新增</t-button
        >
        <t-button class="btn-item" theme="success" v-if="seleted > 1" @click="confServType">
          <template #icon> <EditIcon /> </template>确定选择
        </t-button>
        <t-button class="btn-item" theme="danger" v-if="seleted > 1" @click="cancels">
          <template #icon> <EditIcon /> </template>取消
        </t-button>
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="typeData?.length == 0"></load>
    <div class="tab-box" v-else>
      <!-- :selected-row-keys="selectedRowKeys" -->
      <t-table row-key="id" :max-height="fixedTopRows ? 1300 : 468" :data="typeData" hover table-layout="fixed" size="medium" :bordered="false" @select-change="rehandleSelectChange" v-model:selected-row-keys="selectedRowKeys" :columns="(columns as PrimaryTableCol<TableRowData>[])">
        <template #servTypeStatus="{ row }">
          <t-switch :value="row.servTypeStatus" :customValue="[1, 0]" @change="(value: SwitchValue) => onChange(row.id, value as number)" :key="row.id" />
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="{ row }" v-if="seleted < 3">
          <t-button size="small" variant="text" @click="edit(row.id)" theme="success">编辑</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
    <t-dialog v-model:visible="addVisible" :on-cancel="onCancel" :on-close="close" :on-confirm="onConfirmServiceType" :header="dialogTitle">
      <t-form :data="serviceData" :rules="(formRules as FormRules<Data>)">
        <t-form-item requiredMark label="分类名称" name="servTypeName">
          <t-input v-model="serviceData.servTypeName" :maxlength="4" show-limit-number :allowInputOverMax="false" placeholder="请输入分类名称" />
        </t-form-item>
        <!-- <t-form-item requiredMark label="分类排序" name="servTypeOrder">
          <t-input-number :min="0" type="number" v-model="serviceData.servTypeOrder" />
        </t-form-item> -->
        <!-- <t-form-item requiredMark label="关联商品" name="prodIdList">
          <t-space class="tag-block light tags">
            <t-tag theme="primary" variant="light" v-for="(tag, index) in serviceData.prodIdList" :key="index" :closable="tag" @close="handleClose(index)">
              {{ tag.prodName }}
            </t-tag>
            <t-button class="btn-item" theme="primary" @click="goProduct">
              <template #icon>
                <EditIcon /> </template
              >选择产品服务
            </t-button>
          </t-space>
        </t-form-item> -->
        <t-form-item requiredMark label="状态" name="servTypeName">
          <t-switch v-model="serviceData.servTypeStatus" :customValue="[1, 0]" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { MessagePlugin, FormRules, Data, SwitchValue, PrimaryTableCol, TableRowData, SelectOptions, PrimaryTableCellEventContext, Row } from 'tdesign-vue-next';
import { AddIcon, SearchIcon, EditIcon } from 'tdesign-icons-vue-next';
import { addServiceType, updateServiceType, getServiceType, queryServiceType } from '../../request/modules/ServiceApi';
import { serviceStore } from '../../store/modules/serv';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    load
  },
  setup() {
    const servStore = serviceStore();
    const router = useRouter();
    const route = useRoute();
    const setArrt = reactive({
      searchData: {
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      newSearchData: {
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: ''
      },
      serviceData: {
        createTime: '',
        createUser: '',
        id: 0,
        isDelete: 0,
        prodIdList: [] as any,
        pageNum: 1,
        pageSize: 10,
        remark: '',
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: 1,
        updateTime: '',
        updateUser: ''
      },
      dialogTitle: '',
      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      arrId: null as any,
      seleted: 1,
      formRules: {
        servTypeName: [{ required: true, message: '分类名必填', trigger: 'blur' }],
        servTypeOrder: [{ required: true, message: '显示顺序必填', trigger: 'blur' }],
        prodIdList: [{ required: true, message: '商品关联必填', trigger: 'blur' }],
        servTypeStatus: [{ required: true, message: '状态必填', trigger: 'blur' }]
      },
      id: 0,
      typeData: [],
      relaTypeList: [] as any,
      columns: [
        // {
        //     colKey: 'row-select',
        //     type: 'multiple',
        //     width: 50,
        //     checkProps: (data: any) => ({ disabled: data.row.servTypeStatus === 0 }),
        // },
        { colKey: 'id', title: '分类ID', align: 'center' },
        { colKey: 'servTypeName', title: '分类名称', align: 'center' },
        // { colKey: 'servTypeOrder', title: '分类排序' },
        {
          colKey: 'servTypeStatus',
          title: '状态',
          align: 'center',
          slots: { customRender: 'servTypeStatus' }
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
          width: '180px',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      disableIds: [],
      total: 0,
      addVisible: false,
      selectedRowKeys: [] as any
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
      if (route.query.seleted) {
        setArrt.disableIds = servStore?.channelIdList;
        let data = {
          colKey: 'row-select',
          type: 'multiple',
          width: 50,
          title: '',
          checkProps: (data: any) => ({ disabled: data.row.servTypeStatus === 0 || setArrt.disableIds.some(item => item === data.row.id) })
        };
        setArrt.columns.unshift(data as any);
        setArrt.seleted = Number(route.query.seleted);
      }
      if (servStore.serviceData?.prodIdList.length > 0) {
        setArrt.addVisible = true;
        setArrt.serviceData = JSON.parse(JSON.stringify(servStore.serviceData));
        console.log(setArrt.serviceData);
        setArrt.dialogTitle = servStore?.dialogTitle;
        getServiceTypeList();
      } else {
        getServiceTypeList();
      }
      setArrt.selectedRowKeys = servStore?.checkedData?.checkList;
    });

    onUnmounted(() => {
      // servStore.serviceData.prodIdList = [];
    });

    const handleClose = (index: any) => {
      // servStore.serviceData.prodIdList.splice(index, 1);
      // setArrt.serviceData.prodIdList.splice(index, 1);
    };

    const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
      // console.log(RowKeys)
      // console.log(options)
      setArrt.relaTypeList = options.selectedRowData;
      console.log(setArrt.relaTypeList);
    };
    const confServType = () => {
      // servStore.checkedData.checkList = [];
      setArrt.relaTypeList.forEach((el: any) => {
        servStore.channelData.relaTypeList.push({
          typeId: el.id,
          typeName: el.servTypeName
        });
      });
      router.push({
        path: '/ChannelProducts'
      });
    };
    const cancels = () => {
      servStore.checkedData.checkList = [];
      servStore.channelIdList = [];
      router.push({
        path: '/ChannelProducts'
      });
    };

    const onConfirmServiceType = () => {
      if (setArrt.serviceData.servTypeName == '') {
        MessagePlugin.error('分类名称不能为空');
        return;
      }
      if (setArrt.dialogTitle === '新建分类') {
        //新增
        addServiceType(setArrt.serviceData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            // servStore.serviceData.prodIdList = [];
            // servStore.checkedData.checkList = [];
            setArrt.addVisible = false;
            getServiceTypeList();
          }
        });
      } else {
        // 编辑分类
        let data = {
          id: setArrt.serviceData.id,
          createTime: setArrt.serviceData.createTime,
          createUser: setArrt.serviceData.createUser,
          isDelete: setArrt.serviceData.isDelete,
          prodIdList: setArrt.serviceData.prodIdList,
          remark: setArrt.serviceData.remark,
          servTypeName: setArrt.serviceData.servTypeName,
          servTypeOrder: setArrt.serviceData.servTypeOrder,
          servTypeStatus: setArrt.serviceData.servTypeStatus,
          updateTime: setArrt.serviceData.updateTime,
          updateUser: setArrt.serviceData.updateUser
        };
        updateServiceType(data).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            // servStore.serviceData.prodIdList = [];
            // servStore.checkedData.checkList = [];
            setArrt.addVisible = false;
            getServiceTypeList();
          }
        });
      }
    };

    const onChange = (id: number, status: number) => {
      let data = {
        id: id,
        servTypeStatus: status
      };
      updateServiceType(data).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
          getServiceTypeList();
        }
      });
    };

    const goProduct = () => {
      servStore.serviceData = setArrt.serviceData;
      let data = [] as any;
      setArrt.serviceData.prodIdList.forEach((item: any) => {
        data.push(item.id as number);
        servStore.checkedData.checkList = Array.from(new Set(data));
      });
      router.push({
        path: '/ServiceProducts',
        query: {
          seleted: setArrt.seleted
        }
      });
    };
    // 获取分类列表
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getServiceTypeList = () => {
      queryServiceType(setArrt.searchData as any).then((res: any) => {
        if (res.code == 200) {
          if (res.data == null || res.data.total == 0) {
            (loadStatus.value = 'noData'), (setArrt.typeData = []);
          } else {
            setArrt.typeData = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.typeData = []);
        }
      });
    };

    const rest = () => {
      setArrt.searchData = {
        pageNum: 1,
        pageSize: 10,
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: ''
      };
      setArrt.newSearchData = {
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: ''
      };
      getServiceTypeList();
    };
    const addType = () => {
      setArrt.dialogTitle = '新建分类';
      servStore.dialogTitle = '新建分类';
      setArrt.addVisible = true;
      setArrt.serviceData = {
        createTime: '',
        createUser: '',
        id: 0,
        isDelete: 0,
        prodIdList: [] as any,
        pageNum: 1,
        pageSize: 10,
        remark: '',
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: 1,
        updateTime: '',
        updateUser: ''
      };
    };
    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getServiceTypeList();
    };
    const edit = (id: number) => {
      servStore.serviceData = setArrt.serviceData;
      setArrt.dialogTitle = '编辑分类';
      servStore.dialogTitle = '编辑分类';
      setArrt.addVisible = true;
      setArrt.id = id;
      getServiceType({ id: id }).then((res: any) => {
        if (res.code === 200) {
          setArrt.serviceData = res.data;
        }
      });
    };
    const onCancel = () => {
      // servStore.serviceData.prodIdList = [];
      // servStore.checkedData.checkList = [];
      setArrt.serviceData = {
        createTime: '',
        createUser: '',
        id: 0,
        isDelete: 0,
        prodIdList: [],
        pageNum: 1,
        pageSize: 10,
        remark: '',
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: 1,
        updateTime: '',
        updateUser: ''
      };
      setArrt.addVisible = false;
    };
    const close = () => {
      // servStore.serviceData.prodIdList = [];
      // servStore.checkedData.checkList = [];
      setArrt.serviceData = {
        createTime: '',
        createUser: '',
        id: 0,
        isDelete: 0,
        prodIdList: [],
        pageNum: 1,
        pageSize: 10,
        remark: '',
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: 1,
        updateTime: '',
        updateUser: ''
      };
      setArrt.addVisible = false;
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getServiceTypeList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getServiceTypeList();
    };
    return {
      ...toRefs(setArrt),
      rehandleSelectChange,
      onConfirmServiceType,
      getServiceTypeList,
      pageSizeChange,
      currentChange,
      confServType,
      handleClose,
      goProduct,
      onChange,
      onCancel,
      addType,
      cancels,
      search,
      close,
      rest,
      edit,
      fixedTopRows,
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
</style>
