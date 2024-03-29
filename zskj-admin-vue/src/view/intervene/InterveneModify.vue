<template>
  <div class="intervene-box">
    <div class="title-box">
      <t-input type="text" class="intervene-input-box" v-model="setAttr.searchknowledgeName" @change="getClassList"
        placeholder="搜索干预项目">
        <template #prefix-icon>
          <SearchIcon />
        </template>
      </t-input>
      <p><span>{{ route.query.weekName || "--" }}</span><span>{{ route.query.time }}</span> </p>
      <div>
        <button @click="saveTemplate">保存模版</button>
        <button @click="openPopUp">选择模版</button>
      </div>
    </div>
    <div class="select-category-box">
      <div class="select-category-left">
        <div class="select-category-left-item" v-for="(item, index) in categoryList" :key="index"
          @click="changeCategory(item.type)"
          :style="{ background: item.type === setAttr.allDataActiveText ? '#F8F8F9' : '' }">
          <img :src="getIcon(item.imgName)" draggable="false" alt="">{{ item.text }}
        </div>
      </div>
      <div class="select-category-right">
        <t-select class="select-box" v-model="setAttr.categoryListOptionsActive" :options="categoryListOptions"
          placeholder="请选择" @change="changeCategoryListActive"></t-select>
        <div class="select-category-right-items">
          <div class="select-category-right-item" draggable="true" @dragstart="handleDragStart(item)"
            v-for="(item, index) in selectAllItemList" :key="index">
            <img :src="item.accessUrl" alt="" draggable="false">
            <p><span v-if="setAttr.allDataActiveText === 'diet'" :class="'span-' + item.mealTime">{{ item.mealTime
              === '1' ? '早' : item.mealTime ===
                '2' ?
              '午' : '晚' }}</span>{{
    item.relatedContent }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="tips-box"><span>膳食营养</span><span>运动健康</span><span>认知激活</span></div>
    <div class="result-category-box">
      <div class="result-category-box-item" v-for="(item, index) in setAttr.allUserData" :key="index">
        <h2>{{ item.recommendDate }}</h2>
        <div class="item-meals-box" @drop="handleDrop(index, 'diet')" @dragover="allowDrop"
          :class="!item.recipesList || item.recipesList.length === 0 ? 'box-null' : ''"
          :style="{ overflowY: item.recipesList.length <= 6 ? 'hidden' : 'auto' }">
          <div class="item-box" :style="{ margin: item.recipesList.length > 6 ? '0 7px' : '0 9px' }"
            v-for="(mealsItem, mealsIndex) in item.recipesList" :key="mealsIndex">
            <img :src="mealsItem.picUrl" draggable="false" alt="">
            <img class="delete-img" draggable="false" src="../../assets/img/intervene/delete.png"
              @click="deleteItem(index, mealsIndex, 'diet')" alt="">
            <p><span :class="'span-' + mealsItem.mealTime">{{ mealsItem.mealTime === '1' ? '早' : mealsItem.mealTime ===
              '2' ?
              '午' : '晚' }}</span>{{ mealsItem.recipesName }}</p>
            <div class="operate-box">
              <img src="../../assets/img/intervene/reduce.png" @click="itemReduceCount(index, mealsIndex, 'diet')"
                draggable="false" alt="">
              <span>{{ mealsItem.recipesCount }}份</span>
              <img src="../../assets/img/intervene/add.png" @click="mealsItem.recipesCount += 1" draggable="false" alt="">
            </div>
          </div>
          <div class="null-box" v-if="!item.recipesList || item.recipesList.length === 0">
            <img src="../../assets/img/intervene/null_data.png" draggable="false" alt="">
            <p>暂时没有添加膳食～</p>
          </div>
        </div>
        <div class="item-health-box" @drop="handleDrop(index, 'sports')" @dragover="allowDrop"
          :class="!item.sportsResponseList || item.sportsResponseList.length === 0 ? 'box-null' : ''"
          :style="{ overflowY: item.sportsResponseList.length <= 6 ? 'hidden' : 'auto' }">
          <div class="item-box" :style="{ margin: item.sportsResponseList.length > 6 ? '0 7px' : '0 9px' }"
            v-for="(sportsItem, sportsIndex) in item.sportsResponseList" :key="sportsIndex">
            <img :src="sportsItem.accessUrl" draggable="false" alt="">
            <img class="delete-img" draggable="false" @click="deleteItem(index, sportsIndex, 'sports')"
              src="../../assets/img/intervene/delete.png" alt="">
            <p>{{ sportsItem.sportsName }}</p>
            <div class="operate-box">
              <img src="../../assets/img/intervene/reduce.png" @click="itemReduceCount(index, sportsIndex, 'sports')"
                draggable="false" alt="">
              <span>{{ sportsItem.sportsCount }}份</span>
              <img src="../../assets/img/intervene/add.png" @click="sportsItem.sportsCount += 1" draggable="false" alt="">
            </div>
          </div>
          <div class="null-box" v-if="!item.sportsResponseList || item.sportsResponseList.length === 0">
            <img src="../../assets/img/intervene/null_data.png" draggable="false" alt="">
            <p>暂时没有添加运动～</p>
          </div>
        </div>
        <div class="item-cognition-box" @drop="handleDrop(index, 'game')" @dragover="allowDrop"
          :class="!item.gamesList || item.gamesList.length === 0 ? 'box-null' : ''"
          :style="{ overflowY: item.gamesList.length <= 6 ? 'hidden' : 'auto' }">
          <div class="item-box" :style="{ margin: item.gamesList.length > 6 ? '0 7px' : '0 9px' }"
            v-for="(gamesItem, gamesIndex) in item.gamesList" :key="gamesIndex">
            <img :src="gamesItem.accessUrl" draggable="false" alt="">
            <img class="delete-img" draggable="false" src="../../assets/img/intervene/delete.png"
              @click="deleteItem(index, gamesIndex, 'game')" alt="">
            <p>{{ gamesItem.gameName }}</p>
            <div class="operate-box">
              <img src="../../assets/img/intervene/reduce.png" @click="itemReduceCount(index, gamesIndex, 'game')"
                draggable="false" alt="">
              <span>{{ gamesItem.gameCount }}份</span>
              <img src="../../assets/img/intervene/add.png" @click="gamesItem.gameCount += 1" draggable="false" alt="">
            </div>
          </div>
          <div class="null-box" v-if="!item.gamesList || item.gamesList.length === 0">
            <img src="../../assets/img/intervene/null_data.png" draggable="false" alt="">
            <p>暂时没有添加认知～</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <button @click="saveAll">确定</button>
      <button @click="setAttr.visible = true">取消</button>
    </div>

    <t-dialog v-model:visible="setAttr.saveVisible" header="保存模板" @confirm="confirmTemplate">
      <t-form ref="form" :rules="setAttr.formRiles" :data="setAttr.formData">
        <t-form-item label="模板名称" name="name">
          <t-input v-model="setAttr.formData.name" placeholder="请输入模板名称"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog class="template-dialog-box" width="1110px" v-model:visible="setAttr.selectVisible" header="选择模板"
      :footer="false" placement="center">
      <div class="dialog-search-box">
        <input type="text" v-model="setAttr.formData.templateName" placeholder="请输入模版名称">
        <div class="search-btn-box" @click="getChoostList">
          <img src="../../assets/img/intervene/search_icon.png" alt="">
          搜索
        </div>
      </div>
      <div class="template-list-box">
        <div class="template-item" v-for="(item, index) in setAttr.chooseData" :key="index">
          <div class="template-item-title">
            <h2>{{ item.templateName }}</h2>
            <div class="template-btn-box">
              <button @click="selectTemplate(index)">选择</button>
              <button @click="handleDeleteTemplate(item.templateId)">删除</button>
            </div>
          </div>
          <div class="template-item-tips"><span>膳食营养</span><span>运动健康</span><span>认知激活</span></div>
          <div class="template-item-content" v-for="(dayItem, dayIndex) in item.dailyTemplateList" :key="dayIndex">
            <div class="item-meals-box"
              :class="!dayItem.recipesList || dayItem.recipesList.length === 0 ? 'box-null' : ''">
              <div class="item-box" :style="{ margin: dayItem.recipesList.length > 6 ? '0 7px' : '0 9px' }"
                v-for="(mealsItem, mealsIndex) in dayItem.recipesList" :key="mealsIndex">
                <img :src="mealsItem.picUrl" alt="" draggable="false">
                <p><span :class="'span-' + mealsItem.mealTime">{{ mealsItem.mealTime === '1' ? '早' : mealsItem.mealTime
                  ===
                  '2' ?
                  '午' : '晚' }}</span>{{ mealsItem.recipesName }}</p>
                <div class="operate-box">
                  <img src="../../assets/img/intervene/reduce_n.png" draggable="false" alt="">
                  <span>{{ mealsItem.recipesCount }}</span>
                  <img src="../../assets/img/intervene/add_n.png" draggable="false" alt="">
                </div>
              </div>
              <div class="null-box" v-if="!dayItem.recipesList || dayItem.recipesList.length === 0">
                <img src="../../assets/img/intervene/null_data.png" alt="">
                <p>暂时没有添加膳食～</p>
              </div>
            </div>
            <div class="item-health-box"
              :class="!dayItem.sportsResponseList || dayItem.sportsResponseList.length === 0 ? 'box-null' : ''">
              <div class="item-box" :style="{ margin: dayItem.sportsResponseList.length > 6 ? '0 7px' : '0 9px' }"
                v-for="(sportsItem, sportsIndex) in dayItem.sportsResponseList" :key="sportsIndex">
                <img :src="sportsItem.accessUrl" alt="" draggable="false">
                <p>{{ sportsItem.sportsName }}</p>
                <div class="operate-box">
                  <img src="../../assets/img/intervene/reduce_n.png" draggable="false" alt="">
                  <span>{{ sportsItem.sportsCount }}</span>
                  <img src="../../assets/img/intervene/add_n.png" draggable="false" alt="">
                </div>
              </div>
              <div class="null-box" v-if="!dayItem.sportsResponseList || dayItem.sportsResponseList.length === 0">
                <img src="../../assets/img/intervene/null_data.png" draggable="false" alt="">
                <p>暂时没有添加运动～</p>
              </div>
            </div>
            <div class="item-cognition-box"
              :class="!dayItem.gamesList || dayItem.gamesList.length === 0 ? 'box-null' : ''">
              <div class="item-box" :style="{ margin: dayItem.gamesList.length > 6 ? '0 7px' : '0 9px' }"
                v-for="(gamesItem, gamesIndex) in dayItem.gamesList" :key="gamesIndex">
                <img :src="gamesItem.accessUrl" alt="" draggable="false">
                <p>{{ gamesItem.gameName }}</p>
                <div class="operate-box">
                  <img src="../../assets/img/intervene/reduce_n.png" draggable="false" alt="">
                  <span>{{ gamesItem.gameCount }}</span>
                  <img src="../../assets/img/intervene/add_n.png" draggable="false" alt="">
                </div>
              </div>
              <div class="null-box" v-if="!dayItem.gamesList || dayItem.gamesList.length === 0">
                <img src="../../assets/img/intervene/null_data.png" draggable="false" alt="">
                <p>暂时没有添加认知～</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </t-dialog>
    <t-dialog header="提示" v-model:visible="setAttr.visible" @close="setAttr.visible = false" @confirm="router.back()">
      <p>取消后数据不做保存，确定要取消吗？</p>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { SearchIcon } from 'tdesign-icons-vue-next';
import { queryAll, savePlanTemplate, queryTemplate, echoOrderInfo, updateDailyAdvice, deleteTemplate } from '../../request/modules/intervene';
import { selectAllItemListType, SaveTemplateType, weekPlanInfoDTOType } from '../../request/types/intervene'
import { MessagePlugin } from "tdesign-vue-next"
import { getCurrentDate } from "../../utils/tiemFormat"
import { debounce } from "../../utils/tools"

const router = useRouter()
const route = useRoute()

const setAttr = reactive({
  searchknowledgeName: "",
  saveVisible: false,
  selectVisible: false,
  visible: false,
  formData: {
    name: '',
    templateName: ""
  },
  formRiles: {
    name: [{ required: true, message: '模板名称必填' }]
  },
  allUserData: [{
    recommendDate: "08.13",
    date: "08.13",
    gamesList: [{
      accessUrl: "1",
      gameCount: 1,
      gameName: "游戏5",
      gameType: "语言能力",
      type: "",
      id: 5
    }],
    recipesList: [
      {
        id: 1,
        mealTime: "1",
        picUrl: "6",
        recipesCount: 1,
        recipesName: "鸡蛋炒西红柿",
        type: "",
        recipesType: "肉禽蛋"
      }
    ],
    sportsResponseList: [{
      accessUrl: "http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/95af65c4f05e48b4a42eaf8ca4d5545e.jpeg",
      id: 5,
      sportsCount: 2,
      sportsName: "走钢丝",
      type: "",
      sportsType: "平衡"
    }],
  }
  ],
  allData: [
    {
      knowledgeType: '',
      knowledgeTypeName: '',
      categoryKnowledgeInfoList: [
        {
          categoryName: '',
          category: "156",
          knowledgeBaseInfoDTOList: [
            {
              accessUrl: '',
              categoryName: '',
              relatedContent: '',
              knowledgeBaseId: 0,
              count: 0,
              category: '',
              knowledgeType: ''
            }
          ]
        }
      ]
    }
  ],
  allDataActiveText: "",
  queryTemplateData: {
    pageNum: 1,
    pageSize: 10,
    templateName: ''
  },
  chooseData: [{
    templateId: 5,
    templateName: "测试1",
    dailyTemplateList: [{
      recommendDate: "08.13",
      date: "08.13",
      gamesList: [{
        accessUrl: "1",
        gameCount: 1,
        gameName: "游戏5",
        gameType: "语言能力",
        type: "",
        id: 5
      }],
      recipesList: [
        {
          id: 1,
          mealTime: "1",
          picUrl: "6",
          recipesCount: 1,
          recipesName: "鸡蛋炒西红柿",
          type: "",
          recipesType: "肉禽蛋"
        }
      ],
      sportsResponseList: [{
        accessUrl: "http://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-admin-test/95af65c4f05e48b4a42eaf8ca4d5545e.jpeg",
        id: 5,
        sportsCount: 2,
        sportsName: "走钢丝",
        type: "",
        sportsType: "平衡"
      }],
    }
    ]
  }],
  categoryListOptionsActive: "0",
})
const categoryList = ref([
  { imgName: 'meals', text: "膳食营养", type: "diet" },
  { imgName: 'health', text: "运动健康", type: "sports" },
  { imgName: 'cognition', text: "认知激活", type: "game" }
])
const categoryListOptions = ref([
  { label: '全部', value: '0' },
])
const selectAllItemList = ref<selectAllItemListType[]>([])
let selectAllItem = ref<selectAllItemListType>()
onMounted(() => {
  getClassList();
  getWeek();
  getChoostList();
})
//查询所有的基础知识库信息
const getClassList = debounce(() => {
  queryAll({ knowledgeName: setAttr.searchknowledgeName, knowledgeType: setAttr.allDataActiveText }).then((res: any) => {
    if (res.code === 200) {
      setAttr.allData = res.data;
      if (!setAttr.allDataActiveText) {
        changeCategory(res.data[0].knowledgeType);
      } else {
        handleCategoryListOptions();
        handleAllData();
      }
    } else {
      setAttr.allData = [];
    }
  });
}, 300);
const handleCategoryListOptions = () => {
  categoryListOptions.value = [];
  categoryListOptions.value.push({ label: '全部', value: '0' })
  setAttr.categoryListOptionsActive = "0";
  let allDataActive = setAttr.allData.findIndex(item => item.knowledgeType === setAttr.allDataActiveText);
  for (let i = 0; i < setAttr.allData[allDataActive].categoryKnowledgeInfoList.length; i++) {
    let obj = {
      label: setAttr.allData[allDataActive].categoryKnowledgeInfoList[i].categoryName, value: setAttr.allData[allDataActive].categoryKnowledgeInfoList[i].category
    }
    categoryListOptions.value.push(obj)
  }
}
const handleAllData = () => {
  selectAllItemList.value = [];
  let allDataActive = setAttr.allData.findIndex(item => item.knowledgeType === setAttr.allDataActiveText);
  if (setAttr.allData[allDataActive].categoryKnowledgeInfoList && setAttr.allData[allDataActive].categoryKnowledgeInfoList.length > 0) {
    for (let j = 0; j < setAttr.allData[allDataActive].categoryKnowledgeInfoList.length; j++) {
      if (setAttr.allData[allDataActive].categoryKnowledgeInfoList[j].knowledgeBaseInfoDTOList && setAttr.allData[allDataActive].categoryKnowledgeInfoList[j].knowledgeBaseInfoDTOList.length > 0) {
        selectAllItemList.value.push(...setAttr.allData[allDataActive].categoryKnowledgeInfoList[j].knowledgeBaseInfoDTOList)
      }
    }
  }
}
const changeCategory = (t: string) => {
  setAttr.allDataActiveText = t;
  handleCategoryListOptions()
  handleAllData()
}
const changeCategoryListActive = () => {
  selectAllItemList.value = []
  let allDataActive = setAttr.allData.findIndex(item => item.knowledgeType === setAttr.allDataActiveText);
  if (setAttr.allData[allDataActive].categoryKnowledgeInfoList && setAttr.allData[allDataActive].categoryKnowledgeInfoList.length > 0) {
    let i = setAttr.allData[allDataActive].categoryKnowledgeInfoList.findIndex(item => item.category === setAttr.categoryListOptionsActive);
    if (i === -1) {
      handleAllData();
      return
    }
    if (setAttr.allData[allDataActive].categoryKnowledgeInfoList[i].knowledgeBaseInfoDTOList && setAttr.allData[allDataActive].categoryKnowledgeInfoList[i].knowledgeBaseInfoDTOList.length > 0) {
      selectAllItemList.value.push(...setAttr.allData[allDataActive].categoryKnowledgeInfoList[i].knowledgeBaseInfoDTOList)
    }

  }
}
//查询周方案详情
const getWeek = () => {
  let params = {
    interventionOrderNumber: route.query.interventionOrderNumber as any,
    weekSequence: parseInt(route.query.weekSequence as any)
  };
  echoOrderInfo(params).then((res: any) => {
    if (res.code === 200) {
      setAttr.allUserData = [];
      setAttr.allUserData = res.data;
      console.log(setAttr.allUserData);
    } else {
      setAttr.allUserData = [];
    }
  });
};
// 保存方案模板列表
const saveTemplate = () => {
  setAttr.formData.name = "";
  setAttr.saveVisible = true;
};
const confirmTemplate = () => {
  setAttr.saveVisible = false;
  let dataList: SaveTemplateType["weekPlanInfoDTO"] = [];
  for (let i = 0; i < setAttr.allUserData.length; i++) {
    for (let j = 0; j < setAttr.allUserData[i].gamesList.length; j++) {
      let obj: weekPlanInfoDTOType = {
        accessUrl: setAttr.allUserData[i].gamesList[j].accessUrl,
        category: setAttr.allUserData[i].gamesList[j].type,
        count: setAttr.allUserData[i].gamesList[j].gameCount,
        interventionKnowledgeType: "game",
        knowledgeBaseId: setAttr.allUserData[i].gamesList[j].id,
        recommendDate: setAttr.allUserData[i].date,
        relatedContent: setAttr.allUserData[i].gamesList[j].gameName,
        timePoint: "",
      }
      dataList.push(obj);
    }
    for (let j = 0; j < setAttr.allUserData[i].recipesList.length; j++) {
      let obj: weekPlanInfoDTOType = {
        accessUrl: setAttr.allUserData[i].recipesList[j].picUrl,
        category: setAttr.allUserData[i].recipesList[j].type,
        count: setAttr.allUserData[i].recipesList[j].recipesCount,
        interventionKnowledgeType: "diet",
        knowledgeBaseId: setAttr.allUserData[i].recipesList[j].id,
        recommendDate: setAttr.allUserData[i].date,
        relatedContent: setAttr.allUserData[i].recipesList[j].recipesName,
        timePoint: setAttr.allUserData[i].recipesList[j].mealTime,
      }
      dataList.push(obj);
    }
    for (let j = 0; j < setAttr.allUserData[i].sportsResponseList.length; j++) {
      let obj: weekPlanInfoDTOType = {
        accessUrl: setAttr.allUserData[i].sportsResponseList[j].accessUrl,
        category: setAttr.allUserData[i].sportsResponseList[j].type,
        count: setAttr.allUserData[i].sportsResponseList[j].sportsCount,
        interventionKnowledgeType: "sports",
        knowledgeBaseId: setAttr.allUserData[i].sportsResponseList[j].id,
        recommendDate: setAttr.allUserData[i].date,
        relatedContent: setAttr.allUserData[i].sportsResponseList[j].sportsName,
        timePoint: "",
      }
      dataList.push(obj);
    }
  }
  savePlanTemplate({ templateName: setAttr.formData.name, weekPlanInfoDTO: dataList }).then((res: any) => {
    if (res.code === 200) {
      setAttr.formData.name = '';
      getChoostList();
    }
  });
};
// 干预模板列表
const getChoostList = () => {
  queryTemplate({ templateName: setAttr.formData.templateName }).then((res: any) => {
    if (res.code === 200) {
      setAttr.chooseData = res.data || [];
      console.log(setAttr.chooseData)
    } else {
      setAttr.chooseData = [];
    }
  });
};
const handleDeleteTemplate = (id: number) => {
  deleteTemplate({ id: id }).then((res: any) => {
    if (res.code === 200) {
      getChoostList();
    }
  })
}
const handleDragStart = (item: selectAllItemListType) => {
  selectAllItem.value = item;
  console.log(111, item)
}
const allowDrop = (ev: any) => {
  ev.preventDefault();
}
const handleDrop = (i: number, type: string) => {
  console.log(222, i, type, setAttr.allUserData[i], setAttr.allDataActiveText)
  switch (setAttr.allDataActiveText) {
    case 'diet':
      let obj = {
        id: selectAllItem.value!.knowledgeBaseId!,
        mealTime: selectAllItem.value!.mealTime || "",
        picUrl: selectAllItem.value!.accessUrl || "",
        recipesCount: 1,
        recipesName: selectAllItem.value!.relatedContent || "",
        type: selectAllItem.value!.type || "",
        recipesType: ""
      }
      let index = setAttr.allUserData[i].recipesList.findIndex(item => item.id == obj.id);
      if (index >= 0) {
        setAttr.allUserData[i].recipesList[index].recipesCount += 1;
      } else {
        setAttr.allUserData[i].recipesList.push(obj);
      }
      break;

    case 'sports':
      let obj1 = {
        accessUrl: selectAllItem.value!.accessUrl || "",
        id: selectAllItem.value!.knowledgeBaseId!,
        sportsCount: 1,
        sportsName: selectAllItem.value!.relatedContent || "",
        type: selectAllItem.value!.type || "",
        sportsType: ""
      }
      let index1 = setAttr.allUserData[i].sportsResponseList.findIndex(item => item.id == obj1.id);
      if (index1 >= 0) {
        setAttr.allUserData[i].sportsResponseList[index1].sportsCount += 1;
      } else {
        setAttr.allUserData[i].sportsResponseList.push(obj1)
      }
      break;

    case 'game':
      let obj2 = {
        accessUrl: selectAllItem.value!.accessUrl || "",
        id: selectAllItem.value!.knowledgeBaseId!,
        gameCount: 1,
        gameName: selectAllItem.value!.relatedContent || "",
        type: selectAllItem.value!.type || "",
        gameType: ""
      }
      let index2 = setAttr.allUserData[i].gamesList.findIndex(item => item.id == obj2.id);
      if (index2 >= 0) {
        setAttr.allUserData[i].gamesList[index2].gameCount += 1;
      } else {
        setAttr.allUserData[i].gamesList.push(obj2)
      }
      break;

    default:
      break;
  }
}
const saveAll = () => {
  updateDailyAdvice({ interventionOrderNumber: route.query.interventionOrderNumber as string, weekSequence: route.query.weekSequence as string, echoOrderInfoResponseList: setAttr.allUserData }).then((res: any) => {
    if (res.code === 200) {
      MessagePlugin.success('保存成功');
      router.back();
    }
  });
};
const deleteItem = (i: number, index: number, type: string) => {
  switch (type) {
    case 'diet':
      setAttr.allUserData[i].recipesList.splice(index, 1);
      break;
    case 'sports':
      setAttr.allUserData[i].sportsResponseList.splice(index, 1);
      break;
    case 'game':
      setAttr.allUserData[i].gamesList.splice(index, 1);
      break;

    default:
      break;
  }
}
const itemReduceCount = (i: number, index: number, type: string) => {
  switch (type) {
    case 'diet':
      if (setAttr.allUserData[i].recipesList[index].recipesCount > 1) {
        setAttr.allUserData[i].recipesList[index].recipesCount -= 1;
      }
      break;

    case 'sports':
      if (setAttr.allUserData[i].sportsResponseList[index].sportsCount > 1) {
        setAttr.allUserData[i].sportsResponseList[index].sportsCount -= 1;
      }
      break;

    case 'game':
      if (setAttr.allUserData[i].gamesList[index].gameCount > 1) {
        setAttr.allUserData[i].gamesList[index].gameCount -= 1;
      }
      break;

    default:
      break;
  }
}
const selectTemplate = (index: number) => {
  let dateList = String(route.query.time).split("-");
  let time = dateList[0] + "-" + dateList[1] + "-" + dateList[2];
  let timeKey = new Date(time).getTime();
  for (let i = 0; i < setAttr.chooseData[index].dailyTemplateList.length; i++) {
    let time = timeKey + 1000 * 60 * 60 * 24 * i;
    setAttr.chooseData[index].dailyTemplateList[i].recommendDate = getCurrentDate(time, 'yr').split("-").join(".");
    setAttr.chooseData[index].dailyTemplateList[i].date = getCurrentDate(time, 'nyrsfm');
  }
  setAttr.allUserData = setAttr.chooseData[index].dailyTemplateList;
  setAttr.selectVisible = false;
}
const getIcon = (name: string) => {
  return new URL(`../../assets/img/intervene/${name}.png`, import.meta.url).href;
}
const openPopUp = () => {
  setAttr.selectVisible = true;
  setAttr.formData.templateName = "";
}
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
}

