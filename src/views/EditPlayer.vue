<template>
    <div>
        <p>{{ player.id }}</p>
        <p>{{ player.first_name }}</p>
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

const getAvatar = async () => {
    if (!player.value.avatar_url) {
        return;
    }
    if (!isUrlHttp(player.value.avatar_url)) {

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

    player.value.avatar_url = avatarUrl.value;

    const { error, data } = await supabase
        .from('player')
        .update({ avatar_url: avatarUrl.value })
        .eq('id', player.value.id)
        .select();

    if (error) {
        console.error('Error updating player avatar URL:', error);
        return;
    }

    player.value = data[0];
    avatar.value = avatarUrl.value;
};

onMounted(() => {
    getDetails();
});
</script>
