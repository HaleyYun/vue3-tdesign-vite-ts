import { createApp } from 'vue'
import './style.css' // 清楚默认样式
import './public-stype.css' // 公共样式
import App from './App.vue'
import router from './router'
import './permisstion'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
// 引入数据持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// pinia使用数据持久化插件
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(TDesign)
app.mount('#app')
// 刷新路由丢失问题  ---   注意代码执行过程
import { useRoleStore } from './store/modules/role';
if (localStorage.getItem("x-auth-token")) {
    const roleStore = useRoleStore()
    roleStore.SetRouterList()
}

