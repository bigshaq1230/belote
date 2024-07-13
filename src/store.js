import { defineStore } from "pinia"
import { ref } from "vue"
export const dataStore = defineStore('data', () => {
    let team_A = ref("teamA")
    let team_B = ref("teamB")
    let p1 = ref(1)
    let p2 = ref(2)
    let p3 = ref(3)
    let p4 = ref(4)
    let session = ref()
    return { team_A, team_B, p1, p2, p3, p4,session }
})

