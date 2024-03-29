<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font"><span class="item-title">客户昵称：</span> <t-input class="ipt-slt" v-model="titleData.nickname" auto-width /></div>
      <div class="search-item search-item-font"><span class="item-title">手机号：</span><t-input class="ipt-slt" v-model="titleData.phone" auto-width /></div>
      <div class="search-item search-item-font"><span class="item-title"> 客户性别：</span><t-select class="ipt-slt" v-model="titleData.gender" :options="sexOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font"><span class="item-title">所在地：</span><t-input class="ipt-slt" v-model="titleData.city" placeholder="请选择" /></div>
      <div class="search-item search-item-font"><span class="item-title">出生日期：</span><t-date-range-picker v-model="dateValue" allow-input clearable @change="onChange" /></div>
      <t-button class="search-item" theme="primary" @click="searchList">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="resetFilter">重置</t-button>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>

    <div v-else class="tab-box">
      <t-table row-key="index" :max-height="fixedTopRows ? 1200 : 420" :style="{}" :bordered="false" :data="data" table-layout="fixed" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium">
        <template #action="{ row }">
          <div class="action">
            <t-button size="small" variant="text" @click="lookDetaile(row.id, row.phone)" theme="primary"> 查看详情</t-button>
          </div>
        </template>
      </t-table>
      <t-pagination :total="total" :defaultPageSize="searchData.pageSize" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="searchData.pageNum" />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { getWechatUserPageList } from '../../request/modules/CustomApi';
import Load from '../../components/load/load.vue';

export default {
  setup() {
    const router = useRouter();
    const setArrt = reactive({
      searchData: {
        beginBirthday: '',
        endBirthday: '',
        city: '',
        country: '',
        gender: '',
        nickname: '',
        pageNum: 1,
        pageSize: 10,
        phone: '',
        province: ''
      },
      titleData: {
        beginBirthday: '',
        endBirthday: '',
        city: '',
        country: '',
        gender: '',
        nickname: '',
        phone: '',
        province: ''
      },
      dateValue: [],
      total: 0,
      sexOption: [
        { label: '全部', value: '' },
        { label: '男', value: '1' },
        { label: '女', value: '2' },
        { label: '未知', value: '0' }
      ],
      data: [],
      columns: [
        { colKey: 'nickname', title: '微信昵称', align: 'center' },
        { colKey: 'gender', title: '性别', align: 'center' },
        { colKey: 'birthday', title: '出生日期', align: 'center' },
        { colKey: 'city', title: '所在地', align: 'center' },
        { colKey: 'phone', title: '联系方式', align: 'center' },
        {
          title: '操作',
          colKey: 'action',
          align: 'center',
          width: '140px',
          fixed: 'right',
          slots: { customRender: 'action' }
        }
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
      getList();
    });
    const getDictData = () => {};
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getList = () => {
      getWechatUserPageList(setArrt.searchData as any).then((res: any) => {
        if (res.code === 200) {
          if (res.data == null || res.data.total == 0) {
            (loadStatus.value = 'noData'), (setArrt.data = []);
          } else {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].gender === 1) {
                res.data.data[i].gender = '男';
              } else if (res.data.data[i].gender === 2) {
                res.data.data[i].gender = '女';
              } else {
                res.data.data[i].gender = '未知';
              }
            }
            setArrt.data = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
      });
    };
    const onChange = (value: DateRangeValue) => {
      setArrt.titleData.beginBirthday = value[0] as string;
      setArrt.titleData.endBirthday = value[1] as string;
    };
    const lookDetaile = (id: string | number, phone: string | number) => {
      router.push({ path: '/weChatDetails', query: { id, phone } });
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getList();
    };
    const resetFilter = () => {
      setArrt.searchData = {
        beginBirthday: '',
        endBirthday: '',
        city: '',
        country: '',
        gender: '',
        nickname: '',
        pageNum: 1,
        pageSize: 10,
        phone: '',
        province: ''
      };
      setArrt.titleData = {
        beginBirthday: '',
        endBirthday: '',
        city: '',
        country: '',
        gender: '',
        nickname: '',
        phone: '',
        province: ''
      };
      setArrt.dateValue = [];
      getList();
    };
    const searchList = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
      setArrt.searchData.pageNum = 1;
      getList();
    };
    return {
      ...toRefs(setArrt),
      onChange,
      lookDetaile,
      pageSizeChange,
      currentChange,
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
    background-color: #ffffff;
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 280px;
        margin-left: 5px;
      }
      .item-title {
        width: 70px;
        text-align: right;
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
    margin-top: 20px;
  }

  ::v-deep(.t-pagination__total) {
    flex: none !important;
  }
  ::v-deep(.t-table__th-cell-inner) {
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #222222;
    line-height: 22px;
  }
  ::v-deep(.t-date-range-picker) {
    width: 280px !important;
    margin-left: 5px !important;
  }
  ::v-deep(.t-table thead tr) {
    background: #fafbfd;
  }
}
</style>
