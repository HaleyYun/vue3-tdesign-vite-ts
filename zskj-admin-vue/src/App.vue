<script setup lang="ts">
import { RouterView } from 'vue-router';
import { API_URL } from './request/config';
// import 'sendbeacon-polyfill';
window._AMapSecurityConfig = {
  securityJsCode: 'b1c0cd94d014199ce9a50fa623de3367'
};

// 监听浏览器区分页面关闭或刷新
let beforeTime = 0,
  leaveTime = 0;
window.onunload = async () => {
  leaveTime = new Date().getTime() - beforeTime;
  if (leaveTime <= 5) {
    console.log('====关闭=====');
    let data = new FormData();
    data.append('token', localStorage.getItem('x-auth-token') || '');
    navigator.sendBeacon(API_URL + '/zskj/admin/closeLoginOut', data);
    localStorage.clear();
    sessionStorage.clear();
  } else {
    console.log('====刷新=====');
  }
};

// window.onunload = async () => {
//   leaveTime = new Date().getTime() - beforeTime;
//   if (leaveTime <= 5) {
//     console.log("====关闭=====");
//     if (navigator.sendBeacon) {
//       // 使用原生 sendBeacon 方法发送请求（如果浏览器支持）
//       let data = new FormData;
//       data.append('token', localStorage.getItem('x-auth-token') || '');
//       navigator.sendBeacon(API_URL + '/zskj/admin/closeLoginOut', data);
//     } else {
//       // 使用 polyfill 发送请求（在不支持原生 sendBeacon 的浏览器中）
//       let data = { token: localStorage.getItem('x-auth-token') || '' }
//       const xhr = new XMLHttpRequest();
//       xhr.open('POST', API_URL + '/zskj/admin/closeLoginOut', false);
//       xhr.setRequestHeader('Content-Type', 'application/json');
//       xhr.send(JSON.stringify(data));
//     }
//     localStorage.clear();
//     sessionStorage.clear();
//   } else {
//     console.log("====刷新=====");
//   }
// };

window.onbeforeunload = () => {
  beforeTime = new Date().getTime();
};
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped lang="scss"></style>

<style>
/* 全局样式污染改变全局表格样式 */
.t-table .t-table__content .t-table--layout-auto .t-table__header tr {
  background-color: #fafbfd;
}

.t-table .t-table__content .t-table--layout-auto .t-table__header tr th {
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #222222;
}

.t-table .t-table__content .t-table--layout-auto .t-table__body tr td {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #686868;
  line-height: 20px;
  border-bottom: 1px solid #f0f2f5;
}

.t-table .t-table__content .t-table--layout-auto {
  border-collapse: unset;
}

.t-pagination {
  margin-top: 15px !important;
}

.t-pagination .t-pagination__total {
  flex: none !important;
  padding-right: 20px;
}

/* 定义滚动条的样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* 定义滚动条轨道的样式 */
::-webkit-scrollbar-track {
  background-color: rgba(216, 216, 216, 0.23);
  border-radius: 5px;
}

/* 定义滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
  background-color: rgba(216, 216, 216, 1);
  border-radius: 5px;
}

/* 定义滚动条滑块在 hover 状态下的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(216, 216, 216, 1);
}
</style>
