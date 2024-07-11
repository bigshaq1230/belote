<template>
    <table>
        <tr>
            <td>teamA: {{ totalA }}</td>
            <td>teamB: {{ totalB }}</td>
        </tr>
        <tr v-for="(round,index) in rounds" :key="index">
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
import { data } from '@/store';
import { computed, ref } from 'vue';

const scoreA = ref(0);
const scoreB = ref(0);
const rounds = ref([]);
const store = data();
let matches = JSON.parse( localStorage.getItem('matches')) || []
function add() {
    rounds.value.push({
        A: scoreA.value,
        B: scoreB.value
    });
    scoreA.value = 0;
    scoreB.value = 0;
}
const totalA = computed(() => rounds.value.reduce((sum, round) => sum + round.A, 0));
const totalB = computed(() => rounds.value.reduce((sum, round) => sum + round.B, 0));
function complete() {
    if (totalA.value === 0 && totalB.value === 0) {
        return
    }
    matches.push({
        teamA : store.team_A,
        teamB : store.team_B,
        p1:store.p1,
        p2:store.p2,
        p3:store.p3,
        p4:store.p4,
        scoreA : totalA.value,
        scoreB : totalB.value
    })
    rounds.value = []
    scoreA.value = 0
    scoreB.value = 0
    localStorage.setItem('matches',JSON.stringify(matches))
}
</script>
