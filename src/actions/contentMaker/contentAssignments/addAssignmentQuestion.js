import gql from 'graphql-tag'
import { get } from 'lodash'
import { HOMEWORK_ASSIGNMENT } from '../../../constants/CourseComponents'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'


const addAssignmentQuestion = async ({ input, courseIds = [], componentName }) =>
  duck.query({
    query: gql`
      mutation($input: AssignmentQuestionInput!) {
        addAssignmentQuestion(input: $input,
          ${courseIds.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(courseIds)}]` : ''}) {
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
    variables: {
      input
    },
    type: 'assignmentQuestions/add',
    key: `${componentName === HOMEWORK_ASSIGNMENT ? HOMEWORK_ASSIGNMENT : 'assignmentQuestions'}`,
    changeExtractedData: (extractedData, originalData) => {
      extractedData.assignmentQuestion = {
        ...get(originalData, 'addAssignmentQuestion')
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default addAssignmentQuestion
