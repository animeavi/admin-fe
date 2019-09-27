import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

const disabledFeatures = process.env.DISABLED_FEATURES || []
const settingsDisabled = disabledFeatures.includes('settings')
const settings = {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/settings/index'),
      name: 'Settings',
      meta: { title: 'Settings', icon: 'settings', noCache: true }
    }
  ]
}

const reportsDisabled = disabledFeatures.includes('reports')
const reports = {
  path: '/reports',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/reports/index'),
      name: 'Reports',
      meta: { title: 'Reports', icon: 'documentation', noCache: true }
    }
  ]
}

const invitesDisabled = disabledFeatures.includes('invites')
const invites = {
  path: '/invites',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/invites/index'),
      name: 'Invites',
      meta: { title: 'Invites', icon: 'guide', noCache: true }
    }
  ]
}

const moderationLogDisabled = disabledFeatures.includes('moderation-log')
const moderationLog = {
  path: '/moderation_log',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/moderation_log/index'),
      name: 'Moderation Log',
      meta: { title: 'moderationLog', icon: 'list', noCache: true }
    }
  ]
}

const emojiPacksDisabled = disabledFeatures.includes('emoji-packs')
const emojiPacks = {
  path: '/emoji-packs',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/emoji-packs/index'),
      name: 'Emoji packs',
      meta: { title: 'emoji-packs', icon: 'settings', noCache: true }
    }
  ]
}

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login-pleroma',
    component: () => import('@/views/login/pleroma'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/users/index'
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/users/index'),
        name: 'Users',
        meta: { title: 'users', icon: 'peoples', noCache: true }
      }
    ]
  },
  ...(reportsDisabled ? [] : [reports]),
  ...(invitesDisabled ? [] : [invites]),
  ...(moderationLogDisabled ? [] : [moderationLog]),
  ...(settingsDisabled ? [] : [settings]),
  ...(emojiPacksDisabled ? [] : [emojiPacks]),
  {
    path: '/users/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'UsersShow',
        component: () => import('@/views/users/show')
      }
    ],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]
