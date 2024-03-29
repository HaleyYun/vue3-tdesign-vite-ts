<template>
  <div class="report-box">
    <div class="box-img" @click="handlerRest">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" />
        <t-button class="img-btn" theme="default" variant="text">产品详情</t-button>
      </div>
    </div>

    <div class="content-box">
      <div v-if="!isDetails" class="box-item">
        <t-button theme="primary" @click="addRow" size="large"
          ><template #icon><AddCircleIcon /></template>新增产品</t-button
        >
        <div class="item-right">
          <t-button theme="primary" @click="tipsForm" size="large">确定</t-button>
          <t-button class="add-item" variant="outline" theme="default" @click="outRest" size="large">取消</t-button>
        </div>
      </div>
      <div class="scroll">
        <div class="form-box" v-for="(item, index) in snForm.dataList" :key="item.key">
          <div class="form-box-line">
            <div v-if="isDisplay">
              <div v-if="posId">
                <div v-if="!item.id" style="margin-bottom: 15px">
                  <t-button theme="danger" size="large" @click="deletSnRow(index)">
                    <template #icon><DeleteIcon /></template>删除</t-button
                  >
                </div>
              </div>
              <div v-else>
                <t-button v-if="index != numSize - 1" theme="danger" size="large" @click="deletSnRow(index)">
                  <template #icon><DeleteIcon /></template>删除</t-button
                >
                <!-- <t-button theme="danger" size="large" @click="deletSnRow(index)">
                  <template #icon><DeleteIcon /></template>删除</t-button
                > -->
              </div>
            </div>
            <t-form colon class="form-item-box" ref="form" :data="snForm" :key="item.id">
              <div style="display: flex; justify-content: space-between">
                <!-- 左侧 -->
                <div style="width: 49%">
                  <t-form-item label="服务类型" requiredMark :prop="'dataList.' + index + '.serviceType'" name="serviceType">
                    <div style="color: #908e8e; font-weight: 400">{{ item.serviceType == 'book' ? '预约' : '服务' }}</div>
                  </t-form-item>
                  <t-form-item label="支付方式" requiredMark :prop="'dataList.' + index + '.paymentMethodList'" name="paymentMethodList">
                    <t-checkbox-group class="itemContent" disabled v-model="item.paymentMethodList" @change="onCheckbox(index, $event)">
                      <t-checkbox :value="1">线上支付</t-checkbox>
                      <t-checkbox :value="2">线下支付</t-checkbox>
                    </t-checkbox-group>
                  </t-form-item>
                  <t-form-item label="产品库存" requiredMark :prop="'dataList.' + index + '.stock'" name="stock">
                    <!-- :rules="[{ required: true, message: '此项必填' }]" -->
                    <t-input class="itemContent" :disabled="isDetails" v-model="item.stock" placeholder="请选择产品库存" @keyup="onStock(index)" />
                  </t-form-item>
                  <t-form-item label="单用户限制次数" requiredMark :prop="'dataList.' + index + '.checkCount'" name="checkCount">
                    <t-input-number :disabled="isDetails" style="width: 274px; margin-left: 25px" :min="0" :max="99999" @keyup="onKeyCount(index)" @change="onDayCount(index, $event)" type="number" v-model="item.checkCount" />次
                  </t-form-item>
                  <t-form-item label="产品备注" :prop="'dataList.' + index + '.productRemark'" name="productRemark">
                    <div>
                      <t-textarea class="itemContent" :disabled="isDetails" v-model="item.productRemark" :maxlength="100" :autosize="{ minRows: 4, maxRows: 6 }" placeholder=" " />
                    </div>
                  </t-form-item>
                  <t-form-item label="状态" :prop="'dataList.' + index + '.productRemark'" name="productStatus">
                    <t-switch :disabled="isDetails" v-model="item.status" :custom-value="[1, 0]" @change="getStatus(index, $event)" :key="index" />
                  </t-form-item>
                </div>
                <!-- 右侧 -->
                <div style="width: 49%">
                  <t-form-item label="服务产品" requiredMark :prop="'dataList.' + index + '.productCode'" name="productCode">
                    <t-select class="itemContent" :disabled="isDetails || item.id" v-model="item.productCode" :options="orgSelectData" @focus="focusSelect(index)" @change="typeSelectChange" placeholder="请选择服务产品" filterable />
                  </t-form-item>
                  <template v-if="isShow">
                    <!-- 渠道 -->
                    <t-form-item label="销售端口" requiredMark :prop="'dataList.' + index + '.showPortList'" name="showPortList">
                      <t-checkbox-group class="itemContent" :disabled="isDetails" v-model="item.showPortList" :options="itemOptions" name="groupItem" :dataId="index" @change="onCheckItem(index, $event)"> </t-checkbox-group>
                    </t-form-item>
                    <t-form-item label="渠道价格" requiredMark :prop="'dataList.' + index + '.channelPrice'" name="channelPrice">
                      <t-input class="itemContent" :disabled="isDetails" v-model="item.channelPrice" placeholder="请输入产品渠道价格" @change="onBlur(index)" @keyup="onKeyup(index)" :maxlength="5"></t-input>
                    </t-form-item>
                    <!-- 渠道 -->
                    <t-form-item label="年龄限定" :prop="'dataList.' + index + '.ageMin'" name="ageMin">
                      <t-input @change="onAgeMin(index)" @keyup="onCountMax(index)" placeholder="请输入年龄最小限定" :disabled="isDetails" style="width: 211px" v-model="item.ageMin" theme="normal" auto-width /><span class="to">~</span>
                      <t-input @change="onAgeMin(index)" @keyup="onAgeMax(index)" :disabled="isDetails" style="width: 211px" v-model="item.ageMax" theme="normal" placeholder="请输入年龄最大限定" auto-width />
                    </t-form-item>
                  </template>
                  <template v-else>
                    <t-form-item label="销售端口" requiredMark :prop="'dataList.' + index + '.showPortList'" name="showPortList">
                      <t-checkbox-group disabled v-model="item.showPortList" class="itemContent" :options="itemOptions" name="groupItem" @change="onCheckItem(index, $event)" :key="index"> </t-checkbox-group>
                    </t-form-item>
                    <t-form-item label="年龄限定" :prop="'dataList.' + index + '.ageMin'" name="ageMin">
                      <t-input @change="onAgeMin(index)" @keyup="onCountMax(index)" placeholder="请输入年龄最小限定" :disabled="isDetails" style="width: 211px" v-model="item.ageMin" theme="normal" auto-width /><span class="to">~</span>
                      <t-input @change="onAgeMin(index)" @keyup="onAgeMax(index)" placeholder="请输入年龄最大限定" :disabled="isDetails" style="width: 211px" v-model="item.ageMax" theme="normal" auto-width />
                    </t-form-item>
                  </template>
                  <t-form-item v-if="item.checkCount > 1" label="间隔时间" :prop="'dataList.' + index + '.checkInterval'" name="checkInterval">
                    <t-input-number :disabled="isDetails" style="width: 274px" :min="0" :max="99999" type="number" @keyup="onKeyDay(index)" @change="onCheckInterval(index, $event)" v-model="item.checkInterval" />天</t-form-item
                  >
                  <template v-if="!isShow">
                    <t-form-item label="营销活动" :prop="'dataList.' + index + '.marketingActivityFlag'" name="marketingActivityFlag">
                      <t-radio-group @change="onRadioItem(index, $event)" v-model="item.marketingActivityFlag">
                        <t-radio :value="0">否</t-radio>
                        <t-radio :value="1">是</t-radio>
                      </t-radio-group>
                    </t-form-item>
                    <div style="padding-bottom: 15px; color: #f00606">注：若设定服务产品为营销活动则该服务产品C端并不显示，且需配置活动价格</div>
                    <t-form-item requiredMark v-if="item.marketingActivityFlag == 1" label="活动价格" :prop="'dataList.' + index + '.activityPrice'" name="activityPrice">
                      <t-input class="itemContent" v-model="item.activityPrice" @change="onPriceBlur(index)" @keyup="onPriceKeyup(index)" placeholder="请输入活动价格" :maxlength="5"></t-input>
                    </t-form-item>
                    <t-form-item label="C端是否展示" :prop="'dataList.' + index + '.liteShow'" name="liteShow">
                      <t-radio-group v-model="item.liteShow">
                        <t-radio :value="1">是</t-radio>
                        <t-radio :value="0">否</t-radio>
                      </t-radio-group>
                    </t-form-item>
                  </template>

                  <div v-if="isShow" class="institution">
                    <t-form-item class="form-institution" label="选择机构" requiredMark :prop="'dataList.' + index + '.sn'" name="serviceType">
                      <div class="edit">
                        <div class="edit-btn" @click="goEdit(index)">
                          <div class="btn" theme="default" variant="text">{{ isDetails ? '去查看' : '去修改' }}</div>
                        </div>
                        <div class="edit-select">
                          <div class="btn" theme="default" variant="text">当前已选择{{ item.organNumList?.length }}/{{ logTotal || 0 }}</div>
                        </div>
                      </div>
                    </t-form-item>
                  </div>
                </div>
              </div>
            </t-form>
          </div>
        </div>
      </div>
    </div>
    <t-dialog placement="center" class="add-Model" :closeBtn="false" :closeOnOverlayClick="false" destroy-on-Close width="1200px" v-model:visible="visibleLog" :footer="false">
      <img @click="artBack" class="dialog-img" src="../../assets/img/knowledge/cout.png" />
      <div class="search-box">
        <div class="search-item">机构名称:<t-input class="ipt-slt" clearable v-model="titleLogData.organName" auto-width placeholder="请输入机构名称" /></div>
        <div class="search-item">分类:<t-select class="ipt-slt" clearable v-model="titleLogData.type" :options="proNameOption" placeholder="请选择分类"></t-select></div>
        <div class="search-item">状态:<t-select class="ipt-slt" clearable v-model="titleLogData.enable" :options="enableOption" placeholder="请选择状态"></t-select></div>
        <t-button class="search-item" theme="primary" @click="searchItem"> 搜索 </t-button>
        <t-button variant="outline" theme="primary" @click="rest">重置条件</t-button>
      </div>
      <div class="paginationTable" style="height: 350px">
        <t-table :data="logData" stripe lazy-load row-key="organNum" v-model:selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange" :columns="(logColumns as PrimaryTableCol<TableRowData>[])" :bordered="false" size="medium" hover table-layout="fixed">
          <template #importStatus="{ row }">
            <div>
              {{ row.phone }}
            </div>
          </template>
          <template #importDate="{ row }">
            <div>
              {{ row.type == '001' ? '医院' : '保险' }}
            </div>
          </template>
          <template #enable="{ row }">
            <div style="color: #24c07b; font-weight: 400" v-if="row.enable == 1">启用</div>
            <div style="color: #f00606; font-weight: 400" v-else>禁用</div>
          </template>
        </t-table>
      </div>

      <div class="paginationName">
        <t-pagination :pageSize="searchLogData.pageSize" :total="total" v-model:current="searchLogData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
      <div class="btn-commit" v-if="!isDetails">
        <t-button class="clear-item" variant="outline" theme="primary" style="margin-left: 20px" type="reset" @click="artBack">取消</t-button>
        <t-button class="confirm-item" theme="primary" @click="artChange">确定</t-button>
      </div>
    </t-dialog>
    <div class="mask-box" v-if="visible">
      <div class="content-boxMask">
        <h2>提示</h2>
        <p>{{ visibleTitle }}</p>
        <div class="btn-box">
          <button @click="visible = false">取消</button>
          <button @click="onConfirm">确定</button>
        </div>
      </div>
    </div>
    <div class="mask-box" v-if="showVisible">
      <div class="content-boxMask">
        <h2>提示</h2>
        <p>提交后本次服务产品将不可修改~</p>
        <div class="btn-box">
          <button @click="showVisible = false">取消</button>
          <button @click="submitForm">确定</button>
        </div>
      </div>
    </div>
    <t-dialog header="提醒" v-model:visible="visibleStatus" :closeOnOverlayClick="false" :closeBtn="false" destroy-on-Close @confirm="submitStatus" :on-cancel="onCancel">
      <p>确认要下架吗？下架后，销售端口将不可见该产品</p>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin, PrimaryTableCol, TableRowData, SwitchValue, SelectOptions, FormRules, Data } from 'tdesign-vue-next';
