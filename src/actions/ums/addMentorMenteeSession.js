import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const addMentorMenteeSession = async (
  mentorSessionConnectedId,
  menteeSessionConnectedId,
  input,
  topicConnectedId,
  courseConnectId
) => duck.query({
  query: gql`
    mutation($input:MentorMenteeSessionInput!) {
      addMentorMenteeSession(input: $input, mentorSessionConnectId: "${mentorSessionConnectedId}", 
      menteeSessionConnectId: "${menteeSessionConnectedId}",topicConnectId: "${topicConnectedId}",
      ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
      ) {
        id
        sessionStatus
        sendSessionLink
        menteeSession {
          id
          user{
            id
            name
          }
        }
        mentorSession {
          id
          user {
            id
            name
          }
        }
      }
    }`,
  variables: {
    input,
  },
  type: 'mentorMenteeSessions/add',
  key: 'bookedSessions',
  changeExtractedData: (extractedData, originalData) => {
    if (originalData && get(originalData, 'addMentorMenteeSession')) {
      extractedData.menteeSession = []
      extractedData.session = []
      extractedData.user = []
      extractedData.completedSession = []
      extractedData.mentorMenteeSessions = {
        ...get(originalData, 'addMentorMenteeSession')
      }
    }
    return { ...extractedData }
  }
})

export default addMentorMenteeSession
