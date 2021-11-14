import gql from 'graphql-tag'
import duck from '../../duck'

const deleteAssignment = async (id) => duck.query({
  query: gql`
    mutation{
      deleteAssignmentQuestion(id: "${id}"){
          id
      }
    }
  `,
  type: 'assignmentQuestion/delete',
  key: 'deleteAssignmentQuestion'
})

export default deleteAssignment
