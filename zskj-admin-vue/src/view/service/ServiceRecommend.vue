<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item">推荐名称:<t-input class="ipt-slt" v-model="newSearchData.recomName" auto-width /></div>
      <div class="search-item">状态:<t-select class="ipt-slt" @clear="rest" v-model="newSearchData.status"
          :options="proOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary" @click="search">
        <template #icon>
          <SearchIcon />
        </template>搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
    </div>
    <div class="operate-box">
      <t-button class="btn-item" theme="primary" @click="addRecomd">
        <template #icon>
          <AddIcon />
        </template>新增</t-button>
    </div>
    <div class="tab-box">
      <t-table row-key="index" :data="RecomdData" :columns="columns" size="medium" hover table-layout="fixed"
        :bordered="false">
        <template #state="{ row }">
          <span>{{ row.status == 1 ? '启用' : '禁用' }}</span>
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="{ row }">
          <t-button size="small" variant="text" @click="edit(row.id)" theme="success">
            <template #icon>
              <EditIcon />
            </template>
            修改</t-button>
        </template>
      </t-table>
    </div>
    <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total"
      @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    <t-dialog v-model:visible="addVisible" :on-cancel="onCancel" :on-close="close" :on-confirm="onConfirmServiceType"
      :header="dialogTitle">
      <t-form ref="form" :data="serRecomdData" :rules="(formRules as FormRules<Data>)">
        <t-form-item requiredMark label="推荐名称" name="recomName">
          <t-input v-model="serRecomdData.recomName" :maxlength="4" placeholder="请输入推荐名称" />
        </t-form-item>
        <t-form-item requiredMark label="销售渠道" name="tel">
          <span>小程序</span>
        </t-form-item>
        <t-form-item requiredMark label="关联商品" name="relaIdList">
          <t-space class="tag-block light tags">
            <t-tag theme="primary" variant="light" v-for="(tag, index) in serRecomdData.relaIdList" :key="index"
              :closable="tag" @close="handleClose(index)">
              {{ tag.prodName }}
            </t-tag>
            <t-button class="btn-item" theme="primary" @click="goProduct">
              <template #icon>
                <EditIcon />
              </template>选择产品服务
            </t-button>
          </t-space>
        </t-form-item>
        <t-form-item requiredMark label="排序" name="orderNumber">
          <t-input-number :min="0" v-model="serRecomdData.orderNumber"></t-input-number>
        </t-form-item>
        <t-form-item requiredMark label="状态" name="status">
          <t-switch v-model="serRecomdData.status" :customValue="[1, 0]" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { MessagePlugin, FormRules, Data } from 'tdesign-vue-next';
