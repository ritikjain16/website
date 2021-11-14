import gql from 'graphql-tag'
import { get } from 'lodash'
import addImageToCourse from './addImageToCourse'
import duck from '../../../duck'


const addCourse = async ({ input, thumbnailFile, bannerFile }) =>
  duck.query({
    query: gql`
    mutation($input: CourseInput!) {
        addCourse(input: $input) {
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
    type: 'courses/add',
    key: 'courses',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'addCourse')) {
        const courseId = get(originalData, 'addCourse.id')
        let thumbnailData = null
        let bannerData = null
        let newCourse = get(originalData, 'addCourse')
        if (thumbnailFile) {
          thumbnailData = await addImageToCourse({
            file: thumbnailFile,
            typeField: 'thumbnail',
            courseId
          })
          newCourse = {
            ...newCourse,
            thumbnail: thumbnailData
          }
        }
        if (bannerFile) {
          bannerData = await addImageToCourse({
            file: bannerFile,
            typeField: 'bannerThumbnail',
            courseId
          })
          newCourse = {
            ...newCourse,
            bannerThumbnail: bannerData
          }
        }
        extractedData.course = {
          ...newCourse
        }
      }
      return extractedData
    },
  })

export default addCourse
