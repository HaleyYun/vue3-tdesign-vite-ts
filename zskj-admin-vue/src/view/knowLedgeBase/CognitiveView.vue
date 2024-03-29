<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item">游戏名称：<t-input class="ipt-slt" v-model="setArrt.titleData.gameName" auto-width placeholder="请输入训练名称" /></div>
      <div class="search-item">分类：<t-select class="ipt-slt" clearable @clear="rest" v-model="setArrt.titleData.category" :options="foodsLabel" placeholder="请选择"></t-select></div>

      <div class="search-item">
        <span style="width: 85px">跳转类型：</span>
        <t-select class="ipt-slt" :options="proOption" v-model="setArrt.titleData.redirectType" placeholder="请选择"></t-select>
      </div>
      <div class="search-item">
        <span style="width: 80px">状态：</span>
        <t-select class="ipt-slt" :options="setArrt.statusOption" v-model="setArrt.titleData.enable" placeholder="请选择"></t-select>
      </div>
      <div class="search-item">
        <span style="width: 85px">创建时间：</span>
        <t-date-range-picker allow-input clearable enable-time-picker @change="change" v-model="setArrt.timeData" />
      </div>

      <t-button style="margin-right: 15px" theme="primary" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box" style="margin-left: 15px">
        <t-button theme="primary" @click="handleChange">
          <template #icon> <AddIcon /> </template>新增</t-button
        >
      </div>
    </div>
    <div class="tab-box">
      <load :status="loadStatus" :schedule="schedule" v-if="setArrt.typeSelectList?.length == 0"></load>
      <div v-else>
        <t-table :max-height="fixedTopRows ? 1400 : 390" row-key="index" :data="setArrt.typeSelectList" :columns="setArrt.columns" size="medium" table-layout="fixed">
          <template #typeName="{ col, row }">
            <span v-if="row.redirectType == 2">小程序</span>
            <span v-if="row.redirectType == 1">H5</span>
          </template>
          <template #enableName="{ col, row }">
            <span v-if="row.enable == 1">启用</span>
            <span v-if="row.enable == 2">禁用</span>
          </template>
          <template #action="{ row }">
            <div v-if="row" class="text-row">
              <t-button variant="text" size="small" @click="edit(row)" theme="success" ghost>编辑</t-button>
              <t-popconfirm theme="default" @click.stop @confirm="knowDel(row.id)" content="确认删除吗">
                <t-button variant="text" theme="danger" size="small"> 删除</t-button>
              </t-popconfirm>
            </div>
          </template>
        </t-table>
        <t-pagination :pageSize="setArrt.searchData.pageSize" v-model:current="setArrt.searchData.pageNum" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
    <t-dialog width="700" v-model:visible="setArrt.addVisible" :header="setArrt.dialogTitle" @confirm="submitForm" @cancelBtn="cancel" @closeBtn="close">
      <t-form ref="form" :data="addFormData">
        <div class="classID">
          <t-form-item requiredMark label="游戏ID" name="gameID" initial-data="TDesign">
            <t-input class="classGame" v-model="addFormData.gameID" :allowInputOverMax="false" placeholder="请输入游戏ID" />
          </t-form-item>
          <t-form-item label="游戏难度" requiredMark name="gameClass" initial-data="123456">
            <t-input-number v-model="addFormData.gameClass" :min="0" :max="100" suffix="级" auto-width />
          </t-form-item>
        </div>
        <div class="classID">
          <t-form-item requiredMark label="厂商名称" name="factoryName" initial-data="123456">
            <t-input :allowInputOverMax="false" :maxlength="30" placeholder="请输入厂商名称" v-model="addFormData.factoryName" />
          </t-form-item>
          <t-form-item label="游戏名称" requiredMark name="gameName" initial-data="123456">
            <t-input :allowInputOverMax="false" :maxlength="30" placeholder="请输入" v-model="addFormData.gameName" />
          </t-form-item>
        </div>
        <t-form-item label="游戏描述" requiredMark name="gameDescription" initial-data="123456">
          <t-textarea v-model="addFormData.gameDescription" placeholder="请输入" :maxlength="30"></t-textarea>
        </t-form-item>
        <t-form-item label="游戏分类" requiredMark name="gameType" initial-data="123456">
          <t-select v-model="addFormData.gameType" :options="foodsLabel" placeholder="请选择" filterable />
        </t-form-item>

        <t-form-item label="记忆力" requiredMark name="rememberWeight">
          <t-input @change="memoryreserve" placeholder="请输入记忆力值" v-model="addFormData.rememberWeight" />
        </t-form-item>
        <t-form-item label="执行功能" requiredMark name="executeWeight">
          <t-input @change="carryOutreserve" placeholder="请输入执行功能值" v-model="addFormData.executeWeight" />
        </t-form-item>
        <t-form-item label="视空间" requiredMark name="seeWeight">
          <t-input @change="visionreserve" placeholder="请输入视空间值" v-model="addFormData.seeWeight" />
        </t-form-item>
        <t-form-item label="数理能力" requiredMark name="countWeight">
          <t-input @change="mathematicsreserve" placeholder="请输入数理能力值" v-model="addFormData.countWeight" />
        </t-form-item>
        <t-form-item label="语言能力" requiredMark name="speakWeight">
          <t-input @change="Languagereserve" placeholder="请输入语言能力值" v-model="addFormData.speakWeight" />
        </t-form-item>
        <t-form-item label="是否默认" requiredMark name="isDefault" initial-data="123456">
          <t-radio-group v-model="addFormData.isDefault" @change="onChangeStatus">
            <t-radio :value="1">是</t-radio>
            <t-radio :value="0">否</t-radio>
          </t-radio-group>
        </t-form-item>

        <t-form-item label="跳转类型" requiredMark name="jumpType" initial-data="123456">
          <t-radio-group v-model="addFormData.jumpType" @change="onChange">
            <t-radio :value="1">H5</t-radio>
            <t-radio :value="2">小程序</t-radio>
          </t-radio-group>
          <!-- <t-radio-group v-model="addFormData.gameStatus" @change="onChangeStatus">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="2">禁用</t-radio>
          </t-radio-group> -->
        </t-form-item>
        <t-form-item label="跳转地址" requiredMark name="gameAddress" initial-data="123456">
          <t-input :allowInputOverMax="false" placeholder="请输入" v-model="addFormData.gameAddress" />
        </t-form-item>

        <t-form-item label="跳转主图" requiredMark name="img" initial-data="img">
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
            tips="请上传78px*78px图片"
            :locale="{ triggerUploadText: { image: '请选择图片' } }"
          ></t-upload>
          <div class="img-box" @click="browserUpload" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">请上传108px*100px图片</div>
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
        <t-form-item label="状态" requiredMark name="gameStatus" initial-data="123456">
          <t-radio-group v-model="addFormData.gameStatus" @change="onChangeStatus">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="2">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import { DateRangeValue, MessagePlugin, SelectValue, DateValue } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { AddCircleIcon, AddIcon } from 'tdesign-icons-vue-next';
