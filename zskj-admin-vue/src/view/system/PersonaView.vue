<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">角色名：<t-input class="ipt-slt" v-model="titleData.roleNameCn" auto-width placeholder="请输入角色名" /></div>
      <div class="search-item search-item-font">权限字符：<t-input class="ipt-slt" v-model="titleData.roleName" auto-width placeholder="请输入权限字符" /></div>
      <div class="search-item search-item-font">状态：<t-select class="ipt-slt" :options="sexOption" v-model="titleData.enable" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">创建时间：<t-date-range-picker allow-input clearable enable-time-picker @change="change" v-model="timeData" /></div>
      <t-button class="search-item" theme="primary" @click="searchList">搜索</t-button>
      <t-button variant="outline" theme="primary" @click="resetting">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addItem">
          <template #icon> <AddIcon /> </template>新建</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="index" :max-height="fixedTopRows ? 1400 : 420" :data="data" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #enable="{ row }">
          <t-switch :value="row.enable" :customValue="[1, 0]" @change="(value: SwitchValue) => onChange(row.id, value as number)" :key="row.id" />
        </template>
        <template #action="{ row }">
          <t-button variant="text" theme="success" size="small" @click="edit(row.id)">编辑</t-button>
          <!-- <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="del(row.id)">
                        <t-button variant="text" theme="danger" size="small">
                            <template #icon>
                                <DeleteIcon />
                            </template>删除</t-button>
                    </t-popconfirm> -->
          <t-button variant="text" theme="warning" size="small" @click="itemDetails(row.id)"> 数据权限</t-button>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper v-model:current="searchData.pageNum" />
    </div>

    <t-dialog v-model:visible="addVisible" :on-cancel="onCancel" :on-close="close" :confirmBtn="dialogTitle == '详细信息' ? null : '确认'" :on-confirm="onConfirmAnother" :header="dialogTitle">
      <t-form :data="FormData" :rules="(formRules as FormRules<Data>)">
        <t-form-item label="角色名称" name="roleNameCn" initial-data="TDesign">
          <t-input v-model="FormData.roleNameCn" placeholder="请输入角色名称中文" :disabled="dialogTitle == '详细信息'" :maxlength="50" />
        </t-form-item>
        <t-form-item label="权限字符" name="roleName" initial-data="TDesign">
          <t-input v-model="FormData.roleName" placeholder="请输入角色权限字符" :disabled="dialogTitle == '详细信息'" :maxlength="50" />
        </t-form-item>
        <!-- <t-form-item label="角色顺序" name="roleSort" initial-data="123456">
                    <t-input-number type="number" :min="0" v-model="FormData.roleSort"
                        :disabled="dialogTitle == '详细信息' ? true : false" placeholder="请输入角色顺序" :maxlength="50" />
                </t-form-item> -->
        <t-form-item label="状态" name="enable">
          <t-radio-group v-model="FormData.enable" :disabled="dialogTitle == '详细信息'">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="0">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="权限菜单" name="menuIds">
          <div>
            <t-checkbox-group v-model="checkboxValue" style="height: 35px">
              <t-checkbox value="1" @change="allExpand" :disabled="dialogTitle == '详细信息'">展开/折叠</t-checkbox>
              <t-checkbox value="2" @change="allSelect" :disabled="dialogTitle == '详细信息'">全选/全不选</t-checkbox>
            </t-checkbox-group>
            <div class="tree-box">
              <t-tree :data="treeItems" :value="treeKeys" :disabled="dialogTitle == '详细信息'" :keys="{ value: 'id', label: 'label', children: 'children' }" :checkStrictly="false" :expandAll="expandAllState" hover checkable @change="checked" :key="treeKey" />
            </div>
          </div>
        </t-form-item>
        <t-form-item label="备注" name="tel" initial-data="123456">
          <t-textarea v-model="FormData.remark" :disabled="dialogTitle == '详细信息'" placeholder="请输入备注" clearable :maxlength="250" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { roleAddRole, roleList, roleEditRole, roleremoveUser, roleSwitchRoleEnable, getDetail } from '../../request/modules/PersonaApi';
