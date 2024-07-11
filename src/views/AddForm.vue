<template>
    <div class="form-container">
        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label for="first-name">First Name:</label>
                <input
                    type="text"
                    v-model="firstName"
                    id="first-name"
                    name="first-name"
                    required
                />
            </div>
            <div class="form-group">
                <label for="last-name">Last Name:</label>
                <input
                    type="text"
                    id="last-name"
                    name="last-name"
                    required
                    v-model="lastName"
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/supabase';
import router from '@/router';

const firstName = ref('');
const lastName = ref('');
async function onSubmit() {
    if (firstName.value === "" || lastName.value === "") {
        return
    }
    const { error } = await supabase.from('player').insert({
        first_name : firstName.value,
        last_name : lastName.value
    })
    if (error) {
        throw error
    }
    router.back()
}
</script>

<style>

</style>