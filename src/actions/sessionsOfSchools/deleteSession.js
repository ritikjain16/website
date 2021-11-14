import gql from 'graphql-tag'
import duck from '../../duck'

const deleteSession = async (id, sessionType) => duck.query({
  query: gql`
    mutation{
        deleteMentorSession(id:"${id}") {
            id
        }
    }
  `,
  type: 'session/delete',
  key: `mentorSession/${sessionType}`
})

export default deleteSession
