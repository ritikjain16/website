import gql from 'graphql-tag'
import { sortBy, get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { questionBankFactory as actions } from '../../reducers/questionBank'

const EDIT_QUESTIONS_QUERY = gql`
  mutation($input: [QuestionBanksUpdate]!) {
    updateQuestionBanks(input: $input) {
      id
      order
    }
  }
`

const editQuestionsLoading = () => ({
  type: actions.FETCH_LOADING,
})

const editQuestionsSuccess = questionBanks => ({
  type: actions.FETCH_SUCCESS,
  questionBanks
})

const editQuestionsFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const editQuestions = input => async dispatch => {
  try {
    dispatch(editQuestionsLoading())
    const res = await requestToGraphql(EDIT_QUESTIONS_QUERY, { input })
    const questions = get(res, 'data.updateQuestionBanks', [])
    if (questions && questions.length) {
      dispatch(editQuestionsSuccess(sortBy(questions, 'order')))
      return questions
    }
    dispatch(editQuestionsFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editQuestionsFailure(error))
  }
  return {}
}

export default editQuestions
