<template>
  <div id="container">
    <div class="player" @click="router.push('/player/' + p.id)" v-for="(p, index) in players" :key="index">
      {{ p.first_name }} {{ p.last_name }}
      <img v-if="p.on_device_url" :src="p.on_device_url" alt="">
    </div>
  </div>
  <RouterLink to="/add"><button>add a player</button></RouterLink>
</template>

<script setup>
import router from '@/router';
import { RouterLink } from 'vue-router';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
import { supabase } from '@/supabase';
import { ref, onMounted } from 'vue';

const store = dataStore();
const { players } = storeToRefs(store);


</script>

<style>
#container {
  display: flex;
}

.player {
  display: inline-block;
  width: 200px;
  height: 200px;
}
img {
  width: 100%;
}
</style>
