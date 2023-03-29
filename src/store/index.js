import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useMapStore from './modules/map'

const pinia = createPinia()

export { useUserStore, useMapStore }
export default pinia
