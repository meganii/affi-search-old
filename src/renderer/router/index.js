import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/selfback',
      name: 'selfback-page',
      component: require('@/components/SelfbackPage').default
    },
    {
      path: '/affiliate',
      name: 'affiliate-page',
      component: require('@/components/AffiliatePage').default
    },
    {
      path: '/settings',
      name: 'settings-page',
      component: require('@/components/SettingsPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
