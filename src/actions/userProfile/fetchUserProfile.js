import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'

const fetchUserProfile = async () => {
  const savedId = getDataFromLocalStorage('login.id')
  return duck.query({
    query: gql`
        query{
            user(
                id: "${savedId}"
            ){
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
                    meetingPassword
                    googleMeetLink
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
    `,
    type: 'userProfile/fetch',
    key: 'userProfile',
    changeExtractedData: (extracted) => ({
      ...extracted,
      userProfile: get(extracted, 'user')
    })
  })
}

export default fetchUserProfile
