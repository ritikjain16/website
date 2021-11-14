import gql from 'graphql-tag'
import { message as notify } from 'antd'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/episode'

const EDIT_BULLET_POINTS_QUERY = topicId => gql`
  mutation updateTopic(
    $input: TopicUpdate
  ) {
    updateTopic(
      id: "${topicId}"
      input: $input
    ) {
      id
      bulletPoints {
        order
        statement
      }
    }
  }
`

const editBulletPointsLoading = (id) => ({
  type: actions.EDIT_LOADING,
  id
})

const editBulletPointsSuccess = (id, episode) => ({
  type: actions.EDIT_SUCCESS,
  id,
  episode
})

const editBulletPointsFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})

const updateBulletPoints = ({ topicId, input }) => async dispatch => {
  const hideLoading = notify.loading('Updating Bullet Points')
  try {
    dispatch(editBulletPointsLoading(topicId))
    const { data } = await requestToGraphql(EDIT_BULLET_POINTS_QUERY(topicId), { input })
    hideLoading()
    const { updateTopic: topic } = data
    if (topic.id) {
      dispatch(editBulletPointsSuccess(topicId, topic))
      notify.success('Bullet Points Updated')
      return topic
    }
    dispatch(editBulletPointsFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    notify.error(error)
    dispatch(editBulletPointsFailure(error))
  }
  return {}
}

export default updateBulletPoints
