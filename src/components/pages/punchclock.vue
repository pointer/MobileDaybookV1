<template>
<f7-page name="punchclock">
  <f7-navbar  v-bind:title="navTitle"  back-link="Retour" sliding>
<!-- <f7-nav-right>
  </f7-nav-right> -->
  </f7-navbar>
    <f7-block>
        <div class="card">
          <div class="card-header">{{site}}</div>
          <div class="card-content">
            <div class="list media-list">
              <ul>
                <li class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">Usager: {{username}}</div>
                    </div>
                  </div>
                </li>
                <li class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">Date: {{punchDate}}</div>
                    </div>
                  </div>
                </li>
                <li class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">Latitude: {{lat}}</div>
                    </div>
                  </div>
                </li>
                <li class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">Longitude: {{lng}}</div>
                    </div>
                  </div>
                </li>
              </ul>
              <f7-list>
              <f7-list-button  @click="onSend" title="Envoyer"></f7-list-button>
              </f7-list>
            </div>
          </div>
        </div>
    </f7-block>
       </f7-page>

</template>
<script>
 import moment from 'moment'
 export default {
   data () {
     return {
       username: '',
       lat: '',
       lng: '',
       punchDate: '',
       site: '',
       hasPunchedIn: 'false',
       navTitle: 'Prise de service',
       baseUrl: '',
       token: '',
       uid: '',
       password: '',
       siteId: ''
     }
   },
   mounted: function () {
     // console.log(this.$device)
     this.getPunchData()
     this.getPunchStatus()
     if (this.hasPunchedIn === 'true') {
       this.navTitle = 'Fin de service'
     } else {
       this.navTitle = 'Prise de service'
     }
     this.baseUrl = window.localStorage.getItem('baseUrl')
     this.username = window.localStorage.getItem('username')
     this.token = window.localStorage.getItem('csrfToken')
     this.uid = window.localStorage.getItem('uid')
     this.password = window.sessionStorage.getItem('password')
   },
   methods: {
     onSend: function () {
       const self = this
       this.getPunchStatus()
       if (this.hasPunchedIn === 'true') {
         self.punchOut()
       } else {
         self.punchIn()
       }
     },
     getPunchData: function () {
       const self = this
       self.getCoordinates()
       .then(
          function onCoordinatesResolved (coords) {
            return coords
          },
          function onCoordinatesRejected (err) {
            console.warn('failed to obtain coordinates - ', err)
            return { lat: null, long: null }
          }
        )
       .then(function loadData (coords) {
         self.showData(coords)
       })
       .catch(function (err) {
         console.error('error: ', err)
       })
     },
     getCoordinates: function () {
       return new Promise(function (resolve, reject) {
         if (
           !('geolocation' in navigator) ||
           !('getCurrentPosition' in navigator.geolocation)
         ) {
           return Promise.reject(new Error('geolocation API not available'))
         }
         let options = {
           timeout: 10000
         }
       // browser prompts for permission
         navigator.geolocation.getCurrentPosition(
          getPositionCallBack,
          reject,
          options
        )
         function getPositionCallBack (position) {
           let coords = ''
           try {
             coords = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
             }
           } catch (err) {
             return reject(err)
           }
           return resolve(coords)
         }
       })
     },
     punchOut: function () {
       const self = this
       // let urlToken = self.baseUrl + '/rest/session/token'
       let logoutToken = window.localStorage.getItem('logoutToken')
       let enc = window.btoa(this.username + ':' + this.password)
       let encString = 'Basic ' + enc
       let urlPunchOut = self.baseUrl + '/jsonapi/daybook_punch_card/' + this.uid
      // window.fetch(urlToken)
      // .then((response) => response.text())
      // .then((token) => {
       let punchOutData = {
         'data': {
           'type': 'daybook_punch_card',
           'id': this.uid,
           'attributes': {
             'field_dbk_punch_end': self.punchDate,
             'field_dbk_punch_geo_end': {
               'lat': self.lat,
               'lng': self.lng
             }
           }
         }
       }
       let fetchPunchOut = {
         method: 'PATCH',
         body: JSON.stringify(punchOutData),
         headers: {
           'Authorization': encString,
           'Content-Type': 'application/vnd.api+json',
           'Accept': 'application/vnd.api+json',
           'Cache-Control': 'no-cache, no-store',
           'Pragma': 'no-cache',
           'Expires': 0,
           'X-CSRF-Token': logoutToken
         }
       }
       // debugger
       window.fetch(urlPunchOut, fetchPunchOut)
        .then((response) => response.json())
        .then((data) => {
          window.localStorage.setItem('hasPunchedIn', 'false')
          // window.sessionStorage.setItem('id', '')
          // window.sessionStorage.setItem('uuid', '')
          // window.sessionStorage.setItem('nid', '')
          console.log(data)
        })
    // })
     .catch(function (error) {
       console.debug(error)
     })
     },
     punchIn: function () {
       const self = this
       // self.getCsrfToken()
       let token = window.localStorage.getItem('csrfToken')
       // debugger
       // self.baseUrl + '/rest/session/token'
       // let uid = window.localStorage.getItem('uid')
       // let pass = window.sessionStorage.getItem('password')
       // let name = window.localStorage.getItem('username')
       let enc = window.btoa(self.username + ':' + self.password)
       let encString = 'Basic ' + enc
       let urlPunchIn = self.baseUrl + '/jsonapi/daybook_punch_card?_format=api_json'
       //  window.fetch(urlToken)
       // .then((response) => response.text())
       // .then((token) => {
       // debugger
       let punchInData = {
         'data': {
           'type': 'daybook_punch_card',
           'attributes': {
             'status': false,
             'title': self.username,
             'field_dbk_punch_agent': self.uid,
             'field_dbk_punch_site': self.site,
             'field_dbk_punch_start': self.punchDate,
             'field_dbk_punch_geo_start': {
               'lat': self.lat,
               'lng': self.lng
             }
           },
           'relationships': {
             'uid': {
               'data': {
                 'type': 'user--user',
                 'id': self.uid
               }
             }
           }
         }
       }
// ,
//              'nid': {
//                'data': {
//                  'type': 'daybook_site_node',
//                  'nid': self.siteId
//                }
//              }
          //  'Cache-Control': 'no-cache, no-store',
          //  'Pragma': 'no-cache',
          //  'Expires': 0
       let fetchPunchIn = {
         method: 'POST',
         // body: punchInData,
         body: JSON.stringify(punchInData),
         headers: {
           'Authorization': encString,
           'Content-Type': 'application/vnd.api+json',
           'Accept': 'application/vnd.api+json',
           'X-CSRF-Token': token
         }
       }
       // debugger
       window.fetch(urlPunchIn, fetchPunchIn)
          .then((response) => response.json())
          .then((data) => {
            // window.localStorage.setItem('hasPunchedIn', 'true')
            // window.sessionStorage.setItem('id', data.data.id)
            // window.sessionStorage.setItem('uuid', data.data.attributes.uuid)
            // window.sessionStorage.setItem('nid', data.data.attributes.nid)
            console.log(data)
          })
     // })
      .catch(function (error) {
        console.debug(error)
      })
     },
     showData: function (coords) {
       // debugger
       const self = this
       let today = new Date()
       today.setSeconds(0)
       today.setMilliseconds(0)
       self.punchDate = today.toISOString().split('.')[0]
       self.lat = coords.lat
       self.lng = coords.lng
       let currentDate = moment().startOf('day')
       let todos = JSON.parse(window.sessionStorage.getItem('todos'))
       // console.log(todos)
       for (let todo in todos) {
         if (todos.hasOwnProperty(todo)) {
           // console.log(todos[todo].assign_site)
           let startDate = todos[todo].assign_start_shift_date
           let startDateTime = startDate.substring(6, 10) + '-' + startDate.substring(3, 5) + '-' + startDate.substring(0, 2)
           startDate = moment(startDateTime, 'YYYY-MM-DD')
           let duration = moment.duration(startDate.diff(currentDate)).asDays()
           // debugger
           if (duration === 0) {
             self.site = todos[todo].assign_site
             // self.siteId = todos[todo].assign_site_nid
           }
         }
       }
       self.username = window.localStorage.getItem('username')
     },
     getPunchStatus: function () {
       this.hasPunchedIn = window.localStorage.getItem('hasPunchedIn')
       return this.hasPunchedIn
     },
     getCsrfToken: function () {
       const self = this
       // let baseUrl = window.localStorage.getItem('baseUrl')
       let urlToken = self.baseUrl + '/rest/session/token'
       window.fetch(urlToken)
       .then(function (response) {
         if (!response.ok) {
           throw Error(response.statusText)
         }
       // Read the response as json.
         return response.text()
       })
        .then((data) => {
          // debugger
          // let token = data
          window.sessionStorage.setItem('csrfToken', data)
          // console.log(token)
          // return data
        })
        .then((data) => {
          // debugger
          self.onSend()
        })
       .catch(function (error) {
         console.debug(error)
       })
     }
   }
 }
</script>
