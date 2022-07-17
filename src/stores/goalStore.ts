import { defineStore } from 'pinia'

export const goal = defineStore({
  id: 'counter',
  state: () => ({
    json: ''
  }),
  getters: {
    goalData: (state) => localStorage['goal']
  },
  actions: {
    save() {
      localStorage['goal'] = this.json
    }
  }
})


const xxx = goal()

