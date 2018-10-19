<template>
  <f7-page>
    <f7-navbar title="Activités" back-link="Back"></f7-navbar>
                 <div class="page-content">
                     <div class="content-block-title">Liste des Affectations</div>
                     <div class="list-block accordion-list" >
                        <ul>
                           <li class="accordion-item" v-for="todo in todos" :key="todo.title">
                              <a href="#" class="item-content item-link">
                                  <div class="item-inner">
                                    <div class="item-title">{{todo.assign_start_shift_date}} </div>
                                    <div class="item-after"><span class="badge color-blue">{{todo.assign_start_shift_time}}</span></div>
                                  </div>
                              </a>
                              <div class="accordion-item-content">
                                 <div class="content-block">
                                    <h3> <strong><em>{{todo.assign_site}}</em></strong>  </h3>
                                    <p>
                                      <span v-bind:class="{ alert: showAlert}"><strong><em>Début: </em></strong>{{todo.assign_start_shift}}</span>
                                      <!--<span><em><strong>&nbsp;&nbsp;</strong></em></span>-->
                                      </br>
                                      <span v-bind:class="{ alert: showAlert}"><strong><em>Fin : </em></strong>{{todo.assign_end_shift}}</span>
                                    </p>
                                    <p>
                                     {{todo.assign_site_address}}</br>
                                     {{todo.assign_locality}} </br>
                                     {{todo.assign_postal_code}} </br>
                                     </p>
                                        <section aria-labelledby="todos-label">
                                       <h4 id="todos-label">Taches</h4>
                                       <ul>
                                       <li v-for="task of todo.assign_tasks" v-if="task.length"> <span>   </span> &#x95; {{task}} </li>
                                       </ul>
                                      </section>
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
               </div>
            </div>
         </div>
      </div>
  </f7-page>
</template>
<script>
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
      this.todos = JSON.parse(window.sessionStorage.getItem('todos'))
    },
    components: {
      // f7Navbar,
      // f7Page,
      // f7BlockTitle
    },
    methods: {
    }
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