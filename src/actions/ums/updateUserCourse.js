import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const updateUserCourse = async ({ userCourseId, coursesConnectIds }) =>
  duck.query({
    query: gql`
    mutation {
        updateUserCourse(id:"${userCourseId}", coursesConnectIds: [${getIdArrForQuery(coursesConnectIds)}], input: {}) {
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
    `,
    type: 'userCourses/update',
    key: 'userCourses',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.user = []
      extractedData.userCourses = {
        ...get(originalData, 'updateUserCourse')
      }
      return { ...extractedData }
    }
  })

export default updateUserCourse
