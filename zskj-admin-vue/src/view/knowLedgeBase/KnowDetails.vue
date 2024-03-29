<template>
  <div class="report-box">
    <div class="box-img" @click="handlerRest">
      <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
      <t-button class="img-btn" theme="default" variant="text">新增套餐</t-button>
    </div>
    <div class="box-content">
      <t-form ref="form" layout="inline">
        <div class="content-name">
          <t-form-item label="套餐名称:" requiredMark initial-data="123456">
            <t-input :style="{ width: '200px' }" v-model="formName" :maxlength="30" auto-width />
          </t-form-item>
        </div>

        <div class="content-fen">
          <t-form-item label="食物分类:" requiredMark initial-data="123456">
            <t-checkbox-group requiredMark v-model="value1" :options="foodsLabel" @change="onChangeClass" />
          </t-form-item>
        </div>

        <div class="content-img">
          <t-form-item label="套餐主图" requiredMark initial-data="123456">
            <t-upload
              ref="uploadRef"
              v-model="fileList"
              :defaultFiles="(imgFile as any)"
              theme="image"
              :size-limit="{ size: 2, unit: 'MB' }"
              :action="uploadUrl"
              :formatResponse="formatImgResponse"
              accept="image/*"
              @remove="formImage = ''"
              :headers="headers"
              :beforeAllFilesUpload="checkUpload"
              :onSuccess="handleUpload"
              tips="请上传115px*72px图片"
              :locale="{ triggerUploadText: { image: '请选择图片' } }"
            ></t-upload>
          </t-form-item>
          <t-form-item initial-data="123456">
            <div class="content-btn">
              <t-button variant="outline" size="large" theme="primary" @click="handlerRest">取消</t-button>
              <t-button class="search-item" size="large" theme="primary" @click="handlerSubmit">确定</t-button>
            </div>
          </t-form-item>
        </div>
      </t-form>
    </div>

    <div class="box-details">
      <div v-if="knowVinList != ''" class="box-details-item" v-for="(item, index) of knowVinList" :key="item.id">
        <t-checkbox :checked="setArrt.newArr.includes(item.id)" @change="onChange(item)"> </t-checkbox>
        <t-card class="details-card">
          <div class="card-img"><t-image :src="item.accessUrl" :style="{ width: '115px', height: '72px' }" /></div>
          <div class="card-name">{{ item.name }}</div>
          <div class="card-categoryName">{{ item.categoryName }}</div>
          <div class="card-updateTime">{{ item.updateTime }}</div>
        </t-card>
      </div>
      <div class="detailsData" v-else>
        <div class="detailsNo"><span class="detailsNo-item">暂无数据</span></div>
      </div>
    </div>
    <t-pagination :pageSize="setArrt.searchData.pageSize" v-model:current="setArrt.searchData.pageNum" :pageSizeOptions="[]" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
  </div>
</template>

<script lang="ts" setup name="KnowDetails">
import { reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { knowList, knowDetails, knowDict } from '../../request/modules/knowledge';
import { useRouter } from 'vue-router';
const router = useRouter();
const knowVinList = ref<any>([]);
const formName = ref<any>('');
const imgFile = ref<any>([]); //图片
const formImage = ref<any>(''); //图片展示
const fileList = ref<any>([]);
const headers = ref<any>({}); //图片头部携带
const foodsLabel = ref<any>('');
const setArrt = reactive<any>({
  searchData: {
    // category: '',
    categoryIdList: [],
    pageNum: 1,
    pageSize: 24
  },
  total: 11,
  data: [],
  addVisible: false,

  newArr: [],
  selectedArr: []
});
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
const value1 = ref([]);
const checked = ref(false);
const foodsSet = ref<any>([]);
onMounted(() => {
  getKnowLedgeList();
  knowGetDict();
  let token = localStorage.getItem('x-auth-token');
  headers.value = {
    token: token
  };
});
const cover = 'https://tdesign.gtimg.com/site/source/card-demo.png';
const getKnowLedgeList = () => {
  knowList(setArrt.searchData).then((res: any) => {
    knowVinList.value = res.data.data;
    setArrt.total = res.data.total;
    console.log(res, 'res');
  });
};
const knowGetDict = () => {
  knowDict({ dictType: 'diet' }).then((res: any) => {
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
  console.log(foodsSet.value);
  let params = {
    pageNum: 1,
    pageSize: 24,
    interventionPlanCategory: 'diet',
    // category: foodsSet.value
    categoryIdList: foodsSet.value,
    model: '0'
  };
  knowList(params).then((res: any) => {
    knowVinList.value = res.data.data;
  });
};
//确定
const handlerSubmit = () => {
  knowDetails({
    comboId: '',
    // categoryIds: foodsSet.value,
    categoryIdList: foodsSet.value,
    comboName: formName.value,
    relatedIds: setArrt.newArr,
    comboImage: formImage.value,
    knowledgeType: 'diet'
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
//上传照片

const handleUpload = (context: any) => {
  console.log('context', context);
  formImage.value = context.response.url;
};
const checkUpload = (files: any[]): boolean | Promise<boolean> => {
  // return true
  return new Promise(function (resolve, reject) {
    let width = 115;
    let height = 72;
    let url = '';
    console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL);
    if (window.webkitURL != undefined) {
      url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
    } else if (window.URL != undefined) {
      url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
    }
    let img = new Image();
    img.onload = function () {
      console.log('img.width', img.width, img.height);
      let valid = img.width == width && img.height == height;
      if (valid) {
        resolve(true);
      } else {
        MessagePlugin.warning('图片尺寸(115px*72px)不符合标准！');
        reject(false);
      }
    };
    img.src = url;
  });
};
const formatImgResponse = (response: any) => {
  return { name: response.data.originalFilename, url: response.data.url };
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
    .img-btn {
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 30px;
    }
  }
  .box-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .content-name {
      display: flex;
      align-items: center;
      // flex-grow:1;

      .name-title {
        color: #000;
        font-size: 14px;
      }
    }
    .content-fen {
      display: flex;
      align-items: center;
      .name-title {
        font-size: 14px;
      }
      ::v-deep(.t-checkbox__input) {
        border-radius: 8px;
        width: 16px;
        height: 16px;
      }
      ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input) {
        background-color: #24c07b;
        border-color: #24c07b;
      }
    }
    .content-img {
      display: flex;
      align-items: center;
    }
    .content-btn {
      display: flex;
      align-items: center;
      .search-item {
        margin-left: 30px;
      }
    }
  }

  .box-details {
    margin-top: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .box-details-item {
      position: relative;
    }
    ::v-deep(.t-checkbox) {
      position: absolute;
      z-index: 999;
      top: 10px;
      right: 20px;
    }
    ::v-deep(.t-checkbox__input) {
      border-radius: 8px;
      width: 16px;
      height: 16px;
    }
    ::v-deep(.t-checkbox.t-is-checked .t-checkbox__input) {
      background-color: #24c07b;
      border-color: #24c07b;
    }

    .details-card {
      width: 216px;
      height: 222px;
      background: #ffffff;
      box-shadow: 0px 2px 4px 0px #fafbff;
      border-radius: 8px;
      border: 1px solid #dadce4;
      margin-right: 19px;
      margin-bottom: 11px;
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
  }
  ::v-deep(.t-form__controls) {
    margin: 0 !important;
  }
  ::v-deep(.t-form__item) {
    display: flex;
    align-items: center;
  }
  ::v-deep(.t-form__label) {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a7a8af;
    line-height: 22px;
  }
  .detailsData {
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
