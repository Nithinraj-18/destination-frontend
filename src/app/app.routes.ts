import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { CartComponent } from './components/cart/cart';

import { UpdatePasswordComponent } from './components/update-password/update-password';
import { AddProduct } from './components/add-product/add-product';
import { CreateLogin } from './components/create-login/create-login';
import { Dashboard } from './components/dashboard/dashboard';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Orders } from './components/orders/orders';
import { createLoginAdminOnlyGuard } from './guards/create-login-admin-only-guard';
import { adminGuard } from './guards/admin-guard';
import { InfoPage } from './components/info-page/info-page';

export const routes: Routes = [

  // 🏠 HOME
  {
    path: '',
    component: InfoPage
  },

  // 🏠 HOME PAGE
  {
    path: 'home',
    component: HomeComponent
  },

  // 🛒 CART
  {
    path: 'cart',
    component: CartComponent
  },

  // 🔐 FORGOT PASSWORD
  {
    path: 'forgot',
    component: ForgotPassword
  },

  // 🔐 CREATE LOGIN (ADMIN ONLY)
  {
    path: 'create-login',
    component: CreateLogin,
    canActivate: [createLoginAdminOnlyGuard]
  },

  // 📊 DASHBOARD
  {
    path: 'dashboard',
    component: Dashboard,

    // 🔥 PROTECT DASHBOARD
    canActivate: [adminGuard],

    children: [

      // 🔑 UPDATE PASSWORD
      {
        path: 'update-password',
        component: UpdatePasswordComponent
      },

      // 👤 CREATE LOGIN
      {
        path: 'create-login',
        component: CreateLogin,
        canActivate: [createLoginAdminOnlyGuard]
      },

      // ➕ ADD PRODUCT
      {
        path: 'add-product',
        component: AddProduct
      },

      // 📦 ORDERS
      {
        path: 'orders',
        component: Orders
      }

    ]
  },

  // ❌ INVALID ROUTE REDIRECT
  {
    path: '**',
    redirectTo: ''
  }

];