import { debounce } from '../../utils/tools';
import { AddCircleIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import { getEstimateOrder, getProductSelect, addProductSelect, editProductSelect, findProdById } from '../../request/modules/EstimateApi';
import { values } from 'lodash';
const router = useRouter();
const route = useRoute();
const checked = ref(true);
const visibleLog = ref<boolean>(false);
const visibleTitle = ref<string>('内容还没有保存，确定要离开吗？');
const orgDataNum = ref<any>(null); // 1 渠道编辑  2 渠道新增 3 平台新增 4平台编辑 5详情
const visible = ref<boolean>(false); //取消未保存
const visibleStatus = ref<boolean>(false); //状态弹窗
const showVisible = ref<boolean>(false); //确定提交二次提示
const selectedRowKeys = ref<any>([]);
const isShow = ref<boolean>(false);
const isDetails = ref<boolean>(false);
const orgSelectData = ref<any>([]);

const posName = ref<any>('');
const source = ref<any>('');
const status = ref<any>('');
const rowName = ref<any>('');
const posId = ref<any>('');
const checkedItem = ref([]);
const itemOptions = ref<any>([
  { label: '小程序', value: 'APPLET' },
  { label: 'pro端', value: 'PAD' },
  { label: 'H5端', value: 'H5' }
]);
onMounted(() => {
  //渠道新增
  if (route.query.source == '1' && route.query.rowName) {
    posName.value = route.query.posName;
    console.log('渠道新增');
    orgDataNum.value = 2;
    isShow.value = true;
    isDetails.value = false;
    source.value = route.query.source;
    status.value = route.query.status;
    rowName.value = route.query.rowName;
    selectStatus(); //选中状态
    selectOrgData();
    getInstitutionList();
  } else if (route.query.posName && route.query.posId && !route.query.details) {
    posId.value = route.query.posId;
    findProdByIdData();
    console.log('渠道编辑');
    orgDataNum.value = 1;
    isShow.value = true;
    isDetails.value = false;
    posName.value = route.query.posName;
    source.value = route.query.type;

    rowName.value = route.query.newName;
    // selectStatus();//选中状态
    selectOrgData();
    getInstitutionList();
  } else if (route.query.source == '2') {
    console.log('平台新增');
    orgDataNum.value = 3;
    isShow.value = false;
    isDetails.value = false;
    source.value = route.query.source;
    status.value = route.query.status;
    rowName.value = route.query.rowName;
    selectStatus(); //选中状态
    selectOrgData();
    getInstitutionList();
  } else if (route.query.posName == '' && route.query.posId && !route.query.details) {
    console.log('平台编辑');
    source.value = route.query.type;
    findProdByIdData();
    orgDataNum.value = 4;
    isShow.value = false; //是渠道还是平台
    isDetails.value = false;
    posId.value = route.query.posId;
    rowName.value = route.query.newName;
    // selectStatus();//选中状态
    selectOrgData();
    getInstitutionList();
  } else if (route.query.details && route.query.posId) {
    console.log('详情');
    orgDataNum.value = 5;
    if ((orgDataNum.value = 5 && route.query.posId && route.query.type == '2')) {
      isShow.value = false;
    } else {
      isShow.value = true;
    }
    isDetails.value = true;

    posName.value = route.query.posName;
    source.value = route.query.type;
    posId.value = route.query.posId;
    findProdByIdData();
    // selectStatus();

    selectOrgData();
    getInstitutionList();
  }
  getRowKeys();
});
const searchLogData = ref<any>({
  channelCode: route.query.posName,
  organName: '',
  enable: '',
  type: '',
  pageNum: 1,
  pageSize: 50
});
const titleLogData = ref<any>({
  // channelCode: 'JY_QD_001',
  channelCode: route.query.posName,
  organName: '',
  enable: '',
  type: '',
  pageNum: 1,
  pageSize: 50
});

const sourceId = ref<string>('');

const logColumns = ref([
  {
    colKey: 'row-select',
    type: 'multiple',

    checkProps: (data: any) => ({ disabled: isDetails.value }),
    width: 50
  },
  // checkProps: (data: any) => ({ disabled: data.row.sendStatus == '2' ? false : true }) },
  { colKey: 'organNum', title: '机构编码' },
  { colKey: 'organName', title: '机构名称' },
  { colKey: 'phone', title: '机构联系电话', slots: { customRender: 'importStatus' } },
  { colKey: 'importDate', title: '机构分类', slots: { customRender: 'importDate' } },
  {
    colKey: 'enable',
    title: '状态',
    slots: { customRender: 'enable' }
  }
]);

const logData = ref([]);
const total = ref<any>('');
const proNameOption = ref<any>([
  { label: '医院', value: '001' },
  { label: '保险', value: '002' }
]);

const enableOption = ref<any>([
  { label: '启动', value: 1 },
  { label: '禁用', value: 0 }
]);

const numSize = ref<number>(0);
const selectedItemKeys = ref<any>([]);
const dataListNum = ref<any>(0);
const data = reactive<any>({
  snForm: {
    channelCode: '',
    channelName: '',
    status: 0,
    type: 0,
    dataList: [
      {
        dataId: 0,
        serviceType: '', //服务类型
        productName: '', //服务产品
        productCode: '', //服务编码
        paymentMethodList: [], //支付方式
        showPortList: [], //销售端
        stock: '', //产品库存
        channelPrice: '', //渠道价格
        productRemark: '', //产品备注
        ageMin: '', //年龄限定
        ageMax: '', //年龄限定
        organNumList: selectedItemKeys.value, //选择机构
        checkCount: 1,
        checkInterval: '',
        status: 1,
        marketingActivityFlag: 0, //营销活动
        activityPrice: '', //活动价格
        prodPrice: '', //产品价格
        liteShow: 0 //是否C端展示
      }
    ]
  }
});
const { snForm } = toRefs(data);
const checkTypeList = ref<any>([]);
const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
  selectedRowKeys.value = RowKeys;
  checkTypeList.value = options.selectedRowData;
  console.log(selectedRowKeys.value, 'selectedRowKeys');
};
//后退
const handlerRest = () => {
  router.go(-1);
};
//新增

