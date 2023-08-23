<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";
import { formatMoney } from "../../composables/convert/convertVN";
import { toastNotification } from "../../components/Notification";
import ModalDeleteAll from "../../components/Modal/ModalDeleteAll.vue";
import ModalExportProduct from "../../components/Modal/ModalExportProduct.vue";
import ModalImportProduct from "../../components/Modal/ModalImportProduct.vue";

import { defineComponent, createVNode } from "vue";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";

import { useUser } from "../../composables/useUser";
import { useStore } from "../../pinia/store";
import { collection, getDocs, setDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
export default defineComponent({
  name: "Products",
  components: {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    Modal,
    ModalDeleteAll,
    ModalExportProduct,
    ModalImportProduct
  },
  setup(){
    return {
      formatMoney
    }
  },
  data() {
    const { getUser } = useUser();
    const { uidData } = getUser();
    const store = useStore();
    return {
      dataProduct: "",
      dataTable: [],
      store,
      db: store.db,
      uidData,
      dataSort: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    this.dataProduct = collection(this.db, this.uidData + "Products")
    this.getDataProducts();
  },
  methods: {
    async getDataProducts() {
      this.loading = true;
      const data = await getDocs(this.dataProduct);
      const task = data.docs.map((doc) => doc.data())
      this.dataTable = task;
      this.dataSort = task;
      this.loading = false;
    },
    async handleChangeIsHidden(id, status) {
      const index = this.dataTable.findIndex(task => task.id === id)
      if(index !== -1) {
        const doneRef = doc(this.db, this.uidData + 'Products', `${id}`)
        await updateDoc(doneRef, {
          "is_hidden": !status
        })
        toastNotification('success', 'Cập nhật thành công', '')
      }
    },
    handleClickEdit(id) {
      this.$router.push({
        name: "Edit Product",
        params: {
          id: id
        }
      })
    },
    async handleDelete(id) {
      const _this = this;
      Modal.confirm({
        title: "Xoá 1 sản phẩm",
        icon: createVNode(DeleteOutlined),
        content: "Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể được hoàn tác",
        okText: "Đồng ý",
        okType: 'danger',
        cancelText: "Huỷ",
        async onOk() {
          await deleteDoc(doc(_this.db, _this.uidData + "Products", `${id}`));
          _this.getDataProducts();
          toastNotification('success', 'Xoá sản phẩm thành công', '')
        },
      });
    },
    handleChangeSelect(e) {
      const value = Number(e.target.value)
      this.dataSort = this.dataTable.filter(task => {
        if(value === -1) {
          return true;
        }
        else {
          return task.is_hidden === (value === 1 ? false : true);
        }
      })
    },
    handleChangeSearch(e) {
      let keyword = e.target.value;
      this.dataSort = this.dataTable.filter(task => !keyword || task.name.toLowerCase().includes(keyword));
    },
    async handleImportProduct(data) {
      this.dataSort = [...this.dataSort, ...data];
      this.dataTable = [...this.dataTable, ...data];
      await data.map(el => {
        setDoc(doc(this.db, this.uidData + 'Products', `${el.id}`), el)
      })
      toastNotification('success', 'Nhập file excel thành công', '')
    },
    handleDeleteAll(data) {
      console.log('data', data)
      this.dataSort = [...data];
      this.dataTable = [...data];
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows;
      this.selectedRowKeys = selectedRowKeys;
    }
  }
})
</script>

<template>
  <div class="collection-container">
    <div class="page-content">
      <div class="box-file-title">
        <h1>{{ $t('All products') }}</h1>
        <p>{{ $t('Page for adding or editing products, managing and composing content displayed on product pages') }}</p>
      </div>
      <div class="box-file-created d-flex justify-content-between mb-4">
        <div class="box-file-search">
          <a-input placeholder="Tìm kiếm" @keyup="handleChangeSearch">
            <template #prefix>
              <search-outlined class="text-18"/>
            </template>
          </a-input>
        </div>
        <div class="box-file-created-btn">
          <button class="btn-green border-0 cursor-pointer" @click="this.store.handleNew('Create Product')">
            <plus-outlined class="text-15" />
            {{ $t('Create new') }}
          </button>
        </div>
      </div>
      <div class="collection-media-table">
        <div class="media-table-header">
          <div class="media-table-header-left text-16" style="color: var(--text-color-black)">
            {{ $t('Products') }} 
            <span style="text-transform: lowercase;">{{ this.dataSort.length }} {{ $t('Products') }}</span>
            <span style="text-transform: lowercase; background-color: #FFFAEB; color: #DC6803; border: 1px solid #DC6803" v-if="this.selectedRowKeys.length != 0"> 
              {{ this.selectedRowKeys.length }} {{ $t('Selected') }}
            </span>
          </div>
          <div class="media-table-header-right">
            <div class="header-right">
              <div class="media-header-upload d-flex gap-4">
                <ModalDeleteAll 
                  :data="
                    {
                      selectedRows: this.selectedRows,
                      selectedRowKeys: this.selectedRowKeys,
                      uidData: this.uidData,
                      dataSort: this.dataSort,
                      title: 'sản phẩm',
                      nameOption: 'Products'
                    } 
                  "
                  @isHandleDeleteAll="handleDeleteAll"
                  v-if="this.selectedRowKeys.length != 0"
                />
                <ModalExportProduct :dataTable="this.dataTable" v-if="this.dataTable.length != 0"/>
                <ModalImportProduct 
                  @isHandleImportProduct="handleImportProduct"
                  :uidData="uidData"
                />
                <div class="media-header-upload-select">
                  <select @change="handleChangeSelect" class="rounded-md">
                    <option value="-1">{{ $t('All') }}</option>
                    <option value="0">{{ $t('Visible') }}</option>
                    <option value="1">{{ $t('Hidden') }}</option>
                  </select>
                </div>
              </div>
            </div>
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

            :rowSelection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              hideDefaultSelections: false,
              selections: false,
            }"
          >
            <a-table-column :title="$t('Product name')">
              <template #default="{ record }">
                <div class="d-flex align-items-center gap-3">
                  <div class="product-image">
                    <img :src="record.images.length != 0 ? record.images[0] : this.store.NotImage"/>
                  </div>
                  <span>{{ record.name }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column :title="$t('SKU')" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ record.sku }}
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Price')" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ this.formatMoney(record.price) }} (đ)
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Original price')" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ this.formatMoney(record.original_price) }} (đ)
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Quantity')" class="w-10">
              <template #default="{ record }">
                <span>
                  {{ record.quantity }}
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Status')" class="w-10">
              <template #default="{ record }">
                <span>
                  <a-switch v-model:checked="record.is_hidden" @change="handleChangeIsHidden(record.id, !record.is_hidden)"/>
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Action')" class="w-15">
              <template #default="{ record }">
                <div class="btn-act">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>{{ $t('Edit') }}</span>
                    </template>
                    <button class="border-0 mx-2 background-transparent cursor-pointer" @click="handleClickEdit(record.id)">
                      <edit-outlined class="text-18"/>
                    </button>
                  </a-tooltip>
                  <a-tooltip placement="top">
                    <template #title>
                      <span>{{ $t('Delete product') }}</span>
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

<style scoped lang="css">
  .box-file-search {
    width: 300px;
  }
  .ant-input-affix-wrapper {
    height: 100%;
    border-radius: 6px;
  }

  .media-header-upload-select select {
    height: 34px;
    padding: 0 10px;
    outline: none;
    border: 1px solid #ddd;
  }
</style>