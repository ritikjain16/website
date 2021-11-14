import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { questionBankFactory as actions } from '../../reducers/questionBank'

const DELETE_QUERY = (id) => gql`
    mutation{
      deleteQuestionBank(id:"${id}"){
        id,
        statement
      }
    }
`
const deleteLoading = () => ({
  type: actions.DELETE_LOADING
})
const deleteSuccess = (id) => ({
  type: actions.DELETE_SUCCESS,
  id
})
const deleteFailure = (error) => ({
  type: actions.DELETE_FAILURE,
  error
})

const deleteQuestionBank = (id) => async dispatch => {
  try {
    dispatch(deleteLoading())
    const { data } = await requestToGraphql(DELETE_QUERY(id))
    if (data.deleteQuestionBank.id) {
      dispatch(deleteSuccess(data.deleteQuestionBank.id))
      return data.deleteQuestionBank
    }
    dispatch(deleteFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(deleteFailure(error))
  }
  return {}
}
export default deleteQuestionBank
