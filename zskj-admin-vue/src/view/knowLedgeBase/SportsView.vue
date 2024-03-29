<template>
  <div class="report-box">
    <!-- <div class="box-img">  
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">运动套餐</t-button>
      </div>

      <div class="expansion">
        <div v-if="knowVinList.length > 3">
          <div v-if="displayNum == 3" @click="displayNum = knowVinList.length">
            展开
            <img src="../../assets/img/custom/develop.png" alt="" />
          </div>
          <div v-else @click="displayNum = 3">
            收起
            <img src="../../assets/img/custom/contract.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div v-if="knowVinList">
        <div class="info-box-card">
          <t-card class="card-item" v-for="(item, index) of knowVinList" v-show="index < displayNum" :style="{ width: '280px' }">
            <div class="cardContent">
              <div class="content-left">
                <img src="../../assets/img/knowledge/movement.png" :style="{ width: '276px', height: '108px' }" />
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
    <div class="content-box">
      <div class="operate-box">
        <t-button theme="primary" @click="addItem">
          <template #icon>
            <AddIcon />
          </template>
          新增</t-button
        >
      </div>
      <load :status="loadStatus" :schedule="schedule" v-if="setArrt.dataList?.length == 0"></load>
      <div v-else>
        <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 500" :data="setArrt.dataList" :columns="(sportColumns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false">
          <template #type-slot-name="{ col, row }">
            <div class="tdesign-demo-image-viewer__base">
              <t-image-viewer :images="[row.accessUrl]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img alt="test" :src="row.accessUrl" class="tdesign-demo-image-viewer__ui-image--img" />
                    <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                      <span> <BrowseIcon size="1.4em" />预览 </span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
          </template>
          <template #action="{ row }">
            <div class="text-row">
              <t-button variant="text" size="small" @click="editDetails(row)" theme="success" ghost>编辑</t-button>
              <t-popconfirm theme="default" @click.stop @confirm="deleteDetails(row.id)" content="确认删除吗">
                <t-button variant="text" theme="danger" size="small"> 删除</t-button>
              </t-popconfirm>
            </div>
          </template>
        </t-table>
        <t-pagination :pageSize="setArrt.knowledgeList.pageSize" v-model:current="setArrt.knowledgeList.pageNum" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>

    <t-dialog v-model:visible="setArrt.addVisible" width="600px" :header="setArrt.dialogTitle" @confirm="submitForm">
      <t-form ref="form" :data="familyForm" :rules="(formRules as FormRules<Data>)">
        <!-- <t-form-item label="运动编码" requiredMark name="comboId" initial-data="TDesign">
          <t-input :maxlength="10" v-model="comboId" :allowInputOverMax="false" placeholder="请输组合ID" />
        </t-form-item> -->
        <t-form-item label="组合名称" name="name" initial-data="123456">
          <t-input :allowInputOverMax="false" placeholder="请输入名称" v-model="familyForm.name" />
        </t-form-item>
        <t-form-item label="组合分类" name="itemType" requiredMark initial-data="123456">
          <t-select v-model="familyForm.category" :options="foodsLabel" placeholder="请选择" filterable />
        </t-form-item>
        <t-form-item label="运动风险系数" name="risk">
          <t-input @change="riskreserve" placeholder="请输入运动风险系数" v-model="familyForm.risk" />
        </t-form-item>
        <t-form-item label="视频封面图片" name="img" initial-data="img">
          <t-upload
            ref="uploadRef"
            v-if="disUpload"
            v-model="fileList"
            :defaultFiles="(imgFile as any)"
            theme="image"
            :size-limit="{ size: 2, unit: 'MB' }"
            :action="uploadUrl"
            :formatResponse="formatImgResponse"
            accept="image/*"
            @remove="removeFile"
            :headers="headers"
            :beforeAllFilesUpload="checkUpload"
            :onSuccess="handleUpload"
            tips="请上传339px*300px图片"
            :locale="{ triggerUploadText: { image: '请选择图片' } }"
          ></t-upload>
          <div class="img-box" @click="browserUpload('fileList')" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">请上传339px*300px图片</div>
          </div>
          <cropper
            ref="clipperRef"
            :type="clipperData.type"
            :allow-type-list="clipperData.allowTypeList"
            :limit-size="clipperData.limitSize"
            :fixed-number="clipperData.fixedNumber"
            :fixed-number-aider="clipperData.fixedNumberAider"
            :preview-width="clipperData.previewWidth"
            :auto-crop-width="clipperData.autoCropWidth"
            :auto-crop-height="clipperData.autoCropHeight"
            @confirm="onConfirm"
          />
        </t-form-item>
      </t-form>
      <t-button @click="addItemList" theme="primary">添加训练内容</t-button>

      <div>
        <div style="background-color: #fff">
          <t-form ref="form" :data="familyForm" :rules="(formRules as FormRules<Data>)">
            <div class="trainingContent" v-for="(item, index) in familyForm.videoDTOS" :key="index">
              <div>
                <t-button variant="text" @click="deletedItem(index)" theme="primary" ghost>删除</t-button>
              </div>
              <t-row>
                <t-col :span="12">
                  <div class="sport-content">
                    <t-form-item label="训练内容" requiredMark name="video" initial-data="video">
                      <div class="formUpload">
                        <t-upload v-model="item.videoArr" :showUploadProgress="false" :action="uploadUrl" accept="video/*" :headers="headers" :onSuccess="videoUpload" :oneFileFail="handleRequestFail" :onRemove="onRequestRemove" :before-upload="beforeUpload" :index="index">
                          <t-button theme="primary">上传视频</t-button>
                          <!-- <view class="videoUrlStr" v-if="setArrt.sportId">{{ item.videoArr ? item.videoArr.slice(-4) : '' }}</view> -->
                        </t-upload>

                        <!-- <t-button class="sport-btn" :disabled="item.videoArr != '' ? false : true" theme="primary" @click="videoPreview(item.videoArr)">预览视频</t-button> -->
                        <t-button class="sport-btn" :disabled="item.videoArr != '' ? false : true" theme="primary" @click="videoPreview(item.videoArr)">预览视频</t-button>
                        <div @click="del(index)" class="delIndex">{{ item.videoArr != '' ? '×' : '' }}</div>
                      </div>
                    </t-form-item>
                  </div>
                </t-col>

                <t-col :span="12">
                  <div v-if="setArrt.sportId" class="sport-content">
                    <t-form-item label="url地址" name="itemDescription" requiredMark initial-data="123456">
                      <t-input :allowInputOverMax="false" placeholder="请输入" v-model="item.videoUrl" />
                    </t-form-item>
                  </div>
                  <div v-else class="sport-content">
                    <t-form-item label="url地址" name="itemDescription" requiredMark initial-data="123456">
                      <t-input :allowInputOverMax="false" placeholder="请输入" @change="imgChange" v-model="item.videoImg" />
                    </t-form-item>
                  </div>
                </t-col>

                <t-col :span="12">
                  <div class="sport-content">
                    <t-form-item label="视频名称" name="itemDescription" requiredMark initial-data="123456">
                      <t-input :allowInputOverMax="false" placeholder="请输入视频名称" v-model="item.description" />
                    </t-form-item>
                  </div>
                </t-col>

                <t-col :span="12">
                  <div class="sport-content">
                    <t-form-item label="视频顺序" name="videoSequence" requiredMark initial-data="123456">
                      <t-input-number :min="1" v-model="item.videoSequence" align="center" theme="normal" @change="numberChange"></t-input-number>
                    </t-form-item>
                  </div>
                </t-col>

                <t-col :span="12">
                  <div class="sport-content">
                    <t-form-item label="视频说明" name="itemDescription" requiredMark initial-data="123456">
                      <t-textarea :allowInputOverMax="false" placeholder="请输入视频说明" :maxlength="100" v-model="item.urlDesc" />
                    </t-form-item>
                  </div>
                </t-col>

                <t-col :span="12">
                  <div class="sport-content">
                    <t-form-item label="视频时间" name="itemDescription" requiredMark initial-data="123456">
                      <t-input :allowInputOverMax="false" :maxlength="2" placeholder="0" v-model="item.hour" style="width: 50px" />&nbsp; 时 &nbsp; <t-input :allowInputOverMax="false" :maxlength="2" placeholder="0" v-model="item.minutes" style="width: 50px" />&nbsp; 分 &nbsp;
                      <t-input :allowInputOverMax="false" :maxlength="2" placeholder="0" v-model="item.seconds" style="width: 50px" />&nbsp; 秒 &nbsp;
                    </t-form-item>
                  </div>
                </t-col>

                <t-col :span="12">
                  <t-form-item label="休息时间" name="itemTime" requiredMark initial-data="123456">
                    <t-radio-group v-model="item.count" @change="onChange">
                      <t-radio :value="0">不休息</t-radio>
                      <t-radio :value="1">5分钟</t-radio>
                      <t-radio :value="2">10分钟</t-radio>
                      <t-radio :value="3">20分钟</t-radio>
                    </t-radio-group>
                  </t-form-item>
                </t-col>
              </t-row>
            </div>
          </t-form>
        </div>
      </div>
    </t-dialog>
  </div>
  <t-dialog v-model:visible="videoVisible" destroy-on-Close width="60%" :confirmBtn="null">
    <div class="box-chart">
      <div class="dialog">
        <video loop autoplay style="height: 500px; width: 100%" :src="videoItem">
          <source :src="videoItem" type="video/mp4" />
          <source :src="videoItem" type="video/ogg" />
          <source :src="videoItem" type="video/webm" />
        </video>
        <!-- <VideoJs  :videoSrc="videoItem" autoPlay  controls/> -->
      </div>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import { reactive, onMounted, toRefs } from 'vue';
import { sportsPageList, addSports, updateSports, sportData, delSports, knowDict, knowComboList, sportsDelComboList } from '../../request/modules/knowledge';
import { useRouter } from 'vue-router';
import { BrowseIcon, AddCircleIcon, AddIcon } from 'tdesign-icons-vue-next';
// import VideoJs from "../../components/BaseVideo/Video.vue";
import { sportColumns } from './data/configuration';
import cropper from '@/components/ImgCropping/Cropper.vue';
import { MessagePlugin, FormRules, Data, UploadFile, UploadRemoveContext, ChangeContext, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
import load from '../../components/load/load.vue';
// const router = useRouter();
const videoVisible = ref<any>(false);
const knowVinList = ref<any>([]);
// const displayNum = ref<number>(3);
const fileList = ref<any>([]);
const imgFile = ref<any>([]); //图片
const fileVideo = ref<any>([]);
const headers = ref<any>({});
const clipperRef = ref<any>({});
const disUpload = ref<boolean>(false);
const isSubmit = ref<boolean>(true);
const clipperData = ref<any>({
  type: '',
  allowTypeList: ['png', 'jpg', 'jpeg'],
  limitSize: 1,
  fixedNumber: [1, 1],
  previewWidth: 100,
  autoCropWidth: 80, // 默认生成截图框宽度
  autoCropHeight: 70 // 默认生成截图框高度
});
const beforeUpload = (file: any) => {
  if (file.size > 10 * 1024 * 1024) {
    MessagePlugin.warning('上传的图片不能大于10M');
    return false;
  }

  return true;
};
const setArrt = reactive<any>({
  searchData: {
    pageNum: 1,
    pageSize: 10,
    categoryIdList: []
  },
  knowledgeType: {
    knowledgeType: 'sports',
    pageNum: 1,
    pageSize: 10
  },
  knowledgeList: {
    pageNum: 1,
    pageSize: 10
  },
  total: 0,
  dataList: [],
  dialogTitle: '新建',
  value1: '123',
  addVisible: false,
  options: [
    { label: '苹果', value: '苹果' },
    { label: '小米', value: '小米' },
    { label: '高粱', value: '高粱' }
  ],
  sportId: ''
});
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
const formImage = ref<any>([]); //图片展示
const foodsLabel = ref<any>([
  { label: '耐力', value: 'R' },
  { label: '力量', value: 'S' },
  { label: '平衡', value: 'B' },
  { label: '灵活', value: 'F' }
]);
//上传图片
const uploadRef = ref();
const file = ref([]);
const comboId = ref<any>('');
const disabled = ref(false);
const videoItem = ref<any>({});
const handleUpload = (context: any) => {
  console.log('context', context);
  formImage.value = context.response.url;
};
const handleRequestFail = (e: any) => {
  console.log(e, 'iiiiiii');
};
//删除
const onRequestRemove = (context: UploadRemoveContext) => {
  // familyForm.value.videoDTOS.map((item: any, index: any) => {
  //   if (setArrt.sportId) {
  //     familyForm.value.videoDTOS[index].videoUrl = '';
  //   } else {
  //     familyForm.value.videoDTOS[index].videoImg = '';
  //   }
  // });
};
const browserUpload = (value: any) => {
  clipperRef.value.uploadFile();
};
const onConfirm = (val: any) => {
  disUpload.value = true;
  fileList.value[0] = {
    name: '',
    url: val
  };
};
const removeFile = () => {
  disUpload.value = false;
  formImage.value = '';
};

const del = (index: number) => {
  familyForm.value.videoDTOS.map((item: any) => {
    if (setArrt.sportId) {
      familyForm.value.videoDTOS[index].videoUrl = '';
      familyForm.value.videoDTOS[index].videoArr = [];
    } else {
      familyForm.value.videoDTOS[index].videoImg = '';
      familyForm.value.videoDTOS[index].videoUrl = '';
      familyForm.value.videoDTOS[index].videoArr = [];
    }
  });
};
const checkUpload = (files: any[]): boolean | Promise<boolean> => {
  // return true
  return new Promise(function (resolve, reject) {
    let width = 339;
    let height = 300;
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
        MessagePlugin.warning('图片尺寸(339px*300px)不符合标准！');
        reject(false);
      }
    };
    img.src = url;
  });
};
const formRules = ref<any>({
  combinationID: [{ required: true, message: '请输入菜品ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  risk: [{ required: true, message: '请输入运动风险系数', trigger: 'blur' }],
  img: [{ required: true, message: '请上传图片', trigger: 'blur' }]
});
const uploadMethod = ref('requestSuccessMethod');
const data = reactive<any>({
  familyForm: {
    id: '',
    comboId: '2222',
    accessUrl: '',
    category: '',
    name: '',
    risk: '',
    videoDTOS: [
      {
        id: 0,
        count: 0,
        description: '',
        videoSequence: null,
        videoUrl: '',
        hour: 0, //小时
        minutes: 0, //分钟
        seconds: 0, //秒钟
        urlDesc: '',
        urlTime: '',
        videoArr: [],
        videoImg: ''
      }
    ],
    videoUrl: []
  }
});
const { familyForm } = toRefs(data);
const fixedTopRows = ref<boolean>(false);
const form = ref<any>(null);
onMounted(async () => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  getSportList();
  // getKnowComboList();
  // await knowGetDict();
  let token = localStorage.getItem('x-auth-token');
  headers.value = {
    token: token
  };
});

//获取知识库套餐
// const getKnowComboList = () => {
//   knowComboList(setArrt.knowledgeType).then((res: any) => {
//     knowVinList.value = res.data;
//   });
// };
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
//获取列表
const getSportList = () => {
  sportsPageList(setArrt.knowledgeList).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (setArrt.dataList = []);
      } else {
        setArrt.dataList = res.data.data;
        setArrt.total = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (setArrt.dataList = []);
    }
  });
};
const filesUrl = ref<any>('');
let arry = [];
const videoUpload = (files: any) => {
  console.log('files', files);
  familyForm.value.videoDTOS.forEach((el: any) => {
    if (el.videoArr[0]?.response) {
      el.videoImg = el.videoArr[0].response.data.url;
      el.videoUrl = el.videoArr[0].response.data.url;
    }
    // el.videoImg = el.videoArr[0].response.data.url;
    // console.log('22222');
    // el.videoUrl= el.videoArr[0].response.data.url;
    // console.log('33333');
  });

  if (files.response.code == '200') {
    console.log(familyForm.value.videoDTOS, 'ooooo');

    // familyForm.value.videoDTOS.forEach((el: any) => {
    //   if (el.videoArr[0]) {
    //     el.videoArr[0] = {
    //       name: el.videoArr[0].response.data.originalFilename.slice(-4),
    //       url: files.response.data.url
    //     };
    //   }
    // });
    fileVideo.value[0] = {
      name: files.response.data.originalFilename.slice(-4),
      url: files.response.data.url
    };
    arry = files;
  } else {
    MessagePlugin.warning('上传失败，请稍后重试！');
  }
};
// 风险系数保留小数
const riskreserve = () => {
  familyForm.value.risk = familyForm.value.risk.match(/\d+\.?\d{0,2}/, '')[0];
};
//新增视频
var num = 1;
const addItemList = () => {
  familyForm.value.videoDTOS.push({
    id: num,
    count: 0,
    description: '',
    videoSequence: null,
    videoUrl: '',
    hour: '0', //小时
    minutes: '0', //分钟
    seconds: '0', //秒钟
    urlDesc: '',
    urlTime: '',
    videoArr: [],
    videoImg: ''
  });
  num = num + 1;
  console.log(familyForm.value.videoDTOS, '2222222');
};
//删除视频
const deletedItem = (index: any) => {
  if (familyForm.value.videoDTOS.length > 1) {
    familyForm.value.videoDTOS.splice(index, 1);
  }
};
//获取单个数据信息
const editDetails = async (val: any) => {
  console.log(val);
  setArrt.sportId = val.id;
  setArrt.dialogTitle = '编辑';
  disUpload.value = true;
  fileList.value[0] = {
    name: '',
    url: val?.accessUrl
  };
  comboId.value = val.id.toString();
  setArrt.addVisible = true;
  await sportData({
    id: setArrt.sportId
  }).then((res: any) => {
    if (res.code === 200) {
      let dataList = res.data.videoDTOS;
      let videoArr = [] as any;
      let data = {
        name: '',
        url: ''
      };
      videoArr.push(data);

      console.log(videoArr, 'videoA');

      dataList.forEach((el: any) => {
        el.videoArr = [];
        el.hour = el.urlTime.substring(0, 2);
        el.minutes = el.urlTime.substring(3, 5);
        el.seconds = el.urlTime.substring(6, 8);
        el.videoArr.push({
          name: el.videoUrl.slice(-4),
          url: el.videoUrl
        });
      });

      console.log(dataList, 'dataLi');
      let num = 1;
      res.data.videoDTOS.forEach((item: any) => {
        item.id = num;
        num++;
      });

      console.log(res.data.videoDTOS, 'videoArr111111');

      familyForm.value = {
        accessUrl: fileList.value[0].url,
        category: res.data.category,
        name: res.data.name,
        risk: val.sportRisk,
        videoDTOS: res.data.videoDTOS,
        videoUrl: []
      };
    }
  });
};
//删除一条数据
const deleteDetails = (value: number) => {
  delSports({
    id: value
  }).then((res: any) => {
    if (res.code === 200) {
      MessagePlugin.success('删除成功');
      getSportList();
    } else {
      MessagePlugin.warning(res.msg);
    }
  });
};
// const baiyun = (val: any) => {
//   console.log(val);
// };
//新增运动
const addItem = () => {
  setArrt.dialogTitle = '新增组合';
  setArrt.sportId = null;
  setArrt.addVisible = true;
  formImage.value = '';
  fileList.value = [];
  familyForm.value.id = '';
  familyForm.value.risk = '';
  familyForm.value.comboId = '';
  familyForm.value.name = '';
  familyForm.value.videoDTOS = [];
  familyForm.value.category = '';
  fileVideo.value = [];
  // console.log(familyForm.value.videoDTOS, 'lllllllllllll');
};

