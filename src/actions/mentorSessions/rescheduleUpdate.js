import gql from 'graphql-tag'
import duck from '../../duck'

const resheduleSession = async (
  id,
  input,
) => (
  duck.query({
    query: gql`
        mutation($input:MenteeSessionUpdate) {
          updateMenteeSession(id:"${id}",input:$input) {
            id
            bookingDate
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

export default resheduleSession
