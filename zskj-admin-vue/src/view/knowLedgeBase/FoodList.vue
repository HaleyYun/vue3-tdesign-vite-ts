<template>
  <div class="report-box">
    <div class="box-img" @click="handlerRest">
      <div class="box-left">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <t-button class="img-btn" theme="default" variant="text" @click="">全部食材</t-button>
      </div>
    </div>
    <div class="search-box">
      <div class="search-item">食材名称:<t-input class="ipt-slt" v-model="setArrt.titleData.ingredientName" auto-width placeholder="请输入食材名称" /></div>
      <div class="search-item">
        食材分类:
        <t-select class="ipt-slt" :options="proOption" v-model="setArrt.titleData.ingredientType" placeholder="请选择"></t-select>
      </div>
      <div @click="search" class="search"><span class="searchItem">搜索</span></div>
      <div @click="rest" class="rest-item"><span class="rest">重置</span></div>
    </div>
    <div class="content-box">
      <div class="operate-box">
        <t-button class="add-item" variant="outline" theme="primary" v-if="setArrt.seleted <= 0" @click="addItem">
          <template #icon>
            <AddCircleIcon />
          </template>
          新增</t-button
        >
        <t-button class="add-item" variant="outline" theme="primary" v-if="setArrt.seleted > 0" @click="confServType">
          <template #icon>
            <EditIcon />
          </template>
          确定</t-button
        >
        <t-button class="add-item" variant="outline" theme="primary" v-if="setArrt.seleted > 0" @click="cancels">
          <template #icon>
            <EditIcon />
          </template>
          取消</t-button
        >
      </div>
      <load :status="loadStatus" :schedule="schedule" v-if="setArrt.data?.length == 0"></load>
      <div v-else>
        <t-table row-key="id" :data="setArrt.data" v-model:selected-row-keys="setArrt.selectedRowKeys" :columns="(Columns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" hover :bordered="false" select-on-row-click @select-change="rehandleSelectChange">
          <template #imgUrl="{ row }">
            <div v-if="row.imgUrl" class="tdesign-demo-image-viewer__base">
              <t-image-viewer :images="[row.imgUrl]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img alt="test" :src="row.imgUrl" class="tdesign-demo-image-viewer__ui-image--img" />
                    <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                      <span> <BrowseIcon size="1.4em" /> 预览 </span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
          </template>
          <template #weight="{ row }">
            <span>{{ row.weight }}{{ row.unit }}</span>
          </template>
          <template #action="{ row }" v-if="setArrt.seleted <= 0">
            <div class="text-row">
              <div class="editText" @click="editDetails(row.id)">
                <div class="editText-item">编辑</div>
              </div>
              <t-popconfirm theme="default" @click.stop @confirm="deleteDetails(row.id)" content="确认删除吗">
                <div class="delText">
                  <div class="delText-item">删除</div>
                </div>
              </t-popconfirm>
            </div>
          </template>
        </t-table>
        <t-pagination :pageSize="setArrt.searchData.pageSize" v-model:current="setArrt.searchData.pageNum" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
      </div>
    </div>
    <t-dialog v-model:visible="setArrt.addVisible" width="1000" :footer="false" destroy-on-Close :header="setArrt.dialogTitle">
      <t-form ref="form" :data="addFormData" layout="inline" :rules="(formRules as FormRules<Data>)" :colon="true">
        <t-form-item label="名称" class="w50" :maxlength="30" name="name" initial-data="123456">
          <t-input :allowInputOverMax="false" placeholder="请输入名称" v-model="addFormData.name" />
        </t-form-item>
        <t-form-item label="分类" requiredMark class="w50" name="sort">
          <t-select v-model="addFormData.sort" :options="foodsLabel" placeholder="请选择菜品分类" filterable />
        </t-form-item>
        <t-form-item label="重量" class="w60" name="weight">
          <div class="heavy">
            <t-input @blur="onBlur" @input="onHeavy" :allowInputOverMax="false" placeholder="请输入(份)" v-model="addFormData.heavy" />
          </div>
          <div class="heavyWeight">
            <t-select v-model="addFormData.weight" :options="weightLabel" placeholder="请选择单位" filterable />
          </div>
        </t-form-item>
        <t-form-item label="热量" class="w50" name="heat" initial-data="123456">
          <t-input @change="onHeat" placeholder="请输入(千卡)" v-model="addFormData.heat" />
        </t-form-item>
        <t-form-item label="硫胺素" class="w50" name="thiamine">
          <t-input @blur="onBlur" @input="onThiamine" placeholder="请输入(毫克)" v-model="addFormData.thiamine" />
        </t-form-item>
        <t-form-item label="钙" class="w50" name="calcium">
          <t-input @change="onHeat" placeholder="请输入(毫克)" v-model="addFormData.calcium" />
        </t-form-item>
        <t-form-item @blur="onBlur" @input="onProtein" label="蛋白质" class="w50" name="protein">
          <t-input @blur="onBlur" placeholder="请输入(克)" v-model="addFormData.protein" />
        </t-form-item>
        <t-form-item label="核黄素" class="w50" name="riboflavin">
          <t-input @blur="onBlur" @input="onRiboflavin" placeholder="请输入(毫克)" v-model="addFormData.riboflavin" />
        </t-form-item>
        <t-form-item label="镁" class="w50" name="magnesium">
          <t-input @change="onHeat" placeholder="请输入(毫克)" v-model="addFormData.magnesium" />
        </t-form-item>
        <t-form-item label="脂肪" class="w50" name="fat">
          <t-input @blur="onBlur" @input="onFat" placeholder="请输入(克)" v-model="addFormData.fat" />
        </t-form-item>
        <t-form-item label="烟酸" class="w50" name="nicotinic">
          <t-input @blur="onBlur" @input="onNicotinic" placeholder="请输入(克)" v-model="addFormData.nicotinic" />
        </t-form-item>
        <t-form-item label="铁" class="w50" name="iron">
          <t-input @blur="onBlur" @input="onIron" placeholder="请输入(克)" v-model="addFormData.iron" />
        </t-form-item>
        <t-form-item label="碳水化合物" class="w50" name="carbohydrate">
          <t-input @blur="onBlur" @input="onCarbohydrate" placeholder="请输入(克)" v-model="addFormData.carbohydrate" />
        </t-form-item>
        <t-form-item label="维生素C" class="w50" name="vitaminC">
          <t-input @blur="onBlur" @input="onVitaminC" placeholder="请输入(毫克)" v-model="addFormData.vitaminC" />
        </t-form-item>

        <t-form-item label="锰" class="w50" name="manganese">
          <t-input @blur="onBlur" @input="onManganese" placeholder="请输入(克)" v-model="addFormData.manganese" />
        </t-form-item>
        <t-form-item label="膳食纤维" class="w50" name="dietary">
          <t-input @blur="onBlur" @input="onDietary" placeholder="请输入(千卡)" v-model="addFormData.dietary" />
        </t-form-item>
        <t-form-item label="维生素E" class="w50" name="vitaminE">
          <t-input @blur="onBlur" @input="onVitaminE" placeholder="请输入(毫克)" v-model="addFormData.vitaminE" />
        </t-form-item>
        <t-form-item label="锌" class="w50" name="zinc">
          <t-input @blur="onBlur" @input="onZinc" placeholder="请输入(毫克)" v-model="addFormData.zinc" />
        </t-form-item>
        <t-form-item label="维生素A" class="w50" name="vitaminA">
          <t-input @change="onHeat" placeholder="请输入(毫克)" v-model="addFormData.vitaminA" />
        </t-form-item>
        <t-form-item label="胆固醇" class="w50" name="cholesterol">
          <t-input @change="onHeat" placeholder="请输入(毫克)" v-model="addFormData.cholesterol" />
        </t-form-item>

        <t-form-item label="铜" class="w50" name="copper">
          <t-input @blur="onBlur" @input="onCopper" placeholder="请输入(毫克)" v-model="addFormData.copper" />
        </t-form-item>
        <t-form-item label="胡萝卜素" class="w50" name="carotene">
          <t-input @blur="onBlur" @input="onCarotene" placeholder="请输入(毫克)" v-model="addFormData.carotene" />
        </t-form-item>
        <t-form-item label="钾" class="w50" name="potassium">
          <t-input @change="onHeat" placeholder="请输入(毫克)" v-model="addFormData.potassium" />
        </t-form-item>
        <t-form-item label="磷" class="w50" name="phosphorus">
          <t-input @change="onHeat" placeholder="请输入(毫克)" v-model="addFormData.phosphorus" />
        </t-form-item>
        <t-form-item label="视黄醇当量" class="w50" name="equivalent">
          <t-input @blur="onBlur" @input="onEquivalent" placeholder="请输入(毫克)" v-model="addFormData.equivalent" />
        </t-form-item>
        <t-form-item label="钠" class="w50" name="sodium">
          <t-input @blur="onBlur" @input="onSodium" placeholder="请输入(毫克)" v-model="addFormData.sodium" />
        </t-form-item>
        <t-form-item label="硒" class="w50" name="selenium">
          <t-input @blur="onBlur" @input="onSelenium" placeholder="请输入(毫克)" v-model="addFormData.selenium" />
        </t-form-item>
        <t-form-item label="图片" requiredMark class="w50" name="img" initial-data="img">
          <t-upload
            ref="uploadRef"
            v-if="disUpload"
            v-model:files="fileList"
            :defaultFiles="(imgFile as any)"
            theme="image"
            :size-limit="{ size: 2, unit: 'MB' }"
            :action="uploadUrl"
            :formatResponse="formatImgResponse"
            accept="image/*"
            @remove="removeFile"
            :headers="setArrt.headers"
            :beforeAllFilesUpload="checkUpload"
            :onSuccess="handleUpload"
            tips="请上传115px*72px图片"
            :locale="{ triggerUploadText: { image: '请选择图片' } }"
          ></t-upload>
          <div class="img-box" @click="browserUpload" v-else>
            <div class="upload-img-box">
              <AddIcon class="icon" />
              <span class="check-img">请选择图片</span>
            </div>
            <div class="check-text">请上传115px*72px图片</div>
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
      </t-form>
      <div class="btn-commit">
        <t-button class="clear-item" variant="outline" theme="primary" style="margin-left: 20px" type="reset" @click="artBack">取消</t-button>
        <t-button class="confirm-item" theme="primary" @click="submitForm" type="submit">确定</t-button>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { foodList, addIngredient, delIngredient, upload, knowDelList, viewIngredient } from '../../request/modules/knowledge';
