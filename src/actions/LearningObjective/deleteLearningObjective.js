import gql from 'graphql-tag'
import { message } from 'antd'
import getActionsError from '../../utils/getActionsError'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import actions from '../../reducers/learningObjective'

const DELETE_LO_QUERY = id => gql`
  mutation{
    deleteLearningObjective(id:"${id}"){
      title,
      id
    }
  }
`

const deleteLearningObjectiveLoading = () => ({
  type: actions.DELETE_LOADING
})
const deleteLearningObjectiveSuccess = id => ({
  type: actions.DELETE_SUCCESS,
  id
})
const deleteLearningObjectiveFailure = error => ({
  type: actions.DELETE_FAILURE,
  error
})
const deleteLO = (id) => async dispatch => {
  try {
    dispatch(deleteLearningObjectiveLoading())
    const { data } = await requestToGraphql(DELETE_LO_QUERY(id))
    const hideLoading = message.loading('Deleting...', 0)
    hideLoading()
    const { deleteLearningObjective: deletedLO } = data
    if (deletedLO.id) {
      dispatch(deleteLearningObjectiveSuccess(deletedLO.id))
      message.success(`Deleted ${deletedLO.title}`)
      return deletedLO
    }
    dispatch(errors.EmptyDataError)
    message.error('Failed to delete')
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(deleteLearningObjectiveFailure(error))
    message.error('Failed to delete')
  }
  return {}
}
export default deleteLO
