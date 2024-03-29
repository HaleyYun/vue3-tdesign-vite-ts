<!-- 正式眼跳任务 -->
<template>
    <div class="all-box" ref="boxAttr">
        <!--遮罩层-->
        <div class="zz-box">
            <div style="width: 100%; height: 100%;">
                <div v-for="(item, index) in lookArr" :key="index" v-show="showItemIndex === index"
                    :style="{ left: item.x + 'px', top: item.y + 'px' }" class="look-place"></div>
            </div>
        </div>
        <div class="number-count" v-if="isShowNumber">
            <div class="numberpic-box add-animate" v-show="countOne">
                <img class="yuan" src="../../../../src/assets/img/statistics/yuan.png" alt="" />
                <img class="one-pic" src="../../../../src/assets/img/statistics/1.png" alt="" />
            </div>
            <div class="numberpic-box add-animate" v-show="countTwo">
                <img class="yuan" src="../../../../src/assets/img/statistics/yuan.png" alt="" />
                <img class="two-pic" src="../../../../src/assets/img/statistics/2.png" alt="" />
            </div>
            <div class="numberpic-box add-animate" v-show="countThree">
                <img class="yuan" src="../../../../src/assets/img/statistics//yuan.png" alt="" />
                <img class="three-pic" src="../../../../src/assets/img/statistics/3.png" alt="" />
            </div>
        </div>
        <div class="box-content" v-if="!isShowNumber">
            <!-- 眼动测试训练 -->
            <div class="yd-box">
                <div v-if="circleArr.length > 0">
                    <div class="left-d" v-for="(item, index) in circleArr" :key="index"
                        :style="{ left: item.x + 'px', top: item.y + 'px' }">
                        <img :class="{ 'setTen': item.pic.indexOf('add_mi.png') > -1 }" :src="item.pic" alt="" />
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
            showItemIndex: 0,
            isItem: {},
            eleWidth: null,
            eleHeight: null,
            isSpeak: false, // 用户是否说话
            step: 0,
            isShowStart: false, // 波纹旁图片暂停开始按钮
            pageTimer1: () => { },
            pageTimer2: () => { },
            pageTimer3: () => { },
            pageTimer4: () => { },
            pageTimer5: () => { },
            pageTimer6: () => { },
            pageTimer7: () => { },
            pageTimer8: () => { },
            getAllArr: [], // 处理之后所有问题的数组
            currentIndex: 0, // 当前正在处理的索引
            currentArr: [], // 当前正在处理的数组
            circleArr: [], // 圆圈显示数组
            countNumber: 3, // 倒计时时间
            countOne: false,
            countTwo: false,
            countThree: false,
            isShowNumber: false, // 是否显示数字页面
            currentId: null, // 当前小题ID
            lookArr: [], // 回放视线数组
            getListPara: { // getList请求参数对象
                // answer_id: 84,
                // question_id: 33,
            },
            timeOutArr: [],
            eyeType: null,
            widthRatio: 1, // 宽度比率
            heightRatio: 1, // 高度比率
            isLx: true,
            // baseUrl: ""
        }
    },
    created() {

    },
    mounted() {
        // this.widthRatio = (document.body.clientWidth / 800);
        // this.heightRatio = (document.body.clientHeight / 520);
        const that = this;
        this.listenSpeakEnd()
        this.isItem = this.backVideo.playbackInfo;
        this.clearTime()
        that.lookArr = []
        this.getList()
    },
    unmounted() {
        this.clearTime()
    },


    methods: {
        clearTime() {
            const that = this
            clearTimeout(this.pageTimer1)
            clearTimeout(this.pageTimer2)
            clearTimeout(this.pageTimer3)
            clearTimeout(this.pageTimer4)
            clearTimeout(this.pageTimer6)
            this.pageTimer1 = null
            this.pageTimer2 = null
            this.pageTimer3 = null
            this.pageTimer4 = null
            this.pageTimer6 = null
            that.lookArr.forEach((item, index) => {
                (function (index) {
                    if (that.timeOutArr[index] != undefined) {
                        window.clearTimeout(that.timeOutArr[index]);
                    }
                })(index);
            });
        },
        listenSpeakEnd() { // 监听说话结束
            window["processVoice"] = () => {
                // 匹配用户语音文字
                let responseData = "true";
                return responseData;
            };
        },
        timeCountHandle() {
            // 倒计时时间处理
            this.countOne = false;
            this.countTwo = false;
            this.countThree = true;
            this.isShowNumber = true;
            this.pageTimer1 = setTimeout(() => {
                this.countOne = false;
                this.countTwo = true;
                this.countThree = false;
                clearTimeout(this.pageTimer1);
                this.pageTimer1 = null;
            }, 1000);
            this.pageTimer2 = setTimeout(() => {
                this.countOne = true;
                this.countTwo = false;
                this.countThree = false;
                clearTimeout(this.pageTimer2);
                this.pageTimer2 = null;
            }, 2000);
            this.pageTimer3 = setTimeout(() => {
                // 最后一次倒计时,开始显示题目
                this.countOne = false;
                this.countTwo = false;
                this.countThree = false;
                this.isShowNumber = false;
                this.playBackList();
                clearTimeout(this.pageTimer3);
                this.pageTimer3 = null;
                // if (document.body.clientWidth === 1440) {
                //     this.isLx = true
                // }
                // if (document.body.clientWidth === 1280) {
                //     this.isLx = false
                // }
            }, 3000);
        },
        getList() {
            this.timeCountHandle();

        },
        handleCurrentData() {
            const that = this
            // 处理当前显示的数据
            this.getAllArr.forEach((item) => {
                console.log('item', item)
                let pageTimer4 = setTimeout(() => {
                    clearTimeout(that.pageTimer4);
                    pageTimer4 = null;
                    that.circleArr = item.els;
                }, item.time);
            });

        },
        playBackList() {
            // 获取每段视频视线移动数据
            const that = this;
            that.lookArr = [];
            let isAttentionLook = drawEstimateVideo;
            isAttentionLook(that.isItem).then(async (res) => {
                // that.baseUrl = res.data.path;
                that.getAllArr = res.data.questionData.data;
                that.getAllArr.forEach((item) => {
                    item.els.forEach(ele => {
                        // ele.pic = that.baseUrl + ele.pic;
                        // console.log("ele.pic", ele.pic)
                        // ele.x = parseInt(ele.x / this.widthRatio) > 0 ? parseInt(ele.x / this.widthRatio) : 0
                        // ele.y = parseInt(ele.y / this.heightRatio) > 0 ? parseInt(ele.y / this.heightRatio) : 0
                        ele.x = parseInt(ele.x) > 0 ? parseInt(ele.x) : 0
                        ele.y = parseInt(ele.y) > 0 ? parseInt(ele.y) : 0
                    })
                });
                await that.handleCurrentData();
                that.lookArr = res.data.answerData || [];
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    timer = null;
                    if (res.data.eyeMoveAdSampling) {
                        that.backVideo.eyeResultsData = res.data.eyeMoveAdSampling;
                    }
                    this.$emit('videoPlay'); // 播放视频
                }, 750)
                let timer2 = setTimeout(() => {
                    clearTimeout(timer2)
                    timer2 = null
                    that.lookArr.forEach((item, index) => {
                        if (item.x && item.y) {
                            // item.x = parseInt(item.x / this.widthRatio) > 0 ? parseInt(item.x / this.widthRatio) : 0
                            // item.y = parseInt(item.y / this.heightRatio) > 0 ? parseInt(item.y / this.heightRatio) : 0
                            item.x = parseInt(item.x) > 0 ? parseInt(item.x) : 0
                            item.y = parseInt(item.y) > 0 ? parseInt(item.y) : 0
                        }
                        (function (index) {
                            that.timeOutArr[index] = window.setTimeout(function () {
                                that.showItemIndex = index;
                                that.backVideo.eyeItemData = that.lookArr[index];
                                if (index === that.lookArr.length - 1) {
                                    // 第一段视频结束的时候
                                    that.pageTimer6 = setTimeout(() => {
                                        that.showItemIndex = -1
                                        clearTimeout(that.pageTimer6);
                                        that.pageTimer6 = null;
                                        that.circleArr = [];
                                    }, 100);
                                }
                            }, item.time);
                        })(index);
                    });
                }, 1000)
            });
        },
    }

};
</script>
<style lang="scss" scoped>
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
    z-index: 9;
}

.three-pic {
    width: 144px;
    height: 206px;
    margin: 60px 0 0 -20px;
    position: absolute;
    z-index: 2;
}

.two-pic {
    width: 145px;
    height: 206px;
    margin: 60px 0 0 -20px;
    position: absolute;
    z-index: 2;
}

.yuan {
    width: 332px;
    height: 332px;
    position: absolute;
    left: -100px;
    top: 0;
}

.one-pic {
    width: 91px;
    height: 202px;
    margin: 60px 0 0 -20px;
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

.all-box {
    width: 100%;
    height: 100%;
    background: #fcf8e6;
    position: relative;
}

.welcome-box {
    font-size: 68px;
}

.start-btn {
    font-size: 48px;
}

.video {
    width: 100%;
    height: 100%;
    display: block;
}

.box-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.headbg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
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

.font-show {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    font-family: Helvetica;
    color: #654925;
}

.yd-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.left-d {
    position: absolute;
    left: 0;
    top: 0;
    width: 25px;
    height: 25px;

    img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }

    img.setTen {
        width: 80px !important;
        height: 80px !important;
    }

    img.setTenTwo {
        width: 60px;
        height: 60px;
    }
}
</style>
