import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
// import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
// import { questionBankFactory as actions } from '../../reducers/questionBank'

const REMOVEMAPPINGWITHLO_QUERY = (questionBankid, learningObjectiveId) => gql`
    mutation{
      removeFromLearningObjectiveQuestionBank(
          questionBankId:"${questionBankid}",
           learningObjectiveId: "${learningObjectiveId}",
          ){
            questionBank{
              id
            }
      }
    }
`
// const removeMappingWithLOLoading = () => ({
//   type: actions.REMOVEMAPPINGWITHLO_LOADING
// })
// const removeMappingWithLOSuccess = (id) => ({
//   type: actions.REMOVEMAPPINGWITHLO_SUCCESS,
//   id
// })
// const removeMappingWithLOFailure = (error) => ({
//   type: actions.REMOVEMAPPINGWITHLO_FAILURE,
//   error
// })

const removeMappingWithLo = async ({ questionBankId, learningObjectiveId }) => {
  try {
    // dispatch(removeMappingWithLOLoading())
    const { data } = await requestToGraphql(REMOVEMAPPINGWITHLO_QUERY(questionBankId,
      learningObjectiveId))
    const removedQuestionFromLOId = get(data,
      'removeFromLearningObjectiveQuestionBank.questionBank')
    if (removedQuestionFromLOId.id) {
      // dispatch(removeMappingWithLOSuccess(data.deleteQuestionBank.id))
      return removedQuestionFromLOId
    }
    // dispatch(removeMappingWithLOFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    // dispatch(removeMappingWithLOFailure(error))
    return error
  }
  return {}
}
export default removeMappingWithLo
