import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchVideoContent = async (perPage = 10, skip = 0, filterOption) =>
  duck.query({
    query: gql`
    {
        videos(
          filter: { and: [${!filterOption ? '' : filterOption}] }
          first: ${perPage}
          skip: ${perPage * skip}
          orderBy: createdAt_DESC
          ) {
            id
            status
            courses {
              id
              title
            }
            topics {
              id
              title
            }
            videoFile {
            id
            uri
            }
            title
            description
            subtitle {
            id
            uri
            }
            thumbnail {
            id
            uri
            }
            videoStartTime
            videoEndTime
            storyStartTime
            storyEndTime
            storyThumbnail {
            id
            uri
            }
            createdAt
        }
    }
    `,
    type: 'videos/fetch',
    key: 'videos',
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.videos
        && originalData.videos.length > 0) {
        data = originalData.videos
      }
      extractedData.videos = data
      extractedData.topic = []
      extractedData.course = []
      return { ...extractedData }
    },
  })

export default fetchVideoContent

