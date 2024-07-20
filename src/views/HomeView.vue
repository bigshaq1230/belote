<script setup>
import { onMounted, ref, watch,computed } from 'vue';
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
  playerOptions.value,
  playerOptions.value,
  playerOptions.value,
  playerOptions.value
]);

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


const selectedPlayers = ref([p1, p2, p3, p4]);

const select = (n, x) => {
  selectedPlayers.value[n].value = x;
};

const filteredPlayers = (index) => {
  return computed(() => {
    const selectedIds = selectedPlayers.value.map(p => p.value);
    return playerSelection.value[index].filter(player => !selectedIds.includes(player.id));
  });
};
console.log(filteredPlayers(0))
d"
</script>

<template>
  <div id="flex">
    <div class="team">
      <label for="teamA">teamA: </label>
      <input type="text" id="teamA" v-model="team_A"> <br> <br>


      <label for="p1">p1:</label>
      <select name="" id="p1" v-model="p1" @change="select(0, $event.target.value)">
        <option v-for="player in filteredPlayers(0)" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>

      <label for="p2">p2:</label>
      <select name="" id="p2" v-model="p2" @change="select(1, $event.target.value)">
        <option v-for="player in filteredPlayers(1)" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>
    </div>

    <div class="team">
      <label for="teamB">teamB: </label>
      <input type="text" id="teamB" v-model="team_B"> <br><br>

      <label for="p3">p3:</label>
      <select name="" id="p3" v-model="p3" @change="select(2, $event.target.value)">
        <option v-for="player in filteredPlayers(2)" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>

      <label for="p4">p4:</label>
      <select name="" id="p4" v-model="p4" @change="select(3, $event.target.value)">
        <option v-for="player in filteredPlayers(3)" :key="player.id" :value="player.id">{{ player.first_name }}
        </option>
      </select>
    </div>
  </div>
  <button @click="handle">start match</button>
</template>
