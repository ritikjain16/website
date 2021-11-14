import GqlClient from './GqlClient'
import serverConfig from '../config/serverConfig'
import errors from '../constants/errors'
import getAuthToken from './getAuthToken'
import logout from '../actions/login/logout'
import store from '../reducers'

const handleGraphqlResponseErrors = errordata => {
  let errorMessage
  if (errordata.errors && errordata.errors.length && errordata.errors[0].name) {
    errorMessage = errordata.errors[0].name
  }
  if (errordata.message) {
    errorMessage = errordata.message
  }
  if (errorMessage === errors.UnauthenticatedUserError) {
    store.dispatch(logout())
  }
  return errorMessage || errors.UnexpectedError
}

const client = new GqlClient({
  url: serverConfig.apiBaseURL,
  errorHandler: handleGraphqlResponseErrors
})

const requestToGraphql = async (query, variables) =>
  client.query(query, variables, {
    headers: {
      authorization: getAuthToken()
    }
  })

export default requestToGraphql
