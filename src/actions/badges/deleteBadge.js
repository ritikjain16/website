import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { badgesFactory as actions } from '../../reducers/badges'

const DELETE_BADGE = id => gql`
    mutation{
        deleteBadge(id:"${id}"){
            id
        }
    }
`

const deleteBadgeLoading = (deletingBadgeId) => ({
  type: actions.DELETE_LOADING,
  id: deletingBadgeId
})

const deleteBadgeSuccess = (deletedBadgeId) => ({
  type: actions.DELETE_SUCCESS,
  id: deletedBadgeId
})

const deleteBadgeFailure = (deletingBadgeError) => ({
  type: actions.DELETE_FAILURE,
  error: deletingBadgeError
})

const deleteBadge = (id) => async dispatch => {
  try {
    dispatch(deleteBadgeLoading(id))
    const { data } = await requestToGraphql(DELETE_BADGE(id))
    // deleted Badge object of form {id,title}
    const deletedBadge = get(data, 'deleteBadge', null)
    if (deletedBadge && deletedBadge.id) {
      dispatch(deleteBadgeSuccess(deletedBadge.id))
      return deletedBadge
    }
    dispatch(deleteBadgeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(deleteBadgeFailure(error))
  }
  return {}
}

export default deleteBadge
