import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue } from 'bootstrap-vue'
import './app.sass'
import Toaster from 'v-toaster'
Vue.use(BootstrapVue)
import 'v-toaster/dist/v-toaster.css';
Vue.use(Toaster, {timeout: 2000})

window.axios = require('axios')
axios.defaults.baseURL = process.env.VUE_APP_BACKEND_API_ROOT_URL
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
};
if(store.state.auth.token){
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('access_token');
      const auth = token ? `Bearer ${token}` : '';
      config.headers.common['Authorization'] = auth;
      return config;
    },
    error => Promise.reject(error),
  );
}


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
