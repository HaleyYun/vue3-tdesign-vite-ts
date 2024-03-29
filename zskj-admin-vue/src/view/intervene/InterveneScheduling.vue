<template>
    <div class="page-box">
        <div class="page-left">
            <div class="page-left-top">
                <p>客户列表</p>
                <t-button @click="changeSort">时间顺序</t-button>
            </div>
            <t-input class="search-input" v-model="userListData.userName" clearable placeholder="请输入客户姓名/手机号"
                @input="changeUserName" @clear="changeUserName" />
            <div class="customList" @scroll="callBackScroll">
                <load :status="loadStatus" :schedule="schedule" v-if="userInfoList?.length ==0"></load>
                <div class="custom-item" v-for="(item, index) in userInfoList" 
                    :style="{ backgroundColor: userInfoActive == index ? 'bisque' : '' }" :key="index"
                    @click="changeItem((item as ItemDetails), index)" v-else>
                    <img :src="item.userImage ? item.userImage : getIcon('defaultPicture')" alt="">
                    <div class="info">
                        <p>{{ item.userName }}</p>
                        <p>{{ item.userPhone }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-right">
            <div class="page-right-top">
                <div class="info-box">
                    <h2>训练任务</h2>
                    <p><span>训练周期：</span>{{ userListItemData.trainingStart || "--" }}至{{ userListItemData.trainingEnd ||
                        "--" }}</p>
                    <p><span>训练总天数：</span>{{ userListItemData.trainingDays || "--" }}天</p>
                    <p><span>打卡总天数：</span> {{ userListItemData.checkInDays }}天</p>
                    <p><span>打卡未完成：</span>{{ userListItemData.noCompleteCheckDays || "--" }}天</p>
                    <p><span>缺卡天数：</span>{{ userListItemData.unCheckDays || "--" }}天</p>
                </div>
                <div class="info-box">
                    <p><span>姓名：</span>{{ userInfoList[userInfoActive]?.userName || "--" }}</p>
                    <p><span>最新结果：</span>{{ userListItemData.result || "--" }}</p>
                    <p><span>电话：</span>{{ userInfoList[userInfoActive]?.userPhone || "--" }}</p>
                    <!-- <t-date-picker class="w-l" mode="month" clearable allow-input /> -->
                    <t-select class="w-l" :options="weekList" v-model="weekListActive" placeholder="请选择第几周"
                        @change="changeWeek" :keys="{ value: 'id', label: 'weekName' }"></t-select>
                    <p>{{ weekListItem.interventionStart || "--" }} 至 {{ weekListItem.interventionEnd || "--" }}</p>
                </div>
            </div>
            <div class="train-details">
                <h2>训练排期</h2>
                <div class="table-box">
                    <ul>
                        <li>00:00</li>
                        <li v-for="item in 24" :key="item">{{ item }}:00</li>
                    </ul>
                    <table border="1" width="90%" cellpadding="2">
                        <thead>
                            <tr>
                                <th v-for="(item, index) in titleList" :key="index">{{ item }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in clockInList" :key="index">
                                <td v-for="(clockInItem, clockInIndex) in item.list" :key="clockInIndex"
                                    :style="{ backgroundColor: clockInItem.attendanceName && clockInItem.attendancePoint ? 'bisque' : '' }">
                                    <h4>{{ clockInItem.attendanceName }}</h4>
                                    <p>{{ clockInItem.attendancePoint }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { reactive, toRefs, onMounted } from 'vue';
import { SelectValue } from "tdesign-vue-next"
import { userList, userAttendanceList, userAttendanceInfo } from "../../request/modules/intervene"
import { ItemDetails } from "../types/intervene"
import { debounce, throttle } from "../../utils/tools"
import load from "../../components/load/load.vue";
export default {
    components: {
        AddIcon, SearchIcon, EditIcon, DeleteIcon, DownloadIcon, RefreshIcon,load
    },
    setup() {
        const setAttr = reactive({
            userInfoList: [
                {
                    archivesNo: "",
                    currentInterventionOrderNum: "",
                    userImage: "",
                    userName: "",
                    userPhone: ""
                }
            ],
            total: 999,
            userInfoActive: 0,
            itemDetails: {
                checkInDays: 0,
                result: "",
                trainingDays: 0,
                trainingEnd: "",
                trainingStart: "",
                unCheckDays: 0,
                userFileId: "",
                userImage: "",
                userName: "",
                userPhone: "",
                weekSequence: 0
            },
            weekList: [
                {
                    id: 1,
                    interventionEnd: "2023-06-15",
                    interventionStart: "2023-06-08",
                    selected: 1,
                    weekName: "第一周",
                    weekSequence: 1
                }
            ],
            userListData: {
                userName: "",
                timeSort: 1,
                pageNum: 1,
                pageSize: 30
            },
            weekListActive: "",
            weekListItem: {
                id: 1,
                interventionEnd: "",
                interventionStart: "",
                selected: 1,
                weekName: "第一周",
                weekSequence: 1
            },
            userListItemData: {
                checkInDays: 0,
                noCompleteCheckDays: 0,
                result: "",
                trainingDays: 0,
                trainingEnd: "",
                trainingStart: "",
                unCheckDays: 0,
            },
            titleList: [""],
            clockInList: new Array(24).fill({ time: "11", list: Array(7).fill(new Object({ attendancePoint: "", attendanceType: "" })) }),
        })
        onMounted(() => {
            // 解决Array(24).fill(new Object({ attendancePoint: "", attendanceType: "" }))浅拷贝问题
            let dp = new Array(24)
            let dp2 = new Array(7)
            let clockInList: { time: string, list: { attendancePoint: string, attendanceType: string }[] }[] = []
            for (let i = 0; i < dp.length; i++) {
                clockInList[i] = { time: "11", list: [] }
                for (let j = 0; j < dp2.length; j++) {
                    clockInList[i].list[j] = new Object({ attendancePoint: "", attendanceType: "" }) as { attendancePoint: string, attendanceType: string }
                }
            }
            setAttr.clockInList = clockInList;
            setAttr.userInfoList = []
            getList()
        })
        let loadStatus = ref<string>('') //loading-加载中,noData-无数据,failure-加载失败
        let schedule = ref<number>(20) //加载中进度
        const getList = debounce(() => {
            userList(setAttr.userListData).then((res: any) => {
                if (res.code === 200) {
                    if (res.data==null||res.data.total==0) { //无数据
                        loadStatus.value = 'noData',
                        setAttr.userInfoList = [];
                    } else {
                        if (setAttr.userListData.pageNum == 1) {
                            setAttr.userInfoList = [];
                        }
                        setAttr.userInfoList = [...setAttr.userInfoList, ...res.data.data || []];
                        setAttr.total = res.data.total || 0;
                        if (res.data.data.length > 0) {
                            changeItem(setAttr.userInfoList[0] as ItemDetails, 0);
                        }
                    }
                } else {
                    loadStatus.value = 'failure',
                    setAttr.userInfoList = [];
                }
            })
        }, 300, false)
        const getWeekList = (archivesNo: string, currentInterventionOrderNum: string) => {
            userAttendanceInfo({
                archivesNo,
                currentInterventionOrderNum
            }).then((res: any) => {
                if (res.code === 200) {
                    setAttr.userListItemData = res.data;
                    setAttr.weekList = res.data.weekSelectedInfos || [];
                    if (res.data.weekSelectedInfos.length > 0) {
                        setAttr.weekListActive = res.data.weekSelectedInfos[0].id;
                        changeWeek(res.data.weekSelectedInfos[0].id);
                    }
                } else {
                    setAttr.weekList = []
                }
            })
        }
        const changeItem = (item: ItemDetails, index: number) => {
            setAttr.userInfoActive = index;
            getWeekList(item.archivesNo, item.currentInterventionOrderNum,)
        }
        const changeWeek = (value: SelectValue) => {
            let active = setAttr.weekList.findIndex((item: any) => item.id == value);
            setAttr.weekListItem = setAttr.weekList[active];
            userAttendanceList({
                archivesNo: setAttr.userInfoList[setAttr.userInfoActive].archivesNo,
                currentInterventionOrderNum: setAttr.userInfoList[setAttr.userInfoActive].currentInterventionOrderNum,
                weekPlanId: setAttr.weekListItem.id,
                weekStartDay: setAttr.weekListItem.interventionStart,
            }).then((res: any) => {
                if (res.code === 200) {
                    setAttr.titleList = [];
                    for (let i = 0; i < res.data.length; i++) {
                        setAttr.titleList[i] = res.data[i].thisDay.slice(0, 10);

                        let timeDataArr: string[][] = new Array(24).fill(new Array(0))
                        timeDataArr = JSON.parse(JSON.stringify(timeDataArr));
                        for (let j = 0; j < res.data[i].attendanceDayList.length; j++) {
                            let arr: string | number[] = [];
                            arr = res.data[i].attendanceDayList[j].attendancePoint.split(":")
                            timeDataArr[Number(arr[0])].push(res.data[i].attendanceDayList[j].attendanceName || "");
                        }
                        for (let j = 0; j < timeDataArr.length; j++) {
                            setAttr.clockInList[j].list[i] = { attendanceName: timeDataArr[j].join(",") }
                        }

                        // for (let j = 0; j < res.data[i].attendanceDayList.length; j++) {
                        //     let arr: string | number[] = [];
                        //     arr = res.data[i].attendanceDayList[j].attendancePoint.split(":")
                        //     setAttr.clockInList[Number(arr[0])].list[i] = res.data[i].attendanceDayList[j]
                        // }
                    }
                }
            })
        }
        const changeSort = () => {
            setAttr.userInfoList = [];
            setAttr.userListData.timeSort = setAttr.userListData.timeSort ? 0 : 1
            setAttr.userListData.pageNum = 1;
            getList()
        }
        const changeUserName = () => {
            setAttr.userListData.pageNum = 1;
            setAttr.userInfoList = [];
            getList()
        }
        const getIcon = (name: string) => {
            return new URL(`../../assets/img/intervene/${name}.png`, import.meta.url).href;
        }
        const callBackScroll = throttle((e: any) => {
            if (setAttr.userInfoList.length === setAttr.total) return
            let scrollTop = e.target.scrollTop;
            let clientHeight = e.target.clientHeight;
            let scrollHeight = e.target.scrollHeight;
            // 当滚出去的内容高度加上窗口也就是外部容器的高度大于等于内容高度时发送请求
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                setAttr.userListData.pageNum += 1
                getList()
            }
        }, 300, 2)
        return {
            ...toRefs(setAttr),
            changeItem,
            changeWeek,
            getList,
            changeSort,
            getIcon,
            callBackScroll,
            changeUserName,
            loadStatus,
            schedule
        }
    }
}
</script>

<style lang="scss" scoped>
.page-box {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .page-left {
        width: 215px;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 5px;
        box-shadow: 0rem 0.08rem 0.75rem 0rem rgba(48, 48, 48, 0.2);

        .page-left-top {
            width: 100%;
            height: 60px;
            padding: 0 12px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;

            p {
                font-size: 20px;
            }
        }

        .search-input {
            margin-bottom: 20px;
            width: calc(100% - 20px);
        }

        .customList {
            flex: 1;
            width: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;

            .custom-item {
                width: 100%;
                height: 60px;
                padding: 8px 20px;
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;

                &:nth-child(1) {
                    border-top: 1px solid #eee;
                }

                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }

                .info {
                    margin-left: 20px;
                    font-size: 16px;
                    line-height: 22px;
                }
            }
        }
    }

    .page-right {
        flex: 1;
        // width: 86.5%;
        height: 100%;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        // overflow: hidden;

        .page-right-top {
            width: 98%;
            border-radius: 5px;
            box-shadow: 0rem 0.08rem 0.75rem 0rem rgba(48, 48, 48, 0.2);

            .info-box {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                font-size: 16px;
                line-height: 50px;
                border: 1px solid #eee;

                h2 {
                    margin-left: 20px;
                    font-size: 20px;
                }

                p {
                    margin-left: 20px;

                    span {
                        font-weight: bold;
                    }
                }

                .w-l {
                    width: 200px;
                    margin-left: 20px;
                    line-height: 50px;
                }
            }
        }

        .train-details {
            width: 98%;
            margin-top: 20px;
            border-radius: 5px;
            box-shadow: 0rem 0.08rem 0.75rem 0rem rgba(48, 48, 48, 0.2);
            flex: 1;
            overflow-y: auto;

            h2 {
                font-size: 20px;
                padding: 15px;
            }

            .table-box {
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                padding-bottom: 50px;

                ul {
                    width: 9%;
                    position: relative;
                    top: 45px;

                    li {
                        height: 50px;
                        text-align: right;
                    }
                }

                table {
                    table-layout: fixed;

                    tr {
                        height: 50px;
                        text-align: center;

                        h4 {
                            font-size: 14px;
                            line-height: 16px;
                        }

                        p {
                            font-size: 12px;
                            line-height: 14px;
                        }
                    }
                }
            }
        }
    }
}
</style>
