import gql from 'graphql-tag'
import duck from '../../duck'


const addBatch = async (input, courseConnectId, allottedMentorConnectId) =>
  duck.query({
    query: gql`
      mutation($input: BatchInput!) {
        addBatch(
          input: $input
          courseConnectId: "${courseConnectId}"
          allottedMentorConnectId: "${allottedMentorConnectId}"
        ) {
          id
          course {
            createdAt
            updatedAt
          }
          code
          type
          description
          studentsMeta {
            count
          }
          allottedMentor {
            name
          }
          currentComponent {
            currentTopic {
              title
              order
            }
          }
        }
      }
    `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'batch/add',
    key: 'batches',
  })

export default addBatch
