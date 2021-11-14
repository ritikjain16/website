import createReducer from '../../actions/utils/createReducer'
import fetchPreset from '../presets/fetchPreset'
import deletePreset from '../presets/deletePreset'
import addPreset from '../presets/addPreset'
import editPreset from '../presets/editPreset'
import removeActiveImage from '../presets/removeActiveImage'
import removeInactiveImage from '../presets/removeInactiveImageTopic'

export const badgesFactory = createReducer('badge', [
  fetchPreset,
  deletePreset,
  addPreset,
  editPreset,
  removeActiveImage,
  removeInactiveImage
])

export default badgesFactory.getReducer()
