import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/cheatSheet'

const EDIT_CHEAT_SHEET_CONTENT = (id) => gql`
  mutation(
    $input: CheatSheetContentUpdate!
    $emojiConnectIds: [ID]
  ) {
    updateCheatSheetContent(
        id: "${id}"
        input: $input
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

const editCheatSheetContentLoading = () => ({
  type: actions.EDIT_LOADING
})

const editCheatSheetContentSuccess = message => ({
  type: actions.EDIT_SUCCESS,
  message
})

const editCheatSheetContentFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})

const editCheatSheetContent = ({
  file,
  id,
  cheatSheetConnectId,
  emojiConnectIds = [],
  ...input
}) => async dispatch => {
  const hideLoading = notify.loading('Editing CheatSheet Content...', 0)
  try {
    dispatch(editCheatSheetContentLoading())
    const { data } = await requestToGraphql(
      EDIT_CHEAT_SHEET_CONTENT(id), { input, emojiConnectIds })
    const { updateCheatSheetContent: cheatSheet } = data
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
          dispatch(editCheatSheetContentSuccess(cheatSheetWithFile))
          notify.success('Content Edited...')
          return cheatSheetWithFile
        }
      }
      dispatch(editCheatSheetContentSuccess(cheatSheet))
      notify.success('Content Edited...')
      return cheatSheet
    }
    dispatch(editCheatSheetContentFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editCheatSheetContentFailure(error))
  }
  return {}
}

export default editCheatSheetContent
