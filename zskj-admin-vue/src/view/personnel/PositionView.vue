<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">岗位名称：<t-input class="ipt-slt" clearable v-model="titleData.posName" auto-width /></div>
      <div class="search-item search-item-font">归属机构：<t-select class="ipt-slt" clearable v-model="titleData.organId" :options="organLabel" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">状态：<t-select class="ipt-slt" clearable v-model="titleData.enable" :options="postOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item search-item-font" theme="primary" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="set">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addLoad">
          <template #icon> <AddIcon /> </template>新增
        </t-button>
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 450" :data="data" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #state="{ row }">
          <t-switch v-model="row.enable" :customValue="[1, 0]" @change="(value: SwitchValue) => getResetEnable(row, value as number)" :key="row.id" />
        </template>
        <template #action="{ row }">
          <t-button size="small" variant="text" @click="addLoad(row)" theme="success">编辑</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>

    <t-dialog v-model:visible="addVisible" :header="dialogTitle" destroy-on-Close @confirm="submitForm">
      <t-form>
        <t-form-item requiredMark label="岗位名称" name="name" initial-data="TDesign">
          <t-input :maxlength="30" show-limit-number v-model="addFormData.posName" :allowInputOverMax="false" placeholder="请输入岗位名称" />
        </t-form-item>
        <t-form-item requiredMark label="归属机构" name="tel" initial-data="123456">
          <t-select v-model="addFormData.organName" :disabled="editId ? true : false" :options="organLabel" placeholder="请选择" filterable />
        </t-form-item>
        <t-form-item requiredMark label="状态" name="tel" initial-data="123456">
          <t-switch v-model="addFormData.able" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { debounce } from '../../utils/tools';
import { reactive, toRefs } from 'vue';
import { AddIcon, SearchIcon, EditIcon } from 'tdesign-icons-vue-next';
import { postList, resetQueryOrganList, positionRoleEnable, positionUpdatePosition, positionAddPosition, getOrganSelect } from '../../request/modules/employee';
import { MessagePlugin, SelectValue, SwitchValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { serialize } from 'v8';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    load
  },
  setup() {
    const total = ref<number>(0);
    const editId = ref<any>('');
    const addVisible = ref<any>(false);
    const organLabel = ref<any>([]);
    const setArrt = reactive({
      passwordShow: false,
      total: '',
      sexOption: [
        { label: '男', value: '1', title: '架构云选项' },
        { label: '女', value: '2' }
      ],
      addPerson: {
        personName: '张三',
        sex: '1',
        passWord: '123456'
      },
      searchData: {
        enable: '',
        organName: '',
        posName: '',
        pageNum: 1,
        organId: undefined,
        pageSize: 10
      },
      titleData: {
        enable: '',
        organId: '',
        posName: ''
        // organId: undefined,
      },
      dialogTitle: '',
      proOption: [
        { label: '全部', value: '1', title: '架构云选项' },
        { label: '启用', value: '2' },
        { label: '禁用', value: '3' }
      ],
      postOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      data: [],
      columns: [
        { colKey: 'serial-number', title: '序号', align: 'center' },
        { colKey: 'posName', title: '岗位名称', align: 'center' },
        { colKey: 'organName', title: '归属机构', align: 'center' },
        {
          colKey: 'state',
          title: '状态',
          slots: { customRender: 'state' },
          align: 'center'
        },
        { colKey: 'updateTime', title: '操作时间', align: 'center' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' },
          align: 'center'
        }
      ]
    });
    const addFormData = reactive<any>({
      able: '', //状态
      organId: '', //机构id
      organCode: '', //机构code
      organName: null, //机构名称
      posName: '' //岗位名称
    });

    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
      setArrt.searchData.pageNum = 1;
      console.log(setArrt.searchData);
      getPostList();
    };
    const set = () => {
      setArrt.searchData = {
        enable: '',
        organName: '',
        posName: '',
        organId: undefined,
        pageNum: 1,
        pageSize: 10
      };
      setArrt.titleData = {
        enable: '',
        organId: '',
        posName: ''
      };
      getPostList();
    };
    const edit = (row: any) => {};

    const passwordHandle = () => {};

    const onChange = () => {};
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    //岗位列表
    const getPostList = () => {
      postList(setArrt.searchData as any).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setArrt.data = []);
          } else {
            setArrt.data = res.data.data;
            total.value = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
        if (res.code === 200) {
          setArrt.data = res.data.data;
          total.value = res.data.total;
        }
      });
    };
    //初始化
    const fixedTopRows = ref<boolean>(false);
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      getPostList();
      getOrganList();
    });

    //机构
    const getOrganList = () => {
      getOrganSelect().then((res: any) => {
        if (res.code === 200) {
          organLabel.value = res.data.map((item: any) => {
            return {
              label: item.organizationName,
              value: item.id
            };
          });
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    //编辑状态
    const getResetEnable = (val: any, proAble: Number) => {
      let params = {
        id: val.id,
        enable: proAble
      };
      positionRoleEnable(params as any).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('编辑成功');
          getPostList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    //新增弹窗
    const addLoad = (val: any) => {
      console.log(val, 'val');
      editId.value = val.id;
      if (editId.value) {
        console.log('0000000');
        setArrt.dialogTitle = '编辑';
        // addFormData.organName = val.organId;
        addFormData.organName = val.organId;
        addFormData.posName = val.posName;
        addFormData.able = val.enable == 1 ? true : false;
        addVisible.value = true;
      } else {
        setArrt.dialogTitle = '新增';
        addFormData.able = true;
        addFormData.organName = '';
        addFormData.posName = '';
        addVisible.value = true;
      }
    };
    //员工新增/修改
    const submitForm = debounce(
      () => {
        let params = {
          enable: addFormData.able ? 1 : 0, //状态
          organId: addFormData.organName,
          organName: addFormData.organName, //机构名称
          organCode: '',
          posName: addFormData.posName //岗位名称
        };

        let editParams = {
          id: editId.value,
          enable: addFormData.able, //状态
          organId: addFormData.organName,
          // organName: addFormData.organName, //机构名称
          posName: addFormData.posName //岗位名称
        };
        if (setArrt.dialogTitle == '新增') {
          positionAddPosition(params as any).then((res: any) => {
            if (res.code === 200) {
              addVisible.value = false;
              getPostList();
              MessagePlugin.success('添加成功');
            } else {
              // MessagePlugin.success(res.msg);
            }
          });
        } else {
          positionUpdatePosition(editParams as any).then((res: any) => {
            if (res.code === 200) {
              addVisible.value = false;
              MessagePlugin.success('编辑成功');
              getPostList();
            }
          });
        }
      },
      300,
      false
    );
    //分页
    const pageSizeChange = (pageSize: any) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getPostList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getPostList();
    };
    return {
      ...toRefs(setArrt),
      getResetEnable,
      pageSizeChange,
      currentChange,
      onChange,
      search,
      set,
      edit,
      addLoad,
      passwordHandle,
      submitForm,
      addFormData,
      addVisible,
      editId,
      total,
      organLabel,
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
      margin: 10px 15px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 250px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    // display: flex;
    // align-items: center;
    // padding: 15px 0;
    // background-color: #fff;
    margin-left: 15px;
    // border-radius: 8px;

    button {
      &:nth-child(1) {
        // margin-left: 10px;
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
