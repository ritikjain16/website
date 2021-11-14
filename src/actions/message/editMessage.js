import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import { messagesFactory as actions } from '../../reducers/messages'

const EDIT_MESSAGE_QUERY = (id) => gql`
  mutation updateMessage(
    $input: MessageUpdate
    $stickerConnectId: ID
    $emojiConnectIds: [ID]
    $questionConnectId: ID
  ) {
    updateMessage(
      id: "${id}"
      input: $input
      stickerConnectId: $stickerConnectId
      emojiConnectIds: $emojiConnectIds
      questionConnectId: $questionConnectId
    ) {
      id
      statement
      type
      order
      sticker {
        id
        code
      }
      emoji {
        id
        code
      }
      question {
        id
        statement
      }
      alignment
      createdAt
      updatedAt
      terminalInput
      terminalOutput
      learningObjective {
        id
        title
      }
    }
  }
`

const editMessageLoading = id => ({
  type: actions.EDIT_LOADING,
  id
})

const editMessageSuccess = (id, message) => ({
  type: actions.EDIT_SUCCESS,
  id,
  message
})

const editMessageFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})

const editMessage = ({
  file,
  id,
  stickerConnectId,
  emojiConnectIds = [],
  questionConnectId,
  ...input
}) => async dispatch => {
  const hideLoading = notify.loading('Editing message', 0)
  try {
    dispatch(editMessageLoading(id))
    const variables = { input, stickerConnectId, emojiConnectIds, questionConnectId }
    // console.log(EDIT_MESSAGE_QUERY(id), variables)
    const { data } = await requestToGraphql(
      EDIT_MESSAGE_QUERY(id), variables)
    const { updateMessage: message } = data
    hideLoading()
    if (message.id) {
      if (file) {
        const mappingInfo = {
          typeId: message.id,
          type: 'Message',
          typeField: 'image'
        }
        const fileInfo = {
          fileBucket: 'python'
        }
        const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
        if (uploadedFileInfo.id) {
          const messageWithFileInfo = {
            ...message,
            image: { ...uploadedFileInfo }
          }
          dispatch(editMessageSuccess(messageWithFileInfo))
          notify.success('Message edited')
          return messageWithFileInfo
        }
      }
      dispatch(editMessageSuccess(id, message))
      notify.success('Message edited')
      return message
    }
    dispatch(editMessageFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editMessageFailure(error))
  }
  return {}
}

export default editMessage
