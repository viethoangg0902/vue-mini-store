<script>
import "../sass/dashboard.sass";
import "../sass/collection.sass";
import "../sass/main.sass";

import { ref } from "vue";
import HeaderDashboard from "../components/Header/HeaderDashboard.vue";
import Navbar from "../components/Navbar/index.vue";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Avatar } from "ant-design-vue";
import { useStore } from "../pinia/store";

export default {
  name: "layoutDashboard",
  components: {
    HeaderDashboard,
    Navbar,
    Avatar,
  },
  setup() {
    const store = useStore();
    const auth = getAuth();
    let currentUser = ref("");
    onAuthStateChanged(auth, async () => {
      if (auth.currentUser !== null) currentUser.value = auth.currentUser;
    });
    
    return {
      store,
      currentUser
    };
  }
};
</script>

<template>
  <div class="d-flex h-100 relative">
    <div
      class="dashboard-navbar"
      :style="{ width: this.store.collapsedWidth[0].width + 'px' }"
      :class="{ 
        openSidebar: !this.store.collapsedWidth[0].collapsed, 
        hideSidebar: this.store.collapsedWidth[0].collapsed, 
      }"
    >
      <div class="logo-app my-3">
        <div class="d-flex align-items-center justify-content-center">
          <Avatar
            :src="currentUser.photoURL"
            :size="this.store.collapsedWidth[0].collapsed ? 44 : 84"
          />
        </div>
      </div>
      <div class="dashboard-menu">
        <Navbar/>
      </div>
    </div>
    <div
      class="dashboard-content absolute right-0"
      :style="{
        width: `calc(100% - ${this.store.collapsedWidth[0].width}px)`,
        marginLeft: `${this.store.collapsedWidth[0].width}px`
      }"
      style="transition: width 0.28s; height: calc(100% - 61px);"
    >
      <div class="header-container sticky top-0" style="width: 100%">
        <div class="main-header">
          <HeaderDashboard />
        </div>
      </div>
      <div class="dashboard-main h-100" style="overflow: auto; background: var(--bg-main-dashboard)">
        <div class="content-container h-100">
          <slot />

        </div>
      </div>
    </div>
  </div>
</template>