//新增运动提交111112312
const submitForm = () => {
  console.log(fileList.value);
  console.log(formImage.value);
  if (setArrt.dialogTitle == '新增组合') {
    // familyForm.value.accessUrl = formImage;
    if (familyForm.value.videoDTOS != '') {
      familyForm.value.videoDTOS.forEach((el: any) => {
        el.urlTime = (el.hour == 0 ? '0' : el.hour < 10 ? '0' + el.hour : el.hour) + ':' + (el.minutes == 0 ? '0' : el.minutes < 10 ? '0' + el.minutes : el.minutes) + ':' + (el.seconds == 0 ? '0' : el.seconds < 10 ? '0' + el.seconds : el.seconds);
        el.videoUrl = el.videoImg;
      });
      familyForm.value.accessUrl = fileList.value[0].url;
    } else {
      MessagePlugin.error('请添加训练内容');
    }
    if (familyForm.value.videoDTOS == '') {
      MessagePlugin.error('请上传视频！');
      return;
    }
    if (!isSubmit.value) {
      MessagePlugin.error('视频顺序不能为0或负数！');
      return;
    }
    console.log(familyForm.value);

    addSports(familyForm.value).then((res: any) => {
      if (res.code === 200) {
        setArrt.addVisible = false;
        MessagePlugin.success('添加成功');
        familyForm.value = {
          id: '',
          comboId: '',
          accessUrl: '',
          category: '',
          name: '',
          videoDTOS: [
            {
              id: 0,
              count: 0,
              description: '',
              videoSequence: null,
              videoUrl: '',
              hour: '0', //小时
              minutes: '0', //分钟
              seconds: '0', //秒钟
              urlDesc: '',
              urlTime: '',
              videoArr: []
            }
          ],
          videoUrl: []
        };

        getSportList();
        console.log(JSON.stringify(familyForm) + '00000000000000');
      } else {
        // MessagePlugin.success(res.msg);
      }
    });
  } else {
    //编辑
    familyForm.value.id = setArrt.sportId;
    familyForm.value.accessUrl = fileList.value[0].url;
    if (familyForm.value.videoDTOS != '') {
      familyForm.value.videoDTOS.forEach((el: any) => {
        el.urlTime = (el.hour == 0 ? '0' : el.hour < 10 ? '0' + el.hour : el.hour) + ':' + (el.minutes == 0 ? '0' : el.minutes < 10 ? '0' + el.minutes : el.minutes) + ':' + (el.seconds == 0 ? '0' : el.seconds < 10 ? '0' + el.seconds : el.seconds);
      });
    }
    if (!isSubmit.value) {
      MessagePlugin.error('视频顺序不能为0或负数！');
      return;
    }
    updateSports(familyForm.value).then((res: any) => {
      if (res.code === 200) {
        setArrt.addVisible = false;
        MessagePlugin.success('编辑成功');
        getSportList();
      } else {
        // MessagePlugin.success(res.msg);
      }
    });
  }
};
//详情页
// const addView = () => {
//   router.push({
//     path: '/SportsDetails'
//   });
// };
//编辑
// const editView = (item: any) => {
//   console.log(item, 'item');
//   router.push({
//     path: '/SportsEditDetails',
//     query: {
//       id: item.id
//     }
//   });
// };
//组合分类数据
// const knowGetDict = () => {
//   knowDict({ dictType: 'sports' }).then((res: any) => {
//     if (res.code === 200) {
//       foodsLabel.value = res.data.map((item: any) => {
//         return {
//           label: item.dictLabel,
//           value: item.id
//         };
//       });
//     }
//   });
// };
//删除套餐
// const knowDel = (value: any) => {
//   sportsDelComboList({
//     id: value
//   }).then((res: any) => {
//     if (res.code === 200) {
//       MessagePlugin.success('删除成功');
//       getKnowComboList();
//     } else {
//       MessagePlugin.warning(res.msg);
//     }
//   });
// };
//分页
const pageSizeChange = (pageSize: any) => {
  console.log(pageSize, 'pageSize');

  setArrt.knowledgeList.pageSize = pageSize;
  setArrt.knowledgeList.pageNum = 1;
  getSportList();
};
const currentChange = (current: number) => {
  console.log(current, 'current');
  setArrt.knowledgeList.pageNum = current;
  getSportList();
};
const onChange = () => {};
const imgChange = () => {};
//上传视频
const videoPreview = (val: any) => {
  // console.log(val[0].response.data.url, 'val');
  if (val[0].response) {
    videoItem.value = val[0].response.data.url;
  } else {
    console.log('111111');

    videoItem.value = val[0].url;
  }
  videoVisible.value = true;
};

