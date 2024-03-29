<template>
  <div class="mark-box">
    <div class="box-img" @click="artBack">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">返回</t-button>
      </div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">权益配置信息</div>
      </div>
      <div class="search-box">
        <div class="box-title">
          销售渠道：
          <div class="title-content">
            {{ formData.channel }}
            <span class="title-bg"
              ><span class="bg-font">{{ formData.type == '1' ? '线上' : '线下' }}</span></span
            >
          </div>
        </div>
        <div class="box-name nameCommon">
          <div class="name-title">
            权益名称：
            <div class="name-content">
              {{ formData.equityName }}
            </div>
          </div>
          <div class="name-title">
            生成方式：
            <div class="name-content">
              <span v-if="formData.generateType === 1">手动生成</span>
              <span v-if="formData.generateType === 2">接口生成</span>
              <span v-if="formData.generateType === 3">海报生成</span>
            </div>
          </div>
          <div class="name-title">
            状态：
            <div class="name-content">
              {{ formData.status === 1 ? '启用' : '禁用' }}
            </div>
          </div>
        </div>
        <div class="box-name">
          <div class="name-title">
            已生成：
            <div class="name-content intervalCommon">{{ formData.generateCount }}张</div>
          </div>
          <div class="name-title">
            已激活：
            <div class="name-content intervalCommon">{{ formData.activeCount }}张</div>
          </div>
          <div class="name-title intervalCommon">
            已使用：
            <div class="name-content">{{ formData.usedCount }}张</div>
          </div>
        </div>
      </div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">权益规则</div>
      </div>
      <div class="search-box">
        <div class="box-name">
          <div class="name-title">
            筛查次数：
            <div class="name-content intervalCommon">{{ serviceRule.checkCount ? serviceRule.checkCount : '0' }}次</div>
          </div>
          <div class="name-title">
            干预周期
            <div v-if="serviceRule.interveneCycle" class="name-content intervalCommon">{{ serviceRule.interveneCycle < 360 ? serviceRule.interveneCycle + '天' : '全年' }}</div>

            <div v-if="serviceRule.interveneCycle == null" class="name-content intervalCommon">--</div>
          </div>
          <div class="name-title intervalCommon">
            有效期：
            <div class="name-content">{{ formData.validity }}天</div>
          </div>
        </div>
      </div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">关联产品</div>
      </div>
      <div class="equity-box">
        <div class="box-equity">
          <div class="box-left">
            <t-image :src="relationProduct.mainPic" :style="{ width: '80px', height: '80px', borderRadius: '8px' }" />
          </div>

          <div class="box-right">
            <div class="right-name">{{ relationProduct.prodName }}</div>
            <div class="right-dec">{{ relationProduct.prodDescribe }}</div>
            <div class="right-price"><span class="price">￥</span>{{ relationProduct.prodPrice }}</div>
          </div>
        </div>
        <div class="operate-box" v-if="formData.generateType === 1 && routeType">
          <div class="search-item">
            <t-input-number size="large" :decimal-places="0" :min="0" :max="9" v-model="searchData.generateCount" placeholder="请输入你要生成的数量" />

            <div class="generate" @click="addEquity">
              <div class="generate-item">立即生成</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="basicsForm">
      <div class="common">
        <div class="icon"></div>
        <div class="commonContent">生成记录</div>
      </div>
      <div class="search-box">
        <div class="activate-top">
          <div class="activate-item">
            <div class="activate-ID">激活码ID：</div>
            <t-input class="item-input" :min="0" v-model="newSearchData.activeId" placeholder="请输入激活码ID" />
            <div class="activate-ID">营销人员：</div>
            <t-input class="item-input" v-model="newSearchData.employeeName" placeholder="请输入营销人员" />
            <div class="activate-ID">状态：</div>
            <t-select class="item-input" clearable v-model="newSearchData.status" :options="serviceStatus" placeholder="请选择"></t-select>
          </div>
          <div class="controls">
            <div class="search" @click="searchEquity">
              <div class="search-btn">搜索</div>
            </div>
            <div class="rest" @click="rest">
              <div class="rest-btn">重置</div>
            </div>
            <div class="search" v-if="!routeType" @click="deriveEquity">
              <div class="search-btn">导出</div>
            </div>
          </div>
        </div>

        <t-table row-key="index" :bordered="false" :data="detailData" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="auto">
          <template #begnTime="{ row }">
            <span>{{ row.begnTime }}--{{ row.endTime }}</span>
          </template>
          <template #phone="{ row }">
            <span v-if="row.phone">{{ row.phone }}</span>
            <span v-else>--</span>
          </template>
          <template #employeeName="{ row }">
            <span v-if="row.employeeName">{{ row.employeeName }}</span>
            <span v-else>--</span>
          </template>
          <template #userName="{ row }">
            <span v-if="row.userName">{{ row.userName }}</span>
            <span v-else>--</span>
          </template>
          <template #status="{ row }">
            <span v-if="row.status === 0">已生成</span>
            <span v-if="row.status === 1">已激活</span>
            <span v-if="row.status === 2">已使用</span>
            <span v-if="row.status === 3">已失效</span>
          </template>
          <template #updateTime="dataTime">
            <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
          </template>
        </t-table>
        <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import axios from 'axios'; // 引入axios
