<template>
    <div>
        <input ref="reuploadInput" type="file" accept="image/*" @change="onChange" id="fileBtn" style="display: none">
        <t-dialog v-model:visible="dialogVisible" :header="'图片裁剪'" :width="'50%'" :on-cancel="close" :on-close="close">
            <!-- 核心内容 -->
            <template #default>
                <div class="cropper">
                    <!--裁剪左侧内容 -->
                    <div class="cropper_left">
                        <VueCropper :style="{ width: '500px' }" ref="cropperRef" :img="options.img" :info="true"
                            :info-true="options.infoTrue" :auto-crop="options.autoCrop" :fixed-box="options.fixedBox"
                            :can-move="options.canMoveBox" :can-scale="options.canScale" :fixed-number="fixedNumber"
                            :fixed="options.fixed" :full="options.full" :center-box="options.centerBox"
                            :auto-crop-width="options.autoCropWidth" :auto-crop-height="options.autoCropHeight"
                            @real-time="previewHandle" />
                        <div class="reupload_box">
                            <div>
                                <t-button class="btn" theme="primary" @click="uploadFile('reload')">
                                    <template #icon>
                                        <UploadIcon />
                                    </template>重新上传</t-button>
                                <t-button class="btn" theme="primary" @click="refreshCrop">重置</t-button>
                            </div>
                            <div>
                                <icon-font class="rotate_right" @click="changeScale(1)">
                                    <AddCircleIcon />
                                </icon-font>
                                <icon-font class="rotate_right" @click="changeScale(-1)">
                                    <MinusCircleIcon />
                                </icon-font>
                                <icon-font class="rotate_right" @click="rotateRight">
                                    <RefreshIcon />
                                </icon-font>
                            </div>
                        </div>
                    </div>
                    <div class="cropper_right">
                        <div class="preview_text"> 预览 </div>
                        <div :style="getStyle" class="previewImg">
                            <div :style="previewFileStyle">
                                <img :style="previews.img" :src="previews.url" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <span class="dialog-footer">
                    <t-button @click="dialogVisible = false">取消</t-button>
                    <t-button theme="primary" @click="onConfirm"> 确认 </t-button>
                </span>
            </template>
        </t-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
// 需要引入的库
import 'vue-cropper/dist/index.css'
import { VueCropper } from "vue-cropper"

import { MessagePlugin } from 'tdesign-vue-next';
import { AddCircleIcon, MinusCircleIcon, RefreshIcon, UploadIcon } from 'tdesign-icons-vue-next';
import axios from "axios";
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/upload';
const token = localStorage.getItem("x-auth-token");
axios.defaults.headers.common['token'] = token;
const dialogVisible = ref<boolean>(false) // dialog的显示与隐藏
const emits = defineEmits(['confirm']) // 自定义事件
const index = ref<number>(0)
// 裁剪组件需要使用到的参数
interface Options {
    index: number
    img: string | ArrayBuffer | null // 裁剪图片的地址
    info: true // 裁剪框的大小信息
    outputSize: number // 裁剪生成图片的质量 [1至0.1]
    outputType: string // 裁剪生成图片的格式
    canScale: boolean // 图片是否允许滚轮缩放
    autoCrop: boolean // 是否默认生成截图框
    autoCropWidth: number // 默认生成截图框宽度
    autoCropHeight: number // 默认生成截图框高度
    fixedBox: boolean // 固定截图框大小 不允许改变
    fixed: boolean // 是否开启截图框宽高固定比例
    fixedNumber: Array<number> // 截图框的宽高比例  需要配合centerBox一起使用才能生效
    full: boolean // 是否输出原图比例的截图
    canMoveBox: boolean // 截图框能否拖动
    original: boolean // 上传图片按照原始比例渲染
    centerBox: boolean // 截图框是否被限制在图片里面
    infoTrue: boolean // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    accept: string // 上传允许的格式
}

// 父组件传参props
interface IProps {
    index?: number
    type: string // 上传类型, 企业logo / 浏览器logo
    allowTypeList: string[] // 接收允许上传的图片类型
    limitSize: number // 限制大小
    fixedNumber: number[] // 截图框的宽高比例
    fixedNumberAider?: number[] // 侧边栏收起截图框的宽高比例
    previewWidth: number // 预览宽度
    title?: string // 裁剪标题
    autoCropWidth: number, // 默认生成截图框宽度
    autoCropHeight: number // 默认生成截图框高度
}

