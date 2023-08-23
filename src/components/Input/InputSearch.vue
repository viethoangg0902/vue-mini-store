<script>

import { defineComponent } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useStore } from "../../pinia/store";
export default defineComponent({
  data() {
    const store = useStore();
    return {
      store
    }
  },
  methods: {
    handleChangeSearch(e) {
      let keyword = e.target.value;
      this.dataSort = this.dataTable.filter(task => !keyword || task.name.toLowerCase().includes(keyword));
    }
  }
})
</script>

<template>
  <div class="box-file-created d-flex justify-content-between mb-4">
    <div class="box-file-search">
      <a-input placeholder="Tên / Số điện thoại" @keyup="handleChangeSearch">
        <template #prefix>
          <search-outlined class="text-18"/>
        </template>
      </a-input>
    </div>
    <div class="box-file-created-btn">
      <button class="btn-green border-0 cursor-pointer" @click="this.store.handleNew('Create Orders')">
        <plus-outlined class="text-15" />
        {{ $t('Create new') }}
      </button>
    </div>
  </div>
</template>