import { AddIcon, SearchIcon, EditIcon } from 'tdesign-icons-vue-next';
import { addServiceRecomd, updateServiceRecomd, getServiceRecomd, queryServiceRecomd } from '../../request/modules/ServiceApi';
import { serviceStore } from '../../store/modules/serv';
import { dictData } from '@/request/modules/dictData';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon
  },
  setup() {
    const servStore = serviceStore();
    const router = useRouter();
    const setArrt = reactive({
      searchData: {
        recomName: '',
        status: undefined,
        pageNum: 1,
        pageSize: 10
      },
      newSearchData: {
        recomName: '',
        status: undefined
      },
      serRecomdData: {
        channel: '',
        channelId: 0,
        createTime: '',
        createUser: '',
        isDelete: 0,
        orderNumber: 0,
        recomName: '',
        relaCount: 0,
        relaIdList: [] as any,
        remark: '',
        status: 1,
        pageNum: 1,
        pageSize: 10
      },
      proOption: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      seleted: 2,
      formRules: {
        recomName: [{ required: true, message: '推荐名必填', trigger: 'blur' }],
        relaIdList: [{ required: true, message: '商品关联必填', trigger: 'blur' }],
        orderNumber: [{ required: true, message: '顺序必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'blur' }]
      },
      RecomdData: [],
      columns: [
        { colKey: 'id', title: '序号' },
        { colKey: 'recomName', title: '推荐名称' },
        { colKey: 'relaCount', title: '关联商品数量' },
        { colKey: 'orderNumber', title: '排序' },
        {
          colKey: 'state',
          title: '状态',
          slots: { customRender: 'state' }
        },
        {
          colKey: 'updateTime',
          title: '操作时间',
          slots: { customRender: 'updateTime' }
        },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' }
        }
      ],
      dialogTitle: '',
      addVisible: false,
      total: 0,
      serviceType: ""
    });

    onMounted(() => {
      if (servStore.searchData.relaIdList.length > 0) {
        setArrt.serRecomdData = JSON.parse(JSON.stringify(servStore.searchData));
        setArrt.dialogTitle = servStore.dialogTitle;
        setArrt.addVisible = true;
        getRecomdList();
        getDictData();
      } else {
        getRecomdList();
        getDictData();
      }
    });

    // 获取服务类型字典
    const getDictData = () => {
      dictData({ dictType: 'service_type' }).then((res: any) => {
        if (res.code === 200) {
          let result = res.data.find((el: any) => el.dictLabel === '服务');
          setArrt.serviceType = result.dictValue
        }
      });
    };

    // 获取列表
    const getRecomdList = () => {
      queryServiceRecomd(setArrt.searchData).then((res: any) => {
        if (res.code === 200) {
          setArrt.RecomdData = res.data.data;
          setArrt.total = res.data.total;
        }
      });
    };

    const onConfirmServiceType = () => {
      if (setArrt.dialogTitle === '新增') {
        // 新增推荐
        addServiceRecomd(setArrt.serRecomdData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            servStore.checkedData.checkList = [];
            setArrt.addVisible = false;
            getRecomdList();
          }
        });
      } else {
        if (!setArrt.serRecomdData.recomName) {
          MessagePlugin.warning('推荐名称不能为空');
          return;
        }
        // 更新推荐
        updateServiceRecomd(setArrt.serRecomdData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            servStore.checkedData.checkList = [];
            setArrt.addVisible = false;
            getRecomdList();
          }
        });
      }
    };

    const rest = () => {
      setArrt.searchData = {
        recomName: '',
        status: undefined,
        pageNum: 1,
        pageSize: 10
      };
      setArrt.newSearchData = {
        recomName: '',
        status: undefined
      };
      getRecomdList();
    };
    const addRecomd = () => {
      setArrt.dialogTitle = '新增';
      servStore.dialogTitle = '新增';
      setArrt.addVisible = true;
      setArrt.serRecomdData = {
        channel: '',
        channelId: 0,
        createTime: '',
        createUser: '',
        isDelete: 0,
        orderNumber: 0,
        recomName: '',
        relaCount: 0,
        relaIdList: [] as any,
        remark: '',
        status: 1,
        pageNum: 1,
        pageSize: 10
      };
    };
    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getRecomdList();
    };

    const handleClose = (index: any) => {
      setArrt.serRecomdData.relaIdList.splice(index, 1);
      servStore.searchData.relaIdList.splice(index, 1);
    };

    const goProduct = () => {
      servStore.searchData = setArrt.serRecomdData;
      let data = [] as any;
      setArrt.serRecomdData.relaIdList.forEach((item: any) => {
        data.push(item.id as number);
        servStore.checkedData.checkList = Array.from(new Set(data));
      });
      router.push({
        path: '/ServiceProducts',
        query: {
          seleted: setArrt.seleted,
          serviceType: setArrt.serviceType
        }
      });
    };
    const edit = (id: number) => {
      servStore.dialogTitle = '编辑';
      setArrt.dialogTitle = '编辑';
      console.log(servStore.dialogTitle);
      setArrt.addVisible = true;
      getServiceRecomd({ id: id }).then((res: any) => {
        if (res.code === 200) {
          setArrt.serRecomdData = res.data;
        }
      });
    };
    const onCancel = () => {
      servStore.searchData.relaIdList = [];
      servStore.checkedData.checkList = [];
      setArrt.addVisible = false;
    };
    const close = () => {
      servStore.searchData.relaIdList = [];
      servStore.checkedData.checkList = [];
      setArrt.addVisible = false;
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getRecomdList();
    };

    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getRecomdList();
    };
    return {
      ...toRefs(setArrt),
      onConfirmServiceType,
      pageSizeChange,
      currentChange,
      handleClose,
      addRecomd,
      goProduct,
      onCancel,
      search,
      close,
      rest,
      edit
    };
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;

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
    margin: 8px 0;

    .btn-item {
      margin-right: 25px;
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
  }

  .t-pagination {
    margin-top: 30px;
  }
}
</style>
