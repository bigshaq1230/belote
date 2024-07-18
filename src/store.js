import { defineStore } from "pinia"
import { ref } from "vue"
export const dataStore = defineStore('data', () => {
    let team_A = ref("teamA")
    let team_B = ref("teamB")
    let p1 = ref()
    let p2 = ref()
    let p3 = ref()
    let p4 = ref()
    let session = ref()
    let players = ref([])
    let nigger = ref(0)
    return { nigger,team_A, team_B, p1, p2, p3, p4,session,players }
})

