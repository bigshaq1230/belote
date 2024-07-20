<template>
    <div>
      <input type="text" v-model="player.first_name">
      <input type="text" v-model="player.last_name">
  
      <img :src="avatar" alt="Player Avatar">
  
      <input type="file" id="single" accept="image/*" @change="basic_handle" />
      <p>Or:</p>
      <input type="text" v-model="input_url" placeholder="Enter image URL" @input="avatar = input_url" />
  
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
  const { players, session, changes } = storeToRefs(store);
  
  const route = useRoute();
  const index = route.params.id;
  
  let player = ref(players.value[index]);
  let input_url = ref('');
  let avatar = ref('');
  let files = ref([]);
  
  function basic_handle(evt) {
    files.value = evt.target.files;
    const file = files.value[0]
    avatar.value = URL.createObjectURL(file)
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
  
  const getAvatar = async () => {
    console.log(player.value.avatar_url);
    if (!player.value.avatar_url) {
      return;
    }
  
    function isValidFormat(str) {
      const pattern = /^\d+\.\w+$/;
      return pattern.test(str);
    }
  
    if (isValidFormat(player.value.avatar_url)) {
      const { error, data } = await supabase
        .storage
        .from('avatars')
        .download(player.value.avatar_url);
  
      if (error) {
        console.error('Error downloading avatar:', error);
        return;
      }
  
      const url = URL.createObjectURL(data);
      avatar.value = url;
    } else {
      avatar.value = player.value.avatar_url;
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
    
    player.value.avatar_url = filePath;
  };
  
  onMounted(async () => {
    if (session.value == null) {
      console.log('no session in editplayer');
    } else {
      console.log("i have a session in editplayer");
      await getAvatar();
    }
  });
  watch(session,async() =>  await getAvatar(),{once:true})
  </script>
  