import gql from 'graphql-tag'
import duck from '../../duck'

const updateAssignment = async (input, id) => duck.query({
  query: gql`
    mutation($input:AssignmentQuestionUpdate!){
      updateAssignmentQuestion(id: "${id}",input:$input){
          id
          order
          statement
          difficulty
          hint
          questionCodeSnippet
          answerCodeSnippet
          explanation
          createdAt
          isHomework
          updatedAt
          status
          topic{
              id
              title
          }
      }
    }
  `,
  variables: {
    input
  },
  type: 'assignmentQuestion/update',
  key: 'updateAssignmentQuestion'
})

export default updateAssignment
