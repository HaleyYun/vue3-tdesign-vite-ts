<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">字典名称：<t-input class="ipt-slt" clearable v-model="titleData.dictName" auto-width /></div>
      <div class="search-item search-item-font">字典类型：<t-input class="ipt-slt" clearable v-model="titleData.dictType" auto-width /></div>
      <div class="search-item search-item-font">状态：<t-select class="ipt-slt" :options="statusOption" v-model="titleData.enable" placeholder="请选择" /></div>
      <div class="search-item search-item-font">创建时间：<t-date-range-picker allow-input clearable enable-time-picker @change="change" v-model="timeData" /></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="set">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addItem">
          <template #icon> <AddIcon /> </template>新建</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="tableData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 400" :data="tableData" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" :bordered="false" table-layout="fixed">
        <template #dictType="{ row }">
          <t-link theme="primary" hover="color" @click="rehandleClickOp(row)">
            {{ row.dictType }}
          </t-link>
        </template>
        <template #action="{ row }">
          <t-button variant="text" theme="success" size="small" @click="edit(row)"> 编辑</t-button>
        </template>
        <template #enable="{ row }">
          <span v-if="row.enable == '1'">启用</span>
          <span v-if="row.enable == '0'">禁用</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="formSearch.pageNum" />
    </div>
  </div>

  <t-dialog v-model:visible="addVisible" :on-close="close" :confirmBtn="dialogTitle == '详细信息' ? null : '确认'" :on-confirm="onConfirmAnother" :header="dialogTitle">
    <t-form :data="FormData" :rules="(formRules as FormRules<Data>)">
      <t-form-item label="字典名称" requiredMark name="roleNameCn" initial-data="TDesign">
        <t-input v-model="FormData.dataName" placeholder="请输入字典名称" :disabled="dialogTitle == '详细信息' ? true : false" :maxlength="50" />
      </t-form-item>
      <t-form-item label="字典类型" requiredMark name="roleName" initial-data="TDesign">
        <t-input v-model="FormData.dataType" placeholder="请输入字典类型" :disabled="dialogTitle == '详细信息' ? true : false" :maxlength="50" />
      </t-form-item>
      <t-form-item requiredMark label="状态" name="enable">
        <t-radio-group v-model="FormData.status" :disabled="dialogTitle == '详细信息' ? true : false">
          <t-radio :value="1">启用</t-radio>
          <t-radio :value="0">禁用</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="备注" name="tel" initial-data="123456">
        <t-textarea v-model="FormData.remark" :disabled="dialogTitle == '详细信息' ? true : false" placeholder="请输入备注" clearable :maxlength="250" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { dictList, dictAddDictType, dictUpdateUpdateDictType } from '../../request/modules/EstimateApi';
