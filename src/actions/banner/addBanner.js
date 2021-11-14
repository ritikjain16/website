import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/banner'
import uploadFile from '../utils/uploadFile'

const ADD_BANNER = gql`
    mutation($input: BannerInput!) {
         addBanner(
          input: $input
        ) {
        id
        title
        }
    }
`
const addBannerLoading = () => ({
  type: actions.ADD_LOADING
})
const addBannerSuccess = (banner) => ({
  type: actions.ADD_SUCCESS,
  banner
})
const addBannerFailure = (error) => ({
  type: actions.ADD_FAILURE,
  error
})
const addBanner = ({ backgroundImage, lottieFile, ...input }) => async dispatch => {
  try {
    dispatch(addBannerLoading())
    const { data } = await requestToGraphql(ADD_BANNER, { input })
    const addedBanner = get(data, 'addBanner', null)
    if (addedBanner.id) {
      // if backgroundImage is present
      if (backgroundImage || lottieFile) {
        const mappingInfo = backgroundImage && {
          type: 'Banner',
          typeField: 'backgroundImage',
          typeId: addedBanner.id
        }
        const lottieMappingInfo = lottieFile && {
          typeId: addedBanner.id,
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
            ...addedBanner
          }
          if (uploadedImageInfo && uploadedImageInfo.id) {
            bannerWIthFileInfo.backgroundImage = { ...uploadedImageInfo }
          }
          if (uploadedLottieInfo && uploadedLottieInfo.id) {
            bannerWIthFileInfo.lottieFile = { ...uploadedLottieInfo }
          }
          dispatch(addBannerSuccess(bannerWIthFileInfo))
          return bannerWIthFileInfo
        }
      }
      // if file is not present
      dispatch(addBannerSuccess(addedBanner))
      return addedBanner
    }
    dispatch(addBannerFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addBannerFailure(error))
  }
  return {}
}

export default addBanner
