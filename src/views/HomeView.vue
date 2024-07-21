<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
import { supabase } from '@/supabase';
const router = useRouter();
const store = dataStore();
const { players: playerOptions, team_A, team_B, p1, p2, p3, p4,session,changes } = storeToRefs(store);

//TODO MAKES SELECTING THE SMAE PLAYER FROM 2 DIFF PLACES NOT POSSIBLE 

const handle = async() => {
  let state = true;

  if (team_A.value === '' || team_B.value === '') {
    state = false;
    return
  }
  const list = [p1,p2,p3,p4]
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (i === j) {
        continue
      }
      if (list[i].value === list[j].value) {
        state = false 
        return
      }
      
    }
  }
  
  if (state) {
    const match = {
      team_A: team_A.value,
      team_B:team_B.value,
      p1:p1.value,
      p2:p2.value,
      p3:p3.value,
      p4:p4.value,
      id : Date.now()
    }

    if (session.value == null) {
      changes.value.matches.edited.push(match)
    }
    else {
      match.user_id = session.value.user.id
      const { error } = await supabase.from('match').upsert(match)
      if (error) console.log(error)
    }
    router.push('/match/'+ match.id)
  
  } else {
    console.log("error in form");
  }
};


</script>

<template>
  <div id="flex">
    <div class="team">
      <label for="teamA">teamA: </label>
      <input type="text" id="teamA" v-model="team_A"> 
      <label for="">p1</label>
      <select name="" id="" v-model="p1">
        <option v-for="player in playerOptions" :value="player.id"> {{ player.first_name }}</option>
      </select>
      <label for="">p2</label>
      <select name="" id="" v-model="p2">
        <option v-for="player in playerOptions" :value="player.id"> {{ player.first_name }}</option>
      </select>
    </div>
    
    
    
    <div class="team">

      <label for="teamB">teamB: </label>
      <input type="text" id="teamB" v-model="team_B"> 

      <label for="">p3</label>
      <select name="" id="" v-model="p3">
        <option v-for="player in playerOptions" :value="player.id"> {{ player.first_name }}</option>
      </select>

      <label for="">p4</label>
      <select name="" id="" v-model="p4">
        <option v-for="player in playerOptions" :value="player.id"> {{ player.first_name }}</option>
      </select>
    </div>
  </div>
  <button @click="handle">start match</button>
</template>
