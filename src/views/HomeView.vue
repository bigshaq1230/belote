

<script setup>
import { data } from '@/store';
import { ref } from 'vue';
import router from '@/router';
const team_A =  ref("")
const team_B = ref("")
const p1 = ref(0)
const p2 = ref(0)
const p3 = ref(0)
const p4 = ref(0)


function handle() {

  let state = true

  if (team_A.value === '' || team_B.value === '') {
    state = false
  }
  if (p1.value === '' || p2.value === ''  || p3.value === '' || p4.value=== '' ) {
    state = false
  }

  if (state) {
    router.push('/match')
  }
  else console.log("error in form")


}
</script>


<template>
    <div id="flex">
      <div class="team">
        <label for="teamA">teamA: </label> <input type="text" id="teamA" v-model="team_A"> <br> <br>
        <label for="p1">p1:</label>
        <select name="" id="p1" v-model="p1">
          <option value="1" >ahmad</option>
          <option value="2">test</option>
        </select>
        <label for="p2">p1:</label>
        <select name="" id="p2" v-model="p2">
          <option value="3">p2</option>
          <option value="4">p2</option>
        </select>
      </div>

      <div class="team">
        <label for="teamB">teamB: </label> <input type="text" id="teamB" v-model="team_B"> <br><br>

          <label for="p3">p3:</label>
        <select name="" id="p3" v-model="p3">
          <option value="5">p3</option>
          <option value="6">test</option>
        </select>

        <label for="p4">p4:</label>
        <select name="" id="p4" v-model="p4">
          <option value="7">p4</option>
          <option value="8">test</option>
        </select>
      </div>
    </div>
      <button @click="handle">start match</button>
</template>

