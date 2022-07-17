<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const send = ref('')
const receive = ref('')
const element = ref()

const props = defineProps({
  channelName: { type: String, required: true }
})

const bc = new BroadcastChannel(props.channelName)

onMounted(async () => {
  bc.addEventListener('message', processMessage)
})

onUnmounted(() => {
  bc.removeEventListener('message', processMessage)
})

function processMessage (e: any) {
   eval(e.data)
}

function handleClick() {
  //bc.postMessage(send.value)
  send.value = ''
}
</script>

<template>
  <div class="console-panel">
    <input type="text" v-model="send" v-on:keyup.enter="handleClick" />
    <button @click="handleClick">Send</button>
  </div>
  <div>
    <div
      ref="element"
      v-html="receive"
      style="width: 100%; min-height: calc(100vh - 80px)"
    ></div>
  </div>
</template>

<style>
.console-panel {
  position: sticky;
  top: 0;
  background: #222;
  color: #888;
  border: 1px black;
  width: 100%;
  height: 30px;
  z-index: 10;
}

input,
textarea {
  background: #222;
  color: #ccc;
  width: 90%;
  height: 100%;
  font-size: 18px;
}

button {
  background: #222;
  color: #ccc;
  width: 10%;
  height: 100%;
  font-size: 18px;
}

pre {
  outline: 1px solid #ccc;
}
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
