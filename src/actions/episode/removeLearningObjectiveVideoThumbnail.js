import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/learningObjective'

const REMOVE_VIDEO_THUMBNAIL_LEARNING_OBJECTIVE_QUERY = (learningObjectiveId, thumbnailId) => gql`
  mutation {
    removeFromLearningObjectiveVideoThumbnail(
      learningObjectiveId: "${learningObjectiveId}",
      fileId:"${thumbnailId}"
    ) {
      learningObjective {
        id
      }
    }
  }
`

const removeVideoThumbnailLearningObjectiveLoading = id => ({
  type: actions.REMOVE_VIDEOTHUMBNAIL_LOADING,
  id
})

const removeVideoThumbnailLearningObjectiveSuccess = id => ({
  type: actions.REMOVE_VIDEOTHUMBNAIL_SUCCESS,
  id
})

const removeVideoThumbnailLearningObjectiveFailure = error => ({
  type: actions.REMOVE_VIDEOTHUMBNAIL_FAILURE,
  error
})

const removeLearningObjectiveVideoThumbnail = (
  learningObjectiveId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeVideoThumbnailLearningObjectiveLoading(learningObjectiveId))
    const { data } = await requestToGraphql(
      REMOVE_VIDEO_THUMBNAIL_LEARNING_OBJECTIVE_QUERY(learningObjectiveId, thumbnailId)
    )
    const id = get(data, 'removeFromLearningObjectiveVideoThumbnail.learningObjective.id', null)
    if (id) {
      dispatch(removeVideoThumbnailLearningObjectiveSuccess(id))
      return id
    }
    dispatch(removeVideoThumbnailLearningObjectiveFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeVideoThumbnailLearningObjectiveFailure(error))
  }
  return {}
}

export default removeLearningObjectiveVideoThumbnail
