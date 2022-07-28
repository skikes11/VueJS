import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../components/Dashboard'
import Profile from '../components/Profile'
import Users from '../components/Users'
import BadGateway from '../components/BadGateway'
import Hello from '../components/HelloWorld.vue'
import Login  from '../components/Login.vue'
import Index from '../components/Index.vue'

Vue.use(Router);

export default new Router({
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
      path: '/profile',
      name: 'Profile',
      props: { page: 2 },
      component: Profile
    },
    {
      path: '/users',
      name: 'Users',
      props: { page: 3 },
      component: Users
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
