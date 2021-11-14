import appConfig from '../config/appConfig'

const loadStateFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem('state')
    if (savedState === null) {
      return undefined
    }
    return JSON.parse(savedState)
  } catch (e) {
    return undefined
  }
}

const saveStateToLocalStorage = state => {
  try {
    localStorage.setItem('state', JSON.stringify(state))
  } catch (e) {
    /** @todo handle errors in future */
  }
}
const resetLocalStorage = () => {
  try {
    localStorage.removeItem('state')

    // Removing specific keys from localstorage.
    appConfig.keysToRemoveFromLocalStorageOnLogout.forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (e) {
    /** @todo handle errors in future */
  }
}

export {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  resetLocalStorage
}