import { AddIcon, SearchIcon, EditIcon, BooksIcon } from 'tdesign-icons-vue-next';
import { getServiceIdEquity, generServiceEquity, queryGenerServiceEquity, exportEquityCardLog } from '@/request/modules/ServiceApi';
import { debounce } from '@/utils/tools';
import { MessagePlugin, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon
  },
  setup() {
    const token = localStorage.getItem('x-auth-token');
    axios.defaults.headers.common['token'] = token;
    const router = useRouter();
    const route = useRoute();
    const setArrt = reactive({
      searchData: {
        createTime: '',
        createUser: '',
        remark: '',
        id: 0,
        activeId: '',
        status: '',
        employeeName: '',
        pageNum: 1,
        pageSize: 5,
        generateCount: 0
      },
      newSearchData: {
        createTime: '',
        createUser: '',
        remark: '',
        activeId: '',
        status: '',
        employeeName: '',
        pageNum: 1,
        pageSize: 5,
        generateCount: 0
      },
      detailData: [],
      columns: [
        { colKey: 'activeId', title: '激活ID', align: 'center' },
        { colKey: 'userName', title: '客户姓名', align: 'center' },
        { colKey: 'phone', title: '联系方式', align: 'center' },
        { colKey: 'begnTime', title: '有效期', align: 'center' },
        { colKey: 'employeeName', title: '营销人员', align: 'center' },
        {
          colKey: 'status',
          title: '状态',
          slots: { customRender: 'status' },
          align: 'center'
        },
        {
          colKey: 'updateTime',
          title: '操作时间',
          slots: { customRender: 'updateTime' },
          align: 'center'
        }
      ],
      id: 0,
      serviceStatus: [
        { label: '全部', value: '' },
        { label: '已生成', value: 0 },
        { label: '已激活', value: 1 },
        { label: '已使用', value: 2 },
        { label: '已失效', value: 3 }
      ],
      proOption: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      typeOption: [
        { label: '手动生成', value: 1 },
        { label: '接口生成', value: 2 }
      ],
      interveneOption: [
        { label: '30天', value: 1 },
        { label: '90天', value: 2 },
        { label: '全年', value: 3 }
      ],
      relationProduct: {
        prodName: '',
        mainPic: '',
        prodDescribe: '',
        prodPrice: 0
      },
      serviceRule: {
        checkCount: 0,
        interveneCycle: 0,
        checkInterval: 0,
        createTime: ''
      },
      total: 0,
      formData: {
        activeCount: 0,
        channel: '',
        channelId: 0,
        checkInterval: 0,
        createTime: '',
        createUser: '',
        equityName: '',
        generateCount: 0,
        generateType: 0,
        isDelete: 0,
        maxGenerate: undefined,
        prodId: [] as any,
        remark: '',
        status: 1,
        usedCount: 0,
        validity: 0,
        generateName: '',
        channelName: '',
        type: ''
      }
    });
    const routeType = ref<any>('');
    onMounted(() => {
      if (route.query.type) {
        routeType.value = route.query.type;
      }
      if (route.query.id) {
        setArrt.searchData.id = Number(route.query.id);
        getEquityDetail(setArrt.searchData.id);
        getCardList();
      }
    });

    const searchEquity = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getCardList();
    };
    //导出exportEquityCardLog
    const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/zskj/admin/';
    const deriveEquity = () => {
      axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json' //'Access-Control-Allow-Origin'
        },
        url: uploadUrl + 'equityService/exportEquityCardLog',
        responseType: 'blob',
        data: setArrt.searchData
      }).then(res => {
        let content_disposition: string = res.headers['content-disposition'];
        console.log(content_disposition);
        let filename = decodeURI(content_disposition.split(';')[1].split('=')[1]);
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        let url = window.URL.createObjectURL(blob);
        console.log(url);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      });
    };

    //获取详情
    const getEquityDetail = (id: number) => {
      getServiceIdEquity({ id: id }).then((res: any) => {
        if (res.code === 200) {
          setArrt.relationProduct = res.data.relationProduct;
          setArrt.serviceRule = res.data.serviceRule;
          setArrt.formData = res.data;
        }
      });
    };
    // 点击新增记录卡
    // 需要添加防抖
    const addEquity = () => {
      generServiceEquity(setArrt.searchData as any).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success(res.data);
          getCardList();
        }
      });
    };

    // 获取记录列表
    const getCardList = () => {
      queryGenerServiceEquity(setArrt.searchData as any).then((res: any) => {
        if (res.code === 200) {
          setArrt.detailData = res.data.data;
          setArrt.total = res.data.total;
        }
      });
    };

    const rest = () => {
      setArrt.searchData = {
        createTime: '',
        createUser: '',
        remark: '',
        id: setArrt.searchData.id,
        activeId: '',
        status: '',
        employeeName: '',
        pageNum: 1,
        pageSize: 5,
        generateCount: 0
      };
      setArrt.newSearchData = {
        createTime: '',
        createUser: '',
        remark: '',
        activeId: '',
        status: '',
        employeeName: '',
        pageNum: 1,
        pageSize: 5,
        generateCount: 0
      };
      getCardList();
    };

    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getCardList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getCardList();
    };
    //返回
    const artBack = () => {
      router.go(-1);
    };

    return {
      ...toRefs(setArrt),
      pageSizeChange,
      routeType,
      currentChange,
      searchEquity,
      deriveEquity,
      addEquity,
      artBack,
      rest
    };
  }
};
</script>

