<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";

import { defineComponent } from "vue";
import { EllipsisOutlined, DeleteOutlined, PictureOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";

import useStorage from "../../composables/useStorage";
import { useUser } from "../../composables/useUser";
import { useStore } from "../../pinia/store";

import {
  getStorage,
  ref,
} from "firebase/storage";
import { toastNotification } from "../../components/Notification";

export default defineComponent({
  components: {
    EllipsisOutlined,
    DeleteOutlined,
    PictureOutlined, 
    VerticalAlignTopOutlined
  },
  data() {
    const { getUser } = useUser();
    const { user, uidUser } = getUser();
    const uidImage = ref(user.value.uid);
    const storage = getStorage();
    const listRef = ref(storage, `ImageUser/${uidImage}`);

    const store = useStore();
    const { arrUrl, onUploadFile } = useStorage("ImageUser");
    return {
      store,
      user,
      storage,
      listRef,
      uidUser,
      imageLocalStorage: window.localStorage.getItem('imageAvt'),
      visible: false,
      loading: false,
      onUploadFile
    };
  },
  created() {
    this.store.fetchDataCollection()
  },
  methods: {
    async handleOk() {
      if (this.store.listFiles)  {
        await this.onUploadFile(this.store.listFiles, this.uidUser);
        this.store.dataCollection = [];
        this.store.fetchDataCollection()
        this.visible = false;
        toastNotification('success', 'Thông báo', 'Thêm ảnh thành công')
      } else {
        this.visible = false;
      }
    },
    showModalUploadImages() {
      this.store.listFiles = []
      this.visible = true;
    }
  }
});
</script>

<template>
  <div class="collection-container">
    <div class="page-content">
      <div class="box-file-title">
        <h1>{{ $t('File Image')}}</h1>
        <p>{{ $t('Set up and manage your photos') }}</p>
      </div>
      <div class="collection-media-table">
        <div class="media-table-header">
          <div class="media-table-header-left text-14 fw-600" style="color: var(--text-color);">{{ $t('All photos') }} <span class="fw-400" style="text-transform: lowercase;">{{ this.store.dataCollection.length }} {{ $t('Photo') }}</span></div>
          <div class="media-table-header-right">
            <div class="header-right">
              <div class="media-header-upload">
                <button @click="showModalUploadImages" style="height: 34px">
                  <VerticalAlignTopOutlined class="color-1db954 text-18 fw-600"/>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="media-table-body d-flex align-items-center justify-content-center" style="min-height: 400px;" v-if="this.loading">
          <a-spin tip="Loading..."/>
        </div>
        <div class="media-table-body" v-else>
          <div class="ant-checkbox-group">
            <div class="box-item" v-for="order in this.store.dataCollection" :key="order.generation">
              <div class="box-item--image relative">
                <img :src="order.url" />
                <div class="com-dropdown absolute top-0 left-0">
                  <a-dropdown>
                    <a class="ant-dropdown-link">
                      <ellipsis-outlined />
                    </a>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item key="1">{{ $t('Look at the photos') }}</a-menu-item>
                        <a-menu-item key="2" @click="this.store.handleCopy(order.url)">{{ $t('Copy URL') }}</a-menu-item>
                        <a-menu-item key="3" style="color: red" @click="this.store.handleDeleteImgModal(order.fullPath, order.url.split('?')[0])">
                          {{ $t('Delete image') }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
              <div class="box-item--info">
                <div class="box-item--info__title">{{ order.name }}</div>
                <div class="box-item--info__detail">
                  {{ `${new Date(order.timeCreated).getDate()}/${new Date(order.timeCreated).getMonth() + 1}/${new Date(order.timeCreated).getFullYear()}` }}
                  / {{ Math.floor(order.size / 1000) }}KB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-modal 
        v-model:visible="this.visible" 
        :title="$t('Upload photos')" 
        @ok="handleOk" 
        :okText="$t('Save')"
        :cancelText="$t('Cancel')"
        class="modal-upload-img"
        width="528px" 
      >
        <a-row>
          <a-col :span="24">
            <div class="ant-upload-select-picture-card">
              <div class="relative mb-4">
                <div v-if="this.store.listFiles != null">
                  <div class="d-inline-block" style="padding: 5px; width: 120px; height: 120px;" v-for="img in this.store.listFiles" :key="img">
                    <img
                      :src="img.image"
                      style="border-radius: 8px; height: 100%; width: 100%; object-fit: contain; border: 1px solid #ddd;"
                    />
                  </div>
                </div>
                <div v-else></div>
              </div>
              <label for="handleFile" class="cursor-pointer">
                <div class="ant-upload-img">
                  <picture-outlined class="mr-2" />
                  {{ $t('Upload photos') }}
                </div>
                <input
                  type="file"
                  multiple
                  class="h-0 w-0 overflow-hidden d-none"
                  id="handleFile"
                  @change="this.store.onChangeFiles"
                />
              </label>
            </div>
          </a-col>
        </a-row>
      </a-modal>
    </div>
  </div>
</template>

<style scoped>
  .ant-modal-body {
    padding: 20px !important;
  }
</style>