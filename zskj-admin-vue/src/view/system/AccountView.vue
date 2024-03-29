<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">用户昵称：<t-input class="ipt-slt" v-model="titleData.nickName" placeholder="请输入用户昵称" auto-width /></div>
      <div class="search-item search-item-font">用户名称：<t-input class="ipt-slt" v-model="titleData.name" placeholder="请输入用户名称" auto-width /></div>
      <div class="search-item search-item-font">手机号：<t-input class="ipt-slt" v-model="titleData.phone" placeholder="请输入手机号" auto-width /></div>

      <t-button class="search-item" theme="primary" @click="searchList"> 搜索 </t-button>
      <t-button variant="outline" theme="primary" @click="resetting">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addItem">
          <template #icon> <AddIcon /> </template>新建
        </t-button>
        <!-- <t-button class="btn-item" theme="success" disabled>
                <template #icon>
                    <EditIcon />
                </template>修改
            </t-button>
            <t-button class="btn-item" theme="danger" disabled>
                <template #icon>
                    <DeleteIcon />
                </template>删除
            </t-button>
            <t-button class="btn-item" theme="warning" disabled>
                <template #icon>
                    <DownloadIcon />
                </template>导出
            </t-button> -->
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 470" :data="data" table-layout="fixed" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" :bordered="false">
        <template #enable="{ row }">
          <t-switch :value="row.enable" :customValue="[1, 0]" @change="(value: SwitchValue) => onChange(row.id, value as number)" :key="row.id" />
        </template>

        <template #action="{ row }">
          <t-button size="small" variant="text" @click="edit(row.id)" theme="success"> 编辑</t-button>
          <!-- <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="del(row.id)">
                        <t-button size="small" variant="text" theme="danger">
                            <template #icon>
                                <DeleteIcon />
                            </template>
                            删除</t-button>
                    </t-popconfirm> -->
          <t-popconfirm content="确认重置此用户的密码吗" theme="warning" @click.stop @confirm="passwordHandle(row.id)">
            <t-button size="small" variant="text" theme="warning"> 重置密码</t-button>
          </t-popconfirm>
        </template>
      </t-table>
      <t-pagination :total="total" :defaultPageSize="searchData.pageSize" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="searchData.pageNum" />
    </div>
    <t-dialog v-model:visible="addVisible" width="800" :header="dialogTitle" confirmBtn="保存" @confirm="submitForm" @close="getTrue">
      <t-form layout="inline" :data="formData" :rules="(formRules as FormRules<Data>)">
        <t-form-item class="w50" label="用户昵称" name="nickName">
          <t-input placeholder="请输入用户昵称" v-model="formData.nickName" :maxlength="50"></t-input>
        </t-form-item>
        <t-form-item class="w50" label="手机号码" name="phone">
          <t-input placeholder="请输入手机号码" v-model="formData.phone" :maxlength="11"></t-input>
        </t-form-item>
        <t-form-item class="w50" label="用户名" name="name">
          <t-input placeholder="请输入用户名称" v-model="formData.name" :maxlength="50"></t-input>
        </t-form-item>
        <t-form-item class="w50" label="用户密码" name="passWord">
          <t-input placeholder="请输入用户密码" v-model="formData.passWord" type="password" :maxlength="8"></t-input>
        </t-form-item>
        <t-form-item class="w50" label="用户性别" name="sex">
          <t-select v-model="formData.sex">
            <t-option key="男" label="男" :value="1" />
            <t-option key="女" label="女" :value="2" />
            <t-option key="未知" label="未知" :value="3" />
          </t-select>
        </t-form-item>
        <t-form-item class="w50" label="用户角色" name="roleIds">
          <t-select v-model="formData.roleIds[0]" @change="roleSelectChange">
            <t-option v-for="(item, index) in personaSelectList" :key="index" :label="item.roleNameCn" :value="item.id" />
          </t-select>
        </t-form-item>
        <t-form-item class="w50" label="状态" name="enable">
          <t-radio-group v-model="formData.enable">
            <t-radio :value="1">开启</t-radio>
            <t-radio :value="0">停用</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item class="w50" label="角色类别" name="organizationLevel">
          <t-radio-group v-model="formData.organizationLevel" :disabled="dialogTitle === '编辑账户' ? true : false" @change="organizationTree(formData.organizationLevel)">
            <t-radio :value="1" v-if="userInfo.organizationLevel == 1">平台角色</t-radio>
            <t-radio :value="2" v-if="userInfo.organizationLevel != 3">渠道角色</t-radio>
            <t-radio :value="3" v-if="userInfo.organizationLevel != 1">机构角色</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item class="w50" :label="formData.organizationLevel == 2 ? '所属渠道' : '所属机构'" name="organizationId" v-if="!(formData.organizationLevel == userInfo.organizationLevel)">
          <t-select v-model="formData.organizationId" :disabled="dialogTitle === '编辑账户' ? true : false">
            <t-option v-for="(item, index) in siteSelectList" :key="index" :label="item.organizationName" :value="item.id" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { userList, userAddRole, userRemoveUser, userEditRole, userSwitchRoleEnable, getuser, resetPassWord } from '../../request/modules/UserApi';
