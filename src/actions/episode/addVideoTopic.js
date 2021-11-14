import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/episode'

const addVideoEpisodeLoading = () => ({
  type: actions.ADD_VIDEO_LOADING
})

const addVideoEpisodeSuccess = (id, video) => ({
  type: actions.ADD_VIDEO_SUCCESS,
  id,
  video
})

const addVideoEpisodeFailure = error => ({
  type: actions.ADD_VIDEO_FAILURE,
  error
})

const addVideoTopic = (file, topicId) => async dispatch => {
  try {
    dispatch(addVideoEpisodeLoading())
    const fileInfo = {
      fileBucket: 'python'
    }
    const mappingInfo = {
      typeId: topicId,
      type: 'Topic',
      typeField: 'video'
    }
    const videoFileInfo = await uploadFile(file, fileInfo, mappingInfo)
    if (videoFileInfo.id) {
      const topic = {
        id: topicId,
        video: {
          ...videoFileInfo
        }
      }
      dispatch(addVideoEpisodeSuccess(topic.id, topic.video))
      return topic
    }
    dispatch(addVideoEpisodeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addVideoEpisodeFailure(error))
  }
  return {}
}

export default addVideoTopic
