<template>
      <!-- <f7-view>
        <f7-pages> -->
  <f7-page parameters-screen>
  <f7-navbar  back-link="" sliding>
    <f7-nav-center sliding style="text-align:center">Mobile Daybook</f7-nav-center>
    <!-- &nbsp; &nbsp; &nbsp;  -->
    <f7-nav-right>
    <f7-link icon="icon-bars" open-panel="right"></f7-link>
    </f7-nav-right>
  </f7-navbar>
    <div class="block-title" style="text-align:center" ><h4>Report Incident</h4></div>
    <!-- <f7-parameters-screen id="parameters-screen"> -->
<!-- <div class="block-title"><h4>Incident</h4></div> -->
<f7-list form id="parameters-screen-form">
    <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="text" v-model="incidentTitle" placeholder="Titre incident">
          {{incidentTitle}}
          <span class="input-clear-button"></span>
          <div class="item-input-info">e-mail</div>
        </div>
      <!-- </div> -->
    </f7-list-item>
    <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="text" v-model="incidentDescr" placeholder="Description incident">
          {{incidentDescr}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
      <!-- </div> -->
    </f7-list-item>
     <f7-list-item class="item-content item-input item-input-with-info">
        <div class="item-input-wrap">
          <input type="file" name="url" @change="onFileChanged">
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
    </f7-list-item>
<!--        <div>
            <div class="file-upload-form">
                Upload an image file:
                <input type="file" @change="previewImage" accept="image/*">
            </div>
            <div class="image-preview" v-if="imageData.length > 0">
                <img class="preview" :src="imageData">
            </div>
        </div> -->
<!-- </div>  -->
            <!-- <f7-list-item>
              <f7-list-button @click="Save" v-model="saveTitle" close-parameters-screen>{{saveTitle}}</f7-list-button>
</f7-list-item> -->
 </f7-list>

 <div class="block">
  <div class="row">
    <span>&nbsp;</span>
    <button class="button col" @click="onUpload" close-parameters-screen>{{uploadTitle}}</button>
    <span>&nbsp;</span>
  </div>
</div> 
 <!-- </f7-parameters-screen>     -->
</f7-page>
        <!-- </f7-pages>
      </f7-view> -->
</template>

<script>
// import FormData from 'FormData'
// import FileReader from 'FileReader'
// import Canvas  from 'Canvas'

export default {
  data () {
    return {
      uploadTitle: 'Telecharger',
      incidentTitle: null,
      incidentDescr: null,
      selectedFile: null,
      incidentDate: null,
      dataToPost: null
    }
  },
  components: {
  },
  created () {
  },
  methods: {
    onFileChanged (event) {
      this.selectedFile = event.target.files[0]
      event.preventDefault()
      const self = this
      let reader = new window.FileReader()
      reader.onload = readSuccess
      function readSuccess (event) {
        let stringImage = reader.result
        if (stringImage) {
          let striped = stringImage.split('base64,')
          if (striped[1]) {
            // debugger
            self.uploadDrupalImage(striped[1])
          }
        }
      }
      reader.readAsDataURL(this.selectedFile)
      // this.readFile(this.selectedFile)
      // let imageUrl = this.find('[name=url]').val()
      // onst file = event.target.files[0]
      // this.onUpload(this.selectedFile)
      // this.getImageDataURL(this.selectedFile, this.onSuccess, this.onError)
      // this.previewImage(event)
      // this.convertImgToDataURLviaCanvas(this.selectedFile , function(base64Img)) {
      // load the image, and append it to the element id="image-holder"
      // this.loadImage(this.selectedFile)
      //   .then(img => document.getElementById('image-holder').appendChild(img))
      //   .catch(error => console.error(error))
    },
    readFile (file) {
      const self = this
      let reader = new window.FileReader()
      reader.onload = readSuccess
      function readSuccess (evt) {
        let stringImage = reader.result
        if (stringImage) {
          let striped = stringImage.split('base64,')
          if (striped[1]) {
            // debugger
            self.uploadDrupalImage(striped[1])
          }
        }
      }
      reader.readAsArrayBuffer(file)
      // reader.readAsDataURL(file)
    },
    uploadDrupalImage (bace64) {
      // Could only get hal_json to work.
      const self = this
      let baseUrl = window.localStorage.getItem('baseUrl')
      /* self.dataToPost = {
        'data':
        {
          'type': 'file--file',
          'attributes': {
            'filename':
            [
              {
                'value': this.selectedFile.name
              }
            ],
            'uri':
            [
              {
                'value': 'public://pictures/2018-11/' + this.selectedFile.name,
                'url': JSON.stringify(baseUrl + '/sites/default/files/2018-11/' + this.selectedFile.name)
              }
            ],
            'filemime':
            [
              {
                'value': this.selectedFile.type
              }
            ],
            'data':
            [
              {
                'value': bace64
              }
            ]
          }
        }
      }
      */
      self.dataToPost = {
        'links':
        {
          'type': 'file--file'
        },
        'filename':
        [
          {
            'value': this.selectedFile.name
          }
        ],
        'uri':
        [
          {
            'value': 'public://pictures/2018-11/' + this.selectedFile.name,
            'url': JSON.stringify(baseUrl + '/sites/default/files/2018-11/' + this.selectedFile.name)
          }
        ],
        'filemime':
        [
          {
            'value': this.selectedFile.type
          }
        ],
        'data':
        [
          {
            'value': bace64
          }
        ]
      }
    },
    onUpload () {
      const self = this
      let today = new Date()
      today.setSeconds(0)
      today.setMilliseconds(0)
      self.incidentDate = today.toISOString().split('.')[0]
      let baseUrl = window.localStorage.getItem('baseUrl')
      let username = window.localStorage.getItem('username')
      let token = window.localStorage.getItem('csrfToken')
      // let uid = window.localStorage.getItem('uid')
      let password = window.sessionStorage.getItem('password')
      let urlIncident = baseUrl + '/jsonapi/node/daybook_incident_node?_format=api_json'
      let enc = window.btoa(username + ':' + password)
      let encString = 'Basic ' + enc
      // let bodyToPost = JSON.stringify(self.dataToPost)
      // console.log(bodyToPost)
      const incidentData = {
        'data': {
          'type': 'daybook_incident_node',
          'attributes': {
            'title': self.incidentTitle,
            'body': {
              'value': self.incidentDescr
            },
            'field_dbk_incident_date': self.incidentDate,
            'field_dbk_incident_photos': self.dataToPost
          }
        }
      }
      let bodyToPost = JSON.stringify(incidentData)
      console.log(bodyToPost)
      // debugger
      const incidentConfig = {
        method: 'POST',
        body: JSON.stringify(incidentData),
        headers: {
          'Authorization': encString,
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'X-CSRF-Token': token
        }
      }
      window.fetch(urlIncident, incidentConfig)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            self.$router.back()
          })
      .catch(function (error) {
        console.debug(error)
      })
    },
    loadImage (url) {
      return new Promise((resolve, reject) => {
        let img = new window.Image()
        img.addEventListener('load', e => resolve(img))
        img.addEventListener('error', () => {
          reject(new Error(`Failed to load image's URL: ${url}`))
        })
        // debugger
        img.src = url
      })
    },
    previewImage: function (event) {
      // Reference to the DOM input element
      let input = event.target
      // debugger
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
           // create a new FileReader to read this image and convert to base64 format
        let reader = new window.FileReader()
          // Define a callback function to run, when FileReader finishes its job
        reader.onload = (event) => {
            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
            // Read image as base64 and set to imageData
          // debugger
          this.imageData = event.target.result
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
        console.log(reader)
      }
    },
    getImageDataURL (url, success, error) {
      let data, canvas, ctx
      // debugger
      let img = new window.Image()
      // img.onload = function () {
      // Create the canvas element.
      canvas = document.createElement('myCanvas')
      canvas.width = img.width
      canvas.height = img.height
      // Get '2d' context and draw the image.
      ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      // Get canvas data URL
      try {
        img.src = url
        data = canvas.toDataURL()
        success({image: img, data: data})
      } catch (e) {
        error(e)
      }
      // }
      // Load image URL.
      try {
        // debugger
        img.src = url
      } catch (e) {
        error(e)
      }
    },
    onSuccess (e) {
      // debugger
      document.body.appendChild(e.image)
      window.alert(e.data)
    },
    onError (e) {
      window.alert(e.message)
    },
    convertImgToDataURLviaCanvas (url, callback, outputFormat) {
      let img = new window.Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        let canvas = document.createElement('CANVAS')
        let ctx = canvas.getContext('2d')
        let dataURL
        canvas.height = this.height
        canvas.width = this.width
        ctx.drawImage(this, 0, 0)
        dataURL = canvas.toDataURL(outputFormat)
        callback(dataURL)
        canvas = null
      }
      img.src = url
    },
    convertFileToDataURLviaFileReader (url) {
      // let xhr = new XMLHttpRequest()
      // xhr.onload = function () {
      //   let reader = new FileReader()
      //   reader.onloadend = function () {
      //     // callback(reader.result)
      //   }
      //   reader.readAsDataURL(xhr.response)
      // }
      // xhr.open('GET', url)
      // xhr.responseType = 'blob'
      // xhr.send()
    }
  }
}
</script>
