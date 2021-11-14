import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../../duck'

const fetchQuizQuestion = async (courseId) =>
  duck.query({
    query: gql`
    {
      questionBanks(
        filter: {
          and: [
            { assessmentType: quiz }
            { learningObjectives_some: { courses_some: { id: "${courseId}" } } }
          ]
        }
      ) {
        id
        statement
        courses{
          id
          title
        }
      }
    }
    `,
    type: 'questionBanks/fetch',
    key: 'questionBanks',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.questionBanks = get(originalData, 'questionBanks') || []
      return { ...extractedData }
    },
  })

export default fetchQuizQuestion

