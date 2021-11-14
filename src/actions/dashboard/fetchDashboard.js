import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'


export const COUNT_DASHBOARD_LOADING = 'COUNT_DASHBOARD_LOADING'
export const COUNT_DASHBOARD_SUCCESS = 'COUNT_DASHBOARD_SUCCESS'
export const COUNT_DASHBOARD_FAILURE = 'COUNT_DASHBOARD_FAILURE'

const COUNT_DASHBOARD = courseId => gql`
{
  pub_topics: topicsMeta(filter: {AND: [{chapter_some: {courses_some: {id: "${courseId}"}}}, {status: published}]}) {
    count
  }
  pub_chapters: chaptersMeta(filter: {AND: [{courses_some: {id: "${courseId}"}}, {status: published}]}) {
    count
  }
  pub_LO: learningObjectivesMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: published}]}) {
    count
  }
  pub_pq: questionBanksMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {assessmentType: practiceQuestion}, {status: published}]}) {
    count
  }
  pub_quiz: questionBanksMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {assessmentType: quiz}, {status: published}]}) {
    count
  }
  unpub_topics: topicsMeta(filter: {AND: [{chapter_some: {courses_some: {id: "${courseId}"}}}, {status: unpublished}]}) {
    count
  }
  unpub_chapters: chaptersMeta(filter: {AND: [{courses_some: {id: "${courseId}"}}, {status: unpublished}]}) {
    count
  }
  unpub_LO: learningObjectivesMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: unpublished}]}) {
    count
  }
  unpub_pq: questionBanksMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {assessmentType: practiceQuestion}, {status: unpublished}]}) {
    count
  }
  unpub_quiz: questionBanksMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {assessmentType: quiz}, {status: unpublished}]}) {
    count
  }
  unpub_assignment: assignmentQuestionsMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: unpublished}]}) {
    count
  }
  pub_assignment: assignmentQuestionsMeta(filter: {AND: [{topics_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: published}]}) {
    count
  }
  pub_cheatSheet: cheatSheetsMeta(filter: {AND: [{topic_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: published}]}) {
    count
  }
  unpub_cheatSheet: cheatSheetsMeta(filter: {AND: [{topic_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: published}]}) {
    count
  }
  pub_badges: badgesMeta(filter: {AND: [{topic_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: published}]}) {
    count
  }
  unpub_badges: badgesMeta(filter: {AND: [{topic_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: unpublished}]}) {
    count
  }
  pub_workbooks: workbooksMeta(filter: {AND: [{topic_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: published}]}) {
    count
  }
  unpub_workbooks: workbooksMeta(filter: {AND: [{topic_some: {chapter_some: {courses_some: {id: "${courseId}"}}}}, {status: unpublished}]}) {
    count
  }
}
`

const dashboardLoading = () => ({
  type: COUNT_DASHBOARD_LOADING
})

const dashboardSuccess = (dashboard) => ({
  type: COUNT_DASHBOARD_SUCCESS,
  dashboard
})

const dashboardFailure = error => ({
  type: COUNT_DASHBOARD_FAILURE,
  error
})

const isObject = obj => obj === Object(obj)

const fetchDashboard = (courseId) => async dispatch => {
  try {
    dispatch(dashboardLoading())
    const { data } = await requestToGraphql(COUNT_DASHBOARD(courseId))
    if (isObject(data)) {
      dispatch(dashboardSuccess(data))
      return data
    }
    dispatch(dashboardFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(dashboardFailure(error))
  }
  return {}
}
export default fetchDashboard

// import gql from 'graphql-tag'
// import { message as notify } from 'antd'
// import { dashboard as actions } from '../.."/reducers/dashboard'
// import requestToGraphql from '../../utils/requestToGraphql'
// import getActionsError from '../../utils/getActionsError'
// import errors from '../../constants/errors'

// const FETCH_DASHBOARD_QUERY = courseId => gql`{
//   topicsMeta(filter: {AND: [{chapter_some: {courses_some: {id: "${courseId}"}}}]}) {
//     count
//   }
//   chaptersMeta(filter: {AND: [{courses_some: {id: "${courseId}"}}]}) {
//     count
//   }

//     count
//   }

//     count
//   }

//     count
//   }
// }
// `

// const fetchDashboardLoading = () => ({
//   type: actions.FETCH_LOADING
// })

// const fetchDashboardSuccess = dashboard => ({
//   type: actions.FETCH_SUCCESS,
//   dashboards: dashboard
// })

// const fetchDashboardFailure = error => ({
//   type: actions.FETCH_FAILURE,
//   error
// })

// const fetchDashboard = courseId => async dispatch => {
//   try {
//     dispatch(fetchDashboardLoading())
//     const { data } = await requestToGraphql(FETCH_DASHBOARD_QUERY(courseId))
//     if (data) {
//       console.log(777777, data)
//       dispatch(fetchDashboardSuccess(data))
//       return data
//     }
//     dispatch(fetchDashboardFailure(errors.EmptyDataError))
//   } catch (e) {
//     const error = getActionsError(e)
//     notify.error(error)
//     dispatch(fetchDashboardFailure(error))
//   }
//   return {}
// }

// export default fetchDashboard