// var num = 1;
const isDisplay = ref<boolean>(false);
const addRow = debounce(
  () => {
    console.log(dataListNum.value, 'dataListNum.value');

    // dataListNum.value = dataListNum.value - 1 < 0 ? 0 : dataListNum.value - 1;
    //渠道编辑
    if (orgDataNum.value == 1 || orgDataNum.value == 2) {
      console.log('渠道');

      //判断如果有两个年龄都有
      if (snForm.value.dataList[0].ageMin && snForm.value.dataList[0].ageMax) {
        if (snForm.value.dataList[0].ageMin > snForm.value.dataList[0].ageMax) {
          MessagePlugin.error('年龄最小值不能大于最大值');
          return;
        }
      }

      if (snForm.value.dataList[0].organNumList == '') {
        MessagePlugin.error('机构不能为空');
        return;
      }
      if (
        snForm.value.dataList[0].channelPrice &&
        snForm.value.dataList[0].organNumList &&
        snForm.value.dataList[0].paymentMethodList.length > 0 &&
        snForm.value.dataList[0].productCode &&
        snForm.value.dataList[0].stock &&
        snForm.value.dataList[0].showPortList &&
        snForm.value.dataList[0].checkCount
      ) {
        snForm.value.dataList.unshift({
          dataId: dataListNum.value,
          serviceType: orgDataNum.value == 2 || orgDataNum.value == 1 || isShow.value ? 'book' : 'tc', //服务类型
          productName: '', //服务产品
          productCode: '', //服务编码
          paymentMethodList: [], //支付方式
          showPortList: [], //销售端口
          stock: '', //产品库存
          channelPrice: '', //渠道价格
          checkCount: 1,
          checkInterval: '',
          status: 1,
          productRemark: '', //产品备注
          ageMin: '', //年龄限定
          ageMax: '', //年龄限定
          organNumList: selectedItemKeys.value, //选择机构
          marketingActivityFlag: 0,
          liteShow: 0, //是否C端展示
          activityPrice: '' //活动价格
        });
        dataListNum.value = dataListNum.value + 1;
      } else {
        MessagePlugin.error('请先完善当前产品');
      }
    } else {
      if (snForm.value.dataList[0].activityPrice > snForm.value.dataList[0].prodPrice) {
        MessagePlugin.error('活动价格不能大于产品价格');
        return;
      }
      //判断如果有两个年龄都有
      if (snForm.value.dataList[0].ageMin && snForm.value.dataList[0].ageMax) {
        if (snForm.value.dataList[0].ageMin > snForm.value.dataList[0].ageMax) {
          MessagePlugin.error('年龄最小值不能大于最大值');
          return;
        }
      }
      //平台
      if (snForm.value.dataList[0].paymentMethodList.length > 0 && snForm.value.dataList[0].productCode && snForm.value.dataList[0].stock && snForm.value.dataList[0].showPortList && snForm.value.dataList[0].checkCount) {
        snForm.value.dataList.unshift({
          dataId: dataListNum.value,
          serviceType: orgDataNum.value == 2 || orgDataNum.value == 1 || isShow.value ? 'book' : 'tc', //服务类型
          productName: '', //服务产品
          productCode: '', //服务编码
          paymentMethodList: [1], //支付方式
          showPortList: ['APPLET'], //销售端口
          stock: '', //产品库存
          channelPrice: '', //渠道价格
          productRemark: '', //产品备注
          checkCount: 1,
          checkInterval: '',
          status: 1,
          ageMin: '', //年龄限定
          ageMax: '', //年龄限定
          organNumList: selectedItemKeys.value, //选择机构
          marketingActivityFlag: 0,
          liteShow: 0,
          activityPrice: '', //活动价格
          prodPrice: '' //产品价格
        });
        dataListNum.value = dataListNum.value + 1;
      } else {
        MessagePlugin.error('请先完善当前产品');
      }
    }
    console.log('新增的index', dataListNum.value);
    numSize.value = snForm.value.dataList.length;
    isDisplay.value = true;
    selectStatus();
  },
  300,
  false
);
//删除
const deletSnRow = index => {
  dataListNum.value = index;

  console.log('删除的index', dataListNum.value);

  if (snForm.value.dataList.length > 1) {
    snForm.value.dataList.splice(dataListNum.value, 1);

    dataListNum.value = dataListNum.value - 1 < 0 ? 0 : dataListNum.value - 1;
    console.log('if删除后的index', dataListNum.value);
    numSize.value = snForm.value.dataList.length;
  }
};
//去修改
const goEdit = index => {
  // console.log(index, 'index');
  // console.log('修改的');
  dataListNum.value = index;
  // console.log('去修改', 'id', dataListNum.value, '表单取的', snForm.value.dataList[dataListNum.value].organNumList);
  // searchLogData.value = {
  //   channelCode: route.query.posName,
  //   employeeName: '',
  //   importStatus: '',
  //   type: '',
  //   pageNum: 1,
  //   pageSize: 50
  // };
  // titleLogData.value = {
  //   channelCode: route.query.posName,
  //   employeeName: '',
  //   type: '',
  //   importStatus: '',
  //   pageNum: 1,
  //   pageSize: 50
  // };
  // getInstitutionList();
  // selectStatus();
  selectedRowKeys.value = snForm.value.dataList[dataListNum.value].organNumList;
  visibleLog.value = true;
};
const artBack = () => {
  // snForm.value.dataList[dataListNum.value].id = dataListNum.value; //id
  // snForm.value.dataList[dataListNum.value].organNumList = selectedRowKeys.value; // 选中
  visibleLog.value = false;
};
//确定
const artChange = () => {
  snForm.value.dataList[dataListNum.value].dataId = dataListNum.value; //id
  snForm.value.dataList[dataListNum.value].organNumList = selectedRowKeys.value; // 选中
  console.log(snForm.value.dataList[dataListNum.value], 'snForm.value');

  console.log('id', dataListNum.value, '表单存的', snForm.value.dataList[dataListNum.value].organNumList);
  // getInstitutionList();
  visibleLog.value = false;
};

