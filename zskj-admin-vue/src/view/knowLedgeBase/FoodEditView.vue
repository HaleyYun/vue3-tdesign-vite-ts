<template>
    <div class="report-box">
        <div class="box-img" @click="handlerRest">
            <div class="box-left">
                <img src="../../assets/img/knowledge/outIcon.png" />
                <t-button class="img-btn" theme="default" variant="text" @click="">{{ setArrt.newTitle }}菜品</t-button>
            </div>
        </div>
        <div class="content-box">
            <t-form :data="setArrt.formData" @submit="onSubmit" :rules="(formRules as FormRules<Data>)">
                <t-form-item requiredMark label="菜品名称:" name="name" initial-data="TDesign">
                    <t-textarea v-model="setArrt.formData.name" :maxlength="20" placeholder="请输入菜品名称"
                        :autosize="{ minRows: 2, maxRows: 2 }" />
                </t-form-item>
                <t-form-item requiredMark label="菜品分类:" name="mealCategory">
                    <t-select v-model="setArrt.formData.mealTypeName" @change="foodSelectChange" placeholder="去选择菜品分类"
                        style="width: 100%;padding: 5px 0;">
                        <t-option v-for="(item, index) in viewData" :label="item.name" :value="item.id" />
                    </t-select>
                </t-form-item>
                <t-form-item class="tag-item" requiredMark label="菜品标签:" name="mealNutrient">
                    <t-space class="tag-block">
                        <t-tag class="tags" v-for="(tag, index) in mealNutrient" :key="index" :theme="tag.type"
                            :closable="tag.showClose" :icon="tag.icon" :disabled="!!tag.disabled" :max-width="tag.maxWidth"
                            @click="handleClick" @close="handleClose(index)">
                            {{ tag.name }}
                        </t-tag>
                    </t-space>
                    <t-space class="tag-block editable" style="display: flex;align-items: center;"
                        v-if="mealNutrient.length < 5">
                        <t-tag v-if="!inputVisible" @click="handleClickAdd">
                            添加标签
                            <add-icon />
                        </t-tag>
                        <t-input v-else ref="input" size="small" style="width: 94px" :maxlength="5" @blur="handleInputEnter"
                            @enter="handleInputEnter" />
                    </t-space>
                </t-form-item>
                <t-form-item requiredMark label="菜品描述:" name="desc">
                    <t-textarea v-model="setArrt.formData.desc" :maxlength="150" placeholder="请输入菜品描述"
                        :autosize="{ minRows: 3, maxRows: 4 }" />
                </t-form-item>
                <t-form-item requiredMark label="图片:" name="name" initial-data="TDesign">
                    <t-upload ref="uploadRef" v-if="disUpload" v-model="file" theme="image"
                        :size-limit="{ size: 2, unit: 'MB' }" :action="uploadUrl" :formatResponse="formatImgResponse"
                        accept="image/*" :headers="setArrt.headers" :beforeAllFilesUpload="checkPicUrlLoad"
                        :onSuccess="handlePicUrlLoad" tips="请上传80px*72px图片" @remove="removeImg"
                        :locale="{ triggerUploadText: { image: '请选择图片' } }"></t-upload>
                    <div class="img-box" @click="browserUpload('picUrl', 0)" v-else>
                        <div class="upload-img-box">
                            <AddIcon class="icon" />
                            <span class="check-img">请选择图片</span>
                        </div>
                        <div class="check-text">请上传80px*72px图片</div>
                    </div>
                    <cropper ref="clipperRef" :type="clipperData.type" :allow-type-list="clipperData.allowTypeList"
                        :limit-size="clipperData.limitSize" :fixed-number="clipperData.fixedNumber"
                        :index="clipperData.index" :fixed-number-aider="clipperData.fixedNumberAider"
                        :preview-width="clipperData.previewWidth" :auto-crop-width="clipperData.autoCropWidth"
                        :auto-crop-height="clipperData.autoCropHeight" @confirm="onConfirm" />
                </t-form-item>
                <t-form-item requiredMark label="用餐时间:" name="mealTime">
                    <t-radio-group v-model="setArrt.formData.mealTime" @change="onChange">
                        <t-radio value="1">早餐</t-radio>
                        <t-radio value="2">午餐</t-radio>
                        <t-radio value="3">晚餐</t-radio>
                    </t-radio-group>
                </t-form-item>
                <t-form-item class="food-ingr" requiredMark label="食材:" name="foodIngr" style="display: flex;">
                    <t-button class="add-item" variant="outline" theme="primary" @click="routItem">
                        <template #icon>
                            <AddCircleIcon />
                        </template>
                        新增</t-button>
                    <t-table :data="setArrt.formData.ingredientRequests" row-key="index" :columns="setArrt.colum"
                        size="medium" hover :bordered="false">
                        <template #quantity="{ row }">
                            <!-- <t-input class="tag-input" v-model="row.number" type="number" :min="0" :decimalPlaces="2"
                                ref="input" size="small" :maxlength="5" @blur="checkProdPrice" :format="row.number.replace(/^(-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" placeholder="请输入所需食材数量/份" /> -->
                            <t-input-number :min="0" :decimalPlaces="1" allowInputOverLimit v-model="row.quantity"
                                @blur="checkProdPrice"></t-input-number>
                        </template>
                        <template #action="{ row }">
                            <t-popconfirm content="确认删除吗" theme="danger" @click.stop @confirm="deleteItem(row)">
                                <t-button class="delete-btn" variant="text" theme="danger" size="small">
                                    <template>
                                    </template>删除</t-button>
                            </t-popconfirm>
                        </template>
                    </t-table>
                </t-form-item>
                <t-form-item class="food-ingr" requiredMark label="做法:" name="foodIngr" style="display: flex;">
                    <t-button class="add-item" variant="outline" theme="primary" @click="addItem">
                        <template #icon>
                            <AddCircleIcon />
                        </template>
                        新增</t-button>
                    <div class="practice" v-for="(item, index) in setArrt.formData.stepsList"
                        v-if="setArrt.formData.stepsList">
                        <div class="pra-left">
                            <div>步骤{{ toChineseNumber(item.id) }}</div>
                            <t-button class="delete-btn" variant="text" theme="danger" size="small"
                                @click="delStepsItem(item)">删除</t-button>
                        </div>
                        <div class="pra-middle">
                            <t-textarea v-model="item.details" :maxlength="30" placeholder="请输入内容"
                                :autosize="{ minRows: 4, maxRows: 4 }" />
                        </div>
                        <div class="pra-right" style="display: flex;">
                            <div style="margin-right: 10px;"><span style="color: #FF0000;">*</span>图片:</div>
                            <t-upload v-if="item.disStepsListUpload" v-model="item.fileList" theme="image"
                                :size-limit="{ size: 2, unit: 'MB' }" :action="uploadUrl"
                                :formatResponse="formatImgResponse" accept="image/*" :headers="setArrt.headers"
                                :beforeAllFilesUpload="checkUpload" :onSuccess="handleUpload"
                                @remove="removeStepsList(index)" tips="请上传115px*72px图片"
                                :locale="{ triggerUploadText: { image: '请选择图片' } }"></t-upload>
                            <div class="img-box" @click="browserUpload('stepsList', index)" v-else>
                                <div class="upload-img-box">
                                    <AddIcon class="icon" />
                                    <span class="check-img">请选择图片</span>
                                </div>
                                <div class="check-text">请上传115px*72px图片</div>
                            </div>
                            <cropper :id="'clipperRefStepsList' + index" :type="clipperData.type"
                                :allow-type-list="clipperData.allowTypeList" :limit-size="clipperData.limitSize"
                                :fixed-number="clipperData.fixedNumber" :fixed-number-aider="clipperData.fixedNumberAider"
                                :index="clipperData.index" :preview-width="clipperData.previewWidth"
                                :auto-crop-width="clipperData.autoCropWidth" :auto-crop-height="clipperData.autoCropHeight"
                                @confirm="onStepsListConfirm" />
                        </div>
                    </div>
                    <div class="practice" v-for="(item, index) in steps" v-else>
                        <div class="pra-left">
                            <div>步骤{{ toChineseNumber(item.id) }}{{ item.url }}</div>
                            <t-button class="delete-btn" variant="text" theme="danger" size="small"
                                @click="delStepsItem(item)">删除</t-button>
                        </div>
                        <div class="pra-middle">
                            <t-textarea v-model="item.details" :maxlength="50" placeholder="请输入内容"
                                :autosize="{ minRows: 4, maxRows: 4 }" />
                        </div>
                        <div class="pra-right" style="display: flex;">
                            <div style="margin-right: 10px;"><span style="color: #FF0000;">*</span>图片:</div>
                            <t-upload v-model="item.fileList" v-if="item.disStepsUpload" theme="image"
                                :size-limit="{ size: 2, unit: 'MB' }" :action="uploadUrl"
                                :formatResponse="formatImgResponse" accept="image/*" :headers="setArrt.headers"
                                :beforeAllFilesUpload="checkUpload" :onSuccess="handleUpload" @remove="removeSteps(index)"
                                tips="请上传115px*72px图片" :locale="{ triggerUploadText: { image: '请选择图片' } }"></t-upload>
                            <div class="img-box" @click="browserUpload('steps', index)" v-else>
                                <div class="upload-img-box">
                                    <AddIcon class="icon" />
                                    <span class="check-img">请选择图片</span>
                                </div>
                                <div class="check-text">请上传115px*72px图片</div>
                            </div>
                            <cropper :id="'clipperRefSteps' + index" :type="clipperData.type"
                                :allow-type-list="clipperData.allowTypeList" :limit-size="clipperData.limitSize"
                                :fixed-number="clipperData.fixedNumber" :fixed-number-aider="clipperData.fixedNumberAider"
                                :index="clipperData.index" :preview-width="clipperData.previewWidth"
                                :auto-crop-width="clipperData.autoCropWidth" :auto-crop-height="clipperData.autoCropHeight"
                                @confirm="onStepsConfirm" />
                        </div>
                    </div>
                </t-form-item>
                <div class="btn-commit">
                    <t-button class="clear-item" variant="outline" theme="primary" style="margin-left: 20px;" type="reset"
                        @click="artBack">取消</t-button>
                    <t-button class="confirm-item" theme="primary" type="submit">提交</t-button>
                </div>
            </t-form>
        </div>
        <!-- :autoCropWidth="clipperData.autoCropWidth" :autoCropHeight="clipperData.autoCropHeight"  -->
    </div>
