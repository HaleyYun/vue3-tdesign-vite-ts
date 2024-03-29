<template>
  <div class="page-box">
    <div class="header-box">
      <t-button class="btn-item" theme="primary" variant="outline" @click="router.back()"> 取消 </t-button>
      <t-button class="btn-item" theme="primary" v-if="route.query.type != 'look'" @click="submitForm"> 确定
      </t-button>
    </div>
    <div class="content-box">
      <div class="page-left">
        <t-form ref="form" :data="formData" :disabled="route.query.type == 'look'"
          :rules="(formRules as FormRules<Data>)">
          <t-form-item label="机构主图:" name="theme">
            <t-upload ref="uploadRef" v-if="disUpload" v-model:files="(imgFile as UploadFile[])"
              tips="请注意图片尺寸(343px*176px)" :defaultFiles="(imgFile as UploadFile[])" theme="image"
              :size-limit="{ size: 2, unit: 'MB' }" :action="uploadUrl" :formatResponse="formatImgResponse"
              accept="image/png,image/jpg" @remove="removeFile" :headers="headers" :beforeAllFilesUpload="checkUpload"
              :onSuccess="handleUpload" :locale="{
                triggerUploadText: {
                  image: '请选择图片'
                }
              }"></t-upload>
            <div class="img-box" @click="browserUpload" v-else>
              <div class="upload-img-box">
                <AddIcon class="icon" />
                <span class="check-img">请选择图片</span>
              </div>
              <div class="check-text">请上传343px*176px图片</div>
            </div>
            <cropper ref="clipperRef" :type="clipperData.type" :allow-type-list="clipperData.allowTypeList"
              :limit-size="clipperData.limitSize" :fixed-number="clipperData.fixedNumber"
              :fixed-number-aider="clipperData.fixedNumberAider" :preview-width="clipperData.previewWidth"
              :auto-crop-width="clipperData.autoCropWidth" :auto-crop-height="clipperData.autoCropHeight"
              @confirm="onConfirm" />
          </t-form-item>
          <t-form-item label="机构名称:" name="organName">
            <t-input v-model="formData.organName" :disabled="route.query.type == 'look'" :maxlength="50"></t-input>
          </t-form-item>
          <t-form-item label="机构描述:" name="description">
            <t-textarea v-model="formData.description" :disabled="route.query.type == 'look'" placeholder="请输入" clearable
              :maxlength="100" />
          </t-form-item>
          <t-form-item label="机构分类:" name="type">
            <t-select v-model="formData.type" :disabled="route.query.type == 'look'" :options="organType"
              placeholder="请选择" :keys="{ value: 'dictValue', label: 'dictLabel' }"></t-select>
          </t-form-item>
          <t-form-item label="联系电话:" name="phone">
            <t-input v-model="formData.phone" :disabled="route.query.type == 'look'" :maxlength="11"></t-input>
          </t-form-item>
          <t-form-item label="机构评分:" name="score">
            <t-input-number v-model="formData.score" :disabled="route.query.type == 'look'" :max="100" :step="0.1"
              :min="0" :decimal-places="1"></t-input-number>
          </t-form-item>
          <t-form-item label="是否C端展示:" name="showEnable">
            <t-select v-model="formData.showEnable" :disabled="route.query.type == 'look'" :options="showEnableOptions"
              placeholder="请选择"></t-select>
          </t-form-item>
          <t-form-item :requiredMark="formData.showEnable == 1" label="服务时间:" name="dayTimes">
            <t-checkbox-group v-model="formData.dayTimes" :disabled="route.query.type == 'look'">
              <t-checkbox label="周一" :value="1" />
              <t-checkbox label="周二" :value="2" />
              <t-checkbox label="周三" :value="3" />
              <t-checkbox label="周四" :value="4" />
              <t-checkbox label="周五" :value="5" />
              <t-checkbox label="周六" :value="6" />
              <t-checkbox label="周日" :value="7" />
            </t-checkbox-group>
          </t-form-item>
          <t-form-item :requiredMark="formData.showEnable == 1" label="服务阶段:" :name="formData.amTime ? 'amTime' : 'pmTime'">
            <div>上午：<t-time-range-picker class="demos" :disabled="route.query.type == 'look'" v-model:value="amTimeValue"
                :disable-time="disablePMTime" :allow-input="false" clearable format="HH:mm" @change="timeChangeMorning" />
            </div>
          </t-form-item>
          <t-form-item label="" name="">
            <div>下午：<t-time-range-picker class="demos" :disabled="route.query.type == 'look'" v-model:value="pmTimeValue"
                :disable-time="disableAMTime" :allow-input="false" clearable format="HH:mm"
                @change="timeChangeAfternoon" /></div>
          </t-form-item>
          <t-form-item label="机构标签:" name="label">
            <t-select v-model="organTargetValue" :disabled="route.query.type == 'look'" :options="organTarget" :max="3"
              placeholder="请选择" multiple :keys="{ value: 'dictValue', label: 'dictLabel' }" @change="organTargetChange" />
          </t-form-item>
          <t-form-item label="机构状态:" name="enable">
            <t-radio-group v-model="formData.enable" :disabled="route.query.type == 'look'">
              <t-radio :value="1">开启</t-radio>
              <t-radio :value="0">关闭</t-radio>
            </t-radio-group>
          </t-form-item>
        </t-form>
      </div>
      <div class="page-right">
        <div class="page-right-header">
          <t-form layout="inline" :data="formData" :rules="(formRules as FormRules<Data>)">
            <t-form-item style="width: 80%" label="机构地址:" name="address">
              <input class="ipt-item" id="tipinput" v-model="formData.address" :disabled="route.query.type == 'look'" />
              <t-button class="btn" @click="searchLocation" :disabled="route.query.type == 'look'">
                <template #icon>
                  <SearchIcon />
                </template>搜索
              </t-button>
            </t-form-item>

            <t-form-item label="经度:" name="longitude">
              <t-input v-model="formData.longitude" :maxlength="50" :disabled="route.query.type == 'look'"></t-input>
            </t-form-item>
            <t-form-item label="纬度:" name="latitude">
              <t-input v-model="formData.latitude" :maxlength="50" :disabled="route.query.type == 'look'"></t-input>
            </t-form-item>
          </t-form>
        </div>
        <h2>地图</h2>
        <p>说明：搜索位置后可选择地图位置自动读取经纬度</p>
        <div style="position: relative">
          <div class="Map" ref="map" id="container"></div>
          <div class="MapPrompt" id="panel" @click="changeMarker"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, FormRules, Data, UploadFile, SuccessContext, TimeRangeValue, SelectValue } from 'tdesign-vue-next';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from '@vue/reactivity';