// 预览样式
interface IStyle {
    width: number | string,
    height: number | string
}

/* 父组件传参 */
const props = withDefaults(defineProps<IProps>(), {
    index: 0,
    type: '',
    allowTypeList: () => ['jpg', 'png', 'jpeg'],
    limitSize: 1,
    fixedNumber: () => [1, 1],
    fixedNumberAider: () => [1, 1],
    previewWidth: 300,
    title: '',
    autoCropWidth: 0, // 默认生成截图框宽度
    autoCropHeight: 0 // 默认生成截图框高度
})
// 裁剪组件需要使用到的参数
const options = reactive<Options>({
    index: 0,
    img: '', // 需要剪裁的图片
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 0, // 默认生成截图框的宽度
    autoCropHeight: 0, // 默认生成截图框的长度
    fixedBox: false, // 是否固定截图框的大小 不允许改变
    info: true, // 裁剪框的大小信息
    outputSize: 1, // 裁剪生成图片的质量 [1至0.1]
    outputType: 'png', // 裁剪生成图片的格式
    canScale: true, // 图片是否允许滚轮缩放
    fixed: false, // 是否开启截图框宽高固定比例
    fixedNumber: [1, 1], // 截图框的宽高比例 需要配合centerBox一起使用才能生效 1比1
    full: true, // 是否输出原图比例的截图
    canMoveBox: true, // 截图框能否拖动a
    original: true, // 上传图片按照原始比例渲染
    centerBox: false, // 截图框是否被限制在图片里面
    infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    accept: 'image/jpeg,image/jpg,image/png,image/gif,image/x-icon'
})

const getStyle = ref<IStyle>({
    width: '',
    height: ''
})

/* 允许上传的类型 */
const acceptType = ref<string[]>([])

// 裁剪后的预览样式信息
const previews: any = ref({})
const previewFileStyle = ref({})

// 裁剪组件Ref
const cropperRef: any = ref({})
// input组件Ref
const reuploadInput = ref<HTMLElement | null | undefined>()

// 回显图片使用的方法
const onChange = (e: any) => {
    const file = e.target.files[0]
    const URL = window.URL || window.webkitURL
    // 上传图片前置钩子，用于判断限制类型用
    if (beforeUploadEvent(file)) {
        options.img = URL.createObjectURL(file)
        dialogVisible.value = true
    }
}

/* 上传图片前置拦截函数 */
const beforeUploadEvent = (file: File) => {
    const type = file.name.substring(file.name.lastIndexOf('.') + 1) // 获得图片上传后缀
    // 判断是否符合上传类型
    const isAllowTye = props.allowTypeList.some(item => {
        return item === type
    })
    if (!isAllowTye) {
        MessagePlugin.error(`仅支持${acceptType.value.join('、')}格式的图片`)
        return false
    }
    return true
}

/* 重置裁剪组件 */
const refreshCrop = () => {
    // cropperRef裁剪组件自带很多方法，可以打印看看
    cropperRef.value.refresh()
}

/* 右旋转图片 */
const rotateRight = () => {
    cropperRef.value.rotateRight()
}

/* 放大缩小图片比例 */
const changeScale = (num: number) => {
    const scale = num || 1
    cropperRef.value.changeScale(scale)
}

// 缩放的格式
const tempScale = ref<number>(0)

