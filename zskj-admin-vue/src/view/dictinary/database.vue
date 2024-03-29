<template>
  <div class="user-box">
    <div class="box-img" @click="handlerRest">
      <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
      <t-button class="img-btn" theme="default" variant="text">分类列表</t-button>
    </div>

    <div class="tab-box">
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addItem">
          <template #icon> <AddIcon /> </template>新建</t-button
        >
      </div>
      <t-table row-key="index" :data="tableData" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" hover :bordered="false" table-layout="fixed">
        <template #action="{ row }">
          <t-button variant="text" theme="success" size="small" @click="edit(row)">
            <template #icon> <EditIcon /> </template>修改</t-button
          >
        </template>
        <template #enable="{ row }">
          <span v-if="row.enable == '1'">启用</span>
          <span v-if="row.enable == '0'">禁用</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" v-model:current="formSearch.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>

  <t-dialog v-model:visible="addVisible" :on-close="close" :confirmBtn="dialogTitle == '详细信息' ? null : '确认'" :on-confirm="onConfirmAnother" :header="dialogTitle">
    <t-form :data="FormData" :rules="(formRules as FormRules<Data>)">
      <t-form-item requiredMark label="分类名称" name="roleNameCn" initial-data="TDesign">
        <t-input v-model="FormData.dataName" placeholder="请输入分类名称" :disabled="dialogTitle == '详细信息' ? true : false" :maxlength="50" />
      </t-form-item>
      <t-form-item requiredMark label="数据键值" name="dictValue" initial-data="TDesign">
        <t-input v-model="FormData.dictValue" placeholder="请输入数据键值" :disabled="dialogTitle == '详细信息' ? true : false" :maxlength="50" />
      </t-form-item>
      <t-form-item requiredMark label="显示排序" name="roleName" initial-data="TDesign">
        <t-input v-model="FormData.dataType" placeholder="请输入排序" :disabled="dialogTitle == '详细信息' ? true : false" :maxlength="50" />
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
import { FormRules, Data, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { dictDataPosition, dictDataList, dictUpdateDictData } from '../../request/modules/EstimateApi';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { useRouter, useRoute } from 'vue-router';

export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RefreshIcon
  },
  setup() {
    const tableData = ref<any>([]);
    const router = useRouter();
    const route = useRoute();
    const total = ref<any>('');
    const dictData = ref<any>('');
    const setArrt = reactive({
      dialogTitle: '',
      addVisible: false,
      id: '',
      FormData: {
        dataName: '',
        dataType: '',
        dictValue: '',
        status: 0,
        remark: ''
      },
      formRules: {
        dataName: [{ required: true, message: '角色名必填', trigger: 'blur' }],
        dataType: [{ required: true, message: '权限字符必填', trigger: 'blur' }]
      },
      statusOption: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 }
      ],
      timeData: [],
      searchData: {
        name: '',
        beginTime: '',
        endTime: ''
      },
      data: [{ id: 1, name: '张三', ststus: '开启', remarks: 'xx医院', time: '2002-02-02' }],
      columns: [
        { colKey: 'id', title: '分类ID', align: 'center' },
        { colKey: 'dictLabel', title: '分类名称', align: 'center' },
        { colKey: 'dictValue', title: '数据键值', align: 'center' },
        { colKey: 'dictSort', title: '分类排序', align: 'center' },
        { colKey: 'enable', title: '状态', slots: { customRender: 'enable' }, align: 'center' },
        { colKey: 'remark', title: '备注', align: 'center' },
        { colKey: 'createTime', title: '创建时间', align: 'center', width: '180px' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' },
          align: 'center'
        }
      ]
    });

    const search = () => {};
    const set = () => {};
    const change = (value: any) => {
      console.log(value);
      setArrt.searchData.beginTime = value[0] as string;
      setArrt.searchData.endTime = value[1] as string;
      console.log(setArrt.searchData);
    };

    const addItem = () => {
      setArrt.dialogTitle = '添加字典类型';
      setArrt.addVisible = true;
      setArrt.FormData = {
        dataName: '',
        dictValue: '',
        dataType: '',
        status: 0,
        remark: ''
      };
    };

    const edit = (row: any) => {
      setArrt.dialogTitle = '编辑字典类型';
      setArrt.id = row.id;
      console.log(row, 'row');

      setArrt.FormData.dictValue = row.dictValue;
      setArrt.FormData.dataName = row.dictLabel;
      setArrt.FormData.dataType = row.dictSort.toString();
      setArrt.FormData.status = row.enable;
      setArrt.FormData.remark = row.remark;
      setArrt.addVisible = true;
    };
    const onConfirmAnother = () => {
      if (setArrt.dialogTitle == '添加字典类型') {
        //新增
        let params = {
          dictType: dictData.value,
          dictLabel: setArrt.FormData.dataName,
          dictValue: setArrt.FormData.dictValue,
          dictSort: setArrt.FormData.dataType,
          enable: setArrt.FormData.status,
          remark: setArrt.FormData.remark
        };
        dictDataPosition(params as any).then((res: any) => {
          if (res.code == '200') {
            setArrt.addVisible = false;
            loadTableData();
          }
        });
      } else {
        //编辑

        let params = {
          id: setArrt.id,
          dictType: dictData.value,
          dictLabel: setArrt.FormData.dataName,
          dictValue: setArrt.FormData.dictValue,
          dictSort: setArrt.FormData.dataType,
          enable: setArrt.FormData.status,
          remark: setArrt.FormData.remark
        };
        dictUpdateDictData(params as any).then((res: any) => {
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

    //----- 加载列表数据 ---------
    const formSearch = reactive<any>({
      dictSort: '',
      enable: '',
      dictLabel: '',
      remark: '',
      pageNum: 1,
      pageSize: 10,
      dictType: ''
    });

    const loadTableData = () => {
      dictDataList(formSearch as any).then((res: any) => {
        if (res.code == '200') {
          tableData.value = res.data.data;
          total.value = res.data.total;
        }
      });
    };
    onMounted(() => {
      if (route.query.dictType) {
        formSearch.dictType = route.query.dictType;
        dictData.value = route.query.dictType;
        loadTableData();
      }
    });
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
    const handlerRest = () => {
      router.go(-1);
    };

    return {
      ...toRefs(setArrt),
      search,
      edit,
      set,
      change,
      addItem,
      onConfirmAnother,
      handlerRest,
      close,
      dictData,
      total,
      formSearch,
      tableData,
      currentChange,
      pageSizeChange
    };
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .box-img {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .img-btn {
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 30px;
    }
  }

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
        width: 180px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    display: flex;
    align-items: center;
    // padding: 15px 0;
    // background-color: #fff;
    margin-bottom: 8px;
    border-radius: 8px;

    button {
      &:nth-child(1) {
        margin-left: 10px;
      }
    }

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
    padding: 15px;
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
