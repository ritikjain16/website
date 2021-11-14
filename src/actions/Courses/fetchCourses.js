import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { coursesFactory as actions } from '../../reducers/Courses'

const FETCH_COURSES = gql`
    query{
        courses(orderBy:order_ASC){
            id
            order
            title
            description
            createdAt
            updatedAt
            category
            thumbnail{
                id
                name
                uri
                signedUri
            }
            status
            chaptersMeta{
                count
            }
        }
    }
`

const fetchCoursesLoading = () => ({
  type: actions.FETCH_LOADING
})
const fetchCoursesSuccess = (courses) => ({
  type: actions.FETCH_SUCCESS,
  courses
})
const fetchCoursesFailure = (error) => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchCourses = () => async dispatch => {
  try {
    dispatch(fetchCoursesLoading())
    const { data } = await requestToGraphql(FETCH_COURSES)
    // courses:array of course objects
    const courses = get(data, 'courses', [])
    if (Array.isArray(courses)) {
      dispatch(fetchCoursesSuccess(courses))
      return courses
    }
    dispatch(fetchCoursesFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchCoursesFailure(error))
  }
  return {}
}

export default fetchCourses
