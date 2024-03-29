<template>
  <div class="user-box">
    <div class="box-img">
      <div class="box-left" @click="handlerRest">
        <!-- <img src="../../assets/img/knowledge/outIcon.png" alt="图标" /> -->
        <t-button class="img-btn" theme="default" variant="text" style="padding: 0">数据列表</t-button>
      </div>
      <div class="expansion" v-if="setArrt.status == 1">
        <div style="font-size: 14px; cursor: pointer" v-if="setArrt.displayNum" @click="displayDiv">
          收起
          <img src="../../assets/img/custom/contract.png" alt="" />
        </div>
        <div style="font-size: 14px; cursor: pointer" v-else @click="displayDiv">
          展开
          <img src="../../assets/img/custom/develop.png" alt="" />
        </div>
      </div>
      <div class="expansion" v-if="setArrt.status == 2">
        <div style="font-size: 14px; cursor: pointer" v-if="setArrt.employeeShow" @click="displayDiv">
          收起
          <img src="../../assets/img/custom/contract.png" alt="" />
        </div>
        <div style="font-size: 14px; cursor: pointer" v-else @click="displayDiv">
          展开
          <img src="../../assets/img/custom/develop.png" alt="" />
        </div>
      </div>
      <div class="expansion" v-if="setArrt.status == 3">
        <div style="font-size: 14px; cursor: pointer" v-if="setArrt.institutionShow" @click="displayDiv">
          收起
          <img src="../../assets/img/custom/contract.png" alt="" />
        </div>
        <div style="font-size: 14px; cursor: pointer" v-else @click="displayDiv">
          展开
          <img src="../../assets/img/custom/develop.png" alt="" />
        </div>
      </div>
    </div>

    <div class="tabIndex">
      <div @click="tabClick(1)" class="search" :class="setArrt.status == 1 ? 'active' : ''"><span class="searchItem">用户</span></div>
      <div @click="tabClick(2)" class="search" :class="setArrt.status == 2 ? 'active' : ''"><span class="searchItem">员工</span></div>
      <div @click="tabClick(3)" class="search" :class="setArrt.status == 3 ? 'active' : ''"><span class="searchItem">机构</span></div>
    </div>

    <div class="search-box" v-if="setArrt.status == 1">
      <div class="search-item">档案编号:<t-input class="ipt-slt" v-model="setArrt.recordData.archivesNo" auto-width placeholder="请输入档案编号" /></div>
      <div class="search-item">姓名:<t-input class="ipt-slt" v-model="setArrt.recordData.archivesName" auto-width placeholder="请输入姓名" /></div>
      <div class="search-item">量表名称:<t-input class="ipt-slt" v-model="setArrt.recordData.estimateName" auto-width placeholder="请输入量表名称" /></div>
      <div class="search-item">出生日期:<t-date-range-picker v-model="setArrt.birthDateValue" allow-input clearable @change="onDayChange" /></div>
      <div class="search-box" v-show="setArrt.displayNum">
        <div class="search-item">
          <span style="width: 110px">归属机构:</span>
          <t-cascader
            v-if="roleState.userInfo.organizationLevel == 1 || roleState.userInfo.organizationLevel == 2"
            size="large"
            v-model="setArrt.recordData.organCodes"
            class="ipt-slt"
            :options="setArrt.organOption"
            :keys="{ label: 'label', value: 'organizationNum', children: 'children' }"
            multiple
            :min-collapsed-num="1"
            @change="onCheckChange"
            clearable
          >
            <template #collapsedItems="{ collapsedSelectedItems, count }">
              <t-popup>
                <span v-show="count > 0" style="color: #00a870; margin-left: 10px">已选中{{ count + 1 }}个机构</span>
              </t-popup>
            </template>
          </t-cascader>
          <t-input class="ipt-slt" v-if="roleState.userInfo.organizationLevel == 3" :value="roleState.userInfo.organizationName" auto-width disabled />
        </div>
        <div class="search-item">性别:<t-select style="width: 180px; margin-left: 5px" class="ipt-slt" v-model="setArrt.recordData.sex" :options="setArrt.sexOption" placeholder="请选择"></t-select></div>
        <div class="search-item">联系电话:<t-input class="ipt-slt" v-model="setArrt.recordData.phone" auto-width placeholder="请输入联系电话" :maxlength="11" /></div>
        <div class="search-item">评估时间:<t-date-range-picker v-model="setArrt.estimateDateValue" allow-input clearable @change="onEstChange" /></div>
        <div class="search-item">
          BHI结果:
          <t-select style="width: 180px; margin-left: 5px" class="ipt-slt" v-model="setArrt.recordData.riskType" :options="setArrt.bhiRestoptions" placeholder="请选择"></t-select>
        </div>
        <div class="search-item search-item-font">
          BHI分数: <t-input-number class="ipt-slt" :min="0" :decimalPlaces="1" v-model="setArrt.recordData.bhiStart" auto-width />~
          <t-input-number class="ipt-slt" :min="0" :decimalPlaces="1" v-model="setArrt.recordData.bhiEnd" auto-width />
        </div>
        <div class="search-item search-item-font">
          评估分数: <t-input-number class="ipt-slt" :min="0" v-model="setArrt.recordData.estimateScoreStart" auto-width />~
          <t-input-number class="ipt-slt" :min="0" v-model="setArrt.recordData.estimateScoreEnd" auto-width />
        </div>
        <div class="search-item">学历:<t-select style="width: 180px; margin-left: 5px" class="ipt-slt" v-model="setArrt.recordData.education" :options="setArrt.eduOption" placeholder="请选择"></t-select></div>
        <div class="search-item">评估结果:<t-select style="width: 180px; margin-left: 5px" class="ipt-slt" v-model="setArrt.recordData.estimateResult" :options="setArrt.estRestoptions" placeholder="请选择"></t-select></div>
        <div class="search-item">建档时间:<t-date-range-picker v-model="setArrt.recordDateValue" allow-input clearable @change="onArcChange" /></div>
        <div class="search-item">评估编号:<t-input class="ipt-slt" v-model="setArrt.recordData.estimateNum" auto-width placeholder="请输入评估编号" /></div>
        <div class="search-item">评估员:<t-input class="ipt-slt" v-model="setArrt.recordData.assessorName" auto-width placeholder="请输入评估员" /></div>
        <div class="search-item">服务产品:<t-input class="ipt-slt" v-model="setArrt.recordData.serviceProductName" auto-width placeholder="请输入服务产品" /></div>
      </div>

      <div class="operate-box">
        <t-button class="search-btn" theme="primary" @click="search" variant="outline">
          <template #icon> <SearchIcon /> </template>搜索</t-button
        >
        <t-button @click="rest" class="rest-item"><span class="rest">重置</span></t-button>
        <t-button @click="exportUser" class="export-item" variant="outline"><span class="export">导出</span></t-button>
      </div>
    </div>

    <div class="search-box" v-if="setArrt.status == 2">
      <div class="search-item">员工ID:<t-input class="ipt-slt" v-model="setArrt.findData.id" @keyup="setArrt.findData.id = setArrt.findData.id.replace(/[^\d]+/g, '')" auto-width placeholder="请输入员工ID" /></div>
      <div class="search-item">姓名:<t-input class="ipt-slt" v-model="setArrt.findData.name" auto-width placeholder="请输入姓名" /></div>
      <div class="search-item">账号状态:<t-select style="width: 180px; margin-left: 5px" class="ipt-slt" v-model="setArrt.findData.status" :options="setArrt.accOption" placeholder="请选择"></t-select></div>
      <div class="search-item search-item-font">
        渠道排名: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.channelLeftRank = setArrt.findData.channelLeftRank.replace(/[^\d]/g, '')" v-model="setArrt.findData.channelLeftRank" auto-width placeholder="请输入" />~
        <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.channelRightRank = setArrt.findData.channelRightRank.replace(/[^\d]/g, '')" v-model="setArrt.findData.channelRightRank" auto-width placeholder="请输入" />
      </div>

      <div class="search-box" v-show="setArrt.employeeShow">
        <div class="search-item">登录账号:<t-input class="ipt-slt" v-model="setArrt.findData.account" auto-width placeholder="请输入登录账号" /></div>
        <div class="search-item">性别:<t-select style="width: 180px; margin-left: 5px" class="ipt-slt" v-model="setArrt.findData.sex" :options="setArrt.sexOption" placeholder="请选择"></t-select></div>
        <div class="search-item">联系电话:<t-input class="ipt-slt" v-model="setArrt.findData.phone" auto-width placeholder="请输入联系电话" /></div>
        <div class="search-item search-item-font">
          机构排名: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.organLeftRank = setArrt.findData.organLeftRank.replace(/[^\d]/g, '')" v-model="setArrt.findData.organLeftRank" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.organRightRank = setArrt.findData.channelLeftRank.replace(/[^\d]/g, '')" v-model="setArrt.findData.organRightRank" auto-width placeholder="请输入" />
        </div>
        <div class="search-item">
          <span style="width: 110px">归属机构:</span>
          <t-cascader
            v-if="roleState.userInfo.organizationLevel == 1 || roleState.userInfo.organizationLevel == 2"
            size="large"
            v-model="setArrt.findData.organCodes"
            class="ipt-slt"
            :options="setArrt.organOption"
            :keys="{ label: 'label', value: 'organizationNum', children: 'children' }"
            multiple
            :min-collapsed-num="1"
            @change="onCheckChange"
            clearable
          >
            <template #collapsedItems="{ collapsedSelectedItems, count }">
              <t-popup>
                <span v-show="count > 0" style="color: #00a870; margin-left: 10px">已选中{{ count + 1 }}个机构</span>
              </t-popup>
            </template>
          </t-cascader>
          <t-input class="ipt-slt" v-if="roleState.userInfo.organizationLevel == 3" :value="roleState.userInfo.organizationName" auto-width disabled />
        </div>
        <div class="search-item">岗位:<t-input class="ipt-slt" v-model="setArrt.findData.posName" auto-width placeholder="请输入姓名" /></div>
        <div class="search-item search-item-font">
          建档人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.archivesLeftCount = setArrt.findData.archivesLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.findData.archivesLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.archivesRightCount = setArrt.findData.archivesRightCount.replace(/[^\d]/g, '')" v-model="setArrt.findData.archivesRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          评估人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.estimateLeftCount = setArrt.findData.estimateLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.findData.estimateLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.findData.estimateRightCount = setArrt.findData.estimateRightCount.replace(/[^\d]/g, '')" v-model="setArrt.findData.estimateRightCount" auto-width placeholder="请输入" />
        </div>
      </div>
      <div class="operate-box">
        <t-button class="search-btn" theme="primary" @click="search" variant="outline">
          <template #icon> <SearchIcon /> </template>搜索</t-button
        >
        <t-button @click="rest" class="rest-item"><span class="rest">重置</span></t-button>
        <t-button @click="exportUser" class="export-item" variant="outline"><span class="export">导出</span></t-button>
      </div>
    </div>

    <div class="search-box" v-if="setArrt.status == 3">
      <div class="search-item search-item-font">
        眼动正常人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.normalLeftCount = setArrt.titleData.normalLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.normalLeftCount" auto-width placeholder="请输入" />~
        <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.normalRightCount = setArrt.titleData.normalRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.normalRightCount" auto-width placeholder="请输入" />
      </div>
      <div class="search-item search-item-font">
        BHI正常人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiNormalLeftCount = setArrt.titleData.bhiNormalLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiNormalLeftCount" auto-width placeholder="请输入" />~
        <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiNormalRightCount = setArrt.titleData.bhiNormalRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiNormalRightCount" auto-width placeholder="请输入" />
      </div>
      <div class="search-item search-item-font">
        筛查评估员人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.estimateLeftCount = setArrt.titleData.estimateLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.estimateLeftCount" auto-width placeholder="请输入" />~
        <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.estimateRightCount = setArrt.titleData.estimateRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.estimateRightCount" auto-width placeholder="请输入" />
      </div>
      <div class="search-item">
        <span style="width: 110px">机构名称:</span>
        <t-cascader
          v-if="roleState.userInfo.organizationLevel == 1 || roleState.userInfo.organizationLevel == 2"
          size="large"
          v-model="setArrt.titleData.organCodes"
          class="ipt-slt"
          :options="setArrt.organOption"
          :keys="{ label: 'label', value: 'organizationNum', children: 'children' }"
          multiple
          :min-collapsed-num="1"
          @change="onCheckChange"
          clearable
        >
          <template #collapsedItems="{ collapsedSelectedItems, count }">
            <t-popup>
              <span v-show="count > 0" style="color: #00a870; margin-left: 10px">已选中{{ count + 1 }}个机构</span>
            </t-popup>
          </template>
        </t-cascader>
        <t-input class="ipt-slt" v-if="roleState.userInfo.organizationLevel == 3" :value="roleState.userInfo.organizationName" auto-width disabled />
      </div>

      <div class="search-box" v-show="setArrt.institutionShow">
        <div class="search-item search-item-font">
          眼动低风险人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.lowRiskLeftCount = setArrt.titleData.lowRiskLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.lowRiskLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.lowRiskRightCount = setArrt.titleData.lowRiskRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.lowRiskRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          BHI低风险人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiLowRiskLeftCount = setArrt.titleData.bhiLowRiskLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiLowRiskLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiLowRiskRightCount = setArrt.titleData.bhiLowRiskRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiLowRiskRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          总评估数量: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.totalEstimateLeftCount = setArrt.titleData.totalEstimateLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.totalEstimateLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.totalEstimateRightCount = setArrt.titleData.totalEstimateRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.totalEstimateRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item">
          <span>归属城市:</span>
          <t-input class="ipt-slt" v-model="setArrt.titleData.cityName" auto-width placeholder="请输入" />
          <!-- <t-cascader v-model="setArrt.titleData.cityName" :options="setArrt.cityOptions" check-strictly
            @change="cityChange" /> -->
        </div>
        <div class="search-item search-item-font">
          眼动中风险人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.mediumRiskLeftCount = setArrt.titleData.mediumRiskLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.mediumRiskLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.mediumRiskRightCount = setArrt.titleData.mediumRiskRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.mediumRiskRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          BHI中风险人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiMediumRiskLeftCount = setArrt.titleData.bhiMediumRiskLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiMediumRiskLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiMediumRiskRightCount = setArrt.titleData.bhiMediumRiskRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiMediumRiskRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          总评估员数量: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.totalEmployNumLeftCount = setArrt.titleData.totalEmployNumLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.totalEmployNumLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.totalEmployNumRightCount = setArrt.titleData.totalEmployNumRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.totalEmployNumRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          眼动高风险人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.highRiskLeftCount = setArrt.titleData.highRiskLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.highRiskLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.highRiskRightCount = setArrt.titleData.highRiskRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.highRiskRightCount" auto-width placeholder="请输入" />
        </div>
        <div class="search-item search-item-font">
          BHI高风险人数: <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiHighRiskLeftCount = setArrt.titleData.bhiHighRiskLeftCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiHighRiskLeftCount" auto-width placeholder="请输入" />~
          <t-input class="ipt-slt" :maxlength="5" @keyup="setArrt.titleData.bhiHighRiskRightCount = setArrt.titleData.bhiHighRiskRightCount.replace(/[^\d]/g, '')" v-model="setArrt.titleData.bhiHighRiskRightCount" auto-width placeholder="请输入" />
        </div>
      </div>
      <div class="operate-box">
        <t-button class="search-btn" theme="primary" @click="search" variant="outline">
          <template #icon> <SearchIcon /> </template>搜索</t-button
        >
        <t-button @click="rest" class="rest-item"><span class="rest">重置</span></t-button>
        <t-button @click="exportUser" class="export-item" variant="outline"><span class="export">导出</span></t-button>
      </div>
    </div>

    <!-- <load :status="loadStatus" :schedule="schedule" v-if="setArrt.userData?.length == 0"></load> -->
    <div class="tab-box">
      <!-- v-else -->
      <t-table row-key="id" bordered v-if="setArrt.status == 1" :rowspan-and-colspan="(rowspanAndColspan as any)" :data="setArrt.userData" :columns="(userColumns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed">
        <template #estimateResult="{ row }">
          <span style="color: #3d7eff" v-if="row.estimateResult === '正常'">{{ row.estimateResult }}</span>
          <span style="color: #f9900e" v-if="row.estimateResult == '低风险'">{{ row.estimateResult }}</span>
          <span style="color: #d76f00" v-if="row.estimateResult == '中风险'">{{ row.estimateResult }}</span>
          <span style="color: #ff0000" v-if="row.estimateResult == '高风险'">{{ row.estimateResult }}</span>
        </template>
        <template #riskType="{ row }">
          <span style="color: #3d7eff" v-if="row.riskType === '正常'">{{ row.riskType }}</span>
          <span style="color: #f9900e" v-if="row.riskType == '低风险'">{{ row.riskType }}</span>
          <span style="color: #d76f00" v-if="row.riskType == '中风险'">{{ row.riskType }}</span>
          <span style="color: #ff0000" v-if="row.riskType == '高风险'">{{ row.riskType }}</span>
        </template>
      </t-table>

      <t-table row-key="id" v-if="setArrt.status == 2" :data="setArrt.userData" :columns="(personColumns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false">
        <template #sex="{ row }">
          <span>{{ row.sex == 1 ? '男' : '女' }}</span>
        </template>
        <template #status="{ row }">
          <span>{{ row.status == 1 ? '禁用' : '启用' }}</span>
        </template>
      </t-table>

      <t-table row-key="id" v-if="setArrt.status == 3" :data="setArrt.userData" :columns="(instiColumns as PrimaryTableCol<TableRowData>[])" size="medium" table-layout="fixed" :bordered="false"> </t-table>

      <t-pagination :pageSize="setArrt.searchData.pageSize" v-model:current="setArrt.searchData.pageNum" :total="setArrt.total" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />

      <t-dialog v-model:visible="setArrt.visible" theme="warning" header="提示" body="一次最多导出五千条数据，您已超出，请检查后重新导出" :on-close="close" :cancel-btn="null" @confirm="disModel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AddIcon, SearchIcon } from 'tdesign-icons-vue-next';
