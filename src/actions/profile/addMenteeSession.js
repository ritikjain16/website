import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const addMenteeSession = async (userId, topicId, input, courseConnectId) => duck.query({
  query: gql`
            mutation($input:MenteeSessionInput!) {
                addMenteeSession(input:$input,userConnectId:"${userId}",
                ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
                topicConnectId:"${topicId}") {
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
  type: 'menteeSession/add',
  key: `menteeSession/${userId}/${topicId}`,
  changeExtractedData: (extractedData, originalData) => {
    extractedData.topic = []
    extractedData.user = []
    extractedData.course = []
    extractedData.menteeSession = {
      ...get(originalData, 'addMenteeSession')
    }
    return extractedData
  }
})


export default addMenteeSession
