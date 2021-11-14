import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/topics'

const REMOVE_THUMBNAIL_TOPIC_QUERY = (topicId, thumbnailId) => gql`
  mutation {
    removeFromTopicThumbnail(
      topicId: "${topicId}",
      fileId:"${thumbnailId}"
    ) {
      topic {
        id
      }
    }
  }
`

const removeThumbnailTopicLoading = id => ({
  type: actions.REMOVE_THUMBNAIL_LOADING,
  id
})

const removeThumbnailTopicSuccess = id => ({
  type: actions.REMOVE_THUMBNAIL_SUCCESS,
  id
})

const removeThumbnailTopicFailure = error => ({
  type: actions.REMOVE_THUMBNAIL_FAILURE,
  error
})

const removeThumbnailTopic = (topicId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeThumbnailTopicLoading(topicId))
    const { data } = await requestToGraphql(
      REMOVE_THUMBNAIL_TOPIC_QUERY(topicId, thumbnailId)
    )
    const id = get(data, 'removeFromTopicThumbnail.topic.id', null)
    if (id) {
      dispatch(removeThumbnailTopicSuccess(id))
      return id
    }
    dispatch(removeThumbnailTopicFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeThumbnailTopicFailure(error))
  }
  return {}
}

export default removeThumbnailTopic
