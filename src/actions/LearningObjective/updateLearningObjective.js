import gql from 'graphql-tag'
import { message } from 'antd'
import getActionsError from '../../utils/getActionsError'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import actions from '../../reducers/learningObjective'
import uploadFile from '../utils/uploadFile'
import fileBucketObject from '../../constants/fileInput'

const UPDATE_LO_QUERY = id => gql`
  mutation updateLearningObjective($input: LearningObjectiveUpdate!) {
    updateLearningObjective(
      id:"${id}"
      input: $input
  ){
      id
      title
      order
      createdAt
      updatedAt
      status
      pqStory
      messageStatus,
      topic {
        id
      }
    }
  }
`

const editLearningObjectiveLoading = () => ({
  type: actions.EDIT_LOADING
})
const editLearningObjectiveSuccess = (id, learningObjective) => ({
  type: actions.EDIT_SUCCESS,
  id,
  learningObjective
})
const editLearningObjectiveFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})
const editLearningObjective = ({ id, file, pqStoryImage, ...input }) => async (dispatch) => {
  try {
    const hideLoading = message.loading('Updating...')
    dispatch(editLearningObjectiveLoading())
    const { data } = await requestToGraphql(UPDATE_LO_QUERY(id), { input })
    const { updateLearningObjective: learningObjective } = data
    /** After lo is updated its thumbnail is updated if it has one */
    if (learningObjective.id) {
      let learningObjectiveWithFileInfo
      let loImageUploadData = null
      let pqStoryImageUploadData = null
      let loImageUploadError = false
      let pqStoryImageUploadError = false
      if (file) {
        const mappingInfo = {
          typeId: learningObjective.id,
          type: 'LearningObjective',
          typeField: 'thumbnail'
        }
        const fileInfo = {
          fileBucket: fileBucketObject.python
        }
        /** File is uploaded here by uploadFile function */
        const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
        /** uploadedFileInfo is of form
         * {
         * id,
         * name,
         * uri
         * }
         * */
        if (uploadedFileInfo.id) {
          /** Uploaded file info is included with lo body */
          loImageUploadData = {
            thumbnail: uploadedFileInfo }
          /** calling hideLoading() turns off loading message */
        } else {
          loImageUploadError = true
        }
      }
      if (pqStoryImage) {
        const mappingInfo = {
          typeId: learningObjective.id,
          type: 'LearningObjective',
          typeField: 'pqStoryImage'
        }
        const fileInfo = {
          fileBucket: fileBucketObject.python
        }
        /** File is uploaded here by uploadFile function */
        const uploadedFileInfo = await uploadFile(pqStoryImage, fileInfo, mappingInfo)
        /** uploadedFileInfo is of form
         * {
         * id,
         * name,
         * uri
         * }
         * */
        if (uploadedFileInfo.id) {
          /** Uploaded file info is included with lo body */
          pqStoryImageUploadData = {
            pqStoryImage: uploadedFileInfo }
          /** calling hideLoading() turns off loading message */
        } else {
          pqStoryImageUploadError = true
        }
      }
      if (loImageUploadError) {
        hideLoading()
        dispatch(editLearningObjectiveFailure('lo thumbnail uploading failed'))
        message.error('File uploading failed')
        return {}
      }
      if (pqStoryImageUploadError) {
        hideLoading()
        dispatch(editLearningObjectiveFailure('PQstory image uploading failed'))
        message.error('PQstory image uploading failed')
        return {}
      }
      if ((file && !loImageUploadError) || (pqStoryImage && !pqStoryImageUploadError)) {
        learningObjectiveWithFileInfo = {
          ...learningObjective,
          ...loImageUploadData,
          ...pqStoryImageUploadData
        }
        hideLoading()
        dispatch(editLearningObjectiveSuccess(id, learningObjectiveWithFileInfo))
        message.success(`Updated ${learningObjectiveWithFileInfo.title}`)
        return learningObjectiveWithFileInfo
      }
      hideLoading()
      dispatch(editLearningObjectiveSuccess(id, learningObjective))
      message.success(`Updated ${learningObjective.title}`)
      return learningObjective
    }
    dispatch(errors.EmptyDataError)
    message.error('Updation failure')
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editLearningObjectiveFailure(error))
    message.error('Updation failure')
  }
  return {}
}
export default editLearningObjective
