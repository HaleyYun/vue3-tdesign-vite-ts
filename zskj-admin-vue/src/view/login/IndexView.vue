<template>
  <div class="login-box">
    <div class="content-box">
      <img class="left-img" src="../../assets/img/login/login_log.png" alt="">
      <div class="right-box">
        <img class="zs-log" src="../../assets/img/login/zs_log.png" alt="">
        <div class="title" style="position: relative;display: flex;">
          <!-- <h1 style="width:60px;">Brain</h1>
          <div class="add" style="width:10px;height:10px;position: absolute;top:5px;left:45px;">+</div> -->
          <h1>智能认知评估与干预管理系统</h1>
        </div>


        <div class="ipt-box" style="margin-top: 44px;">
          <div class="ipt-title">用户账号</div>
          <input type="text" v-model="formData.userName" placeholder="请输入">
        </div>
        <div class="ipt-box" style="margin-top: 28px;">
          <div class="ipt-title">填写密码</div>
          <input :type="passwordShow ? 'text' : 'password'" v-model="formData.passWord" style="width: 283px;"
            placeholder="请输入">
          <img class="icon" :src="passwordShow ? getIcon('eye_active') : getIcon('eye')"
            @click="passwordShow = !passwordShow" alt="">
        </div>
        <div class="ipt-box" style="margin-top: 41px;">
          <div class="ipt-title">验证码</div>
          <input type="text" v-model="formData.code" style="width: 175px;" placeholder="请输入">
          <img :src="'data:image/png;base64,' + codeImg" />

        </div>
        <div class="renew-box" @click="getCode">
          <div>
            换一张，看不清<img src="../../assets/img/login/renew.png" alt="">
          </div>
        </div>
        <div class="option-box">
          <t-checkbox v-model="memoryPassword">记住密码</t-checkbox>
        </div>
        <t-button @click="submitLogin">登录</t-button>
      </div>
    </div>
    <div class="describe-box">
      <p>V2.0.0</p>
      <p>Copyright &nbsp;2023织生科技 All Rights Reserved.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRoleStore } from '../../store/modules/role';
import { login, getInfo, getCodeImg } from '../../request/modules/loginApi';
export default {
  setup() {
    const roleStore = useRoleStore()
    const setAttr = reactive({
      passwordShow: false,
      memoryPassword: false,
      codeImg: '',
      formData: {
        userName: "",
        passWord: "",
        code: "",
        uuid: ''
      }
    })
    onMounted(() => {
      sessionStorage.clear();
      localStorage.clear();
      setAttr.formData.userName = getCookie('username');
      setAttr.formData.passWord = getCookie('password');
      setAttr.memoryPassword = Boolean(getCookie('memoryPassword'));
      getImg()
    })
    const getIcon = (name: string) => {
      return new URL(`../../assets/img/login/${name}.png`, import.meta.url).href;
    }
    //获取验证码
    const getImg = () => {
      getCodeImg().then((res: any) => {
        if (res.code === 200) {
          console.log(res)
          setAttr.codeImg = res.data.verifyImage
          setAttr.formData.uuid = res.data.uuid
        }
      })
    }
    //重新获取验证码
    const getCode = () => {
      getImg()
    }
    const submitLogin = () => {
      // console.log(modules)
      login(setAttr.formData).then((res: any) => {
        if (res.code === 200) {
          // console.log(res)
          localStorage.setItem("x-auth-token", res.data.token)
          reMember(setAttr.memoryPassword)
          getInfo().then((infoRes: any) => {
            if (infoRes.code === 200) {
              roleStore.SetUserInfo(infoRes.data)
              localStorage.setItem("userinfo", JSON.stringify(infoRes.data))
              roleStore.SetRouterList()
            }
          })
        } else {
          getImg()
        }
      })
    }
    const reMember = (remember: boolean) => {
      if (remember) {
        // 使用cookie保存账号和密码
        document.cookie = `username=${setAttr.formData.userName}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        document.cookie = `password=${setAttr.formData.passWord}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        document.cookie = `memoryPassword=${setAttr.memoryPassword}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
      } else {
        // 如果用户不勾选记住密码，则清除cookie或localStorage中的账号和密码
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'memoryPassword=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    }
    const getCookie = (name: string) => {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
          return cookie.substring(name.length + 1);
        }
      }
      return "";
    }
    return {
      ...toRefs(setAttr),
      getIcon,
      submitLogin,
      getImg,
      getCode
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  // width: 100vw;
  height: 100vh;
  background: #F9F9F9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .content-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .left-img {
      width: 542px;
      height: 630px;
      margin-right: 28px;
    }

    .right-box {
      width: 374px;
      height: 508px;
      margin-left: 28px;
      background: #FFFFFF;
      box-shadow: 0px 2px 33px 0px rgba(0, 0, 0, 0.07);
      border-radius: 21px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .zs-log {
        width: 120px;
        height: 44px;
        display: block;
        margin-top: 30px;
      }

      h1 {
        margin-top: 11px;
        font-size: 18px;
        font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
        font-weight: bold;
        color: #222222;
        line-height: 22px;
      }

      .ipt-box {
        width: 311px;
        height: 48px;
        border-radius: 8px;
        border: 1px solid rgba(151, 151, 151, 0.54);
        position: relative;
        display: flex;
        align-items: center;

        .ipt-title {
          width: 58px;
          height: 17px;
          background: #FFFFFF;
          text-align: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #848181;
          line-height: 17px;
          position: absolute;
          left: 17px;
          top: -9px;
        }

        input {
          border: none;
          outline: none;
          width: 300px;
          height: 48px;
          margin-left: 11px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
        }

        .title {
          width: 100px;
          height: 100px;
          border: 1px solid red;
          position: relative;
        }

        .add {
          width: 10px;
          height: 10px;
          border: 1px solid red;
          position: absolute;
          top: 20px;
        }

        .icon {
          width: 16px;
          height: 16px;
          margin-right: 12px;
        }

        img {
          width: 125px;
          height: 48px;
          border-radius: 0 8px 8px 0;
        }
      }

      .renew-box {
        width: 311px;
        height: 14px;
        margin-top: 4px;
        padding-right: 22px;
        text-align: right;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7C7C7C;
        line-height: 14px;
        box-sizing: border-box;

        div {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
        }

        img {
          width: 11px;
          height: 10px;
          margin: 0 2px;
        }
      }

      .option-box {
        width: 311px;
        margin-top: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: bold;
        color: #222222;
        line-height: 17px;
      }

      .t-button {
        width: 311px;
        height: 48px;
        margin-top: 15px;
        background: #1965FF;
        border-radius: 8px;
        font-weight: bold;
        font-size: 17px;
      }
    }
  }

  .describe-box {
    width: 350px;
    height: 44px;
    font-size: 16px;
    text-align: center;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(34, 34, 34, .62);
    line-height: 22px;
    position: absolute;
    left: calc(50% - 175px);
    bottom: 36px;
  }

}
</style>