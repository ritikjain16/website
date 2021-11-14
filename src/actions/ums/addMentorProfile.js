import gql from 'graphql-tag'
import duck from '../../duck'

const addMentorProfile = async (id) => duck.query({
  query: gql`
    mutation {
    addMentorProfile(input: {}, userConnectId: "${id}") {
        id
    }
    }
    `,
  type: 'mentorProfile/add',
  key: 'mentorProfile',
})

export default addMentorProfile
