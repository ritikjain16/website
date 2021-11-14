import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { questionBankFactory as actions } from '../../reducers/questionBank'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const EDIT_QUERY = (id, learningObjectiveConnectId, topicId, tagsConnectIds = []) => gql`
mutation($QuestionInput:QuestionBankUpdate){
    updateQuestionBank(
        id:"${id}"
        input:$QuestionInput
        ${learningObjectiveConnectId ? `learningObjectiveConnectId: "${learningObjectiveConnectId}",` : ''}
        ${tagsConnectIds.length > 0 ? `tagsConnectIds: [${getIdArrForQuery(tagsConnectIds)}]` : ''}
      ){
        id,
        order,
        statement,
        hint,
        hints {
          hint
          hintPretext
        },
        tags {
          id
          title
        },
        questionType,
        questionLayoutType,
        difficulty,
        assessmentType,
        answerCodeSnippet,
        questionCodeSnippet,
        explanation,
        learningObjective{
          id,
          title
        }
        fibInputOptions{
          answers,
          correctPosition
        },
        mcqOptions{
          statement,
          isCorrect,
          blocksJSON,
          initialXML
        },
        arrangeOptions{
          displayOrder
          statement
          correctPosition
          correctPositions
        },
        fibBlocksOptions{
          correctPositions,
          statement,
          displayOrder
        },
        createdAt,
        updatedAt,
        status
        topic{
          id
        }
      }
}
`
const editQuestionBankLoading = () => ({
  type: actions.EDIT_LOADING
})
const editQuestionBankSuccess = (id, questionBank) => ({
  type: actions.EDIT_SUCCESS,
  id,
  questionBank
})
const editQuestionBankFailure = (error) => ({
  type: actions.EDIT_FAILURE,
  error
})

const editQuestionBank = (input, learningObjectiveConnectId, topicConnectId) => async dispatch => {
  try {
    dispatch(editQuestionBankLoading())
    const { fibInputOptions, fibBlocksOptions, mcqOptions,
      arrangeOptions, hints } = input
    if (mcqOptions) {
      Object.assign(input,
        { mcqOptions: { replace: mcqOptions } })
    }
    if (fibInputOptions) {
      Object.assign(input,
        { fibInputOptions: { replace: fibInputOptions } })
    }
    if (fibBlocksOptions) {
      Object.assign(input,
        { fibBlocksOptions: { replace: fibBlocksOptions } })
    }
    if (arrangeOptions) {
      Object.assign(input,
        { arrangeOptions: { replace: arrangeOptions } })
    }
    if (hints) {
      Object.assign(input,
        { hints: { replace: hints } })
    }
    const { id, tags = [], ...restInput } = input
    const tagsConnectIds = tags.map(tag => get(tag, 'id'))
    const { data } = await requestToGraphql(
      EDIT_QUERY(id, learningObjectiveConnectId, topicConnectId, tagsConnectIds), {
        QuestionInput: restInput,
      })
    if (data.updateQuestionBank.id) {
      dispatch(editQuestionBankSuccess(data.updateQuestionBank.id, data.updateQuestionBank))
      return data.updateQuestionBank
    }
    dispatch(editQuestionBankFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editQuestionBankFailure(error))
  }
  return {}
}
export default editQuestionBank
