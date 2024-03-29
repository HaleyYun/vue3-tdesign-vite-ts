<template>
  <div class="report-box">
    <div class="box-img" @click="handlerRest">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">膳食套餐</t-button>
      </div>

      <!-- <div class="expansion">
        <div v-if="knowVinList.length > 3">
          <div v-if="displayNum == 3" @click="displayNum = knowVinList.length">展开 <img src="../../assets/img/custom/develop.png" alt="" /></div>
          <div v-else @click="displayNum = 3">
            收起
            <img src="../../assets/img/custom/contract.png" alt="" />
          </div>
        </div>
      </div> -->
    </div>
    <!-- <div class="info-box">
      <div v-if="knowVinList">
        <div class="info-box-card">
          <t-card class="card-item" v-for="(item, index) of knowVinList" v-show="index < displayNum" :style="{ width: '280px' }">
            <div class="cardContent">
              <div class="content-left">
                <img src="../../assets/img/knowledge/edit.png" :style="{ width: '276px', height: '108px' }" />
                <div class="textComboName">{{ item.comboName }}</div>
              </div>
              <div>
                <div class="text-Id">ID:{{ item.id }}</div>
                <div class="text-btn">
                  <div class="editText" @click="editView(item)"><div class="editText-item">编辑</div></div>
                  <t-popconfirm theme="default" @click.stop @confirm="knowDel(item.id)" content="确认删除吗">
                    <div class="delText"><div class="delText-item">删除</div></div>
                  </t-popconfirm>
                </div>
              </div>
            </div>
          </t-card>
          <div class="card-plus">
            <div class="add-item" @click="addView">
              <div class="icon-plus">
                <img src="../../assets/img/knowledge/add.png" alt="图标" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="search-box">
      <div class="search-item search-item-font">菜品名称：<t-input class="ipt-slt" v-model="setArrt.titleData.recipeName" auto-width :onKeyUp="(setArrt.titleData.recipeName = setArrt.titleData.recipeName.replace(/\s*/g, ''))" placeholder="请输入菜品名称" /></div>
      <div class="search-item search-item-font">
        菜品分类：
        <t-select class="ipt-slt" :options="proOption" v-model="setArrt.titleData.recipeType" placeholder="请选择"></t-select>
      </div>

      <t-button class="search-item search-item-font" theme="primary" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
    </div>
    <div class="operate-box">
      <!-- <t-button class="add-item" variant="outline" theme="primary" @click="addItem">
          <template #icon>
            <AddCircleIcon />
          </template>
          新增</t-button
        > -->
      <t-button class="btn-item" theme="primary" @click="addItem">
        <template #icon> <AddIcon /> </template>新增
      </t-button>
      <div class="out-item" @click="allItem"><span class="item">全部食材</span></div>
    </div>
    <div class="content-box">
      <load :status="loadStatus" :schedule="schedule" v-if="setArrt.data?.length == 0"></load>
      <div v-else>
        <t-table :max-height="fixedTopRows ? 1400 : 365" row-key="index" :data="setArrt.data" :columns="(reportColumns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false">
          <template #picUrl="{ row }">
            <!-- <t-image :src="row.accessUrl" :style="{ width: '120px', height: '50px' }" /> -->
            <div class="tdesign-demo-image-viewer__base">
              <t-image-viewer :images="[row.picUrl]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img alt="test" :src="row.picUrl" class="tdesign-demo-image-viewer__ui-image--img" />
                    <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                      <span> <BrowseIcon size="1.4em" /> 预览 </span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
          </template>
          <template #action="{ row }">
            <div class="text-row">
              <t-button size="small" variant="text" @click="editDetails(row.id)" theme="success">编辑</t-button>
              <t-popconfirm theme="default" @click.stop @confirm="deleteDetails(row.id)" content="确认删除吗">
                <t-button variant="text" theme="danger" size="small">删除</t-button>
              </t-popconfirm>
            </div>
          </template>
        </t-table>
        <t-pagination :pageSize="setArrt.searchData.pageSize" v-model:current="setArrt.searchData.pageNum" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>

    <t-dialog v-model:visible="setArrt.addVisible" :header="setArrt.dialogTitle" @confirm="submitForm">
      <t-form ref="form" :data="addFormData" :rules="(formRules as FormRules<Data>)">
        <!-- <t-form-item label="菜品ID" name="nameID" initial-data="TDesign">
          <t-input :maxlength="10" v-model="addFormData.nameID" :allowInputOverMax="false" placeholder="请输入菜品ID" />
        </t-form-item> -->
        <t-form-item label="名称" name="name" initial-data="123456">
          <t-input :allowInputOverMax="false" placeholder="请输入名称" v-model="addFormData.name" />
        </t-form-item>
        <t-form-item label="分类" name="itemType" requiredMark initial-data="123456">
          <t-select v-model="addFormData.value1" :options="foodsLabel" placeholder="请选择" filterable />
        </t-form-item>
        <t-form-item label="图片" name="img" initial-data="img">
          <t-upload
            ref="uploadRef"
            v-model="fileList"
            :defaultFiles="(imgFile as any)"
            theme="image"
            :size-limit="{ size: 2, unit: 'MB' }"
            :action="uploadUrl"
            :formatResponse="formatImgResponse"
            accept="image/*"
            @remove="addFormData.theme = ''"
            :headers="setArrt.headers"
            :beforeAllFilesUpload="checkUpload"
            :onSuccess="handleUpload"
            tips="请上传115px*72px图片"
            :locale="{ triggerUploadText: { image: '请选择图片' } }"
          ></t-upload>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { knowList, knowAddList, upload, knowEditList, knowDelList, knowComboList, knowDelComboList, knowDict, queryfoodList, deletefood } from '../../request/modules/knowledge';