import { DateRangeValue, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { userColumns, personColumns, instiColumns } from './data/configuration';
import { getFindlist, getFindOrganList, getRecordslist } from '../../request/modules/DeriveList';
import { useRoleStore } from '../../store/modules/role';
import { debounce } from '../../utils/tools';
import load from '../../components/load/load.vue';
import axios from 'axios'; // 引入axios
import { getOrganMultiSelect } from '@/request/modules/institution';
import { queryCity } from '@/request/modules/OrganizationApi';
import { StringifyOptions } from 'querystring';
const roleState = useRoleStore();
const token = localStorage.getItem('x-auth-token');
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/zskj/admin/';
axios.defaults.headers.common['token'] = token;
const router = useRouter();
let schedule = ref<number>(20); //加载中进度
let loadStatus = ref<string>(''); //loading-加载中,noData-无数据,failure-加载失败
const setArrt = reactive<any>({
  displayNum: true,
  employeeShow: true,
  institutionShow: true,
  visible: false,
  birthDateValue: [],
  estimateDateValue: [],
  recordDateValue: [],
  userData: [],
  cityOptions: [],
  organOption: [{ label: '', value: '', children: [] }],
  status: 1,
  searchData: {
    pageNum: 1,
    pageSize: 10
  },
  recordData: {
    // 用户
    archivesNo: '', //档案编号
    archivesName: '', //姓名
    estimateName: '', //量表名称
    birthdayStartTime: '', //生日开始时间
    birthdayEndTime: '', //生日结束时间
    organCodes: [], //归属机构传 机构编号数组
    sex: null, //性别
    phone: '', //联系电话：
    estimateStartTime: '', //评估开始时间
    estimateEndTime: '', //评估结束时间
    riskType: null, // BHI结果
    bhiStart: undefined, //bhi分数开始
    bhiEnd: undefined, //bhi分数结束
    estimateScoreStart: undefined, //评估分数开始
    estimateScoreEnd: undefined, //评估分数结束
    education: null, //学历
    estimateResult: null, //评估结果
    archivesStartTime: '', //建档开始时间
    archivesEndTime: '', //建档结束时间
    estimateNum: '', //评估编号
    assessorName: '', //评估员
    serviceProductName: '', //服务产品
    pageNum: 1,
    pageSize: 10
  },
  findData: {
    //员工
    id: undefined as any, //id
    name: '', //姓名
    status: null, //账号状态
    organCodes: [], //归属机构
    account: '', //登陆账号
    archivesLeftCount: undefined, //建档人数左区间
    archivesRightCount: undefined, //建档人数右区间
    channelLeftRank: undefined, //渠道排名左区间
    channelRightRank: undefined, //渠道排名右区间
    estimateLeftCount: undefined, //评估人数左区间
    estimateRightCount: undefined, //评估人数右区间
    organLeftRank: undefined, //机构排名左区间
    organRightRank: undefined, //机构排名右区间
    phone: '', //联系电话
    posName: '', //岗位
    sex: null, //性别：1-男，2-女，3-未知
    pageNum: 1,
    pageSize: 10
  },
  titleData: {
    // 机构
    bhiHighRiskLeftCount: undefined, //BHI高风险人数左区间
    bhiHighRiskRightCount: undefined, //BHI高风险人数右区间
    bhiLowRiskLeftCount: undefined, //BHI低风险人数左区间
    bhiLowRiskRightCount: undefined, //BHI低风险人数右区间
    bhiMediumRiskLeftCount: undefined, //BHI中风险人数左区间
    bhiMediumRiskRightCount: undefined, //BHI中风险人数右区间
    bhiNormalLeftCount: undefined, //BHI正常人数左区间
    bhiNormalRightCount: undefined, //BHI正常人数右区间
    cityName: '', //归属城市
    estimateLeftCount: undefined, //筛查评估员数量左区间
    estimateRightCount: undefined, //筛查评估员数量右区间
    highRiskLeftCount: undefined, //眼动高风险人数左区间
    highRiskRightCount: undefined, //眼动高风险人数右区间
    lowRiskLeftCount: undefined, //眼动低风险人数左区间
    lowRiskRightCount: undefined, //眼动低风险人数右区间
    mediumRiskLeftCount: undefined, //眼动中风险人数左区间
    mediumRiskRightCount: undefined, //眼动中风险人数右区间
    normalLeftCount: undefined, //眼动正常人数左区间
    normalRightCount: undefined, //眼动正常人数右区间
    organName: '', //机构名称
    organCodes: [], //机构名称
    totalEstimateLeftCount: undefined, //总评估数量左区间
    totalEstimateRightCount: undefined, //总评估数量右区间
    totalEmployNumLeftCount: undefined, //总评估员数量右区间
    totalEmployNumRightCount: undefined, //总评估员数量右区间
    pageNum: 1,
    pageSize: 10
  },
  total: 10,
  addVisible: false,
  eduOption: [
    { label: '全部', value: null },
    { label: '小学及以下', value: 0 },
    { label: '小学', value: 1 },
    { label: '初中', value: 2 },
    { label: '高中', value: 3 },
    { label: '大专及以上', value: 4 }
  ],
  sexOption: [
    { label: '全部', value: null },
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ],
  accOption: [
    { label: '全部', value: null },
    { label: '禁用', value: 1 },
    { label: '启用', value: 0 }
  ],
  estRestoptions: [
    { label: '全部', value: null },
    { label: '正常', value: 1 },
    { label: '低风险', value: 2 },
    { label: '中风险', value: 3 },
    { label: '高风险', value: 4 }
  ],
  bhiRestoptions: [
    { label: '全部', value: null },
    { label: '正常', value: 1 },
    { label: '低风险', value: 2 },
    { label: '中风险', value: 3 },
    { label: '高风险', value: 4 }
  ]
});

onMounted(() => {
  getCity();
  getSelectList();
  getUserlistData();
});

//搜索
const search = () => {
  if (setArrt.status === 1) {
    setArrt.searchData = Object.assign(setArrt.searchData, setArrt.recordData);
    setArrt.searchData.pageNum = 1;
    getUserlistData();
  } else if (setArrt.status === 2) {
    setArrt.searchData = Object.assign(setArrt.searchData, setArrt.findData);
    setArrt.searchData.pageNum = 1;
    getfindListData();
  } else {
    setArrt.searchData = Object.assign(setArrt.searchData, setArrt.titleData);
    setArrt.searchData.pageNum = 1;
    getOrganListData();
  }
};

const onCheckChange = (value: any, context: any) => {
  console.log(value, 'ppppp');
  console.log(context, 'ppppp');
  console.log(setArrt.status, 'rrrr');
  if (setArrt.status === 1) {
    setArrt.recordData.organCodes = value;
  } else if (setArrt.status === 2) {
    setArrt.findData.organCodes = value;
  } else {
    setArrt.titleData.organCodes = value;
  }
};
const cityChange = (val: any, context: any) => {
  console.log(val, context);
  console.log(context.node.data.code);
  setArrt.titleData.cityName = context.node.data.label;
};

// const setInputNumber = () => {
//   if (setArrt.findData.id) {
//     setArrt.findData.id = setArrt.findData.id.replace(/[^0-9]/g, '')
//   }
// }

const displayDiv = () => {
  if (setArrt.status === 1) {
    setArrt.displayNum = !setArrt.displayNum;
  } else if (setArrt.status === 2) {
    setArrt.employeeShow = !setArrt.employeeShow;
  } else {
    setArrt.institutionShow = !setArrt.institutionShow;
  }
};

// 切换tab
const tabClick = (index: number) => {
  console.log(setArrt.searchData);
  setArrt.status = index;
  setArrt.searchData = {
    pageNum: 1,
    pageSize: 10
  };
  if (index === 1) {
    setArrt.birthDateValue = [];
    setArrt.estimateDateValue = [];
    setArrt.recordDateValue = [];
    setArrt.recordData = {
      archivesNo: '', //档案编号
      archivesName: '', //姓名
      estimateName: '', //量表名称
      birthdayStartTime: '', //生日开始时间
      birthdayEndTime: '', //生日结束时间
      organCodes: [], //归属机构传 机构编号数组
      sex: null, //性别
      phone: '', //联系电话：
      estimateStartTime: '', //评估开始时间
      estimateEndTime: '', //评估结束时间
      riskType: null, // BHI结果
      bhiStart: undefined, //bhi分数开始
      bhiEnd: undefined, //bhi分数结束
      estimateScoreStart: undefined, //评估分数开始
      estimateScoreEnd: undefined, //评估分数结束
      education: null, //学历
      estimateResult: null, //评估结果
      archivesStartTime: '', //建档开始时间
      archivesEndTime: '', //建档结束时间
      estimateNum: '', //评估编号
      assessorName: '', //评估员
      serviceProductName: '', //服务产品
      pageNum: 1,
      pageSize: 10
    };
    getUserlistData();
  } else if (index === 2) {
    setArrt.findData = {
      //员工
      id: undefined as any, //id
      name: '', //姓名
      status: null, //账号状态
      organCodes: [], //归属机构
      account: '', //登陆账号
      archivesLeftCount: undefined, //建档人数左区间
      archivesRightCount: undefined, //建档人数右区间
      channelLeftRank: undefined, //渠道排名左区间
      channelRightRank: undefined, //渠道排名右区间
      estimateLeftCount: undefined, //评估人数左区间
      estimateRightCount: undefined, //评估人数右区间
      organLeftRank: undefined, //机构排名左区间
      organRightRank: undefined, //机构排名右区间
      phone: '', //联系电话
      posName: '', //岗位
      sex: null, //性别：1-男，2-女，3-未知
      pageNum: 1,
      pageSize: 10
    };
    getfindListData();
  } else {
    setArrt.titleData = {
      // 机构
      bhiHighRiskLeftCount: undefined, //BHI高风险人数左区间
      bhiHighRiskRightCount: undefined, //BHI高风险人数右区间
      bhiLowRiskLeftCount: undefined, //BHI低风险人数左区间
      bhiLowRiskRightCount: undefined, //BHI低风险人数右区间
      bhiMediumRiskLeftCount: undefined, //BHI中风险人数左区间
      bhiMediumRiskRightCount: undefined, //BHI中风险人数右区间
      bhiNormalLeftCount: undefined, //BHI正常人数左区间
      bhiNormalRightCount: undefined, //BHI正常人数右区间
      cityName: '', //归属城市
      estimateLeftCount: undefined, //筛查评估员数量左区间
      estimateRightCount: undefined, //筛查评估员数量右区间
      highRiskLeftCount: undefined, //眼动高风险人数左区间
      highRiskRightCount: undefined, //眼动高风险人数右区间
      lowRiskLeftCount: undefined, //眼动低风险人数左区间
      lowRiskRightCount: undefined, //眼动低风险人数右区间
      mediumRiskLeftCount: undefined, //眼动中风险人数左区间
      mediumRiskRightCount: undefined, //眼动中风险人数右区间
      normalLeftCount: undefined, //眼动正常人数左区间
      normalRightCount: undefined, //眼动正常人数右区间
      organName: '', //机构名称
      organCodes: [], //机构名称
      totalEstimateLeftCount: undefined, //总评估数量左区间
      totalEstimateRightCount: undefined, //总评估数量右区间
      totalEmployNumLeftCount: undefined, //总评估员数量右区间
      totalEmployNumRightCount: undefined, //总评估员数量右区间
      pageNum: 1,
      pageSize: 10
    };
    getOrganListData();
  }
};

const getlist = () => {
  if (setArrt.status === 1) {
    getUserlistData();
  } else if (setArrt.status === 2) {
    getfindListData();
  } else {
    getOrganListData();
  }
};
// const rowSpanCountRef = ref<any>();

// 获取用户列表
const getUserlistData = () => {
  getRecordslist(setArrt.searchData).then((res: any) => {
    console.log(res);
    if (res.code === 200) {
      setArrt.total = res.data.total;
      let response = res.data.data;
      let archivesNoPrev = '';
      let rowSpanCount = 0;
      for (let index = 0; index < response.length; index++) {
        const item = response[index];
        if (index == 0) {
          archivesNoPrev = item.archivesNo;
          continue;
        }
        if (archivesNoPrev == item.archivesNo) {
          rowSpanCount++;
          response[index - rowSpanCount].rowSpanCount = rowSpanCount + 1;
        } else {
          rowSpanCount = 0;
        }
        archivesNoPrev = item.archivesNo;
      }
      setArrt.userData = response;
      // rowSpanCountRef.value = response;
      console.log(setArrt.userData, 'setArrt.userData');
    }
  });
};
// 获取员工列表
const getfindListData = () => {
  getFindlist(setArrt.searchData).then((res: any) => {
    console.log(res);
    if (res.code === 200) {
      setArrt.userData = res.data.data;
      setArrt.total = res.data.total;
    }
  });
};
// 获取机构列表
const getOrganListData = () => {
  getFindOrganList(setArrt.searchData).then((res: any) => {
    console.log(res);
    if (res.code === 200) {
      setArrt.userData = res.data.data;
      setArrt.total = res.data.total;
    }
  });
};

// 获取归属机构
const getSelectList = () => {
  getOrganMultiSelect().then((res: any) => {
    if (res.code === 200) {
      console.log(res);
      let data = [] as any;
      for (let i = 0; i < res.data.length; i++) {
        const el = res.data[i];
        if (el.children.length) {
          data.push(el);
        }
      }
      setArrt.organOption = data;
    }
  });
};

// 获取归属城市
const getCity = () => {
  queryCity().then((res: any) => {
    setArrt.cityOptions = res.data;
  });
};
//导出
const exportUser = debounce(() => {
  if (setArrt.status === 1) {
    if (setArrt.total <= 5000) {
      exprotExcelFile('exportPlat/export/excelExportBhiRecordsPage');
    } else {
      setArrt.visible = true;
    }
  } else if (setArrt.status === 2) {
    if (setArrt.total <= 5000) {
      exprotExcelFile('exportPlat/export/excelFindEmployPage');
    } else {
      setArrt.visible = true;
    }
  } else {
    if (setArrt.total <= 5000) {
      exprotExcelFile('exportPlat/export/excelFindOrganPage');
    } else {
      setArrt.visible = true;
    }
  }
}, 300);

const exprotExcelFile = (questUrl: string) => {
  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json' //'Access-Control-Allow-Origin'
    },
    url: uploadUrl + questUrl,
    responseType: 'blob',
    data: setArrt.searchData
  }).then(res => {
    let content_disposition: string = res.headers['content-disposition'];
    console.log(content_disposition);
    let filename = decodeURI(content_disposition.split(';')[1].split('=')[1]);
    let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
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

const onDayChange = (value: DateRangeValue) => {
  setArrt.recordData.birthdayStartTime = value[0] as string;
  setArrt.recordData.birthdayEndTime = value[1] as string;
};
const onEstChange = (value: DateRangeValue) => {
  setArrt.recordData.estimateStartTime = value[0] as string;
  setArrt.recordData.estimateEndTime = value[1] as string;
};
const onArcChange = (value: DateRangeValue) => {
  setArrt.recordData.archivesStartTime = value[0] as string;
  setArrt.recordData.archivesEndTime = value[1] as string;
};

//重置
const rest = () => {
  console.log(setArrt.status);
  setArrt.searchData = {
    pageNum: 1,
    pageSize: 10
    // organCodes: []
  };
  if (setArrt.status === 1) {
    setArrt.birthDateValue = [];
    setArrt.estimateDateValue = [];
    setArrt.recordDateValue = [];
    setArrt.recordData = {
      archivesNo: '', //档案编号
      archivesName: '', //姓名
      estimateName: '', //量表名称
      birthdayStartTime: '', //生日开始时间
      birthdayEndTime: '', //生日结束时间
      organCodes: [], //归属机构传 机构编号数组
      sex: null, //性别
      phone: '', //联系电话：
      estimateStartTime: '', //评估开始时间
      estimateEndTime: '', //评估结束时间
      riskType: null, // BHI结果
      bhiStart: undefined, //bhi分数开始
      bhiEnd: undefined, //bhi分数结束
      estimateScoreStart: undefined, //评估分数开始
      estimateScoreEnd: undefined, //评估分数结束
      education: null, //学历
      estimateResult: null, //评估结果
      archivesStartTime: '', //建档开始时间
      archivesEndTime: '', //建档结束时间
      estimateNum: '', //评估编号
      assessorName: '', //评估员
      serviceProductName: '', //服务产品
      pageNum: 1,
      pageSize: 10
    };
    getUserlistData();
  } else if (setArrt.status === 2) {
    setArrt.findData = {
      //员工
      id: undefined as any, //id
      name: '', //姓名
      status: null, //账号状态
      organCodes: [], //归属机构
      account: '', //登陆账号
      archivesLeftCount: undefined, //建档人数左区间
      archivesRightCount: undefined, //建档人数右区间
      channelLeftRank: undefined, //渠道排名左区间
      channelRightRank: undefined, //渠道排名右区间
      estimateLeftCount: undefined, //评估人数左区间
      estimateRightCount: undefined, //评估人数右区间
      organLeftRank: undefined, //机构排名左区间
      organRightRank: undefined, //机构排名右区间
      phone: '', //联系电话
      posName: '', //岗位
      sex: null, //性别：1-男，2-女，3-未知
      pageNum: 1,
      pageSize: 10
    };
    getfindListData();
  } else {
    setArrt.titleData = {
      // 机构
      bhiHighRiskLeftCount: undefined, //BHI高风险人数左区间
      bhiHighRiskRightCount: undefined, //BHI高风险人数右区间
      bhiLowRiskLeftCount: undefined, //BHI低风险人数左区间
      bhiLowRiskRightCount: undefined, //BHI低风险人数右区间
      bhiMediumRiskLeftCount: undefined, //BHI中风险人数左区间
      bhiMediumRiskRightCount: undefined, //BHI中风险人数右区间
      bhiNormalLeftCount: undefined, //BHI正常人数左区间
      bhiNormalRightCount: undefined, //BHI正常人数右区间
      cityName: '', //归属城市
      estimateLeftCount: undefined, //筛查评估员数量左区间
      estimateRightCount: undefined, //筛查评估员数量右区间
      highRiskLeftCount: undefined, //眼动高风险人数左区间
      highRiskRightCount: undefined, //眼动高风险人数右区间
      lowRiskLeftCount: undefined, //眼动低风险人数左区间
      lowRiskRightCount: undefined, //眼动低风险人数右区间
      mediumRiskLeftCount: undefined, //眼动中风险人数左区间
      mediumRiskRightCount: undefined, //眼动中风险人数右区间
      normalLeftCount: undefined, //眼动正常人数左区间
      normalRightCount: undefined, //眼动正常人数右区间
      organName: '', //机构名称
      organCodes: [], //机构名称
      totalEstimateLeftCount: undefined, //总评估数量左区间
      totalEstimateRightCount: undefined, //总评估数量右区间
      totalEmployNumLeftCount: undefined, //总评估员数量右区间
      totalEmployNumRightCount: undefined, //总评估员数量右区间
      pageNum: 1,
      pageSize: 10
    };
    console.log(setArrt.titleData);
    getOrganListData();
  }
};

//后退
const handlerRest = () => {
  // router.go(-1);
};

const close = () => {
  setArrt.visible = false;
};
const disModel = () => {
  setArrt.visible = false;
};

//分页
const pageSizeChange = (pageSize: any) => {
  console.log(pageSize);
  setArrt.searchData.pageSize = pageSize;
  setArrt.searchData.pageNum = 1;
  getlist();
};
const currentChange = (current: number) => {
  console.log(current);
  setArrt.searchData.pageNum = current;
  getlist();
};
//0, 1, 2, 3, 4, 5, 6, 7, 13, 14
const rowspanAndColspan = ({ col, row, rowIndex, colIndex }) => {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14];
  console.log(colIndex, 'colIndex');
  console.log(rowIndex, 'rowIndex');
  if (arr.includes(colIndex)) {
    return {
      rowspan: row.rowSpanCount || 0
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
  background: #ffffff;
  padding: 16px 20px;

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

  .tabIndex {
    display: flex;

    .search {
      width: 80px;
      height: 30px;
      background: #ffffff;
      box-shadow: 0px 2px 4px 0px #fafbff;
      border-radius: 6px;
      text-align: center;
      line-height: 30px;
      border: 1px solid #3d7eff;
      color: #3d7eff;
      margin-right: 10px;
      cursor: pointer;

      .searchItem {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        line-height: 32px;
      }
    }

    .active {
      color: #fff;
      background: #3d7eff;
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 0;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
    box-sizing: border-box;

    .operate-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 10px;

      ::v-deep(.t-button) {
        width: 102px;
        height: 44px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 10px;
        border: 1px solid #3d7eff !important;
        margin-right: 12px;
      }

      ::v-deep(.t-button__text) {
        margin-left: 2px;
      }

      ::v-deep(.t-icon-search) {
        font-size: 20px;
      }

      .rest {
        color: #ffffff;
      }

      .export {
        color: #3d7eff;
      }
    }
  }

  .search-item {
    margin: 10px 25px 10px 0;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #747584;
    font-weight: 400;
    font-family: PingFangSC-Regular, PingFang SC;

    ::v-deep(.t-input) {
      width: 190px;
      height: 44px;
      border-radius: 8px;
    }

    ::v-deep(.t-range-input) {
      height: 44px;
      border-radius: 8px;
    }

    ::v-deep(.t-date-range-picker .t-range-input__inner-left .t-input) {
      height: 35px;
    }

    ::v-deep(.t-date-range-picker .t-range-input__inner-right .t-input) {
      height: 35px;
    }

    ::v-deep(.t-date-range-picker .t-range-input__inner) {
      height: 90%;
    }

    .ipt-slt {
      border: none;
      margin-left: 5px;
    }
  }

  .search-item-font {
    ::v-deep(.t-input) {
      width: 78px;
    }

    ::v-deep(.t-input-number) {
      padding: 0 !important;
    }

    .ipt-slt {
      ::v-deep(.t-button) {
        width: 32px;
      }

      ::v-deep(.t-input-number__decrease) {
        display: none;
      }

      ::v-deep(.t-input-number__increase) {
        display: none;
      }
    }
  }

  .t-select-input {
    ::v-deep(.t-input) {
      width: auto;
    }
  }

  .tab-box {
    // height: auto;
    // overflow-y: auto;
    ::v-deep(.t-table thead tr) {
      background: #fafbfd;
    }

    ::v-deep(.t-table tr td) {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #686868;
      line-height: 20px;
    }

    ::v-deep(.t-table__th-cell-inner) {
      font-size: 16px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      color: #222222;
    }
  }
}
</style>
