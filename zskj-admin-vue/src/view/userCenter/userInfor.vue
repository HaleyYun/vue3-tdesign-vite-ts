<template>
    <div class="user-box">
        <div class="user-left">
            <div class="user-top"><div class="line"></div><div>个人信息</div></div>
            <div class="user-info">
                <div class="userbg"></div>
                <div class="info">
                    <div class="info-one">
                        <div>用户名称</div>
                        <div class="name">{{ userInfo.name }}</div>
                    </div>
                    <div class="info-one">
                        <div>用户昵称</div>
                        <div class="name">{{ userInfo.nickName }}</div>
                    </div>
                    <div class="info-one">
                        <div>手机号码</div>
                        <div class="name">{{ userInfo.phone }}</div>
                    </div>
                    <div class="info-one">
                        <div>所属角色</div>
                        <div class="name">{{ userInfo.roleNameCn }}</div>
                    </div>
                    <div class="info-one">
                        <div>创建日期</div>
                        <div class="name">{{ userInfo.createTime }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-right">
            <div class="user-top"><div class="line"></div><div>基本信息</div></div>
            <div class="tabs">

                <t-tabs v-model="value">
                    <t-tab-panel :value="1" label="基本信息" :destroy-on-hide="false">
                        <t-form class="tabs-one" :data="info" :rules="(infoRules as FormRules<Data>)">
                            <t-form-item class="search-item" label="用户昵称:" name="nickName" initial-data="TDesign">
                                <t-input class="ipt-slt" v-model="info.nickName" placeholder="请输入用户昵称" />
                            </t-form-item>
                            <t-form-item class="search-item" label="手机号:" name="phone" initial-data="TDesign">
                                <t-input class="ipt-slt" v-model="info.phone" :maxlength="11" placeholder="请输入手机号" />
                            </t-form-item>
                            <t-form-item class="search-item" label="性别:" initial-data="TDesign">
                                <t-radio-group default-value="1" v-model="info.sex">
                                    <t-radio :value="1">男</t-radio>
                                    <t-radio :value="2">女</t-radio>
                                </t-radio-group>
                            </t-form-item>
                            <div class="btn">
                                <div class="pamary close" @click="close">取消</div>
                                <div class="pamary sure" @click="infoSubmit">确定</div>
                            </div>
                        </t-form>
                    </t-tab-panel>
                    <t-tab-panel :value="2" label="修改密码" :destroy-on-hide="false">
                        <template #panel>
                            <t-form class="tabs-one" :data="passworad" :rules="(formRules as FormRules<Data>)">
                                <t-form-item class="search-item" label="旧密码:" name="oldPassWord" initial-data="TDesign">
                                    <t-input class="ipt-slt" v-model="passworad.oldPassWord" placeholder="请输入旧密码" />
                                </t-form-item>
                                <t-form-item class="search-item" label="新密码:" name="passWord" initial-data="TDesign">
                                    <t-input class="ipt-slt" v-model="passworad.passWord" placeholder="请输入新密码" />
                                </t-form-item>
                                <t-form-item class="search-item" label="确认密码:" name="confirmPassWord"
                                    initial-data="TDesign">
                                    <t-input class="ipt-slt" v-model="passworad.confirmPassWord" placeholder="请再次输入新密码" />
                                </t-form-item>
                                <div class="btn">
                                    <div class="pamary close" @click="close">取消</div>
                                    <div class="pamary sure" @click="wordSubmit">确定</div>
                                </div>
                            </t-form>

                        </template>
                    </t-tab-panel>
                </t-tabs>


            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRoleStore } from '../../store/modules/role';