</template>
    
<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AddIcon, AddCircleIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, FormRules, Data, InputNumberValue, UploadRemoveContext } from 'tdesign-vue-next';
import { addUpdatefood, queryfoodId } from '../../request/modules/knowledge';
import { debounce } from "../../utils/tools"
import { foodDataStore } from '../../store/modules/food';
import cropper from '@/components/ImgCropping/Cropper.vue'
const foodStore = foodDataStore();
const router = useRouter();
const route = useRoute();
const uploadUrl = ref<any>(import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/uploadForDate'); //图片展示
const file = ref<any>([]);
const disUpload = ref<boolean>(false);
const fileList = ref<any>([]);
const files = ref([]);
const inputVisible = ref(false)
let num = 0;
const input = ref('');
const clipperRef = ref<any>(null)
// const clipperRefStepsList = ref<any>(null)
// const clipperRefStepsList = ref<any>([])
// 定义interface类型
interface IClipper {
    type: string // 上传类型
    allowTypeList: string[] // 接收允许上传的图片类型
    limitSize: number // 限制大小
    fixedNumber: number[] // 截图框的宽高比例
    fixedNumberAider?: number[] // 侧边栏收起截图框的宽高比例
    previewWidth: number // 预览宽度
    previewWidthAider?: number // 侧边栏收起预览宽度
    autoCropWidth: number // 默认生成截图框宽度
    autoCropHeight: number // 默认生成截图框高度
}

// const clipperData = ref<IClipper>({
const clipperData = ref<any>({
    index: 0,
    type: '',
    allowTypeList: ['png', 'jpg', 'jpeg'],
    limitSize: 1,
    fixedNumber: [1, 1],
    previewWidth: 100,
    autoCropWidth: 0, // 默认生成截图框宽度
    autoCropHeight: 0 // 默认生成截图框高度
})
const browserUpload = (value: any, num: number): void => {
    if (value == 'picUrl') {
        clipperData.value.autoCropWidth = 80;
        clipperData.value.autoCropHeight = 72;
        clipperRef.value.uploadFile()
    } else if (value == 'steps') {
        clipperData.value.index = num
        clipperData.value.autoCropWidth = 115;
        clipperData.value.autoCropHeight = 72;
        let el: any = document.getElementById('clipperRefSteps' + num)?.childNodes;
        el[0]?.click()
    } else {
        clipperData.value.index = num
        clipperData.value.autoCropWidth = 115;
        clipperData.value.autoCropHeight = 72;
        let el: any = document.getElementById('clipperRefStepsList' + num)?.childNodes;
        el[0]?.click()
    }
}
/* 保存图片自定义事件 */
const onConfirm = (val: any, index: number) => {
    console.log(val)
    console.log(index)
    disUpload.value = true;
    file.value[0] = {
        name: '',
        url: val
    }
    
}
const onStepsListConfirm = (val: any, index: number) => {
    setArrt.formData.stepsList.forEach((item: any, i: number) => {
        if (i == index) {
            item.disStepsListUpload = true
            item.fileList[0] = {
                name: '',
                url: val
            }
        }
    })
    console.log(setArrt.formData.stepsList)
}
const onStepsConfirm = (val: any, index: number) => {
    steps.forEach((item: any, i: number) => {
        if (i === index) {
            item.disStepsUpload = true
            item.fileList[0] = {
                name: '',
                url: val
            }
        }
    })
}
const removeImg = (context: UploadRemoveContext) => {
    console.log(context)
    disUpload.value = false;
}
const removeStepsList = (index: number) => {
    disUpload.value = false;
    setArrt.formData.stepsList[index].disStepsListUpload = false
    setArrt.formData.stepsList[index].fileList = []
}
const removeSteps = (index: number) => {
    disUpload.value = false;
    steps[index].disStepsUpload = false
    steps[index].fileList = []
}
const formRules = ref<any>({
    name: [{ required: true, message: '请输入菜品', trigger: 'blur' }],
    mealCategory: [{ required: true, message: '请选择分类', trigger: 'blur' }],
    // mealNutrient: [{ required: true, message: '请输入标签', trigger: 'blur' }],
    desc: [{ required: true, message: '请输入描述', trigger: 'blur' }]
});
const steps = reactive<any>([])
const viewData = ref<any>([
    { id: 1, name: "肉禽蛋" },
    { id: 2, name: "蔬菜" },
    { id: 3, name: "海鲜水产" },
    { id: 4, name: "面食" },
    { id: 5, name: "其他" },
])
const mealNutrient = ref<any>([])
const setArrt = reactive<any>({
    newTitle: "",
    headers: {
        token: ""
    },
    colum: [
        {
            title: '食材名称',
            colKey: 'name',
        },
        {
            title: '重量/份',
            colKey: 'weight',
        },
        {
            title: '数量',
            colKey: 'quantity',
            slots: { customRender: 'quantity' },
            align: 'center'
        },
        {
            title: '操作',
            colKey: 'action',
            slots: { customRender: 'action' },
            align: 'center'
        },
    ],
    id: 0,
    formData: {
        name: "",
        mealCategory: '',
        mealTypeName: "",
        desc: "",
        ingredientRequests: [],
        mealNutrient: [
            // { type: 'default', showClose: true }
        ],
        mealTime: '1',
        picUrl: "",
        // steps: [
        //     { id: 0, details: "", url: "" }
        // ],
        // stepsList: [
        //     { id: 0, details: "", url: "" }
        // ]
    },
    steps: [],
    stepsList: []
});

onMounted(() => {
    if (foodStore.id) {
        setArrt.id = foodStore.id;
    }
    let token = localStorage.getItem('x-auth-token');
    setArrt.headers.token = token as string;
    if (!foodStore.title) {
        setArrt.newTitle = route.query.title
    } else {
        setArrt.newTitle = foodStore.title
    }
    if (route.query.id) {
        setArrt.id = route.query.id
        queryFood()
    }
    // console.log(foodStore.foodData)
    if (foodStore.foodData?.ingredientRequests.length > 0) {
        setArrt.formData = JSON.parse(JSON.stringify(foodStore.foodData));
        mealNutrient.value = setArrt.formData.mealNutrient
        disUpload.value = foodStore.disUpload
        // console.log(file.value)
        if (!file.value.length) {
            file.value[0] = {
                name: '',
                url: setArrt.formData.picUrl
            }
        }

        // res.data.stepsList.forEach((res: any) => {
        //     res.fileList = [] as any
        //     res.fileList[0] = {
        //         name: '',
        //         url: res.url
        //     }
        // });
        // console.log(res.data.stepsList)
        // steps.value = res.data.stepsList
        foodStore.foodData = foodStore.newFoodData
    } else {
        disUpload.value = foodStore.disUpload
        setArrt.formData = JSON.parse(JSON.stringify(foodStore.foodData));
    }
});

const onSubmit = debounce(() => {
    console.log(setArrt.formData)
    console.log(setArrt.id)
    if (setArrt.newTitle == "新增") {
        let mealData = [] as any;
        mealNutrient.value.forEach((res: any) => {
            mealData.push(res.name)
        })
        setArrt.formData.mealNutrient = mealData;
        let fileCheck = false
        // console.log(steps)
        if (steps.length) {
            steps.forEach((res: any) => {
                if (res.fileList.length) {
                    res.url = res.fileList[0]?.url
                } else {
                    fileCheck = true
                    res.url = ""
                }
            })
        } else {
            fileCheck = true
        }
        setArrt.formData.steps = steps;
        if (!setArrt.formData.name) {
            MessagePlugin.warning('菜品名称不能为空')
            return
        }
        if (!setArrt.formData.mealCategory) {
            MessagePlugin.warning('分类不能为空')
            return
        }
        if (!setArrt.formData.mealNutrient.length) {
            MessagePlugin.warning('标签不能为空')
            return
        }
        if (!setArrt.formData.desc) {
            MessagePlugin.warning('描述不能为空')
            return
        }
        if (!setArrt.formData.picUrl) {
            MessagePlugin.warning('图片不能为空')
            return
        }
        if (!setArrt.formData.ingredientRequests.length) {
            MessagePlugin.warning('食材不能为空')
            return
        }
        if (fileCheck) {
            MessagePlugin.warning('步骤图片或者内容不能为空')
            return
        }
        addUpdatefood(setArrt.formData).then((res: any) => {
            if (res.code === 200) {
                foodStore.title = ""
                foodStore.checkList = []
                foodStore.id = 0
                foodStore.foodData = foodStore.newFoodData;
                setArrt.formData = {
                    name: "",
                    mealCategory: '',
                    mealTypeName: "",
                    desc: "",
                    ingredientRequests: [],
                    mealNutrient: [],
                    mealTime: '1',
                    picUrl: "",
                }
                MessagePlugin.success(res.msg)
                router.push("/knowLedgeView");
            }
        })
    } else {
        // console.log(setArrt.id)
        console.log(setArrt.formData.picUrl)
        if (setArrt.formData.stepsList) {
            setArrt.formData.stepsList.forEach((res: any) => {
                if (res.fileList) {
                    res.url = res.fileList[0].url
                }
                delete res.fileList
            })
        }
        setArrt.formData.picUrl = file.value[0].url
        // console.log(setArrt.formData.stepsList)
        let mealData = [] as any;
        mealNutrient.value.forEach((res: any) => {
            mealData.push(res.name)
        })
        let data = {
            id: setArrt.id,
            name: setArrt.formData.name,
            mealCategory: setArrt.formData.mealCategory,
            desc: setArrt.formData.desc,
            ingredientRequests: setArrt.formData.ingredientRequests,
            mealNutrient: mealData,
            mealTime: setArrt.formData.mealTime,
            picUrl: setArrt.formData.picUrl,
            steps: setArrt.formData.stepsList
        }
        addUpdatefood(data).then((res: any) => {
            if (res.code === 200) {
                foodStore.title = ""
                foodStore.checkList = []
                foodStore.id = 0
                foodStore.foodData = foodStore.newFoodData;
                setArrt.formData = {
                    name: "",
                    mealCategory: '',
                    mealTypeName: "",
                    desc: "",
                    ingredientRequests: [],
                    mealNutrient: [],
                    mealTime: '1',
                    picUrl: "",
                }
                MessagePlugin.success(res.msg)
                router.push("/knowLedgeView");
            }
        })
    }
}, 300, false);

const queryFood = () => {
    queryfoodId({ id: setArrt.id }).then((res: any) => {
        if (res.code === 200) {
            res.data.labelList.forEach((res: any) => {
                mealNutrient.value.push({ name: res, type: 'default', showClose: true })
            });
            file.value[0] = {
                name: '',
                url: res.data.picUrl
            };
            disUpload.value = true;
            res.data.stepsList.forEach((res: any) => {
                res.fileList = [] as any
                res.disStepsListUpload = true
                res.fileList[0] = {
                    name: '',
                    url: res.url
                }
            });
            steps.value = res.data.stepsList
            setArrt.id = res.data.id
            setArrt.formData = res.data
        }
    })
}
const onChange = (event: any) => {
    setArrt.formData.mealTime = event
};
const foodSelectChange = (event: any) => {
    // console.log(event)
    if (event) {
        viewData.value.forEach((res: any) => {
            if (res.id === event) {
                setArrt.formData.mealCategory = String(res.id)
                setArrt.formData.mealTypeName = res.name
            }
        })
    }
};

const addItem = () => {
    if (setArrt.formData?.stepsList) {
        setArrt.formData.stepsList.push({
            id: setArrt.formData.stepsList.length,
            details: "",
            url: "",
            fileList: [] as any
        })
        // num++
    } else {
        steps.push({
            id: num,
            details: "",
            url: "",
            fileList: [] as any
        })
        num++
    }
    // console.log(steps)
};
const routItem = () => {
    console.log(setArrt.newTitle)
    foodStore.id = setArrt.id
    foodStore.title = setArrt.newTitle
    foodStore.foodData = setArrt.formData
    foodStore.disUpload = disUpload.value
    // console.log(foodStore.foodData)
    // console.log(foodStore.checkList)
    if (file.value.length) {
        foodStore.foodData.picUrl = file.value[0].url
    } else {
        file.value = [];
    }
    // console.log(mealNutrient.value)
    foodStore.foodData.mealNutrient = mealNutrient.value
    if (setArrt.formData.ingredientRequests.length) {
        foodStore.checkList = setArrt.formData.ingredientRequests.map((res: any) => {
            return res.dietId
        })
    }
    // console.log(setArrt.id)
    // console.log(foodStore.checkList)
    router.push({
        path: '/foodList',
        query: {
            seleted: 1,
        }
    });
};
const checkProdPrice = (value: InputNumberValue) => {
    setArrt.formData.prodPrice = Math.abs(Number(value))
}
const artBack = () => {
    setArrt.formData = {
        name: "",
        mealCategory: '',
        mealTypeName: "",
        desc: "",
        ingredientRequests: [],
        mealNutrient: [],
        mealTime: '1',
        picUrl: "",
    }
    foodStore.foodData = foodStore.newFoodData
    foodStore.title = ""
    foodStore.id = 0
    foodStore.foodData.ingredientRequests = []
    foodStore.checkList = []
    router.push("/knowLedgeView");
}
const handleClose = (index: number) => {
    // setArrt.formData.mealNutrient.splice(index, 1);
    mealNutrient.value.splice(index, 1);
};

const handleClick = (event: any) => {
    // console.log(event);
};

const deleteItem = (event: any) => {
    // console.log(event);
    setArrt.formData.ingredientRequests.some((item: any, index: number) => {
        if (item.dietId === event.dietId) {
            setArrt.formData.ingredientRequests.splice(index, 1);
        }
    })
};
const delStepsItem = (event: any) => {
    // console.log(event);
    steps.some((item: any, index: number) => {
        if (item.id === event.id) {
            steps.splice(index, 1);
        }
    })
    if (setArrt.formData.stepsList) {
        setArrt.formData.stepsList.some((item: any, index: number) => {
            if (item.id === event.id) {
                setArrt.formData.stepsList.splice(index, 1);
            }
        })
    }
    // console.log(steps)
};

const handleInputEnter = (val: any) => {
    // console.log(val)
    // console.log(mealNutrient.value)
    // setArrt.formData.mealNutrient.push({ name: val, type: 'default', showClose: true });
    if (val && !mealNutrient.value.some((item: any) => item.name === val)) {
        mealNutrient.value.push({ name: val, showClose: true });
    }
    inputVisible.value = false;
};

const handleClickAdd = () => {
    inputVisible.value = true;
    // nextTick(() => {
    //     input.value?.focus();
    // });
};
const imgChange = (file: any) => {
    console.log(file)
}
//上传图片
const handlePicUrlLoad = (context: any) => {
    setArrt.formData.picUrl = context.response.url;
};
//上传图片
const handleUpload = (context: any) => {
    // console.log(context.response.url)
    // setArrt.formData.picUrl = context.response.url;
};
const formatImgResponse = (response: any) => {
    return { name: response.data.originalFilename, url: response.data.url };
};
const checkPicUrlLoad = (files: any[]): boolean | Promise<boolean> => {
    return new Promise(function (resolve, reject) {
        let width = 80;
        let height = 72;
        let url = '';
        // console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL);
        if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
            // console.log('img.width', img.width, img.height);
            let valid = img.width == width && img.height == height;
            if (valid) {
                resolve(true);
            } else {
                MessagePlugin.warning('图片尺寸(80px*72px)不符合标准！');
                reject(false);
            }
        };
        img.src = url;
    });
};
const checkUpload = (files: any[]): boolean | Promise<boolean> => {
    return new Promise(function (resolve, reject) {
        let width = 115;
        let height = 72;
        let url = '';
        // console.log(files, window.URL.createObjectURL, window.webkitURL.createObjectURL);
        if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(files[0].raw as Blob | MediaSource);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(files[0].raw as Blob | MediaSource);
        }
        let img = new Image();
        img.onload = function () {
            // console.log('img.width', img.width, img.height);
            let valid = img.width == width && img.height == height;
            if (valid) {
                resolve(true);
            } else {
                MessagePlugin.warning('图片尺寸(115px*72px)不符合标准！');
                reject(false);
            }
        };
        img.src = url;
    });
};
//后退
const handlerRest = () => {
    setArrt.formData = {
        name: "",
        mealCategory: '',
        mealTypeName: "",
        desc: "",
        ingredientRequests: [],
        mealNutrient: [],
        mealTime: '1',
        picUrl: "",
    }
    foodStore.title = ""
    foodStore.id = 0
    foodStore.foodData = foodStore.newFoodData
    foodStore.foodData.ingredientRequests = []
    foodStore.checkList = []
    router.push("/knowLedgeView");
};
// 阿拉伯数字格式化中文
const toChineseNumber = (number: number) => {
    const CHINESE_NUMBERS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
    const CHINESE_UNITS = ['', '十', '百', '千']
    // const CHINESE_GROUP_UNITS = ['', '万', '亿', '万亿']
    // if (number === 0) return '零'
    let [integer, decimal] = number.toString().split('.')
    // console.log(integer)
    // console.log(decimal)
    let integerPart = ''
    let decimalPart = ''
    if (integer !== '0') {
        integerPart = integer
            .split('')
            .reverse()
            .map((value: any, index: number) => {
                return CHINESE_NUMBERS[value] + (value === '0' ? '' : CHINESE_UNITS[index % 4])
            })
            .reverse()
            .join('')
            .replace(/零+/g, '零')
            .replace(/零$/g, '')
    }

    if (decimal) {
        decimalPart = decimal
            .split('')
            .map((value: any) => CHINESE_NUMBERS[value])
            .join('')
    }
    return integerPart + (decimalPart ? '点' + decimalPart : '') || '一'
}

