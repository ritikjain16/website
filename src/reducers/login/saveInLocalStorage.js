import { saveStateToLocalStorage } from '../../utils/localStorage'

let prevState = {}
/**
 * only saves in localstorage if something related to that
 * is updated, it increases performance as it will not save
 * on, like every input change or something
 *
 * @param {function} getState
 */
const saveInLocalStorageLogin = getState => {
  const currentState = getState().login
  const { token, hasLogin, name, username, id, role } = currentState
  const keysToWatch = ['token', 'hasLogin', 'name', 'username', 'id', 'role']
  const changedState = Object.keys(currentState)
    .find(key => keysToWatch.includes(key) && prevState[key] !== currentState[key])
  const isStateChanged = keysToWatch.includes(changedState)
  if (isStateChanged) {
    saveStateToLocalStorage({
      login: {
        token,
        hasLogin,
        name,
        username,
        id,
        role
      }
    })
  }
  prevState = currentState
}

export default saveInLocalStorageLogin
