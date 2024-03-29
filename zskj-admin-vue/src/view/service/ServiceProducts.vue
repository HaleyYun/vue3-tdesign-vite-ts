<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">服务名称:<t-input class="ipt-slt" v-model="newSearchData.prodName" auto-width /></div>
      <div class="search-item search-item-font">服务编号:<t-input class="ipt-slt" v-model="newSearchData.prodCode" auto-width /></div>
      <div class="search-item search-item-font">服务状态:<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.prodStatus" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">产品分类:<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.typeId" :options="proTypeOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" v-if="seleted <= 0" @click="add">
          <template #icon> <AddIcon /> </template>新增
        </t-button>
        <t-button class="btn-item" theme="success" v-if="seleted > 0" @click="confServType">
          <template #icon> <EditIcon /> </template>确定选择
        </t-button>
        <t-button class="btn-item" theme="danger" v-if="seleted > 0" @click="cancels">
          <template #icon> <EditIcon /> </template>取消
        </t-button>
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="listData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table :data="listData" :max-height="fixedTopRows ? 1400 : 420" row-key="id" :columns="(columns as PrimaryTableCol<TableRowData>[])" v-model:selected-row-keys="selectedRowKeys" size="medium" table-layout="fixed" :bordered="false" select-on-row-click @select-change="rehandleSelectChange">
        <template #prodName="prodName">
          <img class="zs-log" :src="prodName.row.mainPic" alt="" />
          <p>{{ prodName.row.prodName }}</p>
        </template>
        <template #prodStatus="statue">
          <span v-if="statue.row.prodStatus === 1">启用</span>
          <span v-if="statue.row.prodStatus === 0">禁用</span>
        </template>
        <template #serviceTypeName="{ row }">
          {{ row.typeName }}
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="detail" v-if="seleted <= 0">
          <t-button variant="text" theme="success" size="small" @click="edit(detail.row.id)">编辑</t-button>
          <t-popconfirm v-if="detail.row.prodStatus === 1" content="确认禁用吗" theme="danger" @click.stop @confirm="productDown(detail.row.id)">
            <t-button variant="text" theme="danger" size="small"> 禁用</t-button>
          </t-popconfirm>
          <t-popconfirm v-if="detail.row.prodStatus === 0" content="确认启用吗" theme="danger" @click.stop @confirm="productUp(detail.row.id)">
            <t-button variant="text" theme="danger" size="small"> 启用</t-button>
          </t-popconfirm>
          <t-button variant="text" theme="primary" size="small" @click="look(detail.row.id)"> 查看详情 </t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { queryServicePro, changeServicePro, queryServiceType } from '../../request/modules/ServiceApi';
