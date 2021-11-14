import gql from 'graphql-tag'
import { message } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { stickerEmojiFactory as actions } from '../../reducers/StickerEmoji'

const DELETE_STICKER_EMOJI_QUERY = id => gql`
  mutation {
    deleteStickerEmoji(id: "${id}") {
      id
    }
  }
`

const deleteStickerEmojiLoading = id => ({
  type: actions.DELETE_LOADING,
  id
})

const deleteStickerEmojiSuccess = id => ({
  type: actions.DELETE_SUCCESS,
  id
})

const deleteStickerEmojiFailure = error => ({
  type: actions.DELETE_FAILURE,
  error
})


const deleteStickerEmoji = id => async dispatch => {
  const hideLoading = message.loading('Deleting...')
  try {
    dispatch(deleteStickerEmojiLoading(id))
    const { data } = await requestToGraphql(DELETE_STICKER_EMOJI_QUERY(id))
    const { deleteStickerEmoji: topic } = data
    if (topic.id) {
      dispatch(deleteStickerEmojiSuccess(topic.id))
      hideLoading()
      message.success('Deleted')
      return topic
    }
    dispatch(deleteStickerEmojiFailure(errors.EmptyDataError))
    hideLoading()
    message.error('Soemthing went wrong')
  } catch (e) {
    const error = getActionsError(e)
    hideLoading()
    message.error('Soemthing went wrong')
    dispatch(deleteStickerEmojiFailure(error))
  }
  return {}
}

export default deleteStickerEmoji
