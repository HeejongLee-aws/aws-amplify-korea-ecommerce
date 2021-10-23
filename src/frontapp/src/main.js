import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from './aws-exports'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@babel/polyfill'
import VueDaumPostcode from 'vue-daum-postcode'
import VueMoment from 'vue-moment'

Amplify.configure(awsconfig)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VueDaumPostcode)
Vue.use(VueMoment)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
