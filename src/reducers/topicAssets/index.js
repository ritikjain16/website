import {
  TOPIC_ASSETS_LOADING,
  TOPIC_ASSETS_SUCCESS,
  TOPIC_ASSETS_FAILURE
} from '../../actions/topicAssets/fetchTopicAssets'

const initialState = {
  topicAssets: [],
  isFetching: false,
  tafetchError: null
}

const topicAssetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOPIC_ASSETS_LOADING:
      return { ...state,
        isFetching: true
      }
    case TOPIC_ASSETS_SUCCESS:
      return { ...state, topicAssets: action.topicAssets, isFetching: false }
    case TOPIC_ASSETS_FAILURE:
      return { ...state,
        tafetchError: action.error,
        isFetching: false
      }
    default:
      return state
  }
}

export default topicAssetsReducer
