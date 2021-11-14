import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { coursesFactory as actions } from '../../reducers/Courses'

const DELETE_COURSE = id => gql`
    mutation{
        deleteCourse(id:"${id}"){
            id
        }
    }
`

const deleteCourseLoading = (deletingCourseId) => ({
  type: actions.DELETE_LOADING,
  id: deletingCourseId
})
const deleteCourseSuccess = (deletedCourseId) => ({
  type: actions.DELETE_SUCCESS,
  id: deletedCourseId
})
const deleteCourseFailure = (deletingCourseError) => ({
  type: actions.DELETE_FAILURE,
  error: deletingCourseError
})

const deleteCourse = (id) => async dispatch => {
  try {
    dispatch(deleteCourseLoading(id))
    const { data } = await requestToGraphql(DELETE_COURSE(id))
    // deleted course object of form {id,title}
    const deletedCourse = get(data, 'deleteCourse', null)
    if (deletedCourse && deletedCourse.id) {
      dispatch(deleteCourseSuccess(deletedCourse.id))
      return deletedCourse
    }
    dispatch(deleteCourseFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(deleteCourseFailure(error))
  }
  return {}
}

export default deleteCourse
