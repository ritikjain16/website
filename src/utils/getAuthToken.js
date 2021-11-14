import { Base64 } from 'js-base64'
import appConfig from '../config/appConfig'
import store from '../reducers'

let isLoggedIn
let userToken
const getAuthToken = (tokenType) => {
  const { appToken } = appConfig
  if (tokenType === 'appTokenOnly') {
    return Base64.encode(appToken)
  }
  const token = isLoggedIn
    ? Base64.encode(`${appToken}::${userToken}`)
    : Base64.encode(appToken)
  return token
}

store.subscribe(() => {
  const { token, hasLogin } = store.getState().login
  isLoggedIn = hasLogin
  userToken = token
})

export default getAuthToken
