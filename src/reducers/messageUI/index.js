import { cloneDeep } from 'lodash'
import {
  ADD_MESSAGE_UI,
  DELETE_MESSAGE_UI,
  SELECT_LEARNING_OBJECTIVE_ID
} from '../../actions/message/messageUI'

const initialState = {
  messagesUI: [],
  selectedLearningObjectiveId: null
}

const addMessage = (messages, message) => {
  let isMessageInMessages = false
  const newMessages = messages.map(msgItem => {
    if (msgItem.id === message.id) {
      isMessageInMessages = true
      return { ...msgItem, ...message }
    }
    return msgItem
  })
  if (!isMessageInMessages) {
    return [...newMessages, message]
  }
  return newMessages
}

const addMessages = (messages, message) => {
  if (!Array.isArray(message)) {
    return addMessage(messages, message)
  }
  let newMessages = cloneDeep(messages)
  message.forEach(msg => {
    newMessages = addMessage(newMessages, msg)
  })
  return newMessages
}
const messageUI = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE_UI:
      return { ...state, messagesUI: addMessages(state.messagesUI, action.message) }
    case DELETE_MESSAGE_UI:
      return { ...state, messagesUI: state.messagesUI.filter(message => message.id !== action.id) }
    case SELECT_LEARNING_OBJECTIVE_ID:
      return { ...state, selectedLearningObjectiveId: action.id }
    default:
      return state
  }
}

export default messageUI
