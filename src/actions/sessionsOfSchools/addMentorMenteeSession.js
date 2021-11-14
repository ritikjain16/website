import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const addMentorMenteeSession = (
  mentorSessionConnectedId,
  menteeSessionConnectedId,
  topicConnectedId,
  date,
  time,
  input,
  key
) => duck.query({
  query: gql`
        mutation($input:MentorMenteeSessionInput!) {
            addMentorMenteeSession(input: $input, mentorSessionConnectId: "${mentorSessionConnectedId}", 
            menteeSessionConnectId: "${menteeSessionConnectedId}", topicConnectId: "${topicConnectedId}") {
                id
                sessionStatus
                mentorSession{
                  id
                  user {
                    id
                    name
                    username
                    createdAt
                    mentorProfile {
                      sessionLink
                    }
                  }
                }
                menteeSession {
                  id
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
      }
    }

    return extractedData
  }
})

export default addMentorMenteeSession