import { FormRules, Data, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RefreshIcon,
    load
  },
  setup() {
    const total = ref<any>('');
    const router = useRouter();
    const setArrt = reactive({
      dialogTitle: '',
      id: '',
      addVisible: false,
      FormData: {
        dataName: '',
        dataType: '',
        status: 0,
        remark: ''
      },
      formRules: {
        dataName: [{ required: true, message: '角色名必填', trigger: 'blur' }],
        dataType: [{ required: true, message: '权限字符必填', trigger: 'blur' }]
      },
      statusOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      timeData: [],
      searchData: {
        name: '',
        beginTime: '',
        endTime: ''
      },
      data: [{ id: 1, name: '张三', ststus: '开启', remarks: 'xx医院', time: '2002-02-02' }],
      columns: [
        { colKey: 'id', title: '字典编号', align: 'center' },
        { colKey: 'dictName', title: '字典名称', align: 'center' },
        { colKey: 'dictType', title: '字典类型', slots: { customRender: 'dictType' }, align: 'center' },
        { colKey: 'enable', title: '状态', slots: { customRender: 'enable' }, align: 'center' },
        { colKey: 'remark', title: '备注', align: 'center' },
        { colKey: 'createTime', title: '创建时间', align: 'center' },
        {
          title: '操作',
          colKey: 'action',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ]
    });

    const search = () => {
      formSearch = Object.assign(formSearch, titleData);
      formSearch.pageNum = 1;
      loadTableData();
    };
    const set = () => {
      formSearch.dictName = '';
      formSearch.enable = '';
      formSearch.endTime = '';
      formSearch.startTime = '';
      formSearch.dictType = '';
      formSearch.pageSize = 10;
      formSearch.pageNum = 1;
      setArrt.timeData = [];

      titleData.dictName = '';
      titleData.enable = '';
      titleData.endTime = '';
      titleData.startTime = '';
      titleData.dictType = '';

      loadTableData();
    };
    const change = (value: any) => {
      formSearch.startTime = value[0] as string;
      formSearch.endTime = value[1] as string;
    };

    const addItem = () => {
      setArrt.dialogTitle = '添加字典数据';
      setArrt.addVisible = true;
      setArrt.FormData = {
        dataName: '',
        dataType: '',
        status: 1,
        remark: ''
      };
    };

    const edit = (row: any) => {
      setArrt.dialogTitle = '编辑字典数据';
      setArrt.id = row.id;
      setArrt.FormData.dataName = row.dictName;
      setArrt.FormData.dataType = row.dictType;
      setArrt.FormData.status = row.enable;
      setArrt.FormData.remark = row.remark;
      setArrt.addVisible = true;
    };
    const rehandleClickOp = (val: any) => {
      router.push({
        path: '/database',
        query: {
          dictType: val.dictType
        }
      });
    };

    const onConfirmAnother = () => {
      if (setArrt.dialogTitle == '添加字典数据') {
        //新增
        let params = {
          dictName: setArrt.FormData.dataName,
          dictType: setArrt.FormData.dataType,
          enable: setArrt.FormData.status,
          remark: setArrt.FormData.remark
        };
        dictAddDictType(params as any).then((res: any) => {
          if (res.code == '200') {
            setArrt.addVisible = false;
            loadTableData();
          }
        });
      } else {
        let params = {
          id: setArrt.id,
          dictName: setArrt.FormData.dataName,
          dictType: setArrt.FormData.dataType,
          enable: setArrt.FormData.status,
          remark: setArrt.FormData.remark
        };
        //编辑
        dictUpdateUpdateDictType(params as any).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            setArrt.addVisible = false;
            loadTableData();
          }
        });
      }
    };
    const close = () => {
      setArrt.addVisible = false;
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发');
    };
    const fixedTopRows = ref<boolean>(false);
    //----- 加载列表数据 ---------
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      loadTableData();
    });
    let formSearch = reactive<any>({
      dictName: '',
      dictType: '',
      enable: '',
      endTime: '',
      pageNum: 1,
      pageSize: 10,
      startTime: ''
    });
    let titleData = reactive<any>({
      dictName: '',
      dictType: '',
      enable: '',
      endTime: '',
      startTime: ''
    });
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const tableData = ref<any>([]);
    const loadTableData = () => {
      dictList(formSearch).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (tableData.value = []);
          } else {
            tableData.value = res.data.data;
            total.value = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (tableData.value = []);
        }
      });
    };
    //分页
    const pageSizeChange = (pageSize: any) => {
      formSearch.pageSize = pageSize;
      formSearch.pageNum = 1;
      loadTableData();
    };
    const currentChange = (current: number) => {
      formSearch.pageNum = current;
      loadTableData();
    };

    return {
      ...toRefs(setArrt),
      search,
      set,
      change,
      addItem,
      onConfirmAnother,
      close,
      edit,
      rehandleClickOp,
      pageSizeChange,
      currentChange,
      loadTableData,
      formSearch,
      tableData,
      total,
      titleData,
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
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;

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
    display: flex;
    align-items: center;
    margin-left: 15px;
    border-radius: 8px;

    .search-item {
      margin-right: 25px;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 180px;
        margin-left: 5px;
      }
    }
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

  .cope-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  ::v-deep(.t-pagination__total) {
    flex: none !important;
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
