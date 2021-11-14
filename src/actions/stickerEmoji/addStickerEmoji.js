import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import { stickerEmojiFactory as actions } from '../../reducers/StickerEmoji'

const ADD_STICKER_EMOJI_QUERY = () => gql`
  mutation addStickerEmoji(
    $input: StickerEmojiInput!
  ) {
    addStickerEmoji(
      input: $input
    ) {
      id
      code
      type
      image {
        id
        uri
      }
    }
  }
`

const addStickerEmojiLoading = () => ({
  type: actions.ADD_LOADING
})

const addStickerEmojiSuccess = stickerEmoji => ({
  type: actions.ADD_SUCCESS,
  stickerEmoji
})

const addStickerEmojiFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})

const addStickerEmoji = ({ file, code, type }) => async dispatch => {
  if (!file) {
    notify.warning("Can't add sticker without image")
    return null
  }
  const hideLoading = notify.loading(`Adding ${type}...`, 0)
  try {
    dispatch(addStickerEmojiLoading())
    const { data } = await requestToGraphql(ADD_STICKER_EMOJI_QUERY(), {
      input: {
        code,
        type
      }
    })

    const { addStickerEmoji: stickerEmoji } = data
    if (stickerEmoji.id) {
      const mappingInfo = {
        typeId: stickerEmoji.id,
        type: 'StickerEmoji',
        typeField: 'image'
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
      if (uploadedFileInfo.id) {
        const stickerEmojiWithFileInfo = {
          ...stickerEmoji,
          image: { ...uploadedFileInfo }
        }
        dispatch(addStickerEmojiSuccess(stickerEmojiWithFileInfo))
        hideLoading()
        notify.success(`${type} added...`)
        return stickerEmojiWithFileInfo
      }
      dispatch(addStickerEmojiSuccess(stickerEmoji))
      hideLoading()
      notify.success(`${type} added...`)
      return stickerEmoji
    }
    dispatch(addStickerEmojiFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(addStickerEmojiFailure(error))
  }
  return {}
}

export default addStickerEmoji
