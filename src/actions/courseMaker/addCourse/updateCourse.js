import gql from 'graphql-tag'
import { get } from 'lodash'
import addImageToCourse from './addImageToCourse'
import duck from '../../../duck'


const updateCourse = async ({ courseId, input, thumbnailFile, bannerFile }) =>
  duck.query({
    query: gql`
      mutation($input: CourseUpdate) {
        updateCourse(id: "${courseId}", input: $input) {
            id
            title
            description
            category
            status
            order
            minGrade
            maxGrade
            bannerTitle
            bannerDescription
            secondaryCategory
            codingLanguages {
              value
            }
            theme {
              primaryColor
              secondaryColor
              backdropColor
            }
            targetGroup {
              type
            }
            courseComponentRule {
              componentName
              order
              min
              max
            }
            defaultLoComponentRule {
              componentName
              order
            }
            thumbnail {
              id
              uri
            }
            bannerThumbnail {
              id
              uri
            }
            createdAt
        }
    }
    `,
    variables: {
      input
    },
    type: 'courses/update',
    key: 'courses',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'updateCourse')) {
        let thumbnailData = null
        let bannerData = null
        let updatedCourse = get(originalData, 'updateCourse')
        if (thumbnailFile) {
          thumbnailData = await addImageToCourse({
            file: thumbnailFile,
            typeField: 'thumbnail',
            courseId,
            prevFileId: get(updatedCourse, 'thumbnail.id')
          })
          updatedCourse = {
            ...updatedCourse,
            thumbnail: thumbnailData
          }
        }
        if (bannerFile) {
          bannerData = await addImageToCourse({
            file: bannerFile,
            typeField: 'bannerThumbnail',
            courseId,
            prevFileId: get(updatedCourse, 'bannerThumbnail.id')
          })
          updatedCourse = {
            ...updatedCourse,
            bannerThumbnail: bannerData
          }
        }
        extractedData.course = {
          ...updatedCourse
        }
      }
      return extractedData
    },
  })

export default updateCourse
