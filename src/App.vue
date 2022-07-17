<script setup lang="ts">
// kinshukshah@gmail.com - https://github.com/kinshukshah
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { PrimeIcons } from 'primevue/api';

const items = ref<MenuItem[]>([
  {
    label: 'Dashboard',
    icon: PrimeIcons.CHART_LINE,
    to: '/dashboard'
  },
  {
    label: 'Goals',
    icon: PrimeIcons.CHART_BAR,
    to: '/'
  },
  {
    label: 'Proposals',
    icon: PrimeIcons.SLIDERS_V,
    to: '/proposals'
  },
  {
    label: 'Resources',
    icon: PrimeIcons.GLOBE,
    to: '/resources'
  },
  {
    label: 'About',
    icon: PrimeIcons.INFO_CIRCLE,
    to: '/about'
  }
])

let showThemeSwitcher = ref(false)
</script>

<template>
  <header>
    <Transition name="page-opacity" mode="default" appear>
      <Menubar :model="items" style="padding: 0">
        <template #start>
          <a href="/"
            ><img
              src="@/assets/mesh-bg.png"
              style="height: 35px; margin-bottom: -5px; padding-left: 12px"
            />
          </a>
        </template>
        <template #end>
          <div class="col-12 md:col-12 sm:col-6 xs:col-4" style="float: right">
            <div class="p-inputgroup">
              <InputText placeholder="Global search" type="text" />
              <ThemeSwitcher style="display: none" />
            </div>
          </div>
        </template>
      </Menubar>
    </Transition>
  </header>

  <RouterView class="router-view" v-slot="{ Component }" style="height: 100%">
    <Transition name="page-opacity" mode="default" appear>
      <component
        :is="Component"
        style="position: absolute; width: 100%; height: 100%"
      />
    </Transition>
  </RouterView>
</template>

<style>
@import '@/assets/base.css';

#app {
  margin: 0 auto;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 350ms ease all;
}
.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
  transform: translateY(25px);
}

.page-slide-enter-active,
.page-slide-leave-active {
  transition: 250ms ease all;
}
.page-slide-enter-from,
.page-slide-leave-to {
  opacity: 0.5;
  transform: translateY(15px);
}

.padded-page {
  padding: 10px;
}

.tight-fit {
  margin: 0;
  padding: 0;
  border-radius: 0;
  border: 0;
}

.pointer {
  cursor: pointer;
}

/* PrimeVue Global */
.p-multiselect-panel,
.p-autocomplete-panel,
.p-dialog-mask {
  z-index: 100;
}

.p-dialog-movable .p-dialog-header {
  cursor: move;
}

.search,
.inputSearch input {
  background-image: url('../../node_modules/primeicons/raw-svg/search.svg');
  background-size: 1.5em;
  background-position: left 10px top 50%;
  background-repeat: no-repeat;
  text-indent: 30px;
}
</style>
