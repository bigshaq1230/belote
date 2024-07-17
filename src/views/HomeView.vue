<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
const store = dataStore()
const team_A = ref("")
const team_B = ref("")
const p1 = ref()
const p2 = ref()
const p3 = ref()
const p4 = ref()

let { players: playerOptions } = storeToRefs(store)

let playerSelection = ref([
  [0],
  [0],
  [0],
  [0]
])
playerSelection.value[0] = playerOptions.value.value
playerSelection.value[1] = playerOptions.value.value
playerSelection.value[2] = playerOptions.value.value
playerSelection.value[3] = playerOptions.value.value
function handle() {

  let state = true

  if (team_A.value === '' || team_B.value === '') {
    state = false
  }
  if (p1.value === '' || p2.value === '' || p3.value === '' || p4.value === '') {
    state = false
  }

  if (state) {
    // fix 
    router.push('/match')
  }
  else console.log("error in form")
}
const select = (n, x) => {

  for (let i = 0; i < 4; i++) {


    // Find the index of the item with the given id
    const index = playerSelection.value[n].findIndex((l) => l.id == x);

    // Check if the item was found
    if (index !== -1) {
      // Remove the item from playerOptions
      playerSelection.value[n].splice(index, 1);

    } else {
      console.error(`Item with id ${x} not found.`);
    }
  }
};




</script>


<template>
  <div id="flex">
    <div class="team">
      <label for="teamA">teamA: </label> <input type="text" id="teamA" v-model="team_A"> <br> <br>

      <label for="p1">p1:</label>
      <select name="" id="p1" @change="select(1, $event.target.value)">
        <option v-for="player in playerSelection[0]">{{ player.id }}</option>
      </select>

      <label for="p2">p1:</label>
      <select name="" id="p2" @change="select(1, $event.target.value)" v-model="p2">
        <option v-for="player in playerSelection.value[1]">{{ player.id }}</option>
      </select>
    </div>

    <div class="team">
      <label for="teamB">teamB: </label> <input type="text" id="teamB" v-model="team_B"> <br><br>
      <label for="p3">p3:</label>
      <select name="" id="p3" v-model="p3" @change="select(2, $event.target.value)">
        <option v-for="player in playerSelection.value[2]">{{ player.id }}</option>
      </select>
      <label for="p4">p4:</label>
      <select name="" id="p4" v-model="p4" @change="select(3, $event.target.value)">
        <option v-for="player in playerSelection.value[3]">{{ player.id }}</option>

      </select>
    </div>
  </div>
  <button @click="handle">start match</button>
</template>