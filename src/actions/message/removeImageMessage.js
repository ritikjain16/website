import gql from 'graphql-tag'
import { get } from 'lodash'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { messagesFactory as actions } from '../../reducers/messages'

const REMOVE_IMAGE_MESSAGE_QUERY = (messageId, imageId) => gql`
  mutation {
    removeFromMessageImage(
      messageId: "${messageId}",
      imageFileId:"${imageId}"
    ) {
      message {
        id
      }
    }
  }
`

const removeImageMessageLoading = id => ({
  type: actions.REMOVE_IMAGE_LOADING,
  id
})

const removeImageMessageSuccess = id => ({
  type: actions.REMOVE_IMAGE_SUCCESS,
  id
})

const removeImageMessageFailure = error => ({
  type: actions.REMOVE_IMAGE_FAILURE,
  error
})

const removeImageMessage = (messageId, imageId) => async dispatch => {
  try {
    dispatch(removeImageMessageLoading(messageId))
    const { data } = await requestToGraphql(
      REMOVE_IMAGE_MESSAGE_QUERY(messageId, imageId)
    )
    const id = get(data, 'removeFromMessageImage.message.id', null)
    if (id) {
      dispatch(removeImageMessageSuccess(id))
      return id
    }
    dispatch(removeImageMessageFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    notify.error(error)
    dispatch(removeImageMessageFailure(error))
  }
  return {}
}

export default removeImageMessage
