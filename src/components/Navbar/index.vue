<script>
import "../../sass/dashboard.sass";

import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
  ShopOutlined
} from "@ant-design/icons-vue";
export default {
  name: 'Navbar',
  components: {
    DashboardOutlined,
    FolderOpenOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    UserAddOutlined,
    ShopOutlined
  },
  setup() {

    const route = useRoute();
    return {
      leading: computed(() => route.meta.leading)
    }
  }
}
</script>

<template>
  <ul>
    <li class="my-1">
      <router-link
        class="ant-menu-item py-3"
        :to="{ name: 'Dashboard', params: {} }"
      >
        <div class="ant-menu-items-group d-flex align-items-center">
          <div class="ant-menu-item-icon d-flex align-items-center">
            <DashboardOutlined class="text-17" />
          </div>
          <div class="ant-menu-item-title text-15 fw-400 pl-2">
            {{ $t('Dashboard') }}
          </div>
        </div>
      </router-link>
    </li>
    <li class="my-1">
      <router-link
        class="ant-menu-item py-3"
        :to="{ name: 'Orders', params: {} }"
      >
        <div class="ant-menu-items-group d-flex align-items-center">
          <div class="ant-menu-item-icon d-flex align-items-center">
            <shop-outlined class="text-17"/>
          </div>
          <div class="ant-menu-item-title text-15 fw-400 pl-2">
            {{ $t('Orders') }}
          </div>
        </div>
      </router-link>
    </li>
    <li class="my-1">
      <router-link
        class="ant-menu-item py-3"
        :to="{ name: 'Collection', params: {} }"
      >
        <div class="ant-menu-items-group d-flex align-items-center">
          <div class="ant-menu-item-icon d-flex align-items-center">
            <FolderOpenOutlined class="text-17" />
          </div>
          <div class="ant-menu-item-title text-15 fw-400 pl-2">
            {{  $t('Collection') }}
          </div>
        </div>
      </router-link>
    </li>
    <li class="my-1">
      <router-link
        :class="{'router-link-active router-link-exact-active': leading == '/dashboard/products'}"
        class="ant-menu-item py-3"
        :to="{ name: 'Products', params: {} }"
      >
        <div class="ant-menu-items-group d-flex align-items-center">
          <div class="ant-menu-item-icon d-flex align-items-center">
            <appstore-outlined class="text-17"/>
          </div>
          <div class="ant-menu-item-title text-15 fw-400 pl-2">
            {{ $t('Products') }}
          </div>
        </div>
      </router-link>
    </li>
    <li class="my-1">
      <router-link
      :class="{'router-link-active router-link-exact-active': leading == '/dashboard/categories'}"
        class="ant-menu-item py-3"
        :to="{name: 'Category', params: {}}"
      >
        <div class="ant-menu-items-group d-flex align-items-center">
          <div class="ant-menu-item-icon d-flex align-items-center">
            <appstore-add-outlined class="text-17"/>
          </div>
          <div class="ant-menu-item-title text-15 fw-400 pl-2">
            {{ $t('Category') }}
          </div>
        </div>
      </router-link>
    </li>
    <li class="my-1">
      <router-link
        class="ant-menu-item py-3"
        :to="{ name: 'Account', params: {} }"
      >
        <div class="ant-menu-items-group d-flex align-items-center">
          <div class="ant-menu-item-icon d-flex align-items-center">
            <UserAddOutlined class="text-17" />
          </div>
          <div class="ant-menu-item-title text-15 fw-400 pl-2">
            {{ $t('Account') }}
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>