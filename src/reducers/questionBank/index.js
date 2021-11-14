import createReducer from '../../actions/utils/createReducer'

import fetchPreset from '../presets/fetchPreset'
import deletePreset from '../presets/deletePreset'
import addPreset from '../presets/addPreset'
import editPreset from '../presets/editPreset'
import removeThumbnailPreset from '../presets/removeThumbnailPreset'

export const questionBankFactory = createReducer('questionBank', [
  fetchPreset,
  deletePreset,
  addPreset,
  editPreset,
  removeThumbnailPreset
])

export default questionBankFactory.getReducer()
