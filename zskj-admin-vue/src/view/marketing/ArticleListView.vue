<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">文章主题:<t-input class="ipt-slt" clearable v-model="newFormData.theme" auto-width /></div>
      <div class="search-item search-item-font">文章状态:<t-select class="ipt-slt" clearable @clear="rest" v-model="newFormData.status" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">
        文章分类:
        <t-select class="ipt-slt" v-model="newFormData.articleTypeList[0]" @clear="rest" @change="typeSelectChange">
          <t-option v-for="(item, index) in typeSelectList" :key="index" :label="item.categoryName" :value="item.id" />
        </t-select>
      </div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="handleChange">
          <template #icon> <AddIcon /> </template>新增</t-button
        >
      </div>
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="dataList?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 474" :data="dataList" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed" :bordered="false">
        <template #articleType="{ row }">
          <span>{{ row.categoryName }}</span>
        </template>
        <template #recommend="{ row }">
          <span>{{ row.recommend == 1 ? '是' : '否' }}</span>
        </template>
        <template #status="{ row }">
          <span>{{ row.status == 1 ? '启用' : '禁用' }}</span>
        </template>
        <template #action="{ row }">
          <t-button variant="text" theme="success" size="small" class="btn-c-blue" @click.stop="edit(row.id)">编辑</t-button>
          <t-button variant="text" theme="primary" size="small" class="btn-c-blue" @click.stop="details(row.id)">查看详情</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="formData.pageSize" v-model:current="formData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { DateRangeValue, MessagePlugin, SelectValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { useRouter, useRoute } from 'vue-router';
import { AddIcon, DeleteIcon, SearchIcon, EditIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { queryArticleList, queryArticleType } from '@/request/modules/MarketApi';
import load from '../../components/load/load.vue';
import { marketingStore } from '../../store/modules/marketing';

export default {
  components: {
    AddIcon,
    DeleteIcon,
    SearchIcon,
    EditIcon,
    FilePasteIcon,
    load
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const marketing = marketingStore();
    marketing.formData = {
      theme: '',
      topped: 1,
      pageNum: 1,
      pageSize: 10,
      status: 0,
      articleTypeList: []
    };
    const setArrt = reactive({
      formData: {
        theme: '',
        topped: 1,
        pageNum: 1,
        pageSize: 10,
        status: 0,
        articleTypeList: []
      },
      newFormData: {
        theme: '',
        topped: 1,
        status: 0,
        articleTypeList: []
      },
      name: '',
      artTypeData: {
        categoryName: '',
        status: 0,
        pageNum: 1,
        pageSize: 99,
        statusList: []
      },
      typeSelectList: [{ categoryName: '', id: '', status: '' }],
      searchData: {
        categoryName: '',
        id: '',
        status: '',
        statusList: []
      },
      total: 0,
      proOption: [
        { label: '全部', value: 0 },
        { label: '启用', value: 1 },
        { label: '禁用', value: 2 }
      ],
      dataList: [],
      columns: [
        { colKey: 'id', title: '序号', align: 'center' },
        { colKey: 'theme', title: '文章主题', align: 'center', width: '220px' },
        {
          colKey: 'articleType',
          title: '分类',
          align: 'center',
          slots: { customRender: 'articleType' }
        },
        {
          colKey: 'recommend',
          title: '是否推荐',
          align: 'center',
          slots: { customRender: 'recommend' }
        },
        { colKey: 'playbackNum', title: '播放量', align: 'center' },
        {
          colKey: 'status',
          title: '状态',
          align: 'center',
          slots: { customRender: 'status' }
        },
        { colKey: 'releaseTime', title: '发布时间', align: 'center', width: '180px' },
        {
          title: '操作',
          colKey: 'action',
          width: '180px',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      title: ''
    });
    //直接跳转
    const handleChange = () => {
      setArrt.title = '新增';
      router.push({
        path: '/ArticleDetailsView',
        query: {
          title: setArrt.title
        }
      });
    };

    const edit = (id: number) => {
      // debugger
      setArrt.title = '编辑';
      router.push({
        path: '/ArticleDetailsView',
        query: {
          id: id,
          title: setArrt.title
        }
      });
    };

    const details = (id: number) => {
      setArrt.title = '详情';
      router.push({
        path: '/ArticleDetailsView',
        query: {
          id: id,
          title: setArrt.title
        }
      });
    };
    const fixedTopRows = ref<boolean>(false);
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      if (route.query.history == '1') {
        setArrt.formData = marketing.formData;
        setArrt.newFormData = marketing.formData;
      }
      getArticleTypeList();
    });

    const getArticleTypeList = () => {
      queryArticleType(setArrt.artTypeData).then((res: any) => {
        if (res.code === 200) {
          setArrt.typeSelectList = res.data.data;
          getQueryArticleList();
        }
      });
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getQueryArticleList = () => {
      queryArticleList(setArrt.formData).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setArrt.dataList = []);
          } else {
            let datalist = res.data.data;
            datalist.filter((item: any) => {
              setArrt.typeSelectList.some(i => {
                if (item.articleType === i.id) {
                  item.categoryName = i.categoryName;
                }
              });
            });
            setArrt.dataList = datalist;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.dataList = []);
        }
      });
    };

    const typeSelectChange = (value: SelectValue) => {
      for (let i = 0; i < setArrt.typeSelectList.length; i++) {
        if (setArrt.typeSelectList[i].id === value) {
          setArrt.searchData.id = setArrt.typeSelectList[i].id;
          setArrt.searchData.categoryName = setArrt.typeSelectList[i].categoryName;
        }
      }
    };

    const search = () => {
      setArrt.formData = Object.assign(setArrt.formData, setArrt.newFormData);
      setArrt.formData.pageNum = 1;
      marketing.formData = setArrt.formData;
      getQueryArticleList();
    };

    const rest = () => {
      setArrt.formData = {
        theme: '',
        topped: 1,
        pageNum: 1,
        pageSize: 10,
        status: 0,
        articleTypeList: []
      };
      marketing.formData = {
        theme: '',
        topped: 1,
        pageNum: 1,
        pageSize: 10,
        status: 0,
        articleTypeList: []
      };
      setArrt.newFormData = {
        theme: '',
        topped: 1,
        status: 0,
        articleTypeList: []
      };
      getQueryArticleList();
    };

    const pageSizeChange = (pageSize: number) => {
      setArrt.formData.pageSize = pageSize;
      setArrt.formData.pageNum = 1;
      getQueryArticleList();
    };

    const currentChange = (current: number) => {
      setArrt.formData.pageNum = current;
      getQueryArticleList();
    };

    return {
      ...toRefs(setArrt),
      typeSelectChange,
      currentChange,
      pageSizeChange,
      handleChange,
      rest,
      edit,
      details,
      search,
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
        width: 240px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    .btn-item {
      margin-left: 15px;
    }
  }

  // ::v-deep(.t-table--striped:not(.t-table--header-fixed) tbody>tr:nth-of-type(odd):not(.t-table__expanded-row)) {
  //   background-color: #FFFFFF;
  // }

  // ::v-deep(.t-table--striped tbody tr) {
  //   background-color: #FFFFFF;
  // }
  // ::v-deep(.t-table--striped.t-table--hoverable tbody tr) {
  //   transition: #F3F3F3 0.2s linear;
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
