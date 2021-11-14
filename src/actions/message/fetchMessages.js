import gql from 'graphql-tag'
import { message as notify } from 'antd'
import { get, sortBy } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { messagesFactory as actions } from '../../reducers/messages'

const FETCH_MESSAGE_QUERY = learningObjectiveId => gql`
  {
    learningObjective(id: "${learningObjectiveId}") {
      messages {
        id
        statement
        type
        sticker {
          code
        }
        order
        alignment
        createdAt
        updatedAt
        terminalInput
        terminalOutput
        question {
          id
          statement
        }
        learningObjective {
          id
          title
        }
        image {
          id
          name
          uri
          signedUri  
        }
      }
    }
  }
`

const fetchMessagesLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchMessagesSuccess = messages => ({
  type: actions.FETCH_SUCCESS,
  messages
})

const fetchMessagesFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchMessages = learningObjectiveId => async dispatch => {
  try {
    dispatch(fetchMessagesLoading())
    const { data } = await requestToGraphql(FETCH_MESSAGE_QUERY(learningObjectiveId))
    const messages = get(data, 'learningObjective.messages')
    if (Array.isArray(messages)) {
      dispatch(fetchMessagesSuccess(sortBy(messages, 'order')))
      return messages
    }
    dispatch(fetchMessagesFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    notify.error(error)
    dispatch(fetchMessagesFailure(error))
  }
  return {}
}

export default fetchMessages
