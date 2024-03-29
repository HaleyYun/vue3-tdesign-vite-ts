<template>
  <div class="report-box">
    <div class="box-img" @click="handlerRest">
      <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
      <t-button class="img-btn" theme="default" variant="text">新增套餐</t-button>
    </div>
    <div class="content-box">
      <t-form ref="form" layout="inline">
        <!-- <div class="search-item">
        <t-form-item label="套餐ID:"  requiredMark initial-data="123456">
          <t-input class="ipt-slt" :maxlength="10" v-model="setArrt.idName" placeholder="请输入套餐ID" />
        </t-form-item>
      </div> -->
        <div class="search-item">
          <t-form-item label="套餐名称:" requiredMark initial-data="123456">
            <t-input class="ipt-slt" :maxlength="30" v-model="formName" auto-width />
          </t-form-item>
        </div>
        <div class="search-item">
          <t-form-item label="运动分类:" requiredMark initial-data="123456">
            <span> <t-checkbox-group v-model="value1" :options="foodsLabel" @change="onChangeClass" /></span>
          </t-form-item>
        </div>
        <t-form-item initial-data="123456">
          <div class="box-content search-item">
            <t-button class="box-content-item"  size="large"  variant="outline" theme="primary" @click="handlerRest">取消</t-button>
            <t-button  theme="primary" size="large"  @click="handlerSubmit">确定</t-button>
          
          </div>
        </t-form-item>
      </t-form>
    </div>
    <div  class="box-details">
      <div v-if="knowVinList != ''" class="itemContent" v-for="(itemList, index) of knowVinList" :key="itemList.id">
        <t-checkbox :checked="setArrt.newArr.includes(itemList.id)" @change="onChangeCheck(itemList)" />
        <div class="itemContent-item">
          <div class="content-item-name">
            <span style="margin-right: 10px">ID:{{ itemList.id }}</span>
            <span>{{ itemList.name }}</span>
          </div>
          <div class="content-img">
            <t-image :src="itemList.accessUrl" :style="{ width: '195px', height: '154px', borderRadius: '8px' }" />
          </div>
        </div>
        <div class="content-count" v-for="(item, index) of itemList.videoDTOS" :key="index">
          <t-card class="content-video">
            <div class="card-img">
              <video loop :autoplay="false" :style="{ height: '72px', width: '115px', borderRadius: '8px' }" @click="onChangeList(item.videoUrl)" :src="item.videoUrl"></video>
            </div>
            <div class="card-name">{{ item.description }}</div>
            <div class="card-categoryName">分类：{{ itemList.categoryName }}</div>
            <div class="card-updateTime">{{ itemList.createTime }}</div>
          </t-card>

          <div class="item-count" v-if="item != itemList.videoDTOS[itemList.videoDTOS.length - 1]">
            <div>
              <div class="count" v-if="item.count == 0"></div>
              <div class="count" v-if="item.count == 1">休息5分钟</div>
              <div class="count" v-if="item.count == 2">休息10分钟</div>
              <div class="count" v-if="item.count == 3">休息20分钟</div>
            </div>
            <div v-if="item.count != 0">
              <img src="../../assets/img/knowledge/left-icon.png" alt="图标" />
            </div>
          </div>
        </div>
      </div>
      <div class="detailsData" v-else>
        <div class="detailsNo"><span class="detailsNo-item">暂无数据</span></div>
      </div>
    </div>

    
    <div class="pageInfo">
      <t-pagination :pageSize="setArrt.searchData.pageSize" v-model:current="setArrt.searchData.pageNum" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
  </div>

  <t-dialog v-model:visible="setArrt.videoVisible" destroy-on-Close header="视频" width="600px" @confirm="submitVideo">
    <div class="videoItem">
      <video loop autoplay style="height: 500px; width: 100%" :src="setArrt.videoItem"></video>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { knowList, addSportsDetails, knowDict, sportsPageList } from '../../request/modules/knowledge';
