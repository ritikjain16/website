import gql from 'graphql-tag'
import duck from '../../duck'

const deleteMentorMenteeSession = async (id, key) => duck.query({
  query: gql`
    mutation{
        deleteMentorMenteeSession(id:"${id}") {
            id
        }
    }
  `,
  type: 'mentorMenteeSession/delete',
  key: key || 'mentorMenteeSession',
})

export default deleteMentorMenteeSession
