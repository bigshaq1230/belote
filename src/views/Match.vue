<template>
    <table>
        <tr>
            <td>teamA: {{ totalA }}</td>
            <td>teamB: {{ totalB }}</td>
        </tr>
        <tr v-for="(round, index) in rounds" :key="index">
            <td>{{ round.A }}</td>
            <td>{{ round.B }}</td>
        </tr>
        <tr>
            <td><input type="number" id="scoreA" v-model="scoreA"></td>
            <td><input type="number" id="scoreB" v-model="scoreB"></td>
            <td><button @click="add">add!</button></td>
        </tr>
    </table>
    <button @click="complete">mark complete</button>
</template>

<script setup>
import { dataStore } from '@/store';
import { supabase } from '@/supabase';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const scoreA = ref(0);
const scoreB = ref(0);
const store = dataStore();
const { session, changes, matches } = storeToRefs(store)
const index = matches.value.findIndex((l) => l.match_id == route.params.id)
async function add() {
    const round = {
        scoreA: scoreA.value,
        scoreB: scoreB.value,
        match_id: route.params.id,
        id: Date.now()
    };
    if (session.value == null) {
        changes.value.rounds.edited.push(round)
    }
    else {
        round.user_id = session.value.user.id
        const { error } = await supabase.from('round').upsert(round)
        if (error) console.error(error)
    }
    rounds.value.push(round)
    scoreA.value = 0;
    scoreB.value = 0;
}
const totalA = computed(() => rounds.value.reduce((sum, round) => sum + round.scoreA, 0));
const totalB = computed(() => rounds.value.reduce((sum, round) => sum + round.scoreB, 0));
function complete() {
    if (totalA.value === 0 && totalB.value === 0) {
        return
    }
    route.hash = '/'
}
</script>