import { getRoleTree } from '../../request/modules/PersonaApi';
import { getOrganizationTree } from '../../request/modules/OrganizationApi';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { SwitchValue, MessagePlugin, SelectValue, FormRules, Data, TableRowData, PrimaryTableCol } from 'tdesign-vue-next';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RefreshIcon,
    load
  },
  setup() {
    const setArrt = reactive({
      searchData: {
        name: '',
        nickName: '',
        phone: '',
        pageNum: 1,
        pageSize: 10
      },
      titleData: {
        name: '',
        nickName: '',
        phone: ''
      },
      sexOption: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ],
      data: [],
      dialogTitle: '新建账户',
      columns: [
        { colKey: 'organizationId', title: '组织id', align: 'center' },
        { colKey: 'name', title: '用户名', align: 'center' },
        { colKey: 'nickName', title: '用户昵称', align: 'center' },
        { colKey: 'phone', title: '手机号', align: 'center' },
        { colKey: 'roleNameCn', title: '角色', align: 'center' },
        {
          colKey: 'enable',
          title: '状态',
          slots: { customRender: 'enable' },
          align: 'center'
        },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' },
          align: 'center',
          width: '180px'
        }
      ],
      formRules: {
        nickName: [{ required: true, message: '昵称必填', trigger: 'blur' }],
        passWord: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, message: '输入字数应在6到8之间', trigger: 'blur' },
          { max: 8, message: '输入字数应在6到8之间', trigger: 'blur' }
        ],
        name: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        enable: [{ required: true, message: '状态必填', trigger: 'blur' }],
        roleIds: [{ required: true, message: '角色必填', trigger: 'blur' }],
        organizationId: [{ required: true, message: '权限菜单必填', trigger: 'blur' }],
        organizationLevel: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      current: 2,
      pageSize: 0,
      editId: 0,
      total: 0,
      addVisible: false,
      formData: {
        createUser: '',
        enable: 1,
        name: '',
        nickName: '',
        organizationId: '',
        passWord: '',
        phone: '',
        roleIds: [],
        roles: '',
        roleName: '',
        sex: 3,
        organizationLevel: 1
      },
      siteSelectList: [{ organizationName: '', id: '', organizationLevel: 0 }],
      personaSelectList: [{ roleName: '', id: '', roleNameCn: '' }],
      userInfo: {
        organizationLevel: 0,
        organizationId: ''
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
      setArrt.userInfo = JSON.parse(localStorage.getItem('userinfo') as string);
      getTrue();
      getUserList();
    });
    const searchList = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
      setArrt.searchData.pageNum = 1;
      getUserList();
    };
    const resetting = () => {
      setArrt.searchData.name = '';
      setArrt.searchData.nickName = '';
      setArrt.searchData.phone = '';
      setArrt.searchData.pageNum = 1;
      setArrt.titleData.name = '';
      setArrt.titleData.nickName = '';
      setArrt.titleData.phone = '';
      getUserList();
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getUserList = () => {
      userList(setArrt.searchData).then((res: any) => {
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
    const submitForm = () => {
      if (setArrt.dialogTitle == '新建账户') {
        if (!setArrt.formData.organizationId) {
          setArrt.formData.organizationId = setArrt.userInfo.organizationId;
        }
        userAddRole(setArrt.formData).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            MessagePlugin.success('添加成功');
            setArrt.addVisible = false;
            getUserList();
          }
        });
      } else {
        let data = {
          createUser: setArrt.formData.createUser,
          enable: setArrt.formData.enable,
          name: setArrt.formData.name,
          nickName: setArrt.formData.nickName,
          organizationId: setArrt.formData.organizationId,
          phone: setArrt.formData.phone,
          roleIds: setArrt.formData.roleIds,
          roles: setArrt.formData.roles,
          roleName: setArrt.formData.roleName,
          sex: setArrt.formData.sex,
          passWord: setArrt.formData.passWord,
          organizationLevel: setArrt.formData.organizationLevel,
          id: setArrt.editId
        };
        if (!setArrt.formData.passWord) {
          data.passWord = undefined as any;
        }
        console.log(data);
        userEditRole(data).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            MessagePlugin.success('编辑成功');
            setArrt.addVisible = false;
            getUserList();
            getTrue();
          }
        });
      }
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getUserList();
    };
    const edit = (value: number) => {
      setArrt.dialogTitle = '编辑账户';
      setArrt.editId = value;
      getuser({ id: value }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          delete res.data.id;
          // for (let i = 0; i < setArrt.siteSelectList.length; i++) {
          //     if (setArrt.siteSelectList[i].id === res.data.organizationId) {
          //         setArrt.formData.organizationLevel = setArrt.siteSelectList[i].organizationLevel
          //     }
          // }
          // console.log(setArrt.formData);
          let index = setArrt.personaSelectList.findIndex(item => item.id === res.data.roleIds[0]);
          if (index === -1) {
            let obj: { roleName: string; id: string; roleNameCn: string } = {
              id: res.data.roleIds[0],
              roleName: '',
              roleNameCn: res.data.roleName
            };
            setArrt.personaSelectList.push(obj);
          }
          setArrt.formData = res.data;
          organizationTree(res.data.organizationLevel);
          setArrt.addVisible = true;
        }
      });
    };
    const del = (value: number) => {
      userRemoveUser({ id: value, isDelete: 1 }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          MessagePlugin.success('删除成功');
          getUserList();
        }
      });
    };
    const onChange = (id: number, enable: number) => {
      console.log(enable, id);
      userSwitchRoleEnable({ id, enable }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
          getUserList();
        }
      });
    };
    const getTrue = () => {
      getRoleTree().then((res: any) => {
        if (res.code === 200) {
          setArrt.personaSelectList = res.data;
        }
      });
    };
    const organizationTree = (organizationLevel: number) => {
      getOrganizationTree({ organizationLevel }).then((res: any) => {
        if (res.code === 200) {
          if (setArrt.dialogTitle == '新建账户') {
            setArrt.siteSelectList = res.data.filter((item: any) => item.enable == 1);
          } else {
            setArrt.siteSelectList = res.data;
          }
          console.log(setArrt.siteSelectList);
        }
      });
    };
    const addItem = () => {
      setArrt.dialogTitle = '新建账户';
      setArrt.addVisible = true;
      setArrt.formData = {
        createUser: '',
        enable: 1,
        name: '',
        nickName: '',
        organizationId: '',
        passWord: '',
        phone: '',
        roleIds: [],
        roles: '',
        roleName: '',
        sex: 3,
        organizationLevel: setArrt.userInfo.organizationLevel
      };
      organizationTree(setArrt.formData.organizationLevel);
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getUserList();
    };
    // const selectChange = (value: SelectValue) => {
    //     for (let i = 0; i < setArrt.siteSelectList.length; i++) {
    //         if (setArrt.siteSelectList[i].id === value) {
    //             setArrt.formData.organizationLevel = setArrt.siteSelectList[i].organizationLevel
    //         }
    //     }
    // }
    const roleSelectChange = (value: SelectValue) => {
      for (let i = 0; i < setArrt.personaSelectList.length; i++) {
        if (setArrt.personaSelectList[i].id === value) {
          setArrt.formData.roleName = setArrt.personaSelectList[i].roleName;
        }
      }
    };
    const passwordHandle = (id: number) => {
      resetPassWord({ id }).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
        }
      });
    };

    return {
      ...toRefs(setArrt),
      onChange,
      searchList,
      resetting,
      edit,
      del,
      submitForm,
      pageSizeChange,
      addItem,
      currentChange,
      // selectChange,
      roleSelectChange,
      organizationTree,
      passwordHandle,
      getTrue,
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

  display: flex;
  flex-direction: column;

  .search-box {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;

    .search-item {
      margin: 10px 15px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 240px;
        margin-left: 5px;
      }
    }
  }

  .operate-box {
    margin-left: 15px;

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

  .t-pagination {
    margin-top: 30px;
  }

  .w50 {
    width: 45%;
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
</style>