const formatImgResponse = (response: any) => {
  return { name: response.data.originalFilename, url: response.data.url };
};
const numberChange = (value: any, context: ChangeContext) => {
  console.log(value, 'value');
  var regPos = /^[1-9]+.?[1-9]*$/;
  if (value == undefined) {
    return true;
  }
  if (regPos.test(value)) {
    isSubmit.value = true;
    return true;
  } else {
    MessagePlugin.warning('上传顺序不能为0或负数,请重新输入');
    isSubmit.value = false;
    return false;
  }
};

//上传视频
const requestMethod = computed(() => (uploadMethod.value === 'requestSuccessMethod' ? '上传成功' : '上传失败'));
// const handlerRest = () => {
//   router.go(-1);
// };
</script>

<style lang="scss" scoped>
.report-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // .box-img {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   .box-left {
  //     display: flex;
  //     align-items: center;
  //     .img-btn {
  //       font-size: 22px;
  //       font-family: PingFang-SC-Bold, PingFang-SC;
  //       font-weight: bold;
  //       color: #222222;
  //       line-height: 30px;
  //     }
  //   }
  //   .expansion {
  //     margin-right: 50px;
  //     font-size: 20px;
  //     font-family: PingFang-SC-Bold, PingFang-SC;
  //     font-weight: bold;
  //     color: #919191;
  //     line-height: 28px;
  //     img {
  //       width: 12px;
  //       height: 6.72px;
  //       margin-right: 3.36px;
  //     }
  //   }
  // }
  // .info-tittle {
  //   font-size: 20px;
  //   font-family: 'Courier New', Courier, monospace;
  // }

  // .info-box {
  //   padding: 20px;

  //   .info-box-card {
  //     display: flex;
  //     align-items: center;
  //     flex-wrap: wrap;

  //     .card-item {
  //       margin-right: 12px;
  //       margin-bottom: 12px;
  //       // width: 269px;
  //       // height: 156px;
  //       background: #ffffff;
  //       box-shadow: 0px 0px 4px 0px rgba(87, 102, 254, 0.07);
  //       border-radius: 16px;

  //       .content-left {
  //         position: relative;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         .textComboName {
  //           position: absolute;
  //           font-size: 22px;
  //           font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
  //           font-weight: bold;
  //           color: #ffffff;
  //           line-height: 40px;
  //           text-shadow: 0px 2px 4px rgba(9, 45, 162, 0.71);
  //         }
  //       }
  //     }
  //   }

  //   .card-plus {
  //     width: 290px;
  //     height: 194px;
  //     position: relative;
  //     background: #ffffff;
  //     box-shadow: 0px 0px 4px 0px rgba(87, 102, 254, 0.07);
  //     border-radius: 16px;
  //     margin-bottom: 12px;

  //     .icon-plus {
  //       text-align: center;
  //       position: absolute;
  //       top: 50%;
  //       width: 100%;
  //       font-size: 10px;
  //       color: #262626;
  //       transform: translate(0, -50%);
  //     }
  //   }
  // }

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

  .content-box {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: #fff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
  }

  .operate-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .add-item {
      background: #f4f8ff;
      box-shadow: 0px 2px 4px 0px #fafbff;
      border-radius: 6px;
    }
  }

  .box-btn {
    margin-left: 5px;
  }

  .box-btn1 {
    margin-left: 5px;
  }

  .pageInfo {
    margin-top: 15px;
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

  .text-row {
    display: flex;
    justify-content: center;

    .editText {
      width: 53px;
      height: 23px;
      background: #ffedd5;
      border-radius: 9px;
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
      border-radius: 9px;
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

.trainingContent {
  padding: 10px;
  border: 1px solid #000;

  .sport-content {
    margin-bottom: 27px;
  }

  .sport-btn {
    margin-left: 20px;
  }
  ::v-deep(.t-upload__single-display-text) {
    width: 50px;
  }
  ::v-deep(.t-upload__single-name) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .delIndex {
    position: relative;
    bottom: -39px;
    right: 137px;
    cursor: pointer;
  }
}

.formUpload {
  display: flex;
  position: relative;

  .videoUrlStr {
    position: absolute;
    left: 2px;
    top: 35px;
    width: 80px !important;
    height: 50px !important;
    // border: 1px solid red;
    white-space: nowrap; //禁止换行
    overflow: hidden;
    text-overflow: ellipsis; //...
  }
}

.img-box {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  .upload-img-box {
    width: 110px;
    height: 110px;
    background: #f3f3f3;
    border: 1px dashed #ddd;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 23px;
      margin-bottom: 6px;
      color: rgba(0, 0, 0, 0.9);
    }

    .check-img {
      color: rgba(0, 0, 0, 0.4);
      font-size: 11px;
    }
  }

  .check-text {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 7px;
  }
}

.box-chart {
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog {
    padding: 15px;
    width: 85%;
    height: 400px;
    border-radius: 16px;
    background-color: #ffffff;
    margin-left: 15px;
  }
}

::v-deep(.t-upload__icon-delete, .t-upload__single-input-clear) {
  display: none !important;
}

::v-deep(.t-form__item t-form-item__itemDescription) {
  margin: 10px 0 !important;
}
// ::v-deep(.t-upload__single-progress .t-loading) {
//   display: none !important;
//   // dis
//   // margin: 10px 0 !important;
// }
::v-deep(.t-upload__single-percent) {
  display: none !important;
  // dis
  // margin: 10px 0 !important;
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
