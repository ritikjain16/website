import gql from 'graphql-tag'
import { HOMEWORK_ASSIGNMENT } from '../../../constants/CourseComponents'
import duck from '../../../duck'

const fetchAssignmentQuestions = async (filterQuery, componentName) =>
  duck.query({
    query: gql`
      {
        assignmentQuestions(
          filter: {
            and: [
              ${!filterQuery ? '' : filterQuery}
            ]
          }
          orderBy:createdAt_DESC
        ) {
          id
          order
          status
          statement
          hint
          difficulty
          isHomework
          questionCodeSnippet
          answerCodeSnippet
          explanation
          createdAt
          topics {
            id
            title
          }
          courses {
            id
            title
          }
        }
     }
    `,
    type: 'assignmentQuestions/fetch',
    key: `${componentName === HOMEWORK_ASSIGNMENT ? HOMEWORK_ASSIGNMENT : 'assignmentQuestions'}`,
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.assignmentQuestions
        && originalData.assignmentQuestions.length > 0) {
        data = originalData.assignmentQuestions
      }
      extractedData.assignmentQuestion = data
      extractedData.topic = []
      extractedData.course = []
      return { ...extractedData }
    },
  })

export default fetchAssignmentQuestions

