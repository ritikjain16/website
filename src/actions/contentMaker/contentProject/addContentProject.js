import gql from 'graphql-tag'
import { get } from 'lodash'
import { addImageToProject } from '..'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'


const addContentProject = async ({ input, key, selectedCourses = [],
  externalPlatformLogo, projectThumbnail }) =>
  duck.query({
    query: gql`
    mutation($input: BlockBasedProjectInput!) {
        addBlockBasedProject(input: $input,
          ${selectedCourses.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(selectedCourses)}]` : ''}) {
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
    type: 'blockBasedProjects/add',
    key,
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'addBlockBasedProject')) {
        const projectId = get(originalData, 'addBlockBasedProject.id')
        let newProject = get(originalData, 'addBlockBasedProject')
        let externalPlatformLogoData = null
        let projectThumbnailData = null
        if (externalPlatformLogo) {
          externalPlatformLogoData = await addImageToProject({
            file: externalPlatformLogo,
            projectId,
            typeField: 'externalPlatformLogo'
          })
          newProject = {
            ...newProject,
            externalPlatformLogo: externalPlatformLogoData
          }
        }
        if (projectThumbnail) {
          projectThumbnailData = await addImageToProject({
            file: projectThumbnail,
            projectId,
            typeField: 'projectThumbnail',
          })
          newProject = {
            ...newProject,
            projectThumbnail: projectThumbnailData
          }
        }
        extractedData.blockBasedProjects = {
          ...newProject
        }
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default addContentProject
