import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const getFilters = (userIds, customFilters) => {
  // let filter = '{or:[{batchSessions_some:{
  // batch_exists:true}},{mentorMenteeSessions_some:{menteeSession_exists:true}}]},'
  let filter = ''
  if (customFilters) {
    filter += customFilters
  }
  if (userIds) {
    filter += `{user_some:{id_in:[${userIds}]}}`
  }

  return filter
}

const fetchMentorSessions = async (
  userIds,
  filters = null,
  key = null,
) => duck.query({
  query: gql`
    query {
        mentorSessions(
        filter: { and: [${getFilters(userIds, filters)}]
    }) {
            id
            course {
                id
                title
            }
            createdAt
            updatedAt
            availabilityDate
            sessionType
            user {
                id
                name
                email
                role
                username
                profile: mentorProfile {
                  sessionLink
                }
            }
            ${getSlotNames()}
            batchSessions{
                topic {
                  order
                  title
                  thumbnailSmall {
                    uri
                  }
                }
                course {
                  id
                  title
                }
                batch{
                  type
                  code
                  students {
                    id
                    userData: user {
                      id
                      name
                      profilePic {
                        uri
                      }
                    }
                  }
                }
                id
                sessionStartDate
                sessionEndDate
                sessionRecordingLink
                bookingDate
                ${getSlotNames()}
                sessionStatus
                attendance{
                  student{
                    id
                    user{
                      id
                      name
                    }
                  }
                  isPresent
                  status
                }
            }
            mentorMenteeSessions{
                id
                salesOperationData: salesOperation {
                  id
                }
                topic {
                  order
                  title
                  description
                  thumbnailSmall {
                    uri
                  }
                }
                course {
                  id
                  title
                }
                sessionRecordingLink
                isFeedbackSubmitted
                hasRescheduled
                sessionStatus
                sendSessionLink
                sessionStartDate
                sessionEndDate
                menteeSession{
                  id
                  bookingDate
                  user {
                      id
                      name
                  }
                  ${getSlotNames()}
                }
            }
    }
  }
  `,
  type: 'mentorSessions/fetch',
  key: key || 'mentorSessions',
  changeExtractedData: (extractedData, originalData) => {
    if (originalData.mentorSessions) {
      extractedData.mentorSessions = originalData.mentorSessions
    }
    if (originalData.mentorSessions && originalData.mentorSessions.length) {
      return extractedData
    }
    return {
      ...extractedData,
      mentorSessions: []
    }
  }
})

export default fetchMentorSessions