import { useRouter } from 'vue-router';
import { serviceStore } from '../../store/modules/serv';
import { AddIcon, SearchIcon, EditIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, SelectOptions, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { dictData } from '@/request/modules/dictData';
import load from '../../components/load/load.vue';

export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    FilePasteIcon,
    load
  },
  setup() {
    const servStore = serviceStore();
    const router = useRouter();
    const route = useRoute();
    const proTypeOption = ref<any>([]);
    const setArrt = reactive({
      passwordShow: false,
      searchData: {
        prodName: '',
        prodCode: '',
        prodStatus: '',
        serviceType: '',
        pageNum: 1,
        pageSize: 10,
        typeId: ''
      },
      newSearchData: {
        prodName: '',
        prodCode: '',
        serviceType: '',
        prodStatus: '',
        typeId: ''
      },
      total: 0,
      eQuityChecked: false,
      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      productId: 0, //产品ID
      formData: {
        createUser: '',
        detailPic: '',
        id: 0,
        isDelete: 0,
        servStatus: 1,
        mainPic: '',
        playPicList: [],
        prodCode: '',
        prodDescribe: '',
        prodName: '',
        prodPrice: 0,
        prodSold: 0,
        prodStatus: 0,
        prodStock: 0,
        realPrice: 0,
        remark: '',
        servId: 0,
        showSold: 0,
        updateUser: '',
        serviceType: '',
        serviceTypeName: ''
      },
      seleted: 0,
      title: '',
      listData: [],
      checkedProducts: [] as any,
      columns: [
        {
          colKey: 'prodName',
          title: '服务名称',
          slots: { customRender: 'prodName' },
          align: 'center'
        },
        {
          colKey: 'prodCode',
          title: '服务编号',
          align: 'center'
        },
        {
          colKey: 'prodPrice',
          title: '市场价格',
          align: 'center'
        },
        {
          colKey: 'typeName',
          title: '产品分类',
          align: 'center',
          slots: { customRender: 'serviceTypeName' }
        },
        {
          colKey: 'prodStatus',
          title: '服务状态',
          align: 'center',
          slots: { customRender: 'prodStatus' }
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
          width: '250px',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      addVisible: false,
      checkTypeList: [] as any,
      selectedRowKeys: [] as any,
      typeData: [{ dictLabel: '', dictValue: '' }]
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
        setArrt.seleted = Number(route.query.seleted);
        let data = {
          colKey: 'row-select',
          type: 'multiple',
          width: 46,
          title: ''
        };
        setArrt.columns.unshift(data as any);
      }
      if (route.query.serviceType) {
        setArrt.searchData.serviceType = String(route.query.serviceType);
      }
      getDictData();
      getServiceList();
      getTypeData();
      if (servStore.checkedData?.checkList) {
        setArrt.selectedRowKeys = servStore.checkedData.checkList;
        console.log(setArrt.selectedRowKeys);
      }
    });
    // 获取服务类型字典
    const getDictData = () => {
      dictData({ dictType: 'service_type' }).then((res: any) => {
        if (res.code === 200) {
          setArrt.typeData = res.data;
        }
      });
    };

    //获取列表
    let loadStatus = ref<string>('loading'); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getServiceList = () => {
      queryServicePro(setArrt.searchData as any).then((res: any) => {
        if (res.code === 200) {
          if (res.data.total == 0) {
            (loadStatus.value = 'noData'), (setArrt.listData = []);
          } else {
            setArrt.typeData.forEach((el: any) => {
              res.data.data.find((item: any, index: number) => {
                if (item.serviceType === el.dictValue) {
                  res.data.data[index].serviceTypeName = el.dictLabel;
                }
              });
            });
            setArrt.listData = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.listData = []);
        }
      });
    };

    //查询
    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getServiceList();
    };

    //新增
    const add = () => {
      setArrt.title = '新增';
      router.push({
        path: '/ServiceEdit',
        query: {
          title: setArrt.title
        }
      });
    };

    const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
      // console.log(RowKeys)
      console.log(options);
      setArrt.checkTypeList = options.selectedRowData;
      console.log(setArrt.checkTypeList);
    };

    // 选择产品确定按钮
    const confServType = () => {
      if (setArrt.seleted === 1) {
        let data = [] as any;
        for (let i = 0; i < setArrt.checkTypeList.length; i++) {
          const el = setArrt.checkTypeList[i];
          data.push({
            id: el.id,
            prodName: el.prodName
          });
        }
        setArrt.checkedProducts = data;
        servStore.serviceData.prodIdList = setArrt.checkedProducts;
        router.push({
          path: '/ServiceType'
        });
      } else if (setArrt.seleted === 2) {
        let data = [] as any;
        for (let i = 0; i < setArrt.checkTypeList.length; i++) {
          const el = setArrt.checkTypeList[i];
          data.push({
            id: el.id,
            prodName: el.prodName
          });
        }
        setArrt.checkedProducts = data;
        if (setArrt.checkTypeList.length > 3) {
          MessagePlugin.warning('最多选择3条');
          servStore.searchData.relaIdList = [];
          return;
        } else {
          servStore.searchData.relaIdList = setArrt.checkedProducts;
          router.push({
            path: '/ServiceRecommend'
          });
        }
      } else {
        let data = [] as any;
        for (let i = 0; i < setArrt.checkTypeList.length; i++) {
          const el = setArrt.checkTypeList[i];
          if (el) {
            data.push({
              id: el.id,
              prodName: el.prodName
            });
          }
        }
        setArrt.checkedProducts = data;
        console.log(setArrt.checkedProducts);
        if (setArrt.checkTypeList.length > 1) {
          MessagePlugin.warning('最多选择1条');
          servStore.eQuityData.prod = [];
          return;
        } else {
          servStore.eQuityData.prod = setArrt.checkedProducts.slice(-1);
          router.push({
            path: '/EquityService'
          });
        }
      }
    };
    // 选择产品取消按钮
    const cancels = () => {
      setArrt.checkTypeList = [];
      servStore.checkedData.checkList = [];
      if (setArrt.seleted === 1) {
        router.push({
          path: '/ServiceType'
        });
      } else if (setArrt.seleted === 2) {
        router.push({
          path: '/ServiceRecommend'
        });
      } else {
        router.push({
          path: '/EquityService'
        });
      }
    };

    //编辑
    const edit = (value: any) => {
      setArrt.productId = value;
      setArrt.title = '编辑';
      router.push({
        path: '/ServiceEdit',
        query: {
          id: value,
          title: setArrt.title
        }
      });
    };

    const rest = () => {
      setArrt.searchData = {
        prodName: '',
        prodCode: '',
        serviceType: '',
        prodStatus: '',
        pageNum: 1,
        pageSize: 10,
        typeId: ''
      };
      setArrt.newSearchData = {
        prodName: '',
        prodCode: '',
        serviceType: '',
        prodStatus: '',
        typeId: ''
      };
      getServiceList();
    };

    //下架
    const productDown = (value: any) => {
      setArrt.formData.id = value;
      setArrt.formData.servStatus = 0;
      changeServicePro(setArrt.formData).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success(res.msg);
          getServiceList();
        }
      });
    };
    // 上架
    const productUp = (value: any) => {
      setArrt.formData.id = value;
      setArrt.formData.servStatus = 1;
      changeServicePro(setArrt.formData).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success(res.msg);
          getServiceList();
        }
      });
    };
    //查看
    const look = (value: any) => {
      setArrt.title = '查看';
      router.push({
        path: '/ServiceEdit',
        query: {
          id: value,
          title: setArrt.title
        }
      });
    };

    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getServiceList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getServiceList();
    };
    // 获取服务分类字典
    const getTypeData = () => {
      let searchData = {
        pageNum: 1,
        pageSize: 99,
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: undefined
      };
      queryServiceType(searchData).then((res: any) => {
        if (res.code == 200) {
          proTypeOption.value = res.data.data.map((item: any) => {
            return {
              label: item.servTypeName,
              value: item.id
            };
          });
        }
      });
    };
    return {
      ...toRefs(setArrt),
      fixedTopRows,
      rehandleSelectChange,
      pageSizeChange,
      currentChange,
      confServType,
      productDown,
      productUp,
      search,
      cancels,
      rest,
      edit,
      look,
      add,
      proTypeOption,
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

  .zs-log {
    width: 50px;
    height: 50px;
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
