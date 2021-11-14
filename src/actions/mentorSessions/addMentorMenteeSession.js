import gql from 'graphql-tag'
import duck from '../../duck'

const addMentorMenteeSession = async (
  id,
  mentorSessionConnectId,
  mentorMenteeInput,
  topicConnectId,
  courseConnectId,
  isMentorReadyToTakeClass
) => (
  duck.query({
    query: gql`
        mutation {
          ${isMentorReadyToTakeClass ?
    `addMentorMenteeSession(
            input: ${mentorMenteeInput},
            mentorSessionConnectId:"${mentorSessionConnectId}"
            menteeSessionConnectId:"${id}"
            topicConnectId: "${topicConnectId}"
            courseConnectId: "${courseConnectId}"
            ) {
              id
              sessionStatus
            }`
    : ''}
        }
     `,
    type: 'mentorSessions/update',
    key: 'updateMenteeSession',
  })
)

export default addMentorMenteeSession
