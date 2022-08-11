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
import AddUser from '../components/AddUser.vue'
import EditUser from '../components/EditUser.vue'
import AddProduct from '../components/AddProduct.vue'
import EditProduct from '../components/EditProduct.vue'
import AddRole from '../components/AddRole.vue'
import EditRole from '../components/EditRole.vue'
import Order from '../components/Order.vue'
import EditOrder from '../components/EditOrder.vue'


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
      path: '/users/add',
      name: 'addUser',
      component: AddUser
    },
    {
      path: '/users/edit/:id',
      name: 'editUser',
      component: EditUser
    },
    {
      path: '/products/add',
      name: 'addProduct',
      component: AddProduct
    },
    {
      path: '/products/edit/:id',
      name: 'editProduct',
      component: EditProduct
    },
    {
      path: '/roles/add',
      name: 'addRole',
      component: AddRole
    },
    {
      path: '/roles/edit/:id',
      name: 'editRole',
      component: EditRole
    },
    {
      path: '/orders',
      name: 'Orders',
      props: { page: 5 },
      component: Order
    },
    {
      path: '/roles/edit/:id',
      name: 'editOrder',
      component: EditOrder
    },
    {
      path: '/404',
      name: 'BadGateway',
      props: { page: 6 },
      component: BadGateway
    },
    {
      path: '*',
      props: { page: 6 },
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


