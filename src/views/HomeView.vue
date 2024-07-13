<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
import { supabase } from '@/supabase';
const team_A = ref("")
const team_B = ref("")
const p1 = ref(0)
const p2 = ref(0)
const p3 = ref(0)
const p4 = ref(0)

let playerOptions = ref([])

const getPlayers = async () => {
  try {
    const { data, error } = await supabase.from('player').select();
    if (error) {
      throw error;
    }
    console.log('selecting');
    playerOptions.value = data;

  } catch (err) {
    console.error(err);
  }
}
onMounted(getPlayers)
function handle() {

  let state = true

  if (team_A.value === '' || team_B.value === '') {
    state = false
  }
  if (p1.value === '' || p2.value === '' || p3.value === '' || p4.value === '') {
    state = false
  }

  if (state) {
    router.push('/match')
  }
  else console.log("error in form")
}
const select = (el,x) => {

  el = x
  console.log(el)
  console.log(playerOptions.value[0].id)

  const index = playerOptions.value.findIndex((l) => l.id == x);
  console.log(index)
  if (index !== -1) {
    playerOptions.value.splice(index, 1);
  }
  console.log(playerOptions.value)
}
</script>


<template>
  <div id="flex">
    <div class="team">
      <label for="teamA">teamA: </label> <input type="text" id="teamA" v-model="team_A"> <br> <br>
      <label for="p1">p1:</label>
      <select name="" id="p1" @change="select(p1,$event.target.value)">
        <option v-for="player in playerOptions">{{ player.id }}</option>
      </select>
      <label for="p2">p1:</label>
      <select name="" id="p2" v-model="p2" @change="select($event.target.value)">
        <option v-for="player in playerOptions">{{ player.id }}</option>
      </select>
    </div>

    <div class="team">
      <label for="teamB">teamB: </label> <input type="text" id="teamB" v-model="team_B"> <br><br>
      <label for="p3">p3:</label>
      <select name="" id="p3" v-model="p3" @change="select($event.target.value)">
        <option v-for="player in playerOptions">{{ player.id }}</option>
      </select>
      <label for="p4">p4:</label>
      <select name="" id="p4" v-model="p4" @change="select($event.target.value)">
        <option v-for="player in playerOptions">{{ player.id }}</option>

      </select>
    </div>
  </div>
  <button @click="handle">start match</button>
</template>