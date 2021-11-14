import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import saveInLocalStorageLogin from './login/saveInLocalStorage'
import login from './login'
import { LOGOUT } from '../actions/login/logout'
import { resetLocalStorage } from '../utils/localStorage'
import { loReducer } from './learningObjective'
import nps from './netPromoterScore'
import chapters from './chapters'
import topics from './topics'
import { episodeReducer } from './episode'
import topicAssets from './topicAssets'
import dashboard from './dashboard'
import questionBank from './questionBank'
import messages from './messages'
import messageUI from './messageUI'
import course from './Courses'
import badge from './badges'
import stickerEmoji from './StickerEmoji'
import changePassword from './changePassword'
import duck from '../duck'

const appReducer = combineReducers({
  login,
  chapters: chapters.getReducer(),
  nps: nps.getReducer(),
  topics: topics.getReducer(),
  learningObjectives: loReducer,
  episode: episodeReducer,
  topicAssets,
  dashboard,
  messages,
  messageUI,
  questionBank,
  course,
  badge,
  stickerEmoji,
  changePassword,
  data: duck.reducer
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    resetLocalStorage()
    state = undefined // eslint-disable-line no-param-reassign
  }
  return appReducer(state, action)
}

const middlewares = [thunk]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancers = composeEnhancers(
  applyMiddleware(...middlewares)
)

const store = createStore(
  rootReducer,
  enhancers
)

duck.registerStore(store)

store.subscribe(() => {
  saveInLocalStorageLogin(store.getState)
})

export default store