.intervene-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #F9F9F9;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .title-box {
    width: 1165px;
    height: 76px;
    background: #FFFFFF;
    padding: 18px;
    box-sizing: border-box;
    border-radius: 16px;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .intervene-input-box {
      width: 430px;
      height: 44px;
      background: #FFFFFF;
      box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 1);
      border-radius: 8px;
      border: 1px solid #D5D5D5;
      display: flex;
      align-items: center;
    }

    p {
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #2A2A2A;
      line-height: 30px;

      span {
        margin: 0 10px;
      }
    }

    button {
      width: 108px;
      height: 40px;
      background: #3D7EFF;
      box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 1);
      border-radius: 8px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 22px;
      border: none;
      margin-left: 22px;
    }
  }

  .select-category-box {
    width: 1165px;
    height: 270px;
    background: #FFFFFF;
    box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
    border-radius: 16px;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;

    .select-category-left {
      width: 188px;
      height: 270px;
      padding: 21px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .select-category-left-item {
        width: 160px;
        height: 70px;
        border-radius: 16px;
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 44px;
          height: 44px;
          margin-right: 12px;
        }
      }
    }

    .select-category-right {
      height: 270px;
      padding: 16px;
      box-sizing: border-box;
      flex: 1;
      overflow: hidden;

      .select-box {
        width: 200px;
      }

      .select-category-right-items {
        width: 100%;
        height: 204px;
        margin-top: 17px;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;

        .select-category-right-item {
          width: 160px;
          margin-right: 16px;
          background: transparent;

          img {
            width: 160px;
            height: 144px;
            border-radius: 8px;
            border: 1px solid #D5D5D5;
          }

          p {
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
            color: #222222;
            line-height: 22px;
            margin-top: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            span {
              padding: 1px 2px;
              border-radius: 2px;
              border: 1px solid #13A663;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #13A663;
              line-height: 12px;
              margin-right: 4px;
            }

            .span-1 {
              border-color: #3D7EFF;
              color: #3D7EFF;
            }

            .span-2 {
              border-color: #13A663;
              color: #13A663;
            }

            .span-3 {
              border-color: #FF5B02;
              color: #FF5B02;
            }
          }
        }
      }
    }
  }

  .tips-box {
    margin-top: 26px;
    width: 1165px;
    padding: 0 20px 0 162px;
    box-sizing: border-box;
    font-size: 18px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #666666;
    line-height: 25px;
    display: flex;
    justify-content: space-around;
  }

  .result-category-box {
    flex: 1;
    width: 1165px;
    border-radius: 16px;
    margin-top: 10px;
    overflow-y: auto;

    .result-category-box-item {
      padding: 20px;
      margin-bottom: 16px;
      border-radius: 16px;
      background: #EDEDED;
      display: flex;

      h2 {
        width: 142px;
        text-align: left;
        font-size: 42px;
        font-family: MiSans-Bold, MiSans;
        font-weight: bold;
        color: #222222;
        line-height: 69px;
        align-self: center;
      }

      .item-meals-box,
      .item-health-box,
      .item-cognition-box {
        flex: 1;
        width: 326px;
        min-height: 155px;
        max-height: 281px;
        padding: 15px 10px 0;
        box-sizing: border-box;
        background: #FFFFFF;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 16px;
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;

        .item-box {
          width: 80px;
          position: relative;

          img {
            width: 80px;
            height: 72px;
            border-radius: 8px;
          }

          .delete-img {
            width: 28px;
            height: 28px;
            position: absolute;
            top: 22px;
            left: 26px;
            display: none;
          }

          &:hover .delete-img {
            display: block;
          }

          p {
            text-align: center;
            margin-top: 1px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 22px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            span {
              padding: 0px 1px;
              border-radius: 2px;
              border: .5px solid #13A663;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #13A663;
              line-height: 12px;
              margin-right: 2px;
            }

            .span-1 {
              border-color: #3D7EFF;
              color: #3D7EFF;
            }

            .span-2 {
              border-color: #13A663;
              color: #13A663;
            }

            .span-3 {
              border-color: #FF5B02;
              color: #FF5B02;
            }
          }

          .operate-box {
            margin: 0 0 6px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;

            img {
              width: 23px;
              height: 23px;
              cursor: pointer;
            }
          }
        }

        .null-box {
          text-align: center;

          img {
            width: 201px;
            height: 101px;
          }

          p {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9EA1A7;
            line-height: 22px;
          }
        }
      }

      .box-null {
        align-items: center;
        justify-content: center;
      }

      .item-meals-box,
      .item-health-box {
        margin-right: 15px;
      }
    }
  }

  .btn-box {
    width: 1165px;
    padding: 26px 0 17px;
    display: flex;
    justify-content: center;

    button {
      width: 142px;
      height: 46px;
      border-radius: 27px;
      border: 1px solid #3D7EFF;
      font-weight: bold;
      font-size: 18px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      margin: 0 11px;

      &:nth-child(1) {
        color: #FFFFFF;
        background: #3D7EFF;
      }

      &:nth-child(2) {
        color: #3D7EFF;
        background: #F5F8FD;
      }
    }
  }
}

