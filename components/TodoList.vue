<template>
    <div id="list-root">
        <h2>TO DO</h2>
        <ul>
            <input type="text" v-on:change="event => addTask(event)" />
            <div ref="errors" id="errors" hidden>{{errors}}</div>
            <li v-for="task in tasks" :key="task.id" :data-id="task.id">
                <div class="icon" v-on:click="toogleTaskState(task.id)">
                    <img :src="!task.done ? '/icons/circle-solid.svg' : '/icons/circle-check-solid.svg'" />
                </div>
                <div>
                    <p>{{ task.text }}</p>
                </div>
                <div class="icon" v-on:click="removeTask(task.id)">
                    <img src="/icons/times-solid.svg" />
                </div>
            </li>

        </ul>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'

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
    data (): Data {
        return {
            tasks: [],
            errors: []
        };
    },
    mounted() {
        this.getTasks()
    },
    methods: {
        getTasks() {
            if(process.client) {
                for (let i = 0; i < localStorage.length; i++) {
                    const temptask : Task = JSON.parse(localStorage.getItem(localStorage.key(i)))
                    this.tasks.push(temptask)
                }
                console.log(localStorage);
                
            }
        },
        addTask: function(event: Event) {
            const text : String = event.target.value
            try {
                this.checkUniqueTask(text)
                this.checkEmpty(text)
                const idTask : String = this.tasks.length +'-'+ new Date().valueOf()
                const task : Task = { id: idTask, text: event.target.value, done: false };
                if(process.client) {
                    localStorage.setItem( idTask, JSON.stringify(task))
                    //localStorage.clear();
                }
                this.updateList()
                event.target.value = ""
            } catch (e) {
                if (e instanceof taskAlreadyExistsException) {
                    
                }else if (e instanceof taskEmptyTextException) {
                    
                } else if(e) {
                    console.log(e);
                }
            }
        },
        removeTask: function(id) {
            localStorage.removeItem(id)
            this.updateList()
        },
        toogleTaskState(id) {
            const task : Task = JSON.parse(localStorage.getItem(id))
            task.done = !task.done
            localStorage.setItem(id, JSON.stringify(task))
            this.updateList()

        },
        checkUniqueTask(val : String) {
            this.tasks.forEach(element => {
                if(Object.values(element).indexOf(val) > -1){
                    this.showError("This task already exists!")
                    throw new Error("taskAlreadyExistsException")
                }
            });
        },
        checkEmpty(val: String) {
            val = val.trim()
            if(val.length == 0 || val == " "){
                this.showError("Some text must be entered!")
                throw new Error("taskEmptyTextException")
            }
        },
        updateList() {
            this.tasks = []
            this.getTasks()
        },
        showError(message : String) {
            this.errors = []
            this.$refs.errors.hidden = false
            this.errors.push(message)
            setTimeout(() => {
                this.$refs.errors.hidden = true
                this.errors.pop()
            }, 1500);
        }
    }
})
</script>

<style scoped>
#list-root {
    background-color: rgb(80, 144, 183);
    padding: 20px;
}

input {
    padding-left: 20px;
    min-height: 40px;
    border: none;
    margin-bottom: 30px;
}

input:focus-visible {
    border: white;
}

#errors {
    background-color: yellowgreen;
    
}

ul {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    row-gap: 1px;
}

ul li {
    min-height: 40px;
    background-color: rgb(255, 255, 255);
    list-style-type: none;    
    
    display: grid;
    grid-template-columns: 1fr 10fr 1fr;
}

ul li p, input {
    font-size: 1rem;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
    text-transform: capitalize;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.icon img {
    width: 25px;
    height: 25px;
}

</style>