</script>
    
<style lang="scss" scoped>
.report-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .box-img {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .box-left {
            display: flex;
            align-items: center;

            .img-btn {
                font-size: 22px;
                font-family: PingFang-SC-Bold, PingFang-SC;
                font-weight: bold;
                color: #222222;
                line-height: 30px;
            }
        }

        .expansion {
            margin-right: 50px;
            font-size: 20px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #919191;
            line-height: 28px;

            img {
                width: 12px;
                height: 6.72px;
                margin-right: 3.36px;
            }
        }
    }

    .content-box {
        padding: 21px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 16px;
    }

    .img-box {
        display: flex;
        flex-direction: column;
        cursor: pointer;

        .upload-img-box {
            width: 110px;
            height: 110px;
            background: #f3f3f3;
            border: 1px dashed #ddd;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .icon {
                font-size: 23px;
                margin-bottom: 6px;
                color: rgba(0, 0, 0, 0.9);
            }

            .check-img {
                color: rgba(0, 0, 0, 0.4);
                font-size: 11px;
            }

        }

        .check-text {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 7px;
        }
    }

    // .tag-item {
    //     display: flex !important;
    //     align-items: flex-start !important;

    //     ::v-deep(.t-form__controls) {
    //         margin-left: 0 !important;
    //     }

    //     ::v-deep(.t-form__controls-content) {
    //         width: 900px !important;
    //         height: 70px;
    //         overflow-x: auto !important;
    //         display: flex;
    //         align-items: flex-start;
    //     }

    //     ::v-deep(.t-form__controls-content::-webkit-scrollbar) {
    //         /*滚动条整体样式*/
    //         width: 4px;
    //         /*高宽分别对应横竖滚动条的尺寸*/
    //         height: 6px;
    //         margin-top: 5px;
    //     }
    // }

    .food-ingr {
        ::v-deep(.t-form__controls) {
            margin-left: 0 !important;
            width: 100%;
        }

        ::v-deep(.t-form__controls-content) {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
        }

        .add-item {
            background: #FAFBFF;
            color: #3D7EFF;
            box-shadow: 0px 2px 4px 0px #fafbff;
            border: none;
            border-radius: 6px;
            margin-bottom: 14px;
        }

        ::v-deep(.t-input.t-size-s) {
            border-radius: 8px !important;
        }

        ::v-deep(.t-table__header tr) {
            background: #FAFBFD;
        }

        .delete-btn {
            background: #FFF1F1;
            border-radius: 13px;
            padding: 3px 14px;
        }
    }

    .practice {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .pra-left {
            margin-right: 42px;

            button {
                margin-top: 5px;
            }
        }

        .pra-middle {
            width: 390px;
            margin-right: 28px;
        }

    }

    .btn-commit {
        display: flex;
        justify-content: center;
        margin-top: 20px;

        .clear-item {
            width: 162px;
            height: 54px;
            border: none;
            border-radius: 27px;
            background: #F5F8FD;
            font-size: 18px;
            font-weight: bold;
            margin-right: 84px;
        }

        .confirm-item {
            background: #3D7EFF;
            width: 162px;
            height: 54px;
            border: none;
            border-radius: 27px;
            font-size: 18px;
            font-weight: bold;
        }
    }

    ::v-deep(.t-input.t-is-readonly) {
        height: 44px !important;
        border-radius: 8px !important;
    }

    ::v-deep(.t-upload__card-content) {
        border-radius: 8px !important;
    }

    ::v-deep(.t-upload__card-container) {
        border-radius: 8px !important;
    }
}

