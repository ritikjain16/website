import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/topics'

const REMOVE_TOPIC_SMALL_THUMBNAIL_QUERY = (topicId, thumbnailId) => gql`
  mutation {
    removeFromTopicThumbnailSmall(
      topicId: "${topicId}",
      fileId:"${thumbnailId}"
    ) {
      topic {
        id
      }
    }
  }
`

const removeSmallThumbnailTopicLoading = id => ({
  type: actions.REMOVE_THUMBNAILSMALL_LOADING,
  id
})

const removeSmallThumbnailTopicSuccess = id => ({
  type: actions.REMOVE_THUMBNAILSMALL_SUCCESS,
  id
})

const removeSmallThumbnailTopicFailure = error => ({
  type: actions.REMOVE_THUMBNAILSMALL_FAILURE,
  error
})

const removeTopicSmallThumbnail = (topicId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeSmallThumbnailTopicLoading(topicId))
    const { data } = await requestToGraphql(
      REMOVE_TOPIC_SMALL_THUMBNAIL_QUERY(topicId, thumbnailId)
    )
    const id = get(data, 'removeFromTopicThumbnailSmall.topic.id', null)
    if (id) {
      dispatch(removeSmallThumbnailTopicSuccess(id))
      return id
    }
    dispatch(removeSmallThumbnailTopicFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeSmallThumbnailTopicFailure(error))
  }
  return {}
}

export default removeTopicSmallThumbnail
