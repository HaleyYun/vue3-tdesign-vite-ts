<template>
  <div class="user-box">
    <div class="search-box">
      <!-- 暂不需要 -->
      <!-- <div class="search-item">角色名称:<t-input class="ipt-slt" v-model="searchData.name" auto-width /></div>
            <div class="search-item">权限字符:<t-input class="ipt-slt" v-model="searchData.channel" auto-width /></div>
            <t-button class="search-item" theme="primary">
                <template #icon>
                    <SearchIcon />
                </template>搜索</t-button>
            <t-button variant="outline" theme="primary">重置条件</t-button> -->
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addItem(undefined)">
          <template #icon> <AddIcon /> </template>新建</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="id" :max-height="fixedTopRows ? 1400 : 520" :columns="(columns as PrimaryTableCol<TableRowData>[])" :data="data" :expanded-row-keys="expandedRowKeys" :expand-on-row-click="true" :expand-icon="true" table-layout="fixed" @expand-change="rehandleExpandChange">
        <template #expandedRow="{ row }">
          <t-table row-key="index" v-if="row.children && row.children.length > 0" :data="row.children" :columns="(itemColumns as PrimaryTableCol<TableRowData>[])" size="medium" bordered table-layout="fixed">
            <template #actionOne="actionOne">
              <t-button variant="text" theme="primary" size="small" class="btn-c-blue" @click.stop="editItem(actionOne.row.id, false)">编辑</t-button>
              <!-- <span class="btn-c-blue m-l">添加</span> -->
              <t-popconfirm content="确认删除吗" theme="danger" @confirm="deleteItem(actionOne.row.id)">
                <t-button variant="text" theme="danger" size="small">删除</t-button>
              </t-popconfirm>
            </template>
          </t-table>
        </template>
        <template #enable="{ row }">
          <t-button :theme="row.enable == 1 ? 'primary' : 'danger'" disabled>{{ row.enable == 1 ? '正常' : '禁用' }}</t-button>
        </template>
        <template #action="{ row }">
          <t-button variant="text" theme="success" size="small" class="btn-c-blue" @click.stop="editItem(row.id, false)"> 编辑</t-button>
          <t-button variant="text" theme="primary" size="small" class="btn-c-blue m-l" @click.stop="addItem(row.id)"> 添加</t-button>
          <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="deleteItem(row.id)">
            <t-button variant="text" theme="danger" size="small"> 删除</t-button>
          </t-popconfirm>
        </template>
      </t-table>
    </div>

    <t-dialog v-model:visible="addVisible" :header="visibleTitle" width="1000px" @confirm="submitForm">
      <t-form layout="inline" :data="addFormData" :rules="(formRules as FormRules<Data>)">
        <t-form-item class="w100" label="上级菜单:" name="parentId" initial-data="TDesign">
          <t-select v-model="addFormData.parentId" :disabled="addFormData.menuType == 1 ? true : false" :keys="{ value: 'id', label: 'label' }" :options="menuTreeSelect" placeholder="请选择父级id" />
        </t-form-item>
        <t-form-item class="w100" label="菜单类型:" name="menuType" initial-data="123456">
          <t-radio-group v-model="addFormData.menuType" @change="radioChange">
            <t-radio :value="1">目录</t-radio>
            <t-radio :value="2">菜单</t-radio>
            <!-- <t-radio value="3">按钮</t-radio> -->
          </t-radio-group>
        </t-form-item>
        <t-form-item class="w100" label="菜单图标:" name="icon" initial-data="123456">
          <t-select v-model="addFormData.icon" placeholder="请选择" :style="{ width: '400px' }" clearable :popup-props="{ overlayInnerStyle: { width: '400px' } }">
            <t-option v-for="item in options" :key="item.stem" :value="item.stem" class="overlay-options">
              <div>
                <t-icon :name="item.stem" />
              </div>
            </t-option>
            <template #valueDisplay><t-icon :name="addFormData.icon" :style="{ marginRight: '8px' }" />{{ addFormData.icon }}</template>
          </t-select>
          <!-- <t-input v-model="addFormData.icon" placeholder="请输入菜单图标" :maxlength="50" /> -->
        </t-form-item>
        <t-form-item class="w50" label="菜单名称:" name="menuName" initial-data="123456">
          <t-input v-model="addFormData.menuName" placeholder="请输入菜单名称" :maxlength="50" />
        </t-form-item>
        <t-form-item class="w50" label="显示排序:" name="sort" initial-data="123456">
          <t-input-number v-model="addFormData.sort" :min="0" placeholder="请输入角色顺序" :maxlength="50" />
        </t-form-item>
        <t-form-item class="w50" label="是否外链:" name="isFrame">
          <t-radio-group v-model="addFormData.isFrame">
            <t-radio value="1">是</t-radio>
            <t-radio value="2">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item class="w50" label="路由地址:" name="path" initial-data="TDesign">
          <t-input v-model="addFormData.path" placeholder="请输入路由地址" :maxlength="50" />
        </t-form-item>

        <t-form-item class="w50" v-show="addFormData.menuType == 2" label="组件路径:" name="component" initial-data="123456">
          <t-input v-model="addFormData.component" placeholder="请输入组件路径" :maxlength="50" />
        </t-form-item>
        <t-form-item class="w50" v-show="addFormData.menuType == 2" label="权限字符:" name="perms" initial-data="123456">
          <t-input v-model="addFormData.perms" placeholder="请输入权限标识" :maxlength="50" />
        </t-form-item>
        <t-form-item class="w50" label="显示状态:" name="visible">
          <t-radio-group v-model="addFormData.visible">
            <t-radio :value="1">显示</t-radio>
            <t-radio :value="0">隐藏</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item class="w50" label="菜单状态:" name="enable">
          <t-radio-group v-model="addFormData.enable">
            <t-radio :value="1">正常</t-radio>
            <t-radio :value="0">停用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { getMenu, addMenu, menuFindById, editMenu, deleteMenu, getTreeMenu } from '../../request/modules/MenuApi';
import { DateValue, MessagePlugin, RadioValue, FormRules, Data, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { AddIcon, DeleteIcon, SearchIcon, EditIcon, DiscountIcon, manifest } from 'tdesign-icons-vue-next';
import { AddMenuType } from '../../request/types/Menu';
import { ItemChildrenType } from '@/view/types/Menu';
import load from '../../components/load/load.vue';
export default {
  components: {
    AddIcon,
    DeleteIcon,
    SearchIcon,
    EditIcon,
    load
  },
  setup() {
    const setArrt = reactive({
      searchData: {
        name: '',
        channel: '',
        sex: ''
      },
      sexOption: [
        { label: '男', value: '1', title: '架构云选项' },
        { label: '女', value: '2' }
      ],
      options: manifest,
      data: [],
      formRules: {
        parentId: [{ required: true, message: '上级菜单必填', trigger: 'blur' }],
        menuType: [{ required: true, message: '菜单类型必填', trigger: 'blur' }],
        icon: [{ required: true, message: '菜单图标必填', trigger: 'blur' }],
        menuName: [{ required: true, message: '菜单名称必填', trigger: 'blur' }],
        sort: [{ required: true, message: '显示排序必填', trigger: 'blur' }],
        isFrame: [{ required: true, message: '是否外链必填', trigger: 'blur' }],
        path: [{ required: true, message: '路由地址必填', trigger: 'blur' }],
        component: [{ required: true, message: '组件路径必填', trigger: 'blur' }],
        perms: [{ required: true, message: '权限字符必填', trigger: 'blur' }],
        visible: [{ required: true, message: '显示状态必填', trigger: 'blur' }],
        enable: [{ required: true, message: '菜单状态必填', trigger: 'blur' }]
      },
      columns: [
        { colKey: 'id', title: '编号', align: 'center' },
        { colKey: 'menuName', title: '菜单名称', align: 'center' },
        { colKey: 'icon', title: '图标', align: 'center' },
        { colKey: 'sort', title: '排序', align: 'center' },
        { colKey: 'perms', title: '权限标识', align: 'center' },
        { colKey: 'component', title: '组件路径', align: 'center' },
        { colKey: 'enable', title: '状态', slots: { customRender: 'enable' }, align: 'center' },
        { colKey: 'createTime', title: '创建时间', align: 'center', width: '180px' },
        {
          title: '操作',
          colKey: 'action',
          align: 'center',
          width: '230px',
          slots: { customRender: 'action' }
        }
      ],
      itemColumns: [
        { colKey: 'id', title: '编号', align: 'center' },
        { colKey: 'menuName', title: '菜单名称', align: 'center' },
        { colKey: 'icon', title: '图标', align: 'center' },
        { colKey: 'sort', title: '排序', align: 'center' },
        { colKey: 'perms', title: '权限标识', align: 'center' },
        { colKey: 'component', title: '组件路径', align: 'center' },
        { colKey: 'enable', title: '状态', align: 'center' },
        { colKey: 'time', title: '创建时间', align: 'center' },
        {
          title: '操作',
          colKey: 'actionOne',
          align: 'center',
          fixed: 'right',
          width: '180px',
          slots: { customRender: 'actionOne' }
        }
      ],
      addVisible: false,
      visibleTitle: '添加菜单',
      expandedRowKeys: [],
      addFormData: {
        component: '',
        sort: undefined,
        perms: '',
        path: '',
        parentId: 0,
        menuType: undefined,
        menuName: '',
        isFrame: '',
        icon: '',
        enable: 1,
        createUser: '',
        visible: 1
      },
      menuTreeSelect: [{ label: '主目录', id: 0 }]
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
      getMenuList();
      getTree();
    });
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    const getMenuList = () => {
      getMenu().then((res: any) => {
        if (res.code == 200) {
          //接口正常
          if (res.data == null || res.data.total == 0) {
            //无数据
            (loadStatus.value = 'noData'), (setArrt.data = []);
          } else {
            setArrt.data = res.data;
          }
        } else {
          (loadStatus.value = 'failure'), (setArrt.data = []);
        }
      });
    };
    const rehandleExpandChange = (value: Array<string | number>) => {
      setArrt.expandedRowKeys = value as never[];
    };
    const addItem = (id: number | undefined) => {
      setArrt.visibleTitle = '添加菜单';
      setArrt.addVisible = true;
      setArrt.addFormData = {
        component: '',
        sort: undefined,
        perms: '',
        path: '',
        parentId: 0,
        menuType: undefined,
        menuName: '',
        isFrame: '',
        icon: '',
        enable: 1,
        createUser: '',
        visible: 1
      };
      if (id !== undefined) {
        (setArrt.addFormData as AddMenuType).parentId = id;
      }
    };
    const submitForm = () => {
      if (setArrt.visibleTitle === '添加菜单') {
        addMenu(setArrt.addFormData).then((res: any) => {
          if (res.code === 200) {
            setArrt.addVisible = false;
            MessagePlugin.success('添加成功');
            setArrt.addFormData = {
              component: '',
              sort: undefined,
              perms: '',
              path: '',
              parentId: 0,
              menuType: undefined,
              menuName: '',
              isFrame: '',
              icon: '',
              enable: 1,
              createUser: '',
              visible: 1
            };
            getTree();
            getMenuList();
          }
        });
      } else if (setArrt.visibleTitle === '修改菜单') {
        editMenu(setArrt.addFormData).then((res: any) => {
          if (res.code === 200) {
            setArrt.addVisible = false;
            MessagePlugin.success('修改成功');
            setArrt.addFormData = {
              component: '',
              sort: undefined,
              perms: '',
              path: '',
              parentId: 0,
              menuType: undefined,
              menuName: '',
              isFrame: '',
              icon: '',
              enable: 1,
              createUser: '',
              visible: 1
            };
            getMenuList();
          }
        });
      }
    };
    const editItem = (id: number, idState: boolean) => {
      console.log('===', id);
      menuFindById({ id: id }).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          delete res.data.createTime;
          if (idState) {
            delete res.data.id;
          }
          setArrt.addFormData = res.data;
          setArrt.addVisible = true;
          setArrt.visibleTitle = '修改菜单';
          console.log(setArrt.addFormData);
        }
      });
    };
    const deleteItem = (id: number) => {
      deleteMenu({ id }).then((res: any) => {
        if (res.code === 200) {
          console.log(id);
          getMenuList();
        }
      });
    };
    const getTree = () => {
      getTreeMenu().then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          setArrt.menuTreeSelect = [...setArrt.menuTreeSelect, ...res.data];
        }
      });
    };
    const radioChange = (value: RadioValue) => {
      console.log(value);
      if (value === 1) {
        setArrt.addFormData.parentId = 0;
      }
    };

    return {
      ...toRefs(setArrt),
      rehandleExpandChange,
      submitForm,
      editItem,
      addItem,
      deleteItem,
      radioChange,
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
    padding: 0 15px;
    margin-bottom: 16px;

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

  .tree-box {
    height: 300px;
    width: 100%;
    overflow-y: auto;
    border: 1px #999999 solid;
    border-radius: 8px;
  }

  // .t-pagination {
  //   margin-top: 20px;
  // }

  .w100 {
    width: 96.5%;
  }

  .w50 {
    width: 47%;
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

<style>
.overlay-options {
  display: inline-block;
  font-size: 20px;
}
</style>
