const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue') },
      { path: 'second', component: () => import('@/pages/SecondPage.vue') },
      { path: 'newDevice', component: () => import('@/pages/NewDevicePage.vue') },
      { path: 'productosCarritos', component: () => import('@/pages/ProductosCarritosPage.vue') },
      { path: 'device', component: () => import('@/pages/DeviceDataPage.vue') },
      { path: 'stats', component: () => import('@/pages/StatsPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