import { useRouter } from 'vue-router';
import { BrowseIcon, AddIcon } from 'tdesign-icons-vue-next';
import { reportColumns } from './data/configuration';
import { MessagePlugin, FormRules, Data, UploadFile, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
import load from '../../components/load/load.vue';
const router = useRouter();
const knowVinList = ref<any>([]);
const uploadRef = ref();
const displayNum = ref<number>(3);
const imgFile = ref<any>([]); //图片
const fileList = ref<any>([]);
const setArrt = reactive<any>({
  searchData: {
    pageNum: 1,
    pageSize: 10,
    recipeName: '',
    recipeType: ''
  },
  titleData: {
    pageNum: 1,
    pageSize: 10,
    recipeName: '',
    recipeType: ''
  },
  knowledgeType: {
    knowledgeType: 'diet',
    pageNum: 1,
    pageSize: 10
  },

  total: 60,
  data: [],
  dialogTitle: '新建',
  value1: '123',
  addVisible: false,
  options: [
    { label: '苹果', value: '苹果' },
    { label: '小米', value: '小米' },
    { label: '高粱', value: '高粱' }
  ],
  headers: {
    token: ''
  }
});
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
const formImage = ref<any>(''); //图片展示
const foodsLabel = ref<any>([]);
//上传图片
const files = ref([]);
const disabled = ref(false);

const handleUpload = (context: any) => {
  console.log('context', context, imgFile);
  formImage.value = context.response.url;
};
const formRules = ref<any>({
  nameID: [{ required: true, message: '请输入菜品ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  img: [{ required: true, message: '请上传图片', trigger: 'blur' }]
});
const addFormData = reactive<any>({
  nameID: '',
  name: '',
  value1: '',
  accessUrl: '',
  categoryName: '',
  theme: ''
});
const form = ref<any>(null);
const fixedTopRows = ref<boolean>(false);
onMounted(async () => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  let token = localStorage.getItem('x-auth-token');
  setArrt.headers.token = token as string;
  getKnowLedgeList();
  // getKnowComboList();
  // await knowGetDict();
});
//后退
const handlerRest = () => {
  router.go(-1);
};

const getKnowComboList = () => {
  knowComboList(setArrt.knowledgeType).then((res: any) => {
    knowVinList.value = res.data;
  });
};
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
const getKnowLedgeList = () => {
  queryfoodList(setArrt.searchData).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (setArrt.data = []);
      } else {
        setArrt.data = res.data.data;
        setArrt.total = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (setArrt.data = []);
    }
    if (res.code == 200) {
      setArrt.data = res.data.data;
      setArrt.total = res.data.total;
    }
  });
  // knowList(setArrt.searchData).then((res: any) => {
  //   setArrt.data = res.data.data;
  //   setArrt.total = res.data.total;
  // });
};
const editDetails = (val: any) => {
  router.push({
    path: '/foodEditView',
    query: {
      id: val,
      title: '编辑'
    }
  });
  // fileList.value[0] = {
  //   name: '',
  //   url: val.accessUrl
  // };
  // console.log(val);
  // setArrt.dialogTitle = '编辑';
  // addFormData.nameID = val.id.toString();
  // addFormData.name = val.name;
  // addFormData.value1 = Number(val.category);
  // setArrt.addVisible = true;
};
const deleteDetails = (value: any) => {
  deletefood({ id: value }).then((res: any) => {
    if (res.code === 200) {
      MessagePlugin.success('删除成功');
      getKnowLedgeList();
    }
  });
  // knowDelList({
  //   id: value,
  //   comboId: undefined
  // }).then((res: any) => {
  //   if (res.code === 200) {
  //     MessagePlugin.success('删除成功');
  //     getKnowLedgeList();
  //   } else {
  //     // MessagePlugin.warning(res.msg);
  //   }
  // });
};
const addItem = () => {
  router.push({
    path: '/foodEditView',
    query: {
      title: '新增'
    }
  });
  // setArrt.dialogTitle = '新建';
  // setArrt.addVisible = true;
  // // addFormData.nameID = '';
  // addFormData.name = '';
  // addFormData.value1 = '';
  // formImage.value = '';
  // addFormData.categoryName = '';
  // fileList.value = [];
};
const submitForm = () => {
  if (setArrt.dialogTitle == '新建') {
    knowAddList({
      // id: addFormData.nameID,
      name: addFormData.name,
      category: addFormData.value1,
      accessUrl: formImage.value,
      interventionPlanCategory: 'diet',
      comboId: undefined
    }).then((res: any) => {
      if (res.code === 200) {
        setArrt.addVisible = false;
        MessagePlugin.success('添加成功');
        addFormData.nameID = '';
        addFormData.name = '';
        addFormData.value1 = '';
        getKnowLedgeList();
      } else {
        // MessagePlugin.success(res.msg);
      }
    });
  } else {
    knowEditList({
      id: addFormData.nameID,
      name: addFormData.name,
      category: addFormData.value1,
      accessUrl: fileList.value[0].url,
      interventionPlanCategory: 'diet',
      comboId: undefined
    }).then((res: any) => {
      if (res.code === 200) {
        setArrt.addVisible = false;
        MessagePlugin.success('编辑成功');
        getKnowLedgeList();
      } else {
        // MessagePlugin.success(res.msg);
      }
    });
  }
};
// //新增
// const addView = () => {
//   router.push({
//     path: '/knowDetails'
//   });
// };
// //编辑
// const editView = (item: any) => {
//   console.log(item, 'item');

