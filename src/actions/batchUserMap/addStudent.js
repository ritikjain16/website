import gql from 'graphql-tag'
import duck from '../../duck'

const addStudent = async (studentId, batchId) => {
  const studentIds = JSON.stringify(studentId)
  duck.query({
    query: gql`
      mutation{
        updateBatch(id:"${batchId}", studentsConnectIds:${studentIds}){
          id
          code
        }
      }
    `,
    variables: {
      callBatchAPI: true
    },
    type: 'users/add',
    key: 'addStudent'
  })
}
export default addStudent
