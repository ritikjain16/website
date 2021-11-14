import { get } from 'lodash'
import {
  UPDATE_ID,
  UPDATE_CONFIRM_NEW_PASSWORD,
  UPDATE_OLD_PASSWORD,
  UPDATE_NEW_PASSWORD,
  UPDATE_TOKEN,
  UPDATE_HAS_PASSWORD_CHANGED,
  CHANGING_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE
} from '../../actions/changePassword/constants'

import { loadStateFromLocalStorage } from '../../utils/localStorage'

const getInitialState = () => {
  const savedState = loadStateFromLocalStorage()
  const savedId = get(savedState, 'login.id')
  const savedToken = get(savedState, 'login.token')
  const savedName = get(savedState, 'login.name')
  const initialState = {
    id: savedId || '',
    oldPassword: '',
    newPassword: '',
    name: savedName || '',
    confirmNewPassword: '',
    token: savedToken || '',
    isChangingPassword: false,
    hasChangedPassword: false,
    error: null
  }
  return initialState
}

const changePassword = (state = getInitialState(), action) => {
  switch (action.type) {
    case UPDATE_ID:
      return { ...state, id: action.id }
    case UPDATE_OLD_PASSWORD:
      return { ...state, oldPassword: action.oldPassword }
    case UPDATE_NEW_PASSWORD:
      return { ...state, newPassword: action.newPassword }
    case UPDATE_CONFIRM_NEW_PASSWORD:
      return { ...state, confirmNewPassword: action.confirmNewPassword }
    case CHANGING_PASSWORD:
      return { ...state, isChangingPassword: true, error: null }
    case UPDATE_TOKEN:
      return { ...state, token: action.token }
    case UPDATE_HAS_PASSWORD_CHANGED:
      return { ...state, hasChangedPassword: action.hasPasswordChanged }
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        name: action.name,
        isChangingPassword: false,
        error: null,
        hasChangedPassword: true,
        oldPassword: '',
        newPassword: ''
      }
    case CHANGE_PASSWORD_FAILURE:
      return { ...state, error: action.error, isChangingPassword: false }
    default:
      return state
  }
}

export default changePassword
