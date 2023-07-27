<script>
import "ant-design-vue/dist/antd.css";
import "../../sass/Login.sass";
import { ref } from "vue";
import router from "../../router/index.js";

import { useSignIn } from "../../composables/useSignIn.js";

export default {
  setup() {
    const { error, isPending, signIn } = useSignIn();
    const email = ref("");
    const password = ref("");
    async function handleSubmit() {
      await signIn(email.value, password.value);
      if(!error.value) router.push({ name: "Dashboard", params: {} });
    }

    return {
      email,
      password,
      error,
      isPending,
      handleSubmit,
    };
  },
};
</script>

<template>
  <div class="h-full bg-2d3a4b form-login">
    <div
      class="max-w-35 mx-auto my-auto translate-y-3/4 flex items-center justify-center p-4 rounded-md"
    >
      <div class="max-w-md w-full">
        <div class="mb-6">
          <h2 class="text-center mb-4 font-extrabold">Đăng nhập</h2>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="rounded-md">
            <div class="mb-3">
              <label for="email">
                <span>Email <span style="color: red">*</span></span>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  autocomplete="username"
                  v-model="email"
                />
              </label>
            </div>
            <div class="mb-3">
              <label for="password">
                <span>Mật khẩu <span style="color: red">*</span></span>
                <input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu"
                  autocomplete="current-password"
                  v-model="password"
                />
              </label>
            </div>
          </div>
          <div class="mt-1">
            <div class="d-flex align-items-center justify-content-between">
              <div class="color-white">Quên mật khẩu</div>
              <router-link :to="{ name: 'Register', params: {} }">
                Đăng nhập ngay bây giờ
              </router-link>
            </div>
          </div>
          <div class="mt-3">
            <button
              v-if="!isPending"
              type="submit"
              class="cursor-pointer group w-full py-1 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-indigo-500"
            >
              Đăng nhập
            </button>
            <button
              v-else
              type="button"
              class="cursor-not-allowd group w-full py-1 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-indigo-500"
              disabled
            >
              Loading...
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
