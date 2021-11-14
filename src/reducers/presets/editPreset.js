import { capitalize } from 'lodash'
import { plural } from 'pluralize'
import { backendState } from './constants'

const editPreset = name => {
  const EDIT = 'EDIT'
  const actionNames = {
    EDIT_LOADING: `${EDIT}_${name.toUpperCase()}_${backendState.LOADING}`,
    EDIT_FAILURE: `${EDIT}_${name.toUpperCase()}_${backendState.FAILURE}`,
    EDIT_SUCCESS: `${EDIT}_${name.toUpperCase()}_${backendState.SUCCESS}`,
    [`hasEdited${capitalize(name)}`]: false
  }

  const initialState = {
    [plural(name)]: [],
    [`isEditing${capitalize(name)}`]: false,
    [`editing${capitalize(name)}Error`]: null,
    [`editing${capitalize(name)}Id`]: null,
    [`edited${capitalize(name)}Id`]: null
  }

  const getActionNames = () => actionNames
  const getInitialState = () => initialState
  const reducer = (state, action) => {
    switch (action.type) {
      case actionNames.EDIT_LOADING:
        return {
          ...state,
          [`isEditing${capitalize(name)}`]: true,
          [`editing${capitalize(name)}Error`]: null,
          [`editing${capitalize(name)}Id`]: action.id,
          [`hasEdited${capitalize(name)}`]: false
        }
      case actionNames.EDIT_FAILURE:
        return {
          ...state,
          [`isEditing${capitalize(name)}`]: false,
          [`editing${capitalize(name)}Error`]: action.error,
          [`editing${capitalize(name)}Id`]: action.id,
          [`hasEdited${capitalize(name)}`]: false
        }
      case actionNames.EDIT_SUCCESS:
        return {
          ...state,
          [plural(name)]: state[plural(name)].map(item => item.id === action.id
            ? { ...item, ...action[name] }
            : item
          ),
          [`isEditing${capitalize(name)}`]: false,
          [`editing${capitalize(name)}Id`]: null,
          [`edited${capitalize(name)}Id`]: action.id,
          [`hasEdited${capitalize(name)}`]: true
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

export default editPreset
