import gql from 'graphql-tag'
import { get } from 'lodash'
// import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateMenteeSession = async ({ sessionId, input }) => {
  duck.query({
    query: gql`
      mutation($input:MenteeSessionUpdate!){
        updateMenteeSession(
          input:$input,
          id:"${sessionId}",
        ){
          id
          bookingDate
          course {
            id
            order
            title
          }
          user {
            id
          }
          topic {
            id
          }
          ${getSlotNames()}
        }
      }
  `,
    variables: {
      input
    },
    type: 'session/update',
    key: 'bookedSessions',
    changeExtractedData: (extractedData, originalData) => {
      if (get(originalData, 'updateMenteeSession')) {
        extractedData.menteeSession = {
          ...get(originalData, 'updateMenteeSession')
        }
      }

      return extractedData
    }
  })
}

export default updateMenteeSession
