<template>
  <div class="mark-box">
    <div class="new-item">
      <div>预览效果</div>
      <div>在线编辑</div>
    </div>
    <div class="content-box">
      <div class="preview-box">
        <template v-if="formData.articleMold === 1">
          <img class="topImg" src="../../assets/img/marketing/image-text-top.png" alt="">
          <div class="preview-content">
            <div class="information-box">
              <div class="information-left">
                <p>{{ formData.articleSource }}</p>
                <p>{{ currentTime }} 发布</p>
              </div>
              <div class="information-right"> 阅读：{{ formData.playbackNum }}</div>
            </div>
            <p class="title-theme">{{ formData.theme }}</p>
            <div style="width: 100%;overflow: hidden;" v-html="htmlText"></div>
          </div>
        </template>
        <div class="video-box" v-show="formData.articleMold === 2">
          <img src="../../assets/img/marketing/video-top.png" alt="">
          <video :src="formData.videoUrl" :poster="formData.videoCover" id="video1" @canplay="getDuration"
            @timeupdate="getTimeUpdate"></video>
          <div class="text-box">
            <p>
              {{ formData.articleSource }}
              <img src="../../assets/img/marketing/video-play-log.png" alt=""><span>{{
                formData.playbackNum }}播放量</span>
            </p>
            <p>{{ expandStatus ? formData.theme : formData.theme.slice(0, 38) }}<span
                v-show="formData.theme.length > 30 && !expandStatus">…
              </span><span :style="{ marginLeft: expandStatus ? '10px' : '' }" v-show="formData.theme.length > 30"
                @click="expandStatus = !expandStatus">{{ expandStatus ?
                  '收起' : '展开' }}</span></p>
          </div>
          <div class="time-text">{{ currentTime }}</div>
          <div class="video-control">
            <img v-show="!playState" src="../../assets/img/marketing/suspend.png" @click="playPause" alt="">
            <img v-show="playState" src="../../assets/img/marketing/play.png" @click="playPause" alt="">
            <span>{{ sliderCurrentTime }}</span>
            <t-slider class="my-video-control-slider" :showStep="false" disabled v-model="sliderVal"
              style="width: 187px;margin-left: 7px;" :step="0.1" :label="sliderCurrentTime" />
            <span>{{ sliderMaxTime }}</span>
          </div>
          <div class="gesture-line"></div>
        </div>
      </div>
      <t-form class="form-box wz-form-box" :data="formData" @submit="onSubmit" :rules="(formRules as FormRules<Data>)"
        :disabled="title === '编辑' ? false : title === '详情' ? true : false">
        <t-form-item requiredMark label="文章主题:" name="theme" initial-data="TDesign">
          <t-textarea v-model="formData.theme" placeholder="请输入主题名称" :maxlength="50" />
        </t-form-item>
        <t-form-item requiredMark label="文章状态:" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="2">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item requiredMark label="设为推荐:" name="topped">
          <t-radio-group v-model="formData.recommend">
            <t-radio :value="1">是</t-radio>
            <t-radio :value="2">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item requiredMark label="文章类型:" name="articleType">
          <t-select class="form-input" v-model="formData.articleMold" @change="changeArticleMold">
            <t-option v-for="(item, index) in articleMoldSelectList" :key="index" :label="item.label"
              :value="item.value" />
          </t-select>
        </t-form-item>
        <t-form-item requiredMark label="列表主图:" name="mainImage" v-show="formData.articleMold === 1">
          <t-upload ref="uploadRef" v-if="imgFile.length > 0" v-model:files="(imgFile as UploadFile[])"
            tips="请注意图片尺寸(310px*160px)" :defaultFiles="(imgFile as UploadFile[])" theme="image"
            :size-limit="{ size: 2, unit: 'MB' }" :action="uploadUrl" :formatResponse="formatImgResponse" accept="image/*"
            @remove="removeMain" :headers="headers" :beforeAllFilesUpload="checkUpload" :onSuccess="handleUpload" :locale="{
              triggerUploadText: {
                image: '请选择图片'
              }
            }"></t-upload>
          <!-- @remove="formData.mainImage = ''" -->
          <div class="img-box" @click="browserUpload('imgFile')" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">请上传310px*160px图片</div>
          </div>
          <cropper ref="clipperRef" :type="clipperData.type" :allow-type-list="clipperData.allowTypeList"
            :limit-size="clipperData.limitSize" :fixed-number="clipperData.fixedNumber"
            :fixed-number-aider="clipperData.fixedNumberAider" :preview-width="clipperData.previewWidth"
            :auto-crop-width="310" :auto-crop-height="160" @confirm="onConfirm" />
        </t-form-item>
        <t-form-item requiredMark label="视频封面:" name="videoCover" v-if="formData.articleMold === 2">
          <t-upload ref="uploadRef" v-if="coverFile.length > 0" v-model:files="(coverFile as UploadFile[])"
            tips="请注意图片尺寸与视频尺寸相同" :defaultFiles="(coverFile as UploadFile[])" theme="image"
            :size-limit="{ size: 2, unit: 'MB' }" :action="uploadUrl" :formatResponse="formatImgResponse" accept="image/*"
            @remove="removeCover" :headers="headers" :beforeAllFilesUpload="checkUpload" :onSuccess="handleCoverUpload"
            :locale="{
              triggerUploadText: {
                image: '请选择图片'
              }
            }"></t-upload>
          <!-- @remove="formData.mainImage = ''" -->
          <div class="img-box" @click="browserUpload('coverFile')" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">请上传310px*160px图片</div>
          </div>
          <cropper ref="clipperRef" :type="clipperData.type" :allow-type-list="clipperData.allowTypeList"
            :limit-size="clipperData.limitSize" :fixed-number="clipperData.fixedNumber"
            :fixed-number-aider="clipperData.fixedNumberAider" :preview-width="clipperData.previewWidth"
            :auto-crop-width="clipperData.autoCropWidth" :auto-crop-height="clipperData.autoCropHeight"
            @confirm="onCoverConfirm" />
        </t-form-item>
        <t-form-item requiredMark label="上传视频:" name="videoUel" v-if="formData.articleMold === 2">
          <t-upload v-model:files="(videoFile as UploadFile[])" v-show="videoFile.length === 0"
            :defaultFiles="(videoFile as UploadFile[])" theme="image" :size-limit="{ size: 50, unit: 'MB' }"
            :action="uploadUrl" :formatResponse="formatImgResponse" accept="video/*" :headers="headers"
            :onSuccess="handleVideoUpload" :locale="{
              triggerUploadText: {
                image: '请选择视频'
              }
            }"></t-upload>
          <div class="video-show-box" v-show="videoFile.length !== 0">
            <video :src="videoFile[0]?.url || ''"></video>
            <div class="mask">
              <DeleteIcon v-if="title !== '详情'" size="16px" @click="deleteVideoUrl" style="color: #fff;" />
            </div>
          </div>
        </t-form-item>
        <t-form-item requiredMark label="文章分类:" name="articleType">
          <t-select class="form-input" v-model="formData.articleTypeDesc" @change="typeSelectChange">
            <t-option v-for="(item, index) in typeSelectList" :key="index" :label="item.categoryName" :value="item.id" />
          </t-select>
        </t-form-item>
        <t-form-item label="播放量:" name="playNum">
          <t-input-number :min="0" type="number" :allowInputOverLimit="false" :step="1" v-model="formData.playbackNum"
            @input="setInputNumber" placeholder="请输入播放量" /><span class="tip-text">默认，随机三位数</span>
        </t-form-item>
        <t-form-item requiredMark label="文章来源:" name="articleSource">
          <t-textarea class="form-input" :maxlength="30" v-model="formData.articleSource" placeholder="请输入来源名称" />
        </t-form-item>
        <div style="width: 100%">
          <t-form-item :requiredMark="formData.articleMold === 1" label="内容详情:"
            :name="formData.articleMold === 1 ? 'contentDetails' : ''"></t-form-item>
          <div class="edit-box" style="width: 100%">
            <ErWangEditor :height="300" :width="400" v-if="formData.articleMold === 1" ref="VoWangEditorRef"
              @onChange="(h: string) => { htmlText = h; formData.contentDetails = h }" />
            <t-textarea class="form-input2" v-if="formData.articleMold === 2" v-model="formData.contentDetails"
              placeholder="请输入请输入内容详情" :maxlength="200" />
          </div>
        </div>
        <t-form-item class="btn-state" v-if="title !== '详情'">
          <button type="submit">确认</button>
          <button type="button" @click="outPage">取消</button>
        </t-form-item>
        <t-form-item class="btn-state" v-if="title === '详情'">
          <button v-if="title === '详情'" @click="artBack">返回</button>
        </t-form-item>
      </t-form>
    </div>
    <div class="mask-box" v-if="maskState">
      <div class="content-box">
        <h2>提示</h2>
        <p>内容还没有保存，确定要离开吗？</p>
        <div class="btn-box">
          <button @click="maskState = false">取消</button>
          <button @click="artBack">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { addArticle, queryArticleDetails, queryArticleType, updateArticle } from '../../request/modules/MarketApi';