import { useRouter } from 'vue-router';
import { BrowseIcon, AddCircleIcon, EditIcon, AddIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, FormRules, Data, UploadFile, TableRowData, PrimaryTableCol, SelectOptions, FormValidateResult } from 'tdesign-vue-next';
import { foodDataStore } from '../../store/modules/food';
import cropper from '@/components/ImgCropping/Cropper.vue';
import load from '../../components/load/load.vue';
const foodStore = foodDataStore();
const router = useRouter();
const route = useRoute();
const uploadRef = ref();
const imgFile = ref<any>([]); //图片
const fileList = ref<any>([]);
const form = ref<any>(null);
const checkTypeList = ref<any>([]);
const disUpload = ref<boolean>(false);
const clipperRef = ref<any>({});
const setArrt = reactive<any>({
  searchData: {
    pageNum: 1,
    pageSize: 10,
    recipeName: '',
    recipeType: ''
  },
  titleData: {
    pageNum: 1,
    pageSize: 10,
    recipeName: '',
    recipeType: ''
  },
  knowledgeType: {
    knowledgeType: 'diet',
    pageNum: 1,
    pageSize: 10
  },
  seleted: 0,
  total: 60,
  data: [],
  dialogTitle: '新建食材',
  value1: '123',
  addVisible: false,
  headers: {
    token: ''
  },
  selectedRowKeys: [] as any
});
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
const formImage = ref<any>(''); //图片展示
const clipperData = ref<any>({
  type: '',
  allowTypeList: ['png', 'jpg', 'jpeg'],
  limitSize: 1,
  fixedNumber: [1, 1],
  previewWidth: 0,
  autoCropWidth: 0, // 默认生成截图框宽度
  autoCropHeight: 0 // 默认生成截图框高度
});
//菜品分类
const foodsLabel = ref([
  { label: '全谷物', value: 'G' },
  { label: '水果', value: 'F' },
  { label: '绿叶蔬菜', value: 'Vg' },
  { label: '其他蔬菜', value: 'Vo' },
  { label: '乳制品', value: 'D' },
  { label: '水产品', value: 'S' },
  { label: '坚果', value: 'N' },
  { label: '禽类', value: 'P' },
  { label: '红肉', value: 'R' }
]);
//重量分类
const weightLabel = ref([
  { label: 'g', value: 'g' },
  { label: 'ml', value: 'ml' }
]);

