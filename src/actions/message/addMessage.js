import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import { messagesFactory as actions } from '../../reducers/messages'

const ADD_MESSAGE_QUERY = ({
  learningObjectiveId
}) => gql`
  mutation addMessage(
    $input: MessageInput!
    $stickerConnectId: ID
    $emojiConnectIds: [ID]
    $questionConnectId: ID
  ) {
    addMessage(
      input: $input
      stickerConnectId: $stickerConnectId
      emojiConnectIds: $emojiConnectIds
      questionConnectId: $questionConnectId
      learningObjectiveConnectId: "${learningObjectiveId}"
    ) {
      id
      statement
      type
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
      order
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

const addMessageLoading = () => ({
  type: actions.ADD_LOADING
})

const addMessageSuccess = message => ({
  type: actions.ADD_SUCCESS,
  message
})

const addMessageFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})

const addMessage = ({
  file,
  learningObjectiveId,
  stickerConnectId,
  emojiConnectIds = [],
  questionConnectId,
  ...input
}) => async dispatch => {
  const hideLoading = notify.loading('Adding message...', 0)
  try {
    dispatch(addMessageLoading())
    const { data } = await requestToGraphql(
      ADD_MESSAGE_QUERY({
        learningObjectiveId
      }), {
        input,
        stickerConnectId,
        emojiConnectIds,
        questionConnectId
      })
    const { addMessage: message } = data
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
          dispatch(addMessageSuccess(messageWithFileInfo))
          notify.success('Message added...')
          return messageWithFileInfo
        }
      }
      dispatch(addMessageSuccess(message))
      notify.success('Message added...')
      return message
    }
    dispatch(addMessageFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(addMessageFailure(error))
  }
  return {}
}

export default addMessage
