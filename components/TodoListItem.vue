<template>
    <li :data-id="task.id">
        <button class="icon toggle" @click="event =>toggleTaskState(task.id)">
            <img class="state-icon" :class="task.done ? 'icon-done' : 'icon-undone'" :src="!task.done ? '/icons/circle-solid.svg' : '/icons/circle-check-solid.svg'" />
        </button>
        <div>
            <input :value="task.text" v-on:change="event => editTask(task.id, event)" :class="task.done ?'task-done':''"/>
        </div>
        <button class="icon remove" @click="event => removeTask(task.id)">
            <div>
                <img src="/icons/trash-can-solid.svg" class="remove-icon" />
            </div>
            <div>
                <p>Delete</p>
            </div>
        </button>
    </li>   
</template>

<script lang="ts">
import Vue from 'vue'

declare interface Task {
    id: String,
    text: String,
    done: Boolean
}

function taskAlreadyExistsException() {}
function taskEmptyTextException() {}

export default Vue.extend({
    props: {
        task: {
            required: true,
            type: Object
        }
    },
    methods: {
        removeTask: function (id) {
            if (process.client || process.env.TEST) {
                localStorage.removeItem(id);
                this.$root.$emit("update-list")
            }
        },
        editTask(id, event){
            if (process.client) {
                try{
                    const text: String = event.target.value;
                    const temptask : Task = JSON.parse(localStorage.getItem(id))
                    this.$root.$emit("validate-text", text)
                    temptask.text = text
                    localStorage.setItem(id, JSON.stringify(temptask))
                } catch (e) {    
                    if (e instanceof taskAlreadyExistsException) {
                    }else if (e instanceof taskEmptyTextException) {
                    }else if (e) {
                        console.log(e);
                    }
                }
            }
        },
        toggleTaskState(id) {
            if (process.client) {
                const task: Task = JSON.parse(localStorage.getItem(id));
                task.done = !task.done;
                localStorage.setItem(id, JSON.stringify(task));
                this.$root.$emit("update-list")
            }
        }
    }
})
</script>
<style scoped>
input {
    margin-bottom: 0px;
    height: calc(100% - 2px);
    padding-left: 10px;
    border-left: 2px solid #00000008;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.state-icon {
    width: 20px;
    height: 20px;
}
.icon-done {
    filter: invert(55%) sepia(100%) saturate(3.5) hue-rotate(45deg);
}
.icon-undone{
    filter: invert(55%) sepia(14%) saturate(23) hue-rotate(-45deg) brightness(119%) contrast(86%);
}

.toggle {
    background-color: #fff;
    border: none;
}

.remove {
    justify-content: center;
    background-color: rgb(255, 92, 92);
    color: white;
    font-size: 11px;
    font-weight: 600;
    border: 0;
    padding-left: 5px;
    padding-right: 5px;
}
.remove:hover {
    opacity: 0.9;
}
.remove-icon {
    padding: 5px;
    width: 11px;
    height: 11px;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(189deg) brightness(103%) contrast(101%);
}

.task-done {
    text-decoration: line-through;
}
</style>