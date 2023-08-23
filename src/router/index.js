import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginRegister/LoginView.vue";
import RegisterView from "../views/LoginRegister/RegisterView.vue";
import NotFound from "../layouts/NotFound.vue";
import layoutLogin from "../layouts/layoutLogin.vue";
import layoutDashboard from "../layouts/layoutDashboard.vue";

import { projectAuth } from "../firebase";

const requiresAuth = (to, from, next) => {
  const user = projectAuth.currentUser;
  if(!user) next({ name: "Login", params: {}})
  else next();
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import("../views/NotFound/index.vue"),
      meta: {
        layout: NotFound,
      },
    },
    {
      path: "/",
      name: "Login",
      component: LoginView,
      meta: {
        layout: layoutLogin,
      },
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
      meta: {
        layout: layoutLogin,
      },
    },    
    {
      path: "/logout",
      name: "Logout",
      component: () => import("../views/LoginRegister/LogoutView.vue"),
      meta: {
        layout: layoutDashboard,
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("../views/Dashboard.vue"),
      meta: {
        text: '',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    //orders
    {
      path: "/dashboard/orders",
      name: "Orders",
      component: () => import("../views/Orders/index.vue"),
      meta: {
        leading: "/dashboard/orders",
        text: 'Orders',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/orders/create",
      name: "Create Orders",
      component: () => import("../views/Orders/CreateOrders.vue"),
      meta: {
        leading: "/dashboard/orders",
        text: 'Orders',
        children: 'Create Orders',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/collection",
      name: "Collection",
      component: () => import("../views/Collection/index.vue"),
      meta: {
        text: 'Collection',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    //products
    {
      path: "/dashboard/products",
      name: "Products",
      component: () => import("../views/Product/Product.vue"),
      meta: {
        leading: "/dashboard/products",
        text: 'Products',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/products/create",
      name: "Create Product",
      component: () => import("../views/Product/Create.vue"),
      meta: {
        leading: "/dashboard/products",
        text: 'Products',
        children: 'Create Product',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/products/edit/:id",
      name: "Edit Product",
      component: () => import("../views/Product/Edit.vue"),
      meta: {
        leading: "/dashboard/products",
        text: 'Products',
        children: 'Edit Product',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/products/edit/:id/variat/:idVariation",
      name: "Edit Variations",
      component: () => import("../views/Variations/Edit.vue"),
      meta: {
        leading: "/dashboard/products",
        text: 'Products',
        children: 'Edit Variation',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    //categories
    {
      path: "/dashboard/categories",
      name: "Category",
      component: () => import("../views/Category/Category.vue"),
      meta: {
        leading: "/dashboard/categories",
        text: 'Category',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/categories/create",
      name: "Create Category",
      component: () => import("../views/Category/Create.vue"),
      meta: {
        leading: "/dashboard/categories",
        text: 'Category',
        children: 'Create Category',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/categories/edit/:id",
      name: "Edit Category",
      component: () => import("../views/Category/Edit.vue"),
      meta: {
        leading: "/dashboard/categories",
        text: 'Category',
        children: 'Edit Category',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
    {
      path: "/dashboard/account",
      name: "Account",
      component: () => import("../views/Account/index.vue"),
      meta: {
        text: 'Account',
        layout: layoutDashboard,
      },
      beforeEnter: requiresAuth,
    },
  ],
});

export default router;
