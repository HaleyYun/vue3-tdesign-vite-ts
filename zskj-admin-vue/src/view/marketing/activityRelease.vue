<template>
  <div class="release">
    <t-form colon>
      <t-form-item label="机构名称" requiredMark>
        <t-select v-model="formData.organCode" :placeholder="placeholderInstitution" :options="optionsInstitution"
          filterable :disabled="!bell" @change="onChangeInstitution" />
      </t-form-item>

      <t-form-item label="活动名称" requiredMark>
        <t-input v-model="formData.activityName" show-limit-number :maxlength="30" placeholder="请输入活动名称"></t-input>
      </t-form-item>

      <t-form-item label="活动方式" requiredMark>
        <t-select v-model="formData.activityWay" :options="optionsMode" placeholder="请选择活动方式"></t-select>
      </t-form-item>

      <t-form-item label="关联产品" requiredMark>
        <t-select v-model="formData.productCode" placeholder="请选择关联产品" :options="optionsProducts" filterable
          @change="onChangeProducts" />
      </t-form-item>

      <t-form-item label="活动分类" requiredMark>
        <t-select v-model="formData.activityCategory" :options="optionsCategory" placeholder="请选择活动分类"></t-select>
      </t-form-item>

      <t-form-item label="活动时间" requiredMark>
        <t-date-range-picker clearable v-model="timeDefaultValue" @change="onChange" />
      </t-form-item>

      <t-form-item label="活动人数" requiredMark>
        <t-select v-model="formData.activityPeopleNumber" :options="optionsParticipants" placeholder="请选择活动人数"></t-select>
      </t-form-item>

      <t-form-item label="活动描述" requiredMark>
        <t-textarea v-model="formData.activityDescribe" placeholder="请输入活动描述" :maxlength="200" clearable
          show-limit-number />
      </t-form-item>

      <t-form-item label="活动规则" requiredMark>
        <t-textarea v-model="formData.activityRule" placeholder="请输入活动规则" :maxlength="200" clearable show-limit-number />
      </t-form-item>

      <t-form-item label="列表图片" requiredMark>
        <t-upload ref="uploadRef" v-if="disUpload" v-model="file" :action="uploadUrl" theme="image"
          tips="140px*120px 支持png、jpg" :formatResponse="formatImgResponseMain" :beforeAllFilesUpload="checkUploadMain"
          :onSuccess="handleUploadMain" @fail="handleFail" accept="image/*" @remove="removeMain" :abridge-name="[5, 5]"
          :locale="{ triggerUploadText: { image: '请选择图片' } }" :headers="headers"
          :defaultFiles="(imgFile as any)"></t-upload>
        <div class="img-box" @click="browserUpload('file')" v-else>
          <div class="upload-img-box">
            <AddIcon class="icon" />
            <span class="check-img">请选择图片</span>
          </div>
          <div class="check-text">140px*120px 支持png、jpg</div>
        </div>
        <cropper ref="clipperRef" :type="clipperData.type" :allow-type-list="clipperData.allowTypeList"
          :limit-size="clipperData.limitSize" :fixed-number="clipperData.fixedNumber"
          :fixed-number-aider="clipperData.fixedNumberAider" :preview-width="clipperData.previewWidth"
          :auto-crop-width="clipperData.autoCropWidth" :auto-crop-height="clipperData.autoCropHeight"
          @confirm="onConfirm" />
      </t-form-item>

      <t-form-item label="详情图片" requiredMark>
        <t-upload ref="uploadRef1" class="detailsImg" v-show="files.length > 0" v-model="files" :action="uploadUrl"
          theme="image" tips="346px*228px 支持png、jpg" :formatResponse="formatImgResponsePlay"
          :beforeAllFilesUpload="checkUploadPlay" :onSuccess="handleUploadPlay" @fail="handleFail" accept="image/*"
          @remove="removePlay" :abridge-name="[5, 5]" :locale="{ triggerUploadText: { image: '请选择图片', }, }"
          :headers="headers" :defaultFiles="(imgFiles as any)" multiple :max="10">
        </t-upload>
        <div class="img-box" @click="browserUpload('files')">
          <div class="detail-box upload-img-box">
            <AddIcon class="icon" />
            <span class="check-img">请选择图片</span>
          </div>
          <!-- <div class="check-text">346px*228px 支持png、jpg</div> -->
        </div>
        <cropper ref="clipperRef1" :type="clipperData.type" :allow-type-list="clipperData.allowTypeList"
          :limit-size="clipperData.limitSize" :fixed-number="clipperData.fixedNumber"
          :fixed-number-aider="clipperData.fixedNumberAider" :preview-width="clipperData.previewWidth"
          :auto-crop-width="clipperData.autoCropWidth" :auto-crop-height="clipperData.autoCropHeight"
          @confirm="onFilesConfirm" />
      </t-form-item>

      <t-form-item label="活动地址" requiredMark>
        <input class="ipt-item" v-model="addressData.address" id='tipinput' placeholder="请输入活动地址">
        <t-button class="searchBut" @click="searchLocation">搜索</t-button>
        <t-button class="searchBut" @click="fill">确定</t-button>
      </t-form-item>

      <div class="LonAndLat">
        <t-form-item label="经度" requiredMark>
          <t-input v-model="addressData.longitude" placeholder="请输入经度"></t-input>
        </t-form-item>

        <t-form-item label="纬度" requiredMark>
          <t-input v-model="addressData.latitude" placeholder="请输入纬度"></t-input>
        </t-form-item>
      </div>

      <t-form-item label="地图" requiredMark>
        <div class="Map-form">
          <p class="Map-p">说明:搜索位置后可选择地图位置自动读取经纬度</p>
          <div class="Map-box">
            <div class="Map" ref="map" id="container"></div>
            <div class="MapPrompt" id="panel" @click="changeMarker"></div>
          </div>
        </div>
      </t-form-item>

      <t-form-item label="活动点位" requiredMark>
        <t-table row-key="id" :data="data" :bordered="false" :columns="(columns as PrimaryTableCol<TableRowData>[])"
          size="medium" hover table-layout="fixed">
          <template #type-slot-venueName="{ row }">
            <t-input v-model="row.venueName" :onBlur="verifyVenueName" placeholder="请输入场地名称" />
          </template>
          <template #type-slot-phone="{ row }">
            <t-input v-model="row.phone" :onBlur="verifyPhone" :maxlength="11" placeholder="请输入手机号码" />
          </template>
          <template #operation="{ row }">
            <t-button variant="outline" theme="danger" size="small" class="delete" @click="rehandleClick(row)">
              <!-- <template #icon>
                <CloseCircleIcon />
              </template> -->
              删除
            </t-button>
          </template>
        </t-table>
      </t-form-item>
    </t-form>
    <div class="button-box">
      <t-button class="cancel" @click="cancel">取消</t-button>
      <t-button class="publish" @click="publish">{{ route.query?.id ? '确认编辑' : '发布活动' }}</t-button>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref } from "vue"
