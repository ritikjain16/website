import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/cheatSheet'

const ADD_CHEAT_SHEET_CONTENT = ({
  cheatSheetConnectId,
}) => gql`
  mutation(
    $input: CheatSheetContentInput!
    $emojiConnectIds: [ID]
  ) {
    addCheatSheetContent(
        input: $input
        cheatSheetConnectId: "${cheatSheetConnectId}"
        emojiConnectIds: $emojiConnectIds
    ) {
      id
      statement
      type
      order
      syntax
      emoji {
        id
        code
      }
      image{
        id
        uri
      }
      terminalInput
      terminalOutput
    }
  }
`

const addCheatSheetContentLoading = () => ({
  type: actions.ADD_LOADING
})

const addCheatSheetContentSuccess = message => ({
  type: actions.ADD_SUCCESS,
  message
})

const addCheatSheetContentFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})

const addCheatSheetContent = ({
  file,
  cheatSheetConnectId,
  emojiConnectIds = [],
  ...input
}) => async dispatch => {
  const hideLoading = notify.loading('Adding CheatSheet Content...', 0)
  try {
    dispatch(addCheatSheetContentLoading())
    const { data } = await requestToGraphql(
      ADD_CHEAT_SHEET_CONTENT({ cheatSheetConnectId }), { input, emojiConnectIds })
    const { addCheatSheetContent: cheatSheet } = data
    hideLoading()
    if (cheatSheet.id) {
      if (file) {
        const mappingInfo = {
          typeId: cheatSheet.id,
          type: 'CheatSheetContent',
          typeField: 'image'
        }
        const fileInfo = {
          fileBucket: 'python'
        }
        const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
        if (uploadedFileInfo.id) {
          const cheatSheetWithFile = {
            ...cheatSheet,
            image: { ...uploadedFileInfo }
          }
          dispatch(addCheatSheetContentSuccess(cheatSheetWithFile))
          notify.success('Message added...')
          return cheatSheetWithFile
        }
      }
      dispatch(addCheatSheetContentSuccess(cheatSheet))
      notify.success('Message added...')
      return cheatSheet
    }
    dispatch(addCheatSheetContentFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(addCheatSheetContentFailure(error))
  }
  return {}
}

export default addCheatSheetContent
