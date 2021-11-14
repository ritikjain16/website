import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/episode'

const addStoryVideoThumbnailLoading = () => ({
  type: actions.ADD_STORYTHUMBNAIL_LOADING
})

const addStoryVideoThumbnailSuccess = (id, storyThumbnail) => ({
  type: actions.ADD_STORYTHUMBNAIL_SUCCESS,
  id,
  storyThumbnail
})

const addStoryVideoThumbnailFailure = error => ({
  type: actions.ADD_STORYTHUMBNAIL_FAILURE,
  error
})

const addStoryVideoThumbnail = (file, topicId) => async dispatch => {
  try {
    dispatch(addStoryVideoThumbnailLoading())
    const fileInfo = {
      fileBucket: 'python'
    }
    const mappingInfo = {
      typeId: topicId,
      type: 'Topic',
      typeField: 'storyThumbnail'
    }
    const storyThumbnailFileInfo = await uploadFile(file, fileInfo, mappingInfo)
    if (storyThumbnailFileInfo.id) {
      const topic = {
        id: topicId,
        storyThumbnail: {
          ...storyThumbnailFileInfo
        }
      }
      dispatch(addStoryVideoThumbnailSuccess(
        topic.id,
        topic.storyThumbnail))
      return topic
    }
    dispatch(addStoryVideoThumbnailFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addStoryVideoThumbnailFailure(error))
  }
  return {}
}

export default addStoryVideoThumbnail
