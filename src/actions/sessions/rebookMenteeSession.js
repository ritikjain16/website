import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const rebookMenteeSession = async ({ input }) => {
  duck.query({
    query: gql`
      mutation($input:RebookMenteeSessionInput!){
        rebookMenteeSession(
          input:$input
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
      if (get(originalData, 'rebookMenteeSession')) {
        extractedData.menteeSession = {
          ...get(originalData, 'rebookMenteeSession')
        }
      }

      return extractedData
    }
  })
}

export default rebookMenteeSession
