<template>
    <!-- <vue-pull-refresh :on-refresh='onRefresh'></vue-pull-refresh> -->
  <f7-page>
    <f7-navbar back-link sliding>
      <f7-nav-center sliding style='text-align:center'>Mobile Daybook</f7-nav-center>
      <f7-nav-right>
        <f7-link icon='icon-bars' open-panel='right'></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <div class='block-title' style='text-align:center'>
      <h4>Liste des Affectations</h4>
    </div>
    <div class='list-block accordion-list'>
      <ul>
        <li class='accordion-item' v-for='(todo, key)  in todos' :key='key'>
          <a href='#' class='item-content item-link'>
            <div class='item-inner'>
              <div class='item-title'>{{todo.assign_start_shift_date}}</div>
              <div class='item-after'>
                <span class='badge color-blue'>{{todo.assign_start_shift_time}}</span>
              </div>
            </div>
          </a>
          <div class='accordion-item-content'>
            <div class='content-block'>
              <h3>
                <strong>
                  <em>{{todo.assign_site}}</em>
                </strong>
              </h3>
              <p>
                <span v-bind:class='{ alert: showAlert}'>
                  <strong>
                    <em>Début:</em>
                  </strong>
                  {{todo.assign_start_shift}}
                </span>
              </p>
              <p>
                <span v-bind:class='{ alert: showAlert}'>
                  <strong>
                    <em>Fin :</em>
                  </strong>
                  {{todo.assign_end_shift}}
                </span>
              </p>
              <p>{{todo.assign_site_address}} &nbsp; {{todo.assign_site_locality}} &nbsp; {{todo.assign_site_postal_code}}</p>
              <p>{{todo.assign_locality}}</p>
              <p>{{todo.assign_postal_code}}</p>
              <section aria-labelledby='obs-label'>
                <h4 id='obs-label'>Observations</h4>
                <p>{{todo.assign_observations}}</p>
              </section>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </f7-page>
