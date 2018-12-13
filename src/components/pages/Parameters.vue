<template>
      <!-- <f7-view>
        <f7-pages> -->
  <f7-page parameters-screen>
    <f7-navbar title="" back-link="" sliding></f7-navbar>
    <!-- <f7-parameters-screen id="parameters-screen"> -->
<div class="block-title"><h4>Parametres de connexion</h4></div>
<f7-list form id="parameters-screen-form">
    <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="email" v-model="userEmail" placeholder="Votre e-mail">
          {{userEmail}}
          <span class="input-clear-button"></span>
          <div class="item-input-info">e-mail</div>
        </div>
      <!-- </div> -->
    </f7-list-item>
    <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="url" v-model="baseUrl" placeholder="Addresse du site web - URL">
          {{baseUrl}}
          <span class="input-clear-button"></span>
          <div class="item-input-info">Addresse du site web - URL</div>
        </div>
      <!-- </div> -->
    </f7-list-item>
    <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="text" v-model="punchCard" placeholder="Nom du contenu Badge">
          {{punchCard}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
      <!-- </div> -->
    </f7-list-item>
    <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="text" v-model="incident" placeholder="Nom du contenu Incident">
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
      <!-- </div> -->
    </f7-list-item>
        <f7-list-item class="item-content item-input item-input-with-info">
      <!-- <div class="item-inner"> -->
        <div class="item-input-wrap">
          <input type="text" v-model="dayBook" placeholder="Nom du contenu Main courante">
          {{dayBook}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
      <!-- </div> -->
    </f7-list-item>   
    <f7-list-item class="item-content item-input item-input-with-info">
        <div class="item-input-wrap">
          <f7-label>isLoggedIn</f7-label>
          <input type="text" v-model="isLoggedIn" placeholder="is logged in">
          {{isLoggedIn}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
    </f7-list-item>   
    <f7-list-item class="item-content item-input item-input-with-info">
        <div class="item-input-wrap">
          <f7-label>hasPunchedIn</f7-label>
          <input type="text" v-model="hasPunchedIn" placeholder="has Punched In">
          {{hasPunchedIn}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
    </f7-list-item>       
    <f7-list-item class="item-content item-input item-input-with-info">
        <div class="item-input-wrap">
          <f7-label>daybookCreated</f7-label>
          <input type="text" v-model="daybookCreated" placeholder="daybookCreated">
          {{daybookCreated}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
    </f7-list-item>
 
    <f7-list-item class="item-content item-input item-input-with-info">
        <div class="item-input-wrap">
          <f7-label>User</f7-label>
          <input type="text" v-model="username" placeholder="username">
          {{username}} &nbsp; {{uid}}
          <span class="input-clear-button"></span>
          <div class="item-input-info"></div>
        </div>
    </f7-list-item>       
 
<!-- </div>  -->
            <!-- <f7-list-item>
              <f7-list-button @click="Save" v-model="saveTitle" close-parameters-screen>{{saveTitle}}</f7-list-button>
</f7-list-item> -->
 </f7-list>

 <div class="block">
  <div class="row">
    <span>&nbsp;</span>
    <button class="button col" @click="saveParameters" v-model="saveTitle" close-parameters-screen>{{saveTitle}}</button>
    <span>&nbsp;</span>
  </div>
</div> 
 <!-- </f7-parameters-screen>     -->
</f7-page>
        <!-- </f7-pages>
      </f7-view> -->
</template>

<script>
export default {
  data () {
    return {
      saveTitle: 'Enregistrer',
      punchCard: null,
      userEmail: null,
      baseUrl: null,
      incident: null,
      dayBook: null,
      isLoggedIn: null,
      hasPunchedIn: null,
      daybookCreated: null,
      username: '',
      uid: ''
    }
  },
  created () {
    // debugger
    this.baseUrl = window.localStorage.getItem('baseUrl')
    this.punchCard = window.localStorage.getItem('punchCard')
    this.userEmail = window.localStorage.getItem('userEmail')
    this.incident = window.localStorage.getItem('incident')
    this.dayBook = window.localStorage.getItem('dayBook')
    this.isLoggedIn = window.localStorage.getItem('isLoggedIn')
    this.hasPunchedIn = window.localStorage.getItem('hasPunchedIn')
    this.daybookCreated = window.localStorage.getItem('daybookCreated')
    this.username = window.localStorage.getItem('username')
    this.uid = window.localStorage.getItem('uid')

    // this.setTitles()
  },
  methods: {
    saveParameters: function () {
      // debugger
      const self = this
      window.localStorage.setItem('baseUrl', self.baseUrl)
      window.localStorage.setItem('punchCard', self.punchCard)
      window.localStorage.setItem('userEmail', self.userEmail)
      window.localStorage.setItem('incident', self.incident)
      window.localStorage.setItem('dayBook', self.dayBook)
      window.sessionStorage.setItem('isLoggedIn', self.isLoggedIn)
      window.localStorage.setItem('hasPunchedIn', self.hasPunchedIn)
      window.localStorage.setItem('daybookCreated', self.daybookCreated)
      window.localStorage.setItem('username', self.username)
      window.localStorage.setItem('uid', self.uid)
      // ProgressIndicator.*
      // window.plugins.ProgressIndicator.showSimple(true)
      // console.log(self.baseUrl)
      // if (!window.localStorage.getItem('baseUrl')) {
      //   window.localStorage.setItem('baseUrl', this.baseUrl)
      // }
      // if (!self.baseUrl) {
      //   self.errors.push('Ajouter Adresse du site')
      //   return false
      // }
      // if (!window.localStorage.getItem('userEmail')) {
      //   window.localStorage.setItem('userEmail', this.userEmail)
      // }
      // if (!self.userEmail) {
      //   self.errors.push('Ajouter email utilisateur')
      //   return false
      // }
      // if (!window.localStorage.getItem('punchCard')) {
      //   window.localStorage.setItem('punchCard', this.punchCard)
      // }
      // if (!self.punchCard) {
      //   self.errors.push('Ajouter Nom du contenu Badge')
      //   return false
      // }
      // if (!window.localStorage.getItem('incident')) {
      //   window.localStorage.setItem('incident', this.incident)
      // }
      // if (!self.incident) {
      //   self.errors.push('Ajouter Nom du contenu Incident')
      //   return false
      // }
      // if (!window.localStorage.getItem('dayBook')) {
      //   window.localStorage.setItem('dayBook', this.dayBook)
      // }
      // if (!self.dayBook) {
      //   self.errors.push('Ajouter Nom du contenu Main courante')
      //   return false
      // }
    }
  }
}
</script>
