<template>
  <div class="detail-box">
    <div class="d-top">
      <div class="d-no">
        <div class="d-dot"></div>
        干预编号：{{ detailsData.interventionOrderNumber || '--' }}
      </div>
      <div class="d-name">
        <div class="d-text">
          制定人：<span class="text-content">{{ detailsData.makerName || '--' }}</span>
        </div>
        <div class="d-text">
          创建时间：<span class="text-content">{{ detailsData.createTime || '--' }}</span>
        </div>
      </div>
    </div>

    <div class="intervene-title">
      <div class="d-no">
        <div class="d-dot"></div>
        客户信息
        <div class="intervene-name">
          客户姓名：<span class="text-content">
            {{ detailsData.customerName || '--' }}
          </span>
          <text class="text-content">{{ detailsData.gender || '--' }}</text>
          <text class="text-content">{{ detailsData.age || '--' }}岁</text>
        </div>
        <div class="d-text">
          联系电话：<span class="text-content">
            {{ detailsData.contactNumber || '--' }}
          </span>
        </div>
        <div class="d-text">文化程度：{{ detailsData.educationLevel || '--' }}</div>
        <div class="d-text">客户来源：{{ detailsData.customerSource || '--' }}</div>
      </div>
    </div>

    <div class="intervene-title">
      <div class="d-no">
        <div class="d-dot"></div>
        服务信息
        <div class="d-text">预约单号：{{ detailsData.appointmentNumber || '--' }}</div>
        <div class="d-text">工单状态：{{ detailsData.workOrderStatus || '--' }}</div>
      </div>
    </div>

    <div class="intervene-title">
      <div class="d-no">
        <div class="d-dot"></div>
        干预内容
      </div>

      <div class="title-date">
        干预周期：<text class="text-content">{{ detailsData.interventionStart || '--' }} 至 {{ detailsData.interventionEnd || '--' }}</text>
      </div>
      <div class="title-text">
        干预状态：<text class="text-content">{{ detailsData.interventionOrderStatusName || '--' }}</text>
      </div>
      <div class="title-train">
        共计训练：
        <span class="text-content">{{ detailsData.totalTrainingDays || '--' }}天</span>
      </div>
      <!-- 干预每周训练天数：<span class="text-content"> {{ detailsData.interventionTrainingDaysPerWeek || '--' }}天 共计训练：{{ detailsData.totalTrainingDays || '--' }}天</span> -->

      <div class="d-btn">
        <!-- <t-button theme="primary" size="medium" @click="changeDate" v-if="route.query.type == 'edit' && route.query.status === 'UN_APPROVAL'">修改干预周期</t-button> -->
      </div>
    </div>

    <div class="d-tabs">
      <div class="tabs">
        <!-- <div :class="['tab-one', item.id == index ? 'active' : '']" v-for="(item, id) in tabsList" :key="id" @click="change(item)">{{ item.title }}</div> -->
      </div>
    </div>

    <div class="table">
      <div class="weeks">
        <div class="top">
          <div class="top-text">
            <div class="d-dot"></div>
            标准饮食健康
          </div>
          <div class="select-week">
            <span class="select-item">选择周方案：</span>
            <div class="select">
              <t-select v-model="selectValue" placeholder="请选择周方案" @change="selectChange">
                <t-option v-for="item in selectOptions" :value="item.weekSequence" :label="item.weekName"></t-option>
              </t-select>
            </div>
          </div>
        </div>
        <div class="top-btn">
          <!-- v-if="route.query.type == 'edit'" -->
          <t-button theme="primary" size="medium" @click="weekChange">修改周方案</t-button>
        </div>
      </div>
      <t-table :bordered="true" resizable table-layout="fixed" row-key="id" :data="weekAdviceList" :columns="columns">
        <template #recommendDate="{ row }">
          <div>
            {{ row.recommendDate ? row.recommendDate.substr(0, 10) : null }}
          </div>
        </template>
        <template #recipesMap="{ row }">
          <div v-for="(itemList, index) of (Object.values(row.recipesMap) as any)" :key="index" class="map-table">
            <div v-if="(itemList as any).length==2" style="height: 44px">{{ itemList[0].recipesType }}</div>
            <div v-else-if="(itemList as any).length==3" style="height: 66px">{{ itemList[0].recipesType }}</div>
            <div v-else-if="(itemList as any).length==4" style="height: 88px">{{ itemList[0].recipesType }}</div>
            <div v-else-if="(itemList as any).length==5" style="height: 110px">{{ itemList[0].recipesType }}</div>
            <div v-else>{{ itemList[0].recipesType }}</div>
            <t-divider v-if="index + 1 != Object.values(row.recipesMap).length" />
          </div>
        </template>
        <template #recipesMeals="{ row }">
          <div v-for="(itemList, index) of Object.values(row.recipesMap)" :key="index" class="map-table">
            <div v-if="(itemList as any).length==2" style="height: 44px">{{ (itemList as any).length }}</div>
            <div v-else-if="(itemList as any).length==3" style="height: 66px">{{ (itemList as any).length }}</div>
            <div v-else-if="(itemList as any).length==4" style="height: 88px">{{ (itemList as any).length }}</div>
            <div v-else-if="(itemList as any).length==5" style="height: 110px">{{ (itemList as any).length }}</div>
            <div v-else>{{ (itemList as any).length }}</div>
            <!-- <div>{{ (itemList as any).length }}</div> -->
            <t-divider v-if="index + 1 != Object.values(row.recipesMap).length" />
          </div>
        </template>
        <!-- 内容 -->
        <template #recipesContent="{ row }">
          <div v-for="(itemList, index) of (Object.values(row.recipesMap) as any)" :key="index" class="map-table">
            <div v-for="(item, Index) of itemList" :key="Index">
              <div class="table-con">
                <span v-if="item?.mealTime == 1" class="tableMeal">早</span>
                <span v-if="item?.mealTime == 2" class="tableNoon">午</span>
                <span v-if="item?.mealTime == 3" class="tableEvening">晚</span>
                {{ item?.recipesName }}
              </div>
            </div>
            <t-divider v-if="index + 1 != Object.values(row.recipesMap).length" />
          </div>
        </template>
        <template #sportsMap="{ row }">
          <div v-for="(item, index) of Object.keys(row.sportsResponseMap)" :key="index" class="map-table">
            {{ item }}

            <t-divider v-if="index + 1 != Object.keys(row.sportsResponseMap).length" />
          </div>
        </template>
        <template #sportsMeals="{ row }">
          <div v-for="(itemList, index) of Object.values(row.sportsResponseMap)" :key="index" class="map-table">
            <div>{{ (itemList as any).length }}</div>
            <t-divider v-if="index + 1 != Object.values(row.sportsResponseMap).length" />
          </div>
        </template>
        <template #sportsContent="{ row }">
          <div v-for="(itemList, index) of (Object.values(row.sportsResponseMap) as any)" :key="index" class="map-table">
            <!-- <div>{{ itemList  }}</div> -->
            <div v-for="(item, Index) of itemList" :key="Index">
              <span> {{ item?.sportsName }}</span>
            </div>
            <t-divider v-if="index + 1 != Object.values(row.sportsResponseMap).length" />
          </div>
        </template>
        <template #gamesMap="{ row }">
          <div v-for="(item, index) of Object.keys(row.gamesMap)" :key="index" class="map-table">
            {{ item }}

            <t-divider v-if="index + 1 != Object.keys(row.gamesMap).length" />
          </div>
        </template>
        <template #gamesMeals="{ row }">
          <div v-for="(itemList, index) of Object.values(row.gamesMap)" :key="index" class="map-table">
            <div>{{ (itemList as any).length }}</div>
            <t-divider v-if="index + 1 != Object.values(row.gamesMap).length" />
          </div>
        </template>
        <template #gamesContent="{ row }">
          <div v-for="(itemList, index) of (Object.values(row.gamesMap) as any)" :key="index" class="map-table">
            <!-- <div>{{ itemList  }}</div> -->
            <div v-for="(item, Index) of itemList" :key="Index">
              <span> {{ item?.gameName }}</span>
            </div>
            <t-divider v-if="index + 1 != Object.values(row.gamesMap).length" />
          </div>
        </template>
      </t-table>
    </div>
    <t-button style="display: block; margin: 30px auto 0" theme="primary" size="large" @click="quit">退出</t-button>
  </div>

  <t-dialog v-model:visible="addVisible" width="650" :header="'干预周期'" :confirmBtn="'确定'" @confirm="submitForm">
    <t-form layout="inline" :data="formData">
      <t-form-item label="干预周期" name="organizationName">
        <t-date-picker v-model="formData.interventionStart" placeholder="请选择开始时间" />&nbsp;-&nbsp;
        <t-date-picker v-model="formData.interventionEnd" placeholder="请选择结束时间" />
      </t-form-item>
    </t-form>
  </t-dialog>

  <t-dialog v-model:visible="weekVisible" width="800" :header="'请选择需要修改的周方案'" :confirmBtn="'确定'" @confirm="weekSubmit" @close="closeCheckedChange">
    <div class="week-check">
      <div class="top">标准饮食健康</div>
      <div class="list">
        <div class="week-one week-active" v-for="(item, index) in chooseList" :key="item.id">
          <div class="check"><t-checkbox v-model="chooseListActive[index]" @change="(checked: boolean) => checkedChange(item.weekSequence, item.interventionOrderId, checked, index, item.weekName)" /></div>
          <p>{{ item.weekName }}</p>
          <p>{{ item.interventionStart }}-{{ item.interventionEnd }}</p>
        </div>
      </div>
    </div>
  </t-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { intervenDetails, updateTraining, queryWeeKList, weeKList, queryWeeKInfo, queryFuturePlanList, queryDietList } from '../../request/modules/intervene';

