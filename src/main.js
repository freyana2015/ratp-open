import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import ApolloClient from 'apollo-boost'
import VueApollo from "vue-apollo"

Vue.config.productionTip = false

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueApollo)

new Vue({
  router,
  store,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