//   router.push({
//     path: '/knowEditDetails',
//     query: {
//       id: item.id
//     }
//   });
// };

//删除套餐
// const knowDel = (value: any) => {
//   knowDelComboList({
//     id: value,
//     comboId: undefined
//   }).then((res: any) => {
//     if (res.code === 200) {
//       MessagePlugin.success('删除成功');
//       getKnowComboList();
//     } else {
//       MessagePlugin.warning(res.msg);
//     }
//   });
// };
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
const formatImgResponse = (response: any) => {
  return { name: response.data.originalFilename, url: response.data.url };
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

//全部食材
const allItem = () => {
  router.push({
    path: '/foodList'
  });
};
const proOption = ref<any>([
  { value: 1, label: '肉禽蛋' },
  { value: 2, label: '蔬菜' },
  { value: 3, label: '海鲜水产' },
  { value: 4, label: '面食' },
  { value: 5, label: '其他' }
]);

const search = () => {
  setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
  setArrt.searchData.pageNum = 1;
  getKnowLedgeList();
};
const rest = () => {
  setArrt.searchData = {
    pageNum: 1,
    pageSize: 10,
    recipeName: '',
    recipeType: ''
  };
  setArrt.titleData = {
    pageNum: 1,
    pageSize: 10,
    recipeName: '',
    recipeType: ''
  };
  getKnowLedgeList();
};
</script>

<style lang="scss" scoped>
.report-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .box-left {
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

  .info-tittle {
    font-size: 20px;
    font-family: 'Courier New', Courier, monospace;
  }

  .info-box {
    padding: 15px;

    .search-item {
      margin-right: 15px;
    }

    .info-box-card {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .card-item {
        margin-right: 12px;
        margin-bottom: 12px;
        // width: 269px;
        // height: 156px;
        background: #ffffff;
        box-shadow: 0px 0px 4px 0px rgba(87, 102, 254, 0.07);
        border-radius: 16px;

        .content-left {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .textComboName {
            position: absolute;
            font-size: 22px;
            font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
            font-weight: bold;
            color: #ffffff;
            line-height: 40px;
            text-shadow: 0px 2px 4px rgba(9, 45, 162, 0.71);
          }
        }
      }
    }

    .card-plus {
      width: 290px;
      height: 194px;
      position: relative;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;
      margin-bottom: 12px;

      .icon-plus {
        text-align: center;
        position: absolute;
        top: 50%;
        width: 100%;
        font-size: 10px;
        color: #262626;
        transform: translate(0, -50%);
      }
    }
  }

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
  .search {
    width: 90px;
    height: 32px;
    background: #3d7eff;
    box-shadow: 0px 2px 4px 0px #fafbff;
    border-radius: 6px;
    text-align: center;
    margin-right: 16px;

    .searchItem {
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      // font-weight: bold;
      color: #ffffff;
      line-height: 32px;
    }
  }

  .rest-item {
    width: 90px;
    height: 32px;
    background: #f1f6ff;
    box-shadow: 0px 2px 4px 0px #fafbff;
    border-radius: 6px;
    text-align: center;

    .rest {
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      // font-weight: bold;
      color: #3d7eff;
      line-height: 32px;
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .content-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;
  }

  .operate-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 15px;
    .btn-item {
      margin-left: 15px;
    }

    .add-item {
      background: #f4f8ff;
      box-shadow: 0px 2px 4px 0px #fafbff;
      border-radius: 6px;
    }

    .out-item {
      width: 122px;
      height: 32px;
      background: #3d7eff;
      box-shadow: 0px 2px 4px 0px #fafbff;
      border-radius: 6px;
      text-align: center;
      cursor: pointer;

      .item {
        font-size: 14px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        // font-weight: bold;
        color: #ffffff;
        line-height: 32px;
      }
    }
  }

  .box-btn {
    margin-left: 5px;
  }

  .text-btn {
    display: flex;
    justify-content: flex-end;

    .editText {
      width: 53px;
      height: 23px;
      background: #ffedd5;
      border-radius: 13px;
      // opacity: 0.46;
      cursor: pointer;

      .editText-item {
        font-size: 12px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #ee8317;
        line-height: 23px;
        text-align: center;
      }
    }

    .delText {
      width: 53px;
      height: 23px;
      background: #ffdbdb;
      border-radius: 13px;
      // opacity: 0.34;
      margin-left: 8px;
      cursor: pointer;

      .delText-item {
        font-size: 12px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #da1414;
        opacity: 1;
        line-height: 23px;
        text-align: center;
      }
    }
  }

  // .box-btn1 {
  //   margin-left: 5px;
  // }
  .text-row {
    display: flex;
    justify-content: center;

    .editText {
      width: 53px;
      height: 23px;
      background: #ffedd5;
      border-radius: 8px;
      // opacity: 0.46;
      cursor: pointer;

      .editText-item {
        font-size: 12px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #ee8317;
        line-height: 23px;
        text-align: center;
      }
    }

    .delText {
      width: 53px;
      height: 23px;
      background: #ffdbdb;
      border-radius: 8px;
      // opacity: 0.34;
      margin-left: 8px;
      cursor: pointer;

      .delText-item {
        font-size: 12px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #da1414;
        opacity: 1;
        line-height: 23px;
        text-align: center;
      }
    }
  }
}

.tdesign-demo-image-viewer__ui-image {
  width: 100%;
  height: 100%;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  // background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
  opacity: 1;
  cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
  border-radius: 5px;
}

.tdesign-demo-image-viewer__ui-image--footer {
  padding: 0 16px;
  height: 56px;
  width: 100%;
  line-height: 56px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
  flex: 1;
}

.tdesign-demo-popup__reference {
  margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
  cursor: pointer;
}

.tdesign-demo-image-viewer__base {
  // width: 160px;
  height: 50px;
  // border: 4px solid var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
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
