<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import { dataStore } from './store';
import { supabase } from './supabase';
import { onMounted } from 'vue';
import { googleOneTap } from "vue3-google-login"

const store = dataStore()
async function handleSignInWithGoogle(response) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  })
  if (error) {
    console.error(error.message)
  }
}
onMounted( async() => {
  await supabase.auth.getSession().then(({ data }) => {
    store.session = data.session
  })
  console.log(store.session)
  supabase.auth.onAuthStateChange((_, _session) => {
    store.session = _session
  })
  if (store.session === undefined) {
    googleOneTap()
      .then((response) => {
        handleSignInWithGoogle(response)
      })
      .catch((error) => {
        console.log("Handle the error", error)
      })
  }
})
</script>

<template>
  <header>

    <div class="wrapper">

      <nav>
        <ul>
          <li>
            <RouterLink to="/">new match</RouterLink>
          </li>
          <li>
            <RouterLink to="/manage">manage players</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
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
