import createReducer from '../../actions/utils/createReducer'

import fetchPreset from '../presets/fetchPreset'
import deletePreset from '../presets/deletePreset'
import addPreset from '../presets/addPreset'
import editPreset from '../presets/editPreset'
import removeThumbnail from '../presets/removeThumbnailPreset'
import removePQStoryImage from '../presets/removePQStoryImagePreset'
import addVideoThumbnailLOPreset from '../presets/addVideoThumbnailLOPreset'
import removeVideoThumbnailLOPreset from '../presets/removeVideoThumbnailLOPreset'

const learningObjective = createReducer('learningObjective', [
  fetchPreset,
  deletePreset,
  addPreset,
  editPreset,
  removeThumbnail,
  removePQStoryImage,
  addVideoThumbnailLOPreset,
  removeVideoThumbnailLOPreset,
])

export const loReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_LO':
      const learningObjectives = []
      state.learningObjectives.forEach((loElem) => {
        if (loElem.id !== action.lo && action.lo.id) {
          learningObjectives.push(loElem)
        } else {
          learningObjectives.push(action.lo)
        }
      })
      return {
        ...state,
        learningObjectives
      }
    default:
      return learningObjective.getReducer()(state, action)
  }
}
export default learningObjective
