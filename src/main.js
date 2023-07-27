import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './sass/main.sass';
import router from './router/index.js';
import { projectAuth } from "./firebase";

import i18n from './composables/i18n';

const pinia = createPinia();
let apps;
projectAuth.onAuthStateChanged(() => {
  if(!apps) {
    apps = createApp(App)
    apps.use(Antd)
    apps.use(router)
    apps.use(pinia)

    apps.use(i18n)

    apps.mount('#app');
  }
})
