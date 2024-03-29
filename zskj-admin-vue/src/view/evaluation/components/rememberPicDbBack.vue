<template>
    <div class="remember-box">
        <!--遮罩层-->
        <div class="zz-box">
            <div v-for="(item, index) in lookArr" :key="index" v-show="showItemIndex === index"
                :style="{ left: item.x + 'px', top: item.y + 'px' }" class="look-place"></div>
        </div>
        <!-- 时间动画效果 isShowNumber-->
        <div v-if="isShowNumber">
            <div class="number-count">
                <div class="numberpic-box" v-if="countFour">
                    <img v-if="isLx" class="four-pic" src="../../../../src/assets/img/statistics/ten.png" alt="" />
                    <img v-if="!isLx" class="four-pic1" src="../../../../src/assets/img/statistics/xm_ten.png" alt="" />
                </div>
            </div>
        </div>
        <!--  第几组图片提示  isShowVoice-->
        <div v-if="isShowVoice" :key="setNumberKey + 2">
            <div class="pic-tips">
                <div class="pic-tips-font">{{ text }}</div>
                <div class="voice-box">
                    <img class="headbg-stop" v-if="isStartVoice" src="../../../../src/assets/img/statistics/start.png" alt="" />
                    <img class="headbg-stop" v-if="!isStartVoice" src="../../../../src/assets/img/statistics/stop.png" alt="" />
                    <img class="headbg-voice" src="../../../../src/assets/img/statistics/voice.png" alt="" />
                </div>
            </div>
        </div>
        <!--  照片列表部分  isShowPicList-->
        <div v-if="isShowPicList" :key="setNumberKey + 3">
            <div style="position: relative; width: 100%; height:100%;" class="pic-list-box">
                <div style="position: relative; width: 100%; height:100%;" class="head-box">
                    <div v-for="(item, index) in nowShowPicArr" :key="index">

                        <img :style="{ left: item.x + 'px', top: item.y + 'px' }" class="picture" :src="item.pic" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { drawEstimateVideo } from '../../../request/modules/EstimateApi'
import { useBackVideo } from '../../../store/types/backVideo'

