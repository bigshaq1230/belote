<template>
  <div class="form-container">
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="first-name">First Name:</label>
        <input type="text" v-model="firstName" id="first-name" name="first-name" required />
      </div>
      <div class="form-group">
        <label for="last-name">Last Name:</label>
        <input type="text" id="last-name" name="last-name" required v-model="lastName" />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
import router from '@/router';
const firstName = ref('');
const lastName = ref('');

const store = dataStore()


async function onSubmit() {
  if (firstName.value === "" || lastName.value === "") {
    return;
  }

  const player = {
    first_name: firstName.value,
    last_name: lastName.value
  };
  const { session, players,changes } = storeToRefs(store);

  if (session.value === null) {
    changes.value.players.edited.push(player)
    players.value.push(player);
  } else {
    const user = session.value?.user;
    console.log(user)
    const { error } = await supabase.from('player').insert({
      first_name: player.first_name,
      last_name: player.last_name,
      user_id: user?.id,
    });
    if (error) {
      throw error;
    }
  }
  router.back();
}


</script>

<style></style>