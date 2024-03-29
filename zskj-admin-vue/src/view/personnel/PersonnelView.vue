<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item">员工名称：<t-input class="item-slt" clearable v-model="titleData.name" auto-width /></div>
      <div class="search-item">PRO权限：<t-select class="item-slt" clearable v-model="titleData.enable" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item">小程序营销权限：<t-select class="item-slt" clearable v-model="titleData.appletMarketingPermissions" :options="programOption" placeholder="请选择"></t-select></div>
      <div class="search-item">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;岗位：<t-select class="item-slt" clearable v-model="titleData.positionId" :options="personnelLabel" placeholder="请选择"></t-select></div>
      <div class="search-item">员工状态：<t-select class="item-slt" clearable v-model="titleData.status" :options="proOptionStatus" placeholder="请选择"></t-select></div>

      <div class="search-item">绑定设备：<t-select class="item-slt" clearable v-model="titleData.bindDeviceSwitch" :options="proOptionSwitch" placeholder="请选择"></t-select></div>
      <div class="search-item">&nbsp;&nbsp;&nbsp;设备号：<t-input class="item-slt" clearable v-model="titleData.bindDeviceId" auto-width /></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="set">重置</t-button>
      <div class="operate-box">
        <div class="box-item">
          <t-button theme="primary" @click="addLoad">
            <template #icon> <AddIcon /> </template>新增
          </t-button>
          <div class="operate-box-left">
            <t-upload class="upload-box" :auto-upload="true" :action="uploadExcelUrl" allowUploadDuplicateFile accept=".xls,.xlsx" :headers="headers" v-model="files" theme="custom" @fail="handleFail" @success="succUpload">
              <t-button class="btn-item" :loading="isLoading">
                <template #icon>
                  <AddIcon />
                </template>
                导入员工
              </t-button>
            </t-upload>
          </div>

          <t-button class="btn-item" theme="primary" @click="download"><DownloadIcon /> 下载导入模板 </t-button>
        </div>
        <t-button class="btn-item" theme="primary" @click="addLog">导入日志</t-button>
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :data="data" :max-height="fixedTopRows ? 1400 : 360" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #birthDate="{ row }">
          <div>
            {{ row.birthDate ? row.birthDate.substr(0, 10) : null }}
          </div>
          <!-- <span v-if="row.birthDate!='Invalid Date'">{{ row.birthDate }} </span>
          <span v-else>--</span> -->
        </template>
        <template #appletMarketingPermissions="{ row }">
          <div>
            {{ row.appletMarketingPermissions === 1 ? '启用' : '禁用' }}
          </div>
        </template>
        <template #auth="{ row }">
          <t-switch v-model="row.enable" :customValue="[1, 0]" @change="(value: SwitchValue) => getResetEnable(row, value as number)" :key="row.id" />
        </template>
        <template #bindDeviceSwitch="{ row }">
          <t-switch :value="row.bindDeviceSwitch" :customValue="[1, 0]" @change="(value: SwitchValue) => setSwitch(row, value as number)" :key="row.id" />
        </template>
        <template #nameStatus="{ row }">
          <t-switch :value="row.status" :customValue="[0, 1]" @change="(value: SwitchValue) => setStatus(row, value as number)" :key="row.id" />
          <!-- <span>{{ row.status == 0 ? '启用' : '禁用' }}</span> -->
        </template>
        <template #action="{ row }">
          <t-button size="small" variant="text" @click="edit(row.id)" theme="success"> 编辑</t-button>
          <t-popconfirm content="确认重置此用户的密码吗" theme="warning" @click.stop @confirm="passwordHandle(row.id)">
            <t-button size="small" variant="text" theme="warning"> 重置密码</t-button>
          </t-popconfirm>
          <t-button v-if="row.bindDeviceId" size="small" variant="text" @click="textBind(row.id)" theme="primary"> 解绑</t-button>
          <t-button v-else size="small" variant="text" disabled theme="primary"> 解绑</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" v-model:current="searchData.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>

    <t-dialog :closeOnOverlayClick="false" :closeBtn="false" class="add-Model" v-model:visible="addVisible" :header="dialogTitle" destroy-on-Close width="800" @confirm="submitForm" :on-cancel="onCancel">
      <img @click="onCancel" class="box-Item" src="../../assets/img/knowledge/cout.png" />
      <t-form :data="addFormData">
        <div class="addPerson" style="display: flex; flex-direction: row; justify-content: flex-start">
          <div style="margin-right: 50px">
            <t-form-item requiredMark label="员工姓名" name="name" initial-data="TDesign">
              <t-input v-model="addFormData.name" placeholder="请输入角色姓名" />
            </t-form-item>
            <template v-if="editId">
              <t-form-item requiredMark label="归属机构" name="tel" initial-data="123456">
                <t-select v-model="addFormData.institution" :disabled="roleState.userInfo.organizationLevel == 2 ? false : true" :options="organLabel" @change="onChangeSelect" placeholder="请选择" filterable />
              </t-form-item>
            </template>
            <template v-else>
              <t-form-item requiredMark label="归属机构" name="tel" initial-data="123456">
                <t-select v-model="addFormData.institution" :options="organLabel" @change="onChangeSelect" placeholder="请选择" filterable />
              </t-form-item>
            </template>
            <t-form-item label="员工头像" name="tel" initial-data="123456">
              <t-upload
                ref="uploadRef"
                v-model:files="avatarList"
                :defaultFiles="(imgFile as any)"
                theme="image"
                :size-limit="{ size: 2, unit: 'MB' }"
                :action="uploadUrl"
                :formatResponse="formatImgResponse"
                accept="image/png,image/jpg"
                @remove="formImage = ''"
                :headers="headers"
                :onSuccess="handleUpload"
                :locale="{ triggerUploadText: { image: '请选择头像' } }"
              ></t-upload>
              <!-- :beforeAllFilesUpload="checkUpload" -->
            </t-form-item>
            <t-form-item label="员工资质" name="tel" initial-data="123456">
              <t-upload
                ref="uploadRef1"
                v-model:files="aptitudeList"
                :defaultFiles="(imgFile as any)"
                theme="image"
                :size-limit="{ size: 2, unit: 'MB' }"
                :action="uploadUrl"
                :formatResponse="formatImgResponse"
                accept="image/*"
                @remove="addFormData.aptitudeTheme = ''"
                :headers="headers"
                :onSuccess="handleAptitude"
                :locale="{ triggerUploadText: { image: '请选择资质' } }"
              ></t-upload>
            </t-form-item>
            <t-form-item label="联系电话" name="phone" placeholder="请输入联系电话">
              <!-- :onMouseleave="onMouseleave"  -->
              <t-input v-model="addFormData.phone" :maxlength="11" :onKeyup="keyReg" placeholder="请输入联系电话" />
            </t-form-item>
            <t-form-item requiredMark label="小程序营销权限" name="appletMarketingPermissions" initial-data="123456">
              <t-switch style="margin-left: 15px" v-model="addFormData.appletMarketingPermissions" @change="onProgramChange" />
            </t-form-item>
            <t-form-item v-if="addFormData.appletMarketingPermissions" requiredMark label="权益营销限制" name="restrict" initial-data="123456">
              <t-button class="btn-item" theme="primary" @click="getWith">去配置</t-button>
            </t-form-item>
          </div>
          <div>
            <t-form-item requiredMark label="登录账户" name="account">
              <t-input v-model="addFormData.account" :maxlength="30" :onKeyUp="(addFormData.account = addFormData.account.replace(/[\W]/g, ''))" placeholder="请输入登录账户" />
            </t-form-item>
            <template v-if="editId"> </template>
            <template v-else>
              <t-form-item requiredMark label="登录密码" name="password">
                <t-input type="password" v-model="addFormData.password" placeholder="请输入登录密码" autocomplete="new-password">
                  <template #prefix-icon>
                    <lock-on-icon />
                  </template>
                </t-input>
              </t-form-item>
            </template>
            <t-form-item requiredMark label="员工岗位" name="tel" initial-data="123456">
              <t-select v-model="addFormData.postName" :options="postLabel" placeholder="请选择" filterable />
            </t-form-item>
            <t-form-item requiredMark label="员工性别" name="tel" initial-data="123456">
              <t-select class="ipt-slt" v-model="addFormData.sex" :options="sexOption" placeholder="请选择"> </t-select>
            </t-form-item>
            <t-form-item label="员工生日" name="birthDate" initial-data="123456">
              <t-date-picker size="medium" @change="onBirthChange" format="YYYY-MM-DD" v-model="addFormData.birthDate" />
            </t-form-item>
            <t-form-item requiredMark label="PRO权限" name="proAble" initial-data="123456">
              <t-switch v-model="addFormData.proAble" @change="onChange" />
            </t-form-item>
            <t-form-item requiredMark label="绑定设备" name="bindAble" initial-data="123456">
              <t-switch v-model="addFormData.bindAble" @change="onBindChange" />
            </t-form-item>
            <t-form-item v-if="isShowDevice || addFormData.bindAble == 1" requiredMark label="设备号" name="permissions">
              <t-input v-model="addFormData.device" disabled placeholder="登录后显示设备号" />
            </t-form-item>
            <t-form-item v-if="isShow || addFormData.proAble == 1" requiredMark label="数据权限" name="permissions">
              <t-radio-group v-model="addFormData.permissions">
                <t-radio :value="0">机构</t-radio>
                <t-radio :value="1">个人</t-radio>
              </t-radio-group>
            </t-form-item>
          </div>
        </div>
      </t-form>
      <t-alert class="mes-box" v-if="changeSelect" theme="error">归属原有机构的数据将不会迁移，请谨慎修改归属机构</t-alert>
    </t-dialog>

    <t-dialog placement="center" destroy-on-Close width="1000" header="导入日志" v-model:visible="visibleLog" :footer="false">
      <div class="search-box">
        <div class="search-item">员工姓名:<t-input class="ipt-slt" clearable v-model="titleLogData.employeeName" auto-width /></div>
        <div class="search-item">导入状态:<t-select class="ipt-slt" clearable v-model="titleLogData.importStatus" :options="proNameOption" placeholder="请选择"></t-select></div>
        <t-button class="search-item" theme="primary" @click="searchItem">
          <template #icon> <SearchIcon /> </template>搜索
        </t-button>
        <t-button variant="outline" theme="primary" @click="rest">重置条件</t-button>
      </div>
      <div class="paginationTable" style="height: 350px">
        <div>
          <t-table row-key="index" :data="logData" :columns="(logColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed">
            <template #importStatus="{ row }">
              <div style="color: #24c07b; font-weight: bold" v-if="row.importStatus == 0">
                <CheckCircleFilledIcon />
                导入成功
              </div>
              <div style="color: #f00606; font-weight: bold" v-else>
                <CloseCircleFilledIcon />
                导入失败
              </div>
            </template>

            <template #empty>
              <div style="color: rgba(0, 0, 0, 0.26)">
                <img style="width: 200px; height: 101px; margin-top: 80px" src="../../assets/img/knowledge/emptyX.png" />
                <div style="display: flex; justify-content: center">暂无导入日志～</div>
              </div>
            </template>
          </t-table>
        </div>
      </div>
      <div class="paginationName">
        <t-pagination :pageSize="searchLogData.pageSize" :total="logTotal" v-model:current="searchLogData.pageNum" @page-size-change="pageLogChange" @current-change="currentLogChange" show-jumper />
      </div>
    </t-dialog>

    <div class="mask-box" v-if="visible">
      <div class="content-box">
        <span @click="visible = false" class="boxItem">
          <img class="boxItem" src="../../assets/img/knowledge/cout.png" />
        </span>
        <h2>提示</h2>
        <p>{{ visibleTitle }}</p>
        <div class="btn-box">
          <button @click="onConfirm">
            <span>确定</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 小程序去配置 -->
    <t-dialog placement="center" @confirm="equityForm" width="1000" header="配置权益次数" v-model:visible="isWith">
      <div class="paginationTable" style="height: 350px">
        <div>
          <t-table row-key="index" :data="equityData" :columns="(equityColumns as PrimaryTableCol<TableRowData>[])" size="medium" hover table-layout="fixed">
            <template #title-slot-name>
              <div>
                限制次数（月）
                <t-popup content="当限制次数不填写任何数值时，则代表此权益不对员工发放兑换次数做限制" trigger="hover">
                  <span><InfoCircleIcon /></span>
                </t-popup>
              </div>
            </template>
            <template #sumCount="{ row }">
              <!-- <t-input class="item-slt" clearable v-model="row.sumCount" auto-width /> -->
              <t-input-number @change="changeCount" v-model="row.sumCount" :min="0" :step="1" auto-width />
            </template>

            <template #empty>
              <div style="color: rgba(0, 0, 0, 0.26)">
                <img style="width: 200px; height: 101px; margin-top: 80px" src="../../assets/img/knowledge/emptyX.png" />
                <div style="display: flex; justify-content: center">暂无权益～</div>
              </div>
            </template>
          </t-table>
        </div>
      </div>
    </t-dialog>
    <!-- 小程序去配置 -->
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import dayjs from 'dayjs';

