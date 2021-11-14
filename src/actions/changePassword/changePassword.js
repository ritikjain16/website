import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'

export const CHANGING_PASSWORD = 'CHANGING_PASSWORD'
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS'
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE'

const UPDATE_QUERY = (id, oldPassword, newPassword) => gql`
  mutation {
    resetUserPassword(
      id:"${id}",
      oldPassword:"${oldPassword}",
      newPassword:"${newPassword}"
    ) {
      name
    }
  }
`

const changingPassword = () => ({
  type: CHANGING_PASSWORD
})

const changePasswordSuccess = ({ name }) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  name
})

const changePasswordFailure = error => ({
  type: CHANGE_PASSWORD_FAILURE,
  error
})

const changePassword = (id, oldPassword, newPassword) => async dispatch => {
  try {
    dispatch(changingPassword())
    const { data } = await requestToGraphql(UPDATE_QUERY(id, oldPassword, newPassword))
    const { resetUserPassword: changePasswordData } = data
    if (changePasswordData.name) {
      dispatch(changePasswordSuccess(changePasswordData))
    } else {
      dispatch(changePasswordFailure(errors.EmptyDataError))
    }
  } catch (e) {
    const error = get(e, 'errors[0].message')
    if (error) {
      dispatch(changePasswordFailure(error))
    } else {
      dispatch(changePasswordFailure(errors.UnexpectedError))
    }
  }
}

export default changePassword