import { useRouter } from 'vue-router';
const router = useRouter();
const knowVinList = ref<any>();
const formName = ref<any>('');
const constKey = ref<number>(0);
const formImage = ref<any>(''); //图片展示
const fileList = ref<any>([]);
const headers = ref<any>({}); //图片头部携带
const foodsLabel = ref<any>('');
const setArrt = reactive<any>({
  searchData: {
    categoryIdList: [],
    pageNum: 1,
    pageSize: 5
  },
  knowledgeType: {
    knowledgeType: 'sports',
    pageNum: 1,
    pageSize: 5
  },
  videoItem: '',
  idName: '',
  total: 11,
  data: [],
  addVisible: false,
  videoVisible: false,

  newArr: [],
  selectedArr: []
});
const value1 = ref([]);
const foodsSet = ref<any>([]);
onMounted(() => {
  getKnowLedgeList();
  knowGetDict();
  let token = localStorage.getItem('x-auth-token');
  headers.value = {
    token: token
  };
});

const getKnowLedgeList = () => {
  sportsPageList(setArrt.searchData).then((res: any) => {
    knowVinList.value = res.data.data;
    console.log(knowVinList.value, 'knowVinList.value');

    setArrt.total = res.data.total;
  });
};
const knowGetDict = () => {
  knowDict({ dictType: 'sports' }).then((res: any) => {
    if (res.code === 200) {
      foodsLabel.value = res.data.map((item: any) => {
        return {
          label: item.dictLabel,
          value: item.id
        };
      });
    }
  });
};

//分类中的详情id
const onChange = (selectItem: any) => {
  console.log(selectItem, 'selectItem');

  selectItem.selected = !selectItem.selected;
  let checked = selectItem.selected; //是否选中
  let checkId = selectItem.id; //选中的id
  if (checked) {
    // 正选
    setArrt.newArr.push(selectItem.id);
  }
  if (!checked) {
    //反选
    setArrt.newArr.splice(setArrt.newArr.indexOf(checkId), 1);
  }
  console.log(setArrt.newArr, 'setArrt.newArr');
};

//多选分类
const onChangeClass = (val: any) => {
  foodsSet.value = val;
  let params = {
    pageNum: 1,
    pageSize: 5,
    interventionPlanCategory: 'sports',
    // category: foodsSet.value,
    categoryIdList: foodsSet.value,
    model: '0'
  };
  //点击分类
  sportsPageList(params).then((res: any) => {
    if (res.code == '200') {
      knowVinList.value = res.data.data;
      // constKey.value++;
      // setArrt.newArr = [];
    }
  });
};
//确定
const handlerSubmit = () => {
  addSportsDetails({
    comboId: setArrt.idName,
    categoryIdList: foodsSet.value,
    comboName: formName.value,
    relatedIds: setArrt.newArr,
    comboImage: formImage.value,
    knowledgeType: 'sports'
  }).then((res: any) => {
    if (res.code === 200) {
      MessagePlugin.success('添加成功');
      router.go(-1);
    } else {
      // MessagePlugin.success(res.msg);
    }
  });
};
//取消
const handlerRest = () => {
  router.go(-1);
};
//分页
const pageSizeChange = (pageSize: any) => {
  setArrt.searchData.pageSize = pageSize;
  setArrt.searchData.pageNum = 1;
  getKnowLedgeList();
};
const currentChange = (current: number) => {
  setArrt.searchData.pageNum = current;
  getKnowLedgeList();
};
//点击视频播放
const onChangeList = (item: any) => {
  setArrt.videoItem = item;
  setArrt.videoVisible = true;
};

