import createReducer from '../../actions/utils/createReducer'
import fetchPreset from '../presets/fetchPreset'
import deletePreset from '../presets/deletePreset'
import addPreset from '../presets/addPreset'
import editPreset from '../presets/editPreset'
import imagePreset from '../presets/removeImagePreset'

export const stickerEmojiFactory = createReducer('stickerEmoji', [
  fetchPreset,
  deletePreset,
  addPreset,
  editPreset,
  imagePreset
])

export default stickerEmojiFactory.getReducer()
