<template>
  <f7-page>
    <!-- <vue-pull-refresh :on-refresh="onRefresh"></vue-pull-refresh> -->
    <f7-navbar title="" back-link=""></f7-navbar>
      <div class="page-content">
          <div class="content-block-title">Liste des Affectations</div>
            <div class="list-block accordion-list" >
                <ul>
                  <li class="accordion-item" v-for="todo in todos" :key="todo.assign_title">
                      <a href="#" class="item-content item-link">
                          <div class="item-inner">
                            <div class="item-title">{{todo.assign_start_shift_date}} </div>
                            <div class="item-after"><span class="badge color-blue">{{todo.assign_start_shift_time}}</span></div>
                          </div>
                      </a>
                      <div class="accordion-item-content">
                        <div class="content-block">
                            <h3> <strong><em>{{todo.assign_site}}</em></strong></h3>
                            <p><span v-bind:class="{ alert: showAlert}"><strong><em>Début: </em></strong>{{todo.assign_start_shift}}</span></p>
                            <p> <span v-bind:class="{ alert: showAlert}"><strong><em>Fin : </em></strong>{{todo.assign_end_shift}}</span></p>
                            <p>{{todo.assign_site_address}} &nbsp; {{todo.assign_site_locality}} &nbsp; {{todo.assign_site_postal_code}}</p>
                            <p>{{todo.assign_locality}} </p>
                            <p>{{todo.assign_postal_code}} </p>
                            <section aria-labelledby="obs-label">
                              <h4 id="obs-label">Observations</h4>
                              <p>{{todo.assign_observations}}</p>
                            </section>                                      
                        </div>
                      </div>
                  </li>
                </ul>
            </div>
      </div>
  </f7-page>
</template>
<script>
  import VuePullRefresh from 'vue-pull-refresh'
  export default {
    data () {
      return {
        todos: [],
        showAlert: true
      }
    },
    mounted () {
      // console.log(this.$device)
      // debugger
      // this.onRefresh()
      if (!Array.isArray(this.todos) || !this.todos.length) {
        this.displayData()
      }
      this.todos = JSON.parse(window.sessionStorage.getItem('todos'))
    },
    components: {
      // f7Navbar,
      // f7Page,
      // f7BlockTitle
      'vue-pull-refresh': VuePullRefresh
    },
    methods: {
      displayData: function () {
        this.todos = JSON.parse(window.sessionStorage.getItem('todos'))
        // if (this.todos.length === 0) {
        if (this.todos === null) {
          this.onRefresh()
        }
      },
      onRefresh: function () {
        const self = this
        let baseUrl = window.localStorage.getItem('baseUrl')
        let username = window.localStorage.getItem('username')
        let uid = window.localStorage.getItem('uid')
        let password = window.sessionStorage.getItem('password')
        if (password === '') {
          password = 'agent'
        }
        let enc = window.btoa(username + ':' + password)
        let encString = 'Basic ' + enc
        let token = window.sessionStorage.getItem('csrfToken')
        // let urlActivities = 'http://localhost/api/todos/9?_format=json'
        // console.log(self.baseUrl)
        let urlActivities = baseUrl + '/api/assign/' + uid + '?_format=hal_json'
        console.log(urlActivities)
        let fetchActivities = {
          method: 'GET',
          dataType: 'json',
          // mode: 'no-cors',
          // credentials: 'include',
          headers: {
            // 'Authorization': JSON.stringify(encString),
            'Authorization': encString,
            'X-CSRF-Token': token,
            'Accept': 'application/hal+json',
            'Content-Type': 'application/hal+json'
          }
        }
        window.fetch(urlActivities, fetchActivities)
         .then((response) => {
           return response.json()
         })
       .then((todos) => {
         // self.removeDuplicate(todos)
         self.formatTodos(todos)
         // return todos
       })
        .catch(function (error) {
          console.debug(error)
        })
      },
      formatTodos: function (todos) {
        const self = this
        // debugger
        todos = self.removeDuplicates(todos, 'assign_title')
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
            // let tasks = todos[todo].assign_tasks_description.split('\n\t')
            // // console.log(tasks)
            // for (let task in tasks) {
            //   if (tasks.hasOwnProperty(task)) {
            //     tasks[task] = tasks[task].replace(/[^\x20-\x7E]/gmi, '')
            //     tasks[task] = tasks[task].replace(/<\/?[^>]+(>|$)/g, '')
            //     tasks[task] = tasks[task].replace(/&nbsp;/gi, '')
            //   }
            // }
            // todos[todo].assign_tasks_description = tasks
            self.shiftStart = todos[todo].assign_start_shift
            self.site = todos[todo].assign_site
            self.title = todos[todo].assign_title
          }
        }
        self.todos = JSON.stringify(todos)
        window.sessionStorage.setItem('todos', self.todos)
        console.log(self.todos)
      },
    /*
    beep: function () {
      let snd = new window.AudioContext('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=')
      snd.play()
    }
    */
      removeDuplicates (originalArray, prop) {
        let newArray = []
        let lookupObject = {}
        for (var i in originalArray) {
          // if ((i - 1 >= 0) && (originalArray[i][prop] === originalArray[i - 1][prop])) {
          //   // debugger
          //   originalArray[i]['assign_tasks_description'] += originalArray[i - 1]['assign_tasks_description']
          // }
          // debugger
          lookupObject[originalArray[i][prop]] = originalArray[i]
          // console.log(lookupObject)
        }
        for (i in lookupObject) {
          newArray.push(lookupObject[i])
          // console.log(newArray)
        }
        return newArray
      }
    }
    // function addEvent()
    //   {
    //   // var cal = new calendarPlugin();
    //   let cal = window.plugins.calendarPlugin
    //   console.log("creating event");
    //   let title= "My Sample Appt";
    //   let location = "Los Angeles";
    //   let notes = "This is a sample note";
    //   let startDate = "2012-04-16 09:30:00";
    //   let endDate = "2012-04-16 12:30:00";
    //   let errCall = function(theerror) {
    //   console.log("Error occurred - " + theerror);
    //   }
    //   let succCall = function(themessage) {
    //   console.log("Success - " + themessage);
    //   }
    //   cal.createEvent(title,location,notes,startDate,endDate, succCall, errCall);
    //   return false;
    //   }
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


<!--
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, target-densitydpi=device-dpi" />
  <title>My Calendar Plugin</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">

<script src="assets/Scripts/jquery-1.9.1.min.js"></script>
<script src="assets/Scripts/cordova-2.3.0.js"></script>
<script type="text/javascript" src="assets/Scripts/calendar.js"></script> 
<script type="text/javascript" src="assets/Scripts/index.js"></script> 
<script type="text/javascript">
-->
/*
function addEvent()
{
// var cal = new calendarPlugin();
let cal = window.plugins.calendarPlugin
console.log("creating event");
let title= "My Sample Appt";
let location = "Los Angeles";
let notes = "This is a sample note";
let startDate = "2012-04-16 09:30:00";
let endDate = "2012-04-16 12:30:00";
let errCall = function(theerror) {
 console.log("Error occurred - " + theerror);
 }
let succCall = function(themessage) {
console.log("Success - " + themessage);
 }
cal.createEvent(title,location,notes,startDate,endDate, succCall, errCall);
return false;
}
</script>
</head>
<body>
<input type="button" id="btnAddEvent" onclick="return addEvent();"/>

</body>
</html>

 */