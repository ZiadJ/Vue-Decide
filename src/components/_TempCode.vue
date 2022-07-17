<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { promiseTimeout, useStorage } from '@vueuse/core'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { RestEntityService } from '@/services/restentityservice'
import Prisma from '@prisma/client'
import type { HttpResponse } from '@/services/_http'

interface todos {
  id: string
  text: string
}

const crud = new RestEntityService<todos>(
  'https://humania.up.railway.app',
  'todos'
).onFailure((response: Response, error: string) => {
  debugger
})

onMounted(async () => {
  // postgresql://postgres:oGI3YIIboRsauNLTrvog@containers-us-west-85.railway.app:7108/railway
  console.clear()
  //const del = await crud.delete('-1')
  //console.log(aaa)
  //let response = await crud.create({ text: '555555555' })

  // let list = await (
  //   await crud.get('3eade83c-761d-4314-a4c6-0744768e840c')
  // ).result

  let listAll = await (await crud.getAll()).result
  let x = listAll
  // //console.log(response)
  // //debugger
})

interface IAutoCompleteItem {
  name: string
  label: string
  category: string
}

let themeName = useStorage('themeQuery', '')
let theme = useStorage<IAutoCompleteItem>('theme', {
  name: 'bootstrap4-dark-blue',
  label: '',
  category: ''
})

let themeLink = ref('')

const filteredThemes = ref<object[]>([])
const themeNames = [
  { name: 'Afghanistan', label: 'AF' },
  { name: 'blbania', label: 'AL' },
  { name: 'clgeria', label: 'DZ' },
  { name: 'Andorra', label: 'AD' },
  { name: 'Azerbaijan', label: 'AZ' }
]

const searchTheme1 = (event: AutoCompleteCompleteEvent) => {
  if (!event.query.trim().length) {
    filteredThemes.value = [...themeNames]
  } else {
    filteredThemes.value = themeNames.filter((theme) => {
      return theme.name.toLowerCase().includes(event.query.toLowerCase())
    })
    console.log(filteredThemes.value.length)
  }
}

function getOptionText(item: any) {
  return item.name
}

const test = ref(0)
function voteChange(event: any, args?: any) {
  test.value = event
}
</script>

<template>
  <vote :userVote="test" :glovalVote="test" title="aaa" @change="voteChange" />

  <input v-model="themeName" />
  <AutoComplete
    onfocus="this.select()"
    dropdown
    forceSelection
    autoHighlight
    completeOnFocus
    scrollHeight="85vh"
    v-model="themeName"
    :suggestions="filteredThemes"
    @complete="searchTheme1"
    field="name"
    class="inputSearch"
    placeholder="🔍 Search Theme"
  >
    <template #item="slotProps">
      <img
        style="width: 20px; float: left; margin: 4px"
        :alt="slotProps.item.name"
        :src="'/src/assets/mesh-bg.png'"
      />
      <div>{{ slotProps.item.name }}</div>
    </template>
  </AutoComplete>
  Country: {{ themeName }}

  <Dropdown
    v-model="themeName"
    :options="themeNames"
    optionLabel="name"
    :filter="true"
    placeholder="Select a theme"
    :showClear="true"
  >
    <template #value="slotProps">
      <div class="country-item country-item-value" v-if="slotProps.value">
        <div>{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <img
        style="width: 20px; float: left; margin: 4px"
        :alt="slotProps.option.name"
        :src="'/src/assets/mesh-bg.png'"
      />
      <div class="country-item">
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>
<style></style>
