import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const getDeleteMentorMenteeSessionQuery = (mentorMenteeSessionId) => `
    deleteMentorMenteeSession(id: "${mentorMenteeSessionId}") {
      id
    }
  `


const deleteMenteeSession = async (sessionId, mentorMenteeSessionId) => {
  duck.query({
    query: gql`
      mutation{
        deleteMenteeSession(id: "${sessionId}"){
          id
        }
        ${mentorMenteeSessionId ? getDeleteMentorMenteeSessionQuery(mentorMenteeSessionId) : ''}
    }
  `,
    type: 'session/delete',
    key: 'bookedSessions'
    // changeExtractedData: (extractedData, originalData) => {
    //   if (get(originalData, 'addMentorSession') && get(extractedData, 'session')) {
    //     extractedData.session.mentorName = get(originalData, 'addMentorSession.user.name') ||
    //         get(originalData, 'addMentorSession.user.username')
    //   }

    //   return extractedData
    // }
  })
}

export default deleteMenteeSession
