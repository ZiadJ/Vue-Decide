<script setup lang="ts">
import Console from '@/components/Console.vue'
import { onMounted, onUnmounted, ref } from 'vue'

export interface IChannel {
  name: string
  command: string
  logs: IConsoleLog[]
}

export interface IConsoleLog {
  index: number
  count: number
  title: string
  data: string
  type: string
  evalCode: string
}

//let isFormatted = ref(true)

const channels = ref(new Map<string, IChannel>())

const bc = new BroadcastChannel('vue-console')

onMounted(() => {
  bc.addEventListener('message', messageReceived)
})

onUnmounted(() => {
  bc.removeEventListener('message', messageReceived)
})

// interface messageFormat {
//   data: any
//   title: string
//   type: string
// }

function messageReceived(e: MessageEvent) {
  const data = e.data
  if (
    typeof data == 'object' &&
    Object.keys(data).length == 4 &&
    'channel' in data &&
    'title' in data &&
    'data' in data &&
    'type' in data
  ) {
    //if (logPanelElem.value) {
    //const isFullyScrolled =
    //  logPanelElem.value.scrollHeight - logPanelElem.value.scrollTop ===
    // logPanelElem.value.clientHeight

    // add channel item to channels list if not there yet
    if (!channels.value.has(data.channel)) {
      channels.value.set(data.channel, {
        name: data.channel,
        command: data.evalCode,
        logs: []
      })
    }

    const ch = channels.value.get(data.channel)
    if (ch) {
      // increment count of channel item data is the same as the last one
      const indexLast = ch.logs.length - 1
      if (indexLast >= 0 && ch.logs[indexLast].data == data.data) {
        ch.logs[indexLast].count++
      } else {
        ch.logs.push({
          index: ch.logs.length,
          title: data.title,
          data: data.data,
          type: data.type,
          count: 1,
          evalCode: data.evalCode
        })
      }
    }
    //  (!e.data.title ? '' : e.data.title + ': ') + jsonHighlight(e.data.data)

    //if (isFullyScrolled)
    //logPanelElem.value.scrollTop = 0 // parentElem.value.scrollHeight // - elParent.clientHeight
    //}
  }
}

function clear(channelName: string) {
  const channel = channels.value.get(channelName)
  if (channel) channel.logs = []
}
function removeChannel(channelName: string) {
  channels.value.delete(channelName)
}
function runCommand(channelName: string) {
  const channel = channels.value.get(channelName)
  if (channel) {
    bc.postMessage(channel.command)
  }
}
</script>

<template>
  <div class="console-view row">
    <div v-for="[name, channel] in channels" class="cell">
      <Console
        :channel="channel"
        @removeChannel="clear"
        @runCommannd="runCommand"
      ></Console>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
}

.console-view {
  width: 100%;
  /*min-height: calc(100vh - 80px);*/
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  /* background-color: gray; */
}
</style>
