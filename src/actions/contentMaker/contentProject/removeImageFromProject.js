import gql from 'graphql-tag'
import duck from '../../../duck'

const removeImageFromProject = async (projectId, fileId, externalPlatformLogo) => duck.query({
  query: gql`
  mutation {
${
  !externalPlatformLogo ? `
  removeFromBlockBasedProjectThumbnail(blockBasedProjectId: "${projectId}", fileId: "${fileId}") {
    blockBasedProject {
      id
    }
  }
  ` : `
  removeFromBlockBasedProjectExternalPlatformLogo(
    blockBasedProjectId: "${projectId}"
    fileId: "${fileId}"
  ) {
    blockBasedProject {
      id
    }
  }
  `
}
}
  `,
  type: 'blockBasedProjects/delete',
  key: !externalPlatformLogo ? 'removeFromBlockBasedProjectThumbnail' : 'removeFromBlockBasedProjectExternalPlatformLogo',
})

export default removeImageFromProject
