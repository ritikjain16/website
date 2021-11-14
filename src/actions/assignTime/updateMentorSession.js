import gql from 'graphql-tag'
import duck from '../../duck'

const updateMentorSession = async (input, mentorSessionId, courseConnectId) =>
  duck.query({
    query: gql`
        mutation updatementorsession($input: MentorSessionUpdate){
  updateMentorSession(
    id:"${mentorSessionId}",
    ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
    input:$input
  ){
    id
  }
}
    `,
    variables: {
      input
    },
    type: 'mentorsession/update',
    key: 'mentorsession'
  })

export default updateMentorSession
