<script setup>
  import { RouterView } from 'vue-router';
</script>

<!-- <script>
  import { RouterView } from 'vue-router';
  import router from "./router/index";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  
  export default {
    setup() {
      const auth = getAuth();
      onAuthStateChanged(auth, async () => {
        if (auth.currentUser !== null) {
          router.push({
            name: "Login",
            params: {}
          })
        }
      });
    }
  }
</script> -->

<template>
  <div class="app-container h-100">
    <component :is="$route.meta.layout">
      <router-view/>
    </component>
  </div>
</template>

