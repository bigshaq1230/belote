<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch, onMounted, onBeforeMount } from 'vue'
import { dataStore } from './store'
import { supabase } from './supabase'
import { googleOneTap } from 'vue3-google-login'
import { storeToRefs } from 'pinia'

const store = dataStore()
const { session, players, changes, matches } = storeToRefs(store)
console.log(changes.value)
async function syncVariable(obj) {
  const { removed, edited, table } = obj
  try {
    if (edited.length > 0) {
      edited.forEach(edit => { edit.user_id = session.value.user.id })
      const { error: upsertError } = await supabase.from(table).upsert(edited)
      if (upsertError) throw upsertError
    }
    if (removed.length > 0) {
      const { error: removeError } = await supabase.from(table).delete().in('id', removed)
      if (removeError) throw removeError
    }
  } catch (error) {
    console.error(`Error syncing ${table}:`, error)
  }
}

async function handleSignInWithGoogle(response) {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })
    if (error) throw error
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
    location.reload()
  } catch (error) {
    console.error('Google sign-in error:', error.message)
  }
}

const getPlayers = async () => {
  console.log('Getting players from server')
  try {
    const { data, error } = await supabase.from('player').select().eq('user_id', session.value.user.id)
    if (error) throw error
    console.log(data)
    players.value = data
  } catch (err) {
    console.error('Error fetching players:', err)
  }
}

onBeforeMount(async () => {
  try {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    console.log(session.value)

    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })

    if (!session.value) {
      await googleOneTap()
        .then((response) => {
          handleSignInWithGoogle(response)
        })
        .catch((error) => {
          console.log('Google One Tap error:', error)
        })
    } else {
      const { rounds, players, matches } = changes.value
      try {

        await syncVariable(players)
        await syncVariable(matches)
        await syncVariable(rounds)
      }
      catch (err) { console.error(er) }
      finally {
        changes.value = {
          players: { table: 'player', removed: [], edited: [] },
          matches: { table: 'match', removed: [], edited: [] },
          rounds: { table: 'round', removed: [], edited: [] }
        }
      }

      await getPlayers()
      await getMatches()
      await getRounds()
      resolve_avatar_url()
    }
  } catch (error) {
    console.error('Initialization error:', error)
  }
})

async function resolve_avatar_url() {
  function isValidFormat(str) {
    const pattern = /^\d+\.\w+$/
    return pattern.test(str)
  }

  players.value.forEach(async (player) => {
    if (!player.avatar_url) return

    if (isValidFormat(player.avatar_url)) {
      try {
        const { error, data } = await supabase.storage.from('avatars').download(player.avatar_url)
        if (error) throw error
        const url = URL.createObjectURL(data)
        player.avatar_url = url
      } catch (error) {
        console.error('Error downloading avatar:', error)
      }
    }
  })
}

async function getRounds() {
  try {
    const { error, data } = await supabase.from('round').select().eq('user_id', session.value.user.id)
    if (error) throw error
    console.log("rounds:", data)

    data.forEach(round => {
      const index = matches.value.findIndex((l) => l.id === round.match_id)
      console.log(index)
      if (index !== -1) {
        matches.value[index].rounds.push(round)
      }
    })
    console.log(matches.value)
  } catch (error) {
    console.error('Error fetching rounds:', error)
  }
}

async function getMatches() {
  try {
    const { error, data } = await supabase.from('match').select().eq('user_id', session.value.user.id)
    if (error) throw error
    matches.value = data

    matches.value.forEach(match => {
      match.rounds = []
    })
  } catch (error) {
    console.error('Error fetching matches:', error)
  }
}

watch(players, () => {
  localStorage.setItem('players', JSON.stringify(players.value))
}, { deep: true })

watch(changes, () => {
  localStorage.setItem('changes', JSON.stringify(changes.value))
  console.log(changes.value)
}, { deep: true })

watch(matches, () => {
  localStorage.setItem('matches', JSON.stringify(matches.value))
}, { deep: true })
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <ul>
          <li>
            <RouterLink to="/">New Match</RouterLink>
          </li>
          <li>
            <RouterLink to="/manage">Manage Players</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <RouterView />
  <button @click="supabase.auth.signOut()">Sign Out!</button>
</template>

<style src="../src/assets/base.css">
body {
  font-family: Arial, sans-serif;
  background-color: #0c120d;
}

.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="file"] {
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

img {
  height: 100%;

}
</style>
