import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchMessageQuestionAndComic = async (courseId) =>
  duck.query({
    query: gql`
    {
      learningObjectives(
        filter: { courses_some: { id: "${courseId}" } }
      ) {
        id
        title
        courses{
          id
          title
        }
      }
    }
    `,
    type: 'learningObjectives/fetch',
    key: 'learningObjectives',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      if (originalData && originalData.learningObjectives) {
        extractedData.learningObjectives = originalData.learningObjectives
      }
      return { ...extractedData }
    },
  })

export default fetchMessageQuestionAndComic
