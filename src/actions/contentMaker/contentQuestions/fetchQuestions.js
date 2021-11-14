import gql from 'graphql-tag'
import { PRACTICE_QUESTION, QUIZ } from '../../../constants/CourseComponents'
import duck from '../../../duck'

const fetchQuestions = async ({ loId, key, filterOption, perPage, skip }) =>
  duck.query({
    query: gql`
    {
        questionBanks(
            filter: {
                and: [
                    ${key === PRACTICE_QUESTION ? `
                    { learningObjectives_some: { id: "${loId}" } }
                    { assessmentType: practiceQuestion }
                    ` : `
                    ${!filterOption ? '' : filterOption}
                    { assessmentType: quiz }
                    `}
                ]
            },
            ${perPage ? `first: ${perPage}` : ''}
            ${skip ? `skip: ${perPage * skip}` : ''}
            , orderBy: createdAt_DESC) {
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
        ${key === PRACTICE_QUESTION ? `questionBanksMeta(filter: {
            and: [
                { learningObjectives_some: { id: "${loId}" } }
                { assessmentType: practiceQuestion }
            ]
        }) {
            count
        }` : ''}
    }
    `,
    type: 'questionBanks/fetch',
    key: `questionBanks/${key}`,
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.questionBanks
        && originalData.questionBanks.length > 0) {
        data = originalData.questionBanks
      }
      extractedData.questionBanks = data
      extractedData.topic = []
      extractedData.course = []
      extractedData.learningObjectives = []
      return { ...extractedData }
    },
  })

export default fetchQuestions
