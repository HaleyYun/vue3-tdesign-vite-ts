<template>
  <div class="page-view">
    <iframe width="100%" height="100%" :src="viewUrl" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

let estimateNum = ref<string>('');
let archivesNo = ref<string>('');
let type = ref<string>('');
let viewUrl = ref<string>(''); // 'http://localhost:5173/reportRelast?archivesNo=DA20230708121535737447987&checked=true'

estimateNum.value = route.query.estimateNum as string;
archivesNo.value = route.query.archivesNo as string;
type.value = route.query.type as string;
viewUrl.value = import.meta.env.VITE_BASE_IFRAME_URL + '/EvaluationMoca?' + 'estimateNum=' + estimateNum.value

const messageEvent = (e: any) => {
  window.removeEventListener('message', messageEvent);
  console.log('来了来了');

  // 通过origin对消息进行过滤，避免遭到XSS攻击
  if (e.origin === import.meta.env.VITE_BASE_IFRAME_URL) {
    console.log(e.origin); // 子页面所在的域
    console.log(e.data); // 子页面发送的消息, hello, parent!
    if (e.data.code == 'out') {
      console.log('了111');
      router.back();
    }
  }
};
window.addEventListener('message', messageEvent, false);
</script>

<style lang="scss" scoped>
.page-view {
  width: 100vw;
  height: 100vh;
}
</style>
