import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/episode'

const addVideoThumbnailEpisodeLoading = () => ({
  type: actions.ADD_VIDEOTHUMBNAIL_LOADING
})

const addVideoThumbnailEpisodeSuccess = (id, videoThumbnail) => ({
  type: actions.ADD_VIDEOTHUMBNAIL_SUCCESS,
  id,
  videoThumbnail
})

const addVideoThumbnailEpisodeFailure = error => ({
  type: actions.ADD_VIDEOTHUMBNAIL_FAILURE,
  error
})

const addVideoThumbnailTopic = (file, topicId) => async dispatch => {
  try {
    dispatch(addVideoThumbnailEpisodeLoading())
    const fileInfo = {
      fileBucket: 'python'
    }
    const mappingInfo = {
      typeId: topicId,
      type: 'Topic',
      typeField: 'videoThumbnail'
    }
    const videoThumbnailFileInfo = await uploadFile(file, fileInfo, mappingInfo)
    if (videoThumbnailFileInfo.id) {
      const topic = {
        id: topicId,
        videoThumbnail: {
          ...videoThumbnailFileInfo
        }
      }
      dispatch(addVideoThumbnailEpisodeSuccess(topic.id, topic.videoThumbnail))
      return topic
    }
    dispatch(addVideoThumbnailEpisodeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addVideoThumbnailEpisodeFailure(error))
  }
  return {}
}

export default addVideoThumbnailTopic
