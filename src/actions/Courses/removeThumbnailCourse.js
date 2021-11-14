import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { coursesFactory as actions } from '../../reducers/Courses'

const REMOVE_THUMBNAIL = (courseId, thumbnailId) => gql`
    mutation{
        removeFromCourseThumbnail(courseId:"${courseId}",fileId:"${thumbnailId}"){
            course{
                id
            }
        }
    }

`

const removeThumbnailLoading = (id) => ({
  type: actions.REMOVE_THUMBNAIL_LOADING,
  id
})
const removeThumbnailSuccess = (id) => ({
  type: actions.REMOVE_THUMBNAIL_SUCCESS,
  id
})
const removeThumbnailFailure = (error) => ({
  type: actions.REMOVE_THUMBNAIL_FAILURE,
  error
})

const removeFromCourseThumbnail = (courseId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeThumbnailLoading(courseId))
    const { data } = await requestToGraphql(REMOVE_THUMBNAIL(courseId, thumbnailId))
    const removedFromCourseId = get(data, 'removeFromCourseThumbnail.course.id', null)
    if (removedFromCourseId) {
      dispatch(removeThumbnailSuccess(removedFromCourseId))
      return removedFromCourseId
    }
    dispatch(removeThumbnailFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeThumbnailFailure(error))
  }
  return {}
}

export default removeFromCourseThumbnail
