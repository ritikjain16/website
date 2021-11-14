import createReducer from '../../actions/utils/createReducer'

import fetchPreset from '../presets/fetchPreset'
import deletePreset from '../presets/deletePreset'
import addPreset from '../presets/addPreset'
import editPreset from '../presets/editPreset'
import thumbnailPreset from '../presets/removeThumbnailPreset'
import addSubtitlePreset from '../presets/addSubtitlePreset'
import removeSubtitlePreset from '../presets/removeSubtitlePreset'
import addVideoPreset from '../presets/addVideoPreset'
import removeVideoPreset from '../presets/removeVideoPreset'
import addVideoThumbnailPreset from '../presets/addVideoThumbnailPreset'
import removeVideoThumbnailPreset from '../presets/removeVideoThumbnailPreset'
import removeThumbnailSmallPreset from '../presets/removeThumbnailSmallPreset'

const topic = createReducer('topic', [
  fetchPreset,
  deletePreset,
  addPreset,
  editPreset,
  thumbnailPreset,
  addSubtitlePreset,
  removeSubtitlePreset,
  addVideoPreset,
  removeVideoPreset,
  addVideoThumbnailPreset,
  removeVideoThumbnailPreset,
  removeThumbnailSmallPreset
])

export default topic
