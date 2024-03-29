<template>
  <div class="user-box">
    <div class="search-box">
      <div class="search-item">渠道名称:<t-input class="ipt-slt" v-model="searchData.name" auto-width /></div>
      <div class="search-item">联系电话:<t-input class="ipt-slt" v-model="searchData.channel" auto-width /></div>
      <div class="search-item">分类:<t-select class="ipt-slt" v-model="searchData.sex" :options="sexOption"
          placeholder="请选择"></t-select></div>
      <div class="search-item">状态:<t-select class="ipt-slt" v-model="searchData.sex" :options="sexOption"
          placeholder="请选择"></t-select></div>
      <div class="search-item">注册时间：<t-date-range-picker enable-time-picker allow-input clearable @change="onChange" />
      </div>
      <t-button class="search-item" theme="primary">搜索</t-button>
      <t-button variant="outline" theme="primary">重置条件</t-button>
    </div>
    <div class="operate-box">
      <t-button class="search-item" theme="primary" @click="addVisible = true">新建渠道</t-button>
    </div>
    <div class="tab-box">
      <t-table row-key="index" :data="data" :columns="columns" size="medium" hover bordered table-layout="fixed">
        <template #action="{ record }">
          <span class="btn-c-blue">编辑</span>
          <span class="btn-c-blue m-l" @click="h5Visible = true">生成h5地址</span>
        </template>
      </t-table>
    </div>
    <t-pagination :total="30" :pageSizeOptions="[]" :defaultPageSize="15" />

    <t-dialog v-model:visible="h5Visible" header="生成H5地址" confirm-btn="关闭" :closeBtn="false" :cancelBtn="null"
      @confirm="h5Visible = false">
      <div class="cope-box">
        <p>AMES地址：{{ H5Url }}</p>
        <t-button variant="outline" theme="primary" @click="copyContent">复制</t-button>
      </div>
    </t-dialog>
    <t-dialog v-model:visible="addVisible" header="添加角色">
      <t-form>
        <t-form-item label="渠道ID" name="name" initial-data="TDesign">
          <t-input placeholder="请输入角色姓名" />
        </t-form-item>
        <t-form-item label="渠道分类" name="tel" initial-data="123456">
          <t-select class="demo-select-base" clearable>
            <t-option v-for="(item, index) in options" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="渠道名称" name="tel" initial-data="123456">
          <t-input placeholder="请输入角色顺序" />
        </t-form-item>
        <t-form-item label="联系电话" name="tel" initial-data="123456">
          <t-input placeholder="请输入角色顺序" />
        </t-form-item>
        <t-form-item label="客服二维码" name="tel" initial-data="123456">
          <t-upload ref="uploadRef2" action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            theme="image" accept="image/*"></t-upload>
        </t-form-item>
        <t-form-item label="状态" name="tel" initial-data="123456">
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
      searchData: {
        name: '',
        channel: '',
        sex: ''
      },
      sexOption: [
        { label: '男', value: '1', title: '架构云选项' },
        { label: '女', value: '2' }
      ],
      data: [],
      columns: [
        { colKey: 'id', title: '渠道id' },
        { colKey: 'name', title: '渠道姓名' },
        { colKey: 'phone', title: '联系电话' },
        { colKey: 'sex', title: '分类' },
        { colKey: 'channel', title: '状态' },
        { colKey: 'member', title: '操作人' },
        { colKey: 'time', title: '操作时间' },
        {
          title: '操作',
          colKey: 'action',
          slots: { customRender: 'action' }
        }
      ],
      h5Visible: false,
      addVisible: false,
      H5Url: 'https://tdesign.tencent.com/',
      options: [
        { label: '计算机学院', value: '1' },
        { label: '软件学院', value: '2' },
        { label: '物联网学院', value: '3' }
      ]
    });
    const onChange = (value: DateRangeValue) => {
      console.log('onChange:', value);
    };
    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(setArrt.H5Url);
        MessagePlugin.success('复制成功');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    return {
      ...toRefs(setArrt),
      onChange,
      copyContent
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
    height: 600px;
    overflow-y: auto;
  }

  .t-pagination {
    margin-top: 20px;
  }

  .cope-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}</style>