import { Data, FormRules, MessagePlugin, SelectValue, UploadFile } from 'tdesign-vue-next';
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
// 引入富文本
import ErWangEditor from '@/components/WangEditor/src/WangEditors.vue';
import cropper from '@/components/ImgCropping/Cropper.vue'
import { getCurrentDate } from '../../utils/tiemFormat'
export default {
  components: {
    AddIcon,
    DeleteIcon,
    ErWangEditor
  },
  setup() {
    const VoWangEditorRef = ref<any>();
    const route = useRoute();
    const router = useRouter();
    let imgFile = ref<any>([]);
    let coverFile = ref<any>([]);
    let videoFile = ref<any>([]);
    let currentTime = ref<string>(getCurrentDate(new Date().getTime(), 'nyrsf'));
    const clipperRef = ref<any>({})
    const clipperRef1 = ref<any>({})
    const imgFileUpload = ref<boolean>(false);
    const headUpload = ref<boolean>(false);
    const clipperData = ref<any>({
      type: '',
      allowTypeList: ['png', 'jpg', 'jpeg'],
      limitSize: 1,
      fixedNumber: [1, 1],
      previewWidth: 100,
      autoCropWidth: 80, // 默认生成截图框宽度
      autoCropHeight: 70 // 默认生成截图框高度
    })
    const headImgFile = ref<any>([
      {
        name: '',
        url: 'http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/33f9b5cdf34548029deae516fca90d47.png'
      }
    ]);
    const setArrt = reactive({
      title: '新增',
      artTypeData: {
        categoryName: '',
        status: 1,
        pageSize: 10,
        pageNum: 1,
        statusList: [1]
      },
      maskState: false,
      uploadUrl: import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate',
      typeSelectList: [{ categoryName: '', id: '', status: '' }],
      articleMoldSelectList: [{ label: '图文', value: 1 }, { label: '视频', value: 2 }],
      formRules: {
        theme: [{ required: true, message: '文章主题必填', trigger: 'blur' }],
        // articleDesc: [{ required: true, message: '文章描述必填', trigger: 'blur' }],
        articleType: [{ required: true, message: '文章分类必填', trigger: 'blur' }],
        contentDetails: [{ required: true, message: '内容详情必填', trigger: 'blur' }],
        videoCover: [{ required: true, message: '视频封面必填', trigger: 'blur' }],
        videoUrl: [{ required: true, message: '视频必填', trigger: 'blur' }],
        mainImage: [{ required: true, message: '文章主图必填', trigger: 'blur' }],
        // releaseTime: [{ required: true, message: '发布时间必填', trigger: 'blur' }],
        recommend: [{ required: true, message: '文章推荐必填', trigger: 'blur' }],
        articleSource: [{ required: true, message: '文章来源必填', trigger: 'blur' }]
      },
      headers: {},
      id: 0,
      formData: {
        theme: '',
        // articleDesc: "",
        articleType: 0,
        recommend: 2,
        id: 0,
        articleMold: 1,
        playbackNum: 0,
        releaseTime: '',
        articleSource: '脑倍佳官方',
        contentDetails: '<p><br></p>',
        remark: '',
        articleTypeDesc: '',
        status: 1,
        mainImage: '',
        videoUrl: '',
        videoCover: '',
        articleSourceUrl: 'http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/33f9b5cdf34548029deae516fca90d47.png'
      },
      htmlText: "",
      sliderVal: 0,
      sliderMaxTime: '',
      sliderCurrentTime: '00:00:00',
      playState: true,
      expandStatus: false,
    });
    let oldData = ''
    onMounted(() => {
      let num: number = Math.floor(Math.random() * 1000);
      setArrt.formData.playbackNum = num < 100 ? num + 100 : num;
      myVideo = document.getElementById("video1") as HTMLVideoElement;
      setTimeout(() => {
        VoWangEditorRef.value && VoWangEditorRef.value.setHtml(setArrt.formData.contentDetails);
      }, 1000);
      if (route.query.id) {
        setArrt.id = Number(route.query.id);
        getDetails();
      }
      setArrt.title = String(route.query.title);
      if (route.query.title == '详情') {
        VoWangEditorRef.value && VoWangEditorRef.value.disable();
      }
      oldData = JSON.stringify(setArrt.formData)
      getArticleTypeList();
      let token = localStorage.getItem('x-auth-token');
      setArrt.headers = {
        token: token
      };
    });

    const browserUpload = (value: any) => {
      if (value == 'imgFile') {
        nextTick(() => {
          clipperData.value.autoCropWidth = 343;
          clipperData.value.autoCropHeight = 176;
          clipperRef.value.uploadFile()
        })
      } else if (value == 'coverFile') {
        nextTick(() => {
          clipperData.value.autoCropWidth = 310;
          clipperData.value.autoCropHeight = 160;
          clipperRef.value.uploadFile()
        })
      } else {
        nextTick(() => {
          clipperData.value.autoCropWidth = 50;
          clipperData.value.autoCropHeight = 50;
          clipperRef1.value.uploadFile()
        })
      }
    }
    const onConfirm = (val: any) => {
      console.log(val, imgFile.value)
      setArrt.formData.mainImage = val;
      imgFileUpload.value = true;
      imgFile.value[0] = {
        name: '',
        url: val
      }
    }
    const onCoverConfirm = (val: any) => {
      console.log(val)
      setArrt.formData.videoCover = val;
      imgFileUpload.value = true;
      coverFile.value[0] = {
        name: '',
        url: val
      }
    }
    const onHeadConfirm = (val: any) => {
      headUpload.value = true;
      headImgFile.value[0] = {
        name: '',
        url: val
      }
    }
    // 获取文章分类
    const getArticleTypeList = () => {
      queryArticleType(setArrt.artTypeData).then((res: any) => {
        if (res.code === 200) {
          setArrt.typeSelectList = res.data.data;
        }
      });
    };

    const handleUpload = (value: any) => {
      setArrt.formData.mainImage = value.response.url;
    };
    const handleCoverUpload = (value: any) => {
      setArrt.formData.videoCover = value.response.url;
    };
    const handleVideoUpload = (value: any) => {
      setArrt.formData.videoUrl = value.response.url;
    };
    const handleHeadUpload = (value: any) => {
      setArrt.formData.articleSourceUrl = value.response.url;
    };

    const removeMain = (content: any) => {
      setArrt.formData.mainImage = ''
      imgFileUpload.value = false
      imgFile.value = []
    }
    const removeCover = (content: any) => {
      setArrt.formData.videoCover = ''
      imgFileUpload.value = false
      coverFile.value = []
    }

    const typeSelectChange = (value: SelectValue) => {
      for (let i = 0; i < setArrt.typeSelectList.length; i++) {
        if (setArrt.typeSelectList[i].id === value) {
          setArrt.formData.articleTypeDesc = setArrt.typeSelectList[i].categoryName;
          setArrt.formData.articleType = Number(setArrt.typeSelectList[i].id);
        }
      }
    };

    const formatImgResponse = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };

    const checkUpload = (files: UploadFile[]): boolean | Promise<boolean> => {
      // return true
      return new Promise(function (resolve, reject) {
        let topWidth = 310;
        let topHeight = 160;
        let width = 166;
        let height = 96;
        let url = '';
        // console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL)
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          // console.log("img.width", img.width, img.height)
          let valid = img.width == topWidth && img.height == topHeight;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(310px*160px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const checkHeadUpload = (files: UploadFile[]): boolean | Promise<boolean> => {
      // return true
      return new Promise(function (resolve, reject) {
        let headWidth = 50;
        let headHeight = 50;
        let url = '';
        // console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL)
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          // console.log("img.width", img.width, img.height)
          let valid = img.width == headWidth && img.height == headHeight;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(50px*50px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    // 判断富文本编辑器输入是否为空或回车
    const getText = (str: any) => {
      return str
        .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
        .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
        .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
        .replace(/<[^<br/>]+>/g, ''); // 将所有 换行符 replace ''
    };
    const isNull = (str: any) => {
      if (str == '') return true;
      var regu = '^[ ]+$';
      var re = new RegExp(regu);
      return re.test(str);
    };

    const onSubmit = () => {
      if (setArrt.formData.articleMold == 1) {
        let htmlList = VoWangEditorRef.value.getHtml();
        setArrt.formData.contentDetails = htmlList;
      }
      let dates = dayjs().add(1, "minute").format('YYYY-MM-DD HH:mm')
      if (!setArrt.formData.releaseTime) {
        setArrt.formData.releaseTime = dates;
      }
      if (!setArrt.formData.articleSourceUrl) {
        MessagePlugin.warning('文章来源头像不能为空');
        return;
      }
      if (setArrt.formData.articleType <= 0) {
        MessagePlugin.warning('文章分类不能为空');
        return;
      }
      if (setArrt.formData.contentDetails === '<p><br></p>') {
        setArrt.formData.contentDetails = '';
      }
      if (setArrt.title === '新增') {
        addArticle(setArrt.formData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            router.push('/ArticleListView');
          }
        });
      } else if (setArrt.title === '编辑') {
        let data = {
          id: setArrt.formData.id,
          theme: setArrt.formData.theme,
          articleType: setArrt.formData.articleType,
          // articleDesc: setArrt.formData.articleDesc,
          recommend: setArrt.formData.recommend,
          playbackNum: setArrt.formData.playbackNum,
          releaseTime: setArrt.formData.releaseTime,
          articleSource: setArrt.formData.articleSource,
          contentDetails: setArrt.formData.contentDetails,
          remark: setArrt.formData.remark,
          articleTypeDesc: setArrt.formData.articleTypeDesc,
          status: setArrt.formData.status,
          mainImage: setArrt.formData.mainImage,
          articleSourceUrl: setArrt.formData.articleSourceUrl,
          articleMold: setArrt.formData.articleMold,
          videoCover: setArrt.formData.videoCover,
          videoUrl: setArrt.formData.videoUrl,
        };
        updateArticle(data).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success('更新成功');
            setTimeout(() => {
              router.push('/ArticleListView');
            }, 300);
          }
        });
      }
    };

    const change = (value: any) => {
      setArrt.formData.releaseTime = value as string;
    };

    const artBack = () => {
      router.push({ path: '/ArticleListView', query: { history: '1' } });
    };


    let myVideo: HTMLVideoElement;
    const playPause = () => {
      setArrt.playState = !setArrt.playState;
      if (myVideo.paused) {
        myVideo.play();
      } else {
        myVideo.pause();
      }
    }
    const getDuration = (e: any) => {
      console.log(e, myVideo.duration, handleTime(myVideo.duration))
      setArrt.sliderMaxTime = handleTime(myVideo.duration)
    }
    const getTimeUpdate = (e: any) => {
      setArrt.sliderVal = Math.round(myVideo.currentTime / myVideo.duration * 100);
      setArrt.sliderCurrentTime = handleTime(myVideo.currentTime);
      if (setArrt.sliderVal === 100) {
        setArrt.playState = !setArrt.playState;
      }
    }
    const handleTime = (num: number) => {
      var hours = Math.round(num / 3600);
      var minutes = Math.round(num / 60) % 60;
      var seconds = Math.round(num % 60);
      return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    }
    let oldtext = ''
    let htmloldtext = ''
    const changeArticleMold = () => {
      // setArrt.formData.contentDetails = '';
      if (setArrt.formData.articleMold === 1) {
        setArrt.formRules = {
          theme: [{ required: true, message: '文章主题必填', trigger: 'blur' }],
          // articleDesc: [{ required: true, message: '文章描述必填', trigger: 'blur' }],
          articleType: [{ required: true, message: '文章分类必填', trigger: 'blur' }],
          contentDetails: [{ required: true, message: '内容详情必填', trigger: 'blur' }],
          videoCover: [{ required: true, message: '视频封面必填', trigger: 'blur' }],
          videoUrl: [{ required: true, message: '视频必填', trigger: 'blur' }],
          mainImage: [{ required: true, message: '文章主图必填', trigger: 'blur' }],
          // releaseTime: [{ required: true, message: '发布时间必填', trigger: 'blur' }],
          recommend: [{ required: true, message: '文章推荐必填', trigger: 'blur' }],
          articleSource: [{ required: true, message: '文章来源必填', trigger: 'blur' }]
        }
        oldtext = setArrt.formData.contentDetails
        if (htmloldtext) {
          setArrt.formData.contentDetails = htmloldtext;
        } else {
          setArrt.formData.contentDetails = '<p><br></p>';
        }
        console.log(setArrt.formData.contentDetails)
        nextTick(() => {
          VoWangEditorRef.value && VoWangEditorRef.value.setHtml(setArrt.formData.contentDetails);
        })
      } else {
        setArrt.formRules = {
          theme: [{ required: true, message: '文章主题必填', trigger: 'blur' }],
          // articleDesc: [{ required: true, message: '文章描述必填', trigger: 'blur' }],
          articleType: [{ required: true, message: '文章分类必填', trigger: 'blur' }],
          contentDetails: [{ required: false, message: '内容详情必填', trigger: 'blur' }],
          videoCover: [{ required: true, message: '视频封面必填', trigger: 'blur' }],
          videoUrl: [{ required: true, message: '视频必填', trigger: 'blur' }],
          mainImage: [{ required: true, message: '文章主图必填', trigger: 'blur' }],
          // releaseTime: [{ required: true, message: '发布时间必填', trigger: 'blur' }],
          recommend: [{ required: true, message: '文章推荐必填', trigger: 'blur' }],
          articleSource: [{ required: true, message: '文章来源必填', trigger: 'blur' }]
        }
        htmloldtext = setArrt.formData.contentDetails
        if (oldtext) {
          setArrt.formData.contentDetails = oldtext;
        } else {
          setArrt.formData.contentDetails = '';
        }
      }
    }
    const deleteVideoUrl = () => {
      console.log(11)
      videoFile.value = [];
      setArrt.formData.videoUrl = '';
      setArrt.sliderMaxTime = '';
    }
    const setInputNumber = () => {
      if (setArrt.formData.playbackNum) {
        let str = setArrt.formData.playbackNum + ''
        setArrt.formData.playbackNum = Number(str.replace(/[^0-9]/g, ''))
        setArrt.formData.playbackNum = Math.abs(setArrt.formData.playbackNum)
      }
    }
    const outPage = () => {
      let newData = JSON.stringify(setArrt.formData)
      console.log(newData, oldData, newData === oldData)
      if (newData === oldData) {
        artBack()
      } else {
        setArrt.maskState = true;
      }
    }
    const getDetails = () => {
      queryArticleDetails({ id: Number(route.query.id) }).then((res: any) => {
        if (res.code === 200) {

          setArrt.formData.id = res.data.id;
          setArrt.formData.theme = res.data.theme;
          setArrt.formData.recommend = res.data.recommend;
          setArrt.formData.articleType = res.data.articleType;
          setArrt.formData.articleTypeDesc = res.data.articleTypeDesc;
          setArrt.formData.playbackNum = res.data.playbackNum;
          setArrt.formData.releaseTime = res.data.releaseTime;
          setArrt.formData.articleSource = res.data.articleSource;
          setArrt.formData.contentDetails = res.data.contentDetails;
          setArrt.formData.remark = res.data.remark;
          setArrt.formData.status = res.data.status;
          setArrt.formData.releaseTime = res.data.releaseTime;
          setArrt.formData.releaseTime = res.data.releaseTime;
          setArrt.formData.mainImage = res.data.mainImage;
          setArrt.formData.articleSourceUrl = res.data.articleSourceUrl;
          setArrt.formData.articleMold = res.data.articleMold;
          setArrt.formData.videoCover = res.data.videoCover;
          setArrt.formData.videoUrl = res.data.videoUrl;
          imgFileUpload.value = true;
          if (setArrt.formData.mainImage) {
            imgFile.value[0] = {
              name: '',
              url: setArrt.formData.mainImage
            };
          }
          if (setArrt.formData.videoCover) {
            coverFile.value[0] = {
              name: '',
              url: setArrt.formData.videoCover
            };
          }
          if (setArrt.formData.videoUrl) {
            videoFile.value[0] = {
              name: '',
              url: setArrt.formData.videoUrl
            };
          }
          headImgFile.value[0] = {
            name: '',
            url: setArrt.formData.articleSourceUrl
          };
          console.log("---------", this, oldData)
          oldData = JSON.stringify(setArrt.formData)

        }
      });
    }
    return {
      outPage,
      setInputNumber,
      ...toRefs(setArrt),
      artBack,
      change,
      playPause,
      getTimeUpdate,
      getDuration,
      deleteVideoUrl,
      onSubmit,
      handleUpload,
      handleCoverUpload,
      handleHeadUpload,
      typeSelectChange,
      formatImgResponse,
      checkUpload,
      checkHeadUpload,
      removeMain,
      imgFile,
      coverFile,
      headImgFile,
      VoWangEditorRef,
      imgFileUpload,
      headUpload,
      clipperData,
      browserUpload,
      onConfirm,
      onHeadConfirm,
      clipperRef,
      clipperRef1,
      videoFile,
      handleVideoUpload,
      changeArticleMold,
      removeCover,
      onCoverConfirm,
      currentTime,
      oldData,
    };
  }
};
</script>

<style lang="scss" scoped>
.mark-box {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .new-item {
    height: 23px;
    font-weight: 600;
    font-size: 14.72px;
    color: #222222;
    padding: 10px 10px;
    display: flex;
    align-items: center;

    div {
      &:nth-child(1) {
        width: 407px;
      }
    }
  }

  .content-box {
    flex: 1;
    width: 100%;
    height: calc(100% - 43px);
    display: flex;
    justify-content: space-between;

    .preview-box {
      width: 407px;
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 16px 0px rgba(87, 102, 254, 0.07);
      border-radius: 14px;
      padding: 18px 26px 18px 36px;
      box-sizing: border-box;
      overflow-y: auto;

      .topImg {
        width: 334px;
      }

      .preview-content {
        width: 334px;
        padding: 0 16px;
        box-sizing: border-box;

        .title-theme {
          font-size: 21px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 29px;
          margin: 8px 0;
          word-break: break-word;
        }
      }

      .video-box {
        width: 333px;
        height: 722px;
        background: #010101;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        video {
          width: 100%;
          // margin-top: 130px;
        }

        img {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .text-box {
          position: absolute;
          bottom: 124px;
          left: 12px;

          p {
            &:nth-child(1) {
              font-size: 14px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #FFFFFF;
              line-height: 20px;
              margin-bottom: 4px;

              img {
                width: 16px;
                height: 15px;
                position: sticky;
                margin: 0px 4px -2px 10px;
              }

              span {
                font-size: 14px;
                color: #A49E9E;
              }
            }

            &:nth-child(2) {
              // width: 252px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #E7E7E7;
              line-height: 18px;
              word-break: break-word;

              span {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #A49E9E;
                line-height: 18px;

                &:nth-child(2) {
                  cursor: pointer;
                }
              }
            }
          }
        }

        .time-text {
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #A49E9E;
          line-height: 14px;
          position: absolute;
          bottom: 107px;
          left: 12px;
        }

        .video-control {
          width: 100%;
          height: 17px;
          padding: 0 10px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          bottom: 80px;
          left: 0;

          img {
            width: 17px;
            height: 17px;
          }

          span {
            width: 44px;
            height: 15px;
            font-size: 11px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 15px;
            margin-left: 7px;
          }
        }

        .gesture-line {
          width: 124px;
          height: 4px;
          background: #FFFFFF;
          border-radius: 89px;
          position: absolute;
          bottom: 7px;
          left: 104px;
        }
      }

      .information-box {
        width: 100%;
        height: 61px;
        border-bottom: 1px solid rgba($color: #979797, $alpha: 0.22);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .information-left {
          flex: 1;
          font-size: 14px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #3B3B3B;
          line-height: 20px;

          p {
            &:nth-child(2) {
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #828284;
              line-height: 15px;
            }
          }
        }

        .information-right {
          min-width: 73px;
          height: 27px;
          background: #EDF4FF;
          border-radius: 4px;
          font-size: 11px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #3476FF;
          line-height: 27px;
          text-align: center;
        }
      }
    }

    .form-box {
      flex: 1;
      margin-left: 14px;
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 16px 0px rgba(87, 102, 254, 0.07);
      border-radius: 14px;
      padding: 20px 31px 21px 23px;
      box-sizing: border-box;
      overflow-y: auto;

      .tip-text {
        margin-left: 6px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #A2A1A1;
        line-height: 16px;
      }
    }
  }

  .video-show-box {
    width: 108px;
    height: 108px;
    background: #f3f3f3;
    border: 1px dashed #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    video {
      max-width: 100%;
      max-height: 100%;
    }

    &:hover .mask {
      display: flex;
    }

    .mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      display: none;
    }
  }

  .btn-state {
    padding-top: 58px;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 126px;
      height: 41px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: bold;
      border: none;

      &:nth-child(1) {
        color: #FFFFFF;
        background: #3D7EFF;
        margin-left: -126px;
        margin-right: 10px;
      }

      &:nth-child(2) {
        margin-left: 10px;
        color: #3D7EFF;
        background: #F5F8FD;
      }
    }
  }

  .artic-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 6px 0;
    border-radius: 8px;
  }

  .headImg {
    ::v-deep(.t-upload__image-add) {
      width: 70px !important;
      height: 70px !important;
      border-radius: 50% !important;
    }

    ::v-deep(.t-upload__image-add) {
      width: 70px !important;
      height: 70px !important;
      border-radius: 50% !important;
    }

    ::v-deep(.t-upload__card-content) {
      width: 72px !important;
      height: 72px !important;
      border-radius: 50% !important;
    }

    ::v-deep(.t-upload__card-image) {
      border-radius: 50% !important;
    }

    // .t-upload__image-add .t-upload__card-container .t-upload__card-box {}
  }

  .edit-box {
    ::v-deep(.w-e-text-container) {
      min-height: 400px;
      height: 100%;
    }
  }

  ::v-deep(.w-e-scroll) {
    height: 400px;
  }

  .w50 {
    width: 40%;
  }

  .go-back {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 20px 120px;

    button {
      width: 126px;
      height: 41px;
      background: #F5F8FD;
      border-radius: 24px;
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #3D7EFF;
      line-height: 18px;
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

  .head-box {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #f3f3f3;
    border: 1px dashed #ddd;

    .upload-img-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      margin-top: 10px;

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
      margin-top: 8px;
    }

  }

  .mask-box {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    .content-box {
      width: 444px;
      height: 258px;
      background: #FFFFFF;
      border-radius: 14px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;

      h2 {
        padding: 25px 0 36px 0;
        text-align: center;
        font-size: 23px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #222222;
        line-height: 33px;
      }

      p {
        padding-bottom: 59px;
        text-align: center;
        font-size: 25px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 36px;
      }

      .btn-box {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        line-height: 18px;

        button {
          width: 144px;
          height: 48px;
          border-radius: 24px;
          font-weight: bold;
          border: none;

          &:nth-child(1) {
            color: #3D7EFF;
            background: #F5F8FD;
            margin-right: 28px;
          }

          &:nth-child(2) {
            color: #FFFFFF;
            background: #3D7EFF;
            margin-left: 28px;
          }
        }
      }
    }
  }
}
</style>

<style>
.my-video-control-slider {
  .t-slider__track {
    height: 2px;
    background: #FFFFFF;
  }

  .t-slider__rail {
    height: 2px;
    background: #4A4A4A;
  }

  .t-slider__button {
    width: 7px;
    height: 7px;
    border: none;
  }
}

.wz-form-box .t-textarea__limit {
  position: relative;
  bottom: 25px;
  right: 10px;
}

.wz-form-box .t-textarea__inner {
  border-radius: 7px;
  min-height: 59px;
}

.wz-form-box .form-input .t-textarea__inner {
  border-radius: 7px;
  min-height: 100px;
}

.wz-form-box .form-input2 .t-textarea__inner {
  border-radius: 7px;
  min-height: 211px;
}

.wz-form-box .form-input .t-input {
  border-radius: 7px;
  height: 39px;
}

.wz-form-box .t-form__label {
  font-size: 14px;
  color: #5E5F60;
}
</style>
