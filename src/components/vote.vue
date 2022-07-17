<script setup lang="ts">
import OverlayPanel from 'primevue/overlaypanel'
import {
  inject,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
  watch,
  watchPostEffect
} from 'vue'
import type { RatingChangeEvent } from 'primevue/rating'
import { computed } from '@vue/reactivity'
import { isOptionalCallExpression } from '@babel/types'
import { h } from 'vue';
import { useDialog } from 'primevue/usedialog';

const dialog = useDialog()

dialog.open(OverlayPanel, {
  props: { 
    style: 'width: 30vw',
  }, 
  onClose: () => { }
})

const {
  userVote = 4,
  stars = 4,
  title = ''
} = defineProps<{
  userVote: number
  glovalVote: number
  stars?: number
  title: string
}>()

const emit = defineEmits<{
  (e: 'change', value: number, title: string): void
}>()

const op = ref<OverlayPanel>()

let userProgress = computed(() => {
  return Math.abs((userVote * 100) / (stars - 1))
})

function toggle(event: Event) {
  if (op.value) op.value.toggle(event)
}

function changeUserVote(event: any) {
  event = event as RatingChangeEvent
  const className = event.originalEvent.target.parentNode.className
  emit('change', event.value, title)
  op.value?.hide()
}
// add two vertical divs as display grid
</script>

<template>
  <DynamicDialog />
  <div style="width: 100%" @click="toggle" class="centre">
    <progress-bar
      class="user-vote"
      :class="{ active: userProgress !== 0, negative: userProgress < 2 }"
      :value="userProgress"
      :show-value="false"
      :max="5"
    />
    <ProgressBar :value="glovalVote" class="global-vote" :showValue="true" />
    <OverlayPanel ref="op" aria:haspopup="true">
      <rating
        v-model.number="userVote"
        :max="100"
        @change="changeUserVote"
        class="rating flipped"
      />
      <rating
        v-model="userVote"
        :max="100"
        @change="changeUserVote"
        class="rating"
      />
    </OverlayPanel>
    <Knob
      class="knob"
      v-model.number="userVote"
      :step="1"
      :size="35"
      :min="-stars"
      :max="stars"
    />
    <Knob
      class="knob"
      v-model="glovalVote"
      :step="1"
      :size="25"
      :min="-stars"
      :max="stars"
    />
  </div>
</template>

<style scoped>
/*.p-overlaypanel {
  margin-left: -50px;
}
.p-overlaypanel::before,
.p-overlaypanel::after  {
  margin-left: 30%;
}*/
.rating {
  display: inline-block;
  margin-right: -18px;
}
</style>
<style lang="scss">
.knob {
  position: absolute;
}
.user-vote,
.global-vote {
  position: absolute !important;
  height: 50% !important;
}

.pi.pi-star {
  opacity: 0.9;
}

.user-vote.p-progressbar .p-progressbar-value {
  background: green;
  border-radius: 0;
  top: 0;
}
.global-vote.p-progressbar .p-progressbar-value {
  background: gray;
  bottom: 0;
}

.user-vote.p-progressbar.negative .p-progressbar-value {
  background: red;
}
.global-vote.p-progressbar.negative .p-progressbar-value {
  background: gray;
}
.flipped {
  transform: scale(-1);
}
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
