import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/topics'

const DELETE_TOPIC_QUERY = id => gql`
  mutation {
    deleteTopic(id: "${id}") {
      id
      title
    }
  }
`

const deleteTopicLoading = id => ({
  type: actions.DELETE_LOADING,
  id
})

const deleteTopicSuccess = id => ({
  type: actions.DELETE_SUCCESS,
  id
})

const deleteTopicFailure = error => ({
  type: actions.DELETE_FAILURE,
  error
})


const deleteTopic = id => async dispatch => {
  try {
    dispatch(deleteTopicLoading(id))
    const { data } = await requestToGraphql(DELETE_TOPIC_QUERY(id))
    const { deleteTopic: topic } = data
    if (topic.id) {
      dispatch(deleteTopicSuccess(topic.id))
      return topic
    }
    dispatch(deleteTopicFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(deleteTopicFailure(error))
  }
  return {}
}

export default deleteTopic
