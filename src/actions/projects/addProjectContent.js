import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/project'

const ADD_PROJECT_CONTENT = ({
  ProjectConnectId,
}) => gql`
  mutation($input: ProjectContentInput!, $emojiConnectIds: [ID]) {
    addProjectContent(
        input: $input
        emojiConnectIds: $emojiConnectIds
        ProjectConnectId: "${ProjectConnectId}"
    ) {
        id
        order
        statement
        type
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
        terminalInput
        terminalOutput
    }
    }
`

const addProjectContentLoading = () => ({
  type: actions.ADD_LOADING
})

const addProjectContentSuccess = message => ({
  type: actions.ADD_SUCCESS,
  message
})

const addProjectContentFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})

const addProjectContent = ({
  file,
  ProjectConnectId,
  emojiConnectIds = [],
  ...input
}) => async dispatch => {
  const hideLoading = notify.loading('Adding Project Content...', 0)
  try {
    dispatch(addProjectContentLoading())
    const { data } = await requestToGraphql(
      ADD_PROJECT_CONTENT({ ProjectConnectId }), { input, emojiConnectIds })
    const { addProjectContent: project } = data
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
          dispatch(addProjectContentSuccess(projectWithFile))
          notify.success('Content added...')
          return projectWithFile
        }
      }
      dispatch(addProjectContentSuccess(project))
      notify.success('Content added...')
      return project
    }
    dispatch(addProjectContentFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    notify.error(error)
    dispatch(addProjectContentFailure(error))
  }
  return {}
}

export default addProjectContent
