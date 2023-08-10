<script setup>
  import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container h-100">
    <component :is="$route.meta.layout">
      <router-view/>
    </component>
  </div>
</template>

