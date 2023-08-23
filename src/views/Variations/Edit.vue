<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";

import ModalCollection from "../../components/Modal/ModalCollection.vue";

import { formatMoneyChange } from "../../composables/convert/convertVN";
import { CloudUploadOutlined, DeleteOutlined, PlusCircleOutlined, FolderOpenOutlined } from "@ant-design/icons-vue";
import { getDoc, doc, updateDoc } from "firebase/firestore"; 
import useStorage from "../../composables/useStorage";

import InputPrice from "../../components/Input/InputPrice.vue";

import { useUser } from "../../composables/useUser";
import { useStore } from "../../pinia/store";
import { toastNotification } from "../../components/Notification";
export default {
  name: "EditVariation",
  components: {
    CloudUploadOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    FolderOpenOutlined,
    InputPrice,
    ModalCollection
  },
  setup() {
    return {
      formatMoneyChange
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
      idVariat: this.$router.currentRoute.value.params.idVariation,
      uidData,
      uidUser,
      uid: this.$route.params.id,
      data: null,
      listVariat: [],
      dataVariat: [],
      price: 0,
      original_price: 0,
      properties: [],
      sku: "",
      remain_quantity: 0,
      is_remain_quantity: 0,
      images: [],
      quantity: 0,
      multiple: true
    }
  }, 
  created() {
    this.getDataVariation(this.idVariat);
  },
  methods: {
    async getDataVariation(id) {
      this.idVariat = id;
      this.loading = true;
      const docRef = doc(this.db, this.uidData + 'Products', `${this.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.data = docSnap.data();
        this.quantity = this.data.quantity;
        this.listVariat = this.data.variations;
        this.dataVariat = this.listVariat.filter(el => el.id == this.idVariat)
        this.price = `${this.formatMoneyChange(`${this.dataVariat[0].price}`)}`;
        this.original_price = `${this.formatMoneyChange(`${this.dataVariat[0].original_price}`)}`;
        this.properties = this.dataVariat[0].properties;
        this.sku = this.dataVariat[0].sku;
        this.is_remain_quantity = Number(this.dataVariat[0].remain_quantity) 
        this.remain_quantity = this.dataVariat[0].remain_quantity;

        this.images = this.dataVariat[0].images;
        if(this.images.length != 0) {
          this.store.listFiles = this.images;
        } else {
          this.store.listFiles = []
        }
        console.log('dataVariat', this.dataVariat)
      } else {
        this.$router.push({
          path: '/dashboard/NotFound'
        })
      }
      this.loading = false;
    },
    nextLinkVariat(id, product_id) {
      this.$router.push({
        path: '/dashboard/products/edit/' + product_id + '/variat/' + id
      })
      this.getDataVariation(id);
    },
    async handleUpVariat() {
      for(let variat of this.listVariat) {
        if(variat.id == this.idVariat) {
          variat.price = Number(this.price.replaceAll(/,/g, ''));
          variat.original_price = Number(this.original_price.replaceAll(/,/g, ''));
          variat.sku = this.sku;
          variat.remain_quantity = Number(this.remain_quantity);
          variat.images = await this.onUploadFile(this.store.listFiles, this.uidUser)
        }
      }
      this.quantity = this.quantity + Number(this.remain_quantity) - Number(this.is_remain_quantity);
      this.is_remain_quantity = Number(this.remain_quantity)
      await updateDoc(doc(this.db, this.uidData + 'Products', `${this.uid}`), {
        variations: this.listVariat,
        quantity: this.quantity
      })
      toastNotification('success', 'Cập nhật thành công', '');
    },
    changePrice(data) {
      switch(data.type) {
        case 'price':
          this.price = data.dataPrice
          break;
        case 'original_price':
          this.original_price = data.dataPrice
          break
        default:
          break;
      }
    }
  }
}
</script>

<template>
  <div class="collection-container">
    <div class="page-content d-flex align-items-center justify-content-center" style="min-height: 400px;" v-if="this.loading">
      <a-spin tip="Loading..."/>
    </div>
    <div class="page-content" v-else>
      <div class="box-file-created d-flex justify-content-between mb-4">
        <div class="box-file-search">
          <router-link :to="{ name: 'Edit Product', params: { id: this.listVariat.id } }">
            <div class="d-flex gap-4">
              <div class="variat-img">
                <img :src="this.data.images.length != 0 ? this.data.images[0] : this.store.NotImage" width="60" height="60" class="rounded-md" style="object-fit: contain;"/>
              </div>
              <div class="variat-title">
                <h3 class="mb-0 color-1db954">{{ this.data.name }}</h3>
                <p class="mb-0" style="color: var(--text-color); text-transform: lowercase;">{{ this.listVariat.length }} {{ $t('Variant') }}</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="box-file-created-btn">
          <button class="btn-green border-0 cursor-pointer" @click="handleUpVariat()">
            <cloud-upload-outlined class="text-14 mr-1"/>
            {{ $t('Save edit') }}
          </button>
        </div>
      </div>
      <hr style="background-color: var(--text-color);"/>
      <div class="mt-4 main-variat">
        <a-row>
          <a-col :span="8" class="pr-4">
            <div class="ant-card ant-card-bordered">
              <div class="ant-card-body">
                <div class="product-info--block__header d-flex justify-content-between p-4">
                  <div class="d-block-title fw-600">{{ $t('Variant') }}</div>
                  <div class="d-amount-blogs">
                    <p class="mb-0">{{ this.dataVariat[0].title }}</p>
                  </div>
                </div>
                <div class="form-section">
                  <div 
                    class="d-flex align-items-center variant-item" 
                    style="cursor: pointer;"
                    v-for="item in this.listVariat" :key="item.id" 
                    @click="nextLinkVariat(item.id, item.product_id)"
                  >
                    <div class="variant-image">
                      <img 
                        :src="item.images.length != 0 
                        ? item.images[0] 
                        : this.store.NotImage"
                      >
                    </div>
                    <div class="variant-name fw-600">{{ item.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="16" class="pl-4">
            <div class="ant-card ant-card-bordered mb-4">
              <div class="ant-card-body">
                <div class="p-4">
                  <div class="product-info--block__header pb-4">
                    <div class="d-block-title fw-600">{{ $t('Variant images') }}</div>
                  </div>
                  <div class="images-edit-variant form-section">
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
                        <span class="text-14">{{ $t('Get photos from your collection') }}</span>
                      </button>
                      <button class="btn-select-album ml-4" @click="this.store.onSortImg" v-if="this.store.listFiles.length >= 2">
                        <span>{{ $t('Sort') }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ant-card ant-card-bordered mb-4">
              <div class="ant-collapse-header p-4">
                <div class="p-0 fw-600 mb-4">
                  {{ $t('Variant property') }}
                </div>
                <div class="label-group mt-3" v-for="(property, index) in this.properties" :key="index">
                  <label class="mb-0">{{ property.name}}</label>
                  <div class="relative">
                    <input 
                      :value="property.value" 
                      class="label-group-input d-block w-full"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="ant-card ant-card-bordered mb-4">
              <div class="ant-collapse-header p-4">
                <a-row>
                  <a-col :span="12" class="pr-4">
                    <div class="label-group">
                      <label>{{ $t('Variant price') }}</label>
                      <!-- <div class="relative">
                        <input 
                          v-model="this.price" 
                          @keyup="handleChangePrice('price')" 
                          class="label-group-input d-block w-full"
                          style="padding-left: 10px;"
                          type="text"
                        />
                        <div class="absolute top-0 bottom-0 right-0 h-100 d-flex align-items-center pr-3">
                          (đ)
                        </div>
                      </div> -->

                      <InputPrice 
                        :data="{ dataPrice: this.price !== 0 && this.price !== '' && this.price.includes(',')
                          ? parseInt(this.price.replace(/,/g, ''))
                          : parseInt(this.price),
                          title: 'price'
                        }"
                        @isChangePrice="changePrice"
                      />
                    </div>
                  </a-col>
                  <a-col :span="12" class="pl-4">
                    <div class="label-group">
                      <label>{{ $t('Variant original price' )}}</label>
                      <InputPrice 
                        :data="{ dataPrice: this.original_price !== 0 && this.original_price !== '' && this.original_price.includes(',')
                          ? parseInt(this.original_price.replace(/,/g, ''))
                          : parseInt(this.original_price),
                          title: 'original_price'
                        }"
                        @isChangePrice="changePrice"
                      />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="ant-card ant-card-bordered">
              <div class="ant-collapse-header p-4">
                <a-row>
                  <a-col :span="12" class="pr-4">
                    <div class="label-group">
                      <label>{{ $t('SKU product') }}</label>
                      <div class="relative">
                        <input 
                          v-model="this.sku" 
                          class="label-group-input d-block w-full"
                          style="padding-left: 10px;"
                          type="text"
                        />
                      </div>
                    </div>
                  </a-col>
                  <a-col :span="12" class="pl-4">
                    <div class="label-group">
                      <label>{{ $t('Quantity') }}</label>
                      <div class="relative">
                        <input 
                          v-model.number="this.remain_quantity" 
                          class="label-group-input d-block w-full"
                          style="padding-left: 10px;"
                          type="text"
                        />
                      </div>
                    </div>
                  </a-col>
                </a-row>
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

  .ant-upload-lists {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
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
</style>