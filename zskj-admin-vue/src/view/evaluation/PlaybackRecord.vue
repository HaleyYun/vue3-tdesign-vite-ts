<template>
  <div class="user-box">
    <div class="tab-box">
      <div class="operate-box" @click="handlerRest">
        <img src="../../assets/img/knowledge/outIcon.png" alt="图标" />
        <div class="add-item">返回</div>
      </div>
      <t-table row-key="index" :data="palyData" :columns="(palyColumns as PrimaryTableCol<TableRowData>[])" table-layout="fixed" size="medium" hover>
        <template #action="{ row }">
          <div class="btn-blue" @click="seevideo(row)"><span class="btn-item">点击查看</span></div>
        </template>
        <template #itemName="{ row }">
          <span class="itemName">{{ row.itemName }}</span>
        </template>
        <template #customName="{ row }">
          <span class="itemName">{{ row.itemName}}</span>
        </template>
      </t-table>
      <t-pagination :pageSize="formSearch.pageSize" :total="10" v-model:current="formSearch.pageNum" @page-size-change="pageSizeChange" @current-change="currentChange" show-jumper />
    </div>



    <div class="mask-box" v-if="setAttr.maskShow">
        <div class="centent-box"
            :style="{ transformOrigin: '0 0', transform: `scale(${setAttr.zoomSizeX, setAttr.zoomSizeY})` }">
            <div class="maskTextBox">
                <p>
                    时间: <span>{{ backVideo.eyeItemData.time || 0 }}ms</span>
                </p>
                <p>
                    坐标:<span>（x: {{ backVideo.eyeItemData.x || 0 }}，y: {{ backVideo.eyeItemData.y || 0 }}）</span>
                </p>
                <p>
                    当前速度v_x: {{ backVideo.eyeItemData.vx || 0 }} <span>pixel/ms</span>
                </p>
                <p>
                    当前速度v_y: {{ backVideo.eyeItemData.vy || 0 }} <span>pixel/ms</span>
                </p>
            </div>
            
            <div class="maskTextBox" v-if="route.query.str ==='one'">
                <p>
                    眼跳延迟: <span>{{ backVideo.eyeResultsData.delay || 0 }}ms</span>
                </p>
                <p>
                    眼跳平均速度: <span>{{ backVideo.eyeResultsData.averageSpeed || 0 }}</span>
                </p>
                <p>
                    眼跳最高速度: {{ backVideo.eyeResultsData.maximumSpeed || 0 }}<span>pixel/ms</span>
                </p>
                <p>
                    眼跳绝对增益（初始）: {{ backVideo.eyeResultsData.increaseInitial || 0 }} <span>pixel/ms</span>
                </p>
                <p>
                    眼跳增益（终末）: {{ backVideo.eyeResultsData.increaseTerminal || 0 }} <span>pixel/ms</span>
                </p>
                <p>
                    眼跳侵入（刺激前）: {{ backVideo.eyeResultsData.invadeExciteBefore || 0 }} <span>pixel/ms</span>
                </p>
            </div>
            <div class="maskTextBox" v-if="route.query.str ==='two'">
                <p>
                    新照片平均停留时间: <span>{{ backVideo.memoryResultsData.newImagestayTime || 0 }}ms</span>
                </p>
                <p>
                    旧照片平均停留时间: <span>{{ backVideo.memoryResultsData.oldImagestayTime || 0 }}ms</span>
                </p>
                <p>
                    新旧偏好比: {{ backVideo.memoryResultsData.imageStayRatio || 0 }}
                </p>
            </div>
            <img src="../../../src/assets/img/statistics/closeMask.png" @click="closeMask" />
            <div class="eyesBackPlayBox">
                <eyesBackPlay v-if="route.query.str ==='one' && setAttr.maskShow"
                    class="comdiv" @videoPlay="videoPlay" id="playbackId">
                </eyesBackPlay>
                <rememberPicDbBack v-if="route.query.str ==='two' && setAttr.maskShow"
                    class="comdiv" @videoPlay="videoPlay" id="playbackId">
                </rememberPicDbBack>
            </div>
            <div class="videoBox">
              <VideoJs :videoSrc="data.videoSrc" autoPlay  controls/>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, reactive } from 'vue';
import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { useRouter,useRoute } from 'vue-router';
import { palyColumns } from './data/configuration';
import { getEstimateVideo } from '../../request/modules/EstimateApi';

import eyesBackPlay from './components/eyesBackPlay.vue'
import rememberPicDbBack from './components/rememberPicDbBack.vue'


import VideoJs from "../../components/BaseVideo/Video.vue";
import { useBackVideo } from '../../store/types/backVideo'

const backVideo = useBackVideo()
const videoPath = ref<string>("#");

const data = reactive({
  videoSrc: "https://www.w3schools.com/html/movie.mp4",
});
// --------全局参数---------------
const route = useRoute();
const router = useRouter();
let formSearch = reactive<any>({
  pageSize: 10,
  pageNum: 1,
  oneCharts: ''
});

const setAttr = reactive({
    maskShow: false,
    getTestType: 0,
    zoomSizeX: 1,
    zoomSizeY: 1,
})

const videoPlay = () => {
    let videoElement: HTMLVideoElement = document.getElementById('videoEl') as HTMLVideoElement;
    videoElement.load()
    videoElement.play()
}

//----- 加载列表数据 ---------
onMounted(() => {
  loadTableData();
});
const palyData = ref<any>([]);

//查看
const seevideo = (item: any) => {

  backVideo.playbackInfo = {
      estimateNum: route.query.estimateNum as string,
      index: item.sortIndex,
      taskType: 3,
      type: route.query.str==='one'?1:2
  }
  console.log(backVideo.playbackInfo)
  data.videoSrc=item.videoPath
  setAttr.maskShow = true
};

//返回
const handlerRest = () => {
  router.go(-1);
};
//分页
const pageSizeChange = (pageSize: any) => {
  formSearch.pageSize = pageSize;
  formSearch.pageNum = 1;
  loadTableData();
};
const currentChange = (current: any) => {
  formSearch.pageNum = current;
  loadTableData();
};


const closeMask = () => {
    setAttr.maskShow = false;
    backVideo.eyeItemData = {
        time: 0,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
    };
    backVideo.eyeResultsData = {
        type: 0,
        rigthDirection: 0,
        delay: 0,
        rigth: true,
        increaseInitial: 0,
        wrongAttempt: 0,
        correctionDelay: null,
        averageSpeed: 0,
        maximumSpeed: 0,
        increaseTerminal: 0,
        increaseTargetDistanceComparison: 0,
        invadeExciteBefore: 0,
        invadeExciteAfter: 0,
        gazeAreaNumExciteBefore: 0,
        gazeAreaDurationExciteBefore: 0,
        gazeBlink: 0,
        gainRatioTerminal: 0,
        rigthCorrectAfter: true,
        rigthDelayCorrectAfter: 0,
        rigthDelay: 0,
        expect: 0
    };
    backVideo.memoryResultsData = {
        newImagestayTime: 0,
        oldImagestayTime: 0,
        isRight: 0,
        gazeBlink: 0,
        gazeAreaDuration: 0,
        imageStayRatio: 0
    }
    let el: any = document.getElementById('playbackId')
    el?.clearTime && el.clearTime()
}

const loadTableData =()=>{
  let params = {
      estimateNum:'',
      taskType:0,
      type:0
  }
  if(route.query.str ==='one'){
     params = {
      estimateNum:route.query.estimateNum as any,
      taskType:3,
      type:1
    }
  }
  if(route.query.str ==='two'){
     params = {
      estimateNum:route.query.estimateNum as any,
      taskType:3,
      type:2
    }
  }
  getEstimateVideo(params).then((res: any) => {
    if (res.code == 200) {
      palyData.value = res.data
      data.videoSrc = res.data[0].videoPath
    }
  });
  
} 
</script>

<style lang="scss" scoped>
.user-box {
  display: flex;

  .tab-box {
    // width: calc(100% - 400px);
    background-color: #ffffff;
    padding: 21px;
    border-radius: 16px;
    .btn-blue {
      background: #f1f6ff;
      border-radius: 6px;
      text-align: center;
      cursor: default;
      .btn-item {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3d7eff;
        line-height: 17px;
      }
    }
    .itemName {
      font-size: 14px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #24c07b;
      line-height: 20px;
    }
    .operate-box {
      display: flex;
      align-items: center;
      border-radius: 16px;
      margin-bottom: 15px;
      cursor: default;
      .add-item {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #222222;
        line-height: 22px;
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
  }
}



.mask-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(252, 248, 230, 0.5);
    backdrop-filter: blur(10px);

}

.centent-box {
    width: 1200px;
    height: 800px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.maskTextBox {
    padding: 16px;
    font-size: 10px;
    color: #654925;
    line-height: 26px;
}

.centent-box img {
    width: 57px;
    height: 57px;
    position: absolute;
    top: 14px;
    right: 130px;
}

.eyesBackPlayBox {
    width: 1000px;
    height: 600px;
    background-image: url(../../../src/assets/img/statistics/maskBg.png);
    background-size: 1000px 600px;
    background-repeat: no-repeat;
    position: absolute;
    top: calc(50% - 275px);
    left: calc(50% - 430px);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.comdiv {
    width: 1000px;
    height: 600px;
    margin: 30px;
}
.videoBox {
    width: 200px;
    height: 150px;
    position: absolute;
    right: -170px;
    bottom: -89px;
    background-image: url(../../../src/assets/img/statistics/videoBg.png);
    background-size: 200px 150px;
    background-repeat: no-repeat;
    overflow: hidden;

}

.videoBox video {
    width: 160px;
    height: 130px;
    border-radius: 12px;
    margin: 3px;
}
</style>
