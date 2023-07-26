import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { useUser } from "../composables/useUser";
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import {
  getStorage,
  ref,
  list,
  getMetadata,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { db } from "../firebase";
import app from "../firebase";

import createI18n from "../composables/i18n";

import { toastNotification } from "../components/Notification/index";

const { getUser } = useUser();
const { user } = getUser(); 
const storage = getStorage();

export const useStore = defineStore("store", {
  state: () => {
    return {
      NotImage: 'https://statics.pancake.vn/web-media/1d/58/cb/7e/a43b3f11a05df59ef40150693cc2de037716558eb5dd65a758052eb0.png',
      // collapsed: false,
      // width: 210,
      collapsedWidth: JSON.parse(window.localStorage.getItem('collapsed')),

      storage,
      visibleModalCollection: false,
      loading: false,
      listRef: ref(storage, `ImageUser/${user.value.uid}`),
      dataCollection: [],
      visibleSortImage: false,

      imageLocalStorage: window.localStorage.getItem('imageAvt'),
      db: getFirestore(app),
      router: useRouter(),
      userStore: user,
      file: "",
      filePreview: null,
      listFiles: [],
    };
  },
  actions: {
    async fetchDataCollection() {
      this.dataCollection = []
      this.loading = true;
      list(this.listRef)
        .then((res) => {
          this.loading = true;
          if(res.items.length !== 0) {
            res.items.forEach(async (itemRef) => {
              const refFullPath = ref(this.storage, `${itemRef.fullPath}`);
              const metadata = await getMetadata(refFullPath);
              const url = await getDownloadURL(refFullPath);
              metadata["url"] = url;
              metadata["id"] = this.randomID();
              this.dataCollection.push(metadata)
            })
          } else {
            this.loading = false;
          }
        })
    },
    showModalCollection() {
      this.visibleModalCollection = true;
      this.fetchDataCollection()
    },
    async handleDeleteImgModal(path, url) {
      if(this.imageLocalStorage == url) {
        toastNotification('error', 'Cảnh báo', 'Ảnh là đang là ảnh thông tin cá nhân')
      } else {
        const idPath = ref(this.storage, `${path}`);
        deleteObject(idPath)
          .then(() => {
            toastNotification('success', 'Thành công', '')
            this.dataCollection = [];
            this.fetchDataCollection();
          })
          .catch((error) => {
            alert("Lỗi !!!");
          });
      }
    },
    onDeleteItemImg(img) {
      let index = this.listFiles.findIndex(el => el == img)
      this.listFiles.splice(index, 1)
    },
    showModalSortImg() {
      this.visibleSortImage = true;
    },

    toggleCollapsed() {
      this.collapsedWidth = [
        {
          collapsed: !this.collapsedWidth[0].collapsed,
          width: this.collapsedWidth[0].collapsed ? 210 : 60, 
        }
      ]
      window.localStorage.setItem('collapsed', JSON.stringify(this.collapsedWidth))
      // this.collapsed = !this.collapsed;
      // this.width = !this.collapsed ? 210 : 60;
    },
    handleCopy(text) {
      navigator.clipboard.writeText(text).then(function() {
        toastNotification('success', 'Copy thành công', '')
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    },
    async UpdateUsertoDB(userDB) {
      try {
        await setDoc(doc(db, "Users", `${userDB.uid}`), {
          userDB
        })
        console.log('update', this.userStore)
        toastNotification('success', 'Thông báo', 'Cập nhật người dùng thành công')
      } catch(error) {
        console.error("Error in update on firebase", error)
      }
    },
    onChangeFile(event) {
      const selected = event.target.files[0];
      const typesFile = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (selected && typesFile.includes(selected.type)) {
        this.file = selected;
        this.filePreview = window.URL.createObjectURL(selected);
      } else {
        this.file = null;
        alert("The file is in the wrong data format.")
      }
    },
    async onChangeFiles(event) {
      const files = event.target.files;
      const typesFile = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      for (let i = 0; i < files.length; i++) {
        if (typesFile.includes(files[i].type)) {
          if (this.listFiles.length !== 0) {
            if (!this.listFiles.some((item) => item.name === files[i].name)) {
              this.listFiles.push({
                blob: files[i],
                image: window.URL.createObjectURL(files[i]),
                url: "",
              });
            }
          } else {
            this.listFiles.push({
              blob: files[i],
              image: window.URL.createObjectURL(files[i]),
              url: "",
            });
          }
        }
      }
    },
    handleNew(name) {
      this.router.push({
        name: name,
        params: {}
      })
    },
    s4() {
      return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    },
    randomID() {
      return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4()
    }
  },
});

 