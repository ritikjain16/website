import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateMenteeSession = async (id, userId, input) => {
  duck.query({
    query: gql`
     mutation($input:MenteeSessionUpdate!) {
        updateMenteeSession(id: "${id}", input:$input) {
            id
            course {
              id
              title
            }
            user {
              id
            }
            topic {
              id
            }
            bookingDate
            ${getSlotNames()}
        }
    }
  `,
    variables: {
      input
    },
    type: 'menteeSession/update',
    key: `menteeSession/${userId}`,
    changeExtractedData: (extractedData, originalData) => {
      extractedData.menteeSession = {
        ...get(originalData, 'updateMenteeSession')
      }
      extractedData.course = []
      return extractedData
    }
  })
}

export default updateMenteeSession
