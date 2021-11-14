import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchCourses = async () =>
  duck.query({
    query: gql`
    {
        courses {
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
        coursesMeta {
          count
        }
    }
    `,
    type: 'courses/fetch',
    key: 'courses',
  })

export default fetchCourses

