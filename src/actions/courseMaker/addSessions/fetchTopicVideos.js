import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../../duck'

const fetchTopicVideos = async (courseId) =>
  duck.query({
    query: gql`
    {
      videos(filter: { courses_some: { id: "${courseId}" } }) {
        id
        title
        courses {
          id
          title
        }
      }
    }
    `,
    type: 'videos/fetch',
    key: 'videos',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.videos = get(originalData, 'videos', [])
      return { ...extractedData }
    },
  })

export default fetchTopicVideos

