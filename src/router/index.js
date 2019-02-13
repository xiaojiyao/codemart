import Vue from 'vue'
import Router from 'vue-router'

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
    hidden: true,
    meta: {
      noNeedAuth: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      noNeedAuth: true
    }
  },
  {
    path: '/forgetPsw',
    component: () => import('@/views/forgetPsw/index'),
    hidden: true,
    meta: {
      noNeedAuth: true
    }
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    hidden: true,
    meta: {
      noNeedAuth: true
    }
  },
  {
    path: '/productMessage',
    component: () => import('@/views/dashboard/productMessage'),
    hidden: true,
    meta: {
      noNeedAuth: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: {
      noNeedAuth: true
    }
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      noNeedAuth: true
    }
  },

  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: '个人中心',
    meta: {
      title: '个人中心',
      icon: 'user'
    },
    children: [{
        path: 'list',
        name: '资料设置',
        component: () => import('@/views/product/index'),
        meta: {
          title: '资料设置',
          icon: 'edit'
        }
      },
      {
        path: 'message',
        name: '消息通知',
        component: () => import('@/views/message/index.vue'),
        meta: {
          title: '消息通知',
          icon: 'message'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: '用户中心',
    meta: {
      title: '用户中心',
      icon: 'user'
    },
    children: [{
      path: 'list',
      name: '用户管理',
      component: () => import('@/views/user/index'),
      meta: {
        title: '用户管理',
        icon: 'user'
      }
    }]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: '项目管理',
    meta: {
      title: '项目管理',
      icon: 'nested'
    },
    children: [{
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: '所有项目',
        meta: {
          title: '所有项目',
          icon: 'list'
        },
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: '收藏管理',
        meta: {
          title: '收藏管理',
          icon: 'star'
        }
      },
      {
        path: 'menu3',
        component: () => import('@/views/nested/menu3/index'),
        name: '投标管理',
        meta: {
          title: '投标管理',
          icon: 'guide'
        }
      },
      {
        path: 'menu4',
        component: () => import('@/views/nested/menu4/index'),
        name: '已完成项目',
        meta: {
          title: '已完成项目',
          icon: 'example'
        }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: '项目管理1',
    meta: {
      title: '项目管理',
      icon: 'nested'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/project/menu1/index'),
      name: '所有项目1',
      meta: {
        title: '所有项目',
        icon: 'list'
      }
    }, {
      path: 'contend',
      component: () => import('@/views/project/menu2/index'),
      name: '竞标管理',
      meta: {
        title: '竞标管理',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/item',
    component: Layout,
    redirect: '/item/list',
    name: '项目管理2',
    meta: {
      title: '项目管理',
      icon: 'nested'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/item/menu1/index'),
      name: '所有项目2',
      meta: {
        title: '所有项目',
        icon: 'list'
      }
    }, {
      path: 'audit',
      component: () => import('@/views/item/menu2/index'),
      name: '项目审核',
      meta: {
        title: '项目审核',
        icon: 'form'
      }
    }]
  },
  {
    path: '/label',
    component: Layout,
    redirect: '/label/list',
    name: '标签',
    meta: {
      title: '标签',
      icon: 'label'
    },
    children: [{
      path: 'list',
      name: '标签管理',
      component: () => import('@/views/label/index'),
      meta: {
        title: '标签管理',
        icon: 'language'
      }
    }]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/list',
    name: '通知1',
    meta: {
      title: '通知',
      icon: 'notice'
    },
    children: [{
      path: 'list',
      name: '消息通知1',
      component: () => import('@/views/notice/index'),
      meta: {
        title: '消息通知',
        icon: 'message'
      }
    }]
  },
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
