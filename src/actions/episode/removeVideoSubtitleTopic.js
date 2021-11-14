import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const REMOVE_SUBTITLE_TOPIC_QUERY = (topicId, subtitleId) => gql`
  mutation {
    removeFromVideoSubtitle(
      topicId: "${topicId}",
      fileId:"${subtitleId}"
    ) {
      topic {
        id
      }
    }
  }
`

const removeVideoSubtitleEpisodeLoading = id => ({
  type: actions.REMOVE_VIDEOSUBTITLE_LOADING,
  id
})

const removeVideoSubtitleEpisodeSuccess = id => ({
  type: actions.REMOVE_VIDEOSUBTITLE_SUCCESS,
  id
})

const removeVideoSubtitleEpisodeFailure = error => ({
  type: actions.REMOVE_VIDEOSUBTITLE_FAILURE,
  error
})

const removeVideoSubtitleTopic = (topicId, subtitleId) => async dispatch => {
  try {
    dispatch(removeVideoSubtitleEpisodeLoading(topicId))
    const { data } = await requestToGraphql(
      REMOVE_SUBTITLE_TOPIC_QUERY(topicId, subtitleId)
    )
    const id = get(data, 'removeFromVideoSubtitle.topic.id', null)
    if (id) {
      dispatch(removeVideoSubtitleEpisodeSuccess(id))
      return id
    }
    dispatch(removeVideoSubtitleEpisodeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeVideoSubtitleEpisodeFailure(error))
  }
  return {}
}

export default removeVideoSubtitleTopic
