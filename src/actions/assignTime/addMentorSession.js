import gql from 'graphql-tag'
import duck from '../../duck'

const addMentorSession = (input, userConnectId, courseConnectId) => {
  duck.query({
    query: gql`
    mutation addmentorsession ($input: MentorSessionInput!) {
  addMentorSession(input: $input, 
    userConnectId: "${userConnectId}", 
    ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
  ) {
    id
  }
}
    `,
    variables: {
      input
    },
    type: 'mentorsession/add',
    key: 'mentorsession'
  })
}

export default addMentorSession
