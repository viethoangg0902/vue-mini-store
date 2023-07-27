<script>
  import { useRouter } from "vue-router";
  import { useLogout } from "../../composables/useLogout.js";
  export default {
    setup() {
      const router = useRouter();
      const { error, logOut } = useLogout();

      async function logoutUser() {
        window.localStorage.removeItem('collapsed')
        window.localStorage.removeItem('locale')
        window.localStorage.removeItem('imageAvt')
        window.localStorage.removeItem('uidCategory')
        await logOut();
        if(!error.value) router.push({ name: "Login", params: {}})
      }

      logoutUser()
    }
  }
</script>

<template>
  Page Logout
</template>