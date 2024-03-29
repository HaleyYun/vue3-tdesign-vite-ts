<template>
  <div class="user-box">
    <div class="box-img" @click="backRest">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <div class="img-btn" @click="">返回</div>
      </div>
    </div>
    <div class="search-box">
      <div class="search-data">模板名称：<t-input v-model="titleData.templateName" class="ipt-slt" placeholder="请输入模板名称" auto-width /></div>
      <div class="search-data">模板来源：<t-select class="ipt-slt" :options="typeOption" v-model="titleData.templateSource"></t-select></div>
      <div class="search-action">
        <t-button theme="primary" style="margin-right: 10px" @click="handlerSubmit">查询</t-button>
        <t-button variant="outline" theme="primary" @click="handlerRest">重置</t-button>
      </div>
    </div>
    <div>
      <t-button theme="primary" style="margin-left: 10px; margin-bottom: 10px" @click="addTemplate">
        <template #icon> <AddIcon /> </template>添加
      </t-button>
      <div class="tab-box">
        <t-table :max-height="fixedTopRows ? 1800 : 600" row-key="index" :data="tableData" :columns="(tableColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed">
          <template #templateAddress="{ row }">
            <div class="tdesign-demo-image-viewer__base">
              <t-image-viewer :images="[row.templateAddress]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img alt="test" :src="row.templateAddress" class="tdesign-demo-image-viewer__ui-image--img" />
                    <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                      <span><BrowseIcon size="1.4em" />预览</span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
          </template>
          <template #status="{ row }">
            <t-switch v-model="row.status" :customValue="[1, 0]" @change="onTemplate(row)" :key="row.id" />
          </template>
          <template #action="{ row }">
            <t-button size="small" variant="text" theme="success" @click="seeDetails(row)">编辑</t-button>
            <t-button size="small" variant="text" theme="danger" @click="seeDelete(row)">删除</t-button>
          </template>
        </t-table>
        <t-pagination :pageSize="formSearch.pageSize" :total="total" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
  </div>
  <t-dialog v-model:visible="addVisible" :header="dialogTitle" destroy-on-Close @confirm="submitForm">
    <t-form>
      <t-form-item requiredMark label="模板名称" name="name" initial-data="TDesign">
        <t-input :maxlength="20" show-limit-number v-model="templateName" :allowInputOverMax="false" placeholder="请输入模板名称" />
      </t-form-item>
      <t-form-item requiredMark label="模板图片" name="tel" initial-data="123456">
        <t-upload
          ref="uploadRef"
          v-model:files="avatarList"
          theme="image"
          :size-limit="{ size: 2, unit: 'MB' }"
          :action="uploadUrl"
          :formatResponse="formatImgResponse"
          accept="image/*"
          :data="{ path: 'POSTER' }"
          @remove="formImage = ''"
          :headers="setArrt.headers"
          :onSuccess="handleUpload"
          :beforeAllFilesUpload="checkUpload"
          tips="请上传750px*1500px图片"
          :locale="{ triggerUploadText: { image: '请选择' } }"
        ></t-upload>
      </t-form-item>
    </t-form>
  </t-dialog>
  <t-dialog v-model:visible="visible" theme="info" header="提醒" :body="delContent" @confirm="onClickConfirm" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { DateRangeValue, MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { debounce } from '../../utils/tools';
import { AddIcon, BrowseIcon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router';
import { posterTemplate, addPosterTemplate, updatePosterTemplate, removePosterTemplate, templateStatus } from '../../request/modules/equityApi';
import { organization } from '../../request/modules/ServiceApi';
import { useRoleStore } from '../../store/modules/role';
// --------全局参数---------------
const router = useRouter();
const roleState = useRoleStore();
const total = ref<any>('');
let formSearch = reactive<any>({
  templateSource: '',
  templateName: '',
  status: '',
  pageSize: 10,
  pageNum: 1
});
let titleData = reactive<any>({
  templateSource: '',
  templateName: '',
  status: '',
  pageSize: 10,
  pageNum: 1
});
//新的
const typeOption = ref<any>([]);
const addVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const dialogTitle = ref<string>('模板名称');
const templateName = ref<string>('');
const templateID = ref<number>();
const delContent = ref<string>('确认要删除该模版吗？删除后将无法恢复。');
const tableColumns = [
  {
    title: '模板名称',
    colKey: 'templateName',
    width: '200px',
    align: 'center'
  },
  {
    title: '预览效果',
    colKey: 'templateAddress',
    slots: { customRender: 'templateAddress' },
    align: 'center',
    width: '160px'
  },
  {
    title: '模板来源',
    colKey: 'templateSourceDesc',
    width: '180px',
    align: 'center'
  },
  {
    title: '状态',
    colKey: 'status',
    width: '100px',
    align: 'center'
  },
  {
    title: '操作人',
    colKey: 'updateUser',
    width: '120px',
    align: 'center'
  },
  {
    title: '操作日期',
    colKey: 'updateTime',
    width: '140px',
    slots: { customRender: 'updateTime' },
    align: 'center'
  },

  {
    title: '操作',
    colKey: 'action',
    width: '120px',
    fixed: 'right',
    slots: { customRender: 'action' },
    align: 'center'
  }
];
// 重置
const handlerRest = (values: any) => {
  formSearch.templateSource = '';
  formSearch.templateName = '';
  formSearch.status = '';
  titleData.templateSource = '';
  titleData.templateName = '';
  titleData.status = '';
  formSearch.pageSize = 10;
  formSearch.pageNum = 1;
  loadTableData();
};
const avatarList = ref<any>([]); //头像
const formImage = ref<any>(''); //图片回显
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示

// 搜索
const handlerSubmit = (values: any) => {
  formSearch = Object.assign(formSearch, titleData);
  formSearch.pageNum = 1;
  loadTableData();
};
//后退
const backRest = () => {
  router.go(-1);
};
//----- 加载列表数据 ---------
const setArrt = reactive({
  headers: {
    token: ''
  }
});
const handleUpload = (context: any) => {
  formImage.value = context.fileList[0].url;
};
const fixedTopRows = ref<boolean>(false);
onMounted(() => {
  // 获取当前可视范围的高度
  console.log(document.body.clientHeight, '可视范围的高度');
  if (document.body.clientHeight > 920) {
    fixedTopRows.value = true;
  } else {
    fixedTopRows.value = false;
  }
  getOrganizationList();
  loadTableData();
  let token = localStorage.getItem('x-auth-token');
  setArrt.headers.token = token as string;
});
// 获取来源
const getOrganizationList = () => {
  console.log(roleState.userInfo.organizationLevel, '等级');
  //1平台 2渠道 3 机构
  let data = {
    showChannel: roleState.userInfo.organizationLevel == 1 ? true : false,
    pageNum: 1,
    pageSize: 999
  };
  organization(data).then((res: any) => {
    if (res.code === 200) {
      typeOption.value = res.data.data.map((item: any) => {
        return {
          label: item.organizationName,
          value: item.organizationNum
        };
      });
    }
  });
};
const tableData = ref<any>([]);
const loadTableData = () => {
  posterTemplate(formSearch).then((res: any) => {
    if (res.code == '200') {
      tableData.value = res.data.data;
      total.value = res.data.total;
    }
  });
};

//编辑
const seeDetails = val => {
  templateID.value = val.id;
  if (val.templateAddress) {
    //图片
    avatarList.value[0] = {
      name: '',
      url: val.templateAddress
    };
  } else {
    avatarList.value = [];
  }
  templateName.value = val.templateName;
  addVisible.value = true;
};
//删除
const seeDelete = val => {
  templateID.value = val.id;
  if (val.used) {
    delContent.value = '该模版正在被使用，删除后将无法使用，确认要删除吗?';
  } else {
    delContent.value = '确认要删除该模版吗？删除后将无法恢复。';
  }

  visible.value = true;
};
const onClickConfirm = debounce(
  () => {
    let editParams = {
      id: templateID.value
      // status: '',
      // templateAddress: avatarList.value[0].url,
      // templateName: templateName.value
      // templateSource: ''
    };
    removePosterTemplate(editParams as any).then((res: any) => {
      if (res.code === 200) {
        loadTableData();
        visible.value = false;
      }
    });
  },
  300,
  false
);
//分页
const pageSizeChange = (pageSize: any) => {
  formSearch.pageSize = pageSize;
  formSearch.pageNum = 1;
  loadTableData();
};
const currentChange = (current: any) => {
  formSearch.pageNum = current;
  loadTableData();
};
//添加
const addTemplate = () => {
  templateName.value = '';
  avatarList.value = [];
  addVisible.value = true;
};
const formatImgResponse = (response: any) => {
  return { name: response.data.originalFilename, url: response.data.url };
};
//模板新增/修改
const submitForm = debounce(
  () => {
    if (templateName.value == '') {
      MessagePlugin.warning('请输入模板名称');
      return;
    }
    if (avatarList.value == '') {
      MessagePlugin.warning('请上传模板图片');
      return;
    }
    if (templateID.value) {
      let editParams = {
        id: templateID.value,
        // status: '',
        templateAddress: avatarList.value[0].url.replace('http://', 'https://'),
        templateName: templateName.value
        // templateSource: ''
      };
      updatePosterTemplate(editParams as any).then((res: any) => {
        if (res.code === 200) {
          addVisible.value = false;
          loadTableData();
        }
      });
    } else {
      let params = {
        // status: '',
        templateAddress: formImage.value.replace('http://', 'https://'),
        templateName: templateName.value
        // templateSource: ''
      };
      addPosterTemplate(params as any).then((res: any) => {
        if (res.code === 200) {
          addVisible.value = false;
          loadTableData();
        }
      });
    }
  },
  300,
  false
);
const checkUpload = (files: any[]): boolean | Promise<boolean> => {
  // return true
  return new Promise(function (resolve, reject) {
    let width = 750;
    let height = 1500;
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
        MessagePlugin.warning('图片尺寸(750px*1500px)不符合标准！');
        reject(false);
      }
    };
    img.src = url;
  });
};

//改变状态
const onTemplate = row => {
  console.log(row, 'ppppp');

  templateStatus({ id: row.id }).then((res: any) => {
    if (res.code === 200) {
      loadTableData();
    } else {
      MessagePlugin.error(res.msg);
    }
  });
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #ffffff; // background: #ffffff;
  .box-img {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;

    .box-left {
      display: flex;
      align-items: center;

      .img-btn {
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 25px;
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
  .search-box {
    display: flex;
    align-items: center;
    // flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 8px;
    .ipt-slt {
      width: 230px;
      margin-right: 15px;
    }
    .search-data {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
    }
    .search-action {
      display: flex;
      align-items: center;
      .search-item {
        width: 90px;
        height: 32px;
        background: #3d7eff;
        box-shadow: 0px 2px 4px 0px #fafbff;
        border-radius: 6px;
        text-align: center;
        margin-right: 16px;
        cursor: default;
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
        cursor: default;
        .rest {
          font-size: 16px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          // font-weight: bold;
          color: #3d7eff;
          line-height: 32px;
        }
      }
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;
  }
}
::v-deep(.t-table__th-cell-inner) {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
  line-height: 22px;
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
