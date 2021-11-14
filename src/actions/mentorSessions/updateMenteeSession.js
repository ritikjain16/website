import gql from 'graphql-tag'
import duck from '../../duck'

const updateMenteeSession = async (
  id,
  input,
  mentorSessionConnectId,
  mentorMenteeSessionId,
  mentorMenteeInput
) => (
  duck.query({
    query: gql`
        mutation($input:MenteeSessionUpdate) {
          updateMenteeSession(id:"${id}",input:$input) {
            id
            bookingDate
          }
          updateMentorMenteeSession(id:"${mentorMenteeSessionId}",
          input: ${mentorMenteeInput},
          mentorSessionConnectId:"${mentorSessionConnectId}") {
            id
            sessionStatus
          }
        }
     `,
    variables: {
      input
    },
    type: 'mentorSessions/update',
    key: 'updateMenteeSession',
  })
)

export default updateMenteeSession
