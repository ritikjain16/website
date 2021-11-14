import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/banner'

const REMOVE_LOTTIE_FILE_QUERY = (Id, fileId) => gql`
  mutation {
    removeFromLottieFileBanner(
      bannerId: "${Id}"
      fileId: "${fileId}"
    ) {
      banner {
        id
      }
    }
  }
`

const removeLottieLoading = id => ({
  type: actions.REMOVE_LOTTIEFILE_LOADING,
  id
})

const removeLottieSuccess = id => ({
  type: actions.REMOVE_LOTTIEFILE_SUCCESS,
  id
})

const removeLottieError = error => ({
  type: actions.REMOVE_LOTTIEFILE_FAILURE,
  error
})

const removeLottieFile = ({ bannerId, lottieId }) => async dispatch => {
  try {
    dispatch(removeLottieLoading(bannerId))
    const { data } = await requestToGraphql(
      REMOVE_LOTTIE_FILE_QUERY(bannerId, lottieId)
    )
    const id = get(data, 'removeFromLottieFileBanner.banner.id', null)
    if (id) {
      dispatch(removeLottieSuccess(id))
      return id
    }
    dispatch(removeLottieError(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeLottieError(error))
  }
  return {}
}

export default removeLottieFile
