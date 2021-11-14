import { capitalize } from 'lodash'
import { plural } from 'pluralize'
import { backendState } from './constants'

const addPreset = name => {
  const ADD = 'ADD'
  const actionNames = {
    ADD_LOADING: `${ADD}_${name.toUpperCase()}_${backendState.LOADING}`,
    ADD_FAILURE: `${ADD}_${name.toUpperCase()}_${backendState.FAILURE}`,
    ADD_SUCCESS: `${ADD}_${name.toUpperCase()}_${backendState.SUCCESS}`
  }

  const initialState = {
    [plural(name)]: [],
    [`isAdding${capitalize(name)}`]: false,
    [`adding${capitalize(name)}Error`]: null,
    [`hasAdded${capitalize(name)}`]: false
  }

  const getActionNames = () => actionNames
  const getInitialState = () => initialState
  const reducer = (state, action) => {
    switch (action.type) {
      case actionNames.ADD_LOADING:
        return {
          ...state,
          [`isAdding${capitalize(name)}`]: true,
          [`adding${capitalize(name)}Error`]: null,
          [`hasAdded${capitalize(name)}`]: false
        }
      case actionNames.ADD_FAILURE:
        return {
          ...state,
          [`isAdding${capitalize(name)}`]: false,
          [`adding${capitalize(name)}Error`]: action.error
        }
      case actionNames.ADD_SUCCESS:
        return {
          ...state,
          [plural(name)]: [...state[plural(name)], action[name]],
          [`isAdding${capitalize(name)}`]: false,
          [`hasAdded${capitalize(name)}`]: true
        }
      default:
        return state
    }
  }
  return {
    getInitialState,
    getActionNames,
    reducer
  }
}

export default addPreset
