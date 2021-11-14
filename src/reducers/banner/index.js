import fetchPreset from '../presets/fetchPreset'
import addPreset from '../presets/addPreset'
import editPreset from '../presets/editPreset'
import backgroundPreset from '../presets/removeBackground'
import lottiePreset from '../presets/removeLottieFilePreset'
import createReducer from '../../actions/utils/createReducer'

export const bannerReducer = createReducer('banner', [
  fetchPreset,
  addPreset,
  editPreset,
  backgroundPreset,
  lottiePreset
])

export default bannerReducer
