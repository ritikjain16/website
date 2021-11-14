import { capitalize, cloneDeep } from 'lodash'
import pluralize from 'pluralize'
import { backendState } from './constants'

const fetchSuccess = (stateCollection, actionCollection) => {
  const newCollection = []
  const newActionCollection = cloneDeep(actionCollection)
  stateCollection.forEach(stateItem => {
    const mutualInCollectionAction =
      newActionCollection.find(actionItem => actionItem.id === stateItem.id)
    const mutualInCollectionActionIndex =
      newActionCollection.findIndex(actionItem => actionItem.id === stateItem.id)
    if (mutualInCollectionAction) {
      newCollection.push({ ...stateItem, ...mutualInCollectionAction })
      newActionCollection.splice(mutualInCollectionActionIndex, 1)
    } else {
      newCollection.push(stateItem)
    }
  })
  return [...newCollection, ...newActionCollection]
}

const fetchPreset = name => {
  const FETCH = 'FETCH'
  const actionNames = {
    FETCH_LOADING: `${FETCH}_${pluralize.plural(name.toUpperCase())}_${backendState.LOADING}`,
    FETCH_FAILURE: `${FETCH}_${pluralize.plural(name.toUpperCase())}_${backendState.FAILURE}`,
    FETCH_SUCCESS: `${FETCH}_${pluralize.plural(name.toUpperCase())}_${backendState.SUCCESS}`
  }

  const initialState = {
    [pluralize.plural(name)]: [],
    [`isFetching${capitalize(name)}`]: false,
    [`fetching${capitalize(pluralize.plural(name))}Error`]: null,
    [`has${capitalize(pluralize.plural(name))}Fetched`]: false
  }

  const getActionNames = () => actionNames
  const getInitialState = () => initialState
  const reducer = (state, action) => {
    switch (action.type) {
      case actionNames.FETCH_LOADING:
        return {
          ...state,
          [`isFetching${capitalize(name)}`]: true,
          [`fetching${capitalize(pluralize.plural(name))}Error`]: null,
          [`has${capitalize(pluralize.plural(name))}Fetched`]: false
        }
      case actionNames.FETCH_FAILURE:
        return {
          ...state,
          [`fetching${capitalize(pluralize.plural(name))}Error`]: action.error,
          [`isFetching${capitalize(name)}`]: false,
          [`has${capitalize(pluralize.plural(name))}Fetched`]: false
        }
      case actionNames.FETCH_SUCCESS:
        return {
          ...state,
          [pluralize.plural(name)]: fetchSuccess(
            state[pluralize.plural(name)], action[pluralize.plural(name)]
          ),
          [`isFetching${capitalize(name)}`]: false,
          [`has${capitalize(pluralize.plural(name))}Fetched`]: true
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

export default fetchPreset
