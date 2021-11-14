import fetchPreset from '../presets/fetchPreset'
import addPreset from '../presets/addPreset'
import deletePreset from '../presets/deletePreset'
import editPreset from '../presets/editPreset'
import removeThumbnailPreset from '../presets/removeThumbnailPreset'
import createReducer from '../../actions/utils/createReducer'

export const coursesFactory = createReducer('course', [
  fetchPreset,
  deletePreset,
  addPreset,
  editPreset,
  removeThumbnailPreset
])

export default coursesFactory.getReducer()
