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
const store = dataStore()
let players = ref([])

const getPlayers = async () => {
    //getting normal data
    const { user } = store.session
    try {
        const { data, error } = await supabase.from('player').select().eq('user_id',user.id);
        if (error) {
            throw error;
        }
        console.log('selecting');
        players.value = data;

    } catch (err) {
        console.error(err);
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