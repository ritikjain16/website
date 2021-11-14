import gql from 'graphql-tag'
import duck from '../../duck'

const updateSessionLog = (sessionId, input) => (
  duck.query({
    query: gql`
        mutation updateSessionLog($input: SessionLogUpdate){
        updateSessionLog(
          input: $input,
          id:"${sessionId}",
        ) {
          id
          sessionStatus
        }
        }
        `,
    variables: {
      input
    },
    type: 'mentorSessions/update',
    key: 'updateSessionLog'
  })
)

export default updateSessionLog
