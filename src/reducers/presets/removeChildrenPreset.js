import { capitalize } from 'lodash'
import { plural } from 'pluralize'
import { backendState } from './constants'

const removeChildrenPreset = presetName => name => {
  const REMOVE_CHILDREN_FROM = `REMOVE_${presetName.toUpperCase()}_FROM`
  const actionNames = {
    REMOVE_CHILDREN_LOADING: `${REMOVE_CHILDREN_FROM}_${name.toUpperCase()}_${backendState.LOADING}`,
    REMOVE_CHILDREN_FAILURE: `${REMOVE_CHILDREN_FROM}_${name.toUpperCase()}_${backendState.FAILURE}`,
    REMOVE_CHILDREN_SUCCESS: `${REMOVE_CHILDREN_FROM}_${name.toUpperCase()}_${backendState.SUCCESS}`
  }

  const initialState = {
    [plural(name)]: [],
    [`remove${capitalize(presetName)}${capitalize(name)}Error`]: null,
    [`remove${capitalize(presetName)}${capitalize(name)}Id`]: null,
  }

  const getActionNames = () => ({
    [`REMOVE_${presetName.toUpperCase()}_LOADING`]: actionNames.REMOVE_CHILDREN_LOADING,
    [`REMOVE_${presetName.toUpperCase()}_FAILURE`]: actionNames.REMOVE_CHILDREN_FAILURE,
    [`REMOVE_${presetName.toUpperCase()}_SUCCESS`]: actionNames.REMOVE_CHILDREN_SUCCESS
  })
  const getInitialState = () => initialState
  const reducer = (state, action) => {
    switch (action.type) {
      case actionNames.REMOVE_CHILDREN_LOADING:
        return {
          ...state,
          [`remove${capitalize(presetName)}${capitalize(name)}Id`]: action.id,
          [`remove${capitalize(presetName)}${capitalize(name)}Error`]: null
        }
      case actionNames.REMOVE_CHILDREN_FAILURE:
        return {
          ...state,
          [`remove${capitalize(presetName)}${capitalize(name)}Id`]: null,
          [`remove${capitalize(presetName)}${capitalize(name)}Error`]: action.error
        }
      case actionNames.REMOVE_CHILDREN_SUCCESS:
        return {
          ...state,
          [plural(name)]: state[plural(name)].map(item =>
            item.id === action.id
              ? { ...item, [presetName]: null }
              : item
          ),
          [`remove${capitalize(name)}${capitalize(name)}Error`]: null
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

export default removeChildrenPreset
