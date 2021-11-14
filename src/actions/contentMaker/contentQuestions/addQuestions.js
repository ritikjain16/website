import gql from 'graphql-tag'
import { get } from 'lodash'
import { QUIZ } from '../../../constants/CourseComponents'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'

const addQuestionBank = async ({ learningObjectiveConnectId = [], input, key,
  coursesId = [], tagsConnectIds = [] }) =>
  duck.query({
    query: gql`
      mutation($input: QuestionBankInput!) {
        addQuestionBank(input: $input,
          ${learningObjectiveConnectId.length > 0 ? `learningObjectivesConnectIds:[${getIdArrForQuery(learningObjectiveConnectId)}]` : ''}
          ${coursesId.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(coursesId)}]` : ''}
          ${tagsConnectIds.length > 0 ? `tagsConnectIds: [${getIdArrForQuery(tagsConnectIds)}]` : ''}
          ) {
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
    type: 'questionBanks/add',
    key: `questionBanks/${key}`,
    changeExtractedData: (extractedData, originalData) => {
      extractedData.questionBanks = {
        ...get(originalData, 'addQuestionBank')
      }
      extractedData.topic = []
      extractedData.course = []
      extractedData.learningObjectives = []
      return extractedData
    },
  })

export default addQuestionBank
