import State from 'duck-state'
import { Map } from 'immutable'
import schema from './schema'
import requestToGraphql from './requestToGraphql'

const duck = new State({
  schema,
  graphqlLib: async (query, { tokenType, ...variables }) => {
    if (tokenType) {
      const response = await requestToGraphql(query, variables, tokenType)
      return response
    }
    const response = await requestToGraphql(query, variables)
    return response
  },
  initialState: {
    user: []
  }
})

duck.registerGlobalMapStateToProps((stateToSubscribe, type, key) => () => {
  const mapStateToProps = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const token of stateToSubscribe) {
    mapStateToProps[token] = duck.getState(token, key).toJS()
  }
  if (type) {
    const queryName = type.split('/')[0]
    mapStateToProps[`${queryName}Status`] = duck.getStatus(queryName, key, Map({
      loading: false,
      success: false,
      failure: false
    })).toJS()
  }
  return mapStateToProps
})

export default duck
