import gql from 'graphql-tag'
import { QUIZ } from '../../../constants/CourseComponents'
import duck from '../../../duck'

const updateQuestionBanks = async ({ input, key }) =>
  duck.query({
    query: gql`
    mutation($input: [QuestionBanksUpdate]!) {
      updateQuestionBanks(input: $input) {
        id
        ${key === QUIZ ? `
          courses {
              id
              title
          }
          ` : ''}
        topics {
          id
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
    key: `questionBanksUpdate/${key}`,
  })

export default updateQuestionBanks
