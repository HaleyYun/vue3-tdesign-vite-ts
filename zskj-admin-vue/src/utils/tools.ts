/**
 * @param {Function} fn 目标函数
 * @param {Number} time 延迟执行毫秒数
 * @param {Boolean} immediate true - 立即执行 false - 延迟执行
 * @description 防抖函数
 */

export function debounce(fn: Function, time: number, immediate = true) {
    let timer: NodeJS.Timeout | null;
    return function () {
        const that = this
        const args = arguments

        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, time)
            if (callNow) {
                fn.apply(that, args)
            }
        } else {
            timer = setTimeout(() => {
                fn.apply(that, args)
            }, time)
        }
    }
}


/**
 * @param {Function} fn 目标函数
 * @param {Number} time 延迟执行毫秒数
 * @param {Boolean} type 1-立即执行，2-不立即执行
 * @description 节流函数
 */
export function throttle(fn: Function, time: number, type: number = 1) {
    let previous = 0;
    let timeout: NodeJS.Timeout | null;
    return function () {
        let that = this
        let args = arguments
        if (type === 1) {
            let now = Date.now()

            if (now - previous > time) {
                fn.apply(that, args)
                previous = now
            }
        } else if (type === 2) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null
                    fn.apply(that, args)
                }, time)
            }
        }
    }
}