//上传图片
const files = ref([]);
const disabled = ref(false);
//后退
const handlerRest = () => {
  router.go(-1);
};
const handleUpload = (context: any) => {
  console.log('context', context, imgFile);
  formImage.value = context.response.url;
};
const formRules = ref({
  name: [{ required: true, message: '请输入名称' }],
  sort: [{ required: true, message: '请选择分类' }],
  img: [{ required: true, message: '请上传图片' }],
  weight: [{ required: true, message: '请输入重量' }],
  thiamine: [{ required: true, message: '请输入硫胺素' }],
  carbohydrate: [{ required: true, message: '请输入碳水化合物' }],
  protein: [{ required: true, message: '请输入蛋白质' }],
  riboflavin: [{ required: true, message: '请输入核黄素' }],
  nicotinic: [{ required: true, message: '请输入烟酸' }],
  vitaminC: [{ required: true, message: '请输入维生素C' }],
  vitaminE: [{ required: true, message: '请输入维生素E' }],
  vitaminA: [{ required: true, message: '请输入维生素A' }]
});
const addFormData = reactive({
  nameID: '',
  name: '',
  sort: '', //分类
  weight: '', //重量g/ml
  heavy: '', //重量
  heat: '', //热量
  calcium: '', //钙
  thiamine: '', //硫胺素
  protein: '', //蛋白质
  riboflavin: '', //核黄素
  magnesium: '', //镁
  fat: '', //脂肪
  nicotinic: '', //烟酸
  iron: '', //铁
  carbohydrate: '', //碳水化合物
  vitaminC: '', //维生素c
  manganese: '', //锰
  dietary: '', //膳食纤维
  vitaminE: '', //维生素E
  zinc: '', //锌
  vitaminA: '', //维生素A
  cholesterol: '', //胆固醇
  copper: '', //铜
  carotene: '', //胡罗卜素
  potassium: '', //钾
  phosphorus: '', //磷
  equivalent: '', //视黄醇当量
  sodium: '', //钠
  selenium: '', //硒
  imgUrl: '',
  categoryName: '',
  theme: ''
});
const Columns = ref([
  {
    title: '编码',
    colKey: 'id'
  },
  {
    title: '名称',
    colKey: 'name'
  },
  {
    title: '分类',
    colKey: 'categoryName'
  },
  {
    title: '重量/份',
    colKey: 'weight',
    slots: { customRender: 'weight' }
  },
  {
    title: '主图',
    colKey: 'imgUrl',
    slots: { customRender: 'imgUrl' },
    align: 'center'
  },
  {
    title: '创建时间',
    colKey: 'createTime',
    align: 'center'
  },
  {
    title: '操作',
    colKey: 'action',
    slots: { customRender: 'action' },
    align: 'center'
  }
]);
onMounted(() => {
  let token = localStorage.getItem('x-auth-token');
  setArrt.headers.token = token as string;
  if (route.query.seleted) {
    setArrt.seleted = Number(route.query.seleted);
    let data = {
      colKey: 'row-select',
      type: 'multiple',
      width: 46,
      title: ''
    };
    Columns.value.unshift(data);
  }
  if (foodStore.checkList) {
    setArrt.selectedRowKeys = foodStore.checkList;
    // console.log(setArrt.selectedRowKeys);
  }
  getFoodList();
});

