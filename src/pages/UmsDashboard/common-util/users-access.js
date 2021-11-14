import { USERS_ACCESS } from '../../../constants/roles'

const hasUserAccess = (role) => {
  if (USERS_ACCESS.includes(role)) {
    return true
  }
  return false
}

export default hasUserAccess
