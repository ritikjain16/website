import gql from 'graphql-tag'
import { get } from 'lodash'
import uploadFile from '../utils/uploadFile'
import duck from '../../duck'
// import fetchUserProfile from './fetchUserProfile'
import removeProfilePic from './removeProfilePic'

const updateUserProfile = async (userId) => duck.query({
  query: gql`
      query{
          user(
              id: "${userId}"
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
  type: 'userProfile/update',
  key: 'profilePicUpdate',
  changeExtractedData: (extracted) => ({
    ...extracted,
    userProfile: get(extracted, 'user')
  })
})

const addUserprofilePic = async ({
  file,
  userId,
  prevFileId
}) => {
  if (userId) {
    if (file) {
      const mappingInfo = file && {
        typeId: userId,
        type: 'User',
        typeField: 'profilePic'
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          removeProfilePic({ fileId: prevFileId, userId }).then(() => {
            uploadFile(file, fileInfo, mappingInfo).then(res => {
              if (res.id) {
                // fetchUserProfile()
                updateUserProfile(userId)
              }
            })
          })
        } else {
          uploadFile(file, fileInfo, mappingInfo).then(res => {
            if (res.id) {
              // fetchUserProfile()
              updateUserProfile(userId)
            }
          })
        }
      }
    }
    // dispatch(addTopicSuccess(topic))
    // return topic
  }
  return {}
}

export default addUserprofilePic