import { AddIcon, InfoCircleIcon, SearchIcon, EditIcon, CheckCircleFilledIcon, CloseCircleFilledIcon, DeleteIcon, DownloadIcon, RefreshIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import {
  switchStatus,
  setSwitchBind,
  sethBind,
  employeeLoad,
  addEmployeeLoad,
  editEmployeeLoad,
  resetEmployeeLoad,
  resetQueryOrganList,
  resetSwitchRoleEnable,
  positionList,
  positionByOrganId,
  getPosition,
  logLoadList,
  listEmployeeEquity,
  saveBatchEquity,
  employeeDetail
} from '../../request/modules/employee';
import { useRoleStore } from '../../store/modules/role';
import { MessagePlugin, SwitchValue, PrimaryTableCol, TableRowData, Input } from 'tdesign-vue-next';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RefreshIcon,
    LockOnIcon,
    InfoCircleIcon,
    load,
    CheckCircleFilledIcon,
    CloseCircleFilledIcon
  },
  setup() {
    const roleState = useRoleStore();
    const files = ref<any>([]);
    const visible = ref<boolean>(false);
    const visibleLog = ref<boolean>(false);
    const visibleTitle = ref<string>('');
    const paramsStatus = ref<any>({
      id: '',
      status: ''
    });
    const editId = ref<string>('');
    const isShow = ref<boolean>(); //是否显示
    const isWith = ref<boolean>(false); //去配置弹窗变量
    const isShowDevice = ref<boolean>(); //是否显示
    const switchChecked = ref<any>(false);
    const avatarList = ref<any>([]); //头像
    const aptitudeList = ref<any>([]); //资质aptitudeUrl
    const imgFile = ref<any>([]); //图片
    const formImage = ref<any>(''); //图片回显
    const organLabel = ref<any>([]);
    const postLabel = ref<any>([]);
    const personnelLabel = ref<any>([]); //查询的岗位
    const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
    const uploadExcelUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/employee/importExcel'); //导入展示
    const organId = ref<string>('');
    const addFormData = reactive<any>({
      List_url: '', //资质图
      name: '', //员工姓名
      organId: '', //机构id
      organName: '', //机构名称
      password: '', //密码
      account: '', //登录账户
      phone: '', //手机号
      positionId: '', //岗位id
      positionName: '', //岗位名称
      postName: '',
      picture_url: '', //头像
      proAble: true, //状态
      device: '',
      bindAble: false,
      sex: '', //性别
      institution: null, //归属机构
      theme: '', //头像
      aptitudeTheme: '',
      birthDate: '',
      permissions: 0, //数据权限
      appletMarketingPermissions: 0 //小程序营销权限
    });
    let regNum = /^[0-9]*$/;
    let reg = /^1[3-9][0-9]{9}$/; //校验手机号
    const keyReg = (value: any) => {
      if (!regNum.test(value)) {
        addFormData.phone = '';
      }
    };
    const isLoading = ref<boolean>(false);
    const setArrt = reactive({
      headers: {
        token: ''
      },
      id: '',
      passwordShow: false,
      sexOption: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ],
      addPerson: {
        personName: 'xx医院',
        sex: '1',
        passWord: '123456'
      },
      dialogTitle: '',

      searchData: {
        ids: [],
        organId: '',
        pageNum: 1,
        pageSize: 10,
        name: '',
        positionId: '',
        enable: '',
        appletMarketingPermissions: '',
        bindDeviceId: '',
        bindDeviceSwitch: '',
        status: ''
      },
      titleData: {
        ids: [],
        organId: '',
        pageNum: 1,
        pageSize: 10,
        name: '',
        positionId: '',
        enable: '',
        appletMarketingPermissions: '',
        bindDeviceId: '',
        bindDeviceSwitch: '',
        status: ''
      },
      //导入
      searchLogData: {
        employeeName: '',
        importStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      titleLogData: {
        employeeName: '',
        importStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      programOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      proOptionStatus: [
        { label: '全部', value: '' },
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
        
      ],
      proOptionSwitch: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      proNameOption: [
        { label: '全部', value: '' },
        { label: '导入成功', value: 0 },
        { label: '导入失败', value: 1 }
      ],
      postOption: [
        { label: '全部', value: '1', title: '架构云选项' },
        { label: '岗位1', value: '2' },
        { label: '岗位2', value: '3' }
      ],
      data: [],
      logData: [],
      equityData: [],
      columns: [
        { colKey: 'empCode', title: '员工编号', width: 140, align: 'center' },
        { colKey: 'name', title: '姓名', width: '140px' },
        { colKey: 'nameStatus', title: '员工状态', slots: { customRender: 'nameStatus' }, align: 'center', width: '140px' },
        { colKey: 'account', title: '登录账户', width: 140, align: 'center' },

        {
          colKey: 'bindDeviceSwitch',
          title: '绑定设备',
          slots: { customRender: 'bindDeviceSwitch' },
          width: '140px',
          align: 'center'
        },
        { colKey: 'bindDeviceId', title: '设备号', align: 'center' },
        { colKey: 'organName', title: '归属机构', width: 180, align: 'center' },
        { colKey: 'birthDate', title: '员工生日', slots: { customRender: 'birthDate' }, align: 'center', width: '150px' },
        {
          colKey: 'auth',
          title: 'PRO权限',
          slots: { customRender: 'auth' },
          width: 140,
          align: 'center'
        },
        {
          colKey: 'appletMarketingPermissions',
          title: '小程序营销权限',
          slots: { customRender: 'appletMarketingPermissions' },
          width: '180px',
          align: 'center'
        },
        { colKey: 'positionName', title: '岗位', width: 140, align: 'center' },
        { colKey: 'updateTime', title: '操作时间', width: '180px', align: 'center' },

        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' },
          width: '300px',
          fixed: 'right',
          align: 'center'
        }
      ],
      logColumns: [
        { colKey: 'employeeName', title: '员工姓名' },
        { colKey: 'account', title: '登录账号' },
        { colKey: 'importStatus', title: '导入状态', slots: { customRender: 'importStatus' } },
        { colKey: 'importDate', title: '导入时间' },
        {
          colKey: 'remark',
          title: '备注'
        }
      ],
      equityColumns: [
        { colKey: 'id', title: '序号', align: 'center', width: '100px' },
        { colKey: 'typeDesc', title: '权益类型', align: 'center', width: '120px' },
        { colKey: 'equityName', title: '权益名称', align: 'center', width: '120px' },
        { colKey: 'generateCount', title: '已生成数量（张）', align: 'center', width: '120px' },
        { colKey: 'sumCount', title: 'title-slot-name', width: '180px', slots: { customRender: 'sumCount' }, align: 'center' }
      ],
      options: [
        { label: '计算机学院', value: '1' },
        { label: '软件学院', value: '2' },
        { label: '物联网学院', value: '3' }
      ]
    });
    const total = ref<number>(0);
    const logTotal = ref<number>(0);
    const addVisible = ref<boolean>(false);
    //查询
    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
      setArrt.searchData.pageNum = 1;
      getEmployeeList();
    };
    //重置
    const set = () => {
      setArrt.searchData = {
        ids: [],
        organId: '',
        pageNum: 1,
        pageSize: 10,
        name: '',
        positionId: '',
        enable: '',
        appletMarketingPermissions: '',
        bindDeviceId: '',
        bindDeviceSwitch: '',
        status: ''
      };
      setArrt.titleData = {
        ids: [],
        organId: '',
        pageNum: 1,
        pageSize: 10,
        name: '',
        positionId: '',
        enable: '',
        appletMarketingPermissions: '',
        bindDeviceId: '',
        bindDeviceSwitch: '',
        status: ''
      };
      getEmployeeList();
    };

    //导入日志
    //查询
    const searchItem = () => {
      setArrt.searchLogData = Object.assign(setArrt.searchLogData, setArrt.titleLogData);

      setArrt.searchLogData.pageNum = 1;
      getLogList();
    };
    //重置
    const rest = () => {
      setArrt.searchLogData = {
        employeeName: '',
        importStatus: '',
        pageNum: 1,
        pageSize: 5
      };
      setArrt.titleLogData = {
        employeeName: '',
        importStatus: '',
        pageNum: 1,
        pageSize: 5
      };
      getLogList();
    };
    //分页
    const pageLogChange = (pageSize: any) => {
      setArrt.searchLogData.pageSize = pageSize;
      getLogList();
    };
    const currentLogChange = (current: number) => {
      setArrt.searchLogData.pageNum = current;
      getLogList();
    };

    //编辑弹窗
    const edit = (employeeId: string) => {
      employeeDetail({ employeeId: employeeId }).then((res: any) => {
        if (res.code === 200) {
          addFormData.device = res.data.bindDeviceId;
          addVisible.value = true;
          if (res.data.pictureUrl) {
            //头像
            avatarList.value[0] = {
              name: '',
              url: res.data.pictureUrl
            };
          } else {
            avatarList.value = [];
          }
          if (res.data.aptitudeUrl) {
            //资质
            aptitudeList.value[0] = {
              name: '',
              url: res.data.aptitudeUrl
            };
          } else {
            aptitudeList.value = [];
          }
          getPositionList(res.data.organId);
          organId.value = res.data.organId; //小程序配置
          editId.value = res.data.id;
          setArrt.dialogTitle = '编辑';
          addFormData.bindAble = res.data.bindDeviceSwitch == 0 ? false : true;
          //小程序营销
          addFormData.appletMarketingPermissions = res.data.appletMarketingPermissions == 0 ? false : true;
          setArrt.id = res.data.id;
          addFormData.name = res.data.name;
          addFormData.organName = '';
          addFormData.password = '';
          addFormData.account = res.data.account;
          addFormData.phone = res.data.phone;
          addFormData.postName = res.data.positionId;
          addFormData.birthDate = res.data.birthDate ? res.data.birthDate.substr(0, 10) : '';
          addFormData.permissions = res.data.permissions;
          addFormData.sex = String(res.data.sex);
          addFormData.proAble = res.data.enable == 1 ? true : false;
          addFormData.institution = res.data.organId;
        } else {
          MessagePlugin.error(res.msg);
        }
      });
    };

    const passwordHandle = (value: any) => {
      resetEmployeeLoad({ id: value }).then((res: any) => {
        if (res.code === 200) {
          getEmployeeList();
          MessagePlugin.success('重置成功');
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };

    //机构
    const getOrganList = () => {
      resetQueryOrganList().then((res: any) => {
        if (res.code === 200) {
          organLabel.value = res.data.map((item: any) => {
            return {
              label: item.organizationName,
              value: item.id
            };
          });
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    const textBind = val => {
      sethBind({ employeeId: val }).then((res: any) => {
        if (res.code == 200) {
          getEmployeeList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    //员工列表
    const getEmployeeList = () => {
      employeeLoad(setArrt.searchData as any).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setArrt.data = []);
          } else {
            setArrt.data = res.data.data
              ? res.data.data.map((item: any) => {
                  return {
                    ...item
                    // birthDate: dayjs(item.birthDate).format('YYYY-MM-DD')
                  };
                })
              : [];
            total.value = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
      });
    };
    //员工导入列表
    const getLogList = () => {
      logLoadList(setArrt.searchLogData as any).then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == '' || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setArrt.logData = []);
            logTotal.value = res.data.total;
          } else {
            setArrt.logData = res.data.data ? res.data.data : [];
            logTotal.value = res.data.total;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
      });
    };

    //新增弹窗
    const addLoad = () => {
      setArrt.dialogTitle = '新增';
      postLabel.value = [];
      avatarList.value = [];
      aptitudeList.value = [];
      editId.value = '';
      addFormData.aptitudeTheme = '';
      addFormData.name = '';
      addFormData.organName = '';
      addFormData.password = '';
      addFormData.account = '';
      addFormData.phone = '';
      addFormData.postName = '';
      formImage.value = '';
      addFormData.sex = '';
      addFormData.institution = '';
      addVisible.value = true;
      addFormData.proAble = true;
      addFormData.bindAble = false;
      addFormData.appletMarketingPermissions = false;
      addFormData.birthDate = '';
      addFormData.permissions = 0;
      isProgram.value = false;
    };
    //员工新增/修改确定
    const submitForm = () => {
      let params = {
        aptitudeUrl: addFormData.aptitudeTheme, //资质图
        enable: addFormData.proAble ? 1 : 0, //状态
        bindDeviceSwitch: addFormData.bindAble ? 1 : 0, //状态
        appletMarketingPermissions: addFormData.appletMarketingPermissions ? 1 : 0, //小程序营销状态
        name: addFormData.name, //员工姓名
        organCode: '',
        organId: addFormData.institution, //机构id
        password: addFormData.password, //密码
        account: addFormData.account, //登录账户
        phone: addFormData.phone, //手机号
        positionId: addFormData.postName, //岗位id
        birthDate: addFormData.birthDate,
        permissions: addFormData.permissions,
        pictureUrl: formImage.value ? formImage.value : '', //头像
        sex: addFormData.sex ? addFormData.sex : '', //性别
        list: setArrt.equityData
      };

      let editParams = {
        id: setArrt.id,
        aptitudeUrl: addFormData.aptitudeTheme ? addFormData.aptitudeTheme : '', //资质图
        name: addFormData.name, //员工姓名
        organId: addFormData.institution, //机构id
        // organName: addFormData.institution, //机构名称
        // password: addFormData.password, //密码
        account: addFormData.account, //登录账户
        phone: addFormData.phone, //手机号
        positionId: addFormData.postName, //岗位id
        // positionName: addFormData.postName, //岗位名称 birthDate: dayjs('2023-07-20').format('YYYY-MM-DD')
        pictureUrl: formImage.value ? formImage.value : '', //头像
        birthDate: addFormData.birthDate,
        permissions: addFormData.permissions,
        enable: addFormData.proAble ? 1 : 0, //状态
        bindDeviceSwitch: addFormData.bindAble ? 1 : 0, //状态
        appletMarketingPermissions: addFormData.appletMarketingPermissions ? 1 : 0, //小程序营销状态
        sex: addFormData.sex //性别
        // list:
        // institution: addFormData.organId //归属机构
      };
      if (addFormData.phone != '') {
        if (!reg.test(addFormData.phone)) {
          MessagePlugin.warning('手机号格式不正确');
          return;
        }
      }
      if (!addFormData.account) {
        MessagePlugin.warning('登录账户不能为空!');
        return;
      }
      if (!addFormData.sex) {
        MessagePlugin.warning('员工性别不能为空!');
        return;
      }

      if (setArrt.dialogTitle == '新增') {
        addEmployeeLoad(params as any).then((res: any) => {
          if (res.code === 200) {
            addVisible.value = false;
            getEmployeeList();
            MessagePlugin.success('添加成功');
          } else {
            // MessagePlugin.success(res.msg);
          }
        });
      } else {
        editEmployeeLoad(editParams as any).then((res: any) => {
          if (res.code === 200) {
            addVisible.value = false;
            MessagePlugin.success('编辑成功');
            getEmployeeList();
            changeSelect.value = false;
          } else {
            // MessagePlugin.success(res.msg);
          }
        });
      }
    };
    const onCancel = () => {
      organId.value = '';
      changeSelect.value = false;
      addVisible.value = false;
    };
    const fixedTopRows = ref<boolean>(false);
    onMounted(async () => {
      // 获取当前可视范围的高度
      if (document.body.clientHeight > 800) {
        fixedTopRows.value = true;
      } else {
        fixedTopRows.value = false;
      }
      let token = localStorage.getItem('x-auth-token');
      setArrt.headers.token = token as string;

      getEmployeeList();
      getOrganList();
      personnelList();
      getLogList();
      // let val = null;
      // await getPositionList(val);
    });
    const formatImgResponse = (response: any) => {
      return { name: response.data.originalFilename, url: response.data.url };
    };
    const handleUpload = (context: any) => {
      formImage.value = context.fileList[0].url;
    };
    const handleAptitude = (context: any) => {
      addFormData.aptitudeTheme = context.fileList[0].url;
    };
    //分页
    const pageSizeChange = (pageSize: any) => {
      setArrt.searchData.pageSize = pageSize;

      getEmployeeList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getEmployeeList();
    };
    //编辑状态
    const getResetEnable = (val: any, proAble: Number) => {
      let params = {
        id: val.id,
        enable: proAble
      };
      resetSwitchRoleEnable(params as any).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('编辑成功');
          getEmployeeList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    const setSwitch = (val: any, proAble: Number) => {
      let params = {
        employeeId: val.id,
        status: proAble
      };
      setSwitchBind(params as any).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('编辑成功');
          getEmployeeList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    //员工在职
    const setStatus = (val: any, status: any) => {
      paramsStatus.value = {
        id: val.id,
        status: status
      };
      visibleTitle.value = status == 0 ? '确定要启用该员工的账号吗?' : '确定要禁用该员工的账号吗?';
      visible.value = true;
    };
    const onConfirm = () => {
      switchStatus(paramsStatus.value as any).then((res: any) => {
        if (res.code == 200) {
          visible.value = false;

          getEmployeeList();
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    const onChange = e => {
      isShow.value = e;
    };
    const onBindChange = e => {
      isShowDevice.value = e;
    };
    //小程序营销权限
    //营销权益配置列表
    const getProgramList = () => {
      let params = {
        employeeId: editId.value || null,
        organId: organId.value
      };
      listEmployeeEquity(params).then((res: any) => {
        if (res.code == 200) {
          // setArrt.equityData
          setArrt.equityData = res.data ? res.data : [];
        }
      });
    };
    const isProgram = ref<any>(false);
    const onProgramChange = e => {
      addFormData.appletMarketingPermissions = e;
    };
    watch(
      organId,
      val => {
        if (val != '') {
          getProgramList();
        }
      },
      { deep: true }
    );
    //去配置
    const getWith = () => {
      if (organId.value != '') {
        // organId.value  setArrt.logData  getProgramList
        if (editId.value) {
          getProgramList();
        }
        //判断是否选择了渠道
        isWith.value = true;
      } else {
        MessagePlugin.error('请先选择该员工的归属机构');
      }
    };
    const equityForm = () => {
      console.log(setArrt.equityData, 'setArrt.equityData');
      let reg = /^[+]{0,1}(\d+)$/;
      // 过滤sumCoun不为null 的  要不然正则判断不了.后端给的没值为null
      let allArr = setArrt.equityData
        .filter((item: any) => item.sumCount != null)
        .map((item: any) => {
          return item;
        });
      console.log(allArr, 'allArr');
      // 过滤sumCount不是整数的
      let newArr = allArr
        .filter((item: any) => !reg.test(item.sumCount))
        .map((item: any) => {
          return item.id;
        });
      console.log(newArr, 'newArr');
      if (newArr.length > 0) {
        MessagePlugin.error('限制次数不能为负数或小数，请重新选择。');
        return;
      }
      if (editId.value) {
        let params = {
          employeeId: editId.value,
          list: setArrt.equityData
        };
        saveBatchEquity(params).then((res: any) => {
          if (res.code == 200) {
            if (res.data && !res.data.saveSuccess) {
              MessagePlugin.error('限制次数不能小于当前已使用兑换次数');
              return;
            }
            isWith.value = false;
          } else {
          }
        });
      } else {
        isWith.value = false;
      }
    };

    //导入日志
    const addLog = () => {
      setArrt.searchLogData = {
        employeeName: '',
        importStatus: '',
        pageNum: 1,
        pageSize: 5
      };
      setArrt.titleLogData = {
        employeeName: '',
        importStatus: '',
        pageNum: 1,
        pageSize: 5
      };
      getLogList();
      visibleLog.value = true;
    };
    //生日
    const onBirthChange = (value: any) => {
      addFormData.birthDate = value;
    };
    //点击归属
    const changeSelect = ref<any>(false);
    const onChangeSelect = (value: any, context: { option?: any; e?: MouseEvent | KeyboardEvent }) => {
      if (editId.value) {
        changeSelect.value = true;
      }
      addFormData.postName = '';
      organId.value = value;
      getPositionList(value);
    };
    //员工岗位
    const getPositionList = (val: any) => {
      positionList({ organId: val }).then((res: any) => {
        if (res.code == '200') {
          postLabel.value = res.data.map((item: any) => {
            return {
              label: item.posName,
              value: item.id,
              disabled: item.enable == 0 ? true : false
            };
          });
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    //查询的岗位
    const personnelList = () => {
      positionByOrganId().then((res: any) => {
        if (res.code == '200') {
          personnelLabel.value = res.data.map((item: any) => {
            return {
              label: item.organName + '(' + item.posName + ')',
              value: item.id
            };
          });
        } else {
          MessagePlugin.success(res.msg);
        }
      });
    };
    const close1 = () => {
      visible.value = false;
    };
    const download = () => {
      getPosition({}).then((res: any) => {
        window.location.href = res.data;
      });
    };
    const handleFail = (file: any) => {
      MessagePlugin.error(`文件 ${file.name} 上传失败`);
    };
    const succUpload = (file: any) => {
      if (file.response.code == 200) {
        MessagePlugin.success(file.response.msg);
        getEmployeeList();
      } else {
        MessagePlugin.error(file.response.msg);
      }
    };

    //按钮加减
    const changeCount = val => {
      console.log(val, 'val'); //flase
      if (val < 0) {
        MessagePlugin.error('限制次数不能为负数或小数');
      }
      ///^\+?[1-9][0-9]*$/
      let reg = /^[+]{0,1}(\d+)$/;
      if (val != null) {
        if (!reg.test(val)) {
          MessagePlugin.error('限制次数不能为负数或小数');
        }
      }
    };

    return {
      ...toRefs(setArrt),
      changeCount,
      pageSizeChange,
      isProgram,
      download,
      roleState,
      personnelList,
      getResetEnable,
      positionList,
      searchItem,
      rest,
      organLabel,
      succUpload,
      handleFail,
      isShow,
      isShowDevice,
      personnelLabel,
      postLabel,
      total,
      editId,
      equityForm,
      currentChange,
      addVisible,
      setStatus,
      submitForm,
      search,
      set,
      edit,
      textBind,
      onBirthChange,
      passwordHandle,
      getEmployeeList,
      addLoad,
      formatImgResponse,
      onChangeSelect,
      changeSelect,
      getProgramList,
      addLog,
      visibleLog,
      logTotal,
      // checkUpload,
      onChange,
      onBindChange,
      onProgramChange,
      isWith,
      getWith,
      addFormData,
      uploadUrl,
      uploadExcelUrl,
      imgFile,
      avatarList,
      aptitudeList,
      fixedTopRows,
      formImage,
      handleAptitude,
      handleUpload,
      pageLogChange,
      onCancel,
      currentLogChange,
      onConfirm,
      visibleTitle,
      switchChecked,
      loadStatus,
      schedule,
      keyReg,
      setSwitch,
      visible,
      paramsStatus,
      isLoading,
      files,
      close1
      // onMouseleave
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
        width: 200px;
        margin-left: 5px;
      }
      .item-slt {
        width: 250px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    justify-content: space-between;
    border-radius: 8px;
    margin-left: 15px;
    .box-item {
      display: flex;
    }
    .operate-box-left {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .t-icon,
      .t-icon-add {
        color: #ffffff;
      }
    }
    .btn-item {
      margin-left: 15px;
    }
    button {
      &:nth-child(1) {
        // margin-left: 10px;
      }
    }

    .search-item {
      margin-right: 25px;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 320px;
        margin-left: 5px;
      }
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
    background-color: #ffffff;
    padding: 15px;
  }

  .t-pagination {
    margin-top: 30px;
  }

  .cope-box {
    display: flex;

    align-items: center;
    justify-content: space-between;
  }

  ::v-deep(.t-pagination__total) {
    flex: none !important;
  }
  ::v-deep(.t-input--auto-width) {
    width: 120px;
  }
  .add-Model {
    position: relative;
    .box-Item {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 10px;
      top: 9px;
    }
  }
  .mes-box {
    position: absolute;
    left: 190px;
    top: -65px;
    width: 450px;
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
      position: relative;
      width: 444px;
      height: 258px;
      background: #ffffff;
      border-radius: 14px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      .boxItem {
        position: absolute;
        width: 30px;
        height: 30px;
        right: 10px;
        top: 9px;
      }
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
          width: 336px;
          height: 48px;
          border-radius: 24px;
          font-weight: bold;
          border: none;
          background: #3d7eff;
          //   margin-left: 28px;

          // &:nth-child(1) {
          //   color: #3d7eff;
          //   background: #f5f8fd;
          //   margin-right: 28px;
          // }

          // &:nth-child(2) {
          //   color: #ffffff;
          //   background: #3d7eff;
          //   margin-left: 28px;
          // }
          span {
            font-size: 22px;
            color: #ffffff;
          }
        }
      }
    }
  }
  .paginationName {
    margin-top: 20px;
  }
  .paginationTable {
    overflow-y: auto;
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
