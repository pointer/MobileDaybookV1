<template>
  <f7-page>
    <f7-navbar title="Incident" back-link="Back" sliding></f7-navbar>
    <f7-block-title></f7-block-title>
    <f7-block strong>
      <p> Vous allez etre rediriger vers le site </p>
      <p> pour reporter l'incident</p>

    </f7-block>
  </f7-page>
</template>
<script>
 export default {
   mounted () {
     let baseUrl = window.localStorage.getItem('baseUrl')
     if (baseUrl) {
       let site = baseUrl + '/user/login'
       window.open(site)
     }
   }
 }
</script>
