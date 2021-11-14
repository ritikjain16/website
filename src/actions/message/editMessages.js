import gql from 'graphql-tag'
import { message as notify } from 'antd'
import { sortBy, get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { messagesFactory as actions } from '../../reducers/messages'

const EDIT_MESSAGES_QUERY = gql`
  mutation updateMessages($input: [MessagesUpdate]!) {
    updateMessages(input: $input) {
      id
      order
    }
  }
`

const editMessagesLoading = () => ({
  type: actions.FETCH_LOADING,
})

const editMessagesSuccess = messages => ({
  type: actions.FETCH_SUCCESS,
  messages
})

const editMessagesFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const editMessages = input => async dispatch => {
  const hideLoading = notify.loading('Shuffling Messages', 0)
  try {
    dispatch(editMessagesLoading())
    const res = await requestToGraphql(EDIT_MESSAGES_QUERY, { input })
    const messages = get(res, 'data.updateMessages', [])
    hideLoading()
    if (messages && messages.length) {
      dispatch(editMessagesSuccess(sortBy(messages, 'order')))
      notify.success('Messages re-ordered')
      return messages
    }
    dispatch(editMessagesFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editMessagesFailure(error))
  }
  return {}
}

export default editMessages
