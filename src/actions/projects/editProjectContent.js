import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/project'

const EDIT_PROJECT_CONTENT = (id) => gql`
  mutation($input: ProjectContentUpdate, $emojiConnectIds: [ID]) {
  updateProjectContent(
    input: $input
    emojiConnectIds: $emojiConnectIds
    id: "${id}"
  ) {
    id
    order
    statement
    type
    terminalInput
    terminalOutput
    emoji {
      id
      code
      image {
        id
        uri
      }
    }
    image {
      id
      uri
    }
  }
}
`

const editProjectContentLoading = () => ({
  type: actions.EDIT_LOADING
})

const editProjectContentSuccess = message => ({
  type: actions.EDIT_SUCCESS,
  message
})

const editProjectContentFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})

const editProjectContent = ({
  file,
  id,
  projectConnectId,
  ProjectConnectId,
  emojiConnectIds = [],
  ...input
}) => async dispatch => {
  const hideLoading = notify.loading('Editing Project Content...', 0)
  try {
    dispatch(editProjectContentLoading())
    const { data } = await requestToGraphql(
      EDIT_PROJECT_CONTENT(id), { input, emojiConnectIds })
    const { updateProjectContent: project } = data
    hideLoading()
    if (project.id) {
      if (file) {
        const mappingInfo = {
          typeId: project.id,
          type: 'ProjectContent',
          typeField: 'image'
        }
        const fileInfo = {
          fileBucket: 'python'
        }
        const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
        if (uploadedFileInfo.id) {
          const projectWithFile = {
            ...project,
            image: { ...uploadedFileInfo }
          }
          dispatch(editProjectContentSuccess(projectWithFile))
          notify.success('Content Edited...')
          return projectWithFile
        }
      }
      dispatch(editProjectContentSuccess(project))
      notify.success('Content Edited...')
      return project
    }
    dispatch(editProjectContentFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editProjectContentFailure(error))
  }
  return {}
}

export default editProjectContent
