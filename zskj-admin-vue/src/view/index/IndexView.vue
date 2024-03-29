<template>
  <div class="index-box">
    <div class="left-tab">
      <t-menu expandMutex theme="dark" v-model:value="menuValue" :collapsed="collapsed" @change="menuSelectChange">
        <template #logo v-if="!collapsed">
          <h1 class="logoTitle">运营后台管理系统</h1>
          <!-- <img height="28" src="https://tdesign.gtimg.com/site/baseLogo-dark.png" alt="logo" /> -->
        </template>
        <template v-for="(item, index) in tabList" :key="index">
          <t-menu-item v-if="!item.children || item.children?.length === 1 || item.path === '/screen'" :value="(item.meta!.title as string)" @click="changeTab(item, index)">
            <template #icon>
              <t-icon :name="(item.meta!.icon as string)" />
            </template>
            {{ item.meta!.title }}
          </t-menu-item>
          <t-submenu v-else :value="(item.meta!.title as string)">
            <template #icon>
              <t-icon :name="(item.meta!.icon as string)" />
            </template>
            <template #title>
              <span>{{ item.meta!.title }}</span>
            </template>
            <t-menu-item v-for="(childrenItem, childrenIndex) in item!.children" :key="index" :value="(item.meta!.title as string) + '-' + (childrenItem.meta!.title as string)" @click="changeTab(childrenItem, childrenIndex)">
              <!-- 子项icon -->
              <!-- <template #icon>
                                <t-icon :name="(childrenItem.meta!.icon as string)" />
                            </template> -->
              {{ childrenItem.meta!.title }}
            </t-menu-item>
          </t-submenu>
        </template>
      </t-menu>
    </div>
    <div class="right-content">
      <div class="title-box">
        <div class="title" style="position: relative; display: flex; align-items: center">
          <img class="menu-img" v-if="collapsed" @click="changeCollapsed" src="../../assets/img/index/OpenMenu.png" alt="" />
          <img class="menu-img" v-if="!collapsed" @click="changeCollapsed" src="../../assets/img/index/RetractMenu.png" alt="" />
          <t-breadcrumb :options="breadcrumbOption" />
        </div>
        <div class="user-info">
          <div class="examine" @click="examine" v-if="bell">
            <img src="../../assets/img/index/bell.png" class="bell" alt="" />
            <div class="examine-tips">{{ title }}</div>
          </div>
          <div class="name">{{ nickName }}</div>
          <t-dropdown>
            <img style="width: 40px; height: 40px" src="../../assets/img/index/DefaultImg.png" alt="" />
            <t-dropdown-menu>
              <t-dropdown-item :value="1" @click="userInfo"> <UserIcon /> 个人中心 </t-dropdown-item>
              <t-dropdown-item :value="2" @click="logOunt"> <PoweroffIcon /> 退出登录 </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </div>
      </div>
      <div class="content-box">
        <!-- <loading v-if="show"></loading> -->
        <RouterView class="view-box"></RouterView>
      </div>
    </div>
    <t-drawer v-model:visible="visible" :closeBtn="true" size="medium" v-if="bell">
      <div class="examine-one" v-for="item in pageQueryList" :key="item">
        <div class="examine-title">{{ item.activityName }} {{ item.createTime }}</div>
        <div class="examine-content">
          <div class="examine-text">{{ item.organName }}机构提交了{{ item.activityName }}活动</div>
          <t-button @click="goActiveList"> 去审核 </t-button>
        </div>
      </div>
      <template #header>
        <div>消息通知({{ title }})</div>
      </template>
      <template #footer>
        <t-button variant="text" theme="primary" class="btn-c-blue m-l clear" @click="clear"> 清空通知 </t-button>
      </template>
    </t-drawer>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoleStore } from '../../store/modules/role';
import { SetArrt } from '../types/index';
import { logout } from '../../request/modules/loginApi';
import { RouteRecordRaw } from 'vue-router';
import { MenuValue } from 'tdesign-vue-next';
import { PoweroffIcon, UserIcon } from 'tdesign-icons-vue-next';
import { NotificationIcon } from 'tdesign-icons-vue-next';
import { pageQuery } from '../../request/modules/MarketApi';
// import loading from "../../components/load/loading.vue";

