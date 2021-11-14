import {
  COUNT_DASHBOARD_LOADING,
  COUNT_DASHBOARD_SUCCESS,
  COUNT_DASHBOARD_FAILURE
} from '../../actions/dashboard/fetchDashboard'

const initialState = {
  dashboard: {},
  isFetching: false
}

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case COUNT_DASHBOARD_LOADING:
      return { ...state,
        isFetching: true
      }
    case COUNT_DASHBOARD_SUCCESS:
      return { ...state,
        dashboard: action.dashboard,
        isFetching: false
      }
    case COUNT_DASHBOARD_FAILURE:
      return { ...state,
        fetchError: action.error,
        isFetching: false
      }
    default:
      return state
  }
}

export default dashboard

// import createReducer from '../../actions/utils/createReducer'
// import fetchPreset from '../presets/fetchPreset'

// export const dashboard = createReducer('dashboard', [
//   fetchPreset
// ])

// export default dashboard.getReducer()
