<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
const store = dataStore();
const team_A = ref("");
const team_B = ref("");
const p1 = ref("");
const p2 = ref("");
const p3 = ref("");
const p4 = ref("");

const { players: playerOptions } = storeToRefs(store);

let playerSelection = ref([
    playerOptions,
    playerOptions,
    playerOptions,
    playerOptions
  ]);

/*
watch(playerOptions, () => {
  playerSelection.value = [
    playerOptions.value,
    playerOptions.value,
    playerOptions.value,
    playerOptions.value,
  ]
})
  */
function handle() {
  let state = true;

  if (team_A.value === '' || team_B.value === '') {
    state = false;
  }
  if (p1.value === '' || p2.value === '' || p3.value === '' || p4.value === '') {
    state = false;
  }

  if (state) {
    router.push('/match');
  } else {
    console.log("error in form");
  }
}

const select = (n, x) => {
  playerSelection.value.forEach((selection, i) => {
    if (i !== n) {
      const index = selection.findIndex((player) => player.id == x);
      if (index !== -1) {
        selection.splice(index, 1);
      }
    }
  });
};
</script>

<template>
  <div id="flex">
    <div class="team">
      <label for="teamA">teamA: </label>
      <input type="text" id="teamA" v-model="team_A"> <br> <br>

      <label for="p1">p1:</label>
      <select name="" id="p1" v-model="p1" @change="select(0, $event.target.value)">
        <option v-for="player in playerSelection[0].value" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>

      <label for="p2">p2:</label>
      <select name="" id="p2" v-model="p2" @change="select(1, $event.target.value)">
        <option v-for="player in playerSelection[1].value" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>
    </div>

    <div class="team">
      <label for="teamB">teamB: </label>
      <input type="text" id="teamB" v-model="team_B"> <br><br>

      <label for="p3">p3:</label>
      <select name="" id="p3" v-model="p3" @change="select(2, $event.target.value)">
        <option v-for="player in playerSelection[2].value" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>

      <label for="p4">p4:</label>
      <select name="" id="p4" v-model="p4" @change="select(3, $event.target.value)">
        <option v-for="player in playerSelection[3].value" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>
    </div>
  </div>
  <button @click="handle">start match</button>
</template>