::v-deep(.tag-block .tags:last-child) {
    margin-right: 20px !important;
}

::v-deep(.t-input.t-size-s) {
    height: 44px !important;
}

::v-deep(.t-tag--default) {
    background: none !important;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px #FAFBFF;
    border-radius: 8px;
    display: block;
    display: flex;
    padding: 21px 10px;
    border: 1px solid #DADCE4;
}

::v-deep(.t-tag--default .t-tag__icon-close) {
    border: 1px solid #ccc !important;
    border-radius: 4px;
    background: #EFEFEF;
}

::v-deep(.t-tag .t-icon) {
    border: 1px solid #ccc !important;
    border-radius: 4px;
    background: #EFEFEF;
    margin-left: 10px;
}

::v-deep(.t-textarea__limit) {
    display: none !important;
}

::v-deep(.t-textarea .t-resize-none) {
    border-radius: 8px !important;
}

.tdesign-demo-image-viewer__ui-image {
    width: 100%;
    height: 100%;
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    border-radius: var(--td-radius-small);
    overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    color: var(--td-text-color-anti);
    line-height: 22px;
    transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
    opacity: 1;
    cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
    position: absolute;
}

.tdesign-demo-image-viewer__ui-image--footer {
    padding: 0 16px;
    height: 56px;
    width: 100%;
    line-height: 56px;
    font-size: 16px;
    position: absolute;
    bottom: 0;
    color: var(--td-text-color-anti);
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
    flex: 1;
}

.tdesign-demo-popup__reference {
    margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
    cursor: pointer;
}

.tdesign-demo-image-viewer__base {
    height: 50px;
    border-radius: var(--td-radius-medium);
}
</style>
    