<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font"><span class="item-title">客户姓名：</span><t-input class="ipt-slt" v-model="titleData.name" auto-width /></div>
      <div class="search-item search-item-font"><span class="item-title">手机号：</span><t-input class="ipt-slt" v-model="titleData.phone" auto-width /></div>
      <div class="search-item search-item-font"><span class="item-title">客户性别：</span><t-select class="ipt-slt" v-model="titleData.sex" :options="sexOption" placeholder="请选择" :keys="{ value: 'dictValue', label: 'dictLabel' }"></t-select></div>
      <div class="search-item search-item-font"><span class="item-title">教育程度：</span><t-select class="ipt-slt" v-model="titleData.education" :options="educationOption" placeholder="请选择" :keys="{ value: 'dictValue', label: 'dictLabel' }"></t-select></div>
      <div class="search-item search-age search-item-font"><span class="item-title">年龄：</span><t-input-number class="ipt-age" :min="0" :max="99999" v-model="titleData.beginAge" auto-width />&nbsp;~<t-input-number class="ipt-age" :min="0" :max="99999" v-model="titleData.endAge" auto-width /></div>

      <div class="search-item search-item-font"><span class="item-title">服务来源：</span><t-cascader class="ipt-slt" v-model="titleData.channel" clearable :show-all-levels="false" :options="organOption" check-strictly></t-cascader></div>
      <div class="search-item search-item-font"><span class="item-title">评估员：</span><t-input class="ipt-slt" v-model="titleData.assessorSearch" auto-width /></div>
      <div class="search-item search-item-font"><span class="item-title">注册时间：</span><t-date-range-picker v-model="dateValue" enable-time-picker allow-input clearable @change="onChange" /></div>
      <div class="search-item search-item-font"><span class="item-title">评估时间：</span><t-date-range-picker v-model="estimateTimeValue" enable-time-picker allow-input clearable @change="onEstimateTimeChange" /></div>
      <t-button class="search-item" theme="primary" @click="searchList">搜索</t-button>
      <t-button variant="outline" class="search-item" theme="primary" @click="resetFilter">重置</t-button>
      <t-button theme="primary" @click="exportZipFileByFront">批量导出BHI</t-button>
      <!--      <t-button class="search-item" theme="primary" style="margin-left:20px;" @click="exportBhiZipFile">导出</t-button>-->
    </div>
    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table :max-height="fixedTopRows ? 1400 : 320" row-key="index" :data="data" table-layout="fixed" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" :bordered="false">
        <template #organListString="{ row }">
          <div class="organListStringText" @click="lookSourceInfoList(row.sourceInfoList)">{{ row.organListString }}</div>
        </template>
        <template #action="{ row }">
          <div class="action">
            <t-button size="small" variant="text" @click="lookDetaile(row.id, row.archivesNo, row.age)" theme="primary"> 查看详情</t-button>
            <t-button size="small" v-if="row.pdfPath" variant="text" @click="downLoadBhiPdf(row.name, row.phone, row.pdfPath)" theme="primary"> 下载BHI</t-button>
          </div>
        </template>
      </t-table>
      <t-pagination :total="total" :defaultPageSize="searchData.pageSize" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>
    <t-dialog v-model:visible="visible" header="服务来源" :confirmBtn="null" :cancelBtn="null" width="700px">
      <t-table row-key="index" :data="sourceInfoListData" table-layout="fixed" :columns="sourceInfoListColumns" size="medium" hover :bordered="false"> </t-table>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { DateRangeValue, MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { getBasePageList, pdfBatchDownloadUriAndName } from '../../request/modules/CustomApi';
import { getOrganMultiSelect } from '../../request/modules/institution';
import { dictData } from '../../request/modules/dictData';
import load from '../../components/load/load.vue';
import { GetBasePageListType } from '@/request/types/CustomApi';
import axios from 'axios';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { customStore } from '../../store/modules/custom';

export default {
  components: {
    load
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const custom = customStore();
    const requestUrl = import.meta.env.VITE_API_BASE_URL + '/zskj/admin/';
    const token = localStorage.getItem('x-auth-token');
    axios.defaults.headers.common['token'] = token;
    const setArrt = reactive({
      visible: false,
      searchData: {
        name: '',
        channel: '',
        sex: '',
        phone: '',
        beginCreateDate: '',
        endCreateDate: '',
        education: '',
        beginAge: undefined,
        endAge: undefined,
        estimateStartTime: '',
        estimateEndTime: '',
        assessorSearch: '',
        pageNum: 1,
        pageSize: 10
      },
      titleData: {
        name: '',
        channel: '',
        sex: '',
        phone: '',
        beginCreateDate: '',
        endCreateDate: '',
        education: '',
        beginAge: undefined,
        endAge: undefined,
        estimateStartTime: '',
        estimateEndTime: '',
        assessorSearch: ''
      },
      sourceInfoListData: [
        {
          channelCode: '',
          channelName: '',
          organCode: '',
          organName: '',
          updateTime: ''
        }
      ],
      sourceInfoListColumns: [
        { colKey: 'organName', title: '服务机构' },
        { colKey: 'channelName', title: '所属渠道' },
        { colKey: 'updateTime', title: '授权时间' }
      ],
      dateValue: [],
      estimateTimeValue: [],
      total: 0,
      sexOption: [{ dictLabel: '', dictValue: '' }],
      educationOption: [{ dictLabel: '', dictValue: '' }],
      organOption: [{ label: '', value: '', children: [] }],
      data: [],
      columns: [
        { colKey: 'archivesNo', title: '用户ID', width: '260px', align: 'center' },
        { colKey: 'name', title: '客户姓名', width: '150px', align: 'center' },
        { colKey: 'phone', title: '联系方式', width: '160px', align: 'center' },
        { colKey: 'sexDesc', title: '客户性别', width: 100, align: 'center' },
        {
          title: '服务来源',
          colKey: 'organListString',
          slots: { customRender: 'organListString', width: '180px', align: 'center' }
        },
        { colKey: 'educationDesc', title: '教育程度', width: '120px', align: 'center' },
        { colKey: 'age', title: '年龄', width: '120px', align: 'center' },
        { colKey: 'createTime', title: '注册时间', width: '200px', align: 'center' },
        {
          title: '操作',
          colKey: 'action',
          width: '180px',
          align: 'center',
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ]
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
      setArrt.searchData = custom.searchData;
      setArrt.titleData = custom.searchData;
      setArrt.dateValue = custom.dateValue;
      setArrt.estimateTimeValue = custom.estimateTimeValue;
      getList();
      getDictData();
      getSelectList();
    });
    const getDictData = () => {
      dictData({ dictType: 'health_education' }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          setArrt.educationOption = res.data;
        }
      });
      dictData({ dictType: 'health_sex' }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          setArrt.sexOption = res.data;
        }
      });
    };
    const getSelectList = () => {
      getOrganMultiSelect().then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          setArrt.organOption = res.data;
        }
      });
    };
    const msgLoadingBox = ref();
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getList = () => {
      getBasePageList(setArrt.searchData).then((res: any) => {
        if (res.code === 200) {
          if (res.data == null || res.data.total == 0) {
            (loadStatus.value = 'noData'), (setArrt.data = []);
          } else {
            setArrt.data = res.data?.data || [];
            setArrt.total = res.data?.total || 0;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
      });
    };
    const exportZipFile = (data: GetBasePageListType) => {
      const token = localStorage.getItem('x-auth-token');
      axios.defaults.headers.common['token'] = token;
      axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json' //'Access-Control-Allow-Origin'
        },
        url: requestUrl + '/healthRecords/getBasePageListExportBhi',
        responseType: 'blob',
        data: data
      }).then(res => {
        let content_disposition: string = res.headers['content-disposition'];
        console.log(content_disposition);
        let filename = decodeURI(content_disposition.split(';')[1].split('=')[1]);
        let blob = new Blob([res.data], { type: 'application/zip' });
        let url = window.URL.createObjectURL(blob);
        console.log(url);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      });
    };
    const getFileData = (fileUrl: string) => {
      return new Promise((resolve, reject) => {
        fileUrl = fileUrl.replace('http://', 'https://');
        axios(fileUrl, {
          method: 'GET',
          responseType: 'blob'
        })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    };
    const handleBatchDown = async (dataSource: { fileUrl: string; filename: string }[], zipName: string) => {
      const zip = new JSZip();
      const promises: any = [];
      dataSource.forEach((item: { fileUrl: string; filename: string }) => {
        const promise = getFileData(item.fileUrl).then((res: any) => {
          const fileName = item.filename;
          zip.file(fileName, res.data, { binary: true });
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        zip
          .generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
              level: 9
            }
          })
          .then((res: any) => {
            FileSaver.saveAs(res, zipName + '.zip');
            MessagePlugin.close(msgLoadingBox.value);
            MessagePlugin.success('下载完成！');
          });
      });
    };

    const downloadAndZip = async (res: any) => {
      if (res.code === 200) {
        if (res.data == null || res.data.total == 0) {
          //ignore
        } else {
          msgLoadingBox.value = MessagePlugin.loading({
            content: '正在下载，请耐心等待!',
            duration: 0
          });

          let zipName: string = res.data.zipName;
          let fileNames: string[] = res.data.fileNames;
          let filePath: string[] = res.data.filePath;
          let fileBatch: { fileUrl: string; filename: string }[] = [];
          for (let i = 0; i < filePath.length; i++) {
            fileBatch[i] = {
              fileUrl: filePath[i],
              filename: fileNames[i]
            };
          }
          console.log(fileBatch);
          console.log(zipName);
          await handleBatchDown(fileBatch, zipName);
        }
      }
    };
    const exportZipFileByFront = async () => {
      pdfBatchDownloadUriAndName(setArrt.searchData).then((res: any) => {
        downloadAndZip(res);
      });
    };

    const exportBhiZipFile = () => {
      exportZipFile(setArrt.searchData);
    };
    const onChange = (value: DateRangeValue) => {
      setArrt.titleData.beginCreateDate = value[0] as string;
      setArrt.titleData.endCreateDate = value[1] as string;
    };
    const onEstimateTimeChange = (value: DateRangeValue) => {
      setArrt.titleData.estimateStartTime = value[0] as string;
      setArrt.titleData.estimateEndTime = value[1] as string;
    };
    const lookDetaile = (id: number | string, archivesNo: string, age: string) => {
      router.push({ path: '/customDetails', query: { id, archivesNo, age } });
    };
    const downLoadBhiPdf = (archivesName: string, phoneNumber: string, pdfPath: string) => {
      if (archivesName && phoneNumber && pdfPath) {
        var request = new XMLHttpRequest();
        request.responseType = 'blob'; //定义响应类型
        pdfPath = pdfPath.replace('http://', 'https://');
        request.open('GET', pdfPath);
        request.onload = function () {
          var url = window.URL.createObjectURL(this.response);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = archivesName + phoneNumber.slice(-4) + '.pdf';
          a.click();
          a.remove();
        };
        request.send();
      }
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getList();
    };
    const resetFilter = () => {
      setArrt.searchData = {
        name: '',
        channel: '',
        sex: '',
        phone: '',
        beginCreateDate: '',
        endCreateDate: '',
        education: '',
        beginAge: undefined,
        endAge: undefined,
        estimateStartTime: '',
        estimateEndTime: '',
        assessorSearch: '',
        pageNum: 1,
        pageSize: setArrt.searchData.pageSize
      };
      setArrt.titleData = {
        name: '',
        channel: '',
        sex: '',
        phone: '',
        beginCreateDate: '',
        endCreateDate: '',
        education: '',
        beginAge: undefined,
        endAge: undefined,
        estimateStartTime: '',
        estimateEndTime: '',
        assessorSearch: ''
      };
      setArrt.dateValue = [];
      (setArrt.estimateTimeValue = []), getList();
    };
    const searchList = () => {
      // debugger
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
      setArrt.searchData.pageNum = 1;
      custom.searchData = setArrt.searchData;
      (custom.dateValue = setArrt.dateValue), (custom.estimateTimeValue = setArrt.estimateTimeValue);
      getList();
    };
    const lookSourceInfoList = (item: any) => {
      console.log(item);
      let organizationLevel = JSON.parse(localStorage.getItem('userinfo') as string).organizationLevel;
      if (organizationLevel == 1) {
        setArrt.sourceInfoListColumns = [
          { colKey: 'organName', title: '服务机构' },
          { colKey: 'channelName', title: '所属渠道' },
          { colKey: 'updateTime', title: '授权时间' }
        ];
      } else {
        setArrt.sourceInfoListColumns = [
          { colKey: 'organName', title: '服务机构' },
          { colKey: 'updateTime', title: '授权时间' }
        ];
      }
      setArrt.sourceInfoListData = item;
      setArrt.visible = true;
    };
    return {
      ...toRefs(setArrt),
      onChange,
      onEstimateTimeChange,
      lookDetaile,
      pageSizeChange,
      currentChange,
      resetFilter,
      getList,
      searchList,
      loadStatus,
      schedule,
      lookSourceInfoList,
      downLoadBhiPdf,
      exportBhiZipFile,
      exportZipFileByFront,
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

  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;
    .search-age {
      width: 355px;
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

      .item-title {
        width: 70px;
        text-align: right;
      }
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 10px;

    .organListStringText {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #5766fe;
      cursor: pointer;
    }
  }

  .t-pagination {
    margin-top: 10px;
  }

  ::v-deep(.t-pagination__total) {
    flex: none !important;
  }
  ::v-deep(.t-table__th-cell-inner) {
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #222222;
    line-height: 22px;
  }
  ::v-deep(.t-date-range-picker) {
    width: 354px !important;
    margin-left: 5px !important;
  }
  // ::v-deep(.t-input-number) {
  //   width: 136px !important;
  // }
  ::v-deep(.t-table thead tr) {
    background: #fafbfd;
  }
}
</style>
