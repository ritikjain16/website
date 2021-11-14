import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const EDIT_TOPIC_QUERY = topicId => gql`
  mutation updateTopic(
    $input: TopicUpdate
  ) {
    updateTopic(
      id: "${topicId}"
      input: $input
    ) {
      id
      videoTitle
      videoDescription
      videoStatus
      videoStartTime
      videoEndTime
      storyStartTime
      storyEndTime
    }
  }
`

const editEpisodeLoading = (id) => ({
  type: actions.EDIT_LOADING,
  id
})

const editEpisodeSuccess = (id, episode) => ({
  type: actions.EDIT_SUCCESS,
  id,
  episode
})

const editEpisodeFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})


const editTopicVideoMeta = ({ topicId, ...input }) => async dispatch => {
  const hideLoading = notify.loading('Updating Episode')
  try {
    dispatch(editEpisodeLoading(topicId))
    const { data } = await requestToGraphql(
      EDIT_TOPIC_QUERY(topicId), {
        input
      }
    )
    hideLoading()
    const { updateTopic: topic } = data
    if (topic.id) {
      dispatch(editEpisodeSuccess(topicId, topic))
      notify.success('Episode updated')
      return topic
    }
    dispatch(editEpisodeFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editEpisodeFailure(error))
  }
  return {}
}

export default editTopicVideoMeta
