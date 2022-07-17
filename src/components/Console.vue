<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, type PropType } from 'vue'
import Vue from 'vue'
import { json, jsonHighlight } from '@/methods/console'
import { Vue3JsonEditor } from 'vue3-json-editor'
import type { IChannel } from '@/views/ConsoleView.vue'
//import { IChannel } from '@/views/ConsoleView'

// export interface IChannel1 {
//   name: string
//   command: string
//   logs: IConsoleLog[]
// }

export interface IConsoleLog {
  index: string
  count: number
  title: string
  data: string
  type: string
  evalCode: string
}

//const channels = ref(new Map<string, IChannel>())

const logPanelElem = ref()
const textInput = ref<HTMLInputElement>()

const commandHistory = ref<string[]>([])
const commandIndex = ref(0)
const command = ref('')

const props = defineProps({
  channel: {
    type: Object as PropType<IChannel>,
    required: false,
    default: {
      name: '',
      command: '',
      logs: []
    }
  },
  someFunction: {
    type: Function as PropType<(command: string) => void>,
    required: false,
    default: () => {}
  }
})

const emit = defineEmits<{
  (e: 'removeChannel', name: string): void
  (e: 'runCommannd', name: string): void
}>()

//let globalVar = inject<Function>('test2')

onMounted(() => {
  //logPanelElem.value.scroll({ top: 0, behavior: 'smooth' });

  //bc.addEventListener('message', messageReceived)

  textInput.value?.focus()

  //logPanelElem.value.scrollTop = logPanelElem.value.scrollHeight
  //alert(logPanelElem.value?.outerHTML)

  if (logPanelElem.value)
    logPanelElem.value.scrollTop = logPanelElem.value.scrollHeight
})

function enterCommand(focus: any) {
  //bc.postMessage(command.value)

  if (
    command.value !== '' &&
    commandHistory.value.slice(-1)[0] != command.value
  ) {
    commandHistory.value.push(command.value.trim())
    commandIndex.value++
  }

  command.value = ''
  if (focus) textInput.value?.focus()
}

function clear() {
  emit('removeChannel', props.channel.name)
}

function up() {
  if (commandIndex.value > 0)
    command.value = commandHistory.value[--commandIndex.value]
}

function down() {
  if (commandIndex.value < commandHistory.value.length)
    command.value = commandHistory.value[++commandIndex.value]
}

function onJsonChange(e: any) {
  console.log('value:', e.value)
}
</script>

<template>
  <div class="console-panel row">
    <input
      ref="textInput"
      type="text"
      class="cell"
      v-bind="channel.name"
      v-on:keydown.enter="enterCommand"
      v-on:keydown.up="up"
      v-on:keydown.down="down"
    />
    <button @click="enterCommand(true)" class="enterCommand cell">Send</button>
    <button @click="clear" class="clear cell">x</button>
  </div>
  <div ref="logPanelElem" class="log-panel">
    Logs: {{ channel.logs.length }}
    <div v-for="log in channel.logs" class="log-item">
      <!--
          <div class="log-data">
            <vue3-json-editor
              :value="log.data"
              :options="{
                mode: 'tree',
                modes: ['code', 'text', 'tree', 'view'],
                onChange: onJsonChange
              }"
            />
          </div> -->
    </div>
    <div v-for="(log, i) in channel.logs" :key="i">
      <div>
        <span class="log-title">
          {{ log.index }}: {{ log.title }} ({{ log.count }})
        </span>
        <pre
          key="log.index"
          v-html="log.data"
          contenteditable="true"
          class="console-log h-3"
          @input="onJsonChange"
        ></pre>
        <!-- <Vue3JsonEditor v-model="channel.logs[i].text" /> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
input,
textarea {
  background: #222;
  color: #ccc;
  width: 90%;
  height: 100%;
  font-size: 18px;
  border: none;
  padding: 10px;
  z-index: 1;
}
.console-view {
  width: 100%;
  /*min-height: calc(100vh - 80px);*/
  max-height: calc(100vh - 80px);
  /* background-color: gray; */
}
.log-panel {
  height: 400px;
  overflow-y: auto;
}
.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: black;
}
.cell {
  display: block;
  flex-direction: column;
  width: 100%;
}
.console-panel {
  background: #222;
  color: #888;
  border: 1px black;
  width: 100%;
  height: 30px;
  z-index: 10;
}
.clear {
  width: 20px;
}

.enterCommand,
.clear {
  background: #222;
  color: #ccc;
  width: 10%;
  height: 100%;
  font-size: 18px;
  /* height: 30px; */
  margin-top: -1px;
  position: absolute;
  font-size: 16px;
  border-color: #444;
}

pre {
  outline: 1px solid #ccc;
}
</style>

<style>
.json-string {
  color: green;
}
.json-number {
  color: darkorange;
}
.json-boolean {
  color: blue;
}
.json-null {
  color: magenta;
}
.json-key {
  color: cyan;
}
</style>