<style lang="scss" scoped>
.mark-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow-y: auto;
  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .box-left {
      display: flex;
      align-items: center;

      .img-btn {
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 30px;
      }
    }

    .expansion {
      margin-right: 50px;
      font-size: 20px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #919191;
      line-height: 28px;

      img {
        width: 12px;
        height: 6.72px;
        margin-right: 3.36px;
      }
    }
  }
  .basicsForm {
    background: #ffffff;
    border-radius: 10px;
    margin-bottom: 16px;
    padding-bottom: 20px;
    .equity-box {
      display: flex;
      margin: 20px 0 20px 28px;
      width: 319px;
      height: 97px;
      background: #f6f6f6;
      border-radius: 8px;
      .operate-box {
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        .search-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 26px;
          .generate {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 102px;
            height: 40px;
            background: #3d7eff;
            border-radius: 6px;
            margin-left: 10px;
            cursor: default;
            .generate-item {
              font-size: 16px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              line-height: 22px;
            }
          }
        }
      }
      .box-equity {
        display: flex;
        justify-content: space-between;

        .box-left {
          margin: 8px 0 8px 8px;
        }
        .box-right {
          position: relative;
          margin: 10px 8px 8px 8px;
          .right-name {
            width: 204px;
            height: 20px;
            font-size: 14px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            color: #222222;
            line-height: 20px;
            overflow: hidden; //超出文本隐藏
            white-space: nowrap; //不换行，只显示一行
            text-overflow: ellipsis; //超出部分省略号显示
          }
          .right-dec {
            width: 216px;
            height: 30px;
            font-size: 10px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 15px;
            overflow: hidden; //超出文本隐藏
            text-overflow: ellipsis; ///超出部分省略号显示
            display: -webkit-box; //弹性盒模型
            -webkit-box-orient: vertical; //上下垂直
            -webkit-line-clamp: 2; //自定义行数
          }
          .right-price {
            position: absolute;
            width: 55px;
            height: 27px;
            font-size: 20px;
            font-family: Oswald, Oswald;
            font-weight: 500;
            color: #222222;
            line-height: 27px;
            right: 7px;
            .price {
              width: 9px;
              height: 20px;
              font-size: 14px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: bold;
              color: #222222;
              line-height: 20px;
            }
          }
        }
      }
    }
    .search-box {
      padding: 20px 0 20px 28px;
      .activate-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 19px;
        padding-right: 22px;
        .activate-item {
          display: flex;
          align-items: center;
          .activate-ID {
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #747584;
            line-height: 22px;
          }
          .item-input {
            width: 180px;
            background: #ffffff;
            border-radius: 8px;
            margin-right: 8px;
          }
        }
        .controls {
          display: flex;
          align-items: center;
          .search {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72px;
            height: 34px;
            background: #3d7eff;
            border-radius: 6px;
            cursor: default;
            .search-btn {
              width: 32px;
              height: 22px;
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              line-height: 22px;
            }
          }
          .rest {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72px;
            height: 34px;
            background: #f1f6ff;
            border-radius: 6px;
            border: 1px solid #3d7eff;
            cursor: default;
            margin: 0 10px;
            .rest-btn {
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              color: #3d7eff;
              line-height: 22px;
            }
          }
        }
      }

      .box-title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
        margin-bottom: 15px;

        .title-content {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 30px;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #2a2a2a;
          line-height: 18px;
          .title-bg {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 18px;
            background: #3d7eff;
            border-radius: 4px;
            border: 1px solid #3d7eff;
            margin-left: 10px;
            .bg-font {
              font-size: 11px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 16px;
            }
          }
        }
      }
      .nameCommon {
        margin-bottom: 15px;
      }

      .box-name {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name-title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #747584;
          line-height: 22px;
          flex: 1;
          .name-content {
            margin-left: 30px;
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #2a2a2a;
            line-height: 18px;
          }
          .intervalCommon {
            margin-left: 47px;
          }
        }
      }
    }
  }
  //通用
  .common {
    display: flex;
    align-items: center;
    padding-top: 26px;
    padding-left: 20px;

    .icon {
      width: 6px;
      height: 15px;
      background: #5766fe;
      border-radius: 3px;
      margin-right: 4px;
    }
    .commonContent {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 25px;
    }
  }

  .t-pagination {
    margin-top: 30px;
  }
}
</style>
