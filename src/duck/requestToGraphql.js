import GqlClient from '../utils/GqlClient'
import errors from '../constants/errors'
import getAuthToken from '../utils/getAuthToken'
import serverConfig from '../config/serverConfig'
import logout from '../actions/login/logout'
import store from '../reducers'

const DEBUG_API_ERROR = false

const handleGraphqlResponseErrors = errordata => {
  let errorMessage
  if (DEBUG_API_ERROR) {
    console.error('apiError', errordata) // eslint-disable-line no-console
  }
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
  batchURL: serverConfig.apiBaseURLForBatch,
  errorHandler: handleGraphqlResponseErrors
})

const requestToGraphql = async (query, { callBatchAPI = false, ...variables }, tokenType) =>
  client.query(query, variables, {
    headers: {
      authorization: getAuthToken(tokenType)
    },
    callBatchAPI,
  })

export default requestToGraphql
