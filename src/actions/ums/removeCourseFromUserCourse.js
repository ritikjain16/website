import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const removeCourseFromUserCourse = async ({ userCourseId, courseId }) =>
  duck.query({
    query: gql`
    mutation {
        removeFromCourseUserCourse(userCourseId: "${userCourseId}", courseId: "${courseId}") {
          userCourse {
            id
            user {
            id
            }
            courses {
            id
            title
            minGrade
            maxGrade
            }
          }
        }
    }
    `,
    type: 'userCourses/update',
    key: 'userCourses',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.user = []
      extractedData.userCourses = {
        ...get(originalData, 'removeFromCourseUserCourse.updateUserCourse')
      }
      return { ...extractedData }
    }
  })

export default removeCourseFromUserCourse
