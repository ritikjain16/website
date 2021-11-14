import gql from 'graphql-tag'
import duck from '../../duck'

const fetchAssignments = async (id) => duck.query({
  query: gql`
    query{
      assignmentQuestions(filter:{
          topics_some:{
              id: "${id}"
          }
      }){
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
          topics{
              id
              title
          }
      }assignmentQuestionsMeta(filter:{
        topics_some:{
          id: "${id}"
        }
      }){
        count
      }
    }
  `,
  type: 'assignmentQuestion/fetch',
  key: 'assignmentQuestion'
})

export default fetchAssignments
