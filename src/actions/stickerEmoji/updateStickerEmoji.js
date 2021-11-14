import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import { stickerEmojiFactory as actions } from '../../reducers/StickerEmoji'

const EDIT_STICKER_EMOJI_QUERY = () => gql`
  mutation updateStickerEmoji(
    $id: ID!
    $input: StickerEmojiUpdate
  ) {
    updateStickerEmoji(
      id: $id
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

const editStickerEmojiLoading = () => ({
  type: actions.EDIT_LOADING
})

const editStickerEmojiSuccess = (id, stickerEmoji) => ({
  type: actions.EDIT_SUCCESS,
  id,
  stickerEmoji
})

const editStickerEmojiFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})

const editStickerEmoji = ({ id, code, file, hasCodeChanged }) => async dispatch => {
  if (!file && !hasCodeChanged) {
    notify.warning("Can't add sticker without image")
    return null
  }
  const hideLoading = notify.loading('Updating...', 0)
  try {
    dispatch(editStickerEmojiLoading())
    const { data } = await requestToGraphql(EDIT_STICKER_EMOJI_QUERY(), { input: { code }, id })

    const { updateStickerEmoji: stickerEmoji } = data
    if (stickerEmoji.id) {
      if (file) {
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
          dispatch(editStickerEmojiSuccess(id, stickerEmojiWithFileInfo))
          hideLoading()
          notify.success('Updated')
          return stickerEmojiWithFileInfo
        }
      }
      dispatch(editStickerEmojiSuccess(id, stickerEmoji))
      hideLoading()
      notify.success('Updated')
      return stickerEmoji
    }
    dispatch(editStickerEmojiFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editStickerEmojiFailure(error))
  }
  return {}
}

export default editStickerEmoji
