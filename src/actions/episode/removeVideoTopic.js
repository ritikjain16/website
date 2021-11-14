import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const REMOVE_VIDEO_TOPIC_QUERY = (topicId, videoId) => gql`
  mutation {
    removeFromTopicVideo(
      topicId: "${topicId}",
      fileId:"${videoId}"
    ) {
      topic {
        id
      }
    }
  }
`

const removeVideoEpisodeLoading = id => ({
  type: actions.REMOVE_VIDEO_LOADING,
  id
})

const removeVideoEpisodeSuccess = id => ({
  type: actions.REMOVE_VIDEO_SUCCESS,
  id
})

const removeVideoEpisodeFailure = error => ({
  type: actions.REMOVE_VIDEO_FAILURE,
  error
})

const removeVideoTopic = (topicId, videoId) => async dispatch => {
  try {
    dispatch(removeVideoEpisodeLoading(topicId))
    const { data } = await requestToGraphql(
      REMOVE_VIDEO_TOPIC_QUERY(topicId, videoId)
    )
    const id = get(data, 'removeFromTopicVideo.topic.id', null)
    if (id) {
      dispatch(removeVideoEpisodeSuccess(id))
      return id
    }
    dispatch(removeVideoEpisodeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeVideoEpisodeFailure(error))
  }
  return {}
}

export default removeVideoTopic
