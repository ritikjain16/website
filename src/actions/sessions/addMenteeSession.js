import gql from 'graphql-tag'
import { get } from 'lodash'
// import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const addMenteeSession = async ({ userConnectId, topicConnectId, input, courseConnectId }) => {
  duck.query({
    query: gql`
      mutation($input:MenteeSessionInput!){
        addMenteeSession(
          input:$input,
          userConnectId:"${userConnectId}",
         ${topicConnectId ? `topicConnectId: "${topicConnectId}"` : ''}
          courseConnectId: "${courseConnectId}"
        ){
          id
          bookingDate
          user {
            id
          }
          course {
            id
            order
            title
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
    type: 'session/add',
    key: 'bookedSessions',
    changeExtractedData: (extractedData, originalData) => {
      if (get(originalData, 'addMenteeSession')) {
        extractedData.menteeSession = {
          ...get(originalData, 'addMenteeSession')
        }
      }
      return extractedData
    }
  })
}

export default addMenteeSession
