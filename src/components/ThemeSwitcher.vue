<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useStorage } from '@vueuse/core'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import Dialog from 'primevue/dialog'
import { onMounted, ref, watch } from 'vue'

interface IAutoCompleteItem {
  name: string
  flatname?: string
  label?: string
  category?: string
  items?: IAutoCompleteItem[]
}

let themeNames: IAutoCompleteItem[] = [
  { name: 'bootstrap4-light-blue', items: [{ name: 'test' }] },
  { name: 'bootstrap4-light-purple' },
  { name: 'bootstrap4-dark-blue' },
  { name: 'bootstrap4-dark-purple' },
  { name: 'md-light-indigo' },
  { name: 'md-light-deeppurple' },
  { name: 'md-dark-indigo' },
  { name: 'md-dark-deeppurple' },
  { name: 'mdc-light-indigo' },
  { name: 'mdc-light-deeppurple' },
  { name: 'mdc-dark-indigo' },
  { name: 'mdc-dark-deeppurple' },
  { name: 'tailwind-light' },
  { name: 'fluent-light' },
  { name: 'lara-light-indigo' },
  { name: 'lara-dark-indigo' },
  { name: 'lara-light-purple' },
  { name: 'lara-dark-purple' },
  { name: 'lara-light-blue' },
  { name: 'lara-dark-blue' },
  { name: 'lara-light-teal' },
  { name: 'lara-dark-teal' },
  { name: 'saga-blue' },
  { name: 'saga-green' },
  { name: 'saga-orange' },
  { name: 'saga-purple' },
  { name: 'vela-blue' },
  { name: 'vela-green' },
  { name: 'vela-orange' },
  { name: 'vela-purple' },
  { name: 'arya-blue' },
  { name: 'arya-green' },
  { name: 'arya-orange' },
  { name: 'arya-purple' },
  { name: 'nova' },
  { name: 'nova-alt' },
  { name: 'nova-accent' },
  { name: 'nova-vue' },
  { name: 'luna-amber' },
  { name: 'luna-blue' },
  { name: 'luna-green' },
  { name: 'luna-pink' },
  { name: 'rhea' }
]

const initTheme = themeNames.find((el) => el.name === 'bootstrap4-dark-blue')
let theme = useStorage<IAutoCompleteItem>(
  'theme',
  initTheme as IAutoCompleteItem
)

let themeLink = ref('')

watch(theme, (newName: IAutoCompleteItem, oldName: IAutoCompleteItem) => {
  loadTheme(newName?.name, oldName?.name)
})

const themeNamesJson = computed(() => {
  const tempArr: {}[] = []

  themeNames.forEach((item) => {
    const name = item.name
    const parts = name.split('-')
    tempArr.push({
      name: name,
      flatname: parts.join('_'),
      category: parts.length ? parts[0] : 'other',
      label: parts.join(' ')
    })
  })

  setTimeout(() => {
    console.clear()
    console.log(tempArr)
  }, 3000)

  return tempArr
})

loadTheme(theme.value.name)

onMounted(() => {})

let display = ref(false)

// const loadedThemes: { [key: string]: Node } = {}
//const loadedThemes: Record<string, Node> = {}

const filteredThemes = ref<IAutoCompleteItem[]>([])

const searchTheme = (event: AutoCompleteCompleteEvent) => {
  if (!event.query.trim().length) {
    filteredThemes.value = [...themeNames]
  } else {
    filteredThemes.value = themeNames.filter((theme) => {
      return theme.name.toLowerCase().includes(event.query.toLowerCase())
    })
  }
}

function loadTheme(newName: string, oldName = '') {
  // Make sure we actually got a theme name change
  if (newName) {
    if (newName !== oldName) {
      let newLink =
        location.hostname === 'localhost'
          ? '/src/assets/themes/'
          : '/assets/themes/'

      newLink += newName + '/theme.css'

      if (newName.includes('dark')) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }

      let oldNode = findDocumentHeadLink(themeLink.value)

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = newLink
      link.id = 'theme-' + newName
      link.onload = () => {
        if (oldNode) document.head.removeChild(oldNode)
      }

      const beforeNode = findDocumentHeadIndex(1, 'STYLE', '')
      if (beforeNode) {
        document.head.insertBefore(link, beforeNode)
      }

      theme.value.name = newName
      themeLink.value = newLink
    }

    document.head.childNodes.forEach((node) => {
      //nodes.push(node.)
    })

    const head = document.head
    const test = document.createElement('style')
    test.id = 'test'
    test.setAttribute('type', 'text/css')
    //test.innerHTML = 'body { background: red !important }'

    document.body.prepend(test)
    //test.appendChild(head)
    setTimeout(() => {
      //document.prepend(head)
    }, 1000)

    return
    const html = document.head.innerHTML
    document.head.innerHTML = ' '
    document
      .querySelectorAll('link[rel="stylesheet"], style')
      .forEach((elem) => elem.remove())

    // document.querySelector('link[rel=stylesheet][href$="something.css"]')?.remove()

    // document.styleSheets[0].cssRules[0]..item(0)?.deleteRule(0)

    setTimeout(() => {
      document.head.innerHTML = html
    }, 13000)
    // refreshCSS()
    // refreshStyles()
  }
}

