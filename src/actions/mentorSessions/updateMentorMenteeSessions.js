import gql from 'graphql-tag'
import duck from '../../duck'

const updateMentorMenteeSession = async (id, input) => (
  duck.query({
    query: gql`
        mutation($input:MentorMenteeSessionUpdate) {
          updateMentorMenteeSession(id:"${id}",input:$input) {
            id
            sessionStatus
          }
        }
     `,
    variables: {
      input
    },
    type: 'mentorSessions/update',
    key: 'updateMentorMenteeSession',
  })
)

export default updateMentorMenteeSession
