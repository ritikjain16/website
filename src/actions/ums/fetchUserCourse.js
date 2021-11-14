import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchUserCourse = async (userIds = []) =>
  duck.query({
    query: gql`
      {
        userCourses(filter: { user_some: {id_in: [${userIds}]} }) {
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
    type: 'userCourses/fetch',
    key: 'userCourses',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.user = []
      extractedData.userCourses = get(originalData, 'userCourses', [])
      return { ...extractedData }
    }
  })

export default fetchUserCourse

