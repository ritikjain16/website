import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const FETCH_TOPIC_VIDEO_QUERY = topicId => gql`
  {
    topic(
      id: "${topicId}"
    ) {
      id
      title
      bulletPoints {
        order
        statement
      }
      videoTitle
      videoDescription
      isQuestionInMessageEnabled
      videoStatus
      videoStartTime
      videoEndTime
      storyStartTime
      storyEndTime
      storyThumbnail{
          id
          name
          uri
          signedUri
      }
      video{
        id
        name
        uri
        signedUri
      }
      videoSubtitle{
        id
        name
        uri
        signedUri
      }
      videoThumbnail{
        id
        name
        uri
        signedUri
      }
    }
  }
`

const fetchEpisodesLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchEpisodesSuccess = episodes => ({
  type: actions.FETCH_SUCCESS,
  episodes
})

const fetchEpisodesFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchTopics = (topicId) => async dispatch => {
  try {
    dispatch(fetchEpisodesLoading())
    const { data } = await requestToGraphql(FETCH_TOPIC_VIDEO_QUERY(topicId))
    if (topicId && data) {
      dispatch(fetchEpisodesSuccess([data.topic]))
      return [data.topic]
    }
    dispatch(fetchEpisodesFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchEpisodesFailure(error))
  }
  return {}
}

export default fetchTopics
