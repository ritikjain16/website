import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { questionBankFactory as actions } from '../../reducers/questionBank'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const ADD_QUERY = (input, learningObjectiveConnectId, topicConnectId, tagsConnectIds = []) => gql`
mutation(
  $fibInput:[FibInputOptionInput],
  $mcqInput:[McqOptionInput],
  $fibBlock:[FibBlocksOptionInput],
  $arrangeInput: [ArrangeOptionInput],
  $statement: String!,
  $hint: String,
  $answerCodeSnippet: String,
  $questionCodeSnippet: String,
  $explanation: String,
  $hints: [HintInput]
  ){
    addQuestionBank(
      topicConnectId:"${topicConnectId}"
      learningObjectiveConnectId:"${learningObjectiveConnectId}",
      ${tagsConnectIds.length > 0 ? `tagsConnectIds: [${getIdArrForQuery(tagsConnectIds)}]` : ''}
        input:{
          order: ${input.order},
          statement: $statement,
          hint: $hint
          difficulty: ${input.difficulty},
          assessmentType: ${input.assessmentType},
          questionType :${input.questionType},
          questionLayoutType: ${input.questionLayoutType}
          answerCodeSnippet:$answerCodeSnippet,
          questionCodeSnippet:$questionCodeSnippet,
          fibInputOptions: $fibInput,
          mcqOptions: $mcqInput,
          fibBlocksOptions: $fibBlock,
          arrangeOptions: $arrangeInput,
          explanation:$explanation,
          hints:$hints
        }
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
        difficulty,
        assessmentType,
        answerCodeSnippet,
        questionCodeSnippet
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
        status,
        topic{
          id
        }
      }
}
`
const addQuestionBankLoading = () => ({
  type: actions.ADD_LOADING
})
const addQuestionBankSuccess = (questionBank) => ({
  type: actions.ADD_SUCCESS,
  questionBank
})
const addQuestionBankFailure = (error) => ({
  type: actions.ADD_FAILURE,
  error
})

const addQuestionBank = (input, learningObjectiveConnectId, topicConnectId) => async dispatch => {
  try {
    dispatch(addQuestionBankLoading())
    const tagsConnectIds = get(input, 'tags', []).map(tag => get(tag, 'id'))
    const { data } = await requestToGraphql(
      ADD_QUERY(input, learningObjectiveConnectId, topicConnectId, tagsConnectIds), {
        fibInput: input.fibInputOptions,
        mcqInput: input.mcqOptions,
        fibBlock: input.fibBlocksOptions,
        arrangeInput: input.arrangeOptions,
        statement: input.statement,
        hint: input.hint,
        answerCodeSnippet: input.answerCodeSnippet,
        questionCodeSnippet: input.questionCodeSnippet,
        explanation: input.explanation,
        hints: get(input, 'hints', [])
      }
    )
    if (data.addQuestionBank.id) {
      dispatch(addQuestionBankSuccess(data.addQuestionBank))
      return data.addQuestionBank
    }
    dispatch(addQuestionBankFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addQuestionBankFailure(error))
  }
  return {}
}
export default addQuestionBank