</template>
<script>
// import VuePullRefresh from 'vue-pull-refresh'
import moment from 'moment'
import 'moment/locale/fr'
// import Calendar from 'cordova-plugin-calendar'
// Vue.use(Calendar, '$calendar')
export default {
  data () {
    return {
      todos: {},
      showAlert: true,
      createCalOptions: {},
      eventTitle: '',
      eventLocation: '',
      eventNotes: '',
      eventStart: '',
      eventEnd: ''
    }
  },
  mounted () {
    // console.log(this.$device)
    // debugger
    moment.locale('fr')
    // if (window.localStorage.getItem('isCalendar')) {
    //   return window.plugins.calendar.openCalendar()
    // }
    this.displayData()
    // EventBus.$on('pleaseRefresh', onRefresh => {
    //   this.displayData()
    // })
    // window.addEventListener('pleaseRefresh', this.displayData)
  },
  destroyed () {
    window.localStorage.setItem('isCalendar', false)
    // window.removeEventListener('pleaseRefresh', this.displayData)
  },
  created () {
    // window.addEventListener('pleaseRefresh', this.displayData)
    // this.$eventHub.$on('pleaseRefresh', this.displayData)
  },
  beforeDestroy () {
    // this.$eventHub.$off('pleaseRefresh')
  },
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    next(vm => {
      // access to component instance via `vm`
    })
  },
  beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  },
  methods: {
    onConfirm (buttonIndex) {
      const self = this
      if (buttonIndex === 1) {
        return window.plugins.calendar.openCalendar()
      } else {
        self.hasReadWritePermission()
        if (self.isEmpty(self.todos)) {
          self.onRefresh()
        }
      }
    },
    displayData: function () {
      const self = this
      self.todos = JSON.parse(window.localStorage.getItem('todos'))
      // debugger
      navigator.notification.beep(1)
      navigator.notification.confirm(
        'Voulez-vous verifier si les vacations\nsont déjà dans le Calendrier?', // message
        self.onConfirm, // callback to invoke with index of button pressed
        'Vérifier Vacations dans Calendrier', // title
        ['Verifier', 'Continuer'] // buttonLabels
    )
      // self.populateTodos(self.todos)
      // self.createCalendar(self.todos)
    },
    onRefresh: function () {
      const self = this
      let baseUrl = window.localStorage.getItem('baseUrl')
      let username = window.localStorage.getItem('username')
      let uid = window.localStorage.getItem('uid')
      let password = window.sessionStorage.getItem('password')
      if (self.isEmpty(password)) {
        password = 'agent'
      }
      let enc = window.btoa(username + ':' + password)
      let encString = 'Basic ' + enc
      let token = window.sessionStorage.getItem('csrfToken')
      // let urlActivities = 'http://localhost/api/todos/9?_format=json'
      // console.log(self.baseUrl)
      let urlActivities = baseUrl + '/api/assign/' + uid + '?_format=hal_json'
      // console.log(urlActivities)
      let fetchActivities = {
        method: 'GET',
        dataType: 'json',
        // mode: 'no-cors',
        // credentials: 'include',
        headers: {
          // 'Authorization': JSON.stringify(encString),
          Authorization: encString,
          'X-CSRF-Token': token,
          Accept: 'application/hal+json',
          'Content-Type': 'application/hal+json'
        }
      }
      window
        .fetch(urlActivities, fetchActivities)
        .then(function (response) {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response.json()
        })
        .then(function (todos) {
          window.localStorage.setItem('isCalendar', true)
          return self.createCalendarEvents(todos)
          // return window.plugins.calendar.openCalendar()
        })
        .catch(function (error) {
          console.debug(error)
        })
    },
    createCalendarEvents (todos) {
      const self = this
      self.todos = todos
      // window.plugins.calendar.listCalendars(
      //   function (_calendars) {
      //     _calendars.forEach(function (_calendar) {
      //       console.log(_calendar.name)
      //       if (_calendar.name === 'assignCalendar') {
      //         let onDeleteFail = function (theerror) {
      //           console.log('Error occurred - ' + theerror)
      //         }
      //         let onDeleteSuccess = function (themessage) {
      //           console.log('Success - ' + themessage + 'deleted Calendar')
      //         }
      //         window.plugins.calendar.deleteCalendar(
      //           'assignCalendar',
      //           onDeleteSuccess,
      //           onDeleteFail
      //         )
      //       }
      //     })
      //   },
      //   function (err) {
      //     console.error('Error listing calendars: ' + err)
      //   }
      // )
      self.createCalOptions = window.plugins.calendar.getCreateCalendarOptions()
      self.createCalOptions.calendarName = 'assignCalendar'
      self.createCalOptions.calendarColor = '#0892d0'
      window.plugins.calendar.createCalendar(
        self.createCalOptions,
        self.createEvents,
        self.oncreateCalendarFail
      )
      // console.log(self.iscalendarCeated)
      // if (self.iscalendarCeated === true) {
      // navigator.notification.beep(1)
      // self.createEvents()
      // }
    },
    createEvents () {
      const self = this
      let todos = self.todos
      // console.log(todos)
      // navigator.notification.beep(1)
      for (let todo in todos) {
        if (todos.hasOwnProperty(todo)) {
          let eventStart = new Date(todos[todo].assign_start_shift)
          let eventEnd = new Date(todos[todo].assign_end_shift)
          let eventTitle = todos[todo].assign_title
          let eventLocation =
            todos[todo].assign_site +
            ' ' +
            todos[todo].assign_site_address +
            ' ' +
            todos[todo].assign_site_locality +
            ' ' +
            todos[todo].assign_site_postal_code
          let eventNotes = todos[todo].assign_observations
          // window.plugins.calendar.deleteEvent(
          //   eventTitle,
          //   eventLocation,
          //   eventNotes,
          //   eventStart,
          //   eventEnd,
          //   self.onDeleteEventSuccess,
          //   self.onDeleteEventFailed
          // )
          window.plugins.calendar.createEventWithOptions(
            eventTitle,
            eventLocation,
            eventNotes,
            eventStart,
            eventEnd,
            self.createCalOptions,
            self.onCreateEventSuccess,
            self.onCreateEventFailed
          )
        }
      }
    },
    // window.plugins.calendar.createEventWithOptions(
    oncreateCalendarSuccess () {
      const self = this
      console.log('oncreateCalendarSuccess.....')
      self.createEvents()
    },
    oncreateCalendarFail (error) {
      console.log('onCreateEventFailed.....', error)
    },
    onfindEventFailed (error) {
      console.log('onfindEventFailed.....', error)
    },
    onfindEventSuccess () {
      // const self = this
      console.log('onfindEventSuccess.....')
    },
    createEvent () {
      const self = this
      window.plugins.calendar.createEventWithOptions(
        self.eventTitle,
        self.eventLocation,
        self.eventNotes,
        self.eventStart,
        self.eventEnd,
        self.createCalOptions,
        self.onCreateEventSuccess,
        self.onCreateEventFailed
      )
    },
    onCreateEventFailed (error) {
      console.log('onCreateEventFailed.....', error)
    },
    onCreateEventSuccess () {
      // const self = this
      console.log('onCreateEventSuccess.....')
    },
    onModifyError (error) {
      console.log('onModifyError.....:', error)
    },
    onModifySuccess () {
      console.log('onModifySuccess.....')
    },
    hasReadWritePermission () {
      const self = this
      window.plugins.calendar.hasReadWritePermission(function (result) {
        if (result === false) {
          result = self.requestReadWritePermission()
        }
        // console.log('Read Write Permission : ', result)
        return result
      })
    },
    requestReadWritePermission () {
      // no callbacks required as this opens a popup which returns async
      window.plugins.calendar.requestReadWritePermission(function (result) {
        // console.log('Request R/W Permission : ', result)
        return result
      })
    },
    isEmpty (obj) {
      // null and undefined are 'empty'
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
    },
    onSuccess (message) {
      console.log(message)
    },
    onFail (error) {
      console.log(error)
    }
  }
}
</script>
<style scoped>
.alert {
  background-color: lightgreen;
  width: 100%;
  height: 30px;
}
.site-block {
  color: red;
}
li {
  margin: 8px 0;
}

