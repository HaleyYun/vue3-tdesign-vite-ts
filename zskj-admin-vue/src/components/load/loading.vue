<template>
  <div class="loading">
    <div class="loading-box">
        <img src="../../assets/img/load/LoadingImg.png" class="LoadingImg" alt="">
        <div class="progress-border">
            <div class="progress-box">
                <div class="progress" :style="{'width':schedule+'%'}">
                    <img src="../../assets/img/load/progressImg.png" class="progressImg" alt="">
                </div>
            </div>
        </div>
        <div class="schedule">{{schedule}}%</div>
        <div class="schedule-text">正在快马加鞭～</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineProps,withDefaults,onMounted} from "vue"
let schedule=ref(20)
// withDefaults(
//       defineProps<{
//         schedule?:any,
//       }>(),{
//         schedule:0,
//       }
//   )
//   onMounted(()=>{
//     setInterval(() => {
//         if (schedule.value=99) {
//             schedule.value=0
//         } else {
//             schedule.value=schedule.value+1
//         }
//     }, 5);
//   })
</script>

<style lang="scss" scoped>
.loading{
    // width: 100vw;
    // height: 100vh;
    // position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    top: 0;
    left: 0;
    z-index: 9;
    .loading-box{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .LoadingImg{
            width: 396px;
            height: 314px;
            margin-bottom: 6px;
        }
        .progress-border{
            width: fit-content;
            height: fit-content;
            border-radius: 25px;
            border: 2px solid #3378FF;
            padding: 5px;
            box-sizing: border-box;
            .progress-box{
                width: 498px;
                height: 36px;
                .progress{
                    height: fit-content;
                    overflow: hidden;
                    border-radius: 18px;
                    .progressImg{
                        width: 498px;
                        height: 36px;
                    }
                }
            }
        }
        .schedule{
            font-size: 30px;
            font-weight: 500;
            color: #9EA1A7;
            line-height: 42px;
            padding: 8px 0;
        }
        .schedule-text{
            font-size: 24px;
            font-weight: 500;
            color: #9EA1A7;
            line-height: 33px;
        }
    }
}
</style>
