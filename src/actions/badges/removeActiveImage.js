import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { badgesFactory as actions } from '../../reducers/badges'

const REMOVE_THUMBNAIL = (badgeId, thumbnailId) => gql`
    mutation{
        removeFromBadgeActiveImage(badgeId:"${badgeId}",fileId:"${thumbnailId}"){
            badge{
                id
            }
        }
    }

`

const removeThumbnailLoading = (id) => ({
  type: actions.REMOVE_ACTIVEIMAGE_LOADING,
  id
})
const removeThumbnailSuccess = (id) => ({
  type: actions.REMOVE_ACTIVEIMAGE_SUCCESS,
  id
})
const removeThumbnailFailure = (error) => ({
  type: actions.REMOVE_ACTIVEIMAGE_FAILURE,
  error
})

const removeFromBadgeActiveImage = (badgeId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeThumbnailLoading(badgeId))
    const { data } = await requestToGraphql(REMOVE_THUMBNAIL(badgeId, thumbnailId))
    const removeFromBadgeId = get(data, 'removeFromBadgeActiveImage.badge.id', null)
    if (removeFromBadgeId) {
      dispatch(removeThumbnailSuccess(removeFromBadgeId))
      return removeFromBadgeId
    }
    dispatch(removeThumbnailFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeThumbnailFailure(error))
  }
  return {}
}

export default removeFromBadgeActiveImage