import { debounce } from '../../utils/tools';
import cropper from '@/components/ImgCropping/Cropper.vue';
import { cognitiveList, cognitiveAdd, cognitiveEdit, cognitiveDel, knowDict } from '@/request/modules/knowledge';
import load from '../../components/load/load.vue';
const router = useRouter();
const foodsLabel = ref<any>([
  { label: '记忆力', value: 'memory' },
  { label: '执行能力', value: 'carry' },
  { label: '视空间', value: 'see' },
  { label: '数理逻辑', value: 'count' },
  { label: '语言能力', value: 'speak' }
]);
const formImage = ref<any>('');
const headers = ref<any>({});
const fileList = ref<any>([]);
const imgFile = ref<any>([]); //图片
const clipperRef = ref<any>({});
const disUpload = ref<boolean>(false);
const clipperData = ref<any>({
  type: '',
  allowTypeList: ['png', 'jpg', 'jpeg'],
  limitSize: 1,
  fixedNumber: [1, 1],
  previewWidth: 100,
  autoCropWidth: 80, // 默认生成截图框宽度
  autoCropHeight: 70 // 默认生成截图框高度
});
const addFormData = reactive<any>({
  gameID: '',
  factoryName: '',
  gameClass: '',
  gameName: '',
  gameDescription: '',
  gameType: '',
  jumpType: '',
  gameAddress: '',
  accessUrl: '',
  gameStatus: 1,
  id: '',

  rememberWeight: '',
  executeWeight: '',
  seeWeight: '',
  countWeight: '',
  speakWeight: '',
  isDefault: 0
});
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
const setArrt = <any>reactive({
  formData: {
    pageNum: 1,
    pageSize: 10,
    gameName: '', //训练名称
    category: '', //分类
    redirectType: '', //跳转类型
    enable: '', //状态
    createTimeStart: '', //开始时间
    createTimeEnd: '', //结束时间
    timeData: []
  },
  titleData: {
    gameName: '', //训练名称
    category: '', //分类
    redirectType: '', //跳转类型
    enable: '', //状态
    createTimeStart: '', //开始时间
    createTimeEnd: '', //结束时间
    timeData: []
  },
  total: 10,
  timeData: [],
  dialogTitle: '新建',
  addVisible: false,
  name: '',
  artTypeData: {
    categoryName: '',
    status: 1,
    pageSize: 10,
    pageNum: 1,
    statusList: []
  },
  typeSelectList: [],
  searchData: {
    categoryName: '',
    id: '',
    status: '',
    statusList: [],
    pageNum: 1,
    pageSize: 10
  },
  statusOption: [
    { label: '全部', value: '' },
    { label: '启用', value: '1' },
    { label: '禁用', value: '2' }
  ],

  data: [],
  datas: [],
  columns: [
    { colKey: 'gameId', title: '编码', align: 'center' },
    { colKey: 'gameName', title: '游戏名称', align: 'center' },
    { colKey: 'categoryName', title: '分类', align: 'center' },
    { colKey: 'manufacturerName', title: '厂商', align: 'center' },
    { colKey: 'difficulty', title: '难度', align: 'center' },
    { colKey: 'redirectType', title: '跳转', cell: 'typeName', align: 'center' },
    { colKey: 'enable', title: '状态', cell: 'enableName', align: 'center' },
    { colKey: 'createTime', title: '创建时间', align: 'center', width: '180px' },
    { title: '操作', colKey: 'action', align: 'center', lots: { customRender: 'action' } }
  ],
  title: ''
});
const proOption = ref<any>([
  { label: '全部', value: '' },
  { label: 'H5', value: 1 },
  { label: '小程序', value: 2 }
]);
const onChange = () => {
  // console.log('checkedValues:', value.value, checkedValues);
};
const onChangeStatus = () => {};

