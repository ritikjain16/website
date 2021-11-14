import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const addUserCourse = async ({ userConnectId, coursesConnectIds = [] }) =>
  duck.query({
    query: gql`
    mutation {
        addUserCourse(userConnectId: "${userConnectId}", coursesConnectIds: [${getIdArrForQuery(coursesConnectIds)}], input: {}) {
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
    type: 'userCourses/add',
    key: 'userCourses',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.user = []
      extractedData.userCourses = {
        ...get(originalData, 'addUserCourse')
      }
      return { ...extractedData }
    }
  })

export default addUserCourse
