<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">时间范围：<t-input class="ipt-slt" clearable v-model="searchData.name" auto-width /></div>
      <div class="search-item search-item-font">收入工单：<t-input class="ipt-slt" clearable v-model="searchData.name" auto-width /></div>
      <div class="search-item search-item-font">客户姓名：<t-input class="ipt-slt" clearable v-model="searchData.name" auto-width /></div>
      <div class="search-item search-item-font">收入项目：<t-input class="ipt-slt" clearable v-model="searchData.name" auto-width /></div>
      <div class="search-item search-item-font">收入来源：<t-select class="ipt-slt" clearable v-model="searchData.proOption" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">收入金额：<t-input class="ipt-slt" clearable v-model="searchData.name" auto-width /></div>
      <div class="search-item search-item-font">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：<t-select class="ipt-slt" clearable v-model="searchData.postOption" :options="postOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="set">重置</t-button>
    </div>
    <div class="tab-box">
      <t-table :max-height="fixedTopRows ? 1400 : 320" row-key="index" :data="data" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" hover :bordered="false" table-layout="fixed"></t-table>
      <t-pagination :total="30" :pageSizeOptions="[]" :defaultPageSize="15" />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { DateRangeValue, MessagePlugin, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
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
    const fixedTopRows = ref<boolean>(false);
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
    });
    const setArrt = reactive({
      passwordShow: false,
      sexOption: [
        { label: '男', value: '1', title: '架构云选项' },
        { label: '女', value: '2' }
      ],
      addPerson: {
        personName: 'xx医院',
        sex: '1',
        passWord: '123456'
      },
      searchData: {
        name: '',
        proOption: '',
        postOption: ''
      },
      proOption: [
        { label: '全部', value: '1', title: '架构云选项' },
        { label: '启用', value: '2' },
        { label: '禁用', value: '3' }
      ],
      postOption: [
        { label: '全部', value: '1', title: '架构云选项' },
        { label: '岗位1', value: '2' },
        { label: '岗位2', value: '3' }
      ],
      data: [
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' },
        { id: 1, name: '张三', phone: '12345678910', unit: 'xx医院', position: '医生', time: '2002-02-02', auth: '1' }
      ],
      columns: [
        { colKey: 'id', title: '收入编号', align: 'center' },
        { colKey: 'name', title: '收入工单' , align: 'center'},
        { colKey: 'phone', title: '收入来源' , align: 'center'},
        { colKey: 'unit', title: '收入项目' , align: 'center'},
        { colKey: 'auth', title: '客户' , align: 'center'},
        { colKey: 'position', title: '金额', align: 'center' },
        { colKey: 'time', title: '日期', align: 'center' },
        { colKey: 'position', title: '状态', align: 'center' }
      ],
      h5Visible: false,
      addVisible: false,
      H5Url: 'https://tdesign.tencent.com/',
      options: [
        { label: '计算机学院', value: '1' },
        { label: '软件学院', value: '2' },
        { label: '物联网学院', value: '3' }
      ]
    });

    const search = () => {};
    const set = () => {};

    return {
      ...toRefs(setArrt),
      search,
      set,
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
    padding: 15px 0;
    background-color: #fff;
    margin-bottom: 16px;
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
    height: 100%;
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