//新增
const handleChange = () => {
  setArrt.dialogTitle = '新建';
  disUpload.value = false;
  addFormData.gameID = ''; //游戏id
  addFormData.factoryName = ''; //厂商名称
  addFormData.gameClass = '0'; //游戏难度

  (addFormData.rememberWeight = ''), //记忆力
    (addFormData.executeWeight = ''), //执行能力
    (addFormData.seeWeight = ''), //视空间
    (addFormData.countWeight = ''), //语言能力
    (addFormData.speakWeight = ''), //数理逻辑
    (addFormData.isDefault = 2), //是否禁用
    (addFormData.gameName = ''); //游戏名称
  addFormData.gameDescription = ''; //游戏描述
  addFormData.gameType = ''; //游戏分类
  addFormData.jumpType = 2; //跳转类型
  addFormData.gameAddress = ''; //跳转地址
  formImage.value = ''; //图片
  addFormData.factoryName = ''; //跳转主图
  fileList.value = [];
  setArrt.addVisible = true;
};

const edit = (val: any) => {
  console.log(val, 'val');
  disUpload.value = true;
  fileList.value[0] = {
    name: '',
    url: val.accessUrl
  };
  addFormData.id = val.id;
  setArrt.dialogTitle = '编辑';
  addFormData.gameID = val.gameId;
  addFormData.factoryName = val.manufacturerName;
  addFormData.gameClass = val.difficulty;
  addFormData.gameName = val.gameName;

  (addFormData.rememberWeight = val.rememberWeight), //记忆力
    (addFormData.executeWeight = val.executeWeight), //执行能力
    (addFormData.seeWeight = val.seeWeight), //视空间
    (addFormData.countWeight = val.countWeight), //语言能力
    (addFormData.speakWeight = val.speakWeight), //数理逻辑
    (addFormData.isDefault = val.isDefault), //是否禁用
    (addFormData.gameDescription = val.gameDesc);
  addFormData.gameType = val.category;
  addFormData.jumpType = Number(val.redirectType);
  addFormData.gameAddress = val.redirectUrl;
  formImage.value = val.accessUrl;
  addFormData.gameStatus = val.enable;
  setArrt.addVisible = true;
};

