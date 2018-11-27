<template>
  <f7-page>
    <f7-navbar title="Main courante" back-link="Back"></f7-navbar>
                 <div class="page-content">
                <!-- <f7-list-item  > -->
                   <!-- <div class="content-block-title">Main courante</div> -->
                      <div class="list media-list">
                        <ul >
                          <li  v-for="(key, value) of tasks" :key="value" v-if="value > 0" >
                                <!-- <label class="item-checkbox item-content"> -->
                                <div class = "item-inner"> 
                                <div class="item-title">{{value}}
                                  <div class="item-after">{{key}}</div>
                                </div>
                              </div> 
                              <label class = "label-switch">
                                                          
                              <input type="checkbox" name="media-checkbox" :value="value"/>
                              <!-- <div class="icon icon-checkbox"></div> -->
                              <div class="checkbox"></div>
                             </label>
                          </li>
                        </ul>
                      </div>
                <!-- </f7-list-item>   -->
                  </div>
  </f7-page>
</template>


<script>
  // import moment from 'moment'
  import VuePullRefresh from 'vue-pull-refresh'
  export default {
    data () {
      return {
        task: '',
        tasks: [],
        matches: []
      }
    },
    created () {
      // console.log(this.$device)
      // this.displayData()
      // this.tasks = JSON.parse(window.sessionStorage.getItem('tasks'))
      this.onRefresh()
      this.tasks = JSON.parse(JSON.stringify(window.localStorage.getItem('tasks')))
      console.log(this.tasks)
      // window.localStorage.getItem('tasks')
      // for (let task in this.tasks) {
      //   if (this.tasks.hasOwnProperty(task)) {
      //     this.tasks[task] = this.tasks[task].replace(/[^\x20-\x7E]/gmi, '')
      //     this.tasks[task] = this.tasks[task].replace(/<\/?[^>]+(>|$)/g, '')
      //     this.tasks[task] = this.tasks[task].replace(/&nbsp;/gi, '')
      //   }
      // }
      // console.log(this.tasks)
      // for (let task in this.tasks) {
      debugger
      // for (let i = 0; i < this.tasks.length; i++) {
      //   // if (this.tasks.hasOwnProperty(task)) {
      //   // console.log(this.tasks[i])
      //   this.matches[i] = this.tasks[i].list.split('<li>')
      //     .filter(function (v) { return v.indexOf('</li>') > -1 })
      //       .map(function (value) {
      //         return value.split('</li>')[0]
      //       })
      // }
      // this.tasks = []
      // for (let ii = 0; ii < this.matches.length; ii++) {
      //   for (let j = 0; j < this.matches[ii].length; j++) {
      //     this.tasks[j] = this.matches[ii][j].replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ')
      //   }
      // }
      // this.tasks.push(array)
      // window.localStorage.setItem('tasks', this.tasks)
      // console.log(this.tasks)
    },
    mounted () {
      // console.log(this.$device)
      // this.onRefresh()
      // this.tasks = JSON.parse(window.localStorage.getItem('tasks'))
      // this.displayData()
      // this.tasks = JSON.parse(window.sessionStorage.getItem('tasks'))
      // debugger
      // this.onRefresh()
      // this.tasks = window.localStorage.getItem('tasks')
      // console.log(this.tasks)
      // for (let task in this.tasks) {
      //   if (this.tasks.hasOwnProperty(task)) {
      //     this.tasks[task] = this.tasks[task].replace(/[^\x20-\x7E]/gmi, '')
      //     this.tasks[task] = this.tasks[task].replace(/<\/?[^>]+(>|$)/g, '')
      //     this.tasks[task] = this.tasks[task].replace(/&nbsp;/gi, '')
      //   }
      // }
    },
    components: {
      // f7Navbar,
      // f7Page,
      // f7BlockTitle
      'vue-pull-refresh': VuePullRefresh
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
        let token = window.sessionStorage.getItem('csrfToken')
        let urlTasks = baseUrl + '/api/tasks/' + uid + '?_format=hal_json'
        let fetchTasks = {
          method: 'GET',
          headers: {
            'Authorization': encString,
            'X-CSRF-Token': token,
            'Accept': 'application/hal+json',
            'Content-Type': 'application/hal+json'
          }
        }
        // return new Promise((resolve, reject) => {
        window.fetch(urlTasks, fetchTasks)
          .then(response => response.json())
          .then(tasks => {
          // .then(responseText => {
          //  let resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText
            debugger
            self.formatTodos(tasks)
            // resolve(tasks)
          }).catch(function (error) {
            console.debug(error)
            // reject(error)
          })
        // }).catch(error => {
        //   console.debug(error)
        // })
      },
      formatTodos (tasks) {
        const self = this
        let i = 0
        let matches = []
        for (let task in tasks) {
          if (tasks.hasOwnProperty(task)) {
            tasks[task].title = tasks[task].title[0]
            tasks[task].list = tasks[task].list.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
            matches[i] = tasks[i].list.split('<li>')
              .filter(function (v) { return v.indexOf('</li>') > -1 })
                .map(function (value) {
                  return value.split('</li>')[0]
                })
            i++
          }
        }
        self.tasks = []
        for (let j = 0; j < matches.length; j++) {
          for (let k = 0; k < matches[j].length; k++) {
            self.tasks[k + 1] = matches[j][k].replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ')
          }
        }
        // for (let i = 0; i < tasks.length; i++) {
        //   // if (this.tasks.hasOwnProperty(task)) {
        //   // console.log(this.tasks[i])
        //   matches[i] = tasks[i].list.split('<li>')
        //     .filter(function (v) { return v.indexOf('</li>') > -1 })
        //       .map(function (value) {
        //         return value.split('</li>')[0]
        //       })
        // }
        // tasks = []
        // for (let ii = 0; ii < matches.length; ii++) {
        //   for (let j = 0; j < matches[ii].length; j++) {
        //     tasks[j] = matches[ii][j].replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ')
        //   }
        // }
        debugger
        console.log(tasks)
        // self.tasks = JSON.stringify(tasks)
        window.localStorage.setItem('tasks', self.tasks)
      }
      // var coldDrinks = drinks.map(function(drink) {
      //   return ‘iced ’ + drink;
      // });
    }
  }
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
  
</style>