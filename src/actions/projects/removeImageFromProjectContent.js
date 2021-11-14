import gql from 'graphql-tag'
import duck from '../../duck'

const removeImageFromProjectContent = async (projectConnectId, fileId) => duck.query({
  query: gql`
    mutation {
    removeFromProjectImage(projectContentId: "${projectConnectId}", fileId: "${fileId}") {
        projectContent {
        id
        }
    }
    }
  `,
  type: 'projectContentImage/delete',
  key: 'removeFromProjectImage',
})

export default removeImageFromProjectContent
