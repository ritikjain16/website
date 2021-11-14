import gql from 'graphql-tag'
import duck from '../../duck'

const addAssignment = async (input, id) => duck.query({
  query: gql`
    mutation($input:AssignmentQuestionInput!){
      addAssignmentQuestion(topicConnectId:"${id}",input:$input){
          id
          order
          statement
          difficulty
          hint
          questionCodeSnippet
          answerCodeSnippet
          explanation
          createdAt
          updatedAt
          status
          isHomework
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
  type: 'assignmentQuestion/add',
  key: 'addAssignmentQuestion'
})

export default addAssignment
