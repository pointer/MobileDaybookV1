<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>
    <f7-login-screen-title></f7-login-screen-title>
    <f7-list form>
              <f7-list-item>
                  <f7-input name="name" placeholder="Username" type="text" v-model="username"></f7-input>
                  <span class="input-clear-button"></span>
                </f7-list-item>
                <f7-list-item>
                  <f7-input name="pass" type="password" placeholder="Password" v-model="password"></f7-input>
                  <span class="input-clear-button"></span>
                </f7-list-item>      
      <!-- <f7-list-input
        label="Username"
        type="text"
        placeholder="Your username"
        :value="username"
        @input="username = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        label="Password"
        type="password"
        placeholder="Your password"
        :value="password"
        @input="password = $event.target.value"
      ></f7-list-input> -->
    </f7-list>
    <f7-list>
      <!-- <f7-list-button @click="signIn">Sign In</f7-list-button> -->
      <f7-list-button @click="signInOut" v-model="signInOutTitle" close-login-screen>{{signInOutTitle}}</f7-list-button>
    <!-- <f7-block-footer>Some text about login information.<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</f7-block-footer> -->
    </f7-list>
  </f7-page>
</template>

<script>
  export default {
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
        loginScreenTitle: 'Connection'
      }
    },
    created () {
      this.baseUrl = window.localStorage.getItem('baseUrl')
      this.username = window.localStorage.getItem('username')
      this.uid = window.localStorage.getItem('uid')
      this.isLoggedIn = window.sessionStorage.getItem('isLoggedIn')
      this.password = window.sessionStorage.getItem('password')
      this.loginTitle = (this.isLoggedIn === 'true') ? 'Deconnecter' : 'Connecter'
      this.signInOutTitle = (this.isLoggedIn === 'true') ? 'Sign Out' : 'Sign In'
      this.loginScreenTitle = (this.isLoggedIn === 'true') ? 'Deconnection' : 'Connection'
    },
    mounted () {
    },
    computed: {
      // debugger
      // isiOS () {
      //   return window.isiOS
      // }

    },
    methods: {
      setTitles: function (isLoggedIn) {
        const self = this
        // console.log(isLoggedIn)
        // let punchStatus = window.localStorage.getItem('hasPunchedIn')
        self.loginTitle = (this.isLoggedIn === true) ? 'Deconnecter' : 'Connecter'
        self.signInOutTitle = (this.isLoggedIn === true) ? 'Sign Out' : 'Sign In'
        self.loginScreenTitle = (this.isLoggedIn === true) ? 'Deconnection' : 'Connection'
      },
      signInOut: function () {
        // debugger
        const self = this
        // const app = self.$f7
        // const router = self.$f7router
        // app.dialog.alert(`Username: ${self.username}<br>Password: ${self.password}`, () => {
        //   router.back()
        // })
        if (self.isLoggedIn === 'true') {
          return self.signOut()
        }
        return self.signIn()
      },
      signIn: function () {
        // debugger
        const self = this
        // const app = self.$f7
          // const router = self.$f7router
        self.baseUrl = window.localStorage.getItem('baseUrl')
        if (self.baseUrl === '') {
          self.baseUrl = 'http://smartstreamzryubnfhac.devcloud.acquia-sites.com'
        }
        // self.username = window.localStorage.getItem('username')
        // self.uid = window.localStorage.getItem('uid')
        // self.isLoggedIn = window.sessionStorage.getItem('isLoggedIn')
        // self.password = window.sessionStorage.getItem('password')
        let urlLogin = self.baseUrl + '/user/login?_format=json'
        let fetchData = {
          method: 'POST',
          body: JSON.stringify({name: self.username, pass: self.password}),
          // form_id: 'user_login_form',
          crossdomain: true,
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
// if (response.status === 302) {
//       this.$router.push(`/teachers/${id}`);
//     }
        // window.alert(urlLogin)
        // window.alert(fetchData)
        // console.log(fetchData)
        window.fetch(urlLogin, fetchData)
        .then((response) => response.json())
        .then((data) => {
          self.isLoggedIn = true
          // let uid = data.current_user.uid
          window.localStorage.setItem('uid', data.current_user.uid)
          window.localStorage.setItem('username', data.current_user.name)
          window.sessionStorage.setItem('password', self.password)
          window.localStorage.setItem('csrfToken', data.csrf_token)
          window.localStorage.setItem('logoutToken', data.logout_token)
          window.sessionStorage.setItem('isLoggedIn', true)
          self.signInOutTitle = 'Sign Out'
          self.loginScreenTitle = 'Deconnection'
          self.setTitles(true)
          self.$router.back()
          console.log(urlLogin)
        })
          .catch(function (error) {
            console.debug(error)
          })
        // })
      },
      signOut: function () {
        const self = this
        // const app = self.$f7
        // const router = self.$f7router
        let pass = window.sessionStorage.getItem('password')
        let name = window.localStorage.getItem('username')
        let enc = window.btoa(name + ':' + pass)
        let encString = 'Basic ' + enc
        let logoutToken = window.localStorage.getItem('logoutToken')
        let csrfToken = window.localStorage.getItem('csrfToken')
        // debugger
        // let urlLogout = 'http://localhost/user/logout?_format=json'
        let urlLogout = self.baseUrl + '/user/logout'
        // ?csrf_token=' + csrfToken
        // &
        let fetchData = {
          method: 'POST',
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
            'csrf_token': csrfToken,
            'logout_token': logoutToken,
            'Authorization': encString,
            'Accept': 'application/json, application/hal_json'
          }
        }
        window.fetch(urlLogout, fetchData)
        .then((response) => response.json())
        .then((data) => {
          return data
        })
        .then((data) => {
          console.log(data)
          window.sessionStorage.setItem('isLoggedIn', 'false')
          self.signInOutTitle = 'Sign in'
          self.loginScreenTitle = 'Connection'
          self.isLoggedIn = false
          window.sessionStorage.setItem('password', '')
          window.localStorage.setItem('csrfToken', '')
          window.localStorage.setItem('logoutToken', '')
          window.sessionStorage.setItem('isLoggedIn', false)
          this.setTitles(false)
          self.$router.back()
        })
        .catch(function (error) {
          console.debug(error)
        })
      },
      formatTodos: function (todos) {
        const self = this
        // debugger
        // let todoList = JSON.parse(todos)
        // console.log(todos)
        for (let todo in todos) {
          if (todos.hasOwnProperty(todo)) {
            let startDateTime = todos[todo].assign_start_shift.split('T')
            let startDate = startDateTime[0]
            let startTime = startDateTime[1]
            todos[todo].assign_start_shift_date = startDate.substring(8, 10) + '/' + startDate.substring(5, 7) + '/' + startDate.substring(0, 4)
            todos[todo].assign_start_shift_time = startTime
            // todos[todo].assign_start_time = startDateTime[1].replace(/,/g, '')
            todos[todo].assign_start_shift = todos[todo].assign_start_shift_date + '-' + startTime
            let endDateTime = todos[todo].assign_end_shift.split('T')
            let endDate = endDateTime[0]
            let endTime = endDateTime[1]
            todos[todo].assign_end_shift_date = endDate.substring(8, 10) + '/' + endDate.substring(5, 7) + '/' + endDate.substring(0, 4)
            todos[todo].assign_end_shift_time = endTime
            todos[todo].assign_end_shift = todos[todo].assign_end_shift_date + '-' + endTime
            // todos[todo].assign_tasks = todos[todo].assign_tasks_description.replace(/\\r\\n\\t/g, '')
            let tasks = todos[todo].assign_tasks_description.split('\n\t')
            // console.log(tasks)
            for (let task in tasks) {
              if (tasks.hasOwnProperty(task)) {
                tasks[task] = tasks[task].replace(/[^\x20-\x7E]/gmi, '')
                tasks[task] = tasks[task].replace(/<\/?[^>]+(>|$)/g, '')
                tasks[task] = tasks[task].replace(/&nbsp;/gi, '')
              }
            }
            todos[todo].assign_tasks_description = tasks
            self.shiftStart = todos[todo].assign_start_shift
            self.site = todos[todo].assign_site
            self.title = todos[todo].assign_title
          }
        }
        todos = JSON.stringify(todos)
        window.sessionStorage.setItem('todos', todos)
        // console.log(todos)
      }
      /*
      beep: function () {
        let snd = new window.AudioContext('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=')
        snd.play()
      }
      */
    }
  }
</script>