const knowDel = (value: any) => {
  cognitiveDel({ id: value }).then((res: any) => {
    console.log(res);
    if (res.code === 200) {
      MessagePlugin.success('删除成功');
      getCognitiveList();
    } else {
      // MessagePlugin.warning(res.msg);
    }
  });
};
const handleUpload = (context: any) => {
  console.log('context', context, imgFile);
  formImage.value = context.response.url;
};
const fixedTopRows = ref<boolean>(false);
onMounted(async () => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 800) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  getCognitiveList();
  // await knowGetDict();
  let token = localStorage.getItem('x-auth-token');
  headers.value = {
    token: token
  };
});
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20); //加载中进度
//列表数据
const getCognitiveList = () => {
  cognitiveList(setArrt.formData).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      if (res.data == null || res.data.total == 0) {
        //无数据
        (loadStatus.value = 'noData'), (setArrt.typeSelectList = []);
      } else {
        setArrt.typeSelectList = res.data.data;
        setArrt.total = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (setArrt.typeSelectList = []);
    }
  });
};

const browserUpload = (value: any) => {
  clipperData.value.autoCropWidth = 78;
  clipperData.value.autoCropHeight = 78;
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
const cancel = () => {
  disUpload.value = false;
};
const close = () => {
  disUpload.value = false;
};
//game
// const knowGetDict = () => {
//   knowDict({ dictType: 'game' }).then((res: any) => {
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

const search = () => {
  setArrt.formData = Object.assign(setArrt.formData, setArrt.titleData);
  setArrt.formData.pageNum = 1;
  getCognitiveList();
};
const rest = () => {
  setArrt.formData = {
    pageNum: 1,
    pageSize: 10
    // articleTypeList: []
  };
  setArrt.formData = {
    pageNum: 1,
    pageSize: 10,
    gameName: '', //训练名称
    category: '', //分类
    redirectType: '', //跳转类型
    enable: '', //状态
    createTimeStart: '', //开始时间
    createTimeEnd: '', //结束时间
    timeData: []
  };
  setArrt.titleData = {
    gameName: '', //训练名称
    category: '', //分类
    redirectType: '', //跳转类型
    enable: '', //状态
    createTimeStart: '', //开始时间
    createTimeEnd: '', //结束时间
    timeData: []
  };
  setArrt.timeData = [];
  getCognitiveList();
};

const submitForm = debounce(
  () => {
    if (setArrt.dialogTitle == '新建') {
      cognitiveAdd({
        gameId: addFormData.gameID, //游戏id
        manufacturerName: addFormData.factoryName, //厂商名称
        difficulty: addFormData.gameClass, //游戏难度
        gameName: addFormData.gameName, //游戏名称
        gameDesc: addFormData.gameDescription, //游戏描述
        category: addFormData.gameType, //游戏分类
        redirectType: addFormData.jumpType, //跳转类型
        redirectUrl: addFormData.gameAddress, //跳转地址
        enable: addFormData.gameStatus, //状态
        // accessUrl: formImage.value, //图片
        accessUrl: fileList.value[0].url, //图片

        rememberWeight: addFormData.rememberWeight,
        executeWeight: addFormData.executeWeight,
        seeWeight: addFormData.seeWeight,
        countWeight: addFormData.countWeight,
        speakWeight: addFormData.speakWeight,
        isDefault: addFormData.isDefault
      }).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success(res.data);
          getCognitiveList();
          disUpload.value = false;
          setArrt.addVisible = false;
        }
      });
    } else {
      cognitiveEdit({
        id: addFormData.id,
        gameId: addFormData.gameID, //游戏id
        manufacturerName: addFormData.factoryName, //厂商名称
        difficulty: addFormData.gameClass, //游戏难度
        gameName: addFormData.gameName, //游戏名称
        gameDesc: addFormData.gameDescription, //游戏描述
        category: addFormData.gameType, //游戏分类
        redirectType: addFormData.jumpType, //跳转类型
        redirectUrl: addFormData.gameAddress, //跳转地址
        enable: addFormData.gameStatus, //状态
        // accessUrl: formImage.value, //图片
        accessUrl: fileList.value[0].url, //图片
        rememberWeight: addFormData.rememberWeight,
        executeWeight: addFormData.executeWeight,
        seeWeight: addFormData.seeWeight,
        countWeight: addFormData.countWeight,
        speakWeight: addFormData.speakWeight,
        isDefault: addFormData.isDefault
      }).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('编辑成功');
          disUpload.value = false;
          setArrt.addVisible = false;
          getCognitiveList();
        } else {
          // MessagePlugin.success(res.msg);
        }
      });
    }
  },
  300,
  false
);
const change = (value: DateValue[]) => {
  console.log(value);
  setArrt.titleData.createTimeStart = value[0] as string;
  setArrt.titleData.createTimeEnd = value[1] as string;
  console.log(setArrt.searchData);
};