// import { RowspanColspan } from '../../';
import { MessagePlugin, SelectValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { checkServerIdentity } from 'tls';
export default {
  setup() {
    const list = [];
    const recipesLength = ref<any>('');
    const router = useRouter();
    const setAttr = reactive({
      selectValue: '',
      detailsData: {
        age: 0,
        interventionOrderNumber: '',
        associatedService: '',
        contactNumber: '',
        makerName: '',
        customerName: '',
        customerSource: '',
        educationLevel: '',
        createTime: '',
        gender: '',
        id: 0,
        interventionEnd: '',
        interventionSource: '',
        interventionStart: '',
        interventionOrderStatus: '',
        interventionOrderStatusName: '',
        interventionTrainingDaysPerWeek: '',
        appointmentNumber: 0,
        totalTrainingDays: '',
        workOrderStatus: '',
        interventionPlanDto: [
          {
            category: '',
            count: 0,
            id: 0,
            planCategory: '',
            planSequence: 0,
            relatedContent: ''
          }
        ],
        interventionPlanDtoList: [
          {
            category: '',
            count: 0,
            id: 0,
            planCategory: '',
            planSequence: 0,
            relatedContent: ''
          }
        ]
      },
      weekAdviceList: [],
      index: 0,
      selectOptions: [
        { weekSequence: '1', weekName: '' },
        { weekSequence: '2', weekName: '' },
        { weekSequence: '3', weekName: '' }
      ],
      checkId: '', //选择周的id
      checkWeekSequence: '', //选择周的序列
      checkWeekTime: '', //选择周的序列
      tabsList: [
        { id: 0, title: '膳食营养' },
        { id: 1, title: '运动健康' },
        { id: 2, title: '认知激活' }
      ],
      AllData: [{ baseInfoDTOList: [] }],
      tableData: [],
      columns: [
        { colKey: 'categoryName', title: '类目' },
        { colKey: 'count', title: '份数/天数' },
        { colKey: 'relatedContent', title: '关联内容' }
      ],
      addVisible: false,
      weekVisible: false,
      formData: {
        id: '',
        interventionStart: '2022-01-01',
        interventionEnd: ''
      },
      chooseList: [
        {
          id: '',
          interventionStart: '',
          interventionEnd: '',
          weekName: '',
          weekSequence: '',
          interventionOrderId: ''
        }
      ],
      chooseListActive: [false],
      weekName: ''
    });
    const route = useRoute();
    onMounted(async () => {
      getDetails();

      getWeekList();
      // getDietList()
      await selectList();
    });

    //获取未来周方案
    const getWeekList = () => {
      queryFuturePlanList({ interventionOrderId: route.query.id as string }).then((res: any) => {
        if (res.code === 200) {
          setAttr.chooseList = res.data || [];
        } else {
          setAttr.chooseList = [];
        }
        setAttr.chooseListActive = new Array(setAttr.chooseList.length).fill(false);
      });
    };

    //干预订单详情
    const getDetails = () => {
      queryDietList({ orderId: route.query.id as string }).then((res: any) => {
        if (res.code === 200) {
          setAttr.detailsData = res.data;
          // setAttr.weekAdviceList = res.data.weekAdviceList;
          setAttr.formData.interventionStart = res.data.interventionStart;
          setAttr.formData.interventionEnd = res.data.interventionEnd;
        }
      });
    };
    //选择周方案
    const selectList = () => {
      queryWeeKList({ interventionOrderId: route.query.id as string }).then((res: any) => {
        if (res.code === 200) {
          setAttr.selectOptions = res.data;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].selected == 1) {
              selectChange(res.data[i].weekSequence);
              break;
            }
          }
        }
      });
    };
    //获取列表数据
    const selectChange = (value: any) => {
      setAttr.selectValue = value;
      weeKList({ interventionOrderNumber: route.query.OrderNumber as any, weekSequence: value }).then((res: any) => {
        if (res.code === 200) {
          // setAttr.AllData = res.data;
          setAttr.weekAdviceList = res.data;
          recipesLength.value = res.data;
          console.log(recipesLength.value, 'recipesLength.value');
        }
      });
    };
    //退出
    const quit = () => {
      // if (route.query.status) {
      //   router.push({
      //     path: '/customDetails',
      //     query: {
      //       status: route.query.status,
      //       archivesNo: route.query.archives,
      //     }
      //   });
      // } else {
      router.back();
      // }
    };
    //切换tabs
    const change = (val: any) => {
      console.log(val);
      setAttr.index = val.id;
      setAttr.tableData = setAttr.AllData[val.id].baseInfoDTOList;
    };
    //修改干预周期
    const changeDate = () => {
      setAttr.addVisible = true;
    };
    const submitForm = () => {
      setAttr.formData.id = route.query.id as string;
      updateTraining(setAttr.formData).then((res: any) => {
        if (res.code === 200) {
          setAttr.addVisible = false;
          MessagePlugin.success('更改成功');
        }
      });
    };
    //修改方案
    const weekChange = () => {
      setAttr.weekVisible = true;
    };
    //选择周
    const checkedChange = (val: any, id: any, checked: boolean, index: number, weekName: string) => {
      for (let i = 0; i < setAttr.chooseListActive.length; i++) {
        if (i === index) {
          setAttr.chooseListActive[i] = checked;
        } else {
          setAttr.chooseListActive[i] = false;
        }
      }
      if (checked) {
        setAttr.checkId = id;
        setAttr.checkWeekSequence = val;
        setAttr.weekName = weekName;
        setAttr.checkWeekTime = setAttr.chooseList[index].interventionStart + '-' + setAttr.chooseList[index].interventionEnd;
      } else {
        setAttr.checkId = '';
        setAttr.checkWeekSequence = '';
        setAttr.checkWeekTime = '';
        setAttr.weekName = '';
      }
    };
    const closeCheckedChange = () => {
      for (let i = 0; i < setAttr.chooseListActive.length; i++) {
        setAttr.chooseListActive[i] = false;
        setAttr.checkId = '';
        setAttr.checkWeekSequence = '';
        setAttr.checkWeekTime = '';
        setAttr.weekName = '';
      }
    };
    //跳转修改方案页面
    const weekSubmit = () => {
      if (setAttr.checkId && setAttr.checkWeekSequence) {
        router.push({
          path: '/interveneModify',
          query: {
            interventionOrderNumber: setAttr.detailsData.interventionOrderNumber,
            weekSequence: setAttr.checkWeekSequence,
            time: setAttr.checkWeekTime,
            weekName: setAttr.weekName
          }
        });
      } else {
        MessagePlugin.warning('请选择周');
      }
    };

    const columns = ref<any>([
      { colKey: 'recommendDate', title: '时间', align: 'center', width: 130, fixed: 'left' },

      {
        title: '膳食营养',
        colKey: 'channel',
        align: 'center',
        children: [
          {
            title: '类目',
            colKey: 'recipesMap',
            align: 'center',
            width: 120
          },
          {
            title: '份数',
            colKey: 'recipesMeals',
            align: 'center',
            width: 50
          },

          {
            title: '内容',
            colKey: 'recipesContent',
            align: 'center',
            width: 140
          }
        ]
      },
      {
        colKey: 'channel',
        title: '运动健康',
        align: 'center',
        children: [
          // sportsResponseMap
          {
            title: '类目',
            colKey: 'sportsMap',
            width: 120,
            align: 'center'
          },
          {
            title: '份数',
            colKey: 'sportsMeals',
            align: 'center',
            width: 50
          },

          {
            title: '内容',
            colKey: 'sportsContent',
            width: 140,
            align: 'center'
          }
        ]
      },

      {
        colKey: 'channel',
        title: '认知激活',
        align: 'center',
        children: [
          {
            title: '类目',
            colKey: 'gamesMap',
            align: 'center',
            width: 120
          },
          {
            title: '份数',
            colKey: 'gamesMeals',
            align: 'center',
            width: 50
          },
          {
            title: '内容',
            colKey: 'gamesContent',
            align: 'center',
            width: 140
          }
        ]
      }
    ]);

    return {
      ...toRefs(setAttr),
      change,
      changeDate,
      weekChange,
      submitForm,
      weekSubmit,
      selectChange,
      getWeekList,
      checkedChange,
      closeCheckedChange,
      quit,
      recipesLength,
      route,
      router,
      columns
    };
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.t-select__wrap) {
  width: 60%;
}

