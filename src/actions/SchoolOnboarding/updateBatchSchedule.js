import gql from 'graphql-tag'
import duck from '../../duck'


const updateBatchSchedule = async ({ batchId, input }) =>
  duck.query({
    query: gql`
      mutation($input: BatchUpdate) {
        updateBatch(id: "${batchId}", input: $input) {
            id
        }
    }
    `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'batch/update',
    key: 'batchesData',
  })

export default updateBatchSchedule