.odd {
  color: white;
  background: blue;
}

.even {
  color: blue;
  background: white;
}

.container {
  margin-top: 20px;
  font-size: 20px;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
}
.row {
  margin-bottom: 10px;
}
</style>
// let retVal = window.plugins.calendar.deleteEvent(title, eventLocation, notes, startDateTime, endDateTime, function success (eventId) { console.log('eventId:', eventId) }, function fail (error) { console.log('error: ', error) })
// let retVal = window.plugins.calendar.deleteEvent(title, eventLocation, notes, startDateTime, endDateTime, self.onSuccess, self.onError)
// console.log('DeleteEvent:', retVal)
// let result = window.plugins.calendar.findEvent(title, eventLocation, notes, startDateTime, endDateTime, self.onSuccess, self.onError)
// console.log('find:', result)
// if (result) {
//   result = window.plugins.calendar.modifyEvent(title, eventLocation, notes, startDateTime, endDateTime, title, eventLocation, notes, startDateTime, endDateTime, self.onSuccess, self.onError)
//   console.log('modifyEventInNamedCalendar:', result)
// } else {
//   let result = self.createEvent(title, eventLocation, notes, startDateTime, endDateTime, self.onSuccess, self.onError)
//   console.log('CreateEvent:', result)
// }
// navigator.notification.alert('You are the winner!', 'Game Over', 'Done')
// navigator.notification.vibrate(2500)

        //   if (cordova.platformId === 'android') {
        // // Omit Contacts from Android calendar list
        //     if (!_calendar.name.match(/Contacts/i)) {
        //       calendars.push(_calendar)
        //     }
        //   } else { // cordova.platformId === 'ios'
        //   // Omit Birthdays and Subscriptions as they are read-only
        //     if (!_calendar.type.match(/Subscription/i) && !_calendar.type.match(/Birthday/i)) {
        //       calendars.push(_calendar)
        //     }
        //   }