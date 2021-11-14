import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/topics'

const REMOVE_FROM_CHAPTER_TOPIC_QUERY = (chapterId, topicId) => gql`
  mutation {
    removeFromChapterTopic(
     chapterId: "${chapterId}"
      topicId: "${topicId}"
    ) {
      topic {
        id
        title
      }
    }
  }
`

const EDIT_TOPIC_QUERY = (id, chapterId) => gql`
  mutation updateTopic($input: TopicUpdate!) {
    updateTopic(
      id: "${id}"
      input: $input
      ${chapterId ? `chapterConnectId: "${chapterId}"` : ''}
    ) {
      id
      order
      title
      description
      isTrial
      status
      createdAt
      isQuestionInMessageEnabled
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

const editTopicLoading = (id) => ({
  type: actions.EDIT_LOADING,
  id
})

const editTopicSuccess = (id, topic) => ({
  type: actions.EDIT_SUCCESS,
  id,
  topic
})

const editTopicFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})


const editTopic = ({
  id,
  status,
  newChapterId,
  prevChapterId,
  file,
  smallThumbnailFile,
  ...input
}) => async dispatch => {
  try {
    const shouldEditChapter = newChapterId && prevChapterId
    dispatch(editTopicLoading(id))
    if (shouldEditChapter) {
      await requestToGraphql(REMOVE_FROM_CHAPTER_TOPIC_QUERY(prevChapterId, id))
    }
    const { data } = await requestToGraphql(
      EDIT_TOPIC_QUERY(id, newChapterId),
      { input: { ...input, status } }
    )
    const { updateTopic: topic } = data
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
          dispatch(editTopicSuccess(id, topicWithFileInfo))
          return topicWithFileInfo
        }
      }
      dispatch(editTopicSuccess(id, topic))
      return topic
    }
    dispatch(editTopicFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editTopicFailure(error))
  }
  return {}
}

export default editTopic
