import { defineStore } from 'pinia'
const useUserStore = defineStore('user', {
  state: () => ({
    name: undefined
  })
})
export default useUserStore