import { FormRules, Data, MessagePlugin } from 'tdesign-vue-next';
import {
    allfomation,
    userInfo,
    userPassWord
} from "../../request/modules/PersonaApi"
import { getInfo } from "../../request/modules/loginApi"
export default {
    components: {},
    setup() {
        const roleStore = useRoleStore()
        const router = useRouter()
        const setArrt = reactive({
            value: 1,
            userInfo: {
                name: '',
                nickName: '',
                phone: '',
                roleNameCn: '',
                createTime: ''
            },
            info: {
                nickName: '',
                phone: '',
                sex: 1
            },
            infoRules: {
                nickName: [{ required: true, message: '用户昵称必填', trigger: 'blur' }],
                // phone: [{ required: true, message: '手机号必填', trigger: 'blur' }]
            },
            passworad: {
                oldPassWord: '',
                passWord: '',
                confirmPassWord: ''
            },
            formRules: {
                oldPassWord: [{ required: true, message: '旧密码必填', trigger: 'blur' }],
                passWord: [{ required: true, message: '新密码必填', trigger: 'blur' }],
                confirmPassWord: [{ required: true, message: '确认新密码必填', trigger: 'blur' }]
            },

        })
        onMounted(() => {
            allInfo()
        })

        //获取基本信息
        const allInfo = () => {
            allfomation({}).then((res: any) => {
                if (res.code === 200) {
                    setArrt.userInfo = res.data
                    setArrt.info.nickName = res.data.nickName
                    setArrt.info.phone = res.data.phone
                    setArrt.info.sex = res.data.sex
                }
            })
        }


        //基本信息修改
        const infoSubmit = () => {
            userInfo(setArrt.info).then((res: any) => {
                if (res.code === 200) {
                    MessagePlugin.success("修改成功")
                    allInfo()
                    getInfo().then((res: any) => {
                        if (res.code === 200) {
                            roleStore.SetUserInfo(res.data)
                        }
                    })
                }
            })
        }
        //修改密码
        const wordSubmit = () => {
            userPassWord(setArrt.passworad).then((res: any) => {
                if (res.code === 200) {
                    MessagePlugin.success("修改成功")
                    allInfo()
                }
            })
        }
        const close = () => {
            router.back()
        }


        return {
            ...toRefs(setArrt),
            infoSubmit,
            wordSubmit,
            close,

        }
    }
}
</script>

<style lang="scss" scoped>
.user-box {
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    .user-left {
        width: 350px;
        height: 600px;
        border: 1px solid #eee;
        border-radius: 16px;
        background-color: #fff;
        box-shadow: 2px 2px 2px #ddd;

        .user-top {
            width: 350px;
            height: 45px;
            line-height: 45px;
            text-align: left;
            font-size: 18px;
            color: #222;
            font-weight: bold;
            display: flex;
            .line{
                width: 6px;
                height: 22px;
                background: #5766FE;
                border-radius: 20px;
                margin:10px 5px 10px 20px;
            }
        }

        .user-info {
            width: 300px;
            height: 400px;
            margin: auto;

            .userbg {
                width: 166px;
                height: 166px;
                border: 1px solid #eee;
                margin: 20px auto;
                border-radius: 10px;
            }

            .info {
                width: 300px;
                height: 250px;
                .info-one {
                    width: 300px;
                    height: 60px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    line-height: 60px;
                    font-size: 14px;
                    color: #BFBFCC;
                    font-weight: 600;
                    .name{
                        color: #4B4F5F;
                    }
                }
                .info-one:last-child{
                    border-bottom: 0px;
                }
            }
        }
    }





    .user-right {
        width: calc(100% - 300px);
        height: 600px;
        margin-left: 30px;
        border: 1px solid #eee;
        border-radius: 16px;
        box-shadow: 2px 2px 2px #ddd;
        background-color: #fff;

        .user-top {
            width: 100%;
            height: 45px;
            line-height: 45px;
            text-align: left;
            font-size: 18px;
            display: flex;
            color: #222;
            font-weight: bold;
            .line{
                width: 6px;
                height: 22px;
                background: #5766FE;
                border-radius: 20px;
                margin:10px 5px 10px 20px;
            }
        }

        .tabs {
            width: 96%;
            height: 300px;
            margin: 30px auto;
        }

        .tabs-one {
            .t-form__item {

                ::v-deep(.t-form__controls) {
                    margin-left: 0px !important;
                    width: 100% !important;
                }
            }

        }

        .search-item {
            height: 50px;
            line-height: 50px;
            display: flex;
            margin: 10px auto;
            font-size: 15px;
            

            label {
                width: 80px;
                height: 50px;
                text-align: right;
            }

            .ipt-slt {
                width: 100%;
            }

            ::v-deep(.t-input__extra) {
                bottom: 0px;
            }

            ::v-deep(.t-form__label) {
                color: #686868;
            }

        }

        .btn {
            display: flex;
            height: 60px;
            width: 450px;
            margin: 100px auto;
            justify-content: space-between;
            .pamary{
                width: 162px;
                height: 54px;
                border-radius: 27px;
                text-align: center;
                line-height: 55px;
                font-size: 18px;
            }
            .close {
                color: #3D7EFF;
                background: #F5F8FD;
            }
            .sure{
                color: #fFF;
                background: #3D7EFF;
            }
        }

    }
}
</style>