function refreshStyles() {
  let styles = document.getElementsByTagName('style')
  const nodes: string[] = []
  for (let i = 0; i < styles.length; i++) {
    nodes.push(styles[i].innerHTML)
  }
}

function refreshCSS() {
  let links = document.getElementsByTagName('link')
  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel') == 'stylesheet') {
      let href = links[i].getAttribute('href')?.split('?')[0]

      let newHref = href + '?version=' + new Date().getMilliseconds()

      links[i].setAttribute('href', newHref)
    }
  }
}

function createElementFromHTML(htmlString: string) {
  var div = document.createElement('div')
  div.innerHTML = htmlString.trim()

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild
}

function findDocumentHeadIndex(
  index: number,
  nodeName: string,
  rel: string,
  nextSibbling = false
): ChildNode | undefined | null {
  let count = 0

  for (const node of document.head.childNodes) {
    if (nodeName === '' || node.nodeName === nodeName) {
      console.clear()
      const link = node as HTMLLinkElement
      if (rel === '' || link.rel === rel) {
        if (count >= index) {
          if (nextSibbling) {
            return node.nextSibling
          } else {
            return node
          }
        }
        count++
      }
    }
  }
}

function findDocumentHeadLink(
  url: string,
  nodeName = 'LINK',
  rel = 'stylesheet'
): HTMLLinkElement | undefined {
  for (const node of document.head.childNodes) {
    const link = node as HTMLLinkElement

    if (link.nodeName === nodeName && link.rel === rel) {
      console.clear()
      console.log(link.href)

      if (typeof url === 'string') {
        if (link.href.includes(url)) {
          return link
        }
      }
    }
  }
}

function setTheme(newTheme: IAutoCompleteItem) {
  theme.value = newTheme
}

const toggle = () => {
  display.value = !display.value
}

defineExpose({ toggle })
</script>

<template>
  <Button
    @click="toggle"
    type="button"
    icon="pi pi-cog"
    class="p-button"
    v-tooltip="'Change theme'"
    style="margin: 0 0 1x 5px"
  ></Button>
  <Dialog
    header="Theme Selection"
    v-model:visible="display"
    position="topright"
    class="p-dialog-movable"
  >
    <!-- <select
      autofocus
      id="items"
      class="p-dropdown"
      style="padding: 12px"
      v-model="theme"
    >
      <option v-for="theme in themeNames" :value="theme" :key="theme.name">
        <div class="pointer">
          {{ theme.name }}
        </div>
      </option>
    </select> -->

    <AutoComplete
      dropdown
      forceSelection
      autoHighlight
      completeOnFocus
      scrollHeight="65vh"
      v-model="theme"
      :suggestions="filteredThemes"
      @complete="searchTheme($event)"
      @select="setTheme(theme)"
      :field="(item) => item.name.replaceAll('-', ' ')"
      onfocus="this.select()"
      dropdownMode="blank"
    >
      <!-- optionGroupLabel="label" optionGroupChildren="items" -->
      <template #item="slotProps">
        <div>
          <img
            style="display: inline"
            width="20"
            alt=""
            :src="
              'https://www.primefaces.org/primevue/demo/images/themes/' +
              slotProps.item.name.replace('mdc', 'md') +
              (slotProps.item.name.match(/^(md|bo)/) ? '.svg' : '.png')
            "
          />
          <span class="ml-2">{{ slotProps.item.name }}</span>
        </div>
      </template>
    </AutoComplete>
  </Dialog>
</template>

<style scoped>
.itemLabel {
  margin-right: 20px;
}
.pointer {
  cursor: pointer;
}
</style>

<style></style>