//查询
const searchItem = () => {
  searchLogData.value = Object.assign(searchLogData.value, titleLogData.value);
  searchLogData.value.pageNum = 1;
  getInstitutionList();
};
//重置
const rest = () => {
  searchLogData.value = {
    channelCode: route.query.posName,
    employeeName: '',
    importStatus: '',
    type: '',
    pageNum: 1,
    pageSize: 50
  };
  titleLogData.value = {
    channelCode: route.query.posName,
    employeeName: '',
    type: '',
    importStatus: '',
    pageNum: 1,
    pageSize: 50
  };
  getInstitutionList();
};
//分页
const pageSizeChange = (pageSize: any) => {
  searchLogData.value.pageSize = pageSize;

  getInstitutionList();
};
const currentChange = (current: number) => {
  searchLogData.value.pageNum = current;
  getInstitutionList();
};

let theOldData = '';
//列表
const getInstitutionList = () => {
  getEstimateOrder(searchLogData.value as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      logData.value = res.data.data
        ? res.data.data.map((item: any) => {
            return {
              ...item
            };
          })
        : [];
      total.value = res.data.total || '';

      if (orgDataNum.value == 3 || orgDataNum.value == 4 || !isShow) {
        console.log('444');
        snForm.value.dataList[dataListNum.value].showPortList = ['APPLET'];
        snForm.value.dataList[dataListNum.value].serviceType = 'tc';
        snForm.value.dataList[dataListNum.value].paymentMethodList = [1];
      } else {
        snForm.value.dataList[dataListNum.value].serviceType = 'book';
      }
    }
  });
};
// 选中状态
const selectStatus = () => {
  getEstimateOrder(searchLogData.value as any).then((res: any) => {
    if (res.code == 200) {
      //接口正常
      let RowKeys = res.data.data
        .filter(item => item.enable == 1)
        .map(item => {
          return {
            organNum: item.organNum
          };
        });
      let newArr = RowKeys.map(item => {
        let curKey = Object.keys(item);
        return item[curKey[0]];
      });
      selectedItemKeys.value = newArr; //已选中的
      console.log(selectedItemKeys.value, 'selectedItemKeys.value ');

      snForm.value.dataList[0].organNumList = selectedItemKeys.value;
    }
  });
};
//总条数
const logTotal = ref<any>('');
const getRowKeys = () => {
  getEstimateOrder(searchLogData.value as any).then((res: any) => {
    if (res.code == 200) {
      logTotal.value = res.data.total || '';
    }
  });
};
//服务产品
const selectOrgData = () => {
  let data = {
    channelCode: posName.value,
    // channelCode: 'JY_QD_001',
    pageNum: 1,
    pageSize: 99,
    type: source.value
  };
  getProductSelect(data).then((res: any) => {
    if (res.code === 200) {
      orgSelectData.value = res.data.map((item: any) => {
        return {
          label: item.prodName,
          value: item.prodCode,
          disabled: item.isChoosed,
          prodPrice: item.prodPrice
        };
      });
    }
  });
};
//根据id单条查询
const findProdByIdData = () => {
  let data = {
    id: route.query.posId
  };
  findProdById(data).then((res: any) => {
    if (res.code === 200) {
      snForm.value = res.data;
      dataListNum.value = res.data.dataList.length - 1;
      theOldData = JSON.stringify(snForm.value.dataList);
    }
  });
};
//获取下标
const focusSelect = val => {
  dataListNum.value = val;
};
const typeSelectChange = (value: any, context: any) => {
  sourceId.value = value;
  dataListNum.value;
  console.log(dataListNum.value, 'index');
  console.log(value, 'value');
  console.log(context, 'context');
  snForm.value.dataList[dataListNum.value].productName = context.selectedOptions[0].label; // 选中
  snForm.value.dataList[dataListNum.value].prodPrice = context.selectedOptions[0].prodPrice;
};
//确定
const submitForm = debounce(
  () => {
    console.log(snForm.value);
    snForm.value.channelCode = posName.value;
    snForm.value.status = status.value;
    snForm.value.type = source.value;
    snForm.value.channelName = rowName.value;
    if (posId.value) {
      editProductSelect(snForm.value).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('编辑成功');
          getInstitutionList();
          router.go(-1);
        } else {
          // MessagePlugin.success(res.msg);
        }
      });
    } else {
      addProductSelect(snForm.value).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('添加成功');
          getInstitutionList();
          router.go(-1);
        } else {
          // MessagePlugin.success(res.msg);
        }
      });
    }
  },
  300,
  false
);
//取消未保存
const outRest = () => {
  let newData = JSON.stringify(snForm.value.dataList);
  console.log(newData == theOldData);
  if (newData == theOldData) {
    router.go(-1);
  } else {
    visible.value = true;
  }
};
const onConfirm = () => {
  router.go(-1);
};

