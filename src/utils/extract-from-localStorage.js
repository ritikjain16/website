import { get } from 'lodash'
import { loadStateFromLocalStorage } from './localStorage'

const getDataFromLocalStorage = (path) => {
  const savedState = loadStateFromLocalStorage()
  return get(savedState, path)
}

export default getDataFromLocalStorage
