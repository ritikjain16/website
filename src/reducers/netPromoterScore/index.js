import createReducer from '../../actions/utils/createReducer'

import fetchPreset from '../presets/fetchPreset'
// import deletePreset from '../presets/deletePreset'
// import addPreset from '../presets/addPreset'
// import editPreset from '../presets/editPreset'
// import thumbnailPreset from '../presets/removeThumbnailPreset'

const nps = createReducer('nps', [
  fetchPreset,
  // deletePreset,
  // addPreset,
  // editPreset,
  // thumbnailPreset
])

export default nps