export default {
    setup() {
        const backVideo = useBackVideo()
        return {
            backVideo
        }
    },
    data() {
        return {
            countFour: false,
            countOne: false,
            countTwo: false,
            countThree: false,
            isShowNumber: false, // 是否显示倒计时
            isShowVoice: true, // 是否显示倒计时播放
            isShowPicList: false, // 是否显示图片列表
            isStartVoice: false, // 是否显示语音播放图片
            needRemenberArr: [], // 需要记忆的所有图片
            nowShowPicArr: [], // 当前需要显示的数组图片
            nowShowPicArrObj: {}, // 当前需要显示的图片对象
            currentIndexPic: 0, // 当前正在处理第几轮图片的索引
            text: "", // 当前显示的文字
            step: 0,
            setNumberKey: 0, // 随机数
            lookArr: [],
            timerFive: null,
            showItemIndex: -1,
            pageTimer1: () => { },
            pageTimer2: () => { },
            pageTimer3: () => { },
            pageTimer4: () => { },
            pageTimer5: () => { },
            timeOutArr: [],
            isStopEyes: false,
            widthRatio: 1, // 宽度比率
            heightRatio: 1, // 高度比率
            // baseUrl: ""
        }
    },
    mounted() {
        this.widthRatio = (document.body.clientWidth / 800).toFixed(2);
        this.heightRatio = (document.body.clientHeight / 600).toFixed(2);
        if (document.body.clientWidth === 1440) {
            this.isLx = true
        }
        if (document.body.clientWidth === 1280) {
            this.isLx = false
        }
        const that = this
        this.showItemIndex = -1
        that.isStopEyes = false
        this.getAllList(this.backVideo.playbackInfo)

    },
    unmounted() {
        clearTimeout(this.timerFive);
        this.timerFive = null;
    },
    methods: {
        timeCountHandle() {
            this.picListShowHandlea();
        },
        clearTime() {
            clearTimeout(this.pageTimer1)
            clearTimeout(this.pageTimer2)
            clearTimeout(this.pageTimer3)
            clearTimeout(this.pageTimer4)
            clearTimeout(this.pageTimer5)
            clearTimeout(this.timerFive)
            this.pageTimer1 = null
            this.pageTimer2 = null
            this.pageTimer3 = null
            this.pageTimer4 = null
            this.pageTimer5 = null
            this.timerFive = null
            that.isStopEyes = true
            that.lookArr.forEach((item, index) => {
                if (item.x && item.y) {
                    item.x = item.x / this.widthRatio
                    item.y = item.y / this.heightRatio
                }
                (function (index) {
                    if (that.timeOutArr[index] != undefined) {
                        window.clearTimeout(that.timeOutArr[index]);
                    }
                })(index);
            });
        },
        playBackList() {
            // 获取每段视频视线移动数据
            const that = this
            if (!that.isStopEyes) {
                that.lookArr.forEach((item, index) => {
                    if (item.x && item.y) {
                        item.x = parseInt(item.x / this.widthRatio) > 0 ? parseInt(item.x / this.widthRatio) : 0
                        item.y = parseInt(item.y / this.heightRatio) > 0 ? parseInt(item.y / this.heightRatio) : 0
                    }
                    (function (index) {
                        let timer8 = setTimeout(() => {
                            clearTimeout(timer8)
                            timer8 = null
                            that.timeOutArr[index] = window.setTimeout(function () {
                                // Bus.emit('receiveEyeData', that.lookArr[index])
                                that.showItemIndex = index;
                                that.backVideo.eyeItemData = that.lookArr[index];
                                if (index === that.lookArr.length - 1) {
                                    // 第一段视频结束的时候
                                    let timer = setTimeout(() => {
                                        that.showItemIndex = -1
                                        clearTimeout(timer);
                                        timer = null;
                                    }, 100);
                                }
                            }, item.time);
                        }, 600)
                    })(index);
                });
            }
        },
        picListShowHandlea() {
            this.playBackList();
            // Bus.emit('videoPlay'); // 播放视频
            this.nowShowPicArr = [];
            this.isShowNumber = true;
            this.isShowVoice = false;
            this.isShowPicList = false;
            this.countFour = true;
            this.pageTimer4 = setTimeout(() => {
                this.nowShowPicArr = this.needRemenberArr.els
                clearTimeout(this.pageTimer4);
                this.pageTimer4 = null;
            }, 0);
            let timer9 = setTimeout(() => {
                clearTimeout(timer9)
                timer9 = null
                this.isShowNumber = false;
                this.isShowPicList = true;
                this.countFour = false;
            }, 1600)

            this.timerFive = setTimeout(() => {
                clearTimeout(this.timerFive);
                this.timerFive = null;
                this.isShowNumber = false;
                this.isShowVoice = false;
                this.isShowPicList = false;
                this.showItemIndex = -1
                this.pageTimer5 = setTimeout(() => {
                    this.$forceUpdate()
                    clearTimeout(this.pageTimer5);
                    this.pageTimer5 = null;
                }, 500);
            }, 6600);
        },
        getAllList(item) {
            // 获取接口请求参数
            this.lookArr = []
            drawEstimateVideo(item).then((res) => {
                // console.log()
                if (res.code === 200) {
                    // this.baseUrl = res.data.path;
                    this.needRemenberArr = res.data.questionData;
                    this.lookArr = res.data.answerData || [];
                    if (res.data.imageMemoryAdSampling) {
                        this.backVideo.memoryResultsData = res.data.imageMemoryAdSampling;
                    }
                    this.handleNowShowPicList();
                    this.$emit('videoPlay'); // 播放视频
                }
            });

        },
        handleNowShowPicList() {
            // 处理当前正在显示的图片
            this.setNumberKey = Math.random();
            this.needRemenberArr.els.forEach((item) => {
                // item.pic = this.baseUrl + item.pic;
                if (item.x && item.y) {
                    item.x = parseInt(item.x / this.widthRatio) > 0 ? parseInt(item.x / this.widthRatio) : 0
                    item.y = parseInt(item.y / this.heightRatio) > 0 ? parseInt(item.y / this.heightRatio) : 0
                }
            });
            this.timeCountHandle();
        },
    }
}
</script>

<style scoped>
.four-pic {
    width: 60px;
    height: 60px;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
}

.four-pic1 {
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
}

.remember-box {
    width: 100%;
    height: 100%;
    background: #fcf8e6;
    position: relative;
    /* overflow: hidden; */
}

.voice-box {
    position: absolute;
    left: 309px;
    bottom: 61px;
    z-index: 2;
    display: flex;
    align-items: center;
}

.headbg-stop {
    width: 50px;
    height: 50px;
}

.headbg-voice {
    width: 320px;
    height: 61px;
    margin-left: 13px;
}

.headbg-speak {
    width: 110px;
    height: 110px;
}

.voice-box-speak {
    position: absolute;
    left: 445px;
    bottom: 15px;
    z-index: 2;
    display: flex;
    align-items: center;
}

.pic-tips-font {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    color: #654925;
}

.pic-list-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.picture {
    width: 370px;
    height: 370px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
}

.look-place {
    position: absolute;
    left: 1rem;
    top: 2rem;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    border: 0.04rem solid red;
    background: pink;
}

.zz-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999999;
}

.three-pic {
    width: 144px;
    height: 206px;
    margin: 64px 0 0 93px;
    position: absolute;
    z-index: 2;
}

.two-pic {
    width: 145px;
    height: 206px;
    margin: 60px 0 0 91px;
    position: absolute;
    z-index: 2;
}

.yuan {
    width: 332px;
    height: 332px;
    position: absolute;
    left: 0;
    top: 0;
}

.one-pic {
    width: 91px;
    height: 202px;
    margin: 64px 0 0 111px;
    position: absolute;
    z-index: 2;
}

.number-count {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.numberpic-box {
    width: 332px;
    height: 332px;
    margin: 134px 0 0 334px;
    position: relative;
}

.add-animate {
    animation: changeSty 1s ease-in-out;
}

@keyframes changeSty {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}
</style>