.detail-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .d-top {
    width: 100%;
    height: 35px;
    line-height: 35px;
    display: flex;
    padding: 22px 0;
    // justify-content: space-around;
    align-items: center;
    background: #ffffff;
    border-radius: 10px;
    margin-bottom: 16px;

    .d-no {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 30px;

      .d-dot {
        width: 10px;
        height: 10px;
        background: #3d7eff;
        border-radius: 10px;
        margin: 0 12px 0 18px;
      }
    }

    .d-name {
      display: flex;
      font-size: 13px;
      color: #666;
      margin-left: 36px;

      .d-text {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
        color: #666;
        margin-left: 104px;
        .text-content {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
        }
      }
    }
  }
  .intervene-title {
    width: 100%;
    height: 35px;
    line-height: 35px;
    display: flex;
    padding: 22px 0;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border-radius: 10px;
    margin-bottom: 16px;
    .d-no {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 22px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #222222;
      line-height: 30px;

      .d-dot {
        width: 10px;
        height: 10px;
        background: #3d7eff;
        border-radius: 10px;
        margin: 0 12px 0 18px;
      }
      .intervene-name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
        margin-left: 36px;
      }
      .d-text {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
        color: #666;
        margin-left: 104px;
        .text-content {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
        }
      }
    }

    .d-name {
      display: flex;
      font-size: 13px;
      color: #666;
      margin-left: 36px;

      .d-text {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #747584;
        line-height: 22px;
        color: #666;
        margin-left: 104px;
        .text-content {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
        }
      }
    }
    .title-date {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
      margin-left: 36px;
      .text-content {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 22px;
      }
    }
    .title-text {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
      margin-left: 56px;
      .text-content {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 22px;
      }
    }
    .title-train {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #747584;
      line-height: 22px;
      margin-left: 100px;
      .text-content {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 22px;
      }
    }
  }

  .d-info {
    width: 100%;
    height: 110px;
    margin: 10px auto;

    .d-title {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #ddd;
    }

    .d-con {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .d-text {
        width: 33%;
        height: 35px;
        line-height: 35px;
        color: #666;
      }
    }

    .d-cont {
      width: 90%;
      display: flex;
      justify-content: space-between;

      .d-show {
        width: 50%;

        .d-text {
          height: 35px;
          line-height: 35px;
          color: #666;
        }
      }
    }
  }

  .d-tabs {
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin-top: 45px;

    .tabs {
      width: 60%;
      height: 35px;
      line-height: 35px;
      display: flex;
      justify-content: space-between;

      .tab-one {
        text-align: center;
        width: 33.3%;
        background-color: #ddd;
      }

      .tab-one:nth-child(2) {
        border-left: 1px solid #999;
        border-right: 1px solid #999;
      }

      .active {
        background-color: #0052d9;
        color: #fff;
      }
    }
  }

  .table {
    // width: 100%;
    background: #ffffff;
    border-radius: 10px;
    padding: 15px;
    .weeks {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .top {
        display: flex;
        .top-text {
          display: flex;
          align-items: center;
          font-size: 22px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #222222;
          line-height: 30px;
          margin-right: 36px;
          .d-dot {
            width: 10px;
            height: 10px;
            background: #3d7eff;
            border-radius: 10px;
            margin: 0 12px 0 0;
          }
        }
        .select-week {
          display: flex;
          align-items: center;
          .select-item {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #747584;
            line-height: 22px;
          }
          .select {
            width: 300px;
          }
        }
      }
    }

    .table-con {
      display: inline-block;
      width: 120px;
      text-align: justify;
      .tableMeal {
        width: 16px;
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-right: 8px;
        color: #3d7eff;
        line-height: 17px;
        background: #f6fcfe;
        border-radius: 2px;
        border: 1px solid #3d7eff;
      }
      .tableNoon {
        width: 16px;
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-right: 8px;
        color: #13a663;
        line-height: 17px;
        background: #f6fef7;
        border-radius: 2px;
        border: 1px solid #13a663;
      }
    }

    .tableEvening {
      width: 16px;
      height: 16px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin-right: 8px;
      color: #3d7eff;
      line-height: 17px;
      background: #fef8f6;
      border-radius: 2px;
      border: 1px solid #ff5b02;
    }
  }
}

.week-check {
  width: 500px;
  height: 300px;
  margin: auto;

  .top {
    height: 50px;
    font-size: 14px;
    font-weight: bold;
    line-height: 35px;
  }

  .list {
    display: flex;

    .week-one {
      width: 200px;
      height: 150px;
      border-radius: 5px;
      border: 1px solid #ddd;
      color: #0052d9;
      text-align: center;
      margin: 20px;
      padding: 20px;
      position: relative;

      p {
        height: 45px;
        line-height: 45px;
      }

      .check {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
// ::v-deep(.t-table th, .t-table td) {
//   padding: 20px 0 !important;
// }
::v-deep(.t-align-center) {
  padding: 20px 0 !important;
}
.d-btn {
  margin-right: 15px;
}
// .top-btn {
//   margin-right: 25px;
// }
</style>
