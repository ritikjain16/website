export const ADD_MESSAGE_UI = 'ADD_MESSAGE_UI'
export const DELETE_MESSAGE_UI = 'DELETE_MESSAGE_UI'
export const SELECT_LEARNING_OBJECTIVE_ID = 'SELECT_LEARNING_OBJECTIVE_ID'

export const addMessageUI = message => ({
  type: ADD_MESSAGE_UI,
  message
})

export const deleteMessageUI = id => ({
  type: DELETE_MESSAGE_UI,
  id
})

export const selectLearningObjectiveId = id => ({
  type: SELECT_LEARNING_OBJECTIVE_ID,
  id
})
