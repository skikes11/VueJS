import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../components/Dashboard'
import Users from '../components/Users'
import BadGateway from '../components/BadGateway'
import Hello from '../components/HelloWorld.vue'
import Login  from '../components/Login.vue'
import Index from '../components/Index.vue'
import auth from '../../auth'
import Product from '../components/Products.vue'
import Role from '../components/Role.vue'


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect : '/login'
    },


    {
      path: '/index',
      name: 'Index',
      component: Index,
      alias: '/'
    },


    {
      path: '/login',
      name: 'Login',
      component: Login,
      alias: '/'
    },

    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
      alias: '/'
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      props: { page: 1 },
      alias: '/'
    },
    {
      path: '/users',
      name: 'Users',
      props: { page: 2 },
      component: Users
    },
    {
      path: '/products',
      name: 'Product',
      props: { page: 3 },
      component: Product
    },
    {
      path: '/roles',
      name: 'Role',
      props: { page: 4 },
      component: Role
    },


    {
      path: '/404',
      name: 'BadGateway',
      props: { page: 5 },
      component: BadGateway
    },
    {
      path: '*',
      props: { page: 5 },
      redirect: '/404'
    }
  ]
})


router.beforeEach((to, from, next) => {
    auth.check_and_setHeaderToken()

    if(to.path !== '/login'){
      if(auth.loggedIn){
        next()
      }else{
        next({ name : 'Login' })
      }
    }else{
      if(auth.loggedIn){
        next({ name : 'Dashboard' })
      }else{
        next()
      }
    }

});

export default router


