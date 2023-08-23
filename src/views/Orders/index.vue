<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";

import { defineComponent } from "vue";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

import { useStore } from "../../pinia/store";
export default defineComponent({
  name: "Orders",
  components: {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
  },
  data() {
    const store = useStore();
    return {
      store,
      dataSort: [],
      loading: false
    }
  },
  methods: {
    handleChangeSearch() {

    }
  }
})
</script>

<template>
  <div class="collection-container">
    <div class="page-content">
      <div class="box-file-title mb-2">
        <h1>{{ $t('Orders') }}</h1>
      </div>

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

      <div class="collection-media-table">
        <div class="media-table-header">
          <div class="media-table-header-left text-16" style="color: var(--text-color-black);">
            {{ $t('Orders') }} 
            <span style="text-transform: lowercase;">{{ this.dataSort.length }} {{ $t('Orders') }}</span>
          </div>
        </div>
        <div class="media-table-body">
          <a-table
            class="table-page-active"
            :data-source="this.dataSort"
            :pagination="false"
            :loading="this.loading"
            :row-key="(record) => record.id"
            bordered
          >
            <a-table-column title="ID">
              <template #default="{ record }">
                <div class="d-flex align-items-center gap-3">
                  <span>{{ record }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="Khách hàng" class="w-20">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Sản phẩm" class="w-20">
              <template #default="{ record }">
                <span>
                  
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Số điện thoại" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Thông tin nhận" class="w-20">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Tạo lúc" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Tổng tiền" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Trạng thái" class="w-20" fixed="true">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
          </a-table>
          <div class="pagination_table">
            <!-- <a-pagination
              v-model:current="this.store.setPageToken.page"
              v-model:pageSize="this.store.setPageToken.limit"
              v-model:total="this.store.countToken"
              @change="changePagination"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
  .box-file-search {
    width: 300px;
  }

  .ant-input-affix-wrapper {
    height: 100%;
    border-radius: 6px;
  }
</style>