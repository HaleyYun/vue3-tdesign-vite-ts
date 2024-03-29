<template>
  <div class="user-box">
    <div class="search-box">
      <!-- 此版本不上  2023.6.1 -->
      <!-- <div class="search-item">角色名称:<t-input class="ipt-slt" v-model="searchData.organizationName" auto-width /></div>
            <t-button class="search-item" theme="primary" @click="search">
                <template #icon>
                    <SearchIcon />
                </template>搜索</t-button>
            <t-button variant="outline" theme="primary" @click="set">重置条件</t-button> -->
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addSite">
          <template #icon> <AddIcon /> </template>新建</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table :max-height="fixedTopRows ? 1400 : 480" row-key="index" :data="data" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false">
        <template #type="{ row }">
          <div v-if="row.type == '1'">保险</div>
          <div v-if="row.type == '2'">社区</div>
          <div v-if="row.type == '3'">医疗</div>
        </template>
        <template #enable="{ row }">
          <t-switch :value="row.enable" :customValue="[1, 0]" @change="(value: SwitchValue) => onChange(row.id, value as number)" :key="row.id" />
        </template>
        <template #marketingWebsite="{ row }">
          {{ row.marketingWebsite ? row.marketingWebsite : '--' }}
        </template>
        <template #action="{ row }">
          <div style="display: flex; align-items: center; justify-content: center">
            <t-button variant="text" theme="success" size="small" class="btn-c-blue" @click.stop="edit(row.id, true)">
              <template #icon> <EditIcon /> </template>编辑</t-button
            >
            <t-button variant="text" theme="primary" size="small" class="btn-c-blue" @click.stop="toActivityConfig(row.id)">
              <template #icon> <EditIcon /> </template>配置H5</t-button
            >
            <t-button variant="text" theme="danger" size="small" class="btn-c-blue" @click.stop="toProConfig(row.id)">
              <template #icon> <EditIcon /> </template>配置Pro</t-button
            >
          </div>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="searchData.pageNum" />
    </div>

    <t-dialog v-model:visible="addVisible" width="500" :header="headerTitle" :confirmBtn="editState ? '保存' : null" @confirm="submitForm" @cancelBtn="cancel" @closeBtn="close" destroy-on-Close>
      <t-form :data="formData" :rules="(formRules as FormRules<Data>)">
        <t-form-item label="渠道名称" name="organizationName">
          <t-input placeholder="请输入渠道名称" :disabled="!editState" v-model="formData.organizationName" :maxlength="60"></t-input>
        </t-form-item>
        <t-form-item label="渠道编码" name="organizationNum">
          <t-input placeholder="请输入渠道编码" :disabled="!editState" v-model="formData.organizationNum" :maxlength="6" :onKeyUp="(formData.organizationNum = formData.organizationNum.replace(/[\W]/g, ''))"></t-input>
        </t-form-item>
        <t-form-item label="联系人" name="person">
          <t-input placeholder="请输入联系人名称" :disabled="!editState" v-model="formData.person" :maxlength="30"></t-input>
        </t-form-item>
        <t-form-item label="联系电话" name="phone">
          <t-input placeholder="请输入联系电话" :disabled="!editState" v-model="formData.phone" :maxlength="11" :onKeyUp="(formData.phone = formData.phone.replace(/\D/g, ''))"></t-input>
        </t-form-item>
        <t-form-item label="渠道分类" name="type">
          <t-select v-model="formData.type">
            <t-option key="保险" label="保险" value="1" />
            <t-option key="社区" label="社区" value="2" />
            <t-option key="医疗" label="医疗" value="3" />
          </t-select>
        </t-form-item>
        <t-form-item label="渠道地区" name="finalCode">
          <t-cascader v-model="city" :options="cityOptions" @change="cityChange" />
        </t-form-item>
        <t-form-item label="详细地址" name="address">
          <t-textarea v-model="formData.address" placeholder="请输入街道门牌、楼层房间号等信息" :maxlength="100"></t-textarea>
        </t-form-item>
        <t-form-item label="状态" name="enable">
          <t-radio-group v-model="formData.enable" :disabled="!editState">
            <t-radio :value="1">开启</t-radio>
            <t-radio :value="0">停用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog v-model:visible="activityVisible" width="500" header="配置H5" :confirmBtn="editState ? '保存' : null" @confirm="submitActForm" @cancelBtn="cancel" @closeBtn="close" destroy-on-Close>
      <t-form :data="formActData" :rules="(formActRules as FormRules<Data>)">
        <t-form-item label="营销封面" name="marketingCover">
          <t-upload
            v-model="marketFile"
            v-if="marketUpload"
            theme="image"
            :size-limit="{ size: 2, unit: 'MB' }"
            :action="uploadUrl"
            :formatResponse="formatImgResponse"
            accept="image/*"
            :headers="headers"
            :beforeAllFilesUpload="checkMarketLoad"
            :onSuccess="handleMarketLoad"
            tips="大小不超过346px*200px图片"
            @remove="removeMarket"
            :locale="{ triggerUploadText: { image: '请选择图片' } }"
          ></t-upload>
          <div class="img-box" @click="browserUpload('marketFile')" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">大小不超过346px*200px图片</div>
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
            @confirm="onMarketConfirm"
          />
        </t-form-item>
        <t-form-item class="market-box" label="营销视频" name="marketingVideo">
          <t-upload v-model="videoItem" accept="video/*" :headers="headers" :action="uploadUrl" :onSuccess="videoUpload" :before-upload="beforeUpload" @remove="deleteVideo"></t-upload>
          <video loop autoplay muted style="height: 200px; width: 100%" v-if="videoItem[0]?.url" :src="videoItem[0]?.url">
            <source :src="videoItem[0]?.url" type="video/mp4" />
            <source :src="videoItem[0]?.url" type="video/ogg" />
            <source :src="videoItem[0]?.url" type="video/webm" />
          </video>
        </t-form-item>
        <t-form-item label="开启定位:" name="interfaceSwitch">
          <t-switch v-model="formActData.keySwitch" :customValue="[1, 0]" />
        </t-form-item>
        <t-form-item label="定位key值:" name="key" v-if="formActData.keySwitch === 1">
          <t-input v-model="formActData.key" :maxlength="128" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog v-model:visible="proVisible" width="500" header="配置PRO" :confirmBtn="editState ? '保存' : null" @confirm="submitProForm" @cancelBtn="cancel" @closeBtn="close" destroy-on-Close>
      <t-form :data="formProData" :rules="(formProRules as FormRules<Data>)">
        <t-form-item label="PRO端Logo:" name="proLogo">
          <t-upload
            v-model="logoImg"
            v-if="disUpload"
            theme="image"
            :size-limit="{ size: 2, unit: 'MB' }"
            :action="uploadUrl"
            :formatResponse="formatImgResponse"
            accept="image/*"
            :headers="headers"
            :beforeAllFilesUpload="checkLogoLoad"
            :onSuccess="handleLogoLoad"
            tips="大小不超过150px*58px图片"
            @remove="removeApp"
            :locale="{ triggerUploadText: { image: '请选择图片' } }"
          ></t-upload>
          <div class="img-box" @click="browserUpload('logoImg')" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">大小不超过150px*58px图片</div>
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
        <t-form-item label="功能菜单配置:" name="useMenu">
          <div class="tree-box">
            <t-tree :data="treeItems" :value="treeKeys" :keys="{ value: 'id', label: 'label', children: 'children' }" :checkStrictly="false" :expandAll="expandAllState" hover checkable @change="checked" :key="treeKey" />
          </div>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { FormRules, Data, MessagePlugin, SwitchValue, TreeNodeValue } from 'tdesign-vue-next';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
