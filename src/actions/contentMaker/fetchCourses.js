import gql from 'graphql-tag'
import duck from '../../duck'

const fetchContentCourses = async () =>
  duck.query({
    query: gql`
    {
      courses {
        id
        title
        topics {
          id
          title
        }
      }
    }
    `,
    type: 'courses/fetch',
    key: 'courses',
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.courses
        && originalData.courses.length > 0) {
        data = originalData.courses
      }
      extractedData.course = data
      extractedData.topic = []
      return { ...extractedData }
    },
  })

export default fetchContentCourses

