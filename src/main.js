// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// Import F7
/* eslint-disable no-unused-vars */
import Framework7 from 'framework7'
// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'
// Import Routes
import Routes from './routes.js'
import App from './App'

// Import App Custom Styles
// import AppStyles from './css/app.css'
// Import F7 iOS Theme Styles
/* eslint-disable no-unused-vars */
// import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
// import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme: */

import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'

Vue.config.productionTip = false

// Init F7 Vue Plugin
Vue.use(Framework7Vue)

/* eslint-disable no-new */
// Init App
const baseApp = new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    id: 'io.mobile.daybook', // App bundle ID
    name: 'Mobile Daybook', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: Routes
  },
  // Register App Component
  components: {
    app: App
  }
}).$mount('#app')

/*
try {
  if (device) {
    console.log('device ready, fire vue!')
    document.addEventListener("deviceready", onDeviceReady, false);
  }
} catch (e) {
  console.log('>>>error: WEB: ' + e)
  onDeviceReady()
}

function onDeviceReady() {
  // Init App
  new Vue({
    el: '#app',
    template: '<app/>',
    store,
    // Init Framework7 by passing parameters here
    framework7: {
      root: '#app',
      //Uncomment to enable Material theme:
      // material: true,
      routes: Routes,
      swipeBackPageActiveArea: 100,
      uniqueHistory: true
    },
    // Register App Component
    components: {
      app: App
    },
    mounted() {
      try {
        window.addEventListener('native.keyboardshow', this.keyboardShowHandler)
        window.addEventListener('native.keyboardhide', this.keyboardHideHandler)
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      keyboardShowHandler() {
        this.$$('.toolbar').hide()
      },
      keyboardHideHandler() {
        this.$$('.toolbar').show()
      }
    }
  })
}
*/