const browserUpload = () => {
  clipperData.value.autoCropWidth = 115;
  clipperData.value.autoCropHeight = 72;
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
  fileList.value = [];
  formImage.value = '';
};
//多选
const rehandleSelectChange = (RowKeys: Array<string | number>, options: SelectOptions<any>) => {
  // console.log(options);
  checkTypeList.value = options.selectedRowData;
  console.log(checkTypeList.value);
};
let loadStatus = ref<string>('') //loading-加载中,noData-无数据,failure-加载失败
let schedule = ref<number>(20) //加载中进度
//获取列表
const getFoodList = () => {
  foodList(setArrt.searchData).then((res: any) => {
    if (res.code==200) { //接口正常
      if (res.data==null||res.data.total==0) { //无数据
        loadStatus.value = 'noData',
        setArrt.data =[]
      } else {
        setArrt.data = res.data.data;
        setArrt.total = res.data.total;
      }
    } else {
      (loadStatus.value = 'failure'), (setArrt.data = []);
    }
    if (res.code === 200) {
      setArrt.data = res.data.data;
      setArrt.total = res.data.total;
    } else {
      // MessagePlugin.warning(res.msg);
    }
  });
};
//编辑
const editDetails = (itemId: string) => {
  disUpload.value = false;
  addFormData.nameID = itemId;
  viewIngredient({ id: itemId }).then((res: any) => {
    if (res.code === 200) {
      // console.log(res.data, 'res');
      addFormData.name = res.data.name;
      addFormData.sort = res.data.category;
      addFormData.weight = res.data.unit;
      addFormData.heavy = res.data.weight;
      addFormData.heat = res.data.heat;
      addFormData.calcium = res.data.calcium;
      addFormData.thiamine = res.data.thiamine;
      addFormData.protein = res.data.protein;
      addFormData.riboflavin = res.data.riboflavin;
      addFormData.magnesium = res.data.magnesium;
      addFormData.fat = res.data.fat; //脂肪
      addFormData.nicotinic = res.data.niacin;
      addFormData.iron = res.data.iron;
      addFormData.carbohydrate = res.data.carbohydrates;
      addFormData.vitaminC = res.data.vitaminC;
      addFormData.manganese = res.data.manganese;
      addFormData.dietary = res.data.dietaryFiber;
      addFormData.vitaminE = res.data.vitaminE;
      addFormData.zinc = res.data.zinc;
      addFormData.vitaminA = res.data.vitaminA;
      addFormData.cholesterol = res.data.cholesterol;
      addFormData.copper = res.data.copper;
      addFormData.carotene = res.data.carotene; //胡罗卜素
      addFormData.potassium = res.data.potassium;
      addFormData.phosphorus = res.data.phosphorus;
      addFormData.equivalent = res.data.retinolEquivalent;
      addFormData.sodium = res.data.sodium;
      addFormData.selenium = res.data.selenium;
      if (res.data.imgUrl != '') {
        disUpload.value = true;
        fileList.value[0] = {
          name: '',
          url: res.data.imgUrl
        };
      } else {
        fileList.value = [];
      }
      formImage.value = res.data.imgUrl;
    } else {
      MessagePlugin.warning(res.msg);
    }
  });
  // fileList.value[0] = {
  //   name: '',
  //   url: val.imgUrl
  // };
  // console.log(val);
  //
  // addFormData.nameID = val.id.toString();
  // addFormData.name = val.name;
  // addFormData.sort = val.category;
  //   fileList.value[0] = {
  //   name: '',
  //   url: val.imgUrl
  // };
  setArrt.dialogTitle = '编辑';
  setArrt.addVisible = true;
};
//删除
const deleteDetails = (itemId: any) => {
  delIngredient({ id: itemId }).then((res: any) => {
    if (res.code === 200) {
      MessagePlugin.success('删除成功');
      getFoodList();
    } else {
      // MessagePlugin.warning(res.msg);
    }
  });
};
//新增弹窗
const addItem = () => {
  setArrt.dialogTitle = '新建食材';
  setArrt.addVisible = true;
  addFormData.name = '';
  addFormData.sort = '';
  formImage.value = '';
  addFormData.categoryName = '';
  fileList.value = [];
  addFormData.weight = '';
  addFormData.heavy = '';
  addFormData.heat = '';
  addFormData.thiamine = '';
  addFormData.protein = '';
  addFormData.riboflavin = '';
  addFormData.magnesium = '';
  addFormData.fat = '';
  addFormData.nicotinic = '';
  addFormData.iron = '';
  addFormData.carbohydrate = '';
  addFormData.vitaminC = '';
  addFormData.manganese = '';
  addFormData.dietary = '';
  addFormData.vitaminE = '';
  addFormData.zinc = '';
  addFormData.cholesterol = '';
  addFormData.copper = '';
  addFormData.potassium = '';
  addFormData.phosphorus = '';
  addFormData.equivalent = '';
  addFormData.sodium = '';
  addFormData.calcium = '';
};
//点击确定
const submitForm = () => {
  let params: any = {
    name: addFormData.name,
    category: addFormData.sort,
    // imgUrl: formImage.value,
    imgUrl: fileList.value.length ? fileList.value[0].url : '',
    calcium: addFormData.calcium, //钙
    unit: addFormData.weight, //重量g/ml
    weight: addFormData.heavy, //重量
    thiamine: addFormData.thiamine, //硫胺素
    vitaminC: addFormData.vitaminC,
    vitaminA: addFormData.vitaminA,
    vitaminE: addFormData.vitaminE,
    protein: addFormData.protein, //蛋白质
    niacin: addFormData.nicotinic, //烟酸
    carbohydrates: addFormData.carbohydrate, //碳水化合物
    riboflavin: addFormData.riboflavin, //核黄素
    carotene: addFormData.carotene, //胡萝卜素
    cholesterol: addFormData.carotene, //胆固醇
    copper: addFormData.copper, //铜
    dietaryFiber: addFormData.dietary, //膳食纤维
    fat: addFormData.fat, //脂肪
    heat: addFormData.heat, //热量
    iron: addFormData.iron, //铁
    magnesium: addFormData.magnesium, //镁
    manganese: addFormData.manganese, //锰
    phosphorus: addFormData.phosphorus, //磷
    potassium: addFormData.potassium, //钾
    retinolEquivalent: addFormData.equivalent, //视黄醇当量
    selenium: addFormData.selenium, //硒
    sodium: addFormData.sodium, //钠
    zinc: addFormData.zinc //锌
  };
  //编辑的参数
  if (addFormData.nameID) {
    params['id'] = addFormData.nameID;
  }

  // console.log('params', params);
  if (setArrt.dialogTitle == '新建食材') {
    addIngredient(params).then((res: any) => {
      if (res.code === 200) {
        setArrt.addVisible = false;
        MessagePlugin.success('添加成功');
        addFormData.nameID = '';
        addFormData.name = '';
        addFormData.sort = '';
        getFoodList();
      } else {
        // MessagePlugin.success(res.msg);
      }
    });
  } else {
    addIngredient(params).then((res: any) => {
      if (res.code === 200) {
        setArrt.addVisible = false;
        MessagePlugin.success('编辑成功');
        getFoodList();
      } else {
        // MessagePlugin.success(res.msg);
      }
    });
  }
};

