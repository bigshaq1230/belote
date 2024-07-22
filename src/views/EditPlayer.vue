<template>
    <div>
      <input type="text" v-model="player.first_name">
      <input type="text" v-model="player.last_name">

      <img :src="avatars[index]" alt="Player Avatar">
      <br>
      temp url: {{ avatars[index] }}
      <br>
      actual_url: {{ player.avatar_url }}
      <br>
      <input type="file" id="single" accept="image/*" @change="basic_handle" />
      <p>Or:</p>
      <input type="text" v-model="input_url" placeholder="Enter image URL" @input="avatars[index] = input_url" />

      <button @click="updateInfo">Update info</button>
    </div>
  </template>

  <script setup>
  import { useRoute } from 'vue-router';
  import { supabase } from '@/supabase';
  import { onMounted, ref } from 'vue';
  import { dataStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';
  const store = dataStore();
  const { players, session, changes,avatars } = storeToRefs(store);

  const route = useRoute();
  const index = route.params.id;

  let player = ref(players.value[index]);
  let input_url = ref('');
  let avatar = ref('');
  let files = ref([]);

  function basic_handle(evt) {
    files.value = evt.target.files;
    const file = files.value[0]
    avatars.value[index] = URL.createObjectURL(file)
  }

  const updateInfo = async () => {
    console.log('updating info');
    players.value[index] = player.value;
    if (session.value == null) {
      changes.value.players.edited.push(player.value);
    } else {
      if (files.value.length > 0) {
        await upload();
      }
      else if (input_url.value !== "") player.value.avatar_url = input_url
      const { error } = await supabase.from('player').upsert(player.value);

      if (error) console.error(error);
    }
  };


  const upload = async () => {
    console.log(files.value)
    if (files.value.length === 0) {
      return;
    }
    console.log("uploading img");
    const file = files.value[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${player.value.id}.${fileExt}`;

    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return;
    }
    player.value.avatar_url = filePath
  };
  onMounted(async () => {
    if (session.value == null) {
      console.log('no session in editplayer');
    } else {
      console.log("i have a session in editplayer");
    }
  });
  </script>
