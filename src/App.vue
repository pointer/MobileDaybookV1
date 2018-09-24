<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>
    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view"  url="/" navbar-through :dynamic-navbar="true" main>
        <!-- Navbar -->
        <f7-navbar>
          <f7-nav-left >
            <f7-link icon="icon-bars" open-panel="left"></f7-link>
          </f7-nav-left>
          <f7-nav-center sliding>Mobile Daybook</f7-nav-center>
          <f7-nav-right>
            <f7-link icon="icon-bars" open-panel="right"></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <p v-if="errors.length">
            <b>SVP Corriger le(s)s erreur(s) suivante(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>

          <f7-page>
            <f7-block-title>Navigation</f7-block-title>
            <f7-list>
              <f7-list-item link="/about/" title="About"></f7-list-item>
              <f7-list-item link="/activities/" title="Activités"></f7-list-item>
              <f7-list-item link="/punchclock/" title="Service"></f7-list-item>
              <f7-list-item link="/incident/" title="Incident"></f7-list-item>
            </f7-list>
            <f7-block-title>Themes</f7-block-title>
                <f7-list>
                    <f7-list-item title="iOS Theme" external link="./index.html?theme=ios"></f7-list-item>
                    <f7-list-item title="Material (MD) Theme" external link="./index.html?theme=md"></f7-list-item>
                </f7-list>
            <f7-block>
              <f7-grid>
                <f7-col width="50">
                    <f7-button  open-login-screen="#login-screen" :class="[ isLoggedIn ? 'col button color-red' : 'col button color-green' ]" v-model="loginTitle" v-bind:title="loginTitle">{{loginTitle}}</f7-button>
                </f7-col>
              </f7-grid>
            </f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
    <!-- Login Screen -->
    <f7-login-screen id="login-screen">
      <f7-view>
        <f7-pages>
          <f7-page login-screen>
            <f7-login-screen-title v-model="loginScreenTitle">{{loginScreenTitle}}</f7-login-screen-title>
            <f7-list form>
            <f7-list-item class="control">
              <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
              <f7-label>Entrer https:// URL:</f7-label>
              <f7-input type="url" name="baseurl" id="baseurl" v-model="baseUrl"
              placeholder="https://example.com" pattern="https://.*" size="20" required clear-button >
              </f7-input>
            </f7-list-item>
                      <f7-list-item>
                <f7-input name="name" placeholder="Username" type="text" v-model="username"></f7-input>
                <span class="input-clear-button"></span>
              </f7-list-item>
              <f7-list-item>
                <f7-input name="pass" type="password" placeholder="Password" v-model="password"></f7-input>
                <span class="input-clear-button"></span>
              </f7-list-item>
            </f7-list>
            <!-- </f7-list> -->
            <f7-list>
              <f7-list-button @click="signInOut" v-model="signInOutTitle" close-login-screen>{{signInOutTitle}}</f7-list-button>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-login-screen>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      signInOutTitle: 'Sign In',
      loginScreenOpened: false,
      username: null,
      password: null,
      baseUrl: null,
      uid: null,
      todos: [],
      errors: [],
      isLoggedIn: false,
      loginTitle: 'Connecter',
      loginScreenTitle: 'Entrer'
    }
  },
  created () {
    this.baseUrl = window.localStorage.getItem('baseUrl')
    this.username = window.localStorage.getItem('username')
    // this.setTitles()
  },
  mounted () {
    // this.setTitles()
  },
  computed: {
    isiOS () {
      return window.isiOS
    }
  },
  methods: {
    setTitles: function (isLoggedIn) {
      const self = this
      // console.log(isLoggedIn)
      if (isLoggedIn === false) {
        self.loginTitle = 'Connecter'
        self.signInOutTitle = 'Sign In'
        self.loginScreenTitle = 'Connecter'
      } else {
        self.loginTitle = 'Deconnecter'
        self.signInOutTitle = 'Sign Out'
        self.loginScreenTitle = 'Deconnecter'
      }
    },
    signInOut: function () {
      const self = this
      if (self.isLoggedIn === true) {
        return self.signOut()
      }
      return self.signIn()
    },
    signIn: function () {
      const self = this
      // ProgressIndicator.*
      // window.plugins.ProgressIndicator.showSimple(true)
      console.log(self.baseUrl)
      if (!window.localStorage.getItem('baseUrl')) {
        window.localStorage.setItem('baseUrl', this.baseUrl)
      }
      if (!self.baseUrl) {
        self.errors.push('Ajouter Adresse du site')
        return false
      }
      let urlLogin = self.baseUrl + '/user/login?_format=json'
      // let urlLogin = 'http://localhost/user/login?_format=json'
      // console.log(self.username)
      // console.log(self.password)
      let fetchData = {
        method: 'POST',
        body: JSON.stringify({name: self.username, pass: self.password}),
        form_id: 'user_login_form',
        // crossdomain: true,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      window.fetch(urlLogin, fetchData)
      .then((response) => response.json())
      .then((data) => {
        self.isLoggedIn = true
        let uid = data.current_user.uid
        window.localStorage.setItem('uid', data.current_user.uid)
        window.localStorage.setItem('username', data.current_user.name)
        window.sessionStorage.setItem('password', this.password)
        window.localStorage.setItem('csrfToken', data.csrf_token)
        window.localStorage.setItem('logoutToken', data.logout_token)
        window.sessionStorage.setItem('isLoggedIn', 'true')
        // navigator.notification.beep(1)
        window.alert('')
        return uid
      })
      .then(function (uid) {
        // debugger
        // uid = 'filter[uid.uid][value]=2'
        let pass = window.sessionStorage.getItem('password')
        let name = window.localStorage.getItem('username')
        let enc = window.btoa(name + ':' + pass)
        let encString = 'Basic ' + enc
        let token = window.sessionStorage.getItem('csrfToken')
        // let urlActivities = 'http://localhost/api/todos/9?_format=json'
        let urlActivities = self.baseUrl + '/api/todos/' + uid + '?_format=json'
        // console.log(urlActivities)
        let fetchActivities = {
          method: 'GET',
          dataType: 'json',
          // mode: 'no-cors',
          headers: {
            // 'Authorization': JSON.stringify(encString),
            'Authorization': encString,
            'X-CSRF-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
        return window.fetch(urlActivities, fetchActivities)
      })
       .then((response) => {
         return response.json()
       })
       .then((todos) => {
         // todos = JSON.stringify(todos)
         // self.formatTodos(JSON.stringify(todos))
         // console.log(todos)
         return todos
       })
       .then((todos) => {
         self.formatTodos(todos)
         self.setTitles(true)
         // self.$router.push('activities')
         // window.plugins.ProgressIndicator.hide()
       })
        .catch(function (error) {
          console.debug(error)
        })
      // })
    },
    signOut: function () {
      const self = this
      // let pass = window.sessionStorage.getItem('password')
      // let name = window.localStorage.getItem('username')
      // let enc = window.btoa(name + ':' + pass)
      // let encString = 'Basic ' + enc
      let logout = window.localStorage.getItem('logoutToken')
      let csrfToken = window.localStorage.getItem('csrfToken')
      // debugger
      // let urlLogout = 'http://localhost/user/logout?_format=json'
      let urlLogout = self.baseUrl + '/user/logout?csrf_token=' + csrfToken
      // &
      let fetchData = {
        method: 'POST',
        // 'csrf_token': csrfToken,
        'logout_token': logout
        // 'Authorization': encString
      }
      window.fetch(urlLogout, fetchData)
      .then((response) => response.json())
      .then((data) => {
        // todos = JSON.stringify(todos)
        // self.formatTodos(JSON.stringify(todos))
        // console.log(todos)
        return data
      })
      .then((data) => {
        console.log(data)
        window.sessionStorage.setItem('isLoggedIn', 'false')
        self.isLoggedIn = false
        this.setTitles(false)
      })
      .catch(function (error) {
        console.debug(error)
      })
    },
    formatTodos: function (todos) {
      // const self = this
      // debugger
      // let todoList = JSON.parse(todos)
      for (let todo in todos) {
        if (todos.hasOwnProperty(todo)) {
          let startDateTime = todos[todo].assign_start_shift.split('-')
          let startDate = startDateTime[0]
          let startTime = startDateTime[1]
          todos[todo].assign_start_shift_date = startDate.substring(3, 5) + '/' + startDate.substring(0, 2) + '/' + startDate.substring(6, 10)
          todos[todo].assign_start_shift_time = startTime
          // todos[todo].assign_start_time = startDateTime[1].replace(/,/g, '')
          todos[todo].assign_start_shift = todos[todo].assign_start_shift_date + ' -' + startTime
          let endDateTime = todos[todo].assign_end_shift.split('-')
          let endDate = endDateTime[0]
          let endTime = endDateTime[1]
          todos[todo].assign_end_shift_date = endDate.substring(3, 5) + '/' + endDate.substring(0, 2) + '/' + endDate.substring(6, 10)
          todos[todo].assign_end_shift_time = endTime
          todos[todo].assign_end_shift = todos[todo].assign_end_shift_date + ' -' + endTime
          // todos[todo].assign_tasks = todos[todo].assign_tasks.replace(/\\n\\t/g, '')
          let tasks = todos[todo].assign_tasks.split('\n\t')
          for (let task in tasks) {
            if (tasks.hasOwnProperty(task)) {
              tasks[task] = tasks[task].replace(/[^\x20-\x7E]/gmi, '')
            }
          }
          todos[todo].assign_tasks = tasks
        }
      }
      todos = JSON.stringify(todos)
      window.sessionStorage.setItem('todos', todos)
      // console.log(todos)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@font-face {
    font-family: 'Fira Sans';
    src: local('FiraSans-Regular'),
    url('/media/fonts/FiraSans-Regular.woff2') format('woff2');
}

legend {
    background-color: #000;
    color: #fff;
    padding: 3px 6px;
}

.output {
    font: 1rem 'Fira Sans', sans-serif;
}

.control {
    font-size: .8rem;
    margin: 1rem 0;
}

input:invalid:not(:focus) {
    outline: 1px solid #f00;
}

.nav-bar {
  background-color: #103E50;
}
.is-red{
    color: red;
}
.is-blue{
    color: blue;
}

</style>
