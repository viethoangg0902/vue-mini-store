<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";
import { convertVN } from "../../composables/convert/convertVN";
import { toastNotification } from "../../components/Notification/index";

import { setupEditor } from "../../components/Tinymce/index";
import Editor from '@tinymce/tinymce-vue';
import { defineComponent } from "vue";
import { PlusOutlined, PlusCircleOutlined, DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons-vue";

import { useUser } from "../../composables/useUser";
import { useStore } from "../../pinia/store";
import useStorage from "../../composables/useStorage";
import { collection, setDoc, doc, getDocs } from "firebase/firestore"; 

import ModalCollection from "../../components/Modal/ModalCollection.vue";

export default defineComponent({
  components: {
    PlusOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    FolderOpenOutlined,
    'editor': Editor,
    setupEditor,
    ModalCollection
  },
  data() {
    const { getUser } = useUser();
    const { uidData, uidUser } = getUser();
    const store = useStore();
    const { arrayUrl, onUploadFile } = useStorage("ImageUser");
    return {
      store,
      // uploadFile,
      onUploadFile,
      db: store.db,
      uidData,
      uidUser,
      name: "",
      description: "",
      slug: "",
      uid: "",
      setupEditor,
      multiple: false
    }
  },
  created() {
    this.uid = this.store.randomID();
    this.store.listFiles = [];
  },
  methods: {
    async handleCheckSlug(slug) {
      const data = await getDocs(collection(this.db, this.uidData + 'Categories'));
      const tasks = data.docs.find((doc) => doc.data().slug === slug);
      if(tasks) {
        toastNotification('error', 'Error', 'Danh mục này đã được tạo')
        return
      }
    },
    handleChangeName(name) {
      let value = name.target.value;
      this.slug = convertVN(value)
        .replace(/ /g, "-")
        .replace(/_$/g, "")

      this.handleCheckSlug(this.slug);
    },
    async handleNewCategory() {
      if(this.name == "") {
        toastNotification('error', 'Tạo không thành công', '');
        return;
      } else {
        await setDoc(doc(this.db, this.uidData + 'Categories', `${this.uid}`), {
          name: this.name.charAt(0).toUpperCase() + this.name.slice(1), 
          id: this.uid,
          is_hidden: true,
          description: this.description,
          images: await this.onUploadFile(this.store.listFiles, this.uidUser),
          slug: this.slug,
          total_products: 0
        })
      }
      toastNotification('success', 'Thêm danh mục thành công', '');
      this.$router.push({
        name: this.$route.meta.text,
        params: {}
      })
    }
  }
})
</script>

<template>
  <div class="collection-container">
    <div class="page-content">
      <div class="box-file-created d-flex justify-content-between mb-4">
        <div class="box-file-search"></div>
        <div class="box-file-created-btn">
          <router-link 
            :to="{ name: 'Category', params: {} }"
            class="border-0 cursor-pointer"
          >
            {{ $t('Cancel') }}
          </router-link>
          <button class="btn-green border-0 cursor-pointer" @click="handleNewCategory()">
            <plus-outlined class="text-15" />
            {{ $t('Create new') }}
          </button>
        </div>
      </div>
      <div class="cant-layout-content">
        <a-row>
          <a-col :span="20" class="pr-4">
            <div class="ant-card ant-card-bordered">
              <div class="label-group mb-5">
                <label>{{ $t('Category name') }}</label>
                <input 
                  v-model="this.name" 
                  @keyup="handleChangeName"
                  class="label-group-input d-block w-full" placeholder="Nhập tên danh mục"
                />
              </div>
              <div class="mb-4">
                <div class="label-group mb-3">
                  <label>{{ $t('Image') }}</label>
                  <div class="upload-image-custom mb-4">
                    <div class="ant-upload-lists w-full">
                      <div class="relative group-img" v-for="img in this.store.listFiles" :key="img">
                        <button class="absolute cursor-pointe" @click="this.store.onDeleteItemImg(img.blob ? img.image : img)">
                          <delete-outlined class="text-13"/>
                        </button>
                        <div class="cursor-pointer">
                          <div class="ant-upload-img">
                            <img
                              :src="img.blob ? img.image : img"
                              width="140"
                              height="140"
                              style="border-radius: 6px; width: 100%; height: 100%; object-fit: contain;"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="relative group-img" v-if="this.store.listFiles.length < 1">
                        <label for="handleFile" class="cursor-pointer mb-0">
                          <div class="ant-upload-img">
                            <plus-circle-outlined class="text-24" style="color: #1db954"/>
                          </div>
                          <input
                            type="file"
                            class="h-0 w-0 overflow-hidden d-none"
                            id="handleFile"
                            @change="this.store.onChangeFiles"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="btn-sort" v-if="this.store.listFiles.length < 1">
                  <button class="btn-select-album" @click="this.store.showModalCollection">
                    <FolderOpenOutlined class="text-15 mr-2" />
                    <span class="text-14">{{ $t('Get photos from your collection') }}</span>
                  </button>
                </div>
              </div>
              <div class="label-group">
                <label>{{ $t('Short description') }}</label>
                <editor 
                  v-model="this.description"
                  :api-key="this.setupEditor.apiKey"
                  :init="this.setupEditor.init"
                />
              </div>
            </div>  
          </a-col>
          <a-col :span="4">
            <div class="ant-card ant-card-bordered">
              <div class="label-group mb-4">
                <label>{{ $t('Default path') }}</label>
                <input 
                  v-model="this.slug" 
                  class="label-group-input d-block w-full" placeholder="Nhập đường dẫn" disabled/>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>

  <ModalCollection
    :multiple = this.multiple
  />
</template>

<style scoped lang="css">
  .ant-card-bordered {
    padding: 20px;
  }

  .cursor-pointer {
    width: 120px;
  }
  .ant-upload-img {
    width: 110px;
    height: 110px;
    border-radius: 4px;
    padding: 1px;
    border: 1px dashed #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .group-img button {
    top: -6px;
    left: -10px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #ddd;
  }

  .label-group input {
    outline: none;
    /* height: 40px; */
    padding: 8px 10px !important;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .label-group input:focus {
    border: 1px solid #1db954;
  }

  .label-group label {
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    display: block;
  }
</style>