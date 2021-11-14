import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const bookedFirstSessions = async (userIds = []) => duck.query({
  query: gql`
    query{
        menteeSessions(filter:{
            and: [
              {topic_some:{order:1}}
              {source_not:school}
              {user_some: {id_in: [${userIds}]}}
            ]
        }){
          id
          course {
            id
            order
            title
          }
          bookingDate
          user{
            id
          }
          topic {
            id
          }
          ${getSlotNames()}
        }
        mentorMenteeSessions(
          filter: {
            and: [
              { topic_some: { order: 1 } }
              { source_not: school }
              {
                menteeSession_some: {
                  user_some: {
                    id_in: [${userIds}]
                  }
                }
              }
            ]
          }
        ) {
          id
          sendSessionLink
          sessionStatus
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
    }
  `,
  type: 'session/fetch',
  key: 'bookedSessions',
  changeExtractedData: (extractedData, originalData) => {
    extractedData.completedSession = []
    extractedData.course = []
    extractedData.mentorMenteeSessions = get(originalData, 'mentorMenteeSessions', [])
    extractedData.topic = []
    extractedData.menteeSession = get(originalData, 'menteeSessions', [])
    return extractedData
  }
})

export default bookedFirstSessions
