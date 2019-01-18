<template>
      <!-- <f7-view>
        <f7-pages> -->
  <f7-page mydocuments-screen>
  <f7-navbar  back-link="" sliding>
    <f7-nav-center sliding style="text-align:center">Mobile Daybook</f7-nav-center>
    <!-- &nbsp; &nbsp; &nbsp;  -->
    <f7-nav-right>
    <f7-link icon="icon-bars" open-panel="right"></f7-link>
    </f7-nav-right>
  </f7-navbar>
    <div class="block-title" style="text-align:center" ><h4>Mes documents</h4></div>
            <ul >
              <li v-for="(document,index) in documents" :key="index"  >
                <div class = "item-inner">
                  <div class="item-title" v-html="document.title" > </div>
                    <div class="item-after" v-on:click="downloadFile($event)" v-html="document.document" ><a href=document.document download></a></div>
                </div> 
              </li> 
            </ul>
</f7-page>
        <!-- </f7-pages>
      </f7-view> -->
</template>

<script>
// import FormData from 'FormData'
// import FileReader from 'FileReader'
// import Canvas  from 'Canvas'
import Blob from 'blob'
import VueRouter from 'vue-router'
export default {
  data () {
    return {
      documents: [],
      baseUrl: '',
      docTitle: ''
    }
  },
  components: {
    'vue-router': VueRouter
  },
  created () {
  },
  mounted () {
    this.onRefresh()
    // let baseUrl = window.localStorage.getItem('baseUrl')
    // let endPoint = baseUrl + '/user-documents-list'
    // // let route = self.$router.r.resolve({path: endPoint})
    // // this.VueRouter.$router.push({path: endPoint})
    // debugger
    // window.location.href = endPoint
    // // const router = new VueRouter()
    // // router.push(endPoint)
    // // let route = router.resolve({path: endPoint})
    // // window.open(router.href, '_self')
  },
  methods: {
    onRefresh: function () {
      const self = this
      self.baseUrl = window.localStorage.getItem('baseUrl')
      let endPoint = self.baseUrl + '/api/document-list?_format=hal_json'
      let username = window.localStorage.getItem('username')
      // let uid = window.localStorage.getItem('uid')
      let password = window.sessionStorage.getItem('password')
      let enc = window.btoa(username + ':' + password)
      let encString = 'Basic ' + enc
      let token = window.localStorage.getItem('csrfToken')
      let fetchTasks = {
        method: 'GET',
        headers: {
          'Authorization': encString,
          'X-CSRF-Token': token,
          'Accept': 'application/hal+json',
          'Content-Type': 'application/hal+json'
        }
      }
      window.fetch(endPoint, fetchTasks)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response.json()
      }).then(function (data) {
        return self.saveDocumentList(data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    saveDocumentList (data) {
      const self = this
      try {
        for (let item in data) {
          if (data.hasOwnProperty(item)) {
            // data[item].title = data[item].title.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ')
            data[item].title = data[item].title.replace(/<\/?[^>]+(>|$)/g, '').trim()
            // debugger
            // data[item].title = data[item].title.match(/>"([^"]*)/)
            // taskTitle[item] = data[item].title[0]
            // let docLocation = self.baseUrl + '/' +
            // let index = data[item].document.indexOf('href')
            // console.log(index)
            // let href = data[item].document.match(/href="([^"]*)/)[1]
            // data[item].document = 'href="' + self.baseUrl + href + '"'
            if (data[item].document.length) {
              // debugger
              let regex = /href="([^"]*)/
              if (data[item].document.match(regex)[1]) {
                data[item].document = data[item].document.replace(regex, 'href="' + self.baseUrl + '$1')
              }
            }
          }
        }
        // window.localStorage.setItem(self.documents, JSON.parse(data))
        self.documents = data
        console.log(self.documents)
      } catch (error) {
        console.debug(error.message)
      }
      // self.documents = data
    },
    processStatus: function (response) { // process status
      if (response.status === 200 || response.status === 0) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(new Error('Error loading: '))
        // + url))
      }
    },
    parseBlob: function (response) {
      return response.blob()
    },
    parseJson: function (response) {
      return response.json()
    },
    // download/upload
    downloadFile: function (event) {
      const self = this
      debugger
      // if (event) {
      //  // window.alert(event.target.href)
      //   return window.fetch(event.target.href)
      //     .then(self.processStatus)
      //     .then(self.parseBlob)
      // }
      // self.baseUrl = window.localStorage.getItem('baseUrl')
      let endPoint = event.target.href
      self.docTitle = event.target.innerText
      // let username = window.localStorage.getItem('username')
      // let uid = window.localStorage.getItem('uid')
      // let password = window.sessionStorage.getItem('password')
      // let enc = window.btoa(username + ':' + password)
      // let encString = 'Basic ' + enc
      // let token = window.localStorage.getItem('csrfToken')
      let fetchTasks = {
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/pdf'
        }
      }
      window.fetch(endPoint, fetchTasks)
      .then(r => r.blob())
      .then(self.showFile)
      // .then(response => {
      //   // Create a Blob from the PDF Stream
      //   const file = new Blob(
      //   [response.data],
      //   {type: 'application/pdf'})
      //   // Build a URL from the file
      //   const fileURL = window.URL.createObjectURL(file)
      //   // Open the URL on new Window
      //   window.open(fileURL)
      // })
      .catch(error => {
        console.log(error)
      })
    },
    showFile (blob) {
      const self = this
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      let newBlob = new Blob([blob], {type: 'application/pdf'})
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob)
      let link = document.createElement('a')
      link.href = data
      link.download = self.docTitle
      link.click()
      // setTimeout(function() {
      //   // For Firefox it is necessary to delay revoking the ObjectURL
      //   window.URL.revokeObjectURL(data)
      //   , 100}
    }
  }
}
</script>