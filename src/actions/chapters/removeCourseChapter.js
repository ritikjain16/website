import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import getActionsError from '../../utils/getActionsError'

const REMOVE_COURSE_CHAPTER_QUERY = (chapterId, courseId) => gql`
  mutation {
    removeFromCourseChapter(
        chapterId: "${chapterId}",
       courseId:"${courseId}"
    ) {
        chapter {
        id,
        courses{
            id
        }
      }
    }
  }
`

const removeThumbnailChapter = (chapterId, courseId) => async () => {
  try {
    const { data } = await requestToGraphql(
      REMOVE_COURSE_CHAPTER_QUERY(chapterId, courseId)
    )
    const coursesMappedToChapter = get(data, 'removeFromCourseChapter.chaptersChapter.courses', null)
    if (Array.isArray(coursesMappedToChapter)) {
      return coursesMappedToChapter
    }
    return null
  } catch (e) {
    const error = getActionsError(e)
    return error
  }
}

export default removeThumbnailChapter