const tipsForm = () => {
  // if(tipsFormInternal(0) &&
  // tipsFormInternal(dataListNum.value)){
  //   showVisible.value = true;
  // };
  let commit = true;
  for (let i = 0; i < snForm.value.dataList.length; i++) {
    // const eleient = snForm.value.dataList[i];
    commit = commit && tipsFormInternal(i);
  }
  showVisible.value = commit;
};

//确定二次提示
const tipsFormInternal = (index: number) => {
  console.log('dataListNum', index);
  //渠道新增 或 编辑
  if (orgDataNum.value == 2 || orgDataNum.value == 1) {
    console.log('渠道');
    console.log('index', index);
    //判断如果有两个年龄都有
    if (snForm.value.dataList[index].ageMin && snForm.value.dataList[index].ageMax) {
      if (snForm.value.dataList[index].ageMin > snForm.value.dataList[index].ageMax) {
        MessagePlugin.error('年龄最小值不能大于最大值');
        return false;
      }
    }
    if (snForm.value.dataList[index].channelPrice == '') {
      MessagePlugin.error('请输入渠道价格');
      return false;
    }

    if (snForm.value.dataList[index].organNumList == '') {
      MessagePlugin.error('机构不能为空');
      return false;
    }
    if (snForm.value.dataList[index].paymentMethodList == '') {
      MessagePlugin.error('请选择支付方式');
      return false;
    }
    if (snForm.value.dataList[index].productCode == '') {
      MessagePlugin.error('请选择服务产品');
      return false;
    }
    if (snForm.value.dataList[index].stock === '') {
      MessagePlugin.error('请输入产品库存');
      return false;
    }
    if (snForm.value.dataList[index].showPortList == '') {
      MessagePlugin.error('请选择销售端口');
      return false;
    }
  }
  //平台新增 或 编辑
  if (orgDataNum.value == 3 || orgDataNum.value == 4) {
    if (snForm.value.dataList[index].activityPrice > snForm.value.dataList[index].prodPrice) {
      MessagePlugin.error('活动价格不能大于产品价格');
      return false;
    }
    if (snForm.value.dataList[index].marketingActivityFlag == 1) {
      if (snForm.value.dataList[index].activityPrice == '') {
        MessagePlugin.error('营销活动为是时活动价格不能为空');
        return false;
      }
    }
    console.log('平台');
    //判断如果有两个年龄都有
    if (snForm.value.dataList[index].ageMin && snForm.value.dataList[index].ageMax) {
      if (snForm.value.dataList[index].ageMin > snForm.value.dataList[index].ageMax) {
        MessagePlugin.error('年龄最小值不能大于最大值');
        return false;
      }
    }
    if (snForm.value.dataList[index].paymentMethodList == '') {
      MessagePlugin.error('请选择支付方式');
      return false;
    }
    if (snForm.value.dataList[index].productCode == '') {
      MessagePlugin.error('请选择服务产品');
      return false;
    }
    if (snForm.value.dataList[index].stock == '') {
      MessagePlugin.error('请输入产品库存');
      return false;
    }
    if (snForm.value.dataList[index].showPortList == '') {
      MessagePlugin.error('请选择销售端口');
      return false;
    }
  }
  if (snForm.value.dataList[index].checkCount === undefined) {
    MessagePlugin.error('请填写单用户限制次数');
    return false;
  }
  if (snForm.value.dataList[index].checkCount == '') {
    MessagePlugin.error('单用户限制次数不可为0');
    return false;
  }
  if (snForm.value.dataList[index].checkCount < 0 || snForm.value.dataList[index].checkCount > 99999) {
    MessagePlugin.error('单用户限制次数需大于等于1且最大99999');
    return false;
  }
  if (snForm.value.dataList[index].checkInterval < -1 || snForm.value.dataList[index].checkInterval > 365) {
    MessagePlugin.error('间隔时间需大于0且最大365');
    return false;
  }
  return true;
};

