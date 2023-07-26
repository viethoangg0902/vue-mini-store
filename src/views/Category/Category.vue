<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";

import { defineComponent, createVNode } from "vue";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";

import { useUser } from "../../composables/useUser";
import { useStore } from "../../pinia/store";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { toastNotification } from "../../components/Notification";
export default defineComponent({
  components: {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    Modal
  },
  data() {
    const { getUser } = useUser();
    const { uidData } = getUser();
    const store = useStore();
    return {
      dataCategory: "",
      dataTable: [],
      loading: false,
      store,
      db: store.db,
      uidData
    }
  },
  created() {
    this.dataCategory = collection(this.db, this.uidData + "Categories")
    this.getDataCategories();
  },
  methods: {
    async getDataCategories() {
      this.loading = true;
      const data = await getDocs(this.dataCategory);
      const task = data.docs.map((doc) => doc.data())
      this.dataTable = task;
      this.loading = false;
    },
    async handleChangeIsHidden(id, status) {
      const index = this.dataTable.findIndex(task => task.id === id)
      if(index !== -1) {
        const doneRef = doc(this.db, this.uidData + 'Categories', `${id}`)
        await updateDoc(doneRef, {
          "is_hidden": !status
        })
        toastNotification('success', 'Cập nhật thành công', '')
      }
    },
    handleClickEdit(id) {
      this.$router.push({
        name: "Edit Category",
        params: {
          id: id
        }
      })
    },
    async handleDelete(id) {
      const _this = this;
      Modal.confirm({
        title: "Xoá 1 danh mục",
        icon: createVNode(DeleteOutlined),
        content: "Bạn có chắc chắn muốn xoá danh mục này không? Hành động này không thể được hoàn tác",
        okText: "Đồng ý",
        okType: 'danger',
        cancelText: "Huỷ",
        async onOk() {
          await deleteDoc(doc(_this.db, _this.uidData + "Categories", `${id}`));
          _this.getDataCategories();
          toastNotification('success', 'Xoá danh mục thành công', '')
        },
      });
    }
  }
})
</script>

<template>
  <div class="collection-container">
    <div class="page-content">
      <div class="box-file-title">
        <h1>Danh mục</h1>
        <p>Cho phép tạo danh mục sản phẩm hoặc nhóm các sản phẩm</p>
      </div>
      <div class="box-file-created d-flex justify-content-between mb-4">
        <div class="box-file-search">asd</div>
        <div class="box-file-created-btn">
          <button class="btn-green border-0 cursor-pointer" @click="this.store.handleNew('Create Category')">
            <plus-outlined class="text-15" />
            Tạo mới
          </button>
        </div>
      </div>
      <div class="collection-media-table">
        <div class="media-table-header">
          <div class="media-table-header-left text-16" style="color: var(--text-color-black);">
            Danh mục <span>{{ this.dataTable.length }} danh mục</span>
          </div>
          <div class="media-table-header-right">
            <div class="header-right">
              <div class="media-header-upload">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M6.88736 9.65749C6.90072 9.67456 6.9178 9.68837 6.93729 9.69787C6.95678 9.70736 6.97818 9.7123 6.99986 9.7123C7.02154 9.7123 7.04294 9.70736 7.06243 9.69787C7.08192 9.68837 7.099 9.67456 7.11236 9.65749L9.11236 7.12713C9.18558 7.03427 9.1195 6.89677 8.99986 6.89677H7.67665V0.853917C7.67665 0.775345 7.61236 0.71106 7.53379 0.71106H6.46236C6.38379 0.71106 6.3195 0.775345 6.3195 0.853917V6.89499H4.99986C4.88022 6.89499 4.81415 7.03249 4.88736 7.12535L6.88736 9.65749ZM13.5356 9.03249H12.4641C12.3856 9.03249 12.3213 9.09677 12.3213 9.17534V11.9253H1.67843V9.17534C1.67843 9.09677 1.61415 9.03249 1.53557 9.03249H0.464146C0.385575 9.03249 0.321289 9.09677 0.321289 9.17534V12.7111C0.321289 13.0271 0.576646 13.2825 0.892718 13.2825H13.107C13.4231 13.2825 13.6784 13.0271 13.6784 12.7111V9.17534C13.6784 9.09677 13.6141 9.03249 13.5356 9.03249Z"
                      fill="#262626"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="media-table-body">
          <a-table
            class="table-page-active"
            :data-source="this.dataTable"
            :pagination="false"
            :loading="this.loading"
            bordered
          >
            <a-table-column title="Tên danh mục">
              <template #default="{ record }">
                <div class="d-flex align-items-center gap-3">
                  <div class="product-image">
                    <img :src="record.image != '' ? record.image : this.store.NotImage"/>
                  </div>
                  <span>{{ record.name }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="Số lượng sản phẩm" class="w-15">
              <template #default="{ record }">
                <span>
                  {{ record.total_products }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Trạng thái" class="w-15">
              <template #default="{ record }">
                <span>
                  <a-switch v-model:checked="record.is_hidden" @change="handleChangeIsHidden(record.id, !record.is_hidden)"/>
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Hành động" class="w-15">
              <template #default="{ record }">
                <div class="btn-act">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>Chỉnh sửa</span>
                    </template>
                    <button class="border-0 mx-2 background-transparent cursor-pointer" @click="handleClickEdit(record.id)">
                      <edit-outlined class="text-18"/>
                    </button>
                  </a-tooltip>
                  <a-tooltip placement="top">
                    <template #title>
                      <span>Xoá danh mục</span>
                    </template>
                    <button class="border-0 mx-2 background-transparent cursor-pointer" @click="handleDelete(record.id)">
                      <delete-outlined class="text-18"/>
                    </button>
                  </a-tooltip>
                </div>
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