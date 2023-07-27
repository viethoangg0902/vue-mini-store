<script>
import "../../sass/dashboard.sass";
import "../../sass/collection.sass";
import "../../sass/main.sass";

import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";

import { useStore } from "../../pinia/store";
import { useUser } from "../../composables/useUser";
import useStorage from "../../composables/useStorage";
import { toastNotification } from "../Notification";

export default { 
  name: "ModalCollection",
  components: {
    VerticalAlignTopOutlined
  },
  props: {
    multiple: Boolean
  },
  data() {
    const store = useStore();
    const { getUser } = useUser();
    const { uidUser } = getUser();
    const { arrUrl, onUploadFile } = useStorage("ImageUser");
    return {
      store,
      uidUser,
      firstFiles: 0,
      lastFiles: 0,
      dataFiles: [],
      selectedItems: [],
      lastSelectedIndex: null,
      onUploadFile,
      arrayFiles: []
    }
  },
  methods: {
    onSelectedFiles(index, file){
      if (this.multiple &&
        (event.shiftKey ||
          (window.navigator.platform.match("Win") && event.ctrlKey) ||
          (window.navigator.platform.match("Mac") && event.metaKey))
      ) {
        this.dataFiles = [];
        this.firstFiles === -1 
          ? (this.firstFiles = this.store.dataCollection.findIndex(
              (item) => item.id === file.id
            ))
          : (this.lastFiles = this.store.dataCollection.findIndex(
              (item) => item.id === file.id
            ));
        
        this.store.dataCollection.forEach((item, index) => {
          if (this.firstFiles <= this.lastFiles) {
            if (index >= this.firstFiles && index <= this.lastFiles) {
              this.dataFiles.push(item);
            }
          } else {
            this.dataFiles =
              index >= this.lastFiles && index <= this.firstFiles
                ? this.dataFiles.push(item)
                : this.dataFiles;
          }
        });

        const start = Math.min(this.lastSelectedIndex, index);
        const end = Math.max(this.lastSelectedIndex, index);
        this.selectedItems = [];
        for (let i = start; i <= end; i++) {
          this.selectedItems.push(i);
        }
      } else {
        this.dataFiles = [];
        this.dataFiles.push(file);
        this.selectedItems = [index];
      }
      this.lastSelectedIndex = index;
    },
    handleSaveCollection() {
      if(this.dataFiles.length == 1) {
        console.log('1')
        this.store.listFiles.push(this.dataFiles[0].url);
        this.store.loading = false;
        this.store.visibleModalCollection = false;
        this.dataFiles = [];
      } 
      else if(this.dataFiles.length > 1) {
        console.log('2')
        this.dataFiles.forEach(el => {
          this.store.listFiles.push(el.url)
        })
        this.store.loading = false;
        this.store.visibleModalCollection = false;
        this.dataFiles = [];
      }
      else  {
        console.log('3')
        this.store.visibleModalCollection = false;
      }
      this.lastSelectedIndex = null;
      this.selectedItems = []
    },
    handleCancelCollection() {
      this.store.visibleModalCollection = false;
      this.store.loading = false;
      this.lastSelectedIndex = null;
      this.selectedItems = [];
      this.dataFiles = [];
    },
    isSelected(index) {
      return this.selectedItems.indexOf(index) !== -1;
    },
    async handleUpFiles(event) {
      const files = event.target.files;
      const typesFile = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      for (let i = 0; i < files.length; i++) {
        if (typesFile.includes(files[i].type)) {
          if (this.arrayFiles.length !== 0) {
            if (!this.arrayFiles.some((item) => item.name === files[i].name)) {
              this.arrayFiles.push({
                blob: files[i],
                image: window.URL.createObjectURL(files[i]),
                url: "",
              });
            }
          } else {
            this.arrayFiles.push({
              blob: files[i],
              image: window.URL.createObjectURL(files[i]),
              url: "",
            });
          }
        }
      }
      if(this.arrayFiles) {
        await this.onUploadFile(this.arrayFiles, this.uidUser);
        this.store.dataCollection = [];
        this.store.fetchDataCollection();
        toastNotification('success', 'Thông báo', 'Thêm ảnh thành công')
      }
    }
  }
}
</script>

