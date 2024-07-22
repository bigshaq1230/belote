<template>
    <table v-if="index !== -1">
        <tr>
            <td>teamA: {{ totalA }}</td>
            <td>teamB: {{ totalB }}</td>
        </tr>
        <tr v-for="round in matches[index].rounds" :key="round.id">
            <td>{{ round.scoreA }}</td>
            <td>{{ round.scoreB }}</td>
        </tr>
        <tr>
            <td><input type="number" id="scoreA" v-model="scoreA"></td>
            <td><input type="number" id="scoreB" v-model="scoreB"></td>
            <td><button @click="add">add!</button></td>
        </tr>
    </table>
    <div v-else>
        <p>Match not found</p>
    </div>
    <button @click="complete" v-if="index !== -1">mark complete</button>
</template>

<script setup>
import { dataStore } from '@/store';
import { supabase } from '@/supabase';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

const route = useRoute();
const scoreA = ref(0);
const scoreB = ref(0);
const store = dataStore();
const { session, changes, matches } = storeToRefs(store);
let index = matches.value.findIndex((l) => l.id == route.params.id)

if (index.value === -1) {
    console.error(`Match with id ${route.params.id} not found`);
}

console.log("rounds:", matches.value[index]?.rounds);

async function add() {
    const round = {
        scoreA: scoreA.value,
        scoreB: scoreB.value,
        match_id: route.params.id,
        id: Date.now()
    };
    if (session.value == null) {
        changes.value.rounds.edited.push(round);
    } else {
        round.user_id = session.value.user.id;
        const { error } = await supabase.from('round').upsert(round);
        if (error) console.error(error);
    }
    matches.value[index].rounds.push(round);
    scoreA.value = 0;
    scoreB.value = 0;
}

const totalA = computed(() => matches.value[index]?.rounds.reduce((sum, round) => sum + round.scoreA, 0) || 0);
const totalB = computed(() => matches.value[index]?.rounds.reduce((sum, round) => sum + round.scoreB, 0) || 0);

function complete() {
    if (totalA.value === 0 && totalB.value === 0) {
        return;
    }
    route.hash = '/';
}
</script>
