import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteAssignmentQuestion = async (id) => duck.query({
  query: gql`
    mutation {
        deleteAssignmentQuestion(id: "${id}") {
            id
        }
    }
  `,
  type: 'assignmentQuestions/delete',
  key: 'assignmentQuestions',
})

export default deleteAssignmentQuestion
