import gql from 'graphql-tag'
import { get } from 'lodash'
import { QUIZ } from '../../../constants/CourseComponents'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'

const updateQuestionBank = async ({ questionId, input, key, coursesId = [],
  loIds = [], topicIds = [], tagsConnectIds = [] }) =>
  duck.query({
    query: gql`
    mutation($input: QuestionBankUpdate) {
      updateQuestionBank(id: "${questionId}",
      ${coursesId.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(coursesId)}]` : ''}
      ${topicIds.length > 0 ? `topicsConnectIds: [${getIdArrForQuery(topicIds)}]` : ''}
      ${loIds.length > 0 ? `learningObjectivesConnectIds: [${getIdArrForQuery(loIds)}]` : ''}
      ${tagsConnectIds.length > 0 ? `tagsConnectIds: [${getIdArrForQuery(tagsConnectIds)}]` : ''}
      input: $input) {
        id
        ${key === QUIZ ? `
          courses {
              id
              title
          }
          ` : ''}
        topics {
          id
          title
        }
        order
        statement
        hint
        hints{
            hint
            hintPretext
        }
        tags {
            id
            title
        }
        questionType
        questionLayoutType
        difficulty
        assessmentType
        questionCodeSnippet
        answerCodeSnippet
        explanation
        mcqOptions {
            statement
            isCorrect
            blocksJSON
            initialXML
        }
        fibBlocksOptions {
            displayOrder
            statement
            correctPositions
        }
        fibInputOptions {
            correctPosition
            answers
        }
        arrangeOptions {
            displayOrder
            statement
            correctPosition
            correctPositions
        }
        learningObjectives {
            id
            title
        }
        createdAt
        status
      }
    }
    `,
    variables: {
      input
    },
    type: 'questionBanks/update',
    key: `questionBanks/${key}`,
    changeExtractedData: (extractedData, originalData) => {
      extractedData.questionBanks = {
        ...get(originalData, 'updateQuestionBank')
      }
      extractedData.topic = []
      extractedData.course = []
      extractedData.learningObjectives = []
      return extractedData
    },
  })

export default updateQuestionBank