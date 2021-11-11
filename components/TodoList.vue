<template>
    <div id="list-root">
        <h2>TO DO</h2>
        <div id="input">
            <input type="text" v-on:change="event => addTask(event)" />
        </div>
        <div ref="errors" id="errors" hidden>{{errors}}</div>
        <ul>
            <TodoListItem :task="task" v-for="task in tasks"/>
            <!-- <li v-for="task in tasks" :key="task.id" :data-id="task.id">
                <div class="icon" v-on:click="toogleTaskState(task.id)">
                    <img :src="!task.done ? '/icons/circle-solid.svg' : '/icons/circle-check-solid.svg'" />
                </div>
                <div>
                    <p>{{ task.text }}</p>
                </div>
                <div class="icon" v-on:click="removeTask(task.id)">
                    <img src="/icons/times-solid.svg" />
                </div>
            </li> -->

        </ul>
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
    },
    beforeDestroy: function () {
        this.$root.$off('update-list', this.updateList)
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
                console.log(localStorage);
            }
        },
        addTask: function (event: Event) {
            const text: String = event.target.value;
            try {
                this.checkUniqueTask(text);
                this.checkEmpty(text);
                const idTask: String = this.tasks.length + "-" + new Date().valueOf();
                const task: Task = { id: idTask, text: event.target.value, done: false };
                if (process.client) {
                    localStorage.setItem(idTask, JSON.stringify(task));
                    //localStorage.clear();
                }
                this.updateList();
                event.target.value = "";
            }
            catch (e) {
                if (e instanceof taskAlreadyExistsException) {
                }
                else if (e instanceof taskEmptyTextException) {
                }
                else if (e) {
                    console.log(e);
                }
            }
        },
        checkUniqueTask(val: String) {
            this.tasks.forEach(element => {
                if (Object.values(element).indexOf(val) > -1) {
                    this.showError("This task already exists!");
                    throw new Error("taskAlreadyExistsException");
                }
            });
        },
        checkEmpty(val: String) {
            val = val.trim();
            if (val.length == 0 || val == " ") {
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
    components: { TodoListItem }
})
</script>

<style scoped>
#list-root {
    background-color: rgb(80, 144, 183);
    padding: 20px;
}


</style>