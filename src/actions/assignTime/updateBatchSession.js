import gql from 'graphql-tag'
import duck from '../../duck'

const updateBatchSession = (batchSessionId,
  input,
  topicId,
  courseConnectId,
  mentorSessConnectId) => {
  duck.query({
    query: gql`
        mutation updateBatchSession($input: BatchSessionUpdate){
 updateBatchSession(
  input: $input,
  id:"${batchSessionId}",
  topicConnectId: "${topicId}",
  ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''},
  ${mentorSessConnectId ? `mentorSessionConnectId: "${mentorSessConnectId}"` : ''}
) {
   id
}
}
        `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'batchSessions/update',
    key: 'batchSessions'
  })
}

export default updateBatchSession
