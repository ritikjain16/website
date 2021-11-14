import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchContentProject = async (key, filterOption) =>
  duck.query({
    query: gql`
{
  blockBasedProjects(
    filter: { and: [{ type: ${key} }, ${filterOption} ] }
    orderBy: createdAt_DESC
  ) {
    id
    title
    order
    difficulty
    status
    createdAt
    courses {
      id
      title
    }
    topics {
      id
      title
    }
    projectCreationDescription
    externalPlatformLink
    type
    isSubmitAnswer
    externalPlatformLogo {
      id
      uri
    }
    projectThumbnail {
      id
      uri
    }
    projectDescription
    answerDescription
  }
}
    `,
    type: 'blockBasedProjects/fetch',
    key,
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.blockBasedProjects
        && originalData.blockBasedProjects.length > 0) {
        data = originalData.blockBasedProjects
      }
      extractedData.blockBasedProjects = data
      extractedData.topic = []
      extractedData.course = []
      return { ...extractedData }
    },
  })

export default fetchContentProject

