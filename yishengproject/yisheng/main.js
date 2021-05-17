import Vue from 'vue'
import App from './App'
import CatField from './wxcomponents/cust-components/cat-field.vue'
Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()
App.mpType = 'app'
Vue.component('cat-field',CatField)
const app = new Vue({
    ...App
})
app.$mount()