.template-dialog-box {
  .dialog-search-box {
    width: 709px;
    height: 44px;
    padding: 0 5px 0 17px;
    box-sizing: border-box;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 1);
    border-radius: 8px;
    border: 1px solid #D5D5D5;
    display: flex;
    align-items: center;
    justify-content: space-between;

    input {
      border: none;
      outline: none;
      font-size: 13px;
      width: 100%;
    }

    .search-btn-box {
      width: 80px;
      height: 34px;
      background: #3D7EFF;
      box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 1);
      border-radius: 8px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 17px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }

  .template-list-box {
    width: 100%;
    height: 910px;
    margin-top: 20px;

    .template-item {
      margin-bottom: 16px;
      padding: 30px 26px;
      background: #EDEDED;
      border-radius: 14px;

      .template-item-title {
        height: 60px;
        background: #FFFFFF;
        padding: 0 10px 0 20px;
        box-sizing: border-box;
        box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        h2 {
          font-size: 18px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 25px;
        }

        .template-btn-box {
          button {
            width: 108px;
            height: 40px;
            border: none;
            box-shadow: 0px 2px 4px 0px rgba(250, 251, 255, 1);
            border-radius: 8px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 22px;

            &:nth-child(1) {
              margin-right: 22px;
              background: #3D7EFF;
            }

            &:nth-child(2) {
              background: #FF503D;
            }
          }
        }
      }

      .template-item-tips {
        margin: 30px 0 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-around;

        span {
          font-size: 18px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #666666;
          line-height: 25px;
        }
      }

      .template-item-content {
        padding: 20px;
        display: flex;

        .item-meals-box,
        .item-health-box,
        .item-cognition-box {
          flex: 1;
          width: 326px;
          min-height: 155px;
          max-height: 281px;
          padding: 15px 6px 0;
          box-sizing: border-box;
          background: #FFFFFF;
          box-shadow: 0px 2px 18px 0px rgba(87, 102, 254, 0.07);
          border-radius: 16px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          // overflow-y: auto;

          .item-box {
            width: 80px;

            img {
              width: 80px;
              height: 72px;
              border-radius: 8px;
            }

            p {
              text-align: center;
              margin-top: 1px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #222222;
              line-height: 17px;

              span {
                padding: 1px 2px;
                border-radius: 2px;
                border: .5px solid #13A663;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #13A663;
                line-height: 12px;
                margin-right: 2px;
              }

              .span-1 {
                border-color: #3D7EFF;
                color: #3D7EFF;
              }

              .span-2 {
                border-color: #13A663;
                color: #13A663;
              }

              .span-3 {
                border-color: #FF5B02;
                color: #FF5B02;
              }
            }

            .operate-box {
              margin: 7px 0 6px 0;
              display: flex;
              align-items: center;
              justify-content: space-between;

              img {
                width: 23px;
                height: 23px;
              }
            }
          }

          .null-box {
            text-align: center;

            img {
              width: 201px;
              height: 101px;
            }

            p {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #9EA1A7;
              line-height: 22px;
            }
          }
        }

        .box-null {
          align-items: center;
          justify-content: center;
        }

        .item-meals-box,
        .item-health-box {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>

<style>
.intervene-input-box .t-input {
  border: none !important;
}

.intervene-input-box .t-input:focus {
  box-shadow: none;
}

.intervene-input-box .t-input--focused {
  box-shadow: none;
}

.template-dialog-box .t-dialog__wrap {
  overflow: hidden;
}
</style>
