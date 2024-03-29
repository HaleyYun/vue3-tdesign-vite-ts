<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">机构名称：<t-input v-model="titleData.organName" class="ipt-slt" placeholder="请输入用户昵称" auto-width /></div>
      <div class="search-item search-item-font">
        分类：
        <t-select class="ipt-slt" v-model="titleData.type" :options="organType" placeholder="请选择分类" :keys="{ value: 'dictValue', label: 'dictLabel' }"></t-select>
      </div>
      <div class="search-item search-item-font">
        状态：
        <t-select class="ipt-slt" v-model="titleData.enable" placeholder="请选择状态">
          <t-option label="全部" value="" />
          <t-option label="开启" :value="1" />
          <t-option label="关闭" :value="0" />
        </t-select>
      </div>
      <!-- <div class="search-item search-item-font">时间排序方式:
                <t-select class="ipt-slt" v-model="searchData.sort" placeholder="请选择客户来源">
                    <t-option label="升序" value="asc" />
                    <t-option label="降序" value="desc" />
                </t-select>
            </div> -->

      <t-button class="search-item" theme="primary" @click="searchList"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="resetFilter">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" v-if="organizationLevel == 2" theme="primary" @click="goModify('add')">
          <template #icon> <AddIcon /> </template>新建
        </t-button>
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
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 450" :data="data" table-layout="fixed" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" :bordered="false">
        <template #enable="{ row }">
          {{ row.enable === 1 ? '启用' : '禁用' }}
          <!-- <t-switch :value="row.enable" :customValue="[1, 0]"
                        @change="(value: SwitchValue) => onChange(row.id, value as number)" /> -->
        </template>

        <template #action="{ row }">
          <t-button size="small" v-if="organizationLevel != 1" variant="text" theme="success" @click="goModify('edit', row.id)">编辑</t-button>
          <t-button size="small" v-else variant="text" theme="primary" @click="goModify('look', row.id)"> 查看详情</t-button>
          <!-- <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="del(row.id)">
                        <t-button size="small" variant="text" theme="danger">
                            <template #icon>
                                <DeleteIcon />
                            </template>
                            删除</t-button>
                    </t-popconfirm> -->
        </template>
      </t-table>
      <t-pagination :total="total" :defaultPageSize="searchData.pageSize" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="searchData.pageNum" />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { institutionList } from '../../request/modules/institution';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { SwitchValue, MessagePlugin, SelectValue, FormRules, Data, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { dictData } from '../../request/modules/dictData';
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
    const router = useRouter();
    const setAttr = reactive({
      organizationLevel: -1,
      searchData: {
        enable: undefined,
        organName: '',
        type: undefined,
        typeName: '',
        pageSize: 10,
        pageNum: 1,
        sort: 'desc'
      },
      titleData: {
        enable: undefined,
        organName: '',
        type: undefined,
        typeName: '',
        sort: 'desc'
      },
      total: 0,
      data: [],
      columns: [
        { colKey: 'organNum', title: '机构编码', align: 'center' },
        { colKey: 'organName', title: '机构名称', align: 'center' },
        { colKey: 'phone', title: '机构电话', align: 'center' },
        { colKey: 'type', title: '机构分类', align: 'center' },
        {
          colKey: 'enable',
          title: '状态',
          slots: { customRender: 'enable' },
          align: 'center'
        },
        { colKey: 'address', title: '机构地址', align: 'center', width: '180px' },
        { colKey: 'updateTime', title: '操作时间', width: '180px', align: 'center' },
        { colKey: 'updateUser', title: '操作人', align: 'center' },
        {
          title: '操作',
          colKey: 'action',
          fixed: 'right',
          slots: { customRender: 'action' },
          align: 'center'
        }
      ],
      organType: [
        {
          dictLabel: '医院',
          dictSort: 0,
          dictType: '',
          dictValue: '',
          id: 0,
          isDefault: '',
          status: ''
        }
      ]
    });
    const fixedTopRows = ref<boolean>(false);
    onMounted(async () => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      getDictData();
      setAttr.organizationLevel = JSON.parse(localStorage.getItem('userinfo') as string).organizationLevel;
    });
    const searchList = () => {
      setAttr.searchData = Object.assign(setAttr.searchData, setAttr.titleData);
      setAttr.searchData.pageNum = 1;
      getList();
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getList = () => {
      institutionList(setAttr.searchData).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setAttr.data = []);
          } else {
            for (let i = 0; i < res.data.data.length; i++) {
              res.data.data[i].type = handleType(res.data.data[i].type);
            }
            setAttr.data = res.data.data;
            setAttr.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setAttr.data = []);
        }
      });
    };
    const handleType = (type: number): string => {
      let index = setAttr.organType.findIndex(item => Number(item.dictValue) == type);
      if (index == -1) {
        return '--';
      }
      return setAttr.organType[index].dictLabel || '--';
    };
    const pageSizeChange = (pageSize: number) => {
      setAttr.searchData.pageSize = pageSize;
      setAttr.searchData.pageNum = 1;
      getList();
    };
    const onChange = (id: number, enable: number) => {
      console.log(enable);
    };
    const currentChange = (current: number) => {
      setAttr.searchData.pageNum = current;
      getList();
    };
    const goModify = (type: string, id: number | string = '') => {
      router.push({
        path: '/institutionModify',
        query: {
          type,
          id
        }
      });
    };
    const resetFilter = () => {
      setAttr.searchData = {
        enable: undefined,
        organName: '',
        type: undefined,
        typeName: '',
        pageSize: setAttr.searchData.pageSize,
        pageNum: 1,
        sort: 'asc'
      };
      setAttr.titleData = {
        enable: undefined,
        organName: '',
        type: undefined,
        typeName: '',
        sort: 'desc'
      };
      getList();
    };
    const getDictData = () => {
      dictData({ dictType: 'organ_type' }).then((res: any) => {
        console.log('机构分类', res);
        if (res.code === 200) {
          setAttr.organType = res.data;
          getList();
        }
      });
    };
    return {
      ...toRefs(setAttr),
      pageSizeChange,
      onChange,
      currentChange,
      goModify,
      getList,
      resetFilter,
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
      margin: 10px 15px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 230px;
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

  .operate-box {
    // margin-bottom: 8px;
    margin-left: 15px;

    .btn-item {
      margin-right: 25px;
    }
  }
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
