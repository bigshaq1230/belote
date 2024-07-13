<template>
    <div>
        <input type="text" v-model="player.first_name">
        <input type="text" name="" id="" v-model="player.last_name">
        <button @click="updateInfo">Update info</button>
        <img :src="avatar" alt="Player Avatar">
        <input type="file" id="single" accept="image/*" @change="upload" />
        <p>Or:</p>
        <input type="text" v-model="avatarUrl" placeholder="Enter image URL" />
        <button @click="setAvatarUrl">Set with URL!</button>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { supabase } from '@/supabase';
import { onMounted, ref } from 'vue';
import isUrlHttp from 'is-url-http';
import { dataStore } from '@/store';
const store = dataStore()
let player = ref({
    id: 0,
    first_name: 'first_name',
    last_name: 'last_name',
    avatar_url: ''
});
let avatar = ref('');
let avatarUrl = ref('');
let files = ref([]);
const route = useRoute();
const id = route.params.id;

const getDetails = async () => {
    const { error, data } = await supabase
        .from('player')
        .select()
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching player details:', error);
        return;
    }
    player.value = data;
    await getAvatar();
};
const updateInfo = async () => {
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

const upload = async (evt) => {
    files.value = evt.target.files;

    if (!files.value || files.value.length === 0) {
        console.error('You must select an image to upload.');
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

    const { error, data } = await supabase
        .from('player')
        .update({ avatar_url: filePath })
        .eq('id', player.value.id)
        .select();

    if (error) {
        console.error('Error updating player avatar:', error);
        return;
    }

    player.value = data[0];
    await getAvatar();
};

const setAvatarUrl = async () => {
    if (!avatarUrl.value) {
        console.error('You must enter a URL.');
        return;
    }
    if (!isUrlHttp(player.value.avatar_url)) {
        const { error: deleteError } = await supabase.storage.from('avatars').remove([player.value.avatar_url])
        if (deleteError) {
            console.error(deleteError)
        }
    }
    player.value.avatar_url = avatarUrl.value;
    const { error, data } = await supabase
        .from('player')
        .update({ avatar_url: avatarUrl.value })
        .eq('id', player.value.id)

    if (error) {
        console.error('Error updating player avatar URL:', error);
        return;
    }
    avatar.value = avatarUrl.value;
};

onMounted(() => {
    getDetails();
});
</script>
