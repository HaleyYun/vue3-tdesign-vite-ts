<template>
  <div class="load-box" ref="loadbox" :style="{'font-size':fontSize+'px'}">
    <!--加载中-->
    <div class="load" v-if="status=='loading'">
        <img src="../../assets/img/load/LoadingImg.png"  class="LoadingImg" alt="">
        <div class="progress-box">
          <div class="progress-b">
            <div class="progress" :style="{'width':schedule+'%'}">
                <img src="../../assets/img/load/progressImg.png" class="progressImg" alt="">
            </div>
          </div>
        </div>
        <div class="schedule">{{schedule}}%</div>
        <div class="schedule-text">正在快马加鞭～</div>
    </div>
    <!--无数据-->
    <div class="load" v-if="status=='noData'">
      <img src="../../assets/img/load/noDataImg.png" class="noDataImg" mode=""/>
      <div class="noData-text">暂未探寻到相关数据～</div>
    </div>
    <!--接口失败-->
    <div class="load" v-if="status=='failure'">
      <img src="../../assets/img/load/failureImg.png" class="failureImg" mode=""/>
      <div class="failure-text">加载失败～</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref,defineProps,withDefaults,onMounted} from "vue"
let loadbox= ref<HTMLElement>()
let fontSize = ref<number>(0)
// let props = 

withDefaults(
      defineProps<{
        status?:string,
        schedule?:number,
      }>(),{
        status:'loading',//loading-加载中,noData-无数据,failure-加载失败
        schedule:30,
      }
  )
  onMounted(()=>{
    if ((loadbox?.value?.clientWidth?loadbox.value.clientWidth:510)>(loadbox?.value?.clientHeight?loadbox.value.clientHeight:459)) {
      fontSize.value=Math.floor((loadbox?.value?.clientHeight?loadbox.value.clientHeight:459)*0.7*16/510)
    } else {
      fontSize.value=Math.floor((loadbox?.value?.clientWidth?loadbox.value.clientWidth:510)*0.7*16/459)
    }
  })
</script>

<style lang="scss" scoped>
.load-box{
  flex-grow: 1;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}
.load{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  overflow: hidden;
  // loading
  .LoadingImg{
    width: 24.75em;
    height: 19.625em;
    margin-bottom: .375em;
  }
  .progress-box{
    width: fit-content;
    height: fit-content;
    border-radius: 1.5em;
    border: .125em solid #3378FF;
    padding: .375em;
    .progress-b{
      width: 31.125em;
      height: 2.25em;
      .progress{
        height: 2.25em;
        border-radius: 1.125em;
        overflow: hidden;
        .progressImg{
          width: 31.125em;
          height: 2.25em;
        }
      }
    }
  }
  .schedule{
    font-size: 1.875em;
    font-weight: 500;
    color: #9EA1A7;
    margin-top: .5em;
  }
  .schedule-text{
    font-size: 1.5em;
    font-weight: 900;
    color: #9EA1A7;
    margin-top: .5em;
  }
  // noData
  .noDataImg{
    width: 37.4375em;
    height: 22.6875em;

  }
  .noData-text{
    margin-top: -4.125em;
    font-size: 1.5em;
    font-weight: 900;
    color: #9EA1A7;
  }
  // failure
  .failureImg{
    width: 22.75em;
    height: 15.125em;
  }
  .failure-text{
    font-size: 1.5em;
    font-weight: 900;
    color: #9EA1A7;
    margin-top: 1.8125em;
  }
}
</style>