import { institutionDetails, addOrgan, updateOrgan } from '../../request/modules/institution';
import { dictData } from '../../request/modules/dictData';
import cropper from '@/components/ImgCropping/Cropper.vue'
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RefreshIcon
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const clipperRef = ref<any>({})
    const disUpload = ref<boolean>(false);
    const clipperData = ref<any>({
      type: '',
      allowTypeList: ['png', 'jpg', 'jpeg'],
      limitSize: 1,
      fixedNumber: [1, 1],
      previewWidth: 0,
      autoCropWidth: 0, // 默认生成截图框宽度
      autoCropHeight: 0 // 默认生成截图框高度
    })
    const setAttr = reactive({
      formData: {
        address: '',
        amTime: '',
        createUser: '',
        dayTimes: [],
        description: '',
        enable: 1,
        label: '',
        latitude: '',
        longitude: '',
        organName: '',
        organizationId: 0,
        phone: '',
        pmTime: '',
        remark: '',
        score: '',
        showEnable: 0,
        theme: '',
        type: '',
        typeName: '',
        updateUser: '',
        code: ''
      },
      formRules: {
        address: [{ required: true, message: '机构地址必填', trigger: 'blur' }],
        amTime: [{ required: true, message: '上午或下午时间段必填', trigger: 'blur' }],
        createUser: [{ required: true, message: '创建人必填', trigger: 'blur' }],
        dayTimes: [{ required: true, message: '周一到周日必填', trigger: 'blur' }],
        description: [{ required: true, message: '机构描述必填', trigger: 'blur' }],
        enable: [{ required: true, message: '状态必填', trigger: 'blur' }],
        latitude: [{ required: true, message: '经度必填', trigger: 'blur' }],
        longitude: [{ required: true, message: '纬度必填', trigger: 'blur' }],
        organName: [{ required: true, message: '机构名称必填', trigger: 'blur' }],
        organizationId: [{ required: true, message: '渠道id必填', trigger: 'blur' }],
        phone: [{ required: true, message: '电话必填', trigger: 'blur' }],
        pmTime: [{ required: true, message: '上午或下午时间段必填', trigger: 'blur' }],
        remark: [{ required: true, message: '备注必填', trigger: 'blur' }],
        score: [{ required: true, message: '评分必填', trigger: 'blur' }],
        showEnable: [{ required: true, message: '是否c端展示必填', trigger: 'blur' }],
        theme: [{ required: true, message: '主图片必填', trigger: 'blur' }],
        type: [{ required: true, message: '机构分类必填', trigger: 'blur' }],
        typeName: [{ required: true, message: '机构分类中文必填', trigger: 'blur' }],
        updateUser: [{ required: true, message: '更新人必填', trigger: 'blur' }],
        label: [{ required: true, message: '机构标签必填', trigger: 'blur' }]
      },
      uploadUrl: import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate',
      amTimeValue: [],
      pmTimeValue: [],
      headers: {
        token: ''
      },
      showEnableOptions: [
        { label: '展示', value: 1 },
        { label: '不展示', value: 0 }
      ],
      organType: [],
      organTarget: [],
      organTargetValue: [],
      organNum: "",
    });
    const imgFile = ref<any>([]);
    const map = shallowRef(null);
    onMounted(() => {
      let token = localStorage.getItem('x-auth-token');
      setAttr.headers.token = token as string;
      getDictData();
    });
    const getDictData = () => {
      dictData({ dictType: 'organ_type' }).then((res: any) => {
        console.log('机构分类', res);
        if (res.code === 200) {
          setAttr.organType = res.data;
        }
      });
      dictData({ dictType: 'organ_target' }).then((res: any) => {
        console.log('机构标签', res);
        if (res.code === 200) {
          setAttr.organTarget = res.data;
        }
      });
    };

    const onConfirm = (val: any) => {
      disUpload.value = true;
      imgFile.value[0] = {
        name: '',
        url: val
      };
      setAttr.formData.theme = val;
    }
    const removeFile = () => {
      setAttr.formData.theme = ''
      disUpload.value = false;
      imgFile.value = []
    }
    const browserUpload = () => {
      nextTick(() => {
        clipperData.value.autoCropWidth = 343;
        clipperData.value.autoCropHeight = 176;
        clipperRef.value.uploadFile()
      })
    }

    const checkUpload = (files: UploadFile[]): boolean | Promise<boolean> => {
      // return true
      return new Promise(function (resolve, reject) {
        let width = 343;
        let height = 176;
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
            MessagePlugin.warning('图片尺寸(343px*176px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const handleUpload = (context: SuccessContext) => {
      console.log('context', context, imgFile);
      setAttr.formData.theme = context.response.url;
    };
    const formatImgResponse = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };
    const timeChangeMorning = (value: TimeRangeValue) => {
      if (value) {
        setAttr.formData.amTime = value.join('-');
      } else {
        setAttr.formData.amTime = '';
      }
    };
    const timeChangeAfternoon = (value: TimeRangeValue) => {
      if (value) {
        setAttr.formData.pmTime = value.join('-');
      } else {
        setAttr.formData.pmTime = '';
      }
    };
    const submitForm = () => {
      if (route.query.type === 'add') {
        addOrgan(setAttr.formData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success('添加成功');
            router.back();
          }
        });
      } else {
        let data: any = { ...setAttr.formData as any }
        delete data.organizationId
        let editData = { ...data, id: route.query.id, organNum: setAttr.organNum };
        updateOrgan(editData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success('更新成功');
            router.back();
          }
        });
      }
    };
    const organTargetChange = (value: SelectValue) => {
      setAttr.formData.label = (value as []).join(',');
    };
    const disablePMTime = (h: number) => {
      let disableHour: number[] = []
      for (let i = 13; i <= 24; i++) {
        disableHour.push(i)
      }
      return {
        hour: disableHour,
      };
    }
    const disableAMTime = (h: number) => {
      let disableHour: number[] = []
      for (let i = 0; i <= 12; i++) {
        disableHour.push(i)
      }
      return {
        hour: disableHour,
      };
    }
    return {
      ...toRefs(setAttr),
      map,
      checkUpload,
      handleUpload,
      imgFile,
      formatImgResponse,
      timeChangeMorning,
      timeChangeAfternoon,
      submitForm,
      router,
      route,
      organTargetChange,
      disablePMTime,
      disableAMTime,
      clipperRef,
      disUpload,
      clipperData,
      onConfirm,
      browserUpload,
      removeFile
    };
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

    // browserUpload() {
    //   this.clipperData.autoCropWidth = 343;
    //   this.clipperData.autoCropHeight = 176;
    //   this.clipperRef.uploadFile()
    // },
    getDetails() {
      institutionDetails({ id: Number(this.$route.query.id as string) }).then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          this.amTimeValue = res.data.amTime.split('-');
          this.pmTimeValue = res.data.pmTime.split('-');
          this.formData.address = res.data.address || '';
          this.formData.amTime = res.data.amTime || '';
          this.formData.dayTimes = res.data.dayTimes || [];
          this.formData.description = res.data.description || '';
          this.formData.enable = res.data.enable || 0;
          this.formData.label = res.data.label || '';
          this.formData.latitude = res.data.latitude + '' || '';
          this.formData.longitude = res.data.longitude + '' || '';
          this.formData.pmTime = res.data.pmTime || '';
          this.formData.phone = res.data.phone || '';
          this.formData.score = res.data.score || '';
          this.formData.code = res.data.areaCode || '';
          this.formData.showEnable = res.data.showEnable;
          this.formData.theme = res.data.theme;
          this.formData.typeName = res.data.typeName;
          this.formData.type = res.data.type + '';
          this.formData.organName = res.data.organName || '';
          this.organTargetValue = res.data.label.split(',');
          this.imgFile[0] = {
            name: '',
            url: this.formData.theme
          };
          this.organNum = res.data.organNum || '';
          this.ininMap();
          this.disUpload = true;
        }
      });
    },
    ininMap() {
      AMapLoader.load({
        key: '44adef0d737a37ba5a8481be9f231816', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then(AMap => {
          let center = [121.42, 31.19];
          if (this.formData.latitude && this.formData.longitude) {
            center = [Number(this.formData.longitude), Number(this.formData.latitude)];
          }
          let zoom = 13;
          if ((this.$route.query.type && this.$route.query.type === 'edit') || (this.$route.query.type && this.$route.query.type === 'look')) {
            zoom = 17;
          }

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
            console.log(this.placeSearch)
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
          if ((this.$route.query.type && this.$route.query.type === 'edit') || (this.$route.query.type && this.$route.query.type === 'look')) {
            this.marker = new AMap.Marker({
              icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
              position: center,
              offset: new AMap.Pixel(-13, -30)
            });
            this.marker.setMap(this.map);
          } else {
            this.marker = new AMap.Marker();

          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    searchLocation() {
      this.changeMarker()
      console.log('this.geocoder', this.formData.address);
      this.geocoder.getLocation(this.formData.address, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log("result", result)
          var lnglat = result.geocodes[0].location;
          this.formData.longitude = result.geocodes[0].location.lng + '';
          this.formData.latitude = result.geocodes[0].location.lat + '';
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
      let lnglat = [Number(this.formData.longitude), Number(this.formData.latitude)];
      console.log('this.placeSearch', this.placeSearch, lnglat);
      this.placeSearch.searchNearBy('', lnglat, 200, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log('------', status, result);
        }
      });
    },
    changeMarker() {
      this.map.on('moveend', this.moveendEvent);
    },
    moveendEvent(ev: any) {
      this.map.off('moveend', this.moveendEvent)
      var center = this.map.getCenter();
      console.log('我移动了', ev, center,);
      this.formData.longitude = center.lng + '';
      this.formData.latitude = center.lat + '';
      let lnglat = [this.formData.longitude, this.formData.latitude];
      this.geocoder.getAddress(lnglat, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log('result', result);
          this.formData.address = result.regeocode.formattedAddress;
          this.formData.code = result.regeocode.addressComponent.adcode;
        }
      });
    }
  },
  async mounted() {
    //DOM初始化完成进行地图初始化
    if (this.$route.query.type && this.$route.query.type === 'add') {
      this.formData.organizationId = JSON.parse(localStorage.getItem('userinfo') as string).organizationId;
      this.ininMap();
    } else if (this.$route.query.type && this.$route.query.type === 'edit') {
      this.getDetails();
    } else {
      this.getDetails();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow-y: auto;

  .header-box {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: end;

    .btn-item {
      margin-left: 20px;
    }
  }

  .content-box {
    display: flex;
    justify-content: space-between;

    .page-left {
      width: 400px;
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

    .page-right {
      flex: 1;
      padding: 0 20px;

      .page-right-header {
        display: flex;
        align-items: center;

        .ipt-item {
          width: 100%;
          height: 32px;
          padding: 8px;
          box-sizing: border-box;
          border-width: 1px;
          border-style: solid;
          border-radius: var(--td-radius-default);
          border-color: var(--td-border-level-2-color);
          color: var(--td-text-color-primary);
        }

        .btn {
          margin-left: 20px;
        }
      }

      h2 {
        font-size: 24px;
        line-height: 35px;
        padding-top: 20px;
      }

      p {
        font-size: 12px;
        color: #999999;
        padding-bottom: 20px;
      }

      .Map {
        width: 100%;
        height: 700px;
        padding: 0px;
        margin: 0px;
      }

      .MapPrompt {
        width: 300px;
        height: 500px;
        overflow-y: auto;
        position: absolute;
        top: 40px;
        right: 40px;
      }
    }
  }
}
</style>
