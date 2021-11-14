import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/banner'
import uploadFile from '../utils/uploadFile'

const EDIT_BANNER = (id) => gql`
    mutation($input: BannerUpdate!) {
         updateBanner(
          id: "${id}"
          input: $input
        ) {
        id
        title
        }
    }
`

const editBannerLoading = (id) => ({
  type: actions.EDIT_LOADING,
  id
})
const editBannerSuccess = (editedBanner) => ({
  type: actions.EDIT_SUCCESS,
  id: editedBanner.id,
  course: editedBanner
})
const editBannerFailure = (id, error) => ({
  type: actions.EDIT_FAILURE,
  id,
  error
})


const updateBanner = ({ backgroundImage, lottieFile, id, ...input }) => async dispatch => {
  try {
    dispatch(editBannerLoading(id))
    const { data } = await requestToGraphql(EDIT_BANNER(id), { input })
    const editedBanner = get(data, 'updateBanner', null)
    if (editedBanner.id) {
      // if backgroundImage is present
      if (backgroundImage || lottieFile) {
        const mappingInfo = backgroundImage && {
          type: 'Banner',
          typeField: 'backgroundImage',
          typeId: editedBanner.id
        }
        const lottieMappingInfo = lottieFile && {
          typeId: editedBanner.id,
          type: 'Banner',
          typeField: 'lottieFile'
        }
        const fileInfo = {
          fileBucket: 'python',
        }
        const uploadedImageInfo = backgroundImage &&
          await uploadFile(backgroundImage, fileInfo, mappingInfo)
        const uploadedLottieInfo = lottieFile &&
          await uploadFile(lottieFile, fileInfo, lottieMappingInfo)
        if ((uploadedImageInfo && uploadedImageInfo.id) ||
            (uploadedLottieInfo && uploadedLottieInfo.id)) {
          const bannerWIthFileInfo = {
            ...editedBanner
          }
          if (uploadedImageInfo && uploadedImageInfo.id) {
            bannerWIthFileInfo.backgroundImage = { ...uploadedImageInfo }
          }
          if (uploadedLottieInfo && uploadedLottieInfo.id) {
            bannerWIthFileInfo.lottieFile = { ...uploadedLottieInfo }
          }
          dispatch(editBannerSuccess(bannerWIthFileInfo))
          return bannerWIthFileInfo
        }
      }
      dispatch(editBannerSuccess(editedBanner))
      return editedBanner
    }
    dispatch(editBannerFailure(id, errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editBannerFailure(id, error))
  }
  return {}
}

export default updateBanner
