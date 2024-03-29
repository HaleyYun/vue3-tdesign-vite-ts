<template>
  <div class="mark-box">
    <div class="box-img" @click="handlerRest">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text">{{ title }}产品</t-button>
      </div>
    </div>
    <div class="found-info">
      <div style="width: 450px; height: 100%">
        <t-card hover-shadow style="width: 100%; height: 100%">
          <t-tabs v-model="tabsActiveValue" @change="tabsChange">
            <t-tab-panel class="tabs" :value="item.id" v-for="(item, index) in tabList" :label="item.title" :destroy-on-hide="false" :key="index" style="width: 100%; height: 692px; overflow-y: scroll">
              <div class="new-item" style="text-align: center; color: #707070">页面预览</div>
              <!-- 基础信息 -->
              <t-card class="preview" v-if="index === 0">
                <div style="display: flex; flex-wrap: nowrap; background: #f1f1f1; padding: 20px; border-radius: 8px">
                  <div style="width: 136px; height: 136px; margin-right: 10px">
                    <div v-if="formData.mainPic" style="width: 100%; height: 100%; margin-right: 10px">
                      <img style="width: 100%; height: 100%; border-radius: 8px" :src="formData.mainPic" />
                    </div>
                  </div>
                  <div style="width: 200px">
                    <div style="font-weight: 600; font-size: 20px; color: #000; padding: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis" v-if="formData.prodName">{{ formData.prodName }}</div>
                    <div style="font-size: 15px; color: #3d3d3d; overflow: hidden; padding: 5px; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical" v-if="formData.prodDescribe">
                      {{ formData.prodDescribe }}
                    </div>
                    <t-button style="margin: 40px 0 0 105px; background: #3d7eff; border-radius: 6px; height: 40px" shape="rectangle" size="medium" v-if="formData.prodPrice">￥{{ formData.prodPrice }}元</t-button>
                  </div>
                </div>
              </t-card>
              <!-- 详情预览 -->
              <t-card class="preview" v-if="index === 1">
                <div style="display: flex; flex-direction: column">
                  <div style="width: 100%; height: 263px">
                    <div style="width: 100%; height: 100%">
                      <t-swiper class="tdesign-demo-block--swiper" :duration="300" :interval="1000" autoplay loop>
                        <t-swiper-item v-for="item in playPicList" :key="item" v-if="formData.playPicList">
                          <img style="width: 100%; height: 100%; border-radius: 8px" :src="item.url" />
                        </t-swiper-item>
                      </t-swiper>
                    </div>
                  </div>
                  <div style="padding: 10px">
                    <div v-if="formData.prodPrice" style="font-size: 25px; color: #ff5a00; text-align: left">￥{{ formData.prodPrice }}元</div>
                    <div style="font-weight: 600; font-size: 20px; color: #222; padding: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis" v-if="formData.prodName">
                      {{ formData.prodName }}
                    </div>
                    <div style="font-size: 15px; color: #3d3d3d; overflow: hidden; padding: 5px; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical" v-if="formData.prodDescribe">
                      {{ formData.prodDescribe }}
                    </div>
                    <div style="font-size: 12px; font-family: PingFangSC-Regular, PingFang SC; font-weight: 400; color: #9f9f9f; line-height: 17px; text-align: center; padding: 10px 0" v-if="formData.detailPic">— 商品详情 —</div>
                    <div v-if="formData.detailPic" style="width: 100%; height: 100%">
                      <img style="width: 100%; height: 100%; border-radius: 8px" :src="formData.detailPic" />
                    </div>
                  </div>
                </div>
              </t-card>
            </t-tab-panel>
          </t-tabs>
        </t-card>
      </div>
      <div style="margin-left: 15px; width: 704px; height: 100%">
        <t-card hover-shadow style="height: 100%">
          <div class="tits">注:默认上架状态</div>
          <t-form :data="formData" @submit="onSubmit" :disabled="title === '查看' ? true : false" :rules="(formRules as FormRules<Data>)" style="height: 100%">
            <div v-if="tabsActiveValue === 1">
              <t-form-item requiredMark label="产品名称:" name="prodName" initial-data="TDesign">
                <t-textarea v-model="formData.prodName" show-limit-number :maxlength="30" allowInputOverMax="true" placeholder="请输入产品名称" :autosize="{ minRows: 2, maxRows: 2 }" />
              </t-form-item>
              <t-form-item requiredMark label="产品描述:" name="prodDescribe">
                <t-textarea v-model="formData.prodDescribe" show-limit-number :maxlength="50" allowInputOverMax="true" placeholder="请输入产品描述" :autosize="{ minRows: 4, maxRows: 5 }" />
              </t-form-item>
              <t-form-item requiredMark label="产品分类:" name="servId">
                <t-select v-model="formData.typeName" :options="typeData" @change="typeSelectChange" placeholder="请选择产品" filterable> </t-select>
              </t-form-item>
              <t-form-item requiredMark label="服务规则:" name="servId">
                <t-select v-model="formData.servName" @change="servSelectChange" placeholder="去选择服务规则" style="width: 100%; padding: 5px 0">
                  <t-option v-for="(item, index) in viewData" :key="index" :label="item.servName" :value="item.id" />
                </t-select>
              </t-form-item>

              <t-form-item requiredMark label="禁用/启用:" name="prodStatus">
                <t-switch v-model="formData.prodStatus" :customValue="[1, 0]" />
              </t-form-item>
              <div style="display: flex; justify-content: space-between">
                <t-form-item requiredMark label="市场价格:" name="realPrice">
                  <t-input-number :min="0" :decimalPlaces="2" allowInputOverLimit v-model="formData.prodPrice" @blur="checkProdPrice"></t-input-number>
                  <span class="notes">请填写市场价格(￥)</span>
                </t-form-item>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 15px">
                <t-form-item requiredMark label="商品主图:" name="mainPic">
                  <t-upload
                    ref="uploadRef"
                    v-if="disUpload"
                    v-model:files="(mainPic as UploadFile[])"
                    tips="请注意图片尺寸(177px*154px)"
                    :defaultFiles="(mainPic as UploadFile[])"
                    theme="image"
                    :headers="headers"
                    @remove="removeMain"
                    :action="imgUploadUrl"
                    :formatResponse="formatImgResponse"
                    accept="image/*"
                    :onSuccess="handleUpload"
                    :beforeAllFilesUpload="checkMainPicUpload"
                    :locale="{
                      triggerUploadText: {
                        image: '请选择图片'
                      }
                    }"
                  ></t-upload>
                  <div class="img-box" @click="browserUpload('mainPic')" v-else>
                    <div class="upload-img-box">
                      <AddIcon class="icon" />
                      <span class="check-img">请选择图片</span>
                    </div>
                    <div class="check-text">请上传177px*154px图片</div>
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
              </div>
            </div>
            <div v-if="tabsActiveValue === 2" style="width: 100%; height: 570px">
              <t-form-item style="margin-bottom: 50px" requiredMark label="详情轮播图:" name="playPicList" class="playPicList">
                <t-upload
                  ref="uploadRef"
                  class="playImgurl"
                  v-show="playPicList.length > 0"
                  v-model:files="(playPicList as UploadFile[])"
                  theme="image"
                  tips="图片尺寸(343px*176px)最多支持6张。"
                  :size-limit="{ size: 2, unit: 'MB' }"
                  :action="imgUploadUrl"
                  :formatResponse="formatImgResponse"
                  accept="image/*"
                  multiple
                  :headers="headers"
                  :onSuccess="bannerImgUpload"
                  :beforeAllFilesUpload="checkPlayPicUpload"
                ></t-upload>
                <div class="img-box playImg" @click="browserUpload('playPicList')" v-if="playPicList.length <= 5">
                  <div class="upload-img-box">
                    <AddIcon class="icon" />
                    <span class="check-img">请选择图片</span>
                  </div>
                  <div class="check-text">图片尺寸(343px*176px)最多支持6张。</div>
                </div>
                <cropper
                  ref="clipperRef2"
                  :type="clipperData.type"
                  :allow-type-list="clipperData.allowTypeList"
                  :limit-size="clipperData.limitSize"
                  :fixed-number="clipperData.fixedNumber"
                  :fixed-number-aider="clipperData.fixedNumberAider"
                  :preview-width="clipperData.previewWidth"
                  :auto-crop-width="clipperData.autoCropWidth"
                  :auto-crop-height="clipperData.autoCropHeight"
                  @confirm="onPlayConfirm"
                />

                <!-- <t-upload ref="uploadRef" v-if="playlUpload"  v-model:files="(playPicList as UploadFile[])"
                                    tips="注默认一张静态显示，图片尺寸(343px*176px)最多支持5张。" :defaultFiles="(playPicList as UploadFile[])"
                                    theme="image" :size-limit="{ size: 2, unit: 'MB' }" :action="imgUploadUrl"
                                    :formatResponse="formatImgResponse" accept="image/*" :onRemove="deleteBannerImg"
                                    :headers="headers" :max="5" multiple :onSuccess="bannerImgUpload"
                                    :beforeAllFilesUpload="checkPlayPicUpload" :locale="{
                                        triggerUploadText: {
                                            image: '请选择图片'
                                        }
                                    }"></t-upload>
                                <div class="img-box" @click="browserUpload('playPicList')" v-else>
                                    <div class="upload-img-box">
                                        <AddIcon class="icon" />
                                        <span class="check-img">请选择图片</span>
                                    </div>
                                    <div class="check-text">请上传343px*176px图片</div>
                                </div>
                                <cropper ref="clipperRef2" :type="clipperData.type"
                                    :allow-type-list="clipperData.allowTypeList" :limit-size="clipperData.limitSize"
                                    :fixed-number="clipperData.fixedNumber"
                                    :fixed-number-aider="clipperData.fixedNumberAider"
                                    :preview-width="clipperData.previewWidth" :auto-crop-width="clipperData.autoCropWidth"
                                    :auto-crop-height="clipperData.autoCropHeight" @confirm="onPlayConfirm" /> -->
                <!-- <div v-for="(item, index) in playImgList">
                                    <t-upload ref="uploadRef" v-if="item.playPicList"
                                        v-model:files="(item.playPicList as UploadFile[])"
                                        tips="注默认一张静态显示，图片尺寸(343px*176px)最多支持5张。" theme="image" :action="imgUploadUrl"
                                        :formatResponse="formatImgResponse" accept="image/*" :onRemove="deleteBannerImg"
                                        :headers="headers" :onSuccess="bannerImgUpload"
                                        :beforeAllFilesUpload="checkPlayPicUpload" :locale="{
                                            triggerUploadText: {
                                                image: '请选择图片'
                                            }
                                        }"></t-upload>
                                </div>
                                <div class="img-box" @click="browserUpload('playPicList')">
                                    <div class="upload-img-box">
                                        <AddIcon class="icon" />
                                        <span class="check-img">请选择图片</span>
                                    </div>
                                    <div class="check-text"></div>
                                </div>
                                <cropper :id="'clipperRefPlay'" :type="clipperData.type"
                                    :allow-type-list="clipperData.allowTypeList" :limit-size="clipperData.limitSize"
                                    :fixed-number="clipperData.fixedNumber"
                                    :fixed-number-aider="clipperData.fixedNumberAider"
                                    :preview-width="clipperData.previewWidth" :index="clipperData.index"
                                    :auto-crop-width="clipperData.autoCropWidth"
                                    :auto-crop-height="clipperData.autoCropHeight" @confirm="onPlayConfirm" /> -->
              </t-form-item>
              <t-form-item requiredMark label="商品详情图:" name="detailPic">
                <t-upload
                  ref="uploadRef"
                  v-if="detailUpload"
                  v-model:files="(detailPic as UploadFile[])"
                  tips="请注意图片尺寸(宽度370px)。"
                  :defaultFiles="(detailPic as UploadFile[])"
                  theme="image"
                  :size-limit="{ size: 2, unit: 'MB' }"
                  :headers="headers"
                  @remove="removeDetail"
                  :action="imgUploadUrl"
                  :formatResponse="formatImgResponse"
                  accept="image/*"
                  :beforeAllFilesUpload="checkDetailPicUpload"
                  :onSuccess="detailImgUpload"
                >
                </t-upload>
                <div class="img-box" @click="browserUpload('detailPic')" v-else>
                  <div class="upload-img-box">
                    <AddIcon class="icon" />
                    <span class="check-img">请选择图片</span>
                  </div>
                  <div class="check-text">请注意图片尺寸(宽度370px)</div>
                </div>
                <cropper
                  ref="clipperRef1"
                  :type="clipperData.type"
                  :allow-type-list="clipperData.allowTypeList"
                  :limit-size="clipperData.limitSize"
                  :fixed-number="clipperData.fixedNumber"
                  :fixed-number-aider="clipperData.fixedNumberAider"
                  :preview-width="clipperData.previewWidth"
                  :auto-crop-width="clipperData.autoCropWidth"
                  :auto-crop-height="clipperData.autoCropHeight"
                  @confirm="onDetailConfirm"
                />
              </t-form-item>
            </div>
            <div class="btn-commit" style="margin-top: 20px">
              <t-button v-if="title === '新增' ? true : title === '编辑' ? true : false" class="search-item" theme="primary" type="submit">发布商品</t-button>
              <t-button variant="outline" v-if="title === '新增' ? true : title === '编辑' ? true : false" theme="primary" class="clear-item" style="margin-left: 20px" type="reset" @click="artBack">取消</t-button>
            </div>
          </t-form>
          <div v-if="title == '查看'" style="display: flex; justify-content: center">
            <t-button variant="outline" theme="primary" style="margin-left: 20px" type="reset" @click="artBack">返回</t-button>
          </div>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { Data, FormRules, InputNumberValue, MessagePlugin, SelectValue, TabValue, UploadFile, UploadRemoveContext } from 'tdesign-vue-next';
