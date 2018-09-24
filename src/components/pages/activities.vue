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
                                      <span>{{todo.assign_start_shift}}</span>
                                    <!--  <span>   </span>
                                      <span><em><strong> {{todo.assign_start_time}}</strong></em></span> -->
                                      <span><em><strong>    </strong></em></span>
                                      <span>{{todo.assign_end_shift}}</span>
                                    <!--  <span>   </span>
                                      <span ><em><strong>{{todo.assign_end_time}}</strong></em></span> -->
                                    </p>
                                     {{todo.assign_address}}</br>
                                     {{todo.assign_locality}} </br>
                                     {{todo.assign_postal_code}} </br>
                                     </p>
                                      
                                     <!-- <div>
                                      <p>Taches: </p>
                                      <ul>                             
                                      <li v-for="task of todo.assign_tasks" :key="task" v-if="task.length"> <span>   </span> &#x95; {{task}} </li>
                                      </ul>
                                     </div>  -->
                                      <section aria-labelledby="todos-label">
                                       <h4 id="todos-label">Taches</h4>
                                       <ul>
                                      <li v-for="task of todo.assign_tasks" :key="task" v-if="task.length"> &#x95; {{task}} </li>
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
        todos: []
        // site: ''
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
