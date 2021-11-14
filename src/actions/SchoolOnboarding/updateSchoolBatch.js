import gql from 'graphql-tag'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'


const updateSchoolBatch = async ({ batchId, mentorId, studentIds }) =>
  duck.query({
    query: gql`
      mutation {
        updateBatch(
            id: "${batchId}",
            ${studentIds ? `studentsConnectIds: [${getIdArrForQuery(studentIds)}]` : ''}
            ${mentorId ? `allottedMentorConnectId: "${mentorId}"` : ''}
            , input:{}) {
            id
        }
    }
    `,
    variables: {
      callBatchAPI: true
    },
    type: 'batch/update',
    key: 'batchesData',
  })

export default updateSchoolBatch
