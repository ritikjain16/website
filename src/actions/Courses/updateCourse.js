import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { coursesFactory as actions } from '../../reducers/Courses'
import uploadFile from '../utils/uploadFile'

const EDIT_COURSE = id => gql`
    mutation($input:CourseUpdate){
        updateCourse(id:"${id}",input:$input){
            id
            order
            title
            description
            category
            createdAt
            updatedAt
            status
        }
    }
`

const editCourseLoading = (editingCourseId) => ({
  type: actions.EDIT_LOADING,
  id: editingCourseId
})
const editCourseSuccess = (editedCourse) => ({
  type: actions.EDIT_SUCCESS,
  id: editedCourse.id,
  course: editedCourse
})
const editCourseFailure = (editingCourseId, editingCourseError) => ({
  type: actions.EDIT_FAILURE,
  id: editingCourseId,
  error: editingCourseError
})

const editCourse = ({ file, fileBucket, id, ...input }) => async dispatch => {
  try {
    dispatch(editCourseLoading(id))
    const { data } = await requestToGraphql(EDIT_COURSE(id), { input })
    const editedCourse = get(data, 'updateCourse', null)

    if (editedCourse && editedCourse.id) {
      // if file is present upload or just dispatch success with updated course
      if (file) {
        const fileInput = {
          fileBucket
        }
        const mappingInfo = {
          type: 'Course',
          typeField: 'thumbnail',
          typeId: editedCourse.id
        }
        // upload the file if new thumbnail is provided
        const uploadedFile = await uploadFile(file, fileInput, mappingInfo)
        if (uploadedFile && uploadedFile.id) {
          // add the thumbnail info to the updated course object
          const editedCourseWithFileInfo = { ...editedCourse, thumbnail: uploadedFile }
          dispatch(editCourseSuccess(editedCourseWithFileInfo))
          return editedCourseWithFileInfo
        }
      }

      dispatch(editCourseSuccess(editedCourse))
      return editedCourse
    }
    dispatch(editCourseFailure(id, errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editCourseFailure(id, error))
  }
  return {}
}

export default editCourse
