<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";

import { formatMoneyChange, convertVN } from "../../composables/convert/convertVN";
import { toastNotification } from "../../components/Notification/index";
import EditVariations from "../../components/Variations/edit.vue";
import ModalCollection from "../../components/Modal/ModalCollection.vue";
import ModalSortImage from "../../components/Modal/ModalSortImage.vue";

import { setupEditor } from "../../components/Tinymce/index";
import Editor from '@tinymce/tinymce-vue';
import { defineComponent, createVNode } from 'vue';
import { 
  CloudUploadOutlined, 
  PlusCircleOutlined, 
  DeleteOutlined, 
  DownOutlined, 
  FolderOpenOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";

import { useUser } from "../../composables/useUser";
import { useStore } from "../../pinia/store";
import useStorage from "../../composables/useStorage";
import { collection, getDocs, getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"; 

export default defineComponent({
  name: "EditProduct",
  components: {
    CloudUploadOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    DownOutlined,
    FolderOpenOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    Modal,
    Editor,
    setupEditor,
    EditVariations,

    ModalCollection,
    ModalSortImage
  },
  setup() {
    return {
      formatMoneyChange,
      convertVN
    }
  },
  data() {
    const { getUser } = useUser();
    const { uidData, uidUser } = getUser();
    const store = useStore();
    const { arrayUrl, onUploadFile } = useStorage("ImageUser");
    return {
      loading: false,
      store,
      onUploadFile,
      db: store.db,
      uidData,
      uidUser,
      name: "",
      slug: "",
      description: "",
      sku: "",
      images: [],
      categories: [],
      options: [],
      price: 0,
      original_price: 0,
      setupEditor,
      uid: this.$route.params.id,
      dataProduct: null,
      variations: [],
      attributes: [],
      quantity: 0,
      is_hidden: true,

      multiple: true,
      dataImage: []
    }
  },
  created() {
    this.getDataProducts();
    this.getDataCategories();
  },
  methods: {
    async getDataProducts() {
      this.loading = true;
      const docRef = doc(this.db, this.uidData + 'Products', `${this.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.dataProduct = docSnap.data();
        console.log('dataProduct', this.dataProduct)
        this.name = this.dataProduct.name;
        this.sku = this.dataProduct.sku;
        this.description = this.dataProduct.description;
        this.slug = this.dataProduct.slug;
        this.categories = this.dataProduct.categories;
        this.store.listFiles = this.dataProduct.images;
        this.quantity = this.dataProduct.quantity;
        this.is_hidden = this.dataProduct.is_hidden;
        this.price = `${this.formatMoneyChange(`${this.dataProduct.price}`)}`;
        this.original_price = `${this.formatMoneyChange(`${this.dataProduct.original_price}`)}`;
        this.variations = this.dataProduct.variations;
        this.attributes = this.dataProduct.attributes;
      } else {
        this.$router.push({
          path: '/dashboard/NotFound'
        })
      }
      this.loading = false;
    },
    async getDataCategories() {
      const data = await getDocs(collection(this.db, this.uidData + "Categories"));
      const task = data.docs.map((doc) => doc.data().name)
      this.options = task.map(i => ({ value: i }));
    },
    async handleCheckSlug(slug) {
      const data = await getDocs(collection(this.db, this.uidData + 'Products'));
      const tasks = data.docs.find((doc) => doc.data().slug === slug);
      if(tasks) {
        toastNotification('error', 'Error', 'Sản phẩm này đã được tạo')
        return
      }
    },
    handleChangeVariations(data) {
      this.variations = data.variations;
      this.attributes = data.attributes;
      this.quantity = data.quantity;
    },
    handleSortImages(data) {
      console.log('data', data)
    },
    handleChangeCategory(value) {
      this.categories = [...value];
    },
    handleChangeName(name) {
      let value = name.target.value;
      this.slug = convertVN(value)
        .replace(/ /g, "-")
        .replace(/_$/g, "")

      this.handleCheckSlug(this.slug);
    },
    handleChangePrice(type) {
      let value = event.target.value;
      const charCode = event.which ? event.which : event.keyCode;

      switch (type) {
        case 'price':
          if(value == "") {
            this.price = "0";
          } else {
            if(charCode > 31 && (charCode < 48 || charCode > 57)) {
              this.price = `${this.formatMoneyChange(`${this.dataProduct.price}`)}`;
            } else {
              this.price = `${this.formatMoneyChange(`${this.price}`)}`
            }
          }
          break;
        case 'original_price':
          if(value == "") {
            this.original_price = "0";
          } else {
            if(charCode > 31 && (charCode < 48 || charCode > 57)) {
              this.original_price = `${this.formatMoneyChange(`${this.dataProduct.original_price}`)}`;
            } else {
              this.original_price = `${this.formatMoneyChange(`${this.original_price}`)}`
            }
          }
          break;
        default:
          break;
      }
    },    
    async handleChangeIsHidden(id) {
      this.is_hidden = !this.is_hidden
      const doneRef = doc(this.db, this.uidData + 'Products', `${id}`)
        await updateDoc(doneRef, {
        "is_hidden": !this.is_hidden
      })
      toastNotification('success', 'Cập nhật thành công', '')
    },
    handleDelete(id) {
      const _this = this;
      Modal.confirm({
        title: "Xoá 1 sản phẩm",
        icon: createVNode(DeleteOutlined),
        content: "Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể được hoàn tác",
        okText: "Đồng ý",
        okType: 'danger',
        cancelText: "Huỷ",
        onOk() {
          deleteDoc(doc(_this.db, _this.uidData + "Products", `${id}`));
          _this.$router.push({
            path: '/dashboard/products'
          })
          toastNotification('success', 'Xoá sản phẩm thành công', '')
        },
      });
    },
    async handleUpProduct() {
      if(this.name == "") {
        toastNotification('error', 'Tạo không thành công', '');
        return;
      } else {
        await updateDoc(doc(this.db, this.uidData + 'Products', `${this.uid}`), {
          name: this.name,
          slug: this.slug,
          description: this.description,
          sku: this.sku,
          categories: this.categories,
          images: await this.onUploadFile(this.store.listFiles, this.uidUser),
          price: Number(this.price.replaceAll(/,/g, '')),
          original_price: Number(this.original_price.replaceAll(/,/g, '')),
          quantity: this.quantity,
          variations: this.variations,
          attributes: this.attributes
        })
        toastNotification('success', 'Cập nhật thành công', '');
      }
    }
  }
})
</script>

<template>
  <div class="collection-container">
    <div class="page-content d-flex align-items-center justify-content-center" style="min-height: 400px;" v-if="this.loading">
      <a-spin tip="Loading..."/>
    </div>
    <div class="page-content" v-else>
      <div class="box-file-created d-flex justify-content-between pb-2" style="border-bottom: 1px solid var(--text-color-gray); margin-bottom: 35px;">
        <div class="box-file-search">
          <h1 class="">{{ this.name }}</h1>
          <div class="title-bar--main__action">
            <div class="d-flex gap-5">
              <div class="action-bar--top__item">
                <div @click="handleChangeIsHidden(this.dataProduct.id)">
                  <div v-if="this.is_hidden" class="d-flex gap-2 align-items-center">
                    <div class="action-icon">
                      <eye-outlined class="text-16"/>
                    </div>
                    <div class="action-title">Hiện</div>
                  </div>
                  <div v-else class="d-flex gap-2 align-items-center">
                    <div class="action-icon">
                      <eye-invisible-outlined class="text-16"/>
                    </div>
                    <div class="action-title">Ẩn</div>
                  </div>
                </div>
              </div>

              <div class="action-bar--top__item d-flex gap-2 align-items-center" @click="handleDelete(this.dataProduct.id)">
                <div class="action-icon">
                  <delete-outlined class="text-16"/>
                </div>
                <div class="action-title">Xoá sản phẩm</div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-file-created-btn">
          <router-link 
            :to="{ name: 'Products', params: {} }"
            class="border-0 cursor-pointer"
          >
            Huỷ
          </router-link>
          <button class="btn-green border-0 cursor-pointer" @click="handleUpProduct()">
            <cloud-upload-outlined class="text-14 mr-1"/>
            Lưu
          </button>
        </div>
      </div>

      <div class="ant-layout-content">
        <a-row>
          <a-col :span="20" class="pr-4" style="border-right: 1px solid #ddd">
            <div class="product-side--wrapper product-side--left">
              <a-space direction="vertical" style="width: 100%" class="mb-4" v-if="!this.is_hidden">
                <a-alert
                  message="Sản phẩm đã ẩn"
                  description="Bạn đã ẩn sản phẩm này."
                  type="warning"
                  show-icon
                />
              </a-space>

              <div class="ant-card ant-card-bordered">
                <div class="ant-collapse-header p-4">
                  <button class="border-0 background-transparent p-0 fw-600">
                    <down-outlined class="mr-2"/>
                    <span>Thông tin cơ bản</span>
                  </button>
                </div>
                <div class="ant-collapse-content">
                  <a-row class="mb-4">
                    <a-col :span="12" class="pr-3">
                      <div class="label-group">
                        <label>Tên sản phẩn</label>
                        <input 
                          v-model="this.name" 
                          @keyup="handleChangeName"
                          class="label-group-input d-block w-full" placeholder="Nhập tên sản phẩm"
                        />
                      </div>
                    </a-col>
                    <a-col :span="12" class="pl-3">
                      <div class="label-group">
                        <label>SKU sản phẩm</label>
                        <input 
                          v-model="this.sku" 
                          class="label-group-input d-block w-full" placeholder="SKU sản phẩm"
                        />
                      </div>
                    </a-col>
                  </a-row>
                  <a-row class="mb-4">
                    <a-col :span="24">
                      <div class="label-group">
                        <label>Mô tả ngắn</label>
                        <editor 
                          v-model="this.description"
                          :api-key="this.setupEditor.apiKey"
                          :init="this.setupEditor.init"
                        />
                      </div>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="24">
                      <div class="label-group">
                        <label>Danh mục</label>
                        <a-select
                          v-model:value="this.categories"
                          :options="this.options"
                          @change="handleChangeCategory"
                          mode="multiple"
                          style="width: 100%; height: 40px;"
                          class="label-group-input d-block w-full"
                          placeholder="Chọn danh mục"
                        >
                        </a-select>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="ant-card ant-card-bordered">
                <div class="ant-collapse-header p-4">
                  <button class="border-0 background-transparent p-0 fw-600">
                    <down-outlined class="mr-2"/>
                    <span>Ảnh sản phẩm</span>
                  </button>
                </div>
                <div class="ant-collapse-content">
                  <div class="label-group">
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

                        <div class="relative group-img">
                          <label for="handleFile" class="cursor-pointer mb-0">
                            <div class="ant-upload-img">
                              <plus-circle-outlined class="text-24" style="color: #1db954"/>
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
                      </div>
                    </div>
                    <div class="btn-sort">
                      <button class="btn-select-album" @click="this.store.showModalCollection">
                        <FolderOpenOutlined class="text-15 mr-2" />
                        <span class="text-14">Tải ảnh từ bộ sưu tập của bạn</span>
                      </button>
                      <button class="btn-select-album ml-4" @click="this.store.showModalSortImg" v-if="this.store.listFiles.length >= 2">
                        <span>Sắp xếp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>  
              <div class="ant-card ant-card-bordered">
                <div class="ant-collapse-header p-4">
                  <button class="border-0 background-transparent p-0 fw-600">
                    <down-outlined class="mr-2"/>
                    <span>Giá sản phẩm</span>
                  </button>
                </div>
                <div class="ant-collapse-content">
                  <div class="label-group">
                    <a-row class="mb-4">
                      <a-col :span="12" class="pr-3">
                        <div class="label-group">
                          <label>Giá bán</label>
                          <div class="relative">
                            <input 
                              v-model="this.price" 
                              @keyup="handleChangePrice('price')" 
                              class="label-group-input d-block w-full"
                              style="padding-left: 30px;"
                              type="text"
                            />
                            <div class="absolute top-0 bottom-0 left-0 h-100 d-flex align-items-center pl-2">
                              (đ)
                            </div>
                          </div>
                        </div>
                      </a-col>
                      <a-col :span="12" class="pl-3">
                        <div class="label-group">
                          <label>Giá gốc sản phẩm</label>
                          <div class="relative">
                            <input 
                              v-model="this.original_price" 
                              @keyup="handleChangePrice('original_price')"  
                              class="label-group-input d-block w-full"
                              style="padding-left: 30px;"
                              type="text"
                            />
                            <div class="absolute top-0 bottom-0 left-0 h-100 d-flex align-items-center pl-2">
                              (đ)
                            </div>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
              <div class="ant-card ant-card-bordered">
                <EditVariations
                  :dataVariations="{
                    name: this.name,
                    price:
                      this.price !== 0 && this.price !== '' && this.price.includes(',')
                      ? parseInt(this.price.replace(/,/g, ''))
                      : parseInt(this.price)
                    ,
                    original_price:
                      this.original_price !== 0 && this.original_price !== '' && this.original_price.includes(',')
                      ? parseInt(this.original_price.replace(/,/g, ''))
                      : parseInt(this.original_price)
                    ,
                    attributes: this.attributes,
                    variations: this.variations,
                    sku: this.sku,
                    id: this.uid,
                    quantity: this.quantity
                  }"
                  @transmissionVariations="handleChangeVariations"
                />
              </div>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="product-side--wrapper product-side--right sticky top-3">
              <div class="ant-anchor-wrapper">
                <div class="ant-anchor relative">
                  <div class="ant-anchor-ink absolute top-0 left-0">
                    <div class="product-side--right__item">
                      <div class="ant-anchor-link ant-anchor-link-active">
                        <a class="ant-anchor-link-title ant-anchor-link-title-active" href="#basicInfo" title="Thông tin cơ bản">
                          Thông tin cơ bản
                        </a>
                      </div>
                    </div>
                    <div class="product-side--right__item">
                      <div class="ant-anchor-link ant-anchor-link-active">
                        <a class="ant-anchor-link-title ant-anchor-link-title-active" href="#images" title="Ảnh sản phẩm">
                          Ảnh sản phẩm
                        </a>
                      </div>
                    </div>
                    <div class="product-side--right__item">
                      <div class="ant-anchor-link ant-anchor-link-active">
                        <a class="ant-anchor-link-title ant-anchor-link-title-active" href="#price" title="Giá sản phẩm">
                          Giá sản phẩm
                        </a>
                      </div>
                    </div>
                    <div class="product-side--right__item">
                      <div class="ant-anchor-link ant-anchor-link-active">
                        <a class="ant-anchor-link-title ant-anchor-link-title-active" href="#variantInfo" title="Thông tin mẫu mã">
                          Thông tin mẫu mã
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    
    <!-- <ModalSortImage
      :listImages="{
        multiple: this.multiple,
        images: this.dataProduct.categories
      }" 
      @sortImages="handleSortImages"
    /> -->
    <ModalCollection
      :multiple = this.multiple
    />
    <ModalSortImage/>
  </div>
</template>

<style scoped>
  .ant-card-bordered {
    margin-bottom: 30px;
  }

  .ant-upload-lists {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
  }

  .cursor-pointer {
    width: 120px;
  }
  .ant-upload-img {
    width: 110px;
    height: 110px;
    border-radius: 6px;
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
    padding: 8px 10px;
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

  .label-group-input.ant-select-multiple div {
    padding: 5px !important;
    border-radius: 4px;
    border: 1px solid #ddd;
    /* height: 40px */
  }
  
  .ant-select-multiple .ant-select-selector::after {
    margin: 6px 0 !important;
  }

  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover,
  .ant-input-affix-wrapper:focus {
    box-shadow: 0 0 0;
    border: 1px solid #1db954;
  }
</style>