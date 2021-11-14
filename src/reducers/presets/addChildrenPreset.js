import { capitalize } from 'lodash'
import { plural } from 'pluralize'
import { backendState } from './constants'

const addChildrenPreset = presetName => name => {
  const ADD_CHILDREN_FROM = `ADD_${presetName.toUpperCase()}_FROM`
  const actionNames = {
    ADD_CHILDREN_LOADING: `${ADD_CHILDREN_FROM}_${name.toUpperCase()}_${backendState.LOADING}`,
    ADD_CHILDREN_FAILURE: `${ADD_CHILDREN_FROM}_${name.toUpperCase()}_${backendState.FAILURE}`,
    ADD_CHILDREN_SUCCESS: `${ADD_CHILDREN_FROM}_${name.toUpperCase()}_${backendState.SUCCESS}`
  }

  const initialState = {
    [plural(name)]: [],
    [`add${capitalize(presetName)}${capitalize(name)}Error`]: null,
    [`add${capitalize(presetName)}${capitalize(name)}Id`]: null,
  }

  const getActionNames = () => ({
    [`ADD_${presetName.toUpperCase()}_LOADING`]: actionNames.ADD_CHILDREN_LOADING,
    [`ADD_${presetName.toUpperCase()}_FAILURE`]: actionNames.ADD_CHILDREN_FAILURE,
    [`ADD_${presetName.toUpperCase()}_SUCCESS`]: actionNames.ADD_CHILDREN_SUCCESS
  })
  const getInitialState = () => initialState
  const reducer = (state, action) => {
    switch (action.type) {
      case actionNames.ADD_CHILDREN_LOADING:
        return {
          ...state,
          [`add${capitalize(presetName)}${capitalize(name)}Id`]: action.id,
          [`add${capitalize(presetName)}${capitalize(name)}Error`]: null
        }
      case actionNames.ADD_CHILDREN_FAILURE:
        return {
          ...state,
          [`add${capitalize(presetName)}${capitalize(name)}Id`]: null,
          [`add${capitalize(presetName)}${capitalize(name)}Error`]: action.error
        }
      case actionNames.ADD_CHILDREN_SUCCESS:
        return {
          ...state,
          [plural(name)]: state[plural(name)].map(item =>
            item.id === action.id
              ? { ...item, [presetName]: action[presetName] }
              : item
          ),
          [`add${capitalize(name)}${capitalize(name)}Error`]: null
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

export default addChildrenPreset
