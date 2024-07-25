<template>
    <div>
      <input type="text" v-model="player.first_name">
      <input type="text" v-model="player.last_name">

      <img :src="player.on_device_url" alt="Player Avatar" >
      <br>
      temp url: {{ player.on_device_url}}
      <br>
      actual_url: {{ player.avatar_url }}
      <br>
      <input type="file" id="single" accept="image/*" @change="basic_handle" />
      <p>Or:</p>
      <input type="text" v-model="input_url" placeholder="Enter image URL" @input="player.on_device_url = input_url" />
<br>
      <button @click="updateInfo">Update info</button>
      <button @click="deletePlayer"> delete player! </button>
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
  const index = players.value.findIndex( (l) => l.id == route.params.id)

  let player = ref(players.value[index]);
  let input_url = ref('');
  let avatar = ref('');
  let files = ref([]);

  function basic_handle(evt) {
    files.value = evt.target.files;
    const file = files.value[0]
    player.value.on_device_url = URL.createObjectURL(file)
  }
const deletePlayer =  async() => {
  players.value.splice(index,1)
  if(session.value == null)
  changes.value.players.deleted.push(player.value.id)
  else {
    const { error } = await supabase.from('player').delete().eq('id',player.value.id)
    if (error) console.error(error)
  }
}
  const updateInfo = async () => {
    console.log('updating info');
    players.value[index] = player.value;
    let x = {
      id : player.value.id,
      first_name : player.value.first_name,
      last_name : player.value.last_name
    }
    if (session.value == null) {
      changes.value.players.edited.push(x);
    } else {
      x.user_id = player.value.user_id
      if (files.value.length > 0) {
        await upload();
        x.avatar_url = player.value.avatar_url
      }
      else if (input_url.value !== "") x.avatar_url = input_url
      const { error } = await supabase.from('player').upsert(x);

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
<style> 
  img {
    width: 200px;
  }
</style>