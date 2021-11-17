<template>
    <div id="list-root">
        <h2>TO DO</h2>
        <div ref="errors" id="errors" hidden>
            <div v-for="error in errors" :key="error">
                🚫 {{ error.message }}
            </div>
        </div>
        <div id="input">
            <input type="text" @change="event => addTask(event)" placeholder="Write a new task to do" />
        </div>
        <ul class="list" v-if="tasks.length">
            <TodoListItem :task="task" v-for="task in tasks" :key="task.id"/>
        </ul>
        <div v-else>
            <p class="empty-tasks">You don't you have any task? I don't think so ...</p>
        </div>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'
import TodoListItem from './TodoListItem.vue';

declare interface Task {
    id: String,
    text: String,
    done: Boolean
}

declare interface Data {
    tasks: Task[],
    errors: []
}
function taskAlreadyExistsException() {
}
function taskEmptyTextException() {
}

export default Vue.extend({
    data(): Data {
        return {
            tasks: [],
            errors: []
        };
    },
    created: function() {
        this.$root.$on('update-list', this.updateList)
        this.$root.$on('validate-text', this.validateTextTask)
    },
    beforeDestroy: function () {
        this.$root.$off('update-list', this.updateList)
        this.$root.$off('validate-text', this.validateTextTask)
    },
    mounted() {
        this.getTasks();
    },
    methods: {
        getTasks() {
            if (process.client) {
                for (let i = 0; i < localStorage.length; i++) {
                    const temptask: Task = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    this.tasks.push(temptask);
                }
                this.tasks =  this._.orderBy(this.tasks, 'id')
            }
        },
        addTask: function (event: Event) {
            let text: String = event.target.value;
            try {
                text = text.trim();
                this.validateTextTask(text)
                const idTask: String = new Date().valueOf();
                const task: Task = { id: idTask, text: text, done: false };
                if (process.client) {
                    localStorage.setItem(idTask, JSON.stringify(task));
                }
                this.updateList();
                event.target.value = "";
            }
            catch (e) {
                if (e instanceof taskAlreadyExistsException) {
                }else if (e instanceof taskEmptyTextException) {
                }else if (e) {
                    console.log(e);
                }
            }
        },
        validateTextTask(text: String){
            this.checkUniqueTask(text);
            this.checkEmpty(text);
        },
        checkUniqueTask(text: String) {
            this.tasks.forEach(element => {
                if (Object.values(element).indexOf(text) > -1) {
                    this.showError("This task already exists!");
                    throw new Error("taskAlreadyExistsException");
                }
            });
        },
        checkEmpty(text: String) {
            if (text.length == 0 || text == " ") {
                this.showError("Some text must be entered!");
                throw new Error("taskEmptyTextException");
            }
        },
        updateList() {
            this.tasks = [];
            this.getTasks();
        },
        showError(message: String) {
            this.errors = [];
            this.$refs.errors.hidden = false;
            this.errors.push(message);
            setTimeout(() => {
                this.$refs.errors.hidden = true;
                this.errors.pop();
            }, 1500);
        }
    },
    computed: {
        orderedList: function() {
            return this._.orderBy(this.tasks, 'id')
        }
    },
    components: { TodoListItem }
})
</script>

<style scoped>
#list-root {
    flex-basis: 50%;
    background-color: rgb(242,244,245);
    padding: 20px;
}


</style>