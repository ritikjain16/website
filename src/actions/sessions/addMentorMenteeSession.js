import gql from 'graphql-tag'
import { get } from 'lodash'
import { MENTOR } from '../../constants/roles'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const addMentorMenteeSession = async (
  mentorSessionConnectedId,
  menteeSessionConnectedId,
  topicConnectedId,
  date,
  time,
  input,
  key,
  courseConnectId
) => duck.query({
  query: gql`
        mutation($input:MentorMenteeSessionInput!) {
            addMentorMenteeSession(input: $input, mentorSessionConnectId: "${mentorSessionConnectedId}", 
            menteeSessionConnectId: "${menteeSessionConnectedId}", topicConnectId: "${topicConnectedId}",
            ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
            ) {
                id
                sessionStatus
                course{
                    id
                    title
                  }
                mentorSession{
                  id
                  user {
                    id
                    name
                    username
                    createdAt
                    role
                    mentorProfile {
                      sessionLink
                    }
                  }
                }
                menteeSession {
                  id
                  course{
                    id
                  }
                  createdAt
                  user {
                    id
                    name
                    username
                    createdAt
                  }
                  bookingDate
                  ${getSlotNames()}
                }
                topic{
                    id
                    title
                    order
                }
            }
        }
    `,
  variables: {
    input,
    tokenType: 'withMenteeMentorToken'
  },
  type: 'mentorMenteeSession/add',
  key: key || `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}/${menteeSessionConnectedId}`,
  changeExtractedData: (extractedData, originalData) => {
    extractedData.completedSession = {
      ...get(originalData, 'addMentorMenteeSession')
    }
    if (extractedData && extractedData.completedSession && extractedData.menteeSession) {
      extractedData.completedSession.menteeSessionCreatedAt =
          extractedData.menteeSession[0].createdAt
      if (originalData && get(originalData, 'addMentorMenteeSession')) {
        extractedData.completedSession.menteeId = get(originalData, 'addMentorMenteeSession.menteeSession.user.id')
        extractedData.completedSession.topicId = get(originalData, 'addMentorMenteeSession.topic.id')
        extractedData.completedSession.topicOrder = get(originalData, 'addMentorMenteeSession.topic.order')
        extractedData.completedSession.topicTitle = get(originalData, 'addMentorMenteeSession.topic.title')
        extractedData.completedSession.bookingDate = get(originalData, 'addMentorMenteeSession.menteeSession.bookingDate')
        extractedData.completedSession.mentorId = get(originalData, 'addMentorMenteeSession.mentorSession.user.id')
        extractedData.completedSession.sessionId = get(originalData, 'addMentorMenteeSession.mentorSession.id')
        extractedData.completedSession.sessionInfo = get(originalData, 'addMentorMenteeSession.menteeSession')
      }
      if (extractedData.user) {
        extractedData.user.forEach((data, index) => {
          if (get(data, 'role') === MENTOR) {
            extractedData.user[index].existMenteeSession = [get(originalData, 'addMentorMenteeSession.menteeSession')]
          }
        })
      }
    }
    return extractedData
  }
})

export default addMentorMenteeSession
