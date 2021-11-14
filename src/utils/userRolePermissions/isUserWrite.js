import { get } from 'lodash'
import { loadStateFromLocalStorage } from '../localStorage'
import { WRITE_ABILITY_USER_TYPES } from '../../constants/roles'

const isUserWrite = () => {
  const savedState = loadStateFromLocalStorage()
  const role = get(savedState, 'login.role')

  if (WRITE_ABILITY_USER_TYPES.includes(role)) {
    return true
  }
  return false
}

export default isUserWrite
