<template>
    <label for="">p{{ index }}</label>
    <select name="" id="">
      <option v-for="player in list" :key="player.id" :value="player.id">
        {{ player.id }}
      </option>
    </select>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  // Define props
  const props = defineProps(['list', 'index'])
  
  // Reactive references
  const list = ref(props.list)
  const index = ref(props.index)
  
  // Watch for changes in props and update reactive references accordingly
  watch(() => props.list, (newList) => {
    list.value = newList
  })
  
  watch(() => props.index, (newIndex) => {
    index.value = newIndex
  })
  </script>
  