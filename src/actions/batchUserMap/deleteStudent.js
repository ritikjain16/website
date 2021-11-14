import gql from 'graphql-tag'
import duck from '../../duck'

const deleteStudent = async (studentId, batchId) =>
  duck.query({
    query: gql`
      mutation{
        removeFromBatchStudentProfile(studentProfileId: "${studentId}", batchId: "${batchId}"){
          batch{
            id
          }
        }
      }
    `,
    type: 'users/delete',
    key: 'deleteStudent'
  })

export default deleteStudent
