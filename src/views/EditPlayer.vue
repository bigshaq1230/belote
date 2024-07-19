<template>
    <div>
        <input type="text" v-model="player.first_name">
        <input type="text" name="" id="" v-model="player.last_name">
        
        
        <img :src="avatar" alt="Player Avatar">
        
        
        <input type="file" id="single" accept="image/*" @change=" (evt) =>  files.value = evt.target.files"/>
        <p>Or:</p>
        <input type="text" v-model="avatarUrl" placeholder="Enter image URL" />

        <button @click="updateInfo">Update info</button>

    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { supabase } from '@/supabase';
import { onMounted, ref } from 'vue';
import isUrlHttp from 'is-url-http';
import { dataStore } from '@/store';
import { storeToRefs } from 'pinia';
const store = dataStore()

let input_url = ref('');
let avatar_url = ref('')

const { players, session, changes } = storeToRefs(store)

let files = ref([]);
const route = useRoute();

const index = route.params.id;

let player = ref(players.value[index]);

const getDetails = async () => {

};

const updateInfo = async () => {
    players.value[index] = player
    if (session.value === null) {
        changes.value.players.edited.push(player)
    }
    const { error } = await supabase.from('player').upsert(player.value)
}

const getAvatar = async () => {
    
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
    }
    else {
        avatar.value = player.value.avatar_url;
    }
};

const upload = async () => {
    
    if (!files.value || files.value.length === 0) {
        return;
    }

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

    const { error } = await supabase
        .from('player')
        .update({ avatar_url: filePath })
        .eq('id', player.value.id)


    if (error) {
        console.error('Error updating player avatar:', error);
        return;
    }

    player.value.avatar_url = file.name
};




const setAvatarUrl = async () => {
    
    
    if (input_url.value === "") {
        console.error('You must enter a URL.');
        return;
    }


    if (!isUrlHttp(player.value.avatar_url)) {
        const { error: deleteError } = await supabase.storage.from('avatars').remove([player.value.avatar_url])
        if (deleteError) {
            console.error(deleteError)
        }
    }

    const { error, data } = await supabase
        .from('player')
        .update({ avatar_url: avatarUrl.value })
        .eq('id', player.value.id)

    if (error) {
        console.error('Error updating player avatar URL:', error);
        return;
    }
    player.value.avatar_url = input_url.value;
};

onMounted(async () => {
    if (session.value == null) {
        console.log('no session in editplayer')
    }
    else {
        console.log("i have a session in editplayer")
        await getAvatar();
    }
    await getDetails();
});
</script>
