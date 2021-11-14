import { get } from 'lodash'
import {
  UPDATE_USERNAME,
  UPDATE_PASSWORD,
  UPDATE_HAS_LOGIN,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../../actions/login/constants'
import { loadStateFromLocalStorage } from '../../utils/localStorage'

const getInitialState = () => {
  const savedState = loadStateFromLocalStorage()
  const savedUserId = get(savedState, 'login.id')
  const savedName = get(savedState, 'login.name')
  const savedToken = get(savedState, 'login.token')
  const savedHasLogin = get(savedState, 'login.hasLogin')
  const savedUsername = get(savedState, 'login.username')
  const savedRole = get(savedState, 'login.role')
  const initialState = {
    id: savedUserId || '',
    username: savedUsername || '',
    password: '',
    name: savedName || '',
    token: savedToken || '',
    isLoggingIn: false,
    hasLogin: savedHasLogin || false,
    error: null,
    role: savedRole || ''
  }
  return initialState
}

const login = (state = getInitialState(), action) => {
  switch (action.type) {
    case UPDATE_USERNAME:
      return { ...state, username: action.username }
    case UPDATE_PASSWORD:
      return { ...state, password: action.password }
    case UPDATE_HAS_LOGIN:
      return { ...state, hasLogin: action.hasLogin }
    case LOGIN_LOADING:
      return { ...state, isLoggingIn: true, error: null }
    case LOGIN_SUCCESS:
      return {
        ...state,
        id: action.id,
        token: action.token,
        name: action.name,
        isLoggingIn: false,
        error: null,
        hasLogin: true,
        password: '',
        role: action.role
      }
    case LOGIN_FAILURE:
      return { ...state, error: action.error, isLoggingIn: false }
    default:
      return state
  }
}

export default login
