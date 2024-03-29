/**
 *  时间戳转时间（10位）
 */
export function transitTime(timestamp: number | string): string {
    if (!timestamp) return "----"
    let date
    if ((timestamp + "").length == 10) {
        date = new Date(Number(timestamp) * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else {
        date = new Date(timestamp);
    }
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    function change(stage: number) {
        if (stage < 10) {
            return "0" + stage;
        } else {
            return stage;
        }
    }
    let D = change(date.getDate()) + ' ';
    let h = change(date.getHours()) + ':';  // 小时
    let m = change(date.getMinutes()) + ':'; // 分钟
    let s = change(date.getSeconds());      // 秒
    return Y + M + D + h + m + s;
}

export function getCurrentDate(settime: number | string, type = 'mr'): string {
    if (!settime) return "----"
    let now
    if ((settime + "").length == 10) {
        now = new Date(Number(settime) * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else {
        now = new Date(settime);
    }
    // let now = new Date(Date.parse(settime.replace(/-/g, '/')));
    let year: string | number = now.getFullYear();//得到年份
    let month: any = now.getMonth();//得到月份
    let date: string | number = now.getDate();//得到日期
    let day: string | number = now.getDay();//得到周几
    let hour: string | number = now.getHours();//得到小时
    let minu: string | number = now.getMinutes();//得到分钟
    let sec: string | number = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date as number < 10) date = "0" + date;
    if (hour as number < 10) hour = "0" + hour;
    if (minu as number < 10) minu = "0" + minu;
    if (sec as number < 10) sec = "0" + sec;
    let time = "";
    //精确到天
    if (type === 'mr') {
        time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    }
    if (type === 'nyr') {
        time = year + "-" + month + "-" + date;
    }
    if (type === 'yr') {
        time = month + "-" + date;
    }
    if (type === 'nyrsf') {
        time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
    }
    if (type === 'nyrsfm') {
        time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    }
    if (type === 'sfm') {
        time = hour + ":" + minu + ":" + sec;
    }
    if (type === 'sf') {
        time = hour + ":" + minu
    }

    return time;
}
