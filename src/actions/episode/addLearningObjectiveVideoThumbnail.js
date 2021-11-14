import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/learningObjective'

const addLearningObjectiveVideoThumbnailLoading = () => ({
  type: actions.ADD_VIDEOTHUMBNAIL_LOADING
})

const addLearningObjectiveVideoThumbnailSuccess = (id, videoThumbnail) => ({
  type: actions.ADD_VIDEOTHUMBNAIL_SUCCESS,
  id,
  videoThumbnail
})

const addLearningObjectiveVideoThumbnailFailure = error => ({
  type: actions.ADD_VIDEOTHUMBNAIL_FAILURE,
  error
})

const addLearningObjectiveVideoThumbnail = (file, learningObjectiveId) => async dispatch => {
  try {
    dispatch(addLearningObjectiveVideoThumbnailLoading())
    const fileInfo = {
      fileBucket: 'python'
    }
    const mappingInfo = {
      typeId: learningObjectiveId,
      type: 'LearningObjective',
      typeField: 'videoThumbnail'
    }
    const videoThumbnailFileInfo = await uploadFile(file, fileInfo, mappingInfo)
    if (videoThumbnailFileInfo.id) {
      const learningObjective = {
        id: learningObjectiveId,
        videoThumbnail: {
          ...videoThumbnailFileInfo
        }
      }

      dispatch(addLearningObjectiveVideoThumbnailSuccess(
        learningObjective.id,
        learningObjective.videoThumbnail))
      return learningObjective
    }
    dispatch(addLearningObjectiveVideoThumbnailFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addLearningObjectiveVideoThumbnailFailure(error))
  }
  return {}
}

export default addLearningObjectiveVideoThumbnail
