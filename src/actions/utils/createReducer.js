/* eslint array-callback-return: "off" */
import { isFunction } from 'lodash'

const createReducer = (nameSpace, presetsFactory, defaultInitialState) => {
  const presets = presetsFactory.map(preset => preset(nameSpace))
  let initialState = presets
    .map(preset => preset.getInitialState())
    .reduce((obj, item) => ({ ...obj, ...item }), {})
  initialState = { ...initialState, ...defaultInitialState }
  const actionNames = presets
    .map(preset => preset.getActionNames())
    .reduce((obj, item) => ({ ...obj, ...item }), {})
  const getInitialState = () => initialState

  const getReducer = callbackReducer => (state = initialState, action) => {
    let nextState = {
      ...state
    }
    if (callbackReducer && isFunction(callbackReducer)) {
      nextState = {
        ...nextState,
        ...callbackReducer(nextState, action)
      }
    }
    presets.forEach(preset => {
      nextState = {
        ...nextState,
        ...preset.reducer(nextState, action),
      }
    })
    return nextState
  }

  return {
    getInitialState,
    ...actionNames,
    getReducer
  }
}

export default createReducer
