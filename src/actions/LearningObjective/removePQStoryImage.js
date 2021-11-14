import gql from 'graphql-tag'
import { get } from 'lodash'
import getActionsError from '../../utils/getActionsError'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import actions from '../../reducers/learningObjective'

const REMOVE_THUMBNAIL = (fieldLearningObjectiveId, thumbnailFileId) => gql`
  mutation{
    removeFromLearningObjectivePqStoryImage(
        learningObjectiveId:"${fieldLearningObjectiveId}",
        fileId: "${thumbnailFileId}"
    ){
        learningObjective{
            id
        }
    }
  }
`

const removeThumbNailLoading = (id) => ({
  type: actions.REMOVE_PQSTORYIMAGE_LOADING,
  id
})
const removeThumbNailSuccess = id => ({
  type: actions.REMOVE_PQSTORYIMAGE_SUCCESS,
  id
})

const removeThumbNailFailure = error => ({
  type: actions.REMOVE_PQSTORYIMAGE_FAILURE,
  error
})
const removeThumbnail = (learningObjectiveId, thumbnailId) => async (dispatch) => {
  try {
    dispatch(removeThumbNailLoading(learningObjectiveId))
    const { data } = await requestToGraphql(REMOVE_THUMBNAIL(learningObjectiveId, thumbnailId))
    const loId = get(data, 'removeFromLearningObjectivePqStoryImage.learningObjective.id', null)
    if (loId) {
      dispatch(removeThumbNailSuccess(loId))
      return loId
    }
    dispatch(removeThumbNailFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeThumbNailFailure(error))
  }
  return {}
}
export default removeThumbnail
