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
let players = ref([])
const getPlayers = async () => {
    //getting normal data
    try {
        const { data, error } = await supabase.from('player').select();
        if (error) {
            throw error;
        }
        console.log('selecting');
        players.value = data;

    } catch (err) {
        console.error(err);
    }
    //getting the pictures
    try {
        const { data, error } = await supabase.storage.from('avatars').list()
        console.log("avatars",data)

    }
    catch (err) {
        throw err
    }
}
onMounted(getPlayers)

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