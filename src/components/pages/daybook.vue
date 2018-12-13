<template>
    <f7-page name="daybook">
    <f7-navbar  v-bind:title="navTitle"  back-link="" sliding>   </f7-navbar>
        <f7-list form>
          <f7-list-item>
          <f7-input type="text" :value="subject" @input="subject = $event.target.value" placeholder="sujet du message" clear-button></f7-input>
          </f7-list-item>
            <f7-list-item>
                    <textarea v-text="message" v-model="message" placeholder="message main courante"></textarea>
            <span class="input-clear-button"></span>
            </f7-list-item>
            <f7-list-button @click= "sendDaybook()">Envoyer</f7-list-button>
            <!-- <f7-block-footer>Some text about login information.<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</f7-block-footer> -->
        </f7-list>
    </f7-page>
</template>

<script>
  export default {
    data () {
      return {
        message: '',
        subject: '',
        navTitle: '',
        daybookCreated: Boolean()
      }
    },
    methods: {
      sendDaybook: function () {
        // debugger
        const self = this
        // console.log(value)
        // console.log($event.target.checked)
        // self.$emit('input', event.target.checked)
        self.daybookCreated = window.localStorage.getItem('daybookCreated')
        self.daybookCreated === 'true' ? self.createDaybookComment(this.subject, this.message) : self.createDaybook(this.subject, this.message)
        // `this` inside methods points to the Vue instance
        // window.alert('Hello ' + this.item + '!')
        // // `event` is the native DOM event
        // if (event) {
        //   event.preventDefault()
        //   window.alert(item)
        //   window.alert(event.target.tagName)
        // }
      },
      createDaybook (subject, message) {
        // debugger
        const self = this
        let baseUrl = window.localStorage.getItem('baseUrl')
        let token = window.localStorage.getItem('csrfToken')
        // let urlToken = baseUrl + '/rest/session/token'
        // debugger
        let pass = window.sessionStorage.getItem('password')
        let name = window.localStorage.getItem('username')
        let uid = window.localStorage.getItem('uid')
        let enc = window.btoa(name + ':' + pass)
        let encString = 'Basic ' + enc
        // let nid = window.sessionStorage.getItem('nidDaybook')
        // console.log(encString)
        // let daybookUrl = self.baseUrl + '/jsonapi/node/daybook_daybook_node/' + uuidDaybook + '?_format=api_json'
        // let daybookUrl = baseUrl + '/entity/comment?_format=hal_json'
        let daybookUrl = baseUrl + '/jsonapi/node/daybook_daybook_node?_format=api_json'
        let daybookData = {
          'data': {
            'type': 'node--daybook_daybook_node',
            'attributes': {
              'status': true,
              'title': name,
              'body': message
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
        let daybookFetch = {
          method: 'POST',
          // credentials: 'include',
          headers: {
            'Authorization': encString,
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
            'X-CSRF-Token': token
          },
          body: JSON.stringify(daybookData)
        }
        window.fetch(daybookUrl, daybookFetch)
          .then((response) => response.json())
          .then((data) => {
            // debugger
            window.localStorage.setItem('daybookCreated', true)
            window.localStorage.setItem('idDaybook', data.data.id)
            window.localStorage.setItem('uuidDaybook', data.data.attributes.uuid)
            window.localStorage.setItem('nidDaybook', data.data.attributes.nid)
            console.log(data)
            self.$router.back()
          })
      .catch(function (error) {
        console.debug(error)
      })
      },
      createDaybookComment (subject, message) {
        // debugger
        const self = this
        let baseUrl = window.localStorage.getItem('baseUrl')
        let urlToken = baseUrl + '/rest/session/token'
        // let pass = window.sessionStorage.getItem('password')
        // let name = window.localStorage.getItem('username')
        // let uid = window.localStorage.getItem('uid')
        // let enc = window.btoa(name + ':' + pass)
        // let encString = 'Basic ' + enc
        // let nid = window.localStorage.getItem('nidDaybook')
        // console.log(encString)
        // let daybookUrl = self.baseUrl + '/jsonapi/node/daybook_daybook_node/' + uuidDaybook + '?_format=api_json'
        // let daybookUrl = baseUrl + '/node/' + nid + '/#comments'
        // let daybookUrl = baseUrl + '/entity/comment?_format=hal_json'
        // articles/1/relationships/comments
        // let daybookUrlRelation = baseUrl + '/rest/relation/comment/comment/entity_id'
        window.fetch(urlToken)
          .then((response) => response.text())
          .then((token) => {
            let pass = window.sessionStorage.getItem('password')
            let name = window.localStorage.getItem('username')
            let enc = window.btoa(name + ':' + pass)
            let encString = 'Basic ' + enc
            let nid = window.sessionStorage.getItem('nidDaybook')
            let uid = window.localStorage.getItem('uid')
            // console.log(encString)
          // let daybookUrl = self.baseUrl + '/jsonapi/node/daybook_daybook_node/' + uuidDaybook + '?_format=api_json'
            let daybookUrl = baseUrl + '/entity/comment?_format=hal_json'
            let daybookUrlRelation = JSON.stringify(baseUrl + '/rest/relation/comment/comment/entity_id')
            let daybookData = {
              '_links': {
                'type': {'href': baseUrl + '/rest/type/comment/comment'},
                [daybookUrlRelation]: {'href': baseUrl + '/rest/type/comment/comment/node/' + nid}
              },
              'entity_id': [{'target_id': nid}],
              'entity_type': [{'value': 'node--daybook_daybook_node'}],
              'comment_type': [{'target_id': 'comment'}],
              'status': [{'value': '1'}],
              'field_name': [{'value': 'comment'}],
              'subject': [{'value': subject}],
              'uid': [{'target_id': uid}],
              'name': [{'value': name}],
              'comment_body': [{'value': message}]
            }
            let daybookFetch = {
              method: 'POST',
              body: JSON.stringify(daybookData),
              mode: 'no-cors',
              header: {
                'Authorization': encString,
                'Content-Type': 'application/hal+json',
                'Accept': 'application/hal+json',
                'X-CSRF-Token': token,
                'Access-Control-Allow-Credentials': 'http://localhost:8080'
              }
            }
            // debugger
            window.fetch(daybookUrl, daybookFetch)
              .then((response) => response.json())
              .then((data) => {
                window.localStorage.setItem('daybookCreated', true)
                window.localStorage.setItem('idDaybook', data.data.id)
                window.localStorage.setItem('uuidDaybook', data.data.attributes.uuid)
                window.localStorage.setItem('nidDaybook', data.data.attributes.nid)
                // debugger
                console.log(data)
                self.$router.back()
              })
          .catch(function (error) {
            console.debug(error)
          })
          })
         .catch(function (error) {
           console.debug(error)
         })
      },
      getCsrfToken: function () {
        // const self = this
        let baseUrl = window.localStorage.getItem('baseUrl')
        let urlToken = baseUrl + '/rest/session/token'
        window.fetch(urlToken)
           .then((response) => response.json())
           .then((data) => {
             return data
             // window.sessionStorage.setItem('csrfToken', data)
           })
       .catch(function (error) {
         console.debug(error)
       })
      }
    }
  }
</script>


// {
// "entity_id": [{
// "target_id": 1
// }],
// "entity_type": [{
// "value": "node"
// }],
// "comment_type": [{
// "target_id": "comment"
// }],
// "field_name": [{
// "value": "comment"
// }],
// "subject": [{
// "value": "Goodbye World"
// }],
// "comment_body": [{
// "value": "comment which you want write"
// }]
// }
          // credentials: 'include',


        // window.fetch(urlToken)
        //   .then((response) => response.text())
        //   .then((token) => {
        //     debugger
        //     let pass = window.sessionStorage.getItem('password')
        //     let name = window.localStorage.getItem('username')
        //     let uid = window.localStorage.getItem('uid')
        //     let enc = window.btoa(name + ':' + pass)
        //     let encString = 'Basic ' + enc
        //     // let nid = window.sessionStorage.getItem('nidDaybook')
        //     // console.log(encString)
        //     // let daybookUrl = self.baseUrl + '/jsonapi/node/daybook_daybook_node/' + uuidDaybook + '?_format=api_json'
        //     // let daybookUrl = baseUrl + '/entity/comment?_format=hal_json'
        //     let daybookUrl = baseUrl + '/jsonapi/node/daybook_daybook_node?_format=api_json'
        //     let daybookData = {
        //       'data': {
        //         'type': 'node--daybook_daybook_node',
        //         'attributes': {
        //           'status': true,
        //           'title': name,
        //           'body': message
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
        //     let daybookFetch = {
        //       method: 'POST',
        //       // credentials: 'include',
        //       headers: {
        //         'Authorization': encString,
        //         'Content-Type': 'application/vnd.api+json',
        //         'Accept': 'application/vnd.api+json',
        //         'X-CSRF-Token': token
        //       },
        //       body: JSON.stringify(daybookData)
        //     }
        //     window.fetch(daybookUrl, daybookFetch)
        //       .then((response) => response.json())
        //       .then((data) => {
        //         debugger
        //         window.localStorage.setItem('daybookCreated', true)
        //         window.localStorage.setItem('idDaybook', data.data.id)
        //         window.localStorage.setItem('uuidDaybook', data.data.attributes.uuid)
        //         window.localStorage.setItem('nidDaybook', data.data.attributes.nid)
        //         console.log(data)
        //         self.$router.back()
        //       })
        //   .catch(function (error) {
        //     console.debug(error)
        //   })
        //   })
        //   .catch(function (error) {
        //     console.debug(error)
        //   })



/*

        let daybookData = {
          '_links': {
            'type': {'href': baseUrl + '/rest/type/comment/comment'},
            [daybookUrlRelation]: {'href': baseUrl + '/rest/type/comment/comment/node/' + nid}
          },
          'entity_id': [{'target_id': nid}],
          'entity_type': [{'value': 'node--daybook_daybook_node'}],
          'comment_type': [{'target_id': 'comment'}],
          'status': [{'value': '1'}],
          'field_name': [{'value': 'comment'}],
          'subject': [{'value': 'Goodbye World'}],
          'uid': [{'target_id': uid}],
          'name': [{'value': name}],
          'comment_body': [{'value': message}]
        }
        let daybookFetch = {
          method: 'POST',
          body: JSON.stringify(daybookData),
          mode: 'no-cors',
          header: {
            'Authorization': encString,
            'Content-Type': 'application/hal+json',
            'Accept': 'application/hal+json',
            'X-CSRF-Token': token
          }
        }
        // 'Access-Control-Allow-Credentials': 'http://localhost:8080'
        debugger
        window.fetch(daybookUrl, daybookFetch)
          .then((response) => response.json())
          .then((data) => {
            window.localStorage.setItem('daybookCreated', true)
            // window.localStorage.setItem('idDaybook', data.data.id)
            // window.localStorage.setItem('uuidDaybook', data.data.attributes.uuid)
            // window.localStorage.setItem('nidDaybook', data.data.attributes.nid)
            debugger
            console.log(data)
            self.$router.back()
          })
      .catch(function (error) {
        console.debug(error)
      })

*/

<style>

</style>
        