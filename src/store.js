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
    let players = ref(JSON.parse(localStorage.getItem('players')) || [{id:0}])
    let matches = ref(JSON.parse(localStorage.getItem('matches')) || [])
    let changes = ref(JSON.parse(localStorage.getItem('changes')) ||
    {
        players: {
            table: 'player',
            removed: [],
            edited: []
        },
        matches: {
            table: 'match',
            removed: [],
            edited: []
        },
        rounds: {
            table: 'round',
            removed: [],
            edited: []
        }
    })
    return { team_A, team_B, p1, p2, p3, p4, session, players,changes,rounds,matches }
})

