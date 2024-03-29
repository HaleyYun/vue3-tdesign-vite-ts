<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">权益名称：<t-input class="ipt-slt" v-model="newSearchData.equityName" auto-width /></div>
      <div class="search-item search-item-font">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：
        <t-select class="ipt-slt" @clear="rest" v-model="newSearchData.status" :options="proOption" placeholder="请选择"></t-select>
      </div>
      <div class="search-item search-item-font">
        销售渠道：
        <t-select class="ipt-slt" @clear="rest" v-model="newSearchData.channelCode" :options="channelOptionData" placeholder="请选择"></t-select>
      </div>
      <div class="search-item search-item-font">
        关联产品：
        <t-input class="ipt-slt" v-model="newSearchData.prodName" :maxlength="30" placeholder="请输入关联产品" />
      </div>
      <div class="search-item search-item-font">
        权益类型：
        <t-select class="ipt-slt" v-model="newSearchData.type" :options="typeOption" placeholder="请选择权益类型"></t-select>
      </div>
      <div class="search-item search-item-font">
        生成方式：
        <t-select class="ipt-slt" v-model="newSearchData.generateType" :options="generateData" placeholder="请选择"></t-select>
      </div>
      <t-button class="search-item search-item-font" theme="primary" @click="search">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addProduct">
          <template #icon> <AddIcon /></template>新增</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="qData?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1200 : 425" :data="qData" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false">
        <template #status="status">
          <t-switch v-model="status.row.status" :customValue="[1, 0]" @change="(value: SwitchValue) => getResetEnable(status.row, value as number)" :key="status.row.id" />
        </template>
        <template #type="type">
          <span v-if="type.row.type == 1">线上</span>
          <span v-if="type.row.type == 2">线下</span>
        </template>
        <template #generateType="generateType">
          <span v-if="generateType.row.generateType === 1">手动生成</span>
          <span v-if="generateType.row.generateType === 2">接口生成</span>
          <span v-if="generateType.row.generateType === 3">海报生成</span>
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="{ row }">
          <t-button size="small" variant="text" @click="edit(row.id, row.generateCount)" theme="success">编辑</t-button>
          <t-button size="small" variant="text" @click="details(row.id)" theme="primary">查看详情</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
    <t-dialog destroy-on-Close v-model:visible="addVisible" :on-cancel="onCancel" width="500" :on-close="close" :on-confirm="onConfirmProduct" :header="dialogTitle">
      <t-form :data="formData" :rules="(formRules as FormRules<Data>)">
        <t-form-item requiredMark label="权益名称" name="equityName" initial-data="TDesign">
          <t-input v-model="formData.equityName" :maxlength="30" placeholder="请填写权益名称" />
        </t-form-item>

        <t-form-item requiredMark label="权益类型" name="generateType">
          <t-radio-group v-model="formData.type" @change="equityChange">
            <t-radio :value="1">线上</t-radio>
            <t-radio :value="2">线下</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item requiredMark label="销售渠道" name="channelId" initial-data="TDesign">
          <t-select v-model="formData.channel" @change="channelSelectChange">
            <t-option v-for="(item, index) in channelOption" :key="index" :label="item.organizationName" :value="item" />
          </t-select>
        </t-form-item>
        <!-- <t-form-item label="筛查间隔" name="checkInterval" initial-data="TDesign">
          <t-input-number :min="0" v-model="formData.checkInterval" suffix="天" :maxlength="10" />
        </t-form-item> -->
        <t-form-item requiredMark label="权益有效期" name="validity" initial-data="TDesign">
          <t-input-number style="width: 250px" :min="0" v-model="formData.validity" suffix="天" :maxlength="30" @keyup="onKeyup" placeholder="请填写权益有效期" @change="onDayCount" />
        </t-form-item>
        <t-form-item requiredMark label="渠道价格" name="equityChannelPrice" initial-data="TDesign">
          <t-input v-model="formData.equityChannelPrice" @change="onBlur" :maxlength="5" @keyup="onKeyPrice" placeholder="请输入渠道价格" />
        </t-form-item>
        <t-form-item requiredMark label="关联产品" name="productId" initial-data="TDesign">
          <t-select :disabled="showDisabled" v-model="formData.product" :options="productOption" @change="onChangeSelect" placeholder="请选择" filterable />
        </t-form-item>

        <t-form-item requiredMark label="生成方式" name="generateType">
          <t-radio-group v-model="formData.generateType" @change="typeSelectChange">
            <t-radio :value="1">手动生成</t-radio>
            <t-radio :value="2">接口生成</t-radio>
            <t-radio :value="3">海报生成</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item requiredMark label="状态" name="status" initial-data="TDesign">
          <t-switch v-model="formData.status" :customValue="[1, 0]" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { AddIcon, SearchIcon, EditIcon, BooksIcon } from 'tdesign-icons-vue-next';
