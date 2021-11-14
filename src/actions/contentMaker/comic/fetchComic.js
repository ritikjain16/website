import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchComics = async (loId) =>
  duck.query({
    query: gql`
    {
    comicStrips(filter: { learningObjectives_some: { id: "${loId}" } }) {
      id
      title
      description
      status
      learningObjectives {
        id
      }
      comicImages {
        id
        image {
          id
          uri
        }
        order
      }
    }
    }
    `,
    type: 'comicStrips/fetch',
    key: 'comicStrips',
    changeExtractedData: (extractedData, originalData) => {
      if (originalData && originalData.comicStrips) {
        extractedData.comicStrips = originalData.comicStrips
      }
      return { ...extractedData }
    },
  })

export default fetchComics