export default {
  components: {
    PoweroffIcon,
    UserIcon,
    NotificationIcon
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const roleState = useRoleStore();
    const setArrt: SetArrt = reactive({
      tabList: [],
      collapsed: false,
      nickName: '',
      menuValue: '',
      breadcrumbOption: [],
      visible: false,
      bell: true,
      title: 0,
      pageQueryList: [],
      timeInter: null //定时器
    });
    onMounted(() => {
      setArrt.tabList = roleState.getRouterList;
      console.log('setArrt.tabList', setArrt.tabList);
      setArrt.nickName = roleState.userInfo.nickName as string;
      menuSelectChange(setArrt.tabList[0].meta!.title as MenuValue);
      if (roleState.userInfo.organizationLevel == 1) {
        setArrt.bell = false;
      } else if (roleState.userInfo.organizationLevel == 2) {
        setArrt.bell = true;
      } else {
        setArrt.bell = false;
      }
      getPageQuery();
      judgment();
    });
    watch(
      () => roleState.userInfo,
      newValue => {
        setArrt.nickName = newValue.nickName as string;
      },
      { deep: true }
    );
    const changeTab = (item: RouteRecordRaw, index: number) => {
      router.push(item.path);
    };
    const getIcon = (name: string) => {
      return new URL(`../../assets/img/index/tab/${name}.png`, import.meta.url).href;
    };
    const changeCollapsed = () => {
      setArrt.collapsed = !setArrt.collapsed;
    };
    const logOunt = () => {
      logout({ token: localStorage.getItem('x-auth-token') }).then((res: any) => {
        if (res.code === 200) {
          console.log(res);
          router.push('/login');
          localStorage.clear();
          sessionStorage.clear();
        }
      });
    };
    const userInfo = () => {
      router.push('/userCenter');
    };
    const menuSelectChange = (value: MenuValue) => {
      setArrt.menuValue = value as string;
      setArrt.breadcrumbOption = [];
      let arr = (value as string).split('-');
      for (let i = 0; i < arr.length; i++) {
        setArrt.breadcrumbOption.push({ content: arr[i] });
      }
    };
    const examine = () => {
      setArrt.visible = true;
      getPageQuery();
    };
    const clear = () => {
      setArrt.pageQueryList = [];
      setArrt.title = 0;
    };
    const goActiveList = () => {
      router.push('/activityList');
      setArrt.visible = false;
    };
    const getPageQuery = () => {
      pageQuery({
        pageNum: 1,
        pageSize: 999,
        parentOrganNum: roleState.userInfo.organizationNum
      }).then((res: any) => {
        setArrt.pageQueryList = res.data.data;
        setArrt.title = res.data.total || 0;
      });
    };
    const judgment = () => {
      if (setArrt.bell) {
        setArrt.timeInter = setInterval(() => {
          getPageQuery();
        }, 30000);
      }
    };
    onUnmounted(() => {
      clearInterval(setArrt.timeInter); //销毁
      setArrt.timeInter = null;
    });
    return {
      ...toRefs(setArrt),
      changeTab,
      getIcon,
      changeCollapsed,
      logOunt,
      userInfo,
      menuSelectChange,
      examine,
      clear,
      getPageQuery,
      goActiveList
    };
  }
};
</script>

<style lang="scss" scoped>
.examine-one {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  .examine-title {
    font-size: 14px;
    color: #2f2f2f;
  }
  .examine-content {
    display: flex;
    .examine-text {
      flex-grow: 1;
    }
  }
}
.t-default-menu.t-menu--dark {
  background: #304156;
}

.t-menu__content {
  color: #1890ff;
}

.t-menu__item .t-is-active .t-submenu__item {
  background-color: #1f2d3d;
}

.logoTitle {
  width: 100%;
  font-size: 20px;
  text-align: center;
  color: #fff;
}
.clear {
  width: 100%;
}
.index-box {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  overflow: hidden;

  .left-tab {
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .picture {
      width: 32px;
      height: 32px;
      margin-top: 10px;
      border-radius: 18px;
      border: 2px #ffffff solid;
    }

    .tab-box {
      width: 100%;
      margin-top: 26px;

      .tab-item {
        height: 45px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c8c9cc;
        line-height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
      }

      .active-item {
        color: #444444;
        background: #f9f9f9;
      }
    }

    .tool {
      width: 92px;
      height: 40px;
      background: #535353;
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      div {
        width: 1px;
        height: 16px;
        background: #ffffff;
        opacity: 0.1;
      }

      img {
        width: 18px;
        height: 18px;
        margin: 0 13px;
      }
    }
  }

  .right-content {
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .title-box {
      flex: 0 0 auto;
      width: 99%;
      height: 56px;
      padding: 0 25px 0 5px;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: inset 0px -1px 0px 0px rgba(235, 237, 240, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .menu-img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }

      b {
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #222222;
      }

      .user-info {
        // width: 180px;
        height: 30px;
        line-height: 30px;
        color: #222;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .examine {
          margin-right: 20px;
          position: relative;
          padding-top: 12px;
          box-sizing: border-box;
          cursor: pointer;
          .bell {
            width: 22px;
            height: 22px;
          }
          .examine-tips {
            width: 20px;
            height: 16px;
            border-radius: 8px;
            background-color: red;
            color: white;
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            top: 8px;
            right: -12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .name {
          margin-right: 15px;
        }
      }

      span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #222222;
      }
    }

    .navigation-box {
      flex: 0 0 auto;
      width: calc(100% - 32px);
      height: 56px;
      margin: 16px 0;
      padding: 0 16px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 12px;
      display: flex;
      align-items: center;
    }

    .content-box {
      width: 100%;
      flex: 1;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      align-items: start;
      overflow: hidden;
      background: #f9f9f9;

      .view-box {
        flex: 1;
        height: 100%;
        // padding: 14px;
        box-sizing: border-box;
        border-radius: 10px;
      }
    }
  }
}
</style>

<style>
/* 自定义面包屑样式 */
.t-breadcrumb--text-overflow .t-breadcrumb__inner-text {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  line-height: 24px;
}

.t-default-menu.t-menu--dark .t-menu__item {
  font-size: 14px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #ffffff;
  line-height: 20px;
}

.t-default-menu.t-menu--dark .t-menu__item.t-is-active:not(.t-is-opened) {
  background: linear-gradient(123deg, #2543ff 0%, #0c83ee 100%);
}

.t-default-menu__inner {
  background-color: rgb(52, 65, 103);
}

.t-default-menu__inner .t-menu {
  padding: 0;
}

.t-default-menu .t-is-opened {
  background-color: #151f3b;
  padding: 10px;
}

.t-dropdown__menu .t-dropdown__item--theme-default:hover {
  background-color: #3d7eff !important;
  color: #ffffff !important;
}
</style>
