import gql from 'graphql-tag'
import duck from '../../duck'

const addBatchSession = (input, batchConnectId, topicConnectId,
  mentorSessionConnectId, courseConnectId) => (
  duck.query({
    query: gql`
          mutation ($input: BatchSessionInput!) {
   addBatchSession(input: $input, 
    batchConnectId: "${batchConnectId}",
    topicConnectId: "${topicConnectId}",
    mentorSessionConnectId:"${mentorSessionConnectId}",
    ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
    ) {
     id
   }
 }
        `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'batchSessions/add',
    key: 'batchSessions'
  })
)

export default addBatchSession
