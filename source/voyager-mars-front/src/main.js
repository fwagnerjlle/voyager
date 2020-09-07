import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import App from '@/App.vue';
import '@/plugins';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';
import '@/assets/scss/global-styles.css';

Vue.config.productionTip = false;

sync(store, router);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
