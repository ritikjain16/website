import gql from 'graphql-tag'
import { get } from 'lodash'
import addImageToProject from './addImageToProject'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'


const updateContentProject = async ({ input, projectId, key, selectedCourses = [],
  selectedTopics = [], externalPlatformLogo, projectThumbnail }) =>
  duck.query({
    query: gql`
    mutation($input: BlockBasedProjectUpdate) {
        updateBlockBasedProject(id: "${projectId}", input: $input,
        ${selectedCourses.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(selectedCourses)}]` : ''},
        ${selectedTopics.length > 0 ? `topicsConnectIds: [${getIdArrForQuery(selectedTopics)}]` : ''},
        ) {
            id
            title
            order
            difficulty
            status
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
    variables: {
      input
    },
    type: 'blockBasedProjects/update',
    key,
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'updateBlockBasedProject')) {
        let updatedProject = get(originalData, 'updateBlockBasedProject')
        let externalPlatformLogoData = null
        let projectThumbnailData = null
        if (externalPlatformLogo) {
          externalPlatformLogoData = await addImageToProject({
            file: externalPlatformLogo,
            projectId,
            typeField: 'externalPlatformLogo',
            prevFileId: get(updatedProject, 'externalPlatformLogo.id')
          })
          updatedProject = {
            ...updatedProject,
            externalPlatformLogo: externalPlatformLogoData
          }
        }
        if (projectThumbnail) {
          projectThumbnailData = await addImageToProject({
            file: projectThumbnail,
            projectId,
            typeField: 'projectThumbnail',
            prevFileId: get(updatedProject, 'projectThumbnail.id')
          })
          updatedProject = {
            ...updatedProject,
            projectThumbnail: projectThumbnailData
          }
        }
        extractedData.blockBasedProjects = {
          ...updatedProject
        }
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default updateContentProject
