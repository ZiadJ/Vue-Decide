<script setup lang="ts">
import { ref } from 'vue';

defineProps(['title', 'content'])
defineEmits(['yes', 'no'])

let show = ref(true)

function yes() {
  show.value = false
}

function no() {
  show.value = false
}
</script>
<template>
  <Dialog :close-on-escape="true" :maximizable="true" :visible="show">
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    {{ content }}
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="no" />
      <Button label="Yes" icon="pi pi-check" autofocus @click="yes" />
    </template>
  </Dialog>
</template>