import { useRouter, useRoute } from "vue-router";
import { MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { SearchIcon, CloseCircleIcon, LoginIcon, AddIcon } from 'tdesign-icons-vue-next';
import { useRoleStore } from '../../store/modules/role';
import { addActivity, editActivity } from "../../request/modules/MarketApi";
import { getOrganSelect } from "../../request/modules/employee";
import { channelProductSelect } from "../../request/modules/ServiceApi";
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from '@vue/reactivity';
import cropper from '@/components/ImgCropping/Cropper.vue'
import { enterListPageQuery, findDetail, pointsList } from "../../request/modules/MarketApi";

export default {
  components: {
    CloseCircleIcon,
    SearchIcon,
    LoginIcon,
    AddIcon
  },
  setup() {
    const roleState = useRoleStore()
    const router = useRouter()
    const route = useRoute()
    const map = shallowRef(null);
    let bell = ref(true)
    const clipperRef = ref<any>({})
    const timeDefaultValue = ref<any>(['', ''])
    const clipperRef1 = ref<any>({})
    const disUpload = ref<boolean>(false);
    const filesUpload = ref<boolean>(false);
    const clipperData = ref<any>({
      type: '',
      allowTypeList: ['png', 'jpg', 'jpeg'],
      limitSize: 1,
      fixedNumber: [1, 1],
      previewWidth: 100,
      autoCropWidth: 80, // 默认生成截图框宽度
      autoCropHeight: 70 // 默认生成截图框高度
    })
    let detailsData: any
    const formData = ref<any>({
      organName: '',//机构名称
      organCode: '',//机构编码
      activityName: '',//活动名称
      activityWay: '',//活动方式
      productName: '',//关联产品名称
      productCode: '',//关联产品编码
      activityCategory: '',//活动分类
      beginTime: '',//活动开始时间
      endTime: '',//活动结束时间
      activityPeopleNumber: 999999,//活动人数
      activityDescribe: '',//活动描述
      activityRule: '',//活动规则
      mainPicture: '',//列表图片
      playPicture: [],//详情图片
      activityPointList: [],//活动点位
    });
    // // 机构名称
    const placeholderInstitution = ref('请选择机构')
    const optionsInstitution = ref([
      // { label: '织生科技', value: 1 },
    ])
    const getInstitutionOptions = () => {
      getOrganSelect().then((res: any) => {
        if (res.code === 200) {
          optionsInstitution.value = res.data.map((item: any) => {
            return {
              label: item.organizationName,
              value: item.organizationNum
            };
          });
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    }
    const onChangeInstitution = (value: any, context: any) => {
      formData.value.organName = context.selectedOptions[0].label
    }
    // 活动方式
    const optionsMode = ref([
      { label: '线上', value: 'online' },
      { label: '线下', value: 'offline' },
    ])
    // 关联产品
    const optionsProducts = ref([
      // { label: '脑健康筛查', value: 1 },
    ])
    const getChannelProductSelect = () => {
      channelProductSelect().then((res: any) => {
        if (res.code === 200) {
          optionsProducts.value = res.data.map((item: any) => {
            return {
              label: item.prodName,
              value: item.prodCode
            };
          });
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    }
    const onChangeProducts = (value: any, context: any) => {
      formData.value.productName = context.selectedOptions[0].label
    }

    const onConfirm = (val: any) => {
      disUpload.value = true;
      file.value[0] = {
        name: '',
        url: val
      }
    }
    const onFilesConfirm = (val: any) => {
      // filesUpload.value = true;
      files.value.push({
        name: '',
        url: val
      })
    }

    const browserUpload = (value: any) => {
      console.log(value)
      if (value == 'file') {
        clipperData.value.autoCropWidth = 140;
        clipperData.value.autoCropHeight = 120;
        clipperRef.value.uploadFile()
      } else {
        clipperData.value.autoCropWidth = 346;
        clipperData.value.autoCropHeight = 228;
        clipperRef1.value.uploadFile()
      }
    }
    // 活动分类
    const optionsCategory = ref([
      { label: '公益活动', value: 'commonweal' },
    ])
    // 活动时间
    const onChange = (value: any) => {
      formData.value.beginTime = value[0]
      formData.value.endTime = value[1]
    };
    // 活动人数
    const optionsParticipants = ref([
      { label: '小于99人', value: 99 },
      { label: '小于500人', value: 500 },
      { label: '小于1000人', value: 1000 },
      { label: '人数不限', value: 999999 },
    ])
    // 列表图片
    const headers = ref<any>({});
    const file = ref<any>([]);
    const imgFile = ref<any>([]); //图片
    const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
    const formatImgResponseMain = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };
    const checkUploadMain = (files: any[]): boolean | Promise<boolean> => {
      return new Promise(function (resolve, reject) {
        let width = 140;
        let height = 120;
        let url = '';
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          let valid = img.width == width && img.height == height;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(140px*120px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const handleUploadMain = (context: any) => {
      formData.value.mainPicture = context.response.url;
    };
    const removeMain = () => {
      formData.value.mainPicture = ''
      disUpload.value = false;
      file.value = []
    }
    // 详情图片
    const files = ref<any>([]);
    const imgFiles = ref<any>([]); //图片
    const handleFail = (file: any) => {
      MessagePlugin.error(`文件 ${file.file.name} 上传失败`);
    };
    const formatImgResponsePlay = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };
    const checkUploadPlay = (files: any[]): boolean | Promise<boolean> => {
      return new Promise(function (resolve, reject) {
        let width = 346;
        let height = 228;
        let url = '';
        if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
          let valid = img.width == width && img.height == height;
          if (valid) {
            resolve(true);
          } else {
            MessagePlugin.warning('图片尺寸(346px*228px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const handleUploadPlay = (context: any) => {
      formData.value.playPicture.push(context.response[0].url)
    };
    const removePlay = (context: any) => {
      formData.value.playPicture = formData.value.playPicture.filter((item: any) => { return item != context.file.response.url })
    }
    // 地图搜索数据
    const addressData = ref<any>({
      address: '',//地址
      longitude: '',//经度
      latitude: '',//纬度
      code: '',//省市区编码
      road: '',//xx路xx号
      venueName: '',//场地
      phone: ''//电话
    })
    // 确认
    const fill = () => {
      if (addressData.value.road != '') {
        data.value.unshift(addressData.value)
      }
      addressData.value = {
        address: '',//地址
        longitude: '',//经度
        latitude: '',//纬度
        code: '',//省市区编码
        road: '',//xx路xx号

        venueName: '',//场地
        phone: ''//电话
      }
    }
    // 初始化
    onMounted(() => {
      if (route.query.id) {
        getFindDetail()
      }
      if (roleState.userInfo.organizationLevel == 2) {
        bell.value = true
      } else {
        placeholderInstitution.value = roleState.userInfo.organizationName
        formData.value.organName = roleState.userInfo.organizationName
        formData.value.organCode = roleState.userInfo.organizationNum
        bell.value = false
      }
      getInstitutionOptions()
      getChannelProductSelect()
      let token = localStorage.getItem('x-auth-token');
      headers.value = {
        token: token
      };
    })
    let getFindDetail = () => {
      findDetail({
        code: route.query.id as string,
      }).then((res: any) => {
        if (res.code === 200) {
          detailsData = res.data;
          formData.value = {
            organName: res.data.organName,//机构名称
            organCode: res.data.organNum,//机构编码
            activityName: res.data.activityName,//活动名称
            activityWay: res.data.activityWay,//活动方式
            productName: res.data.productName,//关联产品名称
            productCode: res.data.productCode,//关联产品编码
            activityCategory: res.data.activityCategory,//活动分类
            beginTime: res.data.activityBegnDate,//活动开始时间
            endTime: res.data.activityEndDate,//活动结束时间
            activityPeopleNumber: res.data.activityPeopleNumber,//活动人数
            activityDescribe: res.data.activityDescribe,//活动描述
            activityRule: res.data.activityRule,//活动规则
            mainPicture: res.data.mainPicture,//列表图片
            playPicture: res.data.playPictureList,//详情图片
            activityPointList: [],//活动点位
          }
          disUpload.value = true;
          file.value = [{ name: '', url: res.data.mainPicture }];
          imgFile.value = [{ name: '', url: res.data.mainPicture }];
          for (let i = 0; i < res.data.playPictureList.length; i++) {
            files.value.push({ name: '', url: res.data.playPictureList[i] })
            imgFile.value.push({ name: '', url: res.data.playPictureList[i] })
          }
          timeDefaultValue.value = [formData.value.beginTime, formData.value.endTime];
          console.log(timeDefaultValue.value)
          getPointsList();
        }
      })
    }
    let getPointsList = () => {
      pointsList({
        activityCode: route.query.id as string,
        pageNum: 1,
        pageSize: 999
      }).then((res: any) => {
        formData.value.activityPointList = res.data.data;
        data.value = res.data.data;
      })
    }
    // 活动点位表格
    let data = ref<any>([
      // {address:'上海市上海市上海市上海市上海市上海市上海市上海市上海市上海市',phone:'17637823069',provinceCode:'000000',cityCode:'000000',areaCode:'000000',longitude:'3.1646',latitude:'21.22551545',venueName:'高尚领域中心高尚领域中心',road:'南京路55号'},
    ]);
    let columns = ref([
      { colKey: 'address', title: '活动地址' },
      { colKey: 'venueName', title: '场地名称', cell: 'type-slot-venueName', width: 300 },
      { colKey: 'phone', title: '联系方式', cell: 'type-slot-phone', width: 200 },
      { colKey: 'operation', title: '操作', fixed: 'right', slots: { customRender: 'operation' }, width: 200 }
    ]);
    // 删除
    let rehandleClick = (row: any) => {
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i] == row) {
          data.value.splice(i, 1);
        }
      }
    }
    // 场地名称
    const verifyVenueName = (value: any) => {
      if (value == '') {
        MessagePlugin.error('场地名称不能为空');
      }
    }
    // 手机号正则
    const verifyPhone = (value: any) => {
      if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value))) {
        MessagePlugin.error('手机号格式错误');
      }
    }
    // 取消
    const cancel = () => {
      router.push("/activityList")
    }
    // 发布活动
    const publish = () => {
      let verifyPoint = false
      // let pointIndex=0
      let tips = ''
      for (let index = 0; index < data.value.length; index++) {
        // pointIndex=index+1
        if (data.value[index].venueName == '') {
          verifyPoint = false
          tips = '场地名称不能为空'
          break
        } else if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(data.value[index].phone))) {
          verifyPoint = false
          tips = '手机号格式错误'
          break
        } else {
          verifyPoint = true
        }
      }
      formData.value.mainPicture = file.value[0]?.url || "";
      formData.value.playPicture = [];
      files.value.forEach((el: any) => {
        formData.value.playPicture.push(el.url)
      });
      if (formData.value.organName == '' || formData.value.organCode == '') {
        MessagePlugin.error('请选择机构')
      } else if (formData.value.activityName == '') {
        MessagePlugin.error('活动名称不能为空')
      } else if (formData.value.activityWay == '') {
        MessagePlugin.error('请选择活动方式')
      } else if (formData.value.productName == '' || formData.value.productCode == '') {
        MessagePlugin.error('请选择关联产品')
      } else if (formData.value.activityCategory == '') {
        MessagePlugin.error('请选择活动分类')
      } else if (formData.value.beginTime == '' || formData.value.endTime == '') {
        MessagePlugin.error('请选择活动时间')
      } else if (formData.value.activityDescribe == '') {
        MessagePlugin.error('活动描述不能为空')
      } else if (formData.value.activityRule == '') {
        MessagePlugin.error('活动规则不能为空')
      } else if (formData.value.mainPicture == '') {
        MessagePlugin.error('请上传列表图片')
      } else if (formData.value.playPicture.length == 0) {
        MessagePlugin.error('请上传至少一张详情图片')
      } else if (data.value.length == 0) {
        MessagePlugin.error('请选择至少一个活动点位')
      } else if (!verifyPoint) {
        MessagePlugin.error('活动点位' + tips)
      } else {
        if (route.query?.id) {
          editActivity({
            activityCode: detailsData.activityCode,
            organName: formData.value.organName,//机构名称
            organCode: formData.value.organCode,//机构编码
            activityName: formData.value.activityName,//活动名称
            activityWay: formData.value.activityWay,//活动方式
            productName: formData.value.productName,//关联产品名称
            productCode: formData.value.productCode,//关联产品编码
            activityCategory: formData.value.activityCategory,//活动分类
            beginTime: formData.value.beginTime,//活动开始时间
            endTime: formData.value.endTime,//活动结束时间
            activityPeopleNumber: formData.value.activityPeopleNumber,//活动人数
            activityDescribe: formData.value.activityDescribe,//活动描述
            activityRule: formData.value.activityRule,//活动规则
            mainPicture: formData.value.mainPicture,//列表图片
            playPicture: formData.value.playPicture,//详情图片
            activityPointList: data.value,//活动点位
          }).then((res: any) => {
            if (res.code == 200) {
              router.push("/activityList")
            }
          })
          return
        }
        addActivity({
          organName: formData.value.organName,//机构名称
          organCode: formData.value.organCode,//机构编码
          activityName: formData.value.activityName,//活动名称
          activityWay: formData.value.activityWay,//活动方式
          productName: formData.value.productName,//关联产品名称
          productCode: formData.value.productCode,//关联产品编码
          activityCategory: formData.value.activityCategory,//活动分类
          beginTime: formData.value.beginTime,//活动开始时间
          endTime: formData.value.endTime,//活动结束时间
          activityPeopleNumber: formData.value.activityPeopleNumber,//活动人数
          activityDescribe: formData.value.activityDescribe,//活动描述
          activityRule: formData.value.activityRule,//活动规则
          mainPicture: formData.value.mainPicture,//列表图片
          playPicture: formData.value.playPicture,//详情图片
          activityPointList: data.value,//活动点位
        }).then((res: any) => {
          if (res.code == 200) {
            router.push("/activityList")
          }
        })
      }
    }
    return {
      formData,
      placeholderInstitution,
      optionsInstitution,
      bell,
      optionsMode,
      optionsProducts,
      onChangeInstitution,
      onChangeProducts,
      optionsCategory,
      onChange,
      optionsParticipants,
      file,
      uploadUrl,
      formatImgResponseMain,
      checkUploadMain,
      handleUploadMain,
      handleFail,
      removeMain,
      headers,
      imgFile,
      files,
      formatImgResponsePlay,
      checkUploadPlay,
      handleUploadPlay,
      removePlay,
      imgFiles,
      addressData,
      data,
      columns,
      rehandleClick,
      verifyVenueName,
      verifyPhone,
      cancel,
      publish,
      fill,
      browserUpload,
      clipperData,
      onConfirm,
      onFilesConfirm,
      disUpload,
      filesUpload,
      clipperRef,
      clipperRef1,
      timeDefaultValue,
      route,
    }
  },
  data() {
    return {
      geocoder: undefined,
      marker: undefined,
      placeSearch: undefined,
      autocomplete: undefined,
    };
  },
  methods: {
    ininMap() {
      AMapLoader.load({
        key: '44adef0d737a37ba5a8481be9f231816', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then(AMap => {
          let center = [121.42, 31.19];
          // if (this.addressData.latitude && this.addressData.longitude) {
          //   center = [Number(this.addressData.longitude), Number(this.addressData.latitude)];
          // }
          let zoom = 14;
          // if ((this.$route.query.type && this.$route.query.type === 'edit') || (this.$route.query.type && this.$route.query.type === 'look')) {
          //   zoom = 13;
          // }

          this.map = new AMap.Map('container', {
            //设置地图容器id
            viewMode: '3D', //是否为3D地图模式
            zoom: zoom, //初始化地图级别
            center: center, //初始化地图中心点位置
            resizeEnable: true
          });
          AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
            let autoOptions = {
              input: "tipinput",
            };
            //构造地点查询类
            this.autocomplete = new AMap.Autocomplete(autoOptions);
            this.placeSearch = new AMap.PlaceSearch({
              pageSize: 25, // 单页显示结果条数
              pageIndex: 1, // 页码
              map: this.map, // 展现结果的地图实例
              panel: 'panel', // 结果列表将在此容器中进行展示。
              autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            });
            // console.log(this.placeSearch)
            this.autocomplete.on("select", (e: any) => {
              this.placeSearch.setCity(e.poi.adcode);
              this.placeSearch.search(e.poi.name);  //关键字查询查询
              this.changeMarker()
            })
          });
          AMap.plugin('AMap.Geocoder', () => {
            this.geocoder = new AMap.Geocoder({
              radius: 1000 //范围，默认：500,
            });
          });
          // if ((this.$route.query.type && this.$route.query.type === 'edit') || (this.$route.query.type && this.$route.query.type === 'look')) {
          //   this.marker = new AMap.Marker({
          //     icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          //     position: center,
          //     offset: new AMap.Pixel(-13, -30)
          //   });
          //   this.marker.setMap(this.map);
          // } else {
          this.marker = new AMap.Marker();

          // }
        })
        .catch(e => {
          // console.log(e);
        });
    },
    // 地图搜索按钮
    searchLocation() {
      this.changeMarker()
      // console.log('this.geocoder', this.addressData.address);
      this.geocoder.getLocation(this.addressData.address, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          // console.log("resultresultresult", result)
          var lnglat = result.geocodes[0].location;
          this.addressData.longitude = result.geocodes[0].location.lng + '';
          this.addressData.latitude = result.geocodes[0].location.lat + '';
          this.searchAddress();
          this.marker.setPosition(lnglat);
          this.map.add(this.marker);
          this.map.setFitView(this.marker);
        } else {
          MessagePlugin.warning('搜索失败');
        }
      });
    },
    searchAddress() {
      let lnglat = [Number(this.addressData.longitude), Number(this.addressData.latitude)];
      // console.log('this.placeSearch', this.placeSearch, lnglat);
      this.placeSearch.searchNearBy('', lnglat, 200, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          // console.log('------', status, result);
        }
      });
    },
    changeMarker() {
      this.map.on('moveend', this.moveendEvent);
    },
    moveendEvent(ev: any) {
      this.map.off('moveend', this.moveendEvent)
      var center = this.map.getCenter();
      // console.log('我移动了', ev, center,);
      this.addressData.longitude = center.lng + '';
      this.addressData.latitude = center.lat + '';
      let lnglat = [this.addressData.longitude, this.addressData.latitude];
      this.geocoder.getAddress(lnglat, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log('result', result);
          this.addressData.address = result.regeocode.formattedAddress;
          this.addressData.code = result.regeocode.addressComponent.adcode;
          this.addressData.road = result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber;
        }
      });
    }
  },
  async mounted() {
    this.ininMap();
  }
}
</script>

<style lang="scss" scoped>
.release {
  background: #FFFFFF;
  border-radius: 10px;
  overflow-y: scroll;
  padding: 26px 0 0 18px;

  ::v-deep(.t-table__th-cell-inner) {
    color: black !important;
    font-weight: bold !important;
  }
}

.searchBut {
  margin-left: 13px;
  background: #3D7EFF;
  border-radius: 8px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 20px;
}

.LonAndLat {
  display: flex;
}

.t-select__wrap {
  max-width: 632px !important;
}

.t-input__wrap {
  max-width: 632px !important;
}

.t-textarea {
  max-width: 632px !important;
}

.Map-form {
  display: flex;
  flex-direction: column;
  width: 100%;

  p {
    height: 32px;
    line-height: 32px;
  }
}

.Map-box {
  position: relative;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.Map {
  width: 100%;
  height: 700px;
  padding: 0px;
  margin: 0px;
}

.ipt-item {
  width: 632px;
  height: 32px;
  padding: 8px;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  border-color: var(--td-border-level-2-color);
  color: var(--td-text-color-primary);
  font-size: 14px;
}

.ipt-item::-webkit-input-placeholder {
  color: #999;
  font-size: 13px;
}

.MapPrompt {
  width: 300px;
  height: 500px;
  overflow-y: auto;
  position: absolute;
  top: 40px;
  right: 40px;
}

.button-box {
  display: flex;
  justify-content: center;
  padding: 80px 0;

  .cancel {
    width: 162px;
    height: 54px;
    background: #F5F8FD;
    border-radius: 27px;
    font-size: 22px;
    font-weight: bold;
    color: #3D7EFF;
    border: none;
  }

  .publish {
    width: 162px;
    height: 54px;
    background: #3D7EFF;
    border-radius: 27px;
    font-size: 22px;
    font-weight: bold;
    color: white;
    border: none;
    margin-left: 84px;
  }
}

.detailsImg {
  margin-top: 6px !important;
  // margin-left: 10px;
}

::v-deep(.detailsImg .t-upload__card-container) {
  display: none !important;
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

  .detail-box {
    margin-top: -28px;
  }

  .check-text {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 7px;
  }



  .t-table {
    margin-top: 50px;
  }
}

::v-deep(.t-input) {
  border-radius: 8px !important;
}

::v-deep(.t-range-input) {
  border-radius: 8px !important;
}

::v-deep(.t-textarea__inner) {
  border-radius: 8px !important;
}

::v-deep(.t-table__th-address),
::v-deep(.t-table__th-venueName),
::v-deep(.t-table__th-phone),
::v-deep(.t-table__th-operation) {
  background: #FAFBFD !important;
}

.delete {
  width: 53px;
  height: 23px;
  background: #FFF1F1;
  border: none;
  color: #FF0000;
  font-size: 12px;
  border-radius: 13px;
}
</style>