import { getTreeMenu, getTreeRoleMenuIds } from '../../request/modules/MenuApi';
import { DateValue, SelectValue, TreeNodeValue, MessagePlugin, FormRules, Data, TreeNodeModel, SwitchValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, FilePasteIcon } from 'tdesign-icons-vue-next';
export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    FilePasteIcon
  },
  setup() {
    const setArrt = reactive({
      searchData: {
        beginTime: '',
        enable: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
        roleName: '',
        roleNameCn: ''
      },
      titleData: {
        beginTime: '',
        enable: '',
        endTime: '',
        roleName: '',
        roleNameCn: ''
      },
      id: 0,
      current: 2,
      total: 0,
      sexOption: [
        { label: '全部', value: '' },
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 }
      ],
      data: [],
      columns: [
        { colKey: 'id', title: '编号', align: 'center' },
        { colKey: 'roleName', title: '权限字符', align: 'center' },
        { colKey: 'roleNameCn', title: '角色名', align: 'center' },
        // { colKey: 'roleAuthority', title: '权限字符' },
        // { colKey: 'roleSort', title: '显示顺序' },
        {
          colKey: 'enable',
          title: '状态',
          slots: { customRender: 'enable' },
          align: 'center'
        },
        { colKey: 'createTime', title: '创建时间', align: 'center' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' },
          align: 'center'
        }
      ],
      formRules: {
        roleNameCn: [{ required: true, message: '角色名必填', trigger: 'blur' }],
        roleName: [{ required: true, message: '权限字符必填', trigger: 'blur' }],
        roleSort: [{ required: true, message: '显示顺序必填', trigger: 'blur' }],
        enable: [{ required: true, message: '状态必填', trigger: 'blur' }],
        menuIds: [{ required: true, message: '权限菜单必填', trigger: 'blur' }]
      },
      addVisible: false,
      expandAllState: false,
      timeData: [],
      FormData: {
        enable: 1,
        menuIds: [],
        organizationId: 0,
        roleAuthority: '',
        roleName: '',
        roleNameCn: '',
        roleSort: 0,
        createTime: '',
        remark: ''
      },
      checkboxValue: [],
      dialogTitle: '',
      treeKeys: [],
      treeKey: 0,
      treeItems: [
        {
          id: '1',
          label: '1',
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
      getRoleList();
      getTree();
    });
    const change = (value: DateValue[]) => {
      setArrt.titleData.beginTime = value[0] as string;
      setArrt.titleData.endTime = value[1] as string;
    };

    const onChange = (id: number, enable: number) => {
      roleSwitchRoleEnable({ id: id, enable }).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('操作成功');
          getRoleList();
        }
      });
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
      setArrt.FormData.menuIds = [...checkedj, ...arr] as never[];
      console.log(setArrt.FormData.menuIds);
    };

    const onConfirmAnother = () => {
      if (setArrt.dialogTitle == '添加角色') {
        //新增
        roleAddRole(setArrt.FormData).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            setArrt.addVisible = false;
            setArrt.treeKeys = [];
            getRoleList();
          }
        });
      } else {
        //编辑
        const data = {
          id: setArrt.id,
          enable: setArrt.FormData.enable,
          menuIds: setArrt.FormData.menuIds,
          organizationId: setArrt.FormData.organizationId,
          roleAuthority: setArrt.FormData.roleAuthority,
          roleName: setArrt.FormData.roleName,
          roleNameCn: setArrt.FormData.roleNameCn,
          roleSort: setArrt.FormData.roleSort,
          createTime: setArrt.FormData.createTime || '',
          remark: setArrt.FormData.remark
        };
        roleEditRole(data).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            setArrt.addVisible = false;
            getRoleList();
          }
        });
      }
    };
    const close = () => {
      setArrt.addVisible = false;
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发');
    };
    const onCancel = () => {
      setArrt.addVisible = false;
    };

    const searchList = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
      setArrt.searchData.pageNum = 1;
      getRoleList();
    };
    const resetting = () => {
      setArrt.searchData = {
        beginTime: '',
        enable: '',
        endTime: '',
        pageNum: 1,
        pageSize: setArrt.searchData.pageSize,
        roleName: '',
        roleNameCn: ''
      };
      setArrt.titleData = {
        beginTime: '',
        enable: '',
        endTime: '',
        roleName: '',
        roleNameCn: ''
      };
      setArrt.timeData = [];
      getRoleList();
    };
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getRoleList = () => {
      roleList(setArrt.searchData as any).then((res: any) => {
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

    const edit = (value: number) => {
      setArrt.checkboxValue = [];
      setArrt.id = value;
      displayData(value, '编辑角色');
    };

    const displayData = (value: number, text: string) => {
      getDetail({ id: value }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          setArrt.FormData = {
            menuIds: [],
            organizationId: res.data.organizationId,
            roleAuthority: res.data.roleAuthority,
            roleName: res.data.roleName,
            enable: res.data.enable,
            roleNameCn: res.data.roleNameCn,
            roleSort: res.data.roleSort,
            createTime: res.data.createTime,
            remark: res.data.remark
          };
          getTreeRoleMenuIds({ roleId: value }).then((res: any) => {
            if (res.code === 200) {
              let arr: number[] = [];
              for (let i = 0; i < res.data.length; i++) {
                if (setArrt.treeItems.findIndex(item => item.id == res.data[i]) == -1) {
                  if (!arr.includes(res.data[i])) {
                    arr.push(res.data[i]);
                  }
                }
              }
              for (let i = 0; i < setArrt.treeItems.length; i++) {
                if (!setArrt.treeItems[i].children || setArrt.treeItems[i].children.length === 0) {
                  if (res.data.includes(setArrt.treeItems[i].id) && !arr.includes(Number(setArrt.treeItems[i].id))) {
                    console.log(setArrt.treeItems[i]);
                    arr.push(Number(setArrt.treeItems[i].id));
                  }
                }
              }
              setArrt.treeKeys = arr as never[];
              setArrt.FormData.menuIds = res.data;
              setArrt.dialogTitle = text;
              setArrt.addVisible = true;
            }
          });
        }
      });
    };

    const del = (value: number) => {
      roleremoveUser({
        id: value
      }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          getRoleList();
          MessagePlugin.success('操作成功');
        }
      });
    };

    const getTree = () => {
      getTreeMenu().then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          setArrt.treeItems = res.data;
        }
      });
    };

    const addItem = () => {
      setArrt.dialogTitle = '添加角色';
      setArrt.addVisible = true;
      setArrt.checkboxValue = [];
      setArrt.FormData = {
        enable: 1,
        menuIds: [],
        organizationId: 0,
        roleAuthority: '',
        roleName: '',
        roleNameCn: '',
        roleSort: 0,
        createTime: '',
        remark: ''
      };
      setArrt.treeKeys = [];
    };

    const itemDetails = (value: number) => {
      displayData(value, '详细信息');
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getRoleList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getRoleList();
    };
    const allExpand = (check: boolean) => {
      setArrt.expandAllState = check;
      setArrt.treeKey += 1;
    };
    const allSelect = (check: boolean) => {
      console.log(check, setArrt.treeItems.length);
      if (check) {
        let arr: Array<TreeNodeValue> = [];
        for (let i = 0; i < setArrt.treeItems.length; i++) {
          if (!setArrt.treeItems[i].children || setArrt.treeItems[i].children.length == 0) {
            arr.push(setArrt.treeItems[i].id);
            break;
          }
          for (let j = 0; j < setArrt.treeItems[i].children.length; j++) {
            console.log(setArrt.treeItems[i].children[j].id);
            arr.push(setArrt.treeItems[i].children[j].id);
          }
        }
        checked(arr);
      } else {
        setArrt.treeKeys = [];
      }
    };

    return {
      ...toRefs(setArrt),
      onChange,
      change,
      searchList,
      resetting,
      edit,
      del,
      onConfirmAnother,
      close,
      onCancel,
      checked,
      addItem,
      itemDetails,
      pageSizeChange,
      currentChange,
      allSelect,
      allExpand,
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
    flex-wrap: wrap;
    padding: 0 15px;
    margin-bottom: 16px;
    background-color: #ffffff;

    .search-item {
      margin: 10px 25px 10px 0;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 280px;
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
