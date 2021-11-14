import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
// import updateRescheduleSheet from './updateRescheduleSheet'


const updateMentorProfile = async (
  id,
  input) => {
  duck.query({
    query: gql`
     mutation($input:MentorProfileUpdate!){
      updateMentorProfile(
        input:$input,
        id: "${id}",
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
    key: 'mentorProfileUpdate',
    changeExtractedData: (extracted) => ({
      userProfile: get(extracted, 'user')
    })
  })
}

export default updateMentorProfile
