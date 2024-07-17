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
import { supabase } from '@/supabase';
import router from '@/router';
import { dataStore } from '@/store';
const store = dataStore()
const firstName = ref('');
const lastName = ref('');
let players = ref([])
players.value = store.players.value
async function onSubmit() {
    if (firstName.value === "" || lastName.value === "") {
        return
    }
    if (store.session === null) {
        players.value.push({
            first_name: firstName.value,
            last_name: lastName.value
        })
        localStorage.setItem('players', JSON.stringify(players.value))
    }
    else insertPlayertodb()
    router.back()
}

const insertPlayertodb = async () => {

    const { user } = store.session
    const { error } = await supabase.from('player').insert({
        first_name: firstName.value,
        last_name: lastName.value,
        user_id: user.id
    })
    if (error) {
        throw error
    }
}
</script>

<style></style>