<template>
  <div class="content">
    <div class="content-box">
      <div style="margin-top: 10px; height: 730px">
        <t-menu theme="light">
          <t-submenu value="1" :default-value="1" mode="popup">
            <template #title>
              <span>PRO端</span>
            </template>
            <div v-for="(item, index) in proContent" :key="index">
              <t-menu-item :value="item.id" @click="programChange(item, index)"> {{ item.agreementName }}</t-menu-item>
            </div>
          </t-submenu>
          <t-submenu value="2" mode="popup">
            <template #title>
              <span>LITE端</span>
            </template>
            <div v-for="(item, index) in liteContent" :key="index">
              <t-menu-item :value="item.id" @click="programChange(item, index)"> {{ item.agreementName }}</t-menu-item>
            </div>
          </t-submenu>
        </t-menu>
      </div>

      <div class="tabs">
        <div class="count">
          <ErWangEditor ref="VoWangEditorRef" />
          <t-button class="btn" size="large" theme="primary" @click="save()">保存</t-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { getAgreement, update } from '../../request/modules/UserApi';

// 引入富文本/zskj/admin/agreement/query
import ErWangEditor from '@/components/WangEditor/src/WangEditors.vue';
import { MessagePlugin } from 'tdesign-vue-next';
export default {
  components: {
    ErWangEditor
  },
  setup() {
    const VoWangEditorRef = ref<any>();
    const VeWangEditorRef = ref<any>();
    const proContent = ref<any>(); //平板的
    const liteContent = ref<any>(); //小程序的
    const setAttr = reactive({
      indexId: 1,
      tabs: [
        { id: 1, title: '用户协议' },
        { id: 2, title: '隐私协议' }
      ],
      conment: {
        channelSource: 1,
        serviceAgreement: '',
        privacyAgreement: ''
      }
    });
    onMounted(() => {
      getAgree();
    });
    //点击显示tab
    const programChange = (val, index) => {
      console.log(val.serviceAgreement, 'val.serviceAgreement');

      // getAgree();
      setAttr.indexId = val.id;
      if (val.channelSource == 2) {
        setTimeout(() => {
          VoWangEditorRef.value && VoWangEditorRef.value.setHtml(proContent.value[index].serviceAgreement);
          // VoWangEditorRef.value && VoWangEditorRef.value.setHtml(val.serviceAgreement);
        }, 300);
      } else {
        setTimeout(() => {
          VoWangEditorRef.value && VoWangEditorRef.value.setHtml(liteContent.value[index].serviceAgreement);
          // VoWangEditorRef.value && VoWangEditorRef.value.setHtml(val.serviceAgreement);
        }, 300);
      }
    };

    //获取基本信息
    const getAgree = () => {
      getAgreement({ channelSource: '' as any }).then((res: any) => {
        if (res.code === 200) {
          proContent.value = res.data
            .filter((item: any) => item.channelSource == 2)
            .map((item: any) => {
              return item;
            });
          liteContent.value = res.data
            .filter((item: any) => item.channelSource == 1)
            .map((item: any) => {
              return item;
            });

          console.log(liteContent.value);
        }
      });
    };

    const save = () => {
      setAttr.conment.serviceAgreement = VoWangEditorRef.value.getHtml();
      let subStr = '<br>';
      if (setAttr.conment.serviceAgreement.includes(subStr)) {
        setAttr.conment.serviceAgreement = '';
      }
      let parmas = {
        serviceAgreement: setAttr.conment.serviceAgreement,
        id: setAttr.indexId
      };

      console.log(parmas, 'parmas');
      update(parmas as any).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success(res.msg);
          setTimeout(() => {
            VoWangEditorRef.value && VoWangEditorRef.value.setHtml(parmas.serviceAgreement);
          }, 300);
          getAgree();
        }
      });
    };

    return {
      ...toRefs(setAttr),

      save,
      VoWangEditorRef,
      VeWangEditorRef,
      proContent,
      liteContent,
      programChange
    };
  }
};
</script>
<style lang="scss" scoped>
.content {
  overflow-y: auto;
  .content-box {
    display: flex !important;
    .tabs {
      // background-color: #666;
      width: 100%;

      // border-bottom: 2px solid #ddd;
      display: flex;
      .count {
        width: 98%;
        // height: 100%;
        // // margin: 30px auto;

        ::v-deep(.w-e-text-container) {
          height: 650px;
        }

        // ::v-deep(.narrow-scrollbar) {
        //   width: 100%;
        //   height: 500px;
        //   // padding: 10px;
        //   font-size: 15px;
        //   color: #666;
        // }

        .btn {
          margin-top: 20px;
        }
      }
    }
  }
}

::v-deep(.t-default-menu__inner) {
  background-color: #fcfdff;
}
::v-deep(.t-default-menu .t-is-opened) {
  background-color: #fcfdff;
}
</style>
