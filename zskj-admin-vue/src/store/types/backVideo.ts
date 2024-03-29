import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useBackVideo = defineStore('backVideo', () => {
    const playbackInfo = ref({
        estimateNum: "",
        index: 0,
        taskType: 0,
        type: 0
    });
    const eyeItemData = ref({
        time: 0,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0,
    });
    const eyeResultsData = ref({
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
    });
    const memoryResultsData = ref({
        newImagestayTime: 0,
        oldImagestayTime: 0,
        isRight: 0,
        gazeBlink: 0,
        gazeAreaDuration: 0,
        imageStayRatio: 0
    })

    return {
        playbackInfo,
        eyeItemData,
        eyeResultsData,
        memoryResultsData
    }
}, {
    persist: true,
})