// 点击上传
const uploadFile = (type: string): void => {
    /* 打开新的上传文件无需生成新的input元素 */
    if (type === 'reupload') {
        reuploadInput.value?.click()
        return
    }
    let input: HTMLInputElement | null = document.createElement('input')
    input.type = 'file'
    input.accept = options.accept
    input.onchange = onChange
    input.click()
    input = null
}
/* 上传成功方法 */
// const cropperSuccess = async (dataFile: File) => {
//     const fileFormData = new FormData()
//     fileFormData.append('file', dataFile)
//     // 在接口请求中需要上传file文件格式, 并且该接口需要改header头部为form-data格式
//     // const { code, data } = await commonApi.uploadFile(fileFormData)
//     // if (code.value === 200 && data.value) {
//     //     return data.value
//     // }
//     // if (code.value === 200 && data.value) {
//     //     return data.value
//     // }
//     // try {
//     //     axios.post(uploadUrl, fileFormData).then(async (res: any) => {
//     //         console.log(res);
//     //         if (res.data.code === 200 && res.data.data) {
//     //             const url = await res.data.data;
//     //             return url
//     //         }
//     //     })
//     // } catch (e) {
//     //     console.warn(e, '上传失败')
//     // }
//     // 之前调用接口的方式
//     // axios('http://localhost:3001/adminSystem/common/api/upload', {
//     //   data: fileFormData,
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'multipart/form-data'
//     //   }
//     // }).then(async (result: any) => {
//     //   const res = await result
//     //   console.log(res, 'res')
//     // }).catch((err: any) => {
//     //   console.log(err, 'err')
//     // })
//     // axios(uploadUrl, {
//     //     data: fileFormData,
//     //     method: 'POST',
//     //     headers: {
//     //         'Content-Type': 'multipart/form-data',
//     //         token: token
//     //     }
//     // }).then(async (result: any) => {
//     //     const res = await result.data.data
//     //     return res
//     //     console.log(res, 'res')
//     // }).catch((err: any) => {
//     //     console.log(err, 'err')
//     // })
// }

// base64转图片文件
const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',')
    // const mime = arr[0].match(/:(.*?);/)[1]
    const mime = arr[0]
    const bstr = atob(arr[1])
    let len = bstr.length
    const u8arr = new Uint8Array(len)
    while (len--) {
        u8arr[len] = bstr.charCodeAt(len)
    }
    return new File([u8arr], filename, { type: mime })
}

// 上传图片（点击保存按钮）
const onConfirm = () => {
    // console.log(index.value, '这是我的index.value')
    cropperRef.value.getCropData(async (data: string) => {
        const dataFile: File = dataURLtoFile(data, 'images.png')
        // const res = await cropperSuccess(dataFile)
        // console.log(res)
        // 触发自定义事件
        // emits('confirm', res)
        // return res
        const fileFormData = new FormData()
        fileFormData.append('file', dataFile)
        try {
            axios.post(uploadUrl, fileFormData).then(async (res: any) => {
                console.log(res);
                if (res.data.code === 200 && res.data.data) {
                    // 触发自定义事件
                    emits('confirm', res.data.data, index.value)
                }
            })
        } catch (e) {
            console.warn(e, '上传失败')
        }
    })
    dialogVisible.value = false
}

// 裁剪之后的数据
const previewHandle = (data: any) => {
    previews.value = data // 预览img图片
    tempScale.value = props.previewWidth / data.w
    previewFileStyle.value = {
        width: data.w + 'px',
        height: data.h + 'px',
        margin: 0,
        overflow: 'hidden',
        zoom: tempScale.value,
        position: 'relative',
        border: '1px solid #e8e8e8',
        'border-radius': '2px'
    }
}

onMounted(() => {
    // console.log(options)
})

watch(() => props, (newVal, oldVal) => {
    console.log(oldVal)
    console.log(newVal)
    options.autoCropWidth = newVal.autoCropWidth
    options.autoCropHeight = newVal.autoCropHeight
    index.value = newVal.index
    /* 预览样式 */
    getStyle.value = {
        width: props.previewWidth + 'px', // 预览宽度
        height: props.previewWidth / props.fixedNumber[0] + 'px' // 预览高度
    }
    // 上传格式tips信息
    acceptType.value = []
    for (let i = 0; i < props.allowTypeList.length; i++) {
        acceptType.value.push(props.allowTypeList[i].toUpperCase())
    }
}, {
    immediate: true,
    deep: true
})

/* 向子组件抛出上传事件 */
defineExpose({
    uploadFile
})

const close = (context: any) => {
    dialogVisible.value = true,
        console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
};

</script>
<style lang="scss" scoped>
.cropper {
    width: 100%;
    height: 50vh;
    display: flex;
    overflow: hidden;

    .cropper_left {
        display: flex;
        flex-direction: column;
        width: 80%;

        .reupload_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;

            .btn {
                margin-right: 20px;
            }

            .rotate_right {
                margin-left: 16px;
                cursor: pointer;
            }
        }
    }

    .cropper_right {
        flex: 1;
        margin-left: 44px;

        .preview_text {
            margin-bottom: 12px;
        }
    }
}
</style>
  
  