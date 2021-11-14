import gql from 'graphql-tag'
import { message } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/learningObjective'
import uploadFile from '../utils/uploadFile'
import fileBucketObject from '../../constants/fileInput'

const defaultMetaCount = 0
const ADD_LO_QUERY = ({ topicConnectId }) => gql`
  mutation addLearningObjective(
    $input: LearningObjectiveInput!
  ) {
    addLearningObjective(
      input: $input
      topicConnectId:"${topicConnectId}"
    ){
      id
      order
      title
      createdAt
      updatedAt
      pqStory
      status
      messageStatus
      topic {
        id
      }
    }
  }
`

const addLearningObjectiveSuccess = learningObjective => ({
  type: actions.ADD_SUCCESS,
  learningObjective
})
const addLearningObjectiveFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})
const addLearningObjectiveLoading = () => ({
  type: actions.ADD_LOADING
})
const addLearningObjective = ({ file, pqStoryImage, topicConnectId, ...input }) =>
  async (dispatch) => {
    try {
      const hide = message.loading('Adding...')
      dispatch(addLearningObjectiveLoading())
      const { data } = await requestToGraphql(ADD_LO_QUERY({ topicConnectId }), { input })
      const { addLearningObjective: learningObjective } = data
      /** Instead of fetching the meta count which is zero for a
     *  new lo,so just initialising count to zero */
      const learningObjectiveWithMeta = {
        ...learningObjective,
        messagesMeta: {
          count: defaultMetaCount
        },
        practiceQuestionMeta: {
          count: defaultMetaCount
        },
        quizMeta: {
          count: defaultMetaCount
        }
      }
      /** After adding a learning objective we get id and to add a file we first check if file is
     * present then we add file which maps with lo Id */
      if (learningObjectiveWithMeta.id) {
        let learningObjectiveWithFileInfo
        let loImageUploadData = null
        let pqStoryImageUploadData = null
        let loImageUploadError = false
        let pqStoryImageUploadError = false
        // file here is lo thumbnail
        if (file) {
        /** The below mappingInfo,fileInfo is required to upload file */
          const mappingInfo = {
            typeId: learningObjectiveWithMeta.id,
            type: 'LearningObjective',
            typeField: 'thumbnail'
          }
          const fileInfo = {
            fileBucket: fileBucketObject.python
          }
          /** File is uploaded by calling uploadFile */
          const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
          /** After file is uploaded thumbnail info is combined with
         * lo body(learningObjectiveWithFileInfo) and success action is dispatched */
          if (uploadedFileInfo && uploadedFileInfo.id) {
            loImageUploadData = uploadedFileInfo
          } else {
            loImageUploadError = true
          }
        }

        if (pqStoryImage) {
          const mappingInfo = {
            typeId: learningObjectiveWithMeta.id,
            type: 'LearningObjective',
            typeField: 'pqStoryImage'
          }
          const fileInfo = {
            fileBucket: fileBucketObject.python
          }
          /** File is uploaded by calling uploadFile */
          const uploadedFileInfo = await uploadFile(pqStoryImage, fileInfo, mappingInfo)
          /** After file is uploaded thumbnail info is combined with
         * lo body(learningObjectiveWithFileInfo) and success action is dispatched */
          if (uploadedFileInfo && uploadedFileInfo.id) {
            pqStoryImageUploadData = uploadedFileInfo
          }
          pqStoryImageUploadError = true
        }
        /** code will come here if lo is added succesfully and there is no file to upload or
       * file uploading failed */
        if (loImageUploadError) {
          hide()
          dispatch(addLearningObjectiveFailure('lo thumbnail uploading failed'))
          message.error('File uploading failed')
          return {}
        }
        if (pqStoryImageUploadError) {
          hide()
          dispatch(addLearningObjectiveFailure('PQstory image uploading failed'))
          message.error('PQstory image uploading failed')
          return {}
        }
        if ((file && !loImageUploadError) || (pqStoryImage && !pqStoryImageUploadError)) {
          learningObjectiveWithFileInfo = {
            ...learningObjectiveWithMeta,
            thumbnail: loImageUploadData,
            pqStoryImage: pqStoryImageUploadData
          }
          hide()
          dispatch(addLearningObjectiveSuccess(learningObjectiveWithFileInfo))
          message.success(`Added ${learningObjectiveWithMeta.title}`)
          return learningObjectiveWithFileInfo
        }
        hide()
        dispatch(addLearningObjectiveSuccess(learningObjectiveWithMeta))
        message.success(`Added ${learningObjectiveWithMeta.title}`)
        return learningObjectiveWithMeta
      }
      /** if lo is failed then no file will be uploaded */
      message.error('Failed to add')
      dispatch(addLearningObjectiveFailure(errors.EmptyDataError))
      return {}
    } catch (e) {
      const error = getActionsError(e)
      dispatch(addLearningObjectiveFailure(error))
      message.error('Failed to add')
    }
    return {}
  }
export default addLearningObjective
