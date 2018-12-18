<template>
<f7-page name="punchclock">
    <f7-navbar  back-link="" sliding>
      <f7-nav-center sliding style="text-align:center">Mobile Daybook</f7-nav-center>
      <!-- &nbsp; &nbsp; &nbsp;  -->
      <f7-nav-right>
      <f7-link icon="icon-bars" open-panel="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>
  <!-- <div class="page-content"> -->
    <div class="block-title" style="text-align:center"><h4>{{navTitle}}</h4></div>
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
  <!-- </div>  -->
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
       hasPunchedIn: Boolean(),
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
     let punchStatus = window.localStorage.getItem('hasPunchedIn')
     this.navTitle = (punchStatus === 'true') ? 'Fin de service' : 'Prise de service'
     this.baseUrl = window.localStorage.getItem('baseUrl')
     this.username = window.localStorage.getItem('username')
     this.token = window.localStorage.getItem('csrfToken')
     this.uid = window.localStorage.getItem('uid')
     this.password = window.sessionStorage.getItem('password')
   },
   methods: {
     onSend: function () {
       const self = this
       // console.log(this.navTitle)
       let punchStatus = window.localStorage.getItem('hasPunchedIn')
       // punchStatus === true ? self.punchOut() : self.punchIn()
       if (punchStatus === 'true') {
         self.punchOut()
       } else {
        // if (punchStatus === 'false') {
         self.punchIn()
        // }
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
       // let token = self.getCsrfToken()
       let baseUrl = window.localStorage.getItem('baseUrl')
       // let urlToken = baseUrl + '/rest/session/token'
       let token = window.localStorage.getItem('csrfToken')
       // console.log(token)
       let enc = window.btoa(this.username + ':' + this.password)
       let encString = 'Basic ' + enc
       let uuid = window.sessionStorage.getItem('uuid')
       let uid = window.localStorage.getItem('uid')
       // let sessionName = window.localStorage.getItem('session_name')
       // let sessId = window.localStorage.getItem('sessid')
       // let cookie = sessionName + '=' + sessId
       let urlPunchOut = baseUrl + '/jsonapi/node/daybook_punch_card_node/' + uuid + '?_format=api_json'
       let punchOutData = {
         'data': {
           'type': 'node--daybook_punch_card_node',
           'id': uuid,
           'attributes': {
             'status': true,
             'title': self.username,
             'field_dbk_punch_end': self.punchDate,
             'field_dbk_punch_geo_end': {
               'lat': self.lat,
               'lng': self.lng
             }
           },
           'relationships': {
             'uid': {
               'data': {
                 'type': 'user--user',
                 'id': uid
               }
             }
           }
         }
       }
       let fetchPunchOut = {
         method: 'PATCH',
         body: JSON.stringify(punchOutData),
         headers: {
           'X-CSRF-Token': token,
           'Authorization': encString,
           'Content-Type': 'application/vnd.api+json',
           'Accept': 'application/vnd.api+json'
         }
        //  mode: 'cors', // no-cors, cors, *same-origin
         // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
         // redirect: 'follow', // manual, *follow, error
         // referrer: 'no-referrer' // no-referrer, *client
       }
       // 'Set-Cookie': JSON.stringify(cookie)
       window.fetch(urlPunchOut, fetchPunchOut)
         .then(function (response) {
           if (!response.ok) {
             throw Error(response.statusText)
           }
           return response.json()
         }).then(function (data) {
           window.localStorage.setItem('hasPunchedIn', false)
           window.sessionStorage.setItem('id', '')
           window.sessionStorage.setItem('uuid', '')
           window.sessionStorage.setItem('nid', '')
           // debugger
           // console.log(data)
           self.$router.back()
         }).catch(function (error) {
           console.log(error)
         })
      //  window.fetch(urlToken)
      //   .then((response) => response.text())
      //   .then((token) => {
      //     console.log(token)
      //     let enc = window.btoa(this.username + ':' + this.password)
      //     let encString = 'Basic ' + enc
      //     let uuid = window.sessionStorage.getItem('uuid')
      //     let uid = window.localStorage.getItem('uid')
      //     let sessionName = window.localStorage.getItem('session_name')
      //     let sessId = window.localStorage.getItem('sessid')
      //     let cookie = sessionName + '=' + sessId
      //     let urlPunchOut = self.baseUrl + '/jsonapi/node/daybook_punch_card_node/' + uuid
      //     // + '?_format=api_json'
      //     let punchOutData = {
      //       'data': {
      //         'type': 'node--daybook_punch_card_node',
      //         'id': uuid,
      //         'attributes': {
      //           'status': true,
      //           'title': self.username,
      //           'field_dbk_punch_end': self.punchDate,
      //           'field_dbk_punch_geo_end': {
      //             'lat': self.lat,
      //             'lng': self.lng
      //           }
      //         },
      //         'relationships': {
      //           'uid': {
      //             'data': {
      //               'type': 'user--user',
      //               'id': uid
      //             }
      //           }
      //         }
      //       }
      //     }
      //     let fetchPunchOut = {
      //       method: 'PATCH',
      //       body: punchOutData,
      //       mode: 'cors', // no-cors, cors, *same-origin
      //       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //       headers: {
      //         'X-CSRF-Token': token,
      //         'Authorization': encString,
      //         'Content-Type': 'application/vnd.api+json',
      //         'Accept': 'application/vnd.api+json'
      //       }
      //       // redirect: 'follow', // manual, *follow, error
      //       // referrer: 'no-referrer' // no-referrer, *client
      //     }
      //     //'Set-Cookie': JSON.stringify(cookie)
      //     window.fetch(urlPunchOut, fetchPunchOut)
      //       .then(function (response) {
      //         if (!response.ok) {
      //           throw Error(response.statusText)
      //         }
      //         return response.json()
      //       }).then(function (data) {
      //         window.localStorage.setItem('hasPunchedIn', false)
      //         window.sessionStorage.setItem('id', '')
      //         window.sessionStorage.setItem('uuid', '')
      //         window.sessionStorage.setItem('nid', '')
      //         // debugger
      //         // console.log(data)
      //         self.$router.back()
      //       }).catch(function (error) {
      //         console.log(error)
      //       })
      //   })
      //  .catch(function (error) {
      //    console.debug(error)
      //  })
     },
     punchIn: function () {
       // debugger
       const self = this
       // let token = self.getCsrfToken()
       let token = window.localStorage.getItem('csrfToken')
       let uid = window.localStorage.getItem('uid')
       // let baseUrl + '/rest/session/token'
       let baseUrl = window.localStorage.getItem('baseUrl')
       let pass = window.sessionStorage.getItem('password')
       let name = window.localStorage.getItem('username')
       let enc = window.btoa(name + ':' + pass)
       let encString = 'Basic ' + enc
       // console.log(encString)
       let urlPunchIn = baseUrl + '/jsonapi/node/daybook_punch_card_node?_format=api_json'
       let punchInData = {
         'data': {
           'type': 'node--daybook_punch_card_node',
           'attributes': {
             'status': true,
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
                 'id': uid
               }
             }
           }
         }
       }
          //  'relationships': {
          //    'author': {
          //      'data': { 'type': 'people', 'id': uid }
          //    }
          //  }
       let fetchPunchIn = {
         method: 'POST',
         headers: {
           'Authorization': encString,
           'Content-Type': 'application/vnd.api+json',
           'Accept': 'application/vnd.api+json',
           'X-CSRF-Token': token
         },
         body: JSON.stringify(punchInData)
       }
       window.fetch(urlPunchIn, fetchPunchIn)
        .then(function (response) {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response.json()
        }).then(function (data) {
          window.localStorage.setItem('hasPunchedIn', true)
          window.sessionStorage.setItem('id', data.data.id)
          window.sessionStorage.setItem('uuid', data.data.attributes.uuid)
          window.sessionStorage.setItem('nid', data.data.attributes.nid)
          // debugger
          console.log(data)
          self.$router.back()
        }).catch(function (error) {
          console.log(error)
        })
      //  window.fetch(urlPunchIn, fetchPunchIn)
      //     .then((response) => response.json())
      //     .then((data) => {
      //       window.localStorage.setItem('hasPunchedIn', true)
      //       window.sessionStorage.setItem('id', data.data.id)
      //       window.sessionStorage.setItem('uuid', data.data.attributes.uuid)
      //       window.sessionStorage.setItem('nid', data.data.attributes.nid)
      //       // debugger
      //       console.log(data)
      //       self.$router.back()
      //     })
      // .catch(function (error) {
      //   console.debug(error)
      // })
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
       // return this.hasPunchedIn
     },
     getCsrfToken: function () {
       const self = this
       // let baseUrl = window.localStorage.getItem('baseUrl')
       let urlToken = self.baseUrl + '/rest/session/token'
       window.fetch(urlToken)
          .then((response) => response.json())
          .then((data) => {
            return data
            // window.sessionStorage.setItem('csrfToken', data)
          })
      .catch(function (error) {
        console.debug(error)
      })
      //  window.fetch(urlToken)
      //  .then(function (response) {
      //    if (!response.ok) {
      //      throw Error(response.statusText)
      //    }
      //  // Read the response as json.
      //    return response.text()
      //  })
      //   .then((data) => {
      //     // debugger
      //     // let token = data
      //     window.sessionStorage.setItem('csrfToken', data)
      //     // console.log(token)
      //     // return data
      //   })
      //   // .then((data) => {
      //   //   // debugger
      //   //   self.onSend()
      //   // })
      //  .catch(function (error) {
      //    console.debug(error)
      //  })
     }
   }
 }
</script>
