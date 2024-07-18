<template>
    <div id="container" >
        <div class="player" @click="router.push('/player/' + p.id)" v-for="p in players">
            {{ p.first_name }}
            {{ p.last_name }}
            <img v-if="p.avatar" :src="p.avatar" alt="">
        </div>

    </div>
    <RouterLink to="/add"><button>add a player</button></RouterLink>

</template>

<script setup>
import router from '@/router';
import { supabase } from '@/supabase';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
const store = dataStore()
const { players } = storeToRefs(store)
console.log(store.players)

</script>

<style>
#container {
    display: flex;
}

.player {
    display: inline-block;
    width: 200px;
    height: 200px
}
</style>