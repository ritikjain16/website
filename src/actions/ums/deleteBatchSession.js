import gql from 'graphql-tag'
import duck from '../../duck'

const deleteBatchSession = async (batchSessionId) => duck.query({
  query: gql`
    mutation {
      deleteBatchSession(id: "${batchSessionId}") {
        id
      }
    }
  `,
  variables: {
    callBatchAPI: true
  },
  type: 'batchSessions/delete',
  key: 'batchSessions'
})

export default deleteBatchSession

