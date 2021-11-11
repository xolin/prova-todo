<template>
    <li :data-id="task.id">
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
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        task: {
            required: true,
            type: Object
        }
    },
    methods: {
        removeTask: function (id) {
            localStorage.removeItem(id);
            this.$root.$emit("update-list")
        },
        toogleTaskState(id) {
            const task: Task = JSON.parse(localStorage.getItem(id));
            task.done = !task.done;
            localStorage.setItem(id, JSON.stringify(task));
            this.$root.$emit("update-list")
        }
    }
})
</script>
<style scoped>
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