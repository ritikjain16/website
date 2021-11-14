import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { questionBankFactory as actions } from '../../reducers/questionBank'

const FETCH_QUERY = topicId => gql`
  query{
    topic(id:"${topicId}"){
      questions(orderBy:order_ASC){
        id
        assessmentType
        questionType
        order
        difficulty
        statement
        createdAt
        updatedAt,
        hint,
        hints {
          hint
          hintPretext
        },
        tags {
          id
          title
        },
        status,
        answerCodeSnippet,
        questionCodeSnippet,
        questionLayoutType,
        explanation, 
        fibInputOptions{
          correctPosition,
          answers
        },
        mcqOptions{
          statement
          isCorrect
          initialXML
          blocksJSON
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
        learningObjectives(filter: { topic_some: { id: "${topicId}" } }){
          id,
          title
        },
        topics(filter: { id: "${topicId}" }){
          id
        }
      }
    }
  }
`

const fetchQuestionBankLoading = () => ({
  type: actions.FETCH_LOADING
})
const fetchQuestionBankFailure = (error) => ({
  type: actions.FETCH_FAILURE,
  error
})
const fetchQuestionBankSuccess = (questionBanks) => ({
  type: actions.FETCH_SUCCESS,
  questionBanks
})
const fetchQuestionBank = (id) => async dispatch => {
  try {
    dispatch(fetchQuestionBankLoading())
    const { data } = await requestToGraphql(FETCH_QUERY(id))
    const questionBank = get(data, 'topic.questions')
    if (questionBank.length > 0) {
      dispatch(fetchQuestionBankSuccess(questionBank))
      return data.learningObjectives
    }
    dispatch(fetchQuestionBankFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchQuestionBankFailure(error))
  }
  return {}
}
export default fetchQuestionBank
