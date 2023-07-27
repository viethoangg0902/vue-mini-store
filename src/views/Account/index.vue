<script>
import "../../sass/dashboard.sass";
import "../../sass/account.sass";

import {
  UserOutlined,
  CopyOutlined,
  EditOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";

import { useUser } from "../../composables/useUser";
import useStorage from "../../composables/useStorage"
import { useStore } from "../../pinia/store";
import { updateProfile } from "firebase/auth";

export default {
  components: {
    UserOutlined,
    CopyOutlined,
    EditOutlined,
    MailOutlined,
  },
  setup() {
    const { getUser } = useUser();
    const { user } = getUser();
    const visible = ref(false);

    const displayName = ref(user.value.displayName);
    const phoneNumber = ref(user.value.phoneNumber);
    const email = ref(user.value.email);
    const photoURL = ref(user.value.photoURL);
    const uid = ref(user.value.uid);

    const file = ref(user.value.photoURL);
    const filePreview = ref(null);
    const { url, uploadFile } = useStorage("ImageUser");

    const store = useStore();
    const showModal = () => {
      visible.value = true;
    };

    const onChangeFile = (event) => {
      const selected = event.target.files[0];
      const typesFile = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (selected && typesFile.includes(selected.type)) {
        file.value = selected;
        filePreview.value = window.URL.createObjectURL(selected);
      } else {
        file.value = null;
        alert("The file is in the wrong data format.")
      }
    };

    const handleOk = async () => {
      if (file.value) await uploadFile(file.value);
      await updateProfile(user.value, {
        displayName: displayName.value,
        phoneNumber: phoneNumber.value,
        photoURL: url.value
      });

      const dataUser = {
        displayName: displayName.value,
        phoneNumber: phoneNumber.value,
        email: email.value,
        photoURL: url.value,
        uid: uid.value,
      };
      store.UpdateUsertoDB(dataUser);
      visible.value = false;
    };

    return {
      user,
      file,
      visible,
      displayName,
      phoneNumber,
      uid,
      email,
      filePreview,
      photoURL,
      store,
      showModal,
      handleOk,
      onChangeFile
    };
  },
};
</script>

<template>
  <div class="account-container">
    <div class="page-content">
      <div class="user-info">
        <div class="cover"></div>
        <div class="edit-info">
          <edit-outlined @click="showModal" />
        </div>
        <div class="avatar-info">
          <img width="120" height="120" :src="user.photoURL" />
        </div>
        <div class="user-name" style="color: var(--text-color-title)">
          {{ user.displayName }}
        </div>
        <div class="info-item d-flex align-items-center justify-content-between">
          <span style="color: var(--text-color)">{{ $t('Name') }}:</span>
          <span style="color: var(--border-ant-menu)">{{
            user.displayName
          }}</span>
        </div>
        <div class="info-item d-flex align-items-center justify-content-between">
          <span style="color: var(--text-color)">{{ $t('Phone number') }}:</span>
          <span style="color: var(--border-ant-menu)">{{
            user.phoneNumber
          }}</span>
        </div>
        <div class="info-item d-flex align-items-center justify-content-between">
          <span style="color: var(--text-color)">Email:</span>
          <div class="copy-ic cursor-pointer" style="color: var(--border-ant-menu)" @click="store.handleCopy(user.email)">
            {{ user.email }} <copy-outlined class="ml-1" />
          </div>
        </div>
      </div>
      <a-modal 
        v-model:visible="visible" 
        :title="$t('Account information')"
        @ok="handleOk" 
        :okText="$t('Save')"
        :cancelText="$t('Cancel')"
      >
        <a-row>
          <a-col :span="16" class="pr-2">
            <div class="mb-2">
              <div><label style="font-weight: 600">{{ $t('Display name') }}</label></div>
              <a-input v-model:value="displayName" placeholder="Tên hiển thị">
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </div>
            <div class="mb-2">
              <div><label style="font-weight: 600">{{ $t('Phone number') }}</label></div>
              <a-input v-model:value="phoneNumber"
                pattern="^(\+84|84|0)(5[5|8|9|6|2]|8[1|2|3|4|5|8|6|9|7]|3[2|3|4|5|6|7|8|9]|7[0|9|7|6|8]|9[0|2|1|4|3|6|7|8|9]|1[2|9])([0-9]{7})$"
                placeholder="Số điện thoại">
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </div>
            <div class="mb-2">
              <div><label style="font-weight: 600">Email</label></div>
              <a-input v-model:value="email" placeholder="Email" :disabled="true">
                <template #prefix>
                  <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </div>
          </a-col>
          <a-col :span="8" class="pl-2">
            <div><label style="font-weight: 600">{{ $t('Avatar') }}</label></div>
            <div class="relative">
              <img :src="filePreview" width="140" height="140" style="border-radius: 8px" v-if="filePreview != null" />
              <img :src="user.photoURL" width="140" height="140" style="border-radius: 8px" v-else />
              <div class="absolute info-edit-photo cursor-pointer">
                <label for="handleFile" class="cursor-pointer">
                  <div>
                    <edit-outlined />
                    {{ $t('Edit') }}
                  </div>
                  <input type="file" class="h-0 w-0 overflow-hidden d-none" id="handleFile" @change="onChangeFile" />
                </label>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-modal>
    </div>
  </div>
</template>
