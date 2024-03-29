<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item search-item-font">服务规则：<t-input class="ipt-slt" v-model="newSearchData.servName" auto-width /></div>
      <div class="search-item search-item-font">服务状态：<t-select class="ipt-slt" v-model="newSearchData.servStatus" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">销售端口：<t-select class="ipt-slt" v-model="newSearchData.port" :options="portOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary" @click="search"> 搜索</t-button>
      <t-button variant="outline" theme="primary" @click="rest">重置</t-button>
      <div class="operate-box">
        <t-button class="btn-item" theme="primary" @click="addSer">
          <template #icon> <AddIcon /> </template>新增</t-button
        >
      </div>
    </div>

    <load :status="loadStatus" :schedule="schedule" v-if="data?.length == 0"></load>
    <div class="tab-box" v-else>
      <t-table row-key="id" :data="data" :max-height="fixedTopRows ? 1200 : 460" :columns="(columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="auto" :bordered="false">
        <template #isIntervene="{ row }">
          <span>{{ row.isIntervene == 1 ? '是' : '否' }}</span>
        </template>
        <template #servStatus="{ row }">
          <span>{{ row.servStatus == 1 ? '启用' : '禁用' }}</span>
        </template>
        <template #port="{ row }">
          <span v-if="row.port == 'pro'">PRO端</span>
          <span v-if="row.port == 'lite'">LITE端</span>
          <span v-if="row.port == ''">--</span>
        </template>
        <template #interveneCycle="{ row }">
          <span v-if="row.isIntervene === 1"> {{ row.interveneCycle < 360 ? row.interveneCycle + '天' : '全年' }}</span>
          <span v-if="row.isIntervene === 0">--</span>
        </template>
        <template #updateTime="dataTime">
          <span>{{ dataTime.row.updateTime ? dataTime.row.updateTime : dataTime.row.createTime }}</span>
        </template>
        <template #action="{ row }">
          <div class="action">
            <t-button size="small" variant="text" @click="edit(row.id)" theme="success">编辑</t-button>
          </div>
        </template>
      </t-table>
      <t-pagination :pageSize="searchData.pageSize" v-model:current="searchData.pageNum" :total="total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>

    <t-dialog v-model:visible="addVisible" width="900px" :on-cancel="onCancel" :on-close="close" :on-confirm="onConfirmService" :header="dialogTitle" destroy-on-Close>
      <t-form :data="serData" :colon="true" :rules="(formRules as FormRules<Data>)">
        <t-form-item requiredMark label="服务规则" name="servName">
          <t-input class="ipt-slt" v-model="serData.servName" placeholder="请输入服务规则名称" />
        </t-form-item>
        <div class="screenContent">
          <div class="content-title"><span class="title">*</span>本次配置规则内容<span class="title">(至少选择一个)</span></div>
          <div>
            <t-checkbox-group v-model="checked" class="checkboxTwo" name="group" @change="onCheck">
              <t-checkbox :value="0">筛查配置</t-checkbox>
              <t-checkbox :value="1">干预配置</t-checkbox>
            </t-checkbox-group>
          </div>

          <div v-if="!showScreen && !showIntervene" class="noScreenData">
            <span class="notTitle">请先选择本次规则所需配置的服务内容~</span>
          </div>
          <div v-else>
            <div v-if="showScreen" class="distance">
              <div>筛查服务</div>
              <div class="screenData">
                <div class="search-item">
                  <div class="search-itemr">销售端口:<t-select class="ipt-slt" v-model="serData.port" @change="changePort" :options="serAddOption" placeholder="请选择销售端口"></t-select></div>
                  <div class="search-itemr">
                    筛查服务:<t-cascader v-model="chList" class="ipt-slt" :disabled="showDisabled" :options="checkData" multiple size="medium" :min-collapsed-num="1" @remove="handleBlur" @change="onChange" placeholder="请选择筛查服务" clearable>
                      <template #collapsedItems="{ collapsedSelectedItems, count }">
                        <t-popup>
                          <template #content>
                            <!-- <p v-for="(item, index) in collapsedSelectedItems" :key="index" style="padding: 10px">
                            {{ item }}
                          </p> -->
                          </template>
                          <span v-show="count > 0" style="color: #00a870; margin-left: 10px">已选中{{ count + 1 }}个筛查服务</span>
                        </t-popup>
                      </template>
                    </t-cascader>
                  </div>
                </div>
                <!-- <div class="search-item">筛查次数:<t-input-number class="slt" @keyup="onKeyup" @change="onDayCount" :min="0" type="number" v-model="serData.checkCount" />次</div>
                <div class="search-item" v-if="serData.checkCount > '1'">筛查间隔:<t-input-number @keyup="onKeyDay" class="slt" @change="onDay" :min="1" type="number" v-model="serData.checkInterval" />天</div> -->
              </div>
            </div>
            <div v-if="showIntervene" class="distance">
              <div>干预配置</div>
              <div class="screenIntervene">
                <div class="search-item">
                  干预周期:
                  <t-select class="ipt-slt" v-model="serData.interveneCycleName" placeholder="请选择干预周期" @change="onInterChange">
                    <t-option v-for="(item, index) in intervenData" :key="index" :label="item.dictLabel" :value="item.dictValue" />
                  </t-select>
                </div>

                <div class="search-item">干预内容:<t-checkbox-group v-model="checkedItem" class="slt" :options="itemOptions" name="groupItem" @change="onCheckItem"> </t-checkbox-group></div>
              </div>
            </div>
          </div>
        </div>

        <t-form-item requiredMark label="状态" name="servStatus">
          <t-radio-group v-model="serData.servStatus">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="0">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { MessagePlugin, FormRules, Data, TreeNodeModel, CascaderValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { AddIcon, SearchIcon, EditIcon } from 'tdesign-icons-vue-next';
import { queryService, addService, updateService, getService, checkTypeService } from '../../request/modules/ServiceApi';
import { debounce } from '../../utils/tools';
import { dictData } from '@/request/modules/dictData';
import load from '../../components/load/load.vue';

export default {
  components: {
    AddIcon,
    SearchIcon,
    EditIcon,
    load
  },
  setup() {
    const showDisabled = ref<boolean>(true); //是否可选
    const checked = ref<any>([]);
    const showScreen = ref<boolean>(false);
    const showIntervene = ref<boolean>(false);
    const checkedItem = ref<any>(['game', 'eat', 'sport']);
    const checkboxOptions = ref([
      { value: '0', label: '筛查配置' },
      { value: '1', label: '干预配置' }
    ]);
    const itemOptions = ref([
      { value: 'game', label: '数字化干预' },
      { value: 'eat', label: '膳食干预' },
      { value: 'sport', label: '运动干预' }
    ]);
    const setArrt = reactive({
      searchData: {
        servName: '',
        servStatus: '',
        pageNum: 1,
        pageSize: 10,
        port: ''
      },
      newSearchData: {
        servName: '',
        servStatus: '',
        port: ''
      },
      serData: {
        // checkCount: '',
        // checkInterval: '1',
        port: '',
        createTime: '',
        createUser: '',
        isDelete: 0,
        // isIntervene: undefined,
        interveneCycle: undefined,
        interveneCycleName: '',
        // checkValueList: [],
        checkType: '',
        remark: '',
        servName: '',
        servStatus: 1,
        updateTime: '',
        updateUser: '',
        checkList: [{ checkService: '', checkServiceName: '', value: '', imageUrl: '', path: '' }],
        pageNum: 1,
        pageSize: 10,
        isCheck: '',
        isIntervene: '',
        interveneList: []
      },
      // checkValueList: [
      //   { label: "", value: "" },
      // ] as any,
      checkName: [] as any,
      proOption: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      portOption: [
        { label: '全部', value: '' },
        { label: 'PRO端', value: 'pro' },
        { label: 'LITE端', value: 'lite' }
      ],
      serAddOption: [
        { label: 'PRO端', value: 'pro' },
        { label: 'LITE端', value: 'lite' }
      ],
      formRules: {
        servName: [{ required: true, message: '服务规则名称必填', trigger: 'blur' }],
        checkCount: [{ required: true, message: '筛查数量必填', trigger: 'blur' }],
        // isIntervene: [{ required: true, message: '是否干预必填', trigger: 'blur' }],
        // interveneCycle: [{ required: true, message: '干预周期必填', trigger: 'blur' }],
        checkType: [{ required: true, message: '筛查服务必填', trigger: 'blur' }],
        servStatus: [{ required: true, message: '服务状态必填', trigger: 'blur' }]
      },
      chList: [] as any,
      id: 0,
      dialogTitle: '',
      total: 0,
      data: [],
      checkData: [],
      intervenData: [{ dictLabel: '', dictValue: '' }],
      columns: [
        { colKey: 'id', title: '序号', align: 'center' },
        { colKey: 'servName', title: '服务规则', align: 'center' },
        // { colKey: 'checkCount', title: '筛查次数' },
        {
          colKey: 'port',
          title: '销售端口',
          align: 'center',
          slots: { customRender: 'port' }
        },
        {
          colKey: 'isIntervene',
          title: '是否干预',
          align: 'center',
          slots: { customRender: 'isIntervene' }
        },
        {
          colKey: 'servStatus',
          title: '状态',
          align: 'center',
          slots: { customRender: 'servStatus' }
        },
        { colKey: 'interveneCycle', align: 'center', title: '干预周期' },
        {
          colKey: 'updateTime',
          title: '操作时间',
          width: '180px',
          align: 'center',
          slots: { customRender: 'updateTime' }
        },
        {
          title: '操作',
          colKey: 'action',
          align: 'center',
          width: '140px',
          slots: { customRender: 'action' }
        }
      ],
      addVisible: false
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
      getServiceList();
      getCheckTypeService();
      getDictData();
    });

    const onConfirmService = debounce(
      () => {
        setArrt.searchData = {
          servName: '',
          servStatus: '',
          port: '',
          pageNum: 1,
          pageSize: 10
        };
        setArrt.newSearchData = {
          servName: '',
          servStatus: '',
          port: ''
        };
        // let ret = /^\+?[1-9][0-9]*$/; //正整数
        // if (!ret.test(setArrt.serData.checkCount)) {
        //   MessagePlugin.error('筛查次数格式不对');
        //   return;
        // }
        // if (!ret.test(setArrt.serData.checkCount)) {
        //   MessagePlugin.error('筛查间隔格式不对');
        //   return;
        // }
        if (checked.value == '') {
          MessagePlugin.error('至少选择一个配置规则');
          return;
        }
        if (checkedItem.value == '') {
          MessagePlugin.error('干预内容不能为空');
          return;
        }
        // if (setArrt.serData.checkList.length == 0) {
        //   MessagePlugin.error('筛查服务不能为空');
        //   return;
        // }
        // console.log(setArrt.serData.checkList, 'kkkk');

        // if (setArrt.serData.checkCount <= 0) {
        //   MessagePlugin.error('筛查数量最小为1');
        //   return;
        // }

        // console.log(setArrt.serData.checkList);
        if (setArrt.dialogTitle === '服务规则') {
          setArrt.serData.isCheck = showScreen.value ? '1' : '0';
          setArrt.serData.isIntervene = showIntervene.value ? '1' : '0';
          setArrt.serData.interveneList = checkedItem.value;
          let data = setArrt.checkData as any;

          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            for (let j = 0; j < setArrt.chList.length; j++) {
              const itm = setArrt.chList[j];
              if (el.value == itm) {
                // setArrt.serData.checkList.push({ checkService: itm, checkServiceName: el.label })
              } else {
                el.children.forEach((chil: any) => {
                  if (chil.value == itm) {
                    setArrt.serData.checkList.push({ checkService: chil.name, checkServiceName: chil.label, value: chil.value, imageUrl: chil.imageUrl, path: chil.path });
                  }
                });
              }
            }
          }
          //如果mei选中筛查配置
          if (!showScreen.value) {
            setArrt.checkData = [];
            setArrt.chList = [];
            setArrt.serData.checkList = [];
            // setArrt.serData.checkCount = '';
            // setArrt.serData.checkInterval = '1';
          }
          //如果没选中干预配置
          if (!showIntervene.value) {
            setArrt.serData.interveneCycleName = '';
            setArrt.serData.interveneCycle = undefined;
          }
          console.log(setArrt.serData);
          addService(setArrt.serData as any).then((res: any) => {
            if (res.code === 200) {
              showDisabled.value = true;
              MessagePlugin.success(res.msg);
              setArrt.chList = [];
              setArrt.addVisible = false;
              showIntervene.value = false;
              showScreen.value = false;
              checked.value = [];
              getServiceList();
            }
          });
        } else {
          // if (setArrt.serData.checkInterval == '') {
          //   MessagePlugin.error('筛查间隔不能为空');
          //   return;
          // }
          let datas = setArrt.checkData as any;
          console.log(datas, '00000');

          for (let i = 0; i < datas.length; i++) {
            const el = datas[i];
            for (let j = 0; j < setArrt.chList.length; j++) {
              const itm = setArrt.chList[j];
              if (el.value == itm) {
              } else {
                el.children.forEach((chil: any) => {
                  if (chil.value == itm) {
                    setArrt.serData.checkList.push({ checkService: chil.name, checkServiceName: chil.label, value: chil.value, imageUrl: chil.imageUrl, path: chil.path });
                  }
                });
              }
            }
          }
          let deWeightThree = () => {
            let map = new Map();
            for (let item of setArrt.serData.checkList) {
              if (!map.has(item.checkService)) {
                map.set(item.checkService, item);
              }
            }
            return [...map.values()];
          };
          let newArr3 = deWeightThree();

          //如果mei选中筛查配置

          if (!showScreen.value) {
            setArrt.checkData = [];
            setArrt.chList = [];
            setArrt.serData.checkList = [];
            // setArrt.serData.checkCount = '';
            // setArrt.serData.checkInterval = '1';
          }

          //如果没选中干预配置
          if (!showIntervene.value) {
            setArrt.serData.interveneCycleName = '';
            setArrt.serData.interveneCycle = undefined;
          }
          if (setArrt.chList == '') {
            newArr3 = [];
          }
          // 编辑
          let data = {
            id: setArrt.id,
            isCheck: showScreen.value ? '1' : '0',
            isIntervene: showIntervene.value ? '1' : '0',
            // checkCount: setArrt.serData.checkCount,
            // checkInterval: setArrt.serData.checkInterval,
            interveneList: setArrt.serData.interveneList,
            checkType: setArrt.serData.checkType,
            checkList: newArr3,
            createTime: setArrt.serData.createTime,
            interveneCycle: setArrt.serData.interveneCycle,
            createUser: setArrt.serData.createUser,
            isDelete: setArrt.serData.isDelete,
            // isIntervene: setArrt.serData.isIntervene,
            remark: setArrt.serData.remark,
            servName: setArrt.serData.servName,
            servStatus: setArrt.serData.servStatus,
            updateTime: setArrt.serData.updateTime,
            updateUser: setArrt.serData.updateUser,
            port: setArrt.serData.port
          };

          console.log(data.checkList, '444');
          // return;
          updateService(data as any).then((res: any) => {
            if (res.code === 200) {
              // showDisabled.value = true;
              setArrt.addVisible = false;
              setArrt.chList = [];
              MessagePlugin.success(res.msg);
              getServiceList();
            }
          });
        }
      },
      300,
      false
    );
    let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
    let schedule = ref<number>(20); //加载中进度
    // 获取服务规则列表
    const getServiceList = () => {
      queryService(setArrt.searchData as any).then((res: any) => {
        if (res.code === 200) {
          if (res.data.total == 0) {
            setArrt.data = [];
            loadStatus.value = 'noData';
          } else {
            setArrt.data = res.data.data;
            setArrt.total = res.data.total;
          }
        } else {
          (setArrt.data = []), (loadStatus.value = 'failure');
        }
      });
    };

    // 获取干预周期字典
    const getDictData = () => {
      dictData({ dictType: 'intervene_cycle' }).then((res: any) => {
        if (res.code === 200) {
          setArrt.intervenData = res.data;
        }
      });
    };
    //筛查服务
    const getCheckTypeService = () => {
      checkTypeService({ port: setArrt.serData.port }).then((res: any) => {
        if (res.code === 200) {
          let newData = [] as any;
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            let children = [] as any;
            if (el.selectResponseList.length > 0) {
              newData.push({
                label: el.label,
                value: el.value,
                children: children
              });
              for (let j = 0; j < el.selectResponseList.length; j++) {
                const sl = el.selectResponseList[j];
                children.push({
                  label: sl.label,
                  name: sl.value,
                  value: sl.key,
                  imageUrl: sl.imagePath,
                  path: sl.redirectPath
                });
              }
            }
          }

          setArrt.checkData = newData;
      
        }
      });
    };

    const onInterChange = (value: any) => {
      for (let i = 0; i < setArrt.intervenData.length; i++) {
        const el = setArrt.intervenData[i];
        if (Number(value) == Number(el.dictValue)) {
          setArrt.serData.interveneCycleName = el.dictLabel;
          let num: any = el.dictValue;
          setArrt.serData.interveneCycle = num;
        }
      }
    };

    // const onDayCount = val => {
    //   if (val > 1) {
    //     setArrt.serData.checkInterval = '1';
    //   }
    // };
    // const onKeyup = val => {
    //   setArrt.serData.checkCount = val.replace(/[^\d]/g, '');
    // };

    // const onDay = val => {
    //   if (val == 0) {
    //     setArrt.serData.checkInterval = '1';
    //   }
    // };
    // const onKeyDay = val => {
    //   setArrt.serData.checkInterval = val.replace(/[^\d]/g, '');
    // };
    const onChange = (value: any, context: any) => {
      // log
      // console.log('删除', context);
      console.log(value, 'ppppp');

      // console.log(setArrt.chList);
      // console.log(setArrt.serData.checkList)
      if (value.length > 0) {
        setArrt.serData.checkList = [];
      }
      setArrt.chList = value;
      // if (setArrt.chList.length) {
      //   setArrt.chList = setArrt.chList.concat(value)
      // } else {
      //   setArrt.chList = value
      // }
      // console.log(setArrt.chList)
      // setArrt.serData.checkList = value;
      // if (context.node) {
      //   if (context.node?.value) {
      //     if (!context.node.checked) {
      //       setArrt.serData.checkList.push({ checkService: context.node.data.value, checkServiceName: context.node.data.label })
      //     }
      //   } else {
      //     if (!context.node.checked) {
      //       context.node.data.children.forEach((el: any) => {
      //         setArrt.serData.checkList.push({ checkService: el.value, checkServiceName: el.label })
      //       });
      //     }
      //   }
      // }
      // const obj: { [key: string]: boolean } = {};
      // setArrt.serData.checkList.reduce((item: any, next: any) => {
      //   if (!obj[next.checkService]) {
      //     item.push(next);
      //     obj[next.checkService] = true;
      //   }
      //   return item;
      // }, []);
      // console.log(setArrt.serData.checkList)
    };

    const handleBlur = (context: any) => {
      // console.log(context.node.value);
      // console.log(context.value);
      // console.log(setArrt.chList);
      // console.log(setArrt.serData.checkList);
      return;
      if (!setArrt.serData.checkList) {
        setArrt.chList.forEach((el: any, index: number) => {
          if (el == context.node.value) {
            setArrt.chList.splice(index, 1);
          }
        });
        return;
      } else {
        setArrt.serData.checkList.forEach((el: any, index: number) => {
          if (el.value == context.node.value) {
            setArrt.serData.checkList.splice(index, 1);
          }
        });
        return;
      }
      console.log(setArrt.serData.checkList);
      // setArrt.chList = e.value;
      // setArrt.serData.checkList = e.value;
    };

    const addSer = () => {
      setArrt.dialogTitle = '服务规则';
      getCheckTypeService();
      setArrt.serData = {
        // checkCount: '',
        // checkInterval: '1',
        port: '',
        createTime: '',
        createUser: '',
        isDelete: 0,
        // isIntervene: undefined,
        interveneCycle: undefined,
        interveneCycleName: '',
        // checkValueList: [],
        checkType: '',
        remark: '',
        servName: '',
        servStatus: 1,
        updateTime: '',
        updateUser: '',
        checkList: [],
        pageNum: 1,
        pageSize: 10,
        isCheck: '',
        isIntervene: '',
        interveneList: []
      };
      checkedItem.value = ['eat', 'sport', 'game'];
      checked.value = [];
      showScreen.value = false;
      showIntervene.value = false;

      setArrt.addVisible = true;
    };
    const search = () => {
      setArrt.searchData = Object.assign(setArrt.searchData, setArrt.newSearchData);
      setArrt.searchData.pageNum = 1;
      getServiceList();
    };
    const edit = (value: number) => {
      setArrt.dialogTitle = '编辑服务';
      setArrt.addVisible = true;
      setArrt.id = value;
      getServices(value);
    };
    const getServices = (value: number) => {
      getService({ id: value }).then((res: any) => {
        if (res.code === 200) {
          for (let i = 0; i < setArrt.intervenData.length; i++) {
            const el = setArrt.intervenData[i];
            if (Number(res.data.interveneCycle) == Number(el.dictValue)) {
              res.data.interveneCycleName = el.dictLabel;
            }
          }
          setArrt.chList = res.data.checkList.map((item: any) => {
            return item.value;
          });
          setArrt.serData.port = res.data.port;
          console.log(setArrt.chList, 'etArrt.chList');
          checked.value = [res.data.isCheck == 1 ? 0 : '', res.data.isIntervene == 1 ? 1 : ''];
          showScreen.value = res.data.isCheck;
          showIntervene.value = res.data.isIntervene;
          checkedItem.value = res.data.interveneList;
          setArrt.serData = res.data;

          if (setArrt.serData.port) {
            showDisabled.value = false;
          }
          getCheckTypeService();
        }
      });
    };
    const rest = () => {
      setArrt.searchData = {
        servName: '',
        servStatus: '',
        port: '',
        pageNum: 1,
        pageSize: 10
      };
      setArrt.newSearchData = {
        servName: '',
        servStatus: '',
        port: ''
      };
      getServiceList();
    };
    const onCancel = () => {
      setArrt.chList = [];
      setArrt.addVisible = false;
      showDisabled.value = true;
      setArrt.searchData = {
        servName: '',
        servStatus: '',
        port: '',
        pageNum: 1,
        pageSize: 10
      };
      setArrt.newSearchData = {
        servName: '',
        servStatus: '',
        port: ''
      };
    };
    const close = () => {
      setArrt.chList = [];
      setArrt.addVisible = false;
      showDisabled.value = true;
      setArrt.searchData = {
        servName: '',
        servStatus: '',
        port: '',
        pageNum: 1,
        pageSize: 10
      };
      setArrt.newSearchData = {
        servName: '',
        servStatus: '',
        port: ''
      };
    };
    const pageSizeChange = (pageSize: number) => {
      setArrt.searchData.pageSize = pageSize;
      setArrt.searchData.pageNum = 1;
      getServiceList();
    };
    const currentChange = (current: number) => {
      setArrt.searchData.pageNum = current;
      getServiceList();
    };
    //多选(checked: boolean, context: { e: Event })
    const onCheck = (checked, context) => {
      if (context.current == '0') {
        if (checked.includes(0)) {
          showScreen.value = true;
        } else {
          setArrt.checkData = [];
          setArrt.chList = [];
          setArrt.serData.checkList = [];
          // setArrt.serData.checkCount = '';
          // setArrt.serData.checkInterval = '1';
          showScreen.value = false;
        }
      } else if (context.current == '1') {
        if (checked.includes(1)) {
          showIntervene.value = true;
          setArrt.serData.interveneCycleName = '';
          setArrt.serData.interveneCycle = undefined;
          checkedItem.value = ['game', 'eat', 'sport'];
        } else {
          setArrt.serData.interveneCycleName = '';
          setArrt.serData.interveneCycle = undefined;
          showIntervene.value = false;
        }
      }
      getCheckTypeService();
    };

    const onCheckItem = (checked, context) => {
      console.log(checked, 'lll');

      setArrt.serData.interveneList = checked;
    };
    //选择销售端口
    const changePort = (val, context) => {
      console.log(val, context, 'ppp');
      setArrt.checkData = [];
      setArrt.serData.port = val;

      showDisabled.value = false;
      setArrt.chList = [];
      getCheckTypeService();
    };

    return {
      ...toRefs(setArrt),
      onConfirmService,
      onCheck,
      pageSizeChange,
      currentChange,
      onInterChange,
      handleBlur,
      onChange,
      // onKeyup,
      onCancel,
      addSer,
      search,
      close,
      rest,
      edit,
      // onKeyDay,
      // onDayCount,
      // onDay,
      onCheckItem,
      showDisabled,
      fixedTopRows,
      changePort,
      itemOptions,
      checkedItem,
      checked,
      showScreen,
      checkboxOptions,
      showIntervene,
      loadStatus,
      schedule
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
    margin-left: 20px;

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

  ::v-deep(.checkboxTwo .t-checkbox) {
    margin-right: 220px !important;
  }

  .screenContent {
    margin-left: 10px;

    .content-title {
      margin-bottom: 10px;

      .title {
        color: #ff5a5a;
      }
    }

    .distance {
      margin-bottom: 10px;
    }

    .screenData {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 98%;
      height: 130px;
      box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 0.5);
      border-radius: 8px;
      border: 1px solid #dadce4;

      .search-item {
        height: 70%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 50px;
        font-size: 14px;

        .search-itemr {
          display: flex;
          align-items: center;
        }

        .ipt-slt {
          width: 380px;
          margin-left: 10px;
        }

        .slt {
          margin-left: 5px;
          margin-right: 5px;
        }
      }
    }

    .screenIntervene {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 98%;
      height: 130px;
      box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 0.5);
      border-radius: 8px;
      border: 1px solid #dadce4;

      .search-item {
        display: flex;
        align-items: center;
        margin-left: 50px;
        font-size: 14px;

        .ipt-slt {
          width: 380px;
          margin-left: 5px;
        }

        .slt {
          margin-left: 5px;
        }
      }
    }

    .noScreenData {
      height: 300px;
      background: #f9f9f9;
      width: 98%;
      display: flex;
      justify-content: center;
      align-items: center;

      .notTitle {
        font-size: 24px;
      }
    }
  }

  .ipt-slt {
    width: 380px;
  }

  // ::v-deep(.t-tag-input .t-tag) {
  //   display: none;
  // }
}
</style>
