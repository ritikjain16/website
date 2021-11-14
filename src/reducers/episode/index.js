import createReducer from '../../actions/utils/createReducer'

import fetchPreset from '../presets/fetchPreset'
import editPreset from '../presets/editPreset'
import addSubtitlePreset from '../presets/addSubtitlePreset'
import removeSubtitlePreset from '../presets/removeSubtitlePreset'
import addVideoPreset from '../presets/addVideoPreset'
import removeVideoPreset from '../presets/removeVideoPreset'
import addVideoThumbnailPreset from '../presets/addVideoThumbnailPreset'
import removeVideoThumbnailPreset from '../presets/removeVideoThumbnailPreset'
import addStoryThumbnailPreset from '../presets/addStoryThumbnailPreset'
import removeStoryThumbnailPreset from '../presets/removeStoryThumbnailPreset'

const episode = createReducer('episode', [
  fetchPreset,
  editPreset,
  addSubtitlePreset,
  removeSubtitlePreset,
  addVideoPreset,
  removeVideoPreset,
  addVideoThumbnailPreset,
  removeVideoThumbnailPreset,
  addStoryThumbnailPreset,
  removeStoryThumbnailPreset
])

export const episodeReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_EPISODE_TIME':
      const episodesArray = []
      state.episodes.forEach((episodeElem) => {
        if (episodeElem.id !== action.episode && action.episode.id) {
          episodesArray.push(episodeElem)
        } else {
          episodesArray.push(action.episode)
        }
      })
      return {
        ...state,
        episodes: episodesArray
      }
    default:
      return episode.getReducer()(state, action)
  }
}

export default episode
