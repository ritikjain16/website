import gql from 'graphql-tag'
import { message as notify } from 'antd'
import { sortBy, get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/learningObjective'

const EDIT_LEARNING_OBJECTIVES_QUERY = gql`
  mutation updateLearningObjectives($input: [LearningObjectivesUpdate]!) {
    updateLearningObjectives(input: $input) {
      id
      order
    }
  }
`

const editLearnignObjectivesLoading = () => ({
  type: actions.FETCH_LOADING,
})

const editLearnignObjectivesSuccess = learningObjectives => ({
  type: actions.FETCH_SUCCESS,
  learningObjectives
})

const editLearnignObjectivesFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const editLearningObjectives = input => async dispatch => {
  const hideLoading = notify.loading('Updating...', 0)
  try {
    dispatch(editLearnignObjectivesLoading())
    const res = await requestToGraphql(EDIT_LEARNING_OBJECTIVES_QUERY, { input })
    const learningObjectives = get(res, 'data.updateLearningObjectives', [])
    hideLoading()
    if (learningObjectives && learningObjectives.length) {
      dispatch(editLearnignObjectivesSuccess(sortBy(learningObjectives, 'order')))
      notify.success('Updated')
      return learningObjectives
    }
    dispatch(editLearnignObjectivesFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    hideLoading()
    const error = getActionsError(e)
    dispatch(editLearnignObjectivesFailure(error))
  }
  return {}
}

export default editLearningObjectives
