import { capitalize } from 'lodash'
import { plural } from 'pluralize'
import { backendState } from './constants'

const deletePreset = name => {
  const DELETE = 'DELETE'
  const actionNames = {
    DELETE_LOADING: `${DELETE}_${name.toUpperCase()}_${backendState.LOADING}`,
    DELETE_FAILURE: `${DELETE}_${name.toUpperCase()}_${backendState.FAILURE}`,
    DELETE_SUCCESS: `${DELETE}_${name.toUpperCase()}_${backendState.SUCCESS}`
  }

  const initialState = {
    [plural(name)]: [],
    [`deleting${capitalize(name)}Id`]: null,
    [`deleted${capitalize(name)}Id`]: null,
    [`deleting${capitalize(name)}Error`]: null,
    [`hasDeleted${capitalize(name)}`]: false,
  }

  const getActionNames = () => actionNames
  const getInitialState = () => initialState
  const reducer = (state, action) => {
    switch (action.type) {
      case actionNames.DELETE_LOADING:
        return {
          ...state,
          [`deleting${capitalize(name)}Id`]: action.id,
          [`deleted${capitalize(name)}Id`]: null,
          [`deleting${capitalize(name)}Error`]: null,
          [`hasDeleted${capitalize(name)}`]: false,
          [`isDeleting${capitalize(name)}`]: true
        }
      case actionNames.DELETE_FAILURE:
        return {
          ...state,
          [`deleting${capitalize(name)}Id`]: null,
          [`deleted${capitalize(name)}Id`]: null,
          [`deleting${capitalize(name)}Error`]: action.error,
          [`hasDeleted${capitalize(name)}`]: false,
          [`isDeleting${capitalize(name)}`]: false
        }
      case actionNames.DELETE_SUCCESS:
        return {
          ...state,
          [plural(name)]:
            state[plural(name)].filter(item => item.id !== action.id),
          [`deleting${capitalize(name)}Id`]: null,
          [`deleted${capitalize(name)}Id`]: action.id,
          [`hasDeleted${capitalize(name)}`]: true,
          [`isDeleting${capitalize(name)}`]: false
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

export default deletePreset
