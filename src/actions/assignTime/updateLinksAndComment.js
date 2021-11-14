import gql from 'graphql-tag'
import duck from '../../duck'

const updateBatchSession = (batchSessionId, input) => {
  duck.query({
    query: gql`
      mutation updateBatchSession($input: BatchSessionUpdate){
        updateBatchSession(
          input: $input,
          id:"${batchSessionId}"
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
