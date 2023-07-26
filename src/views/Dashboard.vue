<script>
  import { useUser } from "../composables/useUser.js";

  export default {
    setup() {
      const { getUser } = useUser();
      const { user } = getUser();
      return {
        user
      };
    }
  }
</script>

<template>
  <main>
    <span v-if="user">
      {{ user.displayName }}
    </span>
  </main>
</template>
