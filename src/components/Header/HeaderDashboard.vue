<script>
import "../../sass/dashboard.sass";
import { computed } from "vue";

import { useRoute } from "vue-router";
import { ExportOutlined, MenuFoldOutlined, MenuUnfoldOutlined, } from "@ant-design/icons-vue";

import { useStore } from "../../pinia/store.js";
import { useUser } from "../../composables/useUser.js";

export default {
  name: 'HeaderDashboard',
  components: {
    ExportOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup() {
    const { getUser } = useUser();
    const { user } = getUser();
    const route = useRoute();
    console.log('asdasd', route.meta)
    return {
      user,
      meta: computed(() => route.meta)
    }
  },
  data() {
    const store = useStore();
    return {
      text: "dark",
      store,
      language: window.localStorage.getItem('locale'),
      listLanguage: [
        {
          name: "vi",
          flag: "https://media3.scdn.vn/img4/2020/11_19/cv2cZgOcbETuBnJTMRCq_simg_b5529c_250x250_maxb.jpg",
          label: "Vietnamese",
        },
        {
          name: "en",
          flag: "https://vuongquocanh.com/wp-content/uploads/2018/04/la-co-vuong-quoc-anh.jpg",
          label: "English",
        },
      ]
    };
  },
  methods: {
    changeTheme(checked) {
      this.text = checked ? "1" : "2";
      this.theme = this.theme == "darkMode" ? "" : "darkMode";
      document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("theme", this.theme);
    },
    changeLanguage(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("locale", locale);
      this.language = locale;
    }
  },
};
</script>

<template>
  <div class="d-flex justify-content-between align-items-center w-full">
    <div class="d-flex align-items-center gap-3">
      <button @click="this.store.toggleCollapsed"
        class="hamburger d-flex align-items-center px-0 py-0 border-0 cursor-pointer">
        <menu-fold-outlined class="text-20" style="color: var(--text-color)" v-if="!this.store.collapsedWidth[0].collapsed" />

        <menu-unfold-outlined class="text-20" style="color: var(--text-color)" v-else />
      </button>
      <ul class="d-flex align-items-center gap-2">
        <li>
          <router-link :style="{ color: 'var(--text-color)' }" :to="{ name: 'Dashboard', param: {} }">
            <span>{{ $t('Dashboard') }}</span>
          </router-link>
        </li>
        <li v-if="meta.text != '' " style="color: var(--text-color-gray)">
          /
        </li>
        <li v-if="meta.text != '' ">
          <router-link :style="{ color: 'var(--text-color)' }" :to="{ name: meta.text, param: {} }">
            <span>{{ $t(`${meta.text}`) }}</span>
          </router-link>
        </li>
        <li v-if="meta.children" style="color: var(--text-color-gray)">
          /
        </li>
        <li v-if="meta.children" style="color: var(--text-color-gray)">{{ $t(`${meta.children}`) }}</li>
      </ul>
    </div>
    <div class="d-flex align-items-center gap-2">
      <a-switch :checked="this.text === '1'" checked-children="Dark" un-checked-children="Light"
        v-on:change="changeTheme" />
      <a-dropdown>
        <template #overlay>
          <a-menu v-model="$i18n.locale">
            <a-menu-item v-for="l in listLanguage" :key="l.name" :value="l.name">
              <div @click="changeLanguage(l.name)" class="d-flex align-items-center gap-1">
                <img :src="l.flag" style="width: 24px; height: 24px; border-radius: 50%" />
                <span class="text-15 d-block">{{ l.label }}</span>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
        <div>
          <div class="d-flex align-items-center justify-content-center" v-if="this.language == 'vi'" style="width: 40px">
            <img src="https://media3.scdn.vn/img4/2020/11_19/cv2cZgOcbETuBnJTMRCq_simg_b5529c_250x250_maxb.jpg"
              style="width: 24px; height: 24px; border-radius: 50%" />
          </div>
          <div class="d-flex align-items-center justify-content-center" v-if="this.language == 'en'" style="width: 40px">
            <img src="https://vuongquocanh.com/wp-content/uploads/2018/04/la-co-vuong-quoc-anh.jpg"
              style="width: 24px; height: 24px; border-radius: 50%" />
          </div>
        </div>
      </a-dropdown>
      <div class="data-user" v-if="user">
        <div class="d-flex align-items-center gap-4">
          <div>
            <div class="text-15" style="color: var(--text-color);">{{ user.displayName }}</div>
            <div class="text-13" style="color: var(--text-color);">{{ user.email }}</div>
          </div>
          <router-link :to="{ name: 'Logout', params: {} }">
            <ExportOutlined style="color: var(--text-color)" class="text-18" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
