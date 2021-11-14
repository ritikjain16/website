import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const REMOVE_STORY_THUMBNAIL_QUERY = (topicId, thumbnailId) => gql`
  mutation {
      removeFromStoryThumbnail(
      topicId: "${topicId}",
      fileId:"${thumbnailId}"
    ) {
      topic {
        id
      }
    }
  }
`

const removeStoryThumbnailLoading = id => ({
  type: actions.REMOVE_STORYTHUMBNAIL_LOADING,
  id
})

const removeStoryThumbnailSuccess = id => ({
  type: actions.REMOVE_STORYTHUMBNAIL_SUCCESS,
  id
})

const removeStoryThumbnailFailure = error => ({
  type: actions.REMOVE_STORYTHUMBNAIL_FAILURE,
  error
})

const removeStoryVideoThumbnail = (
  topicId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeStoryThumbnailLoading(topicId))
    const { data } = await requestToGraphql(
      REMOVE_STORY_THUMBNAIL_QUERY(topicId, thumbnailId)
    )
    const id = get(data, 'removeFromStoryThumbnail.topic.id', null)
    if (id) {
      dispatch(removeStoryThumbnailSuccess(id))
      return id
    }
    dispatch(removeStoryThumbnailFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeStoryThumbnailFailure(error))
  }
  return {}
}

export default removeStoryVideoThumbnail