//年龄
const onAgeMin = val => {
  dataListNum.value = val;

  if (snForm.value.dataList[dataListNum.value].ageMin < 0 || snForm.value.dataList[dataListNum.value].ageMin > 99) {
    snForm.value.dataList[dataListNum.value].ageMin = '';
  }
  if (snForm.value.dataList[dataListNum.value].ageMax < 0 || snForm.value.dataList[dataListNum.value].ageMax > 99) {
    snForm.value.dataList[dataListNum.value].ageMax = '';
  }
};
const onCountMax = val => {
  dataListNum.value = val;
  snForm.value.dataList[dataListNum.value].ageMin = snForm.value.dataList[dataListNum.value].ageMin.replace(/[^\d]/g, '');
};
const onAgeMax = val => {
  dataListNum.value = val;

  snForm.value.dataList[dataListNum.value].ageMax = snForm.value.dataList[dataListNum.value].ageMax.replace(/[^\d]/g, '');
};
//库存校验
const onStock = value => {
  dataListNum.value = value;
  snForm.value.dataList[dataListNum.value].stock = snForm.value.dataList[dataListNum.value].stock.replace(/[^\d]/g, '');
  console.log(typeof snForm.value.dataList[dataListNum.value].stock);
};
//次数
const onKeyCount = val => {
  dataListNum.value = val;
  if (snForm.value.dataList[dataListNum.value].checkCount === undefined) {
    MessagePlugin.error('单用户限制次数不能为空');
    snForm.value.dataList[dataListNum.value].checkCount = '';
  } else {
    snForm.value.dataList[dataListNum.value].checkCount = snForm.value.dataList[dataListNum.value].checkCount.toString().replace(/^(0+)|[^\d]+/g, '');
  }
};
const onDayCount = (value, $event) => {
  dataListNum.value = value;
  snForm.value.dataList[dataListNum.value].checkCount = $event;

  if ($event == 1) {
    snForm.value.dataList[dataListNum.value].checkInterval = '';
  }
  if ($event == -1) {
    snForm.value.dataList[dataListNum.value].checkCount = 1;
  }
};
//天数
const onCheckInterval = (value, $event) => {
  dataListNum.value = value;
  if ($event == -1) {
    snForm.value.dataList[dataListNum.value].checkInterval = 0;
  }
};
const onKeyDay = val => {
  dataListNum.value = val;
  if (snForm.value.dataList[dataListNum.value].checkInterval === undefined) {
    snForm.value.dataList[dataListNum.value].checkInterval = '';
  } else {
    snForm.value.dataList[dataListNum.value].checkInterval = snForm.value.dataList[dataListNum.value].checkInterval.toString().replace(/^(0+)|[^\d]+/g, '');
  }
};

