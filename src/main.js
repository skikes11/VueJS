import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import VuejsDialog from 'vuejs-dialog';
import VuejsDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // only needed in custom components
// include the default style
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

import "github-markdown-css";
import VueMarkdown from "vue-markdown";
import VuePrism from 'vue-prism'
import 'prismjs/themes/prism.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import JwPagination from 'jw-vue-pagination';
Vue.component('jw-pagination', JwPagination);

Vue.component('vue-markdown', VueMarkdown);

Vue.use(VuePrism)
Vue.use(VuejsDialog);
Vue.use(VuejsDialogMixin);
Vue.config.productionTip = false
Vue.prototype.$log = console.log
new Vue({
  router,
  store,
  components: { App },
  template: "<App/>",
  render: h => h(App)
}).$mount('#app')
