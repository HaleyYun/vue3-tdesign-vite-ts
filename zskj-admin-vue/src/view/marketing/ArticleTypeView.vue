<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">分类名称：<t-input class="ipt-slt" v-model="newSearchData.categoryName" auto-width /></div>
      <div class="search-item search-item-font">状态：<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.status" :options="proOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addItem">
          <template #icon> <AddIcon /> </template>新建</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 470" :data="data" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed" :bordered="false">
        <template #status="{ row }">
          <t-switch :value="row.status" :customValue="[1, 2]" @change="(value: SwitchValue) => onChange(row, value as number)" :key="row.id" />
        </template>
        <template #action="{ row }">
          <t-button size="small" variant="text" @click="edit(row)" theme="success">编辑</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>

    <t-dialog v-model:visible="addVisible" :on-cancel="onCancel" :on-close="close" :on-confirm="onConfirmArticleType" :header="dialogTitle">
      <t-form :data="FormData" :rules="(formRules as FormRules<Data>)">
        <t-form-item requiredMark label="分类名称" name="categoryName" initial-data="TDesign">
          <t-input v-model="FormData.categoryName" :maxlength="4" show-limit-number :allowInputOverMax="false" placeholder="请输入分类名称" />
        </t-form-item>
        <t-form-item requiredMark label="分类排序" name="sort" initial-data="123456">
          <t-input-number :min="0" type="number" v-model="FormData.sort" placeholder="请输入分类名称" />
        </t-form-item>
        <t-form-item requiredMark label="状态" name="status" initial-data="123456">
          <t-radio-group v-model="FormData.status">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="2">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { SwitchValue, FormRules, Data, MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { EditIcon, AddIcon } from 'tdesign-icons-vue-next';
import { addArticleType, queryArticleType, updateArticleType } from '../../request/modules/MarketApi';
import load from '../../components/load/load.vue';
export default {
  components: {
    EditIcon,
    load,
    AddIcon
  },
  setup() {
    const setArrt = reactive({
      searchData: {
        categoryName: '',
        status: 0,
        pageSize: 10,
        pageNum: 1,
        statusList: []
      },
      newSearchData: {
        categoryName: '',
        status: 0,
        statusList: []
      },
      proOption: [
        { label: '全部', value: 0 },
        { label: '启用', value: 1 },
        { label: '禁用', value: 2 }
      ],
      id: 0,
      FormData: {
        categoryName: '',
        status: 1,
        sort: 0
      },
      formRules: {
        categoryName: [{ required: true, message: '分类名必填', trigger: 'blur' }],
        sort: [{ required: true, message: '显示顺序必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'blur' }]
      },
      total: 0,
      data: [],
      dialogTitle: '',
      columns: [
        { colKey: 'sort', title: '排序', align: 'center' },
        { colKey: 'categoryName', title: '分类名称', align: 'center' },
        {
          colKey: 'status',
          title: '状态',
          align: 'center',
          slots: { customRender: 'status' }
        },
        { colKey: 'updateTime', title: '操作时间', align: 'center', width: '180px' },
        {
          title: '操作',
          width: '180px',
          colKey: 'action',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      addVisible: false
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
      getArticleTypeList();
    });

    // 获取分类列表
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getArticleTypeList = () => {
      queryArticleType(setArrt.searchData).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setArrt.data = []);
          } else {
            setArrt.data = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
      });
    };

    const edit = (value: any) => {
      setArrt.dialogTitle = '编辑分类';
      setArrt.addVisible = true;
      setArrt.id = value.id;
      setArrt.FormData = {
        categoryName: value.categoryName,
        sort: value.sort,
        status: value.status
      };
    };

    const onConfirmArticleType = () => {
      if (setArrt.dialogTitle === '新建分类') {
        //新增
        addArticleType(setArrt.FormData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            setArrt.addVisible = false;
            getArticleTypeList();
          }
        });
      } else {
        // 编辑分类
        let data = {
          id: setArrt.id,
          categoryName: setArrt.FormData.categoryName,
          status: setArrt.FormData.status,
          sort: setArrt.FormData.sort
        };
        updateArticleType(data).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            setArrt.addVisible = false;
            getArticleTypeList();
          } else {
            MessagePlugin.warning(res.msg);
          }
        });
      }
    };

    const search = () => {
      setArrt.searchData.statusList = [];
      if (setArrt.searchData.status !== 0) {
        let arr: number[] = [];
        arr.push(setArrt.searchData.status);
        setArrt.searchData.statusList = arr as never[];
      } else {
        setArrt.searchData.statusList = [];
      }

      setArrt.newSearchData.statusList = [];
      if (setArrt.newSearchData.status !== 0) {
        let arr: number[] = [];
        arr.push(setArrt.newSearchData.status);
        setArrt.newSearchData.statusList = arr as never[];
      } else {
        setArrt.newSearchData.statusList = [];
      }
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      getArticleTypeList();
    };

    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getArticleTypeList();
    };

    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getArticleTypeList();
    };

    const onChange = (row: any, status: number) => {
      row.status = status;
      updateArticleType(row).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
          getArticleTypeList();
        }
      });
    };

    const rest = () => {
      setArrt.searchData = {
        categoryName: '',
        status: 0,
        pageNum: 1,
        pageSize: 10,
        statusList: []
      };
      setArrt.newSearchData = {
        categoryName: '',
        status: 0,
        statusList: []
      };
      getArticleTypeList();
    };

    const addItem = () => {
      setArrt.dialogTitle = '新建分类';
      setArrt.addVisible = true;
      setArrt.FormData = {
        categoryName: '',
        status: 1,
        sort: 0
      };
    };
    const onCancel = () => {
      setArrt.addVisible = false;
    };
    const close = () => {
      setArrt.addVisible = false;
    };

    return {
      ...toRefs(setArrt),
      onConfirmArticleType,
      search,
      rest,
      getArticleTypeList,
      pageSizeChange,
      currentChange,
      onChange,
      edit,
      addItem,
      onCancel,
      close,
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
    }
  }

  .operate-box {
    .btn-item {
      margin-left: 20px;
    }
  }

  // ::v-deep(.t-table--striped:not(.t-table--header-fixed) tbody>tr:nth-of-type(odd):not(.t-table__expanded-row)) {
  //     background-color: #FFFFFF;
  // }

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
