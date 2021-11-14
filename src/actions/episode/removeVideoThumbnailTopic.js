import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const REMOVE_THUMBNAIL_TOPIC_QUERY = (topicId, thumbnailId) => gql`
  mutation {
    removeFromVideoThumbnail(
      topicId: "${topicId}",
      fileId:"${thumbnailId}"
    ) {
      topic {
        id
      }
    }
  }
`

const removeVideoThumbnailEpisodeLoading = id => ({
  type: actions.REMOVE_VIDEOTHUMBNAIL_LOADING,
  id
})

const removeVideoThumbnailEpisodeSuccess = id => ({
  type: actions.REMOVE_VIDEOTHUMBNAIL_SUCCESS,
  id
})

const removeVideoThumbnailEpisodeFailure = error => ({
  type: actions.REMOVE_VIDEOTHUMBNAIL_FAILURE,
  error
})

const removeVideoThumbnailTopic = (topicId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeVideoThumbnailEpisodeLoading(topicId))
    const { data } = await requestToGraphql(
      REMOVE_THUMBNAIL_TOPIC_QUERY(topicId, thumbnailId)
    )
    const topicThumbnailId = get(data, 'removeFromVideoThumbnail.topic.id')
    if (topicThumbnailId) {
      dispatch(removeVideoThumbnailEpisodeSuccess(topicThumbnailId))
      return topicThumbnailId
    }
    dispatch(removeVideoThumbnailEpisodeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeVideoThumbnailEpisodeFailure(error))
  }
  return {}
}

export default removeVideoThumbnailTopic