import { SelectValue, MessagePlugin, FormRules, Data, TreeNodeModel, SwitchValue, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
import { addServiceEquity, deleteServiceEquity, updateServiceEquity, getServiceIdEquity, queryServiceEquity, generServiceEquity, queryGenerServiceEquity, organization, channelProductSelect, ProductSelect, equityServiceStatus } from '../../request/modules/ServiceApi';
import { serviceStore } from '../../store/modules/serv';
import { dictData } from '@/request/modules/dictData';
import load from '../../components/load/load.vue';

export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    BooksIcon,
    load
  },
  setup() {
    const isChannelCode = ref('zskj'); //渠道编码
    const showDisabled = ref<boolean>(false); //是否可选
    const showChannel = ref<boolean>(true); //是否线上
    const servStore = serviceStore();
    const productOption = ref([]);
    const router = useRouter();
    const channelOptionData = ref<any>([]);
    const setArrt = reactive({
      texts: '',
      searchData: {
        equityName: '',
        prod: [] as any,
        status: '',
        type: '',
        usedCount: 0,
        pageNum: 1,
        pageSize: 10,
        channel: '',
        channelCode: '',
        prodName: '',
        generateType: ''
      },
      newSearchData: {
        equityName: '',
        prod: [] as any,
        status: '',
        type: '',
        usedCount: 0,
        channel: '',
        channelCode: '',
        prodName: '',
        generateType: ''
      },
      formData: {
        type: 1, //权益类型
        activeCount: 0,
        channel: '',
        product: '',
        channelCode: '',
        // channelId: 0,
        // checkInterval: undefined,
        equityChannelPrice: '',
        validity: undefined,
        createTime: '',
        createUser: '',
        equityName: '',
        generateCount: 0,
        isDelete: 0,
        maxGenerate: undefined,
        prod: {} as any,
        remark: '',
        status: 1,
        usedCount: 0,
        generateType: 1, //生成方式
        prodName: ''
      },
      relaList: [] as any,
      relationProduct: {
        id: 0,
        prodName: '',
        relaId: ''
      },
      id: 0,
      seleted: 4,
      dialogTitle: '',

      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1, title: '请选择' },
        { label: '禁用', value: 0 }
      ],
      typeOption: [
        { label: '全部', value: '' },
        { label: '线上', value: 1 },
        { label: '线下', value: 2 }
      ],
      generateData: [
        { label: '全部', value: '' },
        { label: '手动生成', value: 1 },
        { label: '接口生成', value: 2 },
        { label: '海报生成', value: 3 }
      ],
      // channelOption: [
      //   { label: '太宝蓝', value: 1 },
      //   { label: '保险', value: 2 },
      //   { label: '小程序', value: 3 }
      // ],
      channelOption: [] as any,
      formRules: {
        equityName: [{ required: true, message: '权益名称必填', trigger: 'blur' }],
        generateType: [{ required: true, message: '权益类型必填', trigger: 'blur' }],
        validity: [{ required: true, message: '权益有效期必填', trigger: 'blur' }],
        channel: [{ required: true, message: '销售渠道必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'blur' }],
        prod: [{ required: true, message: '关联商品必填', trigger: 'blur' }],
        equityChannelPrice: [{ required: true, message: '渠道价格必填', trigger: 'blur' }]
      },
      qData: [],
      total: 0,
      columns: [
        { colKey: 'id', title: '序号', align: 'center' },
        {
          colKey: 'type',
          title: '权益类型',
          width: '140px',
          slots: { customRender: 'type' },
          align: 'center'
        },
        { colKey: 'equityName', title: '权益名称', align: 'center', width: '230px' },
        { colKey: 'generateCount', title: '已生成数量(张)', align: 'center', width: '180px' },

        {
          colKey: 'generateType',
          title: '生成方式',
          align: 'center',
          slots: { customRender: 'generateType' }
        },
        {
          colKey: 'status',
          title: '状态',
          align: 'center',
          slots: { customRender: 'status' }
        },
        {
          colKey: 'channel',
          title: '销售渠道',
          align: 'center',
          width: '220px'
        },
        {
          colKey: 'prodName',
          title: '关联产品',
          align: 'center',
          width: '280px'
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
          align: 'center',
          width: '180px',
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ],
      addVisible: false,
      serviceType: ''
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
      if (servStore.eQuityData?.prod) {
        if (servStore.eQuityData.prod.length > 0) {
          setArrt.addVisible = true;
        }
        setArrt.formData = JSON.parse(JSON.stringify(servStore.eQuityData));
        setArrt.id = servStore.eQuityId;
        setArrt.dialogTitle = servStore.dialogTitle;
        getEquityList();
        getDictData();
        getOrganizationList();
        getProductList();
      } else {
        getEquityList();
        getDictData();
        getOrganizationList();
        getProductList();
      }
    });

    // 获取服务类型字典
    const getDictData = () => {
      dictData({ dictType: 'service_type' }).then((res: any) => {
        if (res.code === 200) {
          let result = res.data.find((el: any) => el.dictLabel === '权益');
          setArrt.serviceType = result.dictValue;
        }
      });
    };

    // 获取渠道
    const getOrganizationList = () => {
      let data = {
        showChannel: showChannel.value,
        pageNum: 1,
        pageSize: 999
      };
      organization(data).then((res: any) => {
        if (res.code === 200) {
          setArrt.channelOption = res.data.data;

          channelOptionData.value = res.data.data.map((item: any) => {
            return {
              label: item.organizationName,
              value: item.organizationNum
            };
          });
        }
      });
    };

    // 获取关联产品
    const getProductList = () => {
      let data = {
        channelCode: isChannelCode.value == 'zskj' ? '' : isChannelCode.value,
        type: isChannelCode.value == 'zskj' ? '2' : '1',
        pageNum: 1,
        pageSize: 99
      };
      ProductSelect(data).then((res: any) => {
        if (res.code === 200) {
          productOption.value = res.data.map((item: any) => {
            return {
              label: item.prodName,
              value: item.id,
              relaId: item.relaId
            };
          });
        }
      });
    };
    const onConfirmProduct = () => {
      if (setArrt.formData.equityChannelPrice == '') {
        MessagePlugin.error('渠道价格不可为空');
        return;
      }
      if (setArrt.formData.validity === undefined) {
        MessagePlugin.error('权益有效期不可为空');
        return;
      }
      if (setArrt.formData.channel == '') {
        MessagePlugin.error('销售渠道不可为空');
        return;
      }
      if (setArrt.formData.product === undefined) {
        MessagePlugin.error('关联产品不可为空');
        return;
      }
      console.log(setArrt.relationProduct.prodName, 'ppp');
      if (setArrt.relationProduct.prodName == '' || setArrt.relationProduct.relaId == '') {
        MessagePlugin.error('关联产品不可为空');
        return;
      }

      if (setArrt.dialogTitle === '新增权益') {
        //新增
        setArrt.formData.prod = setArrt.relationProduct;
        addServiceEquity(setArrt.formData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            // servStore.eQuityData.prod = [];
            // servStore.checkedData.checkList = [];
            setArrt.addVisible = false;
            getEquityList();
          }
        });
      } else {
        // 编辑
        // if (setArrt.formData.prod) {
        //   console.log(setArrt.formData.prod, 'prod');
        //   setArrt.relationProduct = {
        //     id: setArrt.formData.prod[0].id,
        //     prodName: setArrt.formData.prod[0].prodName
        //   };
        // }

        let data = {
          id: setArrt.id,
          prod: setArrt.relationProduct,
          // relationProduct: {},
          activeCount: setArrt.formData.activeCount,
          channel: setArrt.formData.channel,
          channelCode: setArrt.formData.channelCode,

          equityChannelPrice: setArrt.formData.equityChannelPrice, //渠道价格
          equityName: setArrt.formData.equityName,
          generateCount: setArrt.formData.generateCount,
          generateType: setArrt.formData.generateType,
          isDelete: setArrt.formData.isDelete,
          maxGenerate: setArrt.formData.maxGenerate,
          status: setArrt.formData.status,
          usedCount: setArrt.formData.usedCount,
          validity: setArrt.formData.validity,
          type: setArrt.formData.type
        };
        // channelId: setArrt.formData.channelId,
        // checkInterval: setArrt.formData.checkInterval,
        // if (setArrt.relationProduct.id) {
        //   data.relationProduct = setArrt.relationProduct;
        // } else {
        //   data.relationProduct = {};
        //   MessagePlugin.warning('权益必须有1条关联商品');
        //   return;
        // }
        updateServiceEquity(data).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            // servStore.checkedData.checkList = [];
            setArrt.addVisible = false;
            getEquityList();
          }
        });
      }
    };
    const edit = (value: number, count: number) => {
      showDisabled.value = false;

      if (count > 0) {
        MessagePlugin.warning('已生成权益码不允许编辑');
        return;
      }
      setArrt.formData.prod = [];
      setArrt.id = value;
      // servStore.eQuityId = value;
      setArrt.addVisible = true;
      setArrt.dialogTitle = '编辑权益';
      // servStore.dialogTitle = '编辑权益';
      getServiceIdEquity({ id: value }).then((res: any) => {
        if (res.code === 200) {
          setArrt.formData = res.data;
          isChannelCode.value = res.data.channelCode;
          getProductList();
          setArrt.formData.product = res.data.prodName;
          if (res.data.equityChannelPrice) {
            setArrt.formData.equityChannelPrice = res.data.equityChannelPrice.toString();
          } else {
            setArrt.formData.equityChannelPrice = '';
          }

          setArrt.relationProduct = { id: res.data.prodId, prodName: res.data.prodName, relaId: res.data.relaId };
          showChannel.value = res.data.type == 2 ? false : true;
          getOrganizationList();
        }
      });
    };
    const details = (value: number) => {
      router.push({
        path: '/EquityServiceDetails',
        query: {
          id: value,
          type: 'community'
        }
      });
    };
    // 获取权益列表
    let loadStatus = ref<string>('loading'); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getEquityList = () => {
      queryServiceEquity(setArrt.searchData as any).then((res: any) => {
        if (res.code == 200) {
          if (res.data.total == 0) {
            (loadStatus.value = 'noData'), (setArrt.qData = []);
          } else {
            setArrt.qData = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.qData = []);
        }
      });
    };
    //选择线上或者线下
    const equityChange = val => {
      console.log(val, '000');
      if (val == 1) {
        showChannel.value = true;
        setArrt.formData.channel = '织生平台';
        setArrt.formData.channelCode = 'zskj';
        showDisabled.value = false;
        isChannelCode.value = 'zskj';
        getProductList();
      } else {
        showDisabled.value = true;
        setArrt.formData.channel = '';
        setArrt.formData.channelCode = '';
        setArrt.formData.generateType = 1;
        setArrt.formData.status = 1;
        showChannel.value = false;
      }
      setArrt.formData.equityChannelPrice = '';
      setArrt.formData.product = '';
      setArrt.formData.validity = undefined;
      setArrt.relationProduct = {
        id: 0,
        prodName: '',
        relaId: ''
      };

      getOrganizationList();
    };
    const typeSelectChange = checkedValues => {
      console.log(checkedValues);
    };
    const channelSelectChange = (value: any) => {
      console.log(value, '000');
      setArrt.formData.product = '';
      setArrt.relationProduct = {
        id: 0,
        prodName: '',
        relaId: ''
      };
      if (setArrt.formData.type == 1) {
        isChannelCode.value = 'zskj';
      } else {
        isChannelCode.value = value.organizationNum;
      }
      setArrt.formData.equityChannelPrice = '';
      setArrt.formData.validity = undefined;
      showDisabled.value = false;
      setArrt.formData.channel = value.organizationName;
      setArrt.formData.channelCode = value.organizationNum;
      getProductList();
    };
    const onChangeSelect = (value: any, context: any) => {
      setArrt.relationProduct = context.selectedOptions
        // .filter(item => item.index == 0)
        .map(item => {
          return {
            id: item.value,
            prodName: item.label,
            relaId: item.relaId
          };
        });
    };

    const goProduct = () => {
      // servStore.eQuityData = setArrt.formData;
      let data = [] as any;
      if (setArrt.dialogTitle == '编辑权益') {
        // for (const key in setArrt.formData.prod) {
        //     console.log(key)
        //     data[0] = setArrt.formData.prod[key].id
        //     console.log(data[0])
        //     servStore.checkedData.checkList = data
        // }
        // if (setArrt.relationProduct.id > 0) {
        //   servStore.checkedData.checkList[0] = setArrt.relationProduct.id;
        // } else {
        //   servStore.checkedData.checkList = [];
        // }
        router.push({
          path: '/ServiceProducts',
          query: {
            seleted: setArrt.seleted,
            serviceType: setArrt.serviceType
          }
        });
      } else {
        setArrt.formData.prod.forEach((item: any) => {
          data.push(item.id as number);
          // servStore.checkedData.checkList = Array.from(new Set(data));
        });
        router.push({
          path: '/ServiceProducts',
          query: {
            seleted: setArrt.seleted,
            serviceType: setArrt.serviceType
          }
        });
      }
    };
    const handleClose = (index: any) => {
      setArrt.formData.prod.splice(index, 1);
      servStore.eQuityData.prod.splice(index, 1);
      servStore.checkedData.checkList = [];
      console.log(setArrt.formData.prod);
      console.log(servStore.eQuityData.prod);
    };
    const handelOneClose = (index: number) => {
      servStore.eQuityData.prod.splice(index, 1);
      setArrt.relaList.splice(index, 1);
      servStore.checkedData.checkList = [];
      setArrt.relationProduct = {
        id: 0,
        prodName: '',
        relaId: ''
      };
    };
    //新增
    const addProduct = () => {
      // servStore.dialogTitle = '新增权益';
      setArrt.dialogTitle = '新增权益';
      setArrt.addVisible = true;
      showDisabled.value = false;
      isChannelCode.value = 'zskj';
      getProductList();
      setArrt.relaList = [];
      setArrt.relationProduct = {
        id: 0,
        prodName: '',
        relaId: ''
      };
      setArrt.formData = ref<any>({
        activeCount: 0,
        channel: '织生平台',
        channelCode: 'zskj',
        // checkInterval: undefined,
        equityChannelPrice: '', //渠道价格
        validity: undefined,
        createTime: '',
        createUser: '',
        equityName: '',
        generateCount: 0,
        isDelete: 0,
        maxGenerate: undefined,
        prod: [] as any,
        remark: '',
        status: 1,
        usedCount: 0,
        type: 1,
        equityType: 1,
        generateType: 1
      });
    };

    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getEquityList();
    };
    const rest = () => {
      setArrt.searchData = {
        equityName: '',
        prod: 0,
        status: '',
        type: '',
        usedCount: 0,
        pageNum: 1,
        pageSize: 10,
        channel: '',
        channelCode: '',
        prodName: '',
        generateType: ''
      };
      setArrt.newSearchData = {
        equityName: '',
        prod: 0,
        status: '',
        type: '',
        usedCount: 0,
        channel: '',
        channelCode: '',
        prodName: '',
        generateType: ''
      };
      getEquityList();
    };

    const onCancel = () => {
      // servStore.eQuityData.prod = [];
      // servStore.checkedData.checkList = [];
      setArrt.addVisible = false;
    };
    const close = () => {
      // servStore.eQuityData.prod = [];
      // servStore.checkedData.checkList = [];
      setArrt.addVisible = false;
    };

    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getEquityList();
    };

    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getEquityList();
    };
    //校验
    // const onBlur = (val: any) => {
    //   //正则
    //   let special = /^([0-9]|[1-9]\d+)(\.\d{2})?$/;
    //   if (!special.test(val)) {
    //     MessagePlugin.warning('请输入数字');
    //     setArrt.formData.equityChannelPrice = '';
    //   }
    // };
    const onBlur = val => {
      setArrt.formData.equityChannelPrice = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    };
    const onKeyPrice = val => {
      if (val) {
        setArrt.formData.equityChannelPrice = val.replace(/[^(\d||/.)]/g, '');
      }
    };
    const onKeyup = val => {
      setArrt.formData.validity = val.replace(/[^\d]/g, '');
    };
    const onDayCount = val => {
      if (val == -1) {
        setArrt.formData.validity = undefined;
      }
    };
    //编辑状态
    const getResetEnable = (val: any, proAble: Number) => {
      let params = {
        id: val.id,
        status: proAble
      };
      equityServiceStatus(params as any).then((res: any) => {
        if (res.code === 200) {
          // MessagePlugin.success('修改成功');
          getEquityList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    return {
      ...toRefs(setArrt),
      // onHeavy,
      onBlur,
      onKeyPrice,
      onKeyup,
      onDayCount,
      productOption,
      channelOptionData,
      fixedTopRows,
      channelSelectChange,
      onConfirmProduct,
      typeSelectChange,
      equityChange,
      handelOneClose,
      pageSizeChange,
      currentChange,
      handleClose,
      addProduct,
      goProduct,
      onCancel,
      details,
      search,
      close,
      rest,
      edit,
      onChangeSelect,
      getResetEnable,
      isChannelCode,
      showDisabled,
      loadStatus,
      showChannel,
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
