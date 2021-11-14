import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchUserCourseCompletion = async ({ filterQuery, perPage = 10, skip = 0 }) =>
  duck.query({
    query: gql`
      {
      userCourseCompletions(filter:{ and: [ ${filterQuery || ''} ] }
      first: ${perPage}
      skip: ${perPage * skip}
      ) {
        id
        rating
        comment
        mentorComment
        course{
          title
        }
        certificate{
          uri
          signedUri
        }
        courseEndingDate
        mentors{
          id
          name
        }
        user {
          id
          name
          studentProfile {
            parents{
              user {
                id
                name
                phone {
                  number
                }
                email
              }
            }
            grade
            section
            batch {
              code
              type
            }
            school {
              name
            }
          }
        }
      }
      schools{
        id
        name
      }
    }
    `,
    type: 'userCourseCompletions/fetch',
    key: 'userCourseCompletions',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.userCourseCompletions = get(originalData, 'userCourseCompletions', [])
      extractedData.schools = get(originalData, 'schools', [])
      return extractedData
    },
  })

export default fetchUserCourseCompletion
