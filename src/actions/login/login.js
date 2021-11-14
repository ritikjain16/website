import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'

export const LOGIN_LOADING = 'LOGIN_LOADING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

const LOGIN_QUERY = (username, password) => gql`
  mutation {
    login(input: {
      username:"${username}",
      password:"${password}"
    }) {
      id,
      token,
      name,
      role
    }
  }
`

const loginLoading = () => ({
  type: LOGIN_LOADING
})

const loginSuccess = ({ name, token, id, role }) => ({
  type: LOGIN_SUCCESS,
  name,
  token,
  id,
  role
})

const loginFailure = error => ({
  type: LOGIN_FAILURE,
  error
})


const login = (username, password) => async dispatch => {
  try {
    dispatch(loginLoading())
    const { data } = await requestToGraphql(LOGIN_QUERY(username, password))
    const { login: loginData } = data
    if (loginData.token) {
      dispatch(loginSuccess(loginData))
    } else {
      dispatch(loginFailure(errors.EmptyDataError))
    }
  } catch (e) {
    const error = get(e, 'errors[0].message')
    if (error) {
      dispatch(loginFailure(error))
    } else {
      dispatch(loginFailure(errors.UnexpectedError))
    }
  }
}

export default login

