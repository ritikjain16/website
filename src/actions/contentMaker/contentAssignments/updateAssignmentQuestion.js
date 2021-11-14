import gql from 'graphql-tag'
import { get } from 'lodash'
import { HOMEWORK_ASSIGNMENT } from '../../../constants/CourseComponents'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'


const updateAssignmentQuestion = async ({ assignmentId, input, selectedCourses = [],
  selectedTopics = [], componentName }) =>
  duck.query({
    query: gql`
    mutation($input: AssignmentQuestionUpdate) {
      updateAssignmentQuestion(id: "${assignmentId}", input: $input,
      ${selectedCourses.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(selectedCourses)}]` : ''},
      ${selectedTopics.length > 0 ? `topicsConnectIds: [${getIdArrForQuery(selectedTopics)}]` : ''}
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
    type: 'assignmentQuestions/update',
    key: `${componentName === HOMEWORK_ASSIGNMENT ? HOMEWORK_ASSIGNMENT : 'assignmentQuestions'}`,
    changeExtractedData: (extractedData, originalData) => {
      extractedData.assignmentQuestion = {
        ...get(originalData, 'updateAssignmentQuestion')
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default updateAssignmentQuestion
