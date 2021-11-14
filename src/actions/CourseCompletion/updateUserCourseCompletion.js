import gql from 'graphql-tag'
import duck from '../../duck'

const updateUserCourseCompletion = async (id, input) =>
  duck.query({
    query: gql`
      mutation{
        updateUserCourseCompletion(
          input: ${input}
          id: "${id}"
        ) {
            id
        }
      }
    `,
    type: 'userCourseCompletions/update',
    key: 'userCourseCompletions',
  })

export default updateUserCourseCompletion