const onChangeCheck = (selectItem: any) => {
  formImage.value = selectItem.accessUrl;
  selectItem.selected = !selectItem.selected;
  let checked = selectItem.selected; //是否选中
  let checkId = selectItem.id; //选中的id
  if (checked) {
    // 正选
    setArrt.newArr.push(selectItem.id);
  }
  if (!checked) {
    //反选
    setArrt.newArr.splice(setArrt.newArr.indexOf(checkId), 1);
  }
  console.log(setArrt.newArr, 'setArrt.newArr');
};
const submitVideo = () => {
  setArrt.videoVisible = false;
};
</script>

<style lang="scss" scoped>
.report-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .box-img {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    .img-btn {
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 30px;
    }
  }

  .content-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 10px;
    padding-left: 20px;

    ::v-deep(.t-checkbox__input) {
      border-radius: 8px;
      width: 16px;
      height: 16px;
    }
    ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input) {
      background-color: #24c07b;
      border-color: #24c07b;
    }
    ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input::after) {
      top: 6px;
      left: 3px;
    }
    .box-content {
      // justify-content: space-between;
    }
    .box-content-item {
      margin-right: 50px;
    }
    .search-item {
      margin-right: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      .ipt-slt {
        width: 180px;
        margin-left: 5px;
      }
    }
  }

  .report-category {
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .category-tittle {
      display: block;
    }
  }

  .box-details {
    width: 100%;
    // height: 100%;
    position: relative;
    padding-top: 50px;
    ::v-deep(.t-checkbox__input) {
      position: absolute;
      margin-right: 9px;
      z-index: 999;
      width: 32px;
      height: 32px;
      border-radius: 32px;
      top: 82px;
      left: 12px;
      background: linear-gradient(180deg, #fefefe 0%, #b9b9b9 100%);
      border: 1px solid #979797;
    }
    ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input) {
      background-image: url('../../assets/img/knowledge/knowIcon.png');
    }
    ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input::after) {
      top: 11px;
      left: 3px;
      width: 15px;
      height: 30px;
      border: none;
    }

    ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input) {
      border-color: #24c07b !important;
      background-color: transparent !important;
      transition: none;
    }

    .content-img {
      margin-right: 29px;
      margin-left: 52px;
    }
    .itemContent {
      display: flex;
      // flex-wrap: wrap;
      .itemContent-item {
        height: 100%;
        margin-left: 20px;
        .content-item-name {
          font-size: 16px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 22px;
          margin-left: 52px;
        }
      }
    }
    .content-count {
      display: flex;
      align-items: center;
      .content-video {
        width: 216px;
        height: 222px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px #fafbff;
        border-radius: 8px;
        border: 1px solid #dadce4;
        margin-bottom: 84px;
        // margin-right: 97px;
        .card-img {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .card-name {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 25px;
          margin-bottom: 5px;
        }
        .card-categoryName {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6f6c7b;
          margin-bottom: 12px;
        }
        .card-updateTime {
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #9d9ca0;
          line-height: 21px;
        }
      }
      .item-count {
        margin: 0 20px;
        .count {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #686868;
          line-height: 22px;
        }
      }
    }
  }
  ::v-deep(t-checkbox__label) {
    margin-left: 15px !important;
  }
  ::v-deep(.t-checkbox) {
    display: inline !important;
  }

  .fileItem {
    margin-bottom: 10px;
  }

  .videoContent video {
    width: 100%;
    height: 100%;
    object-fit: fill;
    // object-fit: cover;
  }
  .content-check {
    margin-top: 277px;
  }
  .videoItem {
    width: 100%;
    height: 100%;
  }
  .info-box-card {
    display: flex;
    flex-wrap: wrap;
    margin: 15px;
    width: 300px;
    height: 200px;
  }
  // ::v-deep(.t-form__item){
  //   display: flex;
  // }
  ::v-deep(.t-form__label) {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a7a8af;
    // line-height: 22px;
  }
  .detailsData{
    width: 100%;
    .detailsNo {
    width: 100%;
    height: 225px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    .detailsNo-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a7a8af;
      line-height: 22px;
    }
  }
  }
}
</style>