import { useRoute } from 'vue-router';
import { AddIcon, AddCircleIcon } from 'tdesign-icons-vue-next';
import cropper from '@/components/ImgCropping/Cropper.vue';
import { addServiceProd, deleteServiceProd, updateServiceProd, getServiceProd, queryServicePro, queryService, queryServiceType } from '../../request/modules/ServiceApi';
export default {
  components: {
    AddIcon
  },
  setup() {
    const disabled = ref(false);
    const uploadAllFilesInOneRequest = ref(false);
    const autoUpload = ref(true);
    const mainPic = ref<any>([]);
    const playPicList = ref<any>([]);
    const detailPic = ref<any>([]);
    const clipperRef = ref<any>({});
    const clipperRef1 = ref<any>({});
    const clipperRef2 = ref<any>({});
    const disUpload = ref<boolean>(false);
    const playlUpload = ref<boolean>(false);
    const detailUpload = ref<boolean>(false);
    const playImgList = ref<any>([]);
    const clipperData = ref<any>({
      type: '',
      allowTypeList: ['png', 'jpg', 'jpeg'],
      limitSize: 1,
      fixedNumber: [1, 1],
      previewWidth: 100,
      autoCropWidth: 80, // 默认生成截图框宽度
      autoCropHeight: 70 // 默认生成截图框高度
    });
    const route = useRoute();
    const router = useRouter();
    const setArrt = reactive({
      tabList: [
        { title: '基础信息', id: 1 },
        { title: '详情信息', id: 2 }
      ],
      tabsActiveValue: 1,
      title: '新增',
      imgUploadUrl: import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate',
      searchData: {
        prodName: '',
        prodCode: '',
        prodStatus: 1,
        pageNum: 1,
        pageSize: 10
      },
      typeSelectList: [{ categoryName: '', id: '', status: '' }],
      formRules: {
        prodName: [{ required: true, message: '产品名称必填', trigger: 'blur' }],
        prodDescribe: [{ required: true, message: '产品描述必填', trigger: 'blur' }],
        prodPrice: [{ required: true, message: '市场价格必填', trigger: 'blur' }],
        mainPic: [{ required: true, message: '商品主图必填', trigger: 'blur' }],
        servId: [{ required: true, message: '关联服务必填', trigger: 'blur' }],
        prodStatus: [{ required: true, message: '商品上下架必填', trigger: 'blur' }],
        playPicList: [{ required: true, message: '商品轮播图必填', trigger: 'blur' }],
        detailPic: [{ required: true, message: '商品详情图必填', trigger: 'blur' }]
      },
      serData: [],
      formData: {
        createTime: '',
        createUser: '',
        detailPic: '',
        id: 0,
        isDelete: 0,
        mainPic: '',
        playPicList: [] as any,
        prodCode: '',
        prodDescribe: '',
        prodName: '',
        prodPrice: 0,
        prodSold: 0,
        prodStatus: 1,
        realPrice: 0,
        remark: '',
        servId: 0,
        showSold: 0,
        updateTime: '',
        updateUser: '',
        servName: '',
        serviceType: '',
        typeName: '',
        typeId: ''
        // paymentMethod: '1',
        // recommended: '1'
      },
      isCommit: false,
      headers: {
        token: ''
      },
      listData: {
        checkCount: 0,
        checkInterval: 0,
        checkType: '',
        interveneCycle: 0,
        isDelete: 0,
        isIntervene: 1,
        pageNum: 1,
        pageSize: 999,
        servName: '',
        servStatus: 1
      },
      viewData: [{ servName: '', id: '', servStatus: '' }],
      artList: [] as any,
      typeData: []
    });
    const tabsChange = (value: TabValue) => {
      setArrt.tabsActiveValue = value as number;
    };
    onMounted(() => {
      let token = localStorage.getItem('x-auth-token');
      setArrt.headers.token = token as string;
      setArrt.title = String(route.query.title);
      getServiceList();
      getServicesList();
      getDictData();

      // let playPicList = [{
      //     name: '',
      //     url: ''
      // }] as any
      // for (let i = 0; i < 5; i++) {
      //     playImgList.value.push(playPicList)
      // }
      // console.log(playImgList.value)
      // if (route.query.id) {
      //     let id = Number(route.query.id)
      //     getServiceProdDetail(id)
      // }
    });

    const getServiceProdDetail = (value: number) => {
      getServiceProd({ id: value }).then((res: any) => {
        if (res.code === 200) {
          // mainPic = res.data.mainImage
          // playPicList = res.data.mainImage
          // detailPic = res.data.mainImage
          setArrt.formData = res.data;
        }
      });
    };
    // 获取服务分类字典
    const getDictData = () => {
      let searchData = {
        pageNum: 1,
        pageSize: 99,
        servTypeName: '',
        servTypeOrder: 0,
        servTypeStatus: 1
      };
      queryServiceType(searchData).then((res: any) => {
        if (res.code == 200) {
          setArrt.typeData = res.data.data.map((item: any) => {
            return {
              label: item.servTypeName,
              value: item.id
            };
          });
        }
      });
    };
    // 获取分类列表
    const getServiceList = () => {
      // return
      queryService(setArrt.listData).then((res: any) => {
        if (res.code === 200) {
          setArrt.viewData = res.data.data;
        }
      });
    };
    const checkProdPrice = (value: InputNumberValue) => {
      setArrt.formData.prodPrice = Math.abs(Number(value));
    };
    const checkProdSold = (value: InputNumberValue) => {
      setArrt.formData.prodSold = Math.abs(Number(value));
    };
    //后退
    const handlerRest = () => {
      router.go(-1);
    };
    const removeMain = () => {
      setArrt.formData.mainPic = '';
      disUpload.value = false;
      mainPic.value = [];
    };
    const removeDetail = () => {
      setArrt.formData.detailPic = '';
      detailUpload.value = false;
      detailPic.value = [];
    };
    //获取列表
    const getServicesList = () => {
      queryServicePro(setArrt.searchData).then((res: any) => {
        if (res.code === 200) {
          setArrt.serData = res.data.data;
        }
      });
    };

    const formatImgResponse = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };
    const handleUpload = (value: any) => {
      setArrt.formData.mainPic = value.response.url;
    };
    const bannerImgUpload = (value: any) => {
      // value.response.forEach((el: any) => {
      //     setArrt.formData.playPicList.push(el.url)
      // });
    };

    const detailImgUpload = (value: any) => {
      setArrt.formData.detailPic = value.response.url;
    };

    const checkMainPicUpload = (files: UploadFile[]): boolean | Promise<boolean> => {
      // return true
      return new Promise(function (resolve, reject) {
        let width = 177;
        let height = 154;
        let url = '';
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          // console.log('img.width', img.width, img.height);
          let valid = img.width == width && img.height == height;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(177px*154px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const checkPlayPicUpload = (files: UploadFile[]): boolean | Promise<boolean> => {
      // return true
      return new Promise(function (resolve, reject) {
        let width = 343;
        let height = 176;
        let url = '';
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          // console.log('img.width', img.width, img.height);
          let valid = img.width == width && img.height == height;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(343px*176px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const checkDetailPicUpload = (files: UploadFile[]): boolean | Promise<boolean> => {
      // return true
      return new Promise(function (resolve, reject) {
        let width = 370;
        let url = '';
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          let valid = img.width == width;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(宽度370px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };

    const servSelectChange = (value: SelectValue) => {
      for (let i = 0; i < setArrt.viewData.length; i++) {
        if (setArrt.viewData[i].id === value) {
          setArrt.formData.servName = setArrt.viewData[i].servName;
          setArrt.formData.servId = Number(setArrt.viewData[i].id);
        }
      }
    };

    const typeSelectChange = (value: any, context: any) => {
      let t = context.selectedOptions.map(item => {
        return {
          label: item.label
        };
      });
      setArrt.formData.typeName = t[0].label;
      setArrt.formData.typeId = value;
    };
    const browserUpload = (value: any) => {
      console.log(value);
      if (value == 'mainPic') {
        clipperData.value.autoCropWidth = 177;
        clipperData.value.autoCropHeight = 154;
        clipperRef.value.uploadFile();
      } else if (value == 'playPicList') {
        // clipperData.value.index = num
        clipperData.value.autoCropWidth = 343;
        clipperData.value.autoCropHeight = 176;
        // let el: any = document.getElementById('clipperRefPlay' + num)?.childNodes;
        // el[0]?.click()
        clipperRef2.value.uploadFile();
      } else {
        clipperData.value.autoCropWidth = 370;
        clipperData.value.autoCropHeight = 370;
        clipperRef1.value.uploadFile();
      }
    };

    const onConfirm = (val: any) => {
      disUpload.value = true;
      mainPic.value[0] = {
        name: '',
        url: val
      };
      setArrt.formData.mainPic = val;
    };
    const onPlayConfirm = (val: any, index: number) => {
      playlUpload.value = false;
      if (playPicList.value.length < 6) {
        playPicList.value.push({
          name: '',
          url: val
        });
      }
      console.log(playPicList.value);
      // playImgList.value[index].name = ''
      // playImgList.value[index].url = val
      // playImgList.value.forEach((item: any, i: number) => {
      //     if (i === index) {
      //         // item.playPicList = [{
      //         //     name: '',
      //         //     url: val
      //         // }]
      //         item.playlUpload = true;
      //         item.playPicList = [{
      //             name: '',
      //             url: val,
      //             playlUpload: true
      //         }]
      //         return
      //     }
      // })
      // console.log(playImgList.value)
      // playlUpload.value = true;
      // playPicList.value[0] = {
      //     name: '',
      //     url: val,
      //     playlUpload: true
      // }
    };
    const onDetailConfirm = (val: any) => {
      detailUpload.value = true;
      detailPic.value[0] = {
        name: '',
        url: val
      };
      setArrt.formData.detailPic = val;
    };
    const onSubmit = () => {
      if ((setArrt.formData.prodPrice as any) == '') {
        MessagePlugin.warning('市场价格不可为空');
        return;
      }
      if (setArrt.title === '新增') {
        setArrt.formData.mainPic = mainPic.value[0]?.url;
        setArrt.formData.playPicList = playPicList.value.map((el: any) => {
          return el.url;
        });
        if (!setArrt.formData.mainPic) {
          MessagePlugin.warning('商品主图不可为空');
          return;
        }
        setArrt.formData.detailPic = detailPic.value[0]?.url;
        if (setArrt.formData.playPicList.length < 0) {
          MessagePlugin.warning('商品轮播图不可为空');
          return;
        }

        if (!setArrt.formData.detailPic) {
          MessagePlugin.warning('商品详情图不可为空');
          return;
        }

        //新增接口
        if (!setArrt.formData.servId || setArrt.formData.servName == '') {
          MessagePlugin.warning('关联服务规则不能为空');
          setArrt.formData.playPicList = [];
          return;
        }
        addServiceProd(setArrt.formData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            router.push('/ServiceProducts');
          }
        });
      } else if (setArrt.title === '编辑') {
        //编辑接口
        setArrt.formData.playPicList = playPicList.value.map((el: any) => {
          return el.url;
        });
        if (!setArrt.formData.mainPic) {
          MessagePlugin.warning('商品主图不可为空');
          return;
        }
        if (!setArrt.formData.servId || setArrt.formData.servName == '') {
          MessagePlugin.warning('关联服务规则不能为空');
          return;
        }
        setArrt.formData.detailPic = detailPic.value[0]?.url;
        if (!setArrt.formData.playPicList.length) {
          MessagePlugin.warning('商品轮播图不可为空');
          return;
        }

        if (!setArrt.formData.detailPic) {
          MessagePlugin.warning('商品详情图不可为空');
          return;
        }
        updateServiceProd(setArrt.formData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            router.push('/ServiceProducts');
          }
        });
      }
    };

    const artBack = () => {
      router.push('/ServiceProducts');
    };
    return {
      ...toRefs(setArrt),
      checkProdPrice,
      checkProdSold,
      tabsChange,
      artBack,
      onSubmit,
      handleUpload,
      bannerImgUpload,
      detailImgUpload,
      formatImgResponse,
      servSelectChange,
      typeSelectChange,
      getServicesList,
      checkMainPicUpload,
      checkPlayPicUpload,
      checkDetailPicUpload,
      clipperRef,
      clipperRef1,
      clipperRef2,
      browserUpload,
      onConfirm,
      onDetailConfirm,
      onPlayConfirm,
      handlerRest,
      playlUpload,
      clipperData,
      disUpload,
      detailUpload,
      mainPic,
      playPicList,
      detailPic,
      disabled,
      uploadAllFilesInOneRequest,
      autoUpload,
      removeMain,
      removeDetail,
      playImgList
    };
  },
  methods: {
    getDetails() {
      getServiceProd({ id: Number(this.$route.query.id as string) }).then((res: any) => {
        if (res.code === 200) {
          this.formData.typeName = res.data.typeName;
          this.formData.typeId = res.data.typeId;
          this.formData.createTime = res.data.createTime || '';
          this.formData.createUser = res.data.createUser || '';
          this.formData.id = res.data.id || 0;
          this.formData.isDelete = res.data.isDelete || 0;
          this.formData.detailPic = res.data.detailPic;
          this.formData.mainPic = res.data.mainPic || [];
          this.formData.playPicList = res.data.playPicList || [];
          this.formData.prodCode = res.data.prodCode || '';
          this.formData.serviceType = res.data.serviceType || '';
          //   this.formData.paymentMethod = res.data.paymentMethod || '1';
          //   this.formData.recommended = res.data.recommended || '1';
          // this.typeData.find((item: any) => {
          //   if (item.dictValue == res.data.serviceType) {
          //     this.formData.typeName = item.dictLabel;
          //   }
          // });
          this.formData.prodDescribe = res.data.prodDescribe || '';
          this.formData.prodName = res.data.prodName || '';
          this.formData.prodPrice = res.data.prodPrice || 0;
          //   this.formData.prodSold = res.data.prodSold || 0;
          this.formData.prodStatus = res.data.prodStatus || 0;
          // this.formData.prodStock = res.data.prodStock || 0;
          this.formData.realPrice = res.data.realPrice || 0;
          this.formData.remark = res.data.remark || '';
          this.formData.servId = res.data.servId || 0;
          this.formData.showSold = res.data.showSold || 0;
          this.formData.updateTime = res.data.updateTime || '';
          this.formData.updateUser = res.data.updateUser || '';
          this.formData.servName = res.data.servName || '';
          this.disUpload = true;
          this.playlUpload = true;
          this.detailUpload = true;
          this.mainPic[0] = {
            name: '',
            url: this.formData.mainPic
          };
          this.formData.playPicList.forEach((el: any) => {
            this.playPicList.push({
              name: '',
              url: el
            });
          });
          if (this.formData.detailPic) {
            this.detailPic[0] = {
              name: '',
              url: this.formData.detailPic
            };
          } else {
            this.detailPic = [];
          }
        }
      });
    }
  },
  async mounted() {
    if (this.$route.query.id) {
      this.getDetails();
    }
  }
};
</script>

<style lang="scss" scoped>
.mark-box {
  width: 100%;
  background: #f9f9f9;
  overflow-y: auto;

  .header {
    font-weight: bold;
    color: #222222;
    padding: 15px;
  }

  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

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

  .new-item {
    font-weight: bold;
    color: #222222;
    padding: 15px 0 10px 0;
  }

  .found-info {
    display: flex;
    width: 100%;
    height: 950px;
    flex-direction: row;
    justify-content: flex-start;

    ::v-deep(.preview) {
      border-radius: 8px;
      border: none;
    }

    ::v-deep(.preview .t-card__body) {
      padding: 0;
    }

    ::v-deep(.t-form__label) {
      color: #5e5f60;
    }

    .tits {
      width: 222px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      font-size: 14px;
      color: #ff0000;
      border-radius: 4px;
      background: rgba(255, 0, 0, 0.06);
      margin: 20px 0;
    }

    ::v-deep(.t-tabs__nav-wrap.t-is-smooth) {
      width: 100%;
    }

    ::v-deep(.narrow-scrollbar) {
      border-radius: 8px;
    }

    ::v-deep(.t-tabs__nav-item.t-size-m) {
      width: 50%;
      margin: auto;
      display: flex;
      justify-content: center;
      // text-align: center;
    }

    ::v-deep(.t-tabs__nav-item-wrapper) {
      padding: 0 30px;
      text-align: center;
    }
  }

  .tabs::-webkit-scrollbar {
    width: 0 !important;
  }

  .notes {
    font-size: 12px;
    color: #ccc;
    margin-left: 10px;
  }

  .btn-commit {
    display: flex;
    justify-content: center;
  }

  ::v-deep(.t-tabs__content) {
    background: #fff;
  }

  .search-item {
    width: 142px;
    height: 46px;
    background: #3d7eff;
    border-radius: 27px;
  }

  .clear-item {
    width: 142px;
    height: 46px;
    background: #f5f8fd;
    border-radius: 27px;
  }

  .btn-state {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    padding: 20px 120px;
  }

  .artic-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 6px 0;
    border-radius: 8px;
  }

  .w50 {
    width: 40%;
  }

  .go-back {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 20px 120px;
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
      border-radius: 3px;
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

  ::v-deep(.playPicList .t-form__controls-content) {
    display: flex;
    align-items: flex-start;
  }
}

::v-deep(.playImgurl .t-upload__card-container) {
  display: none !important;
}

::v-deep(.t-card--bordered) {
  border-radius: 16px !important;
}
</style>
