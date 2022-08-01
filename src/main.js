import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import VuejsDialog from 'vuejs-dialog';
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.use(VuejsDialog);
Vue.config.productionTip = false
Vue.prototype.$log = console.log
new Vue({
  router,
  store,
  components: { App },
  template: "<App/>",
  render: h => h(App)
}).$mount('#app')
