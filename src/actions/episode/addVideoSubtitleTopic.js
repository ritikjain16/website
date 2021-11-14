import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/episode'

const addVideoSubtitleEpisodeLoading = () => ({
  type: actions.ADD_VIDEOSUBTITLE_LOADING
})

const addVideoSubtitleEpisodeSuccess = (id, videoSubtitle) => ({
  type: actions.ADD_VIDEOSUBTITLE_SUCCESS,
  id,
  videoSubtitle
})

const addVideoSubtitleEpisodeFailure = error => ({
  type: actions.ADD_VIDEOSUBTITLE_FAILURE,
  error
})

const addVideoSubtitleTopic = (file, topicId) => async dispatch => {
  try {
    dispatch(addVideoSubtitleEpisodeLoading())
    const fileInfo = {
      fileBucket: 'python'
    }
    const mappingInfo = {
      typeId: topicId,
      type: 'Topic',
      typeField: 'videoSubtitle'
    }
    const videoSubtitleFileInfo = await uploadFile(file, fileInfo, mappingInfo)
    if (videoSubtitleFileInfo.id) {
      const topic = {
        id: topicId,
        videoSubtitle: {
          ...videoSubtitleFileInfo
        }
      }
      dispatch(addVideoSubtitleEpisodeSuccess(topic.id, topic.videoSubtitle))
      return topic
    }
    dispatch(addVideoSubtitleEpisodeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addVideoSubtitleEpisodeFailure(error))
  }
  return {}
}

export default addVideoSubtitleTopic
