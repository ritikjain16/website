import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/topics'

const ADD_TOPIC_QUERY = (chapterId) => gql`
  mutation addTopic(
    $input: TopicInput!
  ) {
    addTopic(
      input: $input
      chapterConnectId: "${chapterId}"
    ) {
      id
      title
      description
      status
      order
      isTrial
      isQuestionInMessageEnabled
      createdAt
      updatedAt
      chapter {
        id
        order
        title
        courses {
          id
          title
        }
      }
    }
  }
`

const addTopicLoading = () => ({
  type: actions.ADD_LOADING
})

const addTopicSuccess = topic => ({
  type: actions.ADD_SUCCESS,
  topic
})

const addTopicFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})

const addTopic = ({
  file,
  smallThumbnailFile,
  thumbnailUrl,
  smallThumbnailUrl,
  chapterId,
  isThumbnail,
  isSmallThumbnail,
  ...input
}) => async dispatch => {
  try {
    dispatch(addTopicLoading())
    const { data } = await requestToGraphql(
      ADD_TOPIC_QUERY(chapterId),
      { input }
    )
    const { addTopic: topic } = data
    if (topic.id) {
      if (file || smallThumbnailFile) {
        const mappingInfo = file && {
          typeId: topic.id,
          type: 'Topic',
          typeField: 'thumbnail'
        }
        const smallThumbnailMappingInfo = smallThumbnailFile && {
          typeId: topic.id,
          type: 'Topic',
          typeField: 'thumbnailSmall'
        }
        const fileInfo = {
          fileBucket: 'python'
        }
        const uploadedFileInfo = file && await uploadFile(file, fileInfo, mappingInfo)
        const smallThumbnailFileUploadInfo = smallThumbnailFile && await uploadFile(
          smallThumbnailFile, fileInfo, smallThumbnailMappingInfo
        )
        if ((uploadedFileInfo && uploadedFileInfo.id) ||
            (smallThumbnailFileUploadInfo && smallThumbnailFileUploadInfo.id)) {
          const topicWithFileInfo = {
            ...topic
          }
          if (uploadedFileInfo && uploadedFileInfo.id) {
            topicWithFileInfo.thumbnail = { ...uploadedFileInfo }
          }
          if (smallThumbnailFileUploadInfo && smallThumbnailFileUploadInfo.id) {
            topicWithFileInfo.thumbnailSmall = { ...smallThumbnailFileUploadInfo }
          }
          dispatch(addTopicSuccess(topicWithFileInfo))
          return topicWithFileInfo
        }
      }
      dispatch(addTopicSuccess(topic))
      return topic
    }
    dispatch(addTopicFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addTopicFailure(error))
  }
  return {}
}

export default addTopic
