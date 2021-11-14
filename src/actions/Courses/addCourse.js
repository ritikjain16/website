import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { coursesFactory as actions } from '../../reducers/Courses'
import uploadFile from '../utils/uploadFile'

const defaultChapterCount = 0
const ADD_COURSE = gql`
    mutation($input: CourseInput!){
        addCourse(input:$input){
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
const addCourseLoading = () => ({
  type: actions.ADD_LOADING
})
const addCourseSuccess = (course) => ({
  type: actions.ADD_SUCCESS,
  course
})
const addCourseFailure = (error) => ({
  type: actions.ADD_FAILURE,
  error
})
const addCourse = ({ file, fileBucket, ...input }) => async dispatch => {
  try {
    dispatch(addCourseLoading())
    const { data } = await requestToGraphql(ADD_COURSE, { input })
    const addedCourse = get(data, 'addCourse', null)
    // Adding default meta count for course
    const addedCourseWithMeta = {
      ...addedCourse,
      chaptersMeta: {
        count: defaultChapterCount
      }
    }
    if (addedCourseWithMeta.id) {
      // if thumbnail is present upload
      if (file) {
        const fileInput = {
          fileBucket
        }
        const mappingInfo = {
          type: 'Course',
          typeField: 'thumbnail',
          typeId: addedCourseWithMeta.id
        }
        // upload file and connect to course
        const uploadedFile = await uploadFile(file, fileInput, mappingInfo)
        if (uploadedFile && uploadedFile.id) {
          // Adding the file info the course object
          const addedCourseWithFileInfo = { ...addedCourseWithMeta, thumbnail: uploadedFile }
          dispatch(addCourseSuccess(addedCourseWithFileInfo))
          return addedCourseWithFileInfo
        }
      }
      // if thumbnail is not present
      dispatch(addCourseSuccess(addedCourseWithMeta))
      return addedCourseWithMeta
    }
    dispatch(addCourseFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addCourseFailure(error))
  }
  return {}
}

export default addCourse