//分页
const pageSizeChange = (pageSize: any) => {
  setArrt.formData.pageSize = pageSize;
  setArrt.formData.pageNum = 1;
  getCognitiveList();
};
const currentChange = (current: number) => {
  setArrt.formData.pageNum = current;
  getCognitiveList();
};
const formatImgResponse = (response: any) => {
  return { name: response.data.originalFilename, url: response.data.url };
};
const checkUpload = (files: any[]): boolean | Promise<boolean> => {
  // return true
  return new Promise(function (resolve, reject) {
    let width = 78;
    let height = 78;
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
        MessagePlugin.warning('图片尺寸(78px*78px)不符合标准！');
        reject(false);
      }
    };
    img.src = url;
  });
};
// 记忆力保留小数
const memoryreserve = () => {
  addFormData.rememberWeight = addFormData.rememberWeight.match(/\d+\.?\d{0,2}/, '')[0];
};
// 执行功能保留小数
const carryOutreserve = () => {
  addFormData.executeWeight = addFormData.executeWeight.match(/\d+\.?\d{0,2}/, '')[0];
};
// 视空间保留小数
const visionreserve = () => {
  addFormData.seeWeight = addFormData.seeWeight.match(/\d+\.?\d{0,2}/, '')[0];
};
// 数理能力保留小数
const mathematicsreserve = () => {
  addFormData.countWeight = addFormData.countWeight.match(/\d+\.?\d{0,2}/, '')[0];
};
// 语言能力保留小数
const Languagereserve = () => {
  addFormData.speakWeight = addFormData.speakWeight.match(/\d+\.?\d{0,2}/, '')[0];
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
    box-sizing: border-box;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;

      .ipt-slt {
        width: 280px;
        margin-left: 5px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px #fafbff;
        // border-radius: 8px;
        // border: 1px solid #DADCE4;
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
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;

    .operate-box {
      display: flex;
      align-items: center;
      border-radius: 16px;
      margin-bottom: 8px;

      .add-item {
        background: #f4f8ff;
        box-shadow: 0px 2px 4px 0px #fafbff;
        border-radius: 6px;
      }

      // button {
      //   &:nth-child(1) {
      //     margin-left: 10px;
      //   }
      // }

      .search-item {
        margin-right: 25px;
        display: flex;
        align-items: center;
        font-size: 14px;

        .ipt-slt {
          width: 180px;
          margin-left: 5px;
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

  .t-pagination {
    margin-top: 30px;
  }

  .cope-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pageInfo {
    margin: 20px 0;
  }

  .classID {
    display: flex;
    // justify-content: space-around;
    // .classGame{
    // margin-right: 70px;
    // }
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
