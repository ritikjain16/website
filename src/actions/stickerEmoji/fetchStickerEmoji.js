import gql from 'graphql-tag'
import { message } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { stickerEmojiFactory as actions } from '../../reducers/StickerEmoji'

const FETCH_STICKERS_EMOJI_QUERY = gql`
  {
    stickerEmojis {
      id
      code
      type
      image {
        id
        uri
        signedUri
      }
    }
  }
`

const fetchStickerEmojisLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchStickerEmojisSuccess = stickerEmojis => ({
  type: actions.FETCH_SUCCESS,
  stickerEmojis
})

const fetchStickerEmojisFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchStickerEmojis = () => async dispatch => {
  const hideLoading = message.loading('Fetching Stickers...')
  try {
    dispatch(fetchStickerEmojisLoading())
    const { data } = await requestToGraphql(FETCH_STICKERS_EMOJI_QUERY)
    const { stickerEmojis } = data

    if (Array.isArray(stickerEmojis)) {
      dispatch(fetchStickerEmojisSuccess(stickerEmojis))
      hideLoading()
      return stickerEmojis
    }

    dispatch(fetchStickerEmojisFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    hideLoading()
    dispatch(fetchStickerEmojisFailure(error))
    message.error('Failed to fetch')
  }
  return {}
}

export default fetchStickerEmojis
