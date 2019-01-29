import Vue from 'vue'
import Router from 'vue-router'
import role from '@/store/modules/role'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [{
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/login',
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: '商品',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [{
      path: '/product',
      name: '商品列表',
      component: () => import('@/views/product/index'),
      meta: {
        title: '商品列表',
        icon: 'tree'
      }
    }]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: '订单',
    meta: {
      title: '订单',
      icon: 'example'
    },
    children: [{
      path: '/orderList',
      name: '订单管理',
      component: () => import('@/views/order/index'),
      meta: {
        title: '订单管理',
        icon: 'example'
      }
    }]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: '资金管理',
    meta: {
      title: '资金管理',
      icon: 'nested'
    },
    children: [{
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: '收款单',
        meta: {
          title: '收款单'
        },
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: '付款单',
        meta: {
          title: '付款单'
        }
      },
      {
        path: 'menu3',
        component: () => import('@/views/nested/menu3/index'),
        name: '统计明细',
        meta: {
          title: '统计明细'
        }
      }
    ]
  },

  {
    path: '/report',
    component: Layout,
    children: [{
      path: 'index',
      name: '报表',
      component: () => import('@/views/report/index'),
      meta: {
        title: '报表',
        icon: 'form'
      }
    }]
  },
  {
    path: '/customer',
    component: Layout,
    children: [{
      path: 'index',
      name: '客户列表',
      component: () => import('@/views/customer/index'),
      hidden: role.state.role,
      meta: {
        title: '客户列表',
        icon: 'user'
      }
    }]
  },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [{
  //     path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //     meta: {
  //       title: 'External Link',
  //       icon: 'link'
  //     }
  //   }]
  // },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
