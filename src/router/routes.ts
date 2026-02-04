//  Vue Router 配置（启用路由懒加载）
import {createRouter,createWebHistory} from 'vue-router'

const routes = [
   {
    path: '/user',
    name: 'Home',
    component: () => import( '../pages/user/index.vue'),
    redirect:'/user/visitor',
    children:[
      {
        path:'/user/visitor',
        name:'Visitor',
         component: () => import('../pages/user/visitor.vue'),
      },
       {
        path:'/user/userInfo',
        name:'UserInfo',
         component: () => import('../pages/user/userInfo.vue'),
      },
      {
        path:'/user/settings',
        name:'Settings',
         component: () => import('../pages/user/settings/settings.vue'),
      },
      {
        path:'/user/administrator',
        name:'Administrator',
         component: () => import('../pages/user/administrator.vue'),
      },
      {
        path:'/user/account',
        name:'Account',
        component: () => import('../pages/user/account/index.vue'),
        redirect:'/user/account/registration',
        children:[
          {
          path:'/user/account/registration',
          name:'Registration',
            component: () => import('../pages/user/account/registration.vue'),
          },
          {
          path:'/user/account/login',
          name:'Login',
            component: () => import('../pages/user/account/login.vue'),
          },
          {
            path: '/user/account/privacyAndObserve',
            name: 'PrivacyAndObserve',
            component: () => import('../pages/user/account/privacyAndObserve.vue')
          }
       ]
      }
       
    ]
  },
  {path:'/encyclopedia',
    name:'Encyclopedia',
    component:()=>import('../pages/encyclopedia/index.vue'),
    redirect: '/encyclopedia/flower',
    children:[
    {
    path: '/encyclopedia/flower',
    name: 'Flower',
    component: () => import('../pages/encyclopedia/flower/index.vue'),
  },
  {
    path: '/encyclopedia/flower/detail/:id',
    name: 'FlowerDetail',
    component: () => import('../pages/encyclopedia/flower/detail.vue'),
  },
    {
    path: '/encyclopedia/constellation',
    name: 'Constellation',
    component: () => import( '../pages/encyclopedia/constellation/index.vue'),
  },
    {
    path: '/encyclopedia/animals',
    name: 'Animals',
    component: () => import( '../pages/encyclopedia/animals/index.vue'),
    
  },
      {path:'/encyclopedia/animals/category/detail/:id',
        name:'Detail',
        component: () => import( '../pages/encyclopedia/animals/category/detail.vue'),
      },
      {path:'/encyclopedia/animals/category/amphibia',
        name:'Amphibia',
        component: () => import( '../pages/encyclopedia/animals/category/amphibia.vue'),
      },
      {path:'/encyclopedia/animals/category/birds',
        name:'Birds',
        component: () => import( '../pages/encyclopedia/animals/category/birds.vue'),
      },
      {path:'/encyclopedia/animals/category/land',
        name:'Land',
        component: () => import( '../pages/encyclopedia/animals/category/land.vue'),
      },
      {path:'/encyclopedia/animals/category/ocean',
        name:'Ocean',
        component: () => import( '../pages/encyclopedia/animals/category/ocean.vue'),
      },
  
    ]
  },
  {
    path: '/fireworks/heart',
    name: 'Heart',
    component: () => import( '../pages/fireworks/heart.vue'),  
  },
  {
    path: '/garden/butterflyGarden',
    name: 'Garden',
    component: () => import( '../pages/garden/butterflyGarden/butterflyGarden.vue'),  
  },
  {path:'/eth',
    name:'ETH',
    component:()=>import('../pages/eth/eth.vue'),
  },
    {path:'/css',
    name:'CSS',
    component:()=>import('../pages/css/css.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router