<template>
  <a-modal 
    class="modal-collection collection-media-table p-0"
    v-model:visible="this.store.visibleModalCollection" 
    width="1645px" 
    title="Chọn ảnh" 
    okText="Lưu ảnh đã chọn"
    cancelText="Huỷ"
    @cancel="this.handleCancelCollection"
    @ok="this.handleSaveCollection"
  >
    <div class="media-table-body">
      <a-row>
        <a-col :span="3" class="pr-4 pt-4" style="border-right: 1px solid #ddd;">
          <div class="uploadimg-collection">
            <label for="uploadImg" class="color-1db954">
              <vertical-align-top-outlined class="text-14 pr-1"/>
              Tải ảnh lên
              <input type="file" multiple class="d-none" id="uploadImg" @change="this.handleUpFiles"/>
            </label>
          </div>
        </a-col>
        <a-col :span="16">
          <div class="file-list--wrapper" style="max-height: 600px; overflow: auto; border-right: 1px solid #ddd;">
            <div class="ant-checkbox-group">
              <div 
                v-for="(order, index) in this.store.dataCollection" :key="index" 
                class="box-item"
                :class="{ 'active': isSelected(index) }"
                @click="this.onSelectedFiles(index, order)"
              >
                <div class="box-item--image relative">
                  <img :src="order.url" />
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
        </a-col>
        <a-col :span="5">
          <div class="file-list--wrapper">
            <div class="modal-collection-file-info">
              <div class="file-info-title">
                Thông tin tệp
              </div>
              <div class="file-info-img pt-0">
                <img :src="this.dataFiles.length == 1 ? this.dataFiles[0].url : this.store.NotImage" class="w-full"/>
              </div>
              
              <div class="file-info--item__wrapper">
                <div class="file-info--item">
                  <div class="file-info--item__content d-flex" v-if="this.dataFiles.length == 1">
                    <div class="item w-full d-flex justify-content-between">
                      <div>Loại</div>
                      <div style="text-transform: uppercase;">{{ this.dataFiles[0].contentType.split('/')[1]  }}</div>
                    </div>
                    <div class="item w-full d-flex justify-content-between">
                      <div>Kích thước</div>
                      <div>{{ Math.floor(this.dataFiles[0].size / 1000) }}KB</div>
                    </div>
                    <div style="height: 1px; background-color: rgb(240, 240, 240);"></div>
                    <div class="item w-full d-flex justify-content-between">
                      <div>Đường dẫn</div>
                      <div class="d-flex align-items-center gap-3 cursor-pointer" @click="this.store.handleCopy(this.dataFiles[0].url)">
                        <div class="d-url-copy color-1db954">{{ this.dataFiles[0].url }}</div>
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.9996 0H2.62463C2.55588 0 2.49963 0.05625 2.49963 0.125V1C2.49963 1.06875 2.55588 1.125 2.62463 1.125H10.3746V11.875C10.3746 11.9438 10.4309 12 10.4996 12H11.3746C11.4434 12 11.4996 11.9438 11.4996 11.875V0.5C11.4996 0.223437 11.2762 0 10.9996 0ZM8.99963 2H0.999634C0.723071 2 0.499634 2.22344 0.499634 2.5V10.7922C0.499634 10.925 0.552759 11.0516 0.646509 11.1453L3.35432 13.8531C3.3887 13.8875 3.42776 13.9156 3.46995 13.9391V13.9688H3.53557C3.59026 13.9891 3.64807 14 3.70745 14H8.99963C9.2762 14 9.49963 13.7766 9.49963 13.5V2.5C9.49963 2.22344 9.2762 2 8.99963 2ZM3.46838 12.3781L2.12307 11.0312H3.46838V12.3781ZM8.37463 12.875H4.46838V10.6562C4.46838 10.3109 4.1887 10.0312 3.84338 10.0312H1.62463V3.125H8.37463V12.875Z" fill="#262626"></path>
                        </svg>
                      </div>
                    </div>
                    <div style="height: 1px; background-color: rgb(240, 240, 240);"></div>
                    <div class="item w-full d-flex justify-content-between">
                      <div>Ngày tạo</div>
                      <div>{{ `${new Date(this.dataFiles[0].timeCreated).getDate()} / ${new Date(this.dataFiles[0].timeCreated).getMonth() + 1} / ${new Date(this.dataFiles[0].timeCreated).getFullYear()}` }}</div>
                    </div>
                    <div class="file-info--item__content">
                      <div class="item item-hover text-red d-flex gap-2" style="color: #D92D20" @click="this.store.handleDeleteImgModal(this.dataFiles[0].fullPath, this.dataFiles[0].url.split('?')[0])">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.28544 2.14118H4.14258C4.22115 2.14118 4.28544 2.0769 4.28544 1.99833V2.14118H9.71401V1.99833C9.71401 2.0769 9.77829 2.14118 9.85687 2.14118H9.71401V3.4269H10.9997V1.99833C10.9997 1.36797 10.4872 0.855469 9.85687 0.855469H4.14258C3.51222 0.855469 2.99972 1.36797 2.99972 1.99833V3.4269H4.28544V2.14118ZM13.2854 3.4269H0.714007C0.397935 3.4269 0.142578 3.68225 0.142578 3.99833V4.56976C0.142578 4.64833 0.206864 4.71261 0.285435 4.71261H1.36401L1.80508 14.0519C1.83365 14.6608 2.33722 15.1412 2.94615 15.1412H11.0533C11.664 15.1412 12.1658 14.6626 12.1944 14.0519L12.6354 4.71261H13.714C13.7926 4.71261 13.8569 4.64833 13.8569 4.56976V3.99833C13.8569 3.68225 13.6015 3.4269 13.2854 3.4269ZM10.9158 13.8555H3.08365L2.65151 4.71261H11.3479L10.9158 13.8555Z" fill="#D92D20"></path>
                        </svg>
                        Xóa ảnh đã chọn
                      </div>
                    </div>
                  </div>
                  <div class="file-info--item__content d-flex" v-else>
                    <div class="file-info--item__content"> 
                      <div class="item item-hover text-red d-flex gap-2" style="color: #D92D20">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.28544 2.14118H4.14258C4.22115 2.14118 4.28544 2.0769 4.28544 1.99833V2.14118H9.71401V1.99833C9.71401 2.0769 9.77829 2.14118 9.85687 2.14118H9.71401V3.4269H10.9997V1.99833C10.9997 1.36797 10.4872 0.855469 9.85687 0.855469H4.14258C3.51222 0.855469 2.99972 1.36797 2.99972 1.99833V3.4269H4.28544V2.14118ZM13.2854 3.4269H0.714007C0.397935 3.4269 0.142578 3.68225 0.142578 3.99833V4.56976C0.142578 4.64833 0.206864 4.71261 0.285435 4.71261H1.36401L1.80508 14.0519C1.83365 14.6608 2.33722 15.1412 2.94615 15.1412H11.0533C11.664 15.1412 12.1658 14.6626 12.1944 14.0519L12.6354 4.71261H13.714C13.7926 4.71261 13.8569 4.64833 13.8569 4.56976V3.99833C13.8569 3.68225 13.6015 3.4269 13.2854 3.4269ZM10.9158 13.8555H3.08365L2.65151 4.71261H11.3479L10.9158 13.8555Z" fill="#D92D20"></path>
                        </svg>
                        Xóa ảnh đã chọn
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<style lang="css">
  .box-item.active {
    border: 1px solid #1db954 !important;
  }

  .uploadimg-collection label {
    border: 1px solid #1db954;
    padding: 4px 10px;
    border-radius: 6px;
    display: block;
    width: 100%;
    text-align: center;
  }

  .collection-media-table .ant-modal-content .ant-modal-body {
    padding-top: 0 !important;
  }
</style>