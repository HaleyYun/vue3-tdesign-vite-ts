<template>
  <div class="report">
    <div class="re-top">
      <div class="re-back"><img src="../../assets/img/knowledge/bg-back.png" @click="back" /></div>
      <div class="re-title">蒙特利尔认知评估答题详情</div>
    </div>
    <div class="big-con">
      <div class="name">{{ resDate?.name }}&nbsp;&nbsp;{{ resDate?.score }} 分</div>
      <div class="list">
        <div class="list_one">题目</div>
        <div class="list_one width200">内容</div>
        <div class="list_one width300">答案</div>
        <div class="list_one width50">得分</div>
        <div class="list_one width80">附件</div>
      </div>
      <div class="cont-list" v-for="(item, index) in resDate?.answerConcreteDetailsResponseList" :key="index">
        <div class="cont_one">{{ item.sort }}</div>
        <div class="cont_one width200">{{ item.content }}</div>
        <div class="cont_one width300">
          <div class="answer_list" v-for="(oneItem, index) in item.answerSequenceDetailsResponseList" :key="index">
            <p>{{ oneItem?.answers }}</p>
            <p>{{ oneItem?.isRight }}</p>
            <p>{{ oneItem?.sortIndex }}</p>
          </div>
        </div>
        <div class="cont_one width50">{{ item.score }}</div>
        <div class="cont_one width80">
          <div>
            <p v-if="item.answerAttachmentsResponseList.imgUrl != ''" @click="lookImg(item.answerAttachmentsResponseList.imgUrl)">查看图片</p>
            <span v-else>--</span>
          </div>
          <div>
            <p v-if="item.answerAttachmentsResponseList.playRecord != ''">播放语音</p>
            <span v-else>--</span>
          </div>
          <div>
            <p v-if="item.answerAttachmentsResponseList.remark != ''" @click="lookRemark(item.answerAttachmentsResponseList.remark)">查看备注</p>
            <span v-else>--</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-------图片------>
  <a-modal v-model:visible="imgVisible" :closable="false" @ok="imgOk" centered :maskClosable="false">
    <div class="identity-verify">
      <img :src="imgUrl" />
    </div>
  </a-modal>

  <!-------备注------>
  <a-modal v-model:visible="remarkVisible" :closable="false" @ok="remareOk" centered :maskClosable="false">
    <div class="identity-verify">
      {{ remark }}
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ReportMoca } from '../../request/modules/EstimateApi';

const route = useRoute();
const router = useRouter();
const remarkVisible = ref<boolean>(false); //备注
const remark = ref<string>(''); //备注

const imgVisible = ref<boolean>(false); //图片
const imgUrl = ref<string>(''); //图片

const resDate = ref<any>();
onMounted(() => {
  getData();
});
const getData = async () => {
  const res: any = await ReportMoca({ estimateNum: route.query.estimateNum as string, archNo: route.query.archivesNo as string });
  if (res?.code === 200) {
    resDate.value = res.data;
  }

  console.log(res);
};

const back = () => {
  router.back();
};
//查看图片
const lookImg = (val: string) => {
  console.log(val);
  imgVisible.value = true;
  imgUrl.value = val;
};
const imgOk = () => {
  imgVisible.value = false;
};

//查看备注
const lookRemark = (val: string) => {
  console.log(val);
  remarkVisible.value = true;
  remark.value = val;
};
const remareOk = () => {
  remarkVisible.value = false;
};
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  height: 100vh;
  background-color: #f6f6f6;
  padding-bottom: 30px;
  .re-top {
    width: 100%;
    height: 130px;
    background-image: url('../../assets/img/knowledge/report-top.png');
    background-size: 100% 130px;
    display: flex;
    margin-bottom: 20px;

    .re-back {
      width: 40px;
      height: 40px;
      margin: 40px;
    }

    .re-title {
      font-size: 35px;
      font-weight: bold;
      color: #fff;
      margin: auto;
    }
  }
  .big-con {
    width: 98%;
    margin: auto;
    border-radius: 16px;
    border: 1px solid #f1e3d4;
    padding: 20px;
    background-color: #fff;
    .name {
      height: 50px;
      font-size: 45px;
      font-weight: bold;
      color: #656580;
      line-height: 75px;
    }
    .list {
      width: 100%;
      height: 63px;
      margin-top: 20px;
      background: #fffeed;
      border-radius: 8px;
      border: 1px solid #f1e3d4;
      display: flex;
      justify-content: space-around;
      .list_one {
        font-size: 20px;
        line-height: 60px;
        color: #222;
        font-weight: bold;
      }
    }
    .cont-list {
      width: 100%;
      padding: 5px 0px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-around;

      .cont_one {
        font-size: 20px;
        line-height: 35px;
        color: #686868;
        .answer_list {
          display: flex;
          p {
            line-height: 26px;
            width: 100px;
          }
        }
      }
    }

    .width200 {
      width: 200px;
      text-align: center;
    }
    .width80 {
      width: 80px;
      text-align: center;
      p {
        width: 125px;
        height: 45px;
        line-height: 45px;
        color: #fff;
        font-size: 16px;
        background: #3d7eff;
        border-radius: 22px;
      }
    }
    .width50 {
      width: 50px;
      text-align: center;
    }
    .width300 {
      width: 300px;
      text-align: center;
    }
    .cont-list:last-child {
      border-bottom: 0px;
    }
  }
}
</style>