//状态
const getStatus = (val: any, $event) => {
  dataListNum.value = val;
  if (!$event) {
    visibleStatus.value = true;
    // console.log($event, 'event');
    snForm.value.dataList[dataListNum.value].status = 1;
  } else {
    snForm.value.dataList[dataListNum.value].status = $event;
  }
};
//渠道价格
const onBlur = val => {
  console.log(val);
  dataListNum.value = val;
  snForm.value.dataList[dataListNum.value].channelPrice = snForm.value.dataList[dataListNum.value].channelPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
const onKeyup = val => {
  dataListNum.value = val;
  snForm.value.dataList[dataListNum.value].channelPrice = snForm.value.dataList[dataListNum.value].channelPrice.replace(/[^(\d||.)]/g, '');
};
//活动价格
const onPriceBlur = val => {
  console.log(val);
  dataListNum.value = val;
  snForm.value.dataList[dataListNum.value].activityPrice = snForm.value.dataList[dataListNum.value].activityPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
const onPriceKeyup = val => {
  dataListNum.value = val;
  snForm.value.dataList[dataListNum.value].activityPrice = snForm.value.dataList[dataListNum.value].activityPrice.replace(/[^(\d||.)]/g, '');
};
//销售渠道
const onCheckItem = (checked, $event) => {
  dataListNum.value = checked;
  if (($event.includes('APPLET') && !$event.includes('H5')) || !$event.includes('PAD')) {
    snForm.value.dataList[dataListNum.value].paymentMethodList = [1];
  }
  if ($event.length == 0) {
    snForm.value.dataList[dataListNum.value].paymentMethodList = [];
  }
  if (!$event.includes('APPLET') && ($event.includes('H5') || $event.includes('PAD'))) {
    snForm.value.dataList[dataListNum.value].paymentMethodList = [2];
  }
  if ($event.includes('APPLET') && ($event.includes('H5') || $event.includes('PAD'))) {
    snForm.value.dataList[dataListNum.value].paymentMethodList = [1, 2];
  }
  snForm.value.dataList[dataListNum.value].showPortList = $event;
};
//营销活动
const onRadioItem = (checked, $event) => {
  console.log(checked, 'checked');
  console.log($event, ' $event');
  dataListNum.value = checked;
  if (snForm.value.dataList[dataListNum.value].marketingActivityFlag == 0) {
    snForm.value.dataList[dataListNum.value].activityPrice = '';
  }
};

//支付方式
const onCheckbox = (value, $event) => {
  dataListNum.value = value;
  snForm.value.dataList[dataListNum.value].paymentMethodList = $event;
  console.log(snForm.value.dataList);
};
//确定下架
const submitStatus = () => {
  snForm.value.dataList[dataListNum.value].status = 0;
  visibleStatus.value = false;
};

const onCancel = () => {
  snForm.value.dataList[dataListNum.value].status = 1;
  visibleStatus.value = false;
};
</script>

<style lang="scss" scoped>
.report-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .box-item {
    border-radius: 8px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    position: fixed;
    z-index: 999;
    width: calc(100% - 310px);
    top: 118px;
    flex: 0 0 auto;
    padding: 10px;
    transition: width 0.2s;
  }

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;

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
  .content-box {
    padding: 10px;
    box-sizing: border-box;
    border-radius: 16px;
    margin-top: 70px;

    .form-box {
      display: flex;
      justify-content: space-between;
      background: #fff;
      border-radius: 16px;
      padding: 20px 20px 20px 32px;
      margin-bottom: 16px;
      .form-box-line {
        width: 100%;
        .itemContent {
          width: 443px;
        }
        .to {
          margin: 0 6px;
        }
      }
    }
    .add-item {
      margin-left: 40px;
    }
  }
  .institution {
    // display: flex;
    // align-items: center;
    // justify-content: right;
    .form-institution {
      width: 500px;
    }
    .edit {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .edit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 38px;
        background: #3d7eff;
        border-radius: 8px;
        .btn {
          width: 48px;
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 22px;
          cursor: pointer;
        }
      }
    }
  }
  .btn-commit {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .clear-item {
      width: 162px;
      height: 54px;
      border: none;
      border-radius: 27px;
      background: #f5f8fd;
      font-size: 18px;
      font-weight: bold;
      margin-right: 84px;
    }

    .confirm-item {
      background: #3d7eff;
      width: 162px;
      height: 54px;
      border: none;
      border-radius: 27px;
      font-size: 18px;
      font-weight: bold;
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

    .content-boxMask {
      width: 444px;
      height: 258px;
      background: #ffffff;
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
        padding-bottom: 39px;
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
            color: #3d7eff;
            background: #f5f8fd;
            margin-right: 28px;
          }

          &:nth-child(2) {
            color: #ffffff;
            background: #3d7eff;
            margin-left: 28px;
          }
        }
      }
    }
  }
  .add-Model {
    position: relative;
    .dialog-img {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 10px;
      top: 9px;
    }
  }
  ::v-deep(.t-input--auto-width) {
    width: 120px;
  }

  .paginationName {
    margin-top: 20px;
  }

  .paginationTable {
    overflow-y: auto;
  }

  .formDataList {
    overflow-y: scroll;
    overflow-y: auto;
    height: 100%;
    padding: 25px 0;
  }
  /*滚动条大小*/
  .scroll::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  /*正常情况下滑块的样式*/
  .scroll::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
  }
  /*鼠标悬浮在该类指向的控件上时滑块的样式*/
  .scroll:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
  }
  /*鼠标悬浮在滑块上时滑块的样式*/
  .scroll::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
  }
  /*正常时候的主干部分*/
  .scroll::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0);
    background-color: white;
  }
  /*鼠标悬浮在滚动条上的主干部分*/
  .scroll::-webkit-scrollbar-track:hover {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.01);
  }
}
</style>
