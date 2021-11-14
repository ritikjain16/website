import gql from 'graphql-tag'
import duck from '../../duck'

const removeProfilePic = async ({
  fileId,
  userId
}) => {
  duck.query({
    query: gql`
    mutation{
        removeFromUserProfilePic(
          fileId: "${fileId}",
          userId: "${userId}"
        ){
            user{
                id
                role
                name
                username
                email
                phone{
                    countryCode
                    number
                }
                gender
                mentorProfile{
                    id
                    codingLanguages{
                        value
                    }
                    experienceYear
                    sessionLink
                    meetingId
                    googleMeetLink
                    meetingPassword
                    pythonCourseRating5
                    pythonCourseRating4
                    pythonCourseRating3
                    pythonCourseRating2
                    pythonCourseRating1
                }
                profilePic{
                    id
                    uri
                }
            }
        }
      }
  `,
    type: 'userProfile/update',
    key: 'userProfile',
    // changeExtractedData: (original, extracted) => ({
    //   ...extractedData,
    //   salesOperationForMentorSales: {
    //     id: originalData.updateSalesOperation.firstMentorMenteeSession.id,
    //     salesOperation: originalData.updateSalesOperation
    //   }
    // })
  })
}

export default removeProfilePic
