import gql from 'graphql-tag'
import duck from '../../duck'

const deleteMentorMenteeSession = async (id) => (
  duck.query({
    query: gql`
        mutation {
          deleteMentorMenteeSession(id:"${id}") {
            id
          }
        }
     `,
    type: 'mentorSessions/delete',
    key: 'deleteMentorMenteeSession',
  })
)

export default deleteMentorMenteeSession
