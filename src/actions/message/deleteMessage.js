import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { messagesFactory as actions } from '../../reducers/messages'

const DELETE_MESSAGE_QUERY = id => gql`
  mutation {
    deleteMessage(id: "${id}") {
      id
      statement
    }
  }
`

const deleteMessageLoading = id => ({
  type: actions.DELETE_LOADING,
  id
})

const deleteMessageSuccess = id => ({
  type: actions.DELETE_SUCCESS,
  id
})

const deleteMessageFailure = error => ({
  type: actions.DELETE_FAILURE,
  error
})


const deleteMessage = id => async dispatch => {
  const hideLoading = notify.loading('Deleting message...', 0)
  try {
    dispatch(deleteMessageLoading(id))
    const { data } = await requestToGraphql(DELETE_MESSAGE_QUERY(id))
    const { deleteMessage: message } = data
    hideLoading()
    if (message.id) {
      dispatch(deleteMessageSuccess(message.id))
      notify.success('Message deleted')
      return message
    }
    dispatch(deleteMessageFailure(errors.EmptyDataError))
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(deleteMessageFailure(error))
  }
  return {}
}

export default deleteMessage
