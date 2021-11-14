import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/banner'

const REMOVE_BACKGROUND_IMAGE_QUERY = (Id, fileId) => gql`
  mutation {
    removeFromBackgroundImageBanner(
      bannerId: "${Id}"
      fileId: "${fileId}"
    ) {
      banner {
        id
      }
    }
  }
`

const removeBackgroundBannerLoading = id => ({
  type: actions.REMOVE_BACKGROUNDIMAGE_LOADING,
  id
})

const removeBackgroundBannerSuccess = id => ({
  type: actions.REMOVE_BACKGROUNDIMAGE_SUCCESS,
  id
})

const removeBackgroundBannerError = error => ({
  type: actions.REMOVE_BACKGROUNDIMAGE_FAILURE,
  error
})

const removeBackground = ({ bannerId, backgroundImgId }) => async dispatch => {
  try {
    dispatch(removeBackgroundBannerLoading(bannerId))
    const { data } = await requestToGraphql(
      REMOVE_BACKGROUND_IMAGE_QUERY(bannerId, backgroundImgId)
    )
    const id = get(data, 'removeFromBackgroundImageBanner.banner.id', null)
    if (id) {
      dispatch(removeBackgroundBannerSuccess(id))
      return id
    }
    dispatch(removeBackgroundBannerError(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeBackgroundBannerError(error))
  }
  return {}
}

export default removeBackground
