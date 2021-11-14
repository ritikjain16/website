import gql from 'graphql-tag'
import duck from '../../duck'

const updateMentorMenteeSessionStatus = async (
  id,
  input) => {
  duck.query({
    query: gql`
    mutation($input: MentorMenteeSessionUpdate) {
  updateMentorMenteeSession(id: "${id}", input: $input) {
    leadStatus
  }
}

  `,
    variables: {
      input
    },
    type: 'mentorMenteeSession/update',
    key: 'completedSession',
  })
}

export default updateMentorMenteeSessionStatus
