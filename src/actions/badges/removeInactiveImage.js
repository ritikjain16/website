import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { badgesFactory as actions } from '../../reducers/badges'

const REMOVE_THUMBNAIL = (badgeId, thumbnailId) => gql`
    mutation{
        removeFromBadgeInactiveImage(badgeId:"${badgeId}",fileId:"${thumbnailId}"){
            badge{
                id
            }
        }
    }

`

const removeThumbnailLoading = (id) => ({
  type: actions.REMOVE_INACTIVEIMAGE_LOADING,
  id
})

const removeThumbnailSuccess = (id) => ({
  type: actions.REMOVE_INACTIVEIMAGE_SUCCESS,
  id
})

const removeThumbnailFailure = (error) => ({
  type: actions.REMOVE_INACTIVEIMAGE_FAILURE,
  error
})

const removeFromBadgeInactiveImage = (badgeId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeThumbnailLoading(badgeId))
    const { data } = await requestToGraphql(REMOVE_THUMBNAIL(badgeId, thumbnailId))
    const removedFromBadgeId = get(data, 'removeFromBadgeInactiveImage.badge.id', null)
    if (removedFromBadgeId) {
      dispatch(removeThumbnailSuccess(removedFromBadgeId))
      return removedFromBadgeId
    }
    dispatch(removeThumbnailFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeThumbnailFailure(error))
  }
  return {}
}

export default removeFromBadgeInactiveImage
