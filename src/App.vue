<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { dataStore } from './store'
import { supabase } from './supabase'
import { googleOneTap } from 'vue3-google-login'
import { storeToRefs } from 'pinia'

const store = dataStore()
const { session, players, changes } = storeToRefs(store)
players.value = JSON.parse(localStorage.getItem('players')) || []

async function syncVariable(obj) {
  const { removed, edited, table } = obj
  if (edited.length > 0) {
    edited.forEach(edit => { edit.user_id = session.value.user.id })
    const { error: upsertError } = await supabase.from(table).upsert(edited)
    if (upsertError) {
      console.error(upsertError)
    }
  }
  if (removed.length > 0) {
    const { error: removeError } = await supabase.from(table).delete().in('id', removed)
    if (removeError) {
      console.error(removeError)
    }
  }
}

async function handleSignInWithGoogle(response) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  })
  if (error) {
    console.error(error.message)
  }
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
  location.reload()
}

const getPlayersFromServer = async () => {
  console.log('Getting players from server')
  try {
    const { data, error } = await supabase.from('player').select().eq('user_id', session.value.user.id)
    if (error) {
      throw error
    }
    console.log(data)
    players.value = data
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })
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
        console.log('Handle the error', error)
      })
  } else {
    const { rounds, players, matches } = changes.value
    try {
      await syncVariable(rounds)
      await syncVariable(players)
      await syncVariable(matches)
    } catch (err) {
      throw err
    } finally {
      changes.value = {
        players: { table: 'player', removed: [], edited: [] },
        matches: { table: 'match', removed: [], edited: [] },
        rounds: { table: 'round', removed: [], edited: [] }
      }
    }
    getPlayersFromServer()
  }
})

watch(players, () => {
  localStorage.setItem('players', JSON.stringify(players.value))
}, { deep: true })

watch(changes, () => {
  localStorage.setItem('changes', JSON.stringify(changes.value))
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
  <button @click ="supabase.auth.signOut()">sign out!</button>
</template>

<style>
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
</style>
