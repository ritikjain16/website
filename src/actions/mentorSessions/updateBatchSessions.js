import gql from 'graphql-tag'
import duck from '../../duck'

const getAdditionalFilter = (sessionConnectId) => {
  if (sessionConnectId) {
    return `mentorSessionConnectId: "${sessionConnectId}",`
  }
  return ''
}

const updateBatchSession = (batchSessionId, input, sessionConnectId) => (
  duck.query({
    query: gql`
        mutation updateBatchSession($input: BatchSessionUpdate){
        updateBatchSession(
          input: $input,
          id:"${batchSessionId}",
          ${getAdditionalFilter(sessionConnectId)}
        ) {
          id
          sessionStatus
        }
        }
        `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'mentorSessions/update',
    key: 'updateBatchSession'
  })
)

export default updateBatchSession