import { organization, addOrganization, removeOrganization, EditOrganization, getOrganization, switchOrganizationEnable, addMarket, queryCity, addActivityConfig, addProConfig, queryProConfig } from '../../request/modules/OrganizationApi';
import { debounce } from '../../utils/tools';
import cropper from '@/components/ImgCropping/Cropper.vue';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    FilePasteIcon,
    load
  },
  setup() {
    const router = useRouter();
    const logoImg = ref<any>([]);
    const marketFile = ref<any>([]);
    const videoItem = ref<any>([]);
    const clipperRef = ref<any>({});
    const clipperRef1 = ref<any>({});
    const disUpload = ref<boolean>(false);
    const marketUpload = ref<boolean>(false);
    const clipperData = ref<any>({
      type: '',
      allowTypeList: ['png', 'jpg', 'jpeg'],
      limitSize: 1,
      fixedNumber: [1, 1],
      previewWidth: 100,
      autoCropWidth: 80, // 默认生成截图框宽度
      autoCropHeight: 70 // 默认生成截图框高度
    });
    const setArrt = reactive({
      uploadUrl: import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate', //图片展示
      headers: {
        token: ''
      },
      city: '',
      searchData: {
        organizationName: '',
        pageNum: 1,
        pageSize: 10
      },
      id: 0,
      current: 2,
      pageSize: 10,
      total: 0,
      sexOption: [
        { label: '男', value: '1', title: '架构云选项' },
        { label: '女', value: '2' }
      ],
      headerTitle: '新建渠道',
      data: [],
      expandAllState: false,
      treeKey: 0,
      treeKeys: [],
      treeItems: [
        {
          id: '1',
          label: 'audhauwdhu',
          children: [
            {
              id: '1.1',
              label: '1.1',
              children: [
                {
                  id: '1.1.1',
                  label: '1.1.1',
                  children: [
                    {
                      id: '1.1.1.1',
                      label: '1.1.1.1'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      columns: [
        { colKey: 'id', title: '组织id', width: '125px', align: 'center' },
        { colKey: 'organizationNum', title: '渠道编码', align: 'center' },
        { colKey: 'organizationName', title: '渠道名称', align: 'center' },
        {
          colKey: 'type',
          title: '渠道分类',
          width: '100px',
          slots: { customRender: 'type' },
          align: 'center'
        },
        {
          colKey: 'marketingWebsite',
          title: '营销地址',
          slots: { customRender: 'marketingWebsite' },
          align: 'center'
        },
        { colKey: 'phone', title: '手机号码', align: 'center' },
        {
          colKey: 'enable',
          title: '状态',
          width: '80px',
          slots: { customRender: 'enable' },
          align: 'center'
        },
        { colKey: 'createTime', title: '创建时间', align: 'center', width: '180px' },
        {
          title: '操作',
          colKey: 'action',
          width: '180px',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      cityOptions: [],
      addVisible: false,
      activityVisible: false,
      proVisible: false,
      editState: true,
      formData: {
        organizationName: '',
        phone: '',
        organizationNum: '',
        longitude: '',
        latitude: '',
        enable: 1,
        level: 2,
        parentId: 0,
        remark: '',
        appLogo: '',
        interfaceSwitch: 1,
        marketingCover: '',
        marketingVideo: '',
        finalCode: '',
        person: '',
        address: '',
        type: ''
      },
      formActData: {
        id: 0,
        keySwitch: 0,
        key: '',
        marketingCover: '',
        marketingVideo: ''
      },
      formProData: {
        id: 0,
        appLogo: '',
        ids: []
      },
      formRules: {
        organizationName: [{ required: true, message: '渠道名称必填', trigger: 'blur' }],
        organizationNum: [{ required: true, message: '渠道编码必填', trigger: 'blur' }],
        // person: [{
        //   required: false, message: '仅支持字母或汉字', trigger: 'blur',
        //   pattern: /^[a-zA-Z,\u4e00-\u9fa5]+$/
        // }],
        enable: [{ required: true, message: '状态必填', trigger: 'blur' }],
        type: [{ required: true, message: '渠道分类必填', trigger: 'blur' }]
      },
      formActRules: {
        marketingCover: [{ required: true, message: '封面必填', trigger: 'blur' }],
        marketingVideo: [{ required: true, message: '视频必填', trigger: 'blur' }]
      },
      formProRules: {
        proLogo: [{ required: true, message: 'logo必填', trigger: 'blur' }],
        useMenu: [{ required: true, message: '状态必填', trigger: 'blur' }]
      }
    });
    const fixedTopRows = ref<boolean>(false);
    onMounted(() => {
      // 获取当前可视范围的高度
      console.log(document.body.clientHeight, '可视范围的高度');
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      let token = localStorage.getItem('x-auth-token');
      setArrt.headers.token = token as string;
      getOrganizationList();
      getCity();
    });
    const search = () => {
      getOrganizationList();
    };
    const getCity = () => {
      queryCity().then((res: any) => {
        setArrt.cityOptions = res.data;
      });
    };
    const set = () => {
      setArrt.searchData.organizationName = '';
      getOrganizationList();
    };
    const checked = (checkedj: Array<TreeNodeValue>) => {
      let arr = [] as any;
      setArrt.treeKeys = checkedj as never[];
      for (let i = 0; i < checkedj.length; i++) {
        for (let j = 0; j < setArrt.treeItems.length; j++) {
          if (!setArrt.treeItems[j].children || setArrt.treeItems[j].children.length == 0) continue;
          for (let k = 0; k < setArrt.treeItems[j].children.length; k++) {
            if (checkedj[i] == setArrt.treeItems[j].children[k].id) {
              if (arr.findIndex((item: any) => item == setArrt.treeItems[j].id) == -1) {
                arr.push(setArrt.treeItems[j].id);
              }
            }
          }
        }
      }
      setArrt.formProData.ids = [...checkedj] as never[];
    };
    const onChange = (rowId: number, rowEnable: number) => {
      switchOrganizationEnable({ id: rowId, enable: rowEnable }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
          getOrganizationList();
        }
      });
    };
    const edit = (value: number, state: boolean) => {
      setArrt.editState = state;
      setArrt.headerTitle = state ? '编辑渠道' : '查看详情';
      setArrt.id = value;
      getOrganization({ id: value }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          setArrt.formData = {
            organizationName: res.data.organizationName,
            phone: res.data.phone,
            organizationNum: res.data.organizationNum,
            longitude: res.data.longitude,
            latitude: res.data.latitude,
            enable: res.data.enable,
            level: res.data.level,
            interfaceSwitch: res.data.interfaceSwitch,
            parentId: res.data.parentId,
            remark: res.data.remark,
            appLogo: res.data.appLogo,
            marketingCover: res.data.marketingCover,
            marketingVideo: res.data.marketingVideo,
            finalCode: res.data.finalCode,
            person: res.data.person,
            address: res.data.address,
            type: res.data.type
          };
          if (res.data.provinceName || res.data.cityName || res.data.areaName) {
            setArrt.city = res.data.provinceName + '/' + res.data.cityName + '/' + res.data.areaName;
          } else {
            setArrt.city = '';
          }
          setArrt.addVisible = true;
        }
      });
    };
    const del = (value: number) => {
      removeOrganization({ id: value }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          getOrganizationList();
          MessagePlugin.success('删除成功');
        }
      });
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getOrganizationList = () => {
      organization(setArrt.searchData).then((res: any) => {
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
      });
    };
    const cancel = () => {
      disUpload.value = false;
      marketUpload.value = false;
    };
    const close = () => {
      disUpload.value = false;
      marketUpload.value = false;
    };
    const cityChange = (val: any, context: any) => {
      console.log(val, context);
      console.log(context.node.data.code);
      setArrt.formData.finalCode = context.node.data.code;
    };
    const submitForm = debounce(
      () => {
        console.log(setArrt.formData);
        const reg = /^[a-zA-Z\u4e00-\u9fa5]*$/;
        if (!reg.test(setArrt.formData.person)) {
          MessagePlugin.warning('联系人仅支持字母或汉字');
          return;
        }
        // if (setArrt.formData.phone.length < 11) {
        //   MessagePlugin.warning('手机号不能少于11位')
        //   return
        // }
        if (setArrt.formData.type == '' || setArrt.formData.type == null) {
          MessagePlugin.warning('渠道分类不能为空');
          return;
        }

        if (setArrt.id === 0) {
          //新增
          setArrt.formData.interfaceSwitch = setArrt.formData.interfaceSwitch ? 1 : 0;
          addOrganization(setArrt.formData).then((res: any) => {
            if (res.code === 200) {
              setArrt.addVisible = false;
              disUpload.value = false;
              marketUpload.value = false;
              getOrganizationList();
              MessagePlugin.success('新建成功');
            }
          });
        } else {
          //编辑
          const data = {
            id: setArrt.id,
            organizationName: setArrt.formData.organizationName,
            phone: setArrt.formData.phone,
            organizationNum: setArrt.formData.organizationNum,
            longitude: setArrt.formData.longitude,
            latitude: setArrt.formData.latitude,
            enable: setArrt.formData.enable,
            level: setArrt.formData.level,
            interfaceSwitch: setArrt.formData.interfaceSwitch ? 1 : 0,
            parentId: setArrt.formData.parentId,
            remark: setArrt.formData.remark,
            appLogo: setArrt.formData.appLogo ? setArrt.formData.appLogo : '',
            marketingCover: setArrt.formData.marketingCover ? setArrt.formData.marketingCover : '',
            marketingVideo: setArrt.formData.marketingVideo ? setArrt.formData.marketingVideo : '',
            finalCode: setArrt.formData.finalCode,
            person: setArrt.formData.person,
            address: setArrt.formData.address,
            type: setArrt.formData.type
          };
          EditOrganization(data).then((res: any) => {
            console.log(res);
            if (res.code === 200) {
              setArrt.addVisible = false;
              disUpload.value = false;
              marketUpload.value = false;
              getOrganizationList();
              MessagePlugin.success('编辑成功');
            }
          });
        }
      },
      300,
      false
    );
    const submitActForm = debounce(
      () => {
        setArrt.formActData.marketingCover = marketFile.value[0]?.url;
        setArrt.formActData.marketingVideo = videoItem.value[0]?.url;
        if (!setArrt.formActData.marketingCover || !setArrt.formActData.marketingVideo) {
          if (marketFile.value.length) {
            setArrt.formActData.marketingCover = marketFile.value[0]?.url;
          } else {
            MessagePlugin.warning('营销封面不能为空');
            return;
          }
          if (videoItem.value.length) {
            setArrt.formActData.marketingVideo = videoItem.value[0]?.url;
          } else {
            MessagePlugin.warning('营销视频不能为空');
            return;
          }
        }
        if (setArrt.formActData.keySwitch == 1 && setArrt.formActData.key == null) {
          MessagePlugin.warning('请填写key值');
          return;
        }
        addActivityConfig(setArrt.formActData).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            getOrganizationList();
            setArrt.activityVisible = false;
          }
        });
      },
      300,
      false
    );
    const submitProForm = debounce(
      () => {
        setArrt.formProData.appLogo = logoImg.value[0]?.url;
        setArrt.formProData.ids = setArrt.treeKeys;
        if (logoImg.value.length) {
          setArrt.formProData.appLogo = logoImg.value[0].url;
        } else {
          MessagePlugin.warning('logo必填');
          return;
        }
        if (!setArrt.formProData.ids.length) {
          MessagePlugin.warning('功能菜单配置必填');
          return;
        }
        addProConfig(setArrt.formProData).then((res: any) => {
          if (res.code === 200) {
            MessagePlugin.success(res.msg);
            setArrt.proVisible = false;
          }
        });
      },
      300,
      false
    );
    const addSite = () => {
      setArrt.headerTitle = '新建渠道';
      disUpload.value = false;
      setArrt.city = '';
      marketUpload.value = false;
      setArrt.addVisible = true;
      setArrt.editState = true;
      setArrt.id = 0;
      logoImg.value = [];
      marketFile.value = [];
      videoItem.value = [];
      setArrt.formData = {
        organizationName: '',
        phone: '',
        organizationNum: '',
        longitude: '',
        latitude: '',
        enable: 1,
        level: 2,
        interfaceSwitch: 1,
        parentId: 0,
        remark: '',
        appLogo: '',
        marketingCover: '',
        marketingVideo: '',
        finalCode: '',
        person: '',
        address: '',
        type: ''
      };
    };
    const genMarket = (id: number) => {
      addMarket({ channelCode: id }).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success(res.msg);
          getOrganizationList();
        }
      });
    };
    const formatImgResponse = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };
    const checkLogoLoad = (files: any[]): boolean | Promise<boolean> => {
      return new Promise(function (resolve, reject) {
        let width = 150;
        let height = 58;
        let url = '';
        // console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL);
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
            MessagePlugin.warning('图片尺寸(150px*58px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    //上传图片
    const handleLogoLoad = (context: any) => {
      setArrt.formData.appLogo = context.response.url;
    };
    const checkMarketLoad = (files: any[]): boolean | Promise<boolean> => {
      return new Promise(function (resolve, reject) {
        let width = 346;
        let height = 200;
        let url = '';
        // console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL);
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
            MessagePlugin.warning('图片尺寸(150px*58px)不符合标准！');
            reject(false);
          }
        };
        img.src = url;
      });
    };
    const browserUpload = (value: any) => {
      if (value == 'logoImg') {
        clipperData.value.autoCropWidth = 150;
        clipperData.value.autoCropHeight = 58;
        clipperRef.value.uploadFile();
      } else {
        clipperData.value.autoCropWidth = 346;
        clipperData.value.autoCropHeight = 200;
        clipperRef1.value.uploadFile();
      }
    };
    const toActivityConfig = (val: number) => {
      getActivityConfig(val);
      setArrt.formActData.id = val;
      setArrt.activityVisible = true;
    };
    const getActivityConfig = (value: number) => {
      getOrganization({ id: value }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          setArrt.formActData = {
            id: res.data.id,
            keySwitch: res.data.keySwitch,
            key: res.data.key,
            marketingCover: res.data.marketingCover,
            marketingVideo: res.data.marketingVideo
          };
          if (!res.data.marketingCover) {
            marketUpload.value = false;
            marketFile.value = [];
          } else {
            marketUpload.value = true;
            marketFile.value[0] = {
              name: '',
              url: res.data.marketingCover
            };
          }
          if (!res.data.marketingVideo) {
            videoItem.value = [];
          } else {
            videoItem.value[0] = {
              name: '',
              url: res.data.marketingVideo
            };
          }
        }
      });
    };
    const toProConfig = (val: number) => {
      getProConfig(val);
      setArrt.formProData.id = val;
    };
    const getProConfig = (val: number) => {
      queryProConfig({ id: val }).then((res: any) => {
        if (res.code === 200) {
          setArrt.treeItems = res.data.children;
          let data = [] as any;
          for (let i = 0; i < res.data.children.length; i++) {
            let item = res.data.children[i];
            if (item.isCheck && item.children.length <= 0) {
              data.push(item.id);
            }
            if (item.isCheck && item.children.length >= 0) {
              for (let k = 0; k < item.children.length; k++) {
                const itemK = item.children[k];
                if (itemK.isCheck) {
                  data.push(itemK.id);
                }
              }
            }
          }
          if (!res.data.appLogo) {
            disUpload.value = false;
            logoImg.value = [];
          } else {
            disUpload.value = true;
            logoImg.value[0] = {
              name: '',
              url: res.data.appLogo
            };
          }
          setArrt.treeKeys = data;
          // setArrt.formProData.ids = res.data.ids
          setArrt.proVisible = true;
        }
      });
    };

    const onConfirm = (val: any) => {
      disUpload.value = true;
      logoImg.value[0] = {
        name: '',
        url: val
      };
    };
    const onMarketConfirm = (val: any) => {
      marketUpload.value = true;
      marketFile.value[0] = {
        name: '',
        url: val
      };
    };
    const removeApp = () => {
      setArrt.formData.appLogo = '';
      disUpload.value = false;
      logoImg.value = [];
    };
    const removeMarket = () => {
      setArrt.formData.marketingCover = '';
      marketUpload.value = false;
      marketFile.value = [];
    };
    const deleteVideo = () => {
      setArrt.formData.marketingVideo = '';
      videoItem.value = [];
    };
    //上传图片
    const handleMarketLoad = (context: any) => {
      setArrt.formData.marketingCover = context.response.url;
    };
    const videoUpload = (files: any) => {
      if (files.response.code == '200') {
        // videoItem.value = files.response.data.url
        videoItem.value[0] = {
          name: files.response.data.originalFilename,
          url: files.response.data.url
        };
      } else {
        MessagePlugin.warning('上传失败，请稍后重试！');
      }
    };
    const beforeUpload = (file: any) => {
      // if (file.size > 10 * 1024 * 1024) {
      //   MessagePlugin.warning('上传的图片不能大于10M');
      //   return false;
      // }
      return true;
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getOrganizationList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getOrganizationList();
    };

    return {
      ...toRefs(setArrt),
      logoImg,
      marketFile,
      videoItem,
      formatImgResponse,
      checkLogoLoad,
      handleLogoLoad,
      handleMarketLoad,
      checkMarketLoad,
      videoUpload,
      beforeUpload,
      onChange,
      genMarket,
      submitForm,
      submitActForm,
      submitProForm,
      search,
      set,
      edit,
      del,
      addSite,
      pageSizeChange,
      currentChange,
      browserUpload,
      clipperRef,
      clipperRef1,
      disUpload,
      marketUpload,
      clipperData,
      removeApp,
      removeMarket,
      deleteVideo,
      onConfirm,
      onMarketConfirm,
      cancel,
      close,
      cityChange,
      checked,
      toActivityConfig,
      toProConfig,
      loadStatus,
      schedule,
      fixedTopRows
    };
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // background-color: #ffffff;
  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    // padding: 0 15px;
    margin-bottom: 8px;

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
    margin-bottom: 8px;

    .btn-item {
      margin-right: 25px;
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;
  }

  .market-box {
    ::v-deep(.t-form__controls-content) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
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

  .tree-box {
    max-height: 300px;
    width: 100%;
    overflow-y: auto;
    border: 1px #ddd solid;
    border-radius: 8px;
  }

  .t-pagination {
    margin-top: 30px;
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
}
</style>
