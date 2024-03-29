<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item">岗位名称:<t-input class="ipt-slt" v-model="searchData.name" auto-width /></div>
      <div class="search-item">归属机构:<t-select class="ipt-slt" clearable v-model="searchData.proOption" :options="proOption" placeholder="请选择"></t-select></div>
      <div class="search-item">状态:<t-select class="ipt-slt" clearable v-model="searchData.postOption" :options="postOption" placeholder="请选择"></t-select></div>
      <t-button class="search-item" theme="primary">搜索</t-button>
      <t-button variant="outline" theme="primary">重置</t-button>
    </div>
    <div class="operate-box">
      <t-button class="search-item" theme="primary" @click="addVisible = true">新增</t-button>
    </div>
    <div class="tab-box">
      <t-table row-key="index" :data="data" :columns="columns" size="medium" hover bordered table-layout="fixed">
        <template #state="{ record }">
          <t-switch></t-switch>
        </template>
        <template #action="{ record }">
          <span class="btn-c-blue">编辑</span>
        </template>
      </t-table>
      <t-pagination :total="30" :pageSizeOptions="[]" :defaultPageSize="15" />
    </div>

    <t-dialog v-model:visible="addVisible" header="新增">
      <t-form>
        <t-form-item requiredMark label="岗位名称" name="name" initial-data="TDesign">
          <t-input :maxlength="30" show-limit-number :allowInputOverMax="false" placeholder="请输入岗位名称" />
        </t-form-item>
        <t-form-item requiredMark label="归属机构" name="tel" initial-data="123456">
          <t-select class="demo-select-base" placeholder="请选择归属机构">
            <t-option v-for="(item, index) in options" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item requiredMark label="状态" name="tel" initial-data="123456">
          <t-switch></t-switch>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { DateRangeValue, MessagePlugin } from 'tdesign-vue-next';
export default {
  setup() {
    const setArrt = reactive({
      passwordShow: false,
      sexOption: [
        { label: '男', value: '1', title: '架构云选项' },
        { label: '女', value: '2' }
      ],
      addPerson: {
        personName: '张三',
        sex: '1',
        passWord: '123456'
      },
      searchData: {
        name: '',
        proOption: '',
        postOption: ''
      },
      proOption: [
        { label: '全部', value: '1', title: '架构云选项' },
        { label: '启用', value: '2' },
        { label: '禁用', value: '3' }
      ],
      postOption: [
        { label: '全部', value: '1', title: '架构云选项' },
        { label: '岗位1', value: '2' },
        { label: '岗位2', value: '3' }
      ],
      data: [
        { id: 1, name: '医生', unit: 'xx医院', state: '1', time: '2002-02-02', position: 'zskj001' },
        { id: 1, name: '护士', unit: 'xx医院', state: '1', time: '2002-02-02', position: 'zskj001' }
      ],
      columns: [
        { colKey: 'id', title: '员工编号' },
        { colKey: 'name', title: '员工姓名' },
        { colKey: 'unit', title: '归属机构' },
        {
          colKey: 'state',
          title: '状态',
          slots: { customRender: 'state' }
        },
        { colKey: 'time', title: '操作时间' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' }
        }
      ],
      addVisible: false,
      options: [
        { label: '计算机学院', value: '1' },
        { label: '软件学院', value: '2' },
        { label: '物联网学院', value: '3' }
      ]
    });
    const getIcon = (name: string) => {
      return new URL(`../../assets/img/login/${name}.png`, import.meta.url).href;
    };

    return {
      ...toRefs(setArrt),
      getIcon
    };
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  width: 100%;

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

  .operate-box {
    display: flex;
    align-items: center;
    padding: 15px 0;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;

    button {
      &:nth-child(1) {
        margin-left: 10px;
      }
    }

    .search-item {
      margin-right: 25px;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ipt-slt {
        width: 180px;
        margin-left: 5px;
      }
    }
  }

  .tab-box {
    height: auto;
    overflow-y: auto;
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
}
</style>