//分页
const pageSizeChange = (pageSize: any) => {
  setArrt.searchData.pageSize = pageSize;
  setArrt.searchData.pageNum = 1;
  getFoodList();
};
const currentChange = (current: number) => {
  setArrt.searchData.pageNum = current;
  getFoodList();
};
const formatImgResponse = (response: any) => {
  return { name: response.data.originalFilename, url: response.data.url };
};
//控制图片大小
const checkUpload = (files: any[]): boolean | Promise<boolean> => {
  // return true
  return new Promise(function (resolve, reject) {
    let width = 115;
    let height = 72;
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
        MessagePlugin.warning('图片尺寸(115px*72px)不符合标准！');
        reject(false);
      }
    };
    img.src = url;
  });
};
//重量
const onHeavy = () => {
  addFormData.heavy = addFormData.heavy.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//硫胺素
const onThiamine = () => {
  addFormData.thiamine = addFormData.thiamine.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//蛋白质
const onProtein = () => {
  addFormData.protein = addFormData.protein.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//核黄素
const onRiboflavin = () => {
  addFormData.riboflavin = addFormData.riboflavin.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//脂肪
const onFat = () => {
  addFormData.fat = addFormData.fat.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//烟酸
const onNicotinic = () => {
  addFormData.nicotinic = addFormData.nicotinic.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//铁
const onIron = () => {
  addFormData.iron = addFormData.iron.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//碳水化合物
const onCarbohydrate = () => {
  addFormData.carbohydrate = addFormData.carbohydrate.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//维生素C
const onVitaminC = () => {
  addFormData.vitaminC = addFormData.vitaminC.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//锰
const onManganese = () => {
  addFormData.manganese = addFormData.manganese.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//膳食纤维
const onDietary = () => {
  addFormData.dietary = addFormData.dietary.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//维生素E
const onVitaminE = () => {
  addFormData.vitaminE = addFormData.vitaminE.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//锌
const onZinc = () => {
  addFormData.zinc = addFormData.zinc.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//铜
const onCopper = () => {
  addFormData.copper = addFormData.copper.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//胡萝卜素
const onCarotene = () => {
  addFormData.carotene = addFormData.carotene.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//视黄醇当量
const onEquivalent = () => {
  addFormData.equivalent = addFormData.equivalent.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//钠
const onSodium = () => {
  addFormData.sodium = addFormData.sodium.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
//硒
const onSelenium = () => {
  addFormData.selenium = addFormData.selenium.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};
const reg = /^[1-9][0-9]*$/;
//热量，钙，镁，维生素A，胆固醇，钾，磷
const onHeat = (val: any) => {
  if (!reg.test(val)) {
    MessagePlugin.warning('此项内容为整数,请重新输入');
  }
};
//校验
const onBlur = (val: any) => {
  //正则
  let special = /^([0-9]|[1-9]\d+)(\.\d{2})?$/;
  if (!special.test(val)) {
    MessagePlugin.warning('请输入数字');
  }
};
// 确认按钮
const confServType = () => {
  // console.log(checkTypeList.value)
  if (checkTypeList.value.length) {
    let data = [] as any;
    for (let i = 0; i < checkTypeList.value.length; i++) {
      const el = checkTypeList.value[i];
      data.push({
        name: el.name,
        weight: el.weight + el.unit,
        dietId: el.id,
        quantity: 1.0
      });
    }
    foodStore.foodData.ingredientRequests = data;
    router.push({
      name: 'foodEditView'
    });
  } else {
    foodStore.foodData.ingredientRequests = [];
    foodStore.checkList = [];
    router.push({
      name: 'foodEditView'
    });
  }
};
// 取消按钮
const cancels = () => {
  router.go(-1);
};
//关闭弹框
const artBack = () => {
  setArrt.addVisible = false;
};
const search = () => {
  setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
  setArrt.searchData.pageNum = 1;
  getFoodList();
};
const rest = () => {
  setArrt.searchData = {
    pageNum: 1,
    pageSize: 10,
    ingredientName: '',
    ingredientType: ''
  };
  setArrt.titleData = {
    pageNum: 1,
    pageSize: 10,
    ingredientName: '',
    ingredientType: ''
  };
  getFoodList();
};
const proOption = ref<any>([
  { value: 'G', label: '全谷物' },
  { value: 'F', label: '水果' },
  { value: 'V', label: '蔬菜' },
  { value: 'Vg', label: '绿叶蔬菜' },
  { value: 'Vo', label: '其他蔬菜' },
  { value: 'D', label: '乳制品' },
  { value: 'S', label: '水产品' },
  { value: 'N', label: '坚果' },
  { value: 'P', label: '禽类' },
  { value: 'R', label: '红肉' }
]);
</script>

<style lang="scss" scoped>
.report-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;

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

  .info-tittle {
    font-size: 20px;
    font-family: 'Courier New', Courier, monospace;
  }

  .info-box {
    padding: 15px;

    .search-item {
      margin-right: 15px;
    }

    .info-box-card {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .card-item {
        margin-right: 12px;
        margin-bottom: 12px;
        // width: 269px;
        // height: 156px;
        background: #ffffff;
        box-shadow: 0px 0px 4px 0px rgba(87, 102, 254, 0.07);
        border-radius: 16px;

        .content-left {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .textComboName {
            position: absolute;
            font-size: 22px;
            font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
            font-weight: bold;
            color: #ffffff;
            line-height: 40px;
            text-shadow: 0px 2px 4px rgba(9, 45, 162, 0.71);
          }
        }
      }
    }

    .card-plus {
      width: 290px;
      height: 194px;
      position: relative;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(87, 102, 254, 0.07);
      border-radius: 16px;
      margin-bottom: 12px;

      .icon-plus {
        text-align: center;
        position: absolute;
        top: 50%;
        width: 100%;
        font-size: 10px;
        color: #262626;
        transform: translate(0, -50%);
      }
    }
  }

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

  .content-box {
    min-height: 100%;
    padding: 21px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
  }

  .operate-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .add-item {
      background: #f4f8ff;
      box-shadow: 0px 2px 4px 0px #fafbff;
      border-radius: 6px;
      margin-right: 20px;
    }
  }

  .box-btn {
    margin-left: 5px;
  }

  .text-btn {
    display: flex;
    justify-content: flex-end;

    .editText {
      width: 53px;
      height: 23px;
      background: #ffedd5;
      border-radius: 13px;
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
      border-radius: 13px;
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

  // .box-btn1 {
  //   margin-left: 5px;
  // }
  .text-row {
    display: flex;
    justify-content: center;

    .editText {
      width: 53px;
      height: 23px;
      background: #ffedd5;
      border-radius: 13px;
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
      border-radius: 13px;
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
}
.search-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 15px;
  background-color: #fff;
  margin-bottom: 16px;
  border-radius: 8px;
  box-sizing: border-box;
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

.w50 {
  width: 45%;
}

.w60 {
  width: 45%;

  .heavyWeight {
    width: 140px !important;
    margin-left: 20px;
  }

  .heavy {
    width: 160px !important;
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
</style>
