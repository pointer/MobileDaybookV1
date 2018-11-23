<template>
  <f7-page>
    <f7-navbar title="Main courante" back-link="Back"></f7-navbar>
                 <div class="page-content">
                     <!-- <div class="content-block-title">Main courante</div> -->
                        <div class="list inset">
                        <ol>
                           <li v-for="task of tasks" v-if="task.length">
                              <div class = "item-content">
                             <!--      <div class = "item-media"><i class = "icon icon-form-toggle"></i></div> -->
                                 <div class = "item-inner">
                                 <!-- <div class="item-header">Email</div>-->
                                <div class="item-title"> {{task.assign_start_shift}} </div>
                                {{task.todo}}
                                <div class="item-after">
                                   <div class = "item-input">
                                       <label class = "label-switch">
                                          <input type = "checkbox">
                                          <div class = "checkbox"></div>
                                       </label>
                                   </div>
                                 </div>
                                 <!-- <div class="item-footer">Home</div>                                     -->
                                </div>
                              </div>
                           </li>
                        </ol>
                        <div class="block-footer">
                            <p>Here comes some useful information about list above</p>
                        </div>
                        </div>
                  </div>
  </f7-page>
</template>
<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        todos: [],
        tasks: []
      }
    },
    mounted () {
      // console.log(this.$device)
      // this.todos = JSON.parse(window.sessionStorage.getItem('todos'))
      this.formatTodos(JSON.parse(window.sessionStorage.getItem('todos')))
    },
    components: {
      // f7Navbar,
      // f7Page,
      // f7BlockTitle
    },
    methods: {
      formatTodos (todos) {
        // const self = this
        let currentDate = moment().startOf('day')
        for (let todo in todos) {
          if (todos.hasOwnProperty(todo)) {
            let startDateTime = todos[todo].assign_start_shift.split('-')
            let startDate = moment(startDateTime[0], 'DD/MM/YYYY')
            let duration = moment.duration(startDate.diff(currentDate)).asDays()
            // debugger
            if (duration === 0) {
              debugger
              // // todos[todo].assign_tasks = todos[todo].assign_tasks_description.replace(/\\r\\n\\t/g, '')
              // if (todos[todo].assign_tasks_description) {
              // // && (todos[todo].assign_tasks_description = window.trim(todos[todo].assign_tasks_description))) {
              let tasks = todos[todo].assign_tasks_description
              // .split('\n\t')
              // }
              // console.log(self.tasks)
              for (let task in tasks) {
                if (tasks.hasOwnProperty(task)) {
                  tasks[task].assign_start_shift = todos[todo].assign_start_shift
                  // self.tasks = todos[todo].assign_tasks_description.split('\n\t')
                  if (tasks[task] && (tasks[task] = tasks[task].trim(tasks[task]))) {
                    // tasks[task]
                    tasks[task].todo = tasks[task].replace(/[^\x20-\x7E]/gmi, '')
                    tasks[task].todo = tasks[task].replace(/<\/?[^>]+(>|$)/g, '')
                    tasks[task].todo = tasks[task].replace(/&nbsp;/gi, '')
                    console.log(tasks[task])
                  }
                }
              }
            }
          }
        }
        // console.log(todos)
      }
      // var coldDrinks = drinks.map(function(drink) {
      //   return ‘iced ’ + drink;
      // });
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