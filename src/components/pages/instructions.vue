<template>
  <f7-page>
    <f7-navbar title="" back-link=""></f7-navbar>
                 <div class="page-content">
                    <div class="content-block-title">Main courante</div>
                        <ul >
                          <li class="swipeout deleted-callback" v-for="(node,index) in tasks" :key="index" v-hammer:swipe.left="(event)=> onSwipeLeft(event, node, index)" >
                            <!--  -->
                            <div class="item-content swipeout-content">
                            <div class = "item-inner">
                              <div class="item-title" > {{index + 1}}
                                <div class="item-after" >{{node.instruction}}</div>
                              </div>
                            </div> 
                            </div>
                            <div class="swipeout-actions-right" >
                              <a href="#" class="swipeout-delete"></a>
                            </div>
                          </li> 
                        </ul>
                </div>
  </f7-page>
</template>
<!-- <li  v-for="(node,index) in tasks" :key="index"  >
  <div class = "item-inner">
    <div class="item-title" > {{index + 1}}
      <div class="item-after" v-hammer:swipe.left="(event)=> onSwipeLeft(event, item, i)">{{node.instruction}}</div>
    </div>
  </div> 
</li> -->
  <!-- <div v-hammer:swipe.left="(event)=> onSwipeLeft(event, item, i)">Complete</div> -->
    <!-- <label class = "label-switch">
    <input type="checkbox" v-on:input="onChecked(node, index,$event)" name="media-checkbox" :value="node.checked"/>
    <div class="checkbox"></div>
    </label> -->  
  <!-- <div id="app">
    <SwipeButton
      ref="swipeButton"
      class="swipe-button"
      @actionConfirmed="onActionConfirmed"
    /> -->
<script>
  // import moment from 'moment'
  // import SwipeButton from './SwipeButton.vue';
  import VuePullRefresh from 'vue-pull-refresh'
  import { VueHammer } from 'vue2-hammer'
  // this.Vue.use(VueHammer)
  // this.$$(.deleted-callback).on('swipeout:deleted', function () {
  //   window.alert('Thanks, item removed!')
  // })
  export default {
    data () {
      return {
        tasks: [{
          title: '',
          task: {
            instruction: '',
            checked: ''
          }
        }],
        hasOwnProperty: Object.prototype.hasOwnProperty,
        daybookCreated: false
      }
    },
    swipeout: {
      noFollow: true,
      removeElements: true
    },
    computed: {
    },
    created () {
      // console.log(this.$device)
      // this.displayData()
      // this.tasks = JSON.parse(this.sessionStorage.getItem('tasks'))
      // debugger
      // if (!Array.isArray(this.tasks) || !this.tasks.length) {
      if (!this.isEmpty(this.tasks)) {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks'))
      } else {
        this.onRefresh()
      }
    },
    mounted () {
      // debugger
      if (!this.isEmpty(this.tasks)) {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks'))
      } else {
        this.onRefresh()
      }
    },
    components: {
      // f7Navbar,
      // f7Page,
      // f7BlockTitle
      'vue-pull-refresh': VuePullRefresh,
      'vueHammer': VueHammer
      // SwipeButton,
    },
    methods: {
      // saveChange: function (){
      //   alert()
      // },
      displayData: function () {
        if (this.tasks === null || this.tasks.length === 0) {
          this.onRefresh()
        }
        this.tasks = JSON.parse(window.localStorage.getItem('tasks'))
      },
      onRefresh: function () {
        const self = this
        let baseUrl = window.localStorage.getItem('baseUrl')
        let username = window.localStorage.getItem('username')
        let uid = window.localStorage.getItem('uid')
        let password = window.sessionStorage.getItem('password')
        let enc = window.btoa(username + ':' + password)
        let encString = 'Basic ' + enc
        let token = window.localStorage.getItem('csrfToken')
        let urlTasks = baseUrl + '/api/tasks/' + uid + '?_format=hal_json'
        let fetchTasks = {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': encString,
            'X-CSRF-Token': token,
            'Accept': 'application/hal+json',
            'Content-Type': 'application/hal+json'
          }
        }
        window.fetch(urlTasks, fetchTasks)
          .then(response => response.json())
          .then(data => {
            return self.saveDaybookData(data)
          .then(err => Promise.reject(err))
          }).catch(function (error) {
            console.debug(error)
          })
      },
      saveDaybookData (tasks) {
        // const self = this
        // this.localStorage.setItem('tempTasks', tasks)
        // console.log(JSON.stringify(tasks))
        let i = 0
        // let taskChecked = false
        // let taskItem = ''
        let matches = []
        // let taskMap = new Map()
        debugger
        let taskTitle = []
        let tempTasks = []
        try {
          for (let item in tasks) {
            if (tasks.hasOwnProperty(item)) {
              taskTitle[item] = tasks[item].title[0]
              tasks[item].list = tasks[item].list.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
              matches[i] = tasks[i].list.split('<li>')
                .filter(function (v) { return v.indexOf('</li>') > -1 })
                  .map(function (value) {
                    return value.split('</li>')[0]
                  })
              i++
            }
          }
          for (let j = 0; j < matches.length; j++) {
            tempTasks['title'] = taskTitle[j]
            for (let k = 0; k < matches[j].length; k++) {
              let task = {}
              // debugger
              task['instruction'] = matches[j][k].replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ')
              task['checked'] = false
              tempTasks.push(task)
              // console.log(self.tasks)
            }
          }
          debugger
          // console.log(JSON.stringify(tempTasks))
          // JSON.stringify(tasks)
          window.localStorage.setItem('tasks', JSON.stringify(tempTasks))
        } catch (error) {
          console.debug(error.message)
        }
      },
      // Speed up calls to hasOwnProperty
      isEmpty (obj) {
        // null and undefined are "empty"
        if (obj == null) {
          return true
        }
        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) {
          return false
        }
        if (obj.length === 0) {
          return true
        }
        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== 'object') {
          return true
        }
        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            return false
          }
        }
        return true
      }
      // onSwipeoutDeleted (item, value, $event) {
      // onSwipeLeft (event, item, value) {
      // },
    }
  }
  
    //   onActionConfirmed() {
    //     setTimeout(() => {
    //       this.$refs.swipeButton.reset();
    //     }, 1000)
    // },
      // var mySwiper = new Swiper('.swiper-container');
      // mySwiper.on('slideChangeEnd',function(){ alert('sample alert');})
      // var coldDrinks = drinks.map(function(drink) {
      //   return ‘iced ’ + drink;
      // });
    // }
</script>
<style scoped>
  .alert {
    background-color: lightgreen;
    width:100%;
    height: 30px;
  }
  .site-block {
    color: red;
  }
  li {
  margin: 8px 0;
}

  .odd {
   color:white;
   background:blue;
  }

  .even {
   color:blue;
   background: white;
  }

  .container {
  margin-top:20px;
  font-size: 20px;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  }
  .row {
    margin-bottom: 10px;
  }  
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
.swipe-button {
  width: 400px;
  margin: 0 auto;
  background-color: #17255A;
  border: 1px solid #17255A;
}
</style>