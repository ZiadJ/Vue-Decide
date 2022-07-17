<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'

const items = ref<MenuItem[]>([
  {
    label: 'Home',
    icon: 'pi pi-fw pi-file',
    to: '/'
  },
  {
    label: 'Proposals',
    icon: 'pi pi-fw pi-trash',
    to: '/proposals'
  },
  {
    label: 'Resources',
    icon: 'pi pi-fw pi-file',
    to: '/resources'
  },
  {
    label: 'About',
    icon: 'pi pi-fw pi-trash',
    to: '/about'
  }])
</script>

<template>
  <header>
    <Menubar :model="items">
      <template #start>
        <img src="@/assets/mesh-bg.png" style="height: 35px; margin-bottom: -5px" />
      </template>
      <template #end>
        <InputText placeholder="Global search" type="text" />
      </template>
    </Menubar>
  </header>

  <RouterView />
</template>

<style>
@import "@/assets/base.css";

#app {
  margin: 0 auto;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
