import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const addMentorProfile = async (userId) => {
  const input = {
    codingLanguages: [],
    experienceYear: 0
  }
  duck.query({
    query: gql`
    mutation($input:MentorProfileInput!){
        addMentorProfile(
            userConnectId: "${userId}",
            input:$input
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
    variables: {
      input
    },
    type: 'userProfile/update',
    key: 'userProfile',
    changeExtractedData: (extracted) => ({
      userProfile: get(extracted, 'user')
    })
  })
}

export default addMentorProfile
