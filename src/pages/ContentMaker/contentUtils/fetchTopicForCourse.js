import gql from 'graphql-tag'
import requestToGraphql from '../../../utils/requestToGraphql'

const fetchtopicForCourse = async (courseId) => {
  const data = await requestToGraphql(gql`
  {
    course(id: "${courseId}") {
      topics {
        id
      }
    }
  }
  `)
  return data
}

export default fetchtopicForCourse
