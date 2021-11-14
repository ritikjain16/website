import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const sendTransactionalMessage = async (userId, sessionLink, type, sessionId) => {
  duck.query({
    query: gql`
      query {
        sendTransactionalMessage(
          userId:"${userId}",
          input: {
            sessionLink:"${sessionLink}"
            messageType: ${type}
            medium: all
          }) {
          result
        }
      }
    `,
    changeExtractedData: (extractedData, originalData) => {
      const result = get(originalData, 'sendTransactionalMessage.result', false)
      if (result && type === 'sendSessionLink') {
        return {
          completedSession: {
            id: sessionId,
            sendSessionLink: true
          }
        }
      }
      return {}
    },
    type: 'sendTransactionalMessage/fetch'
  })
}

export default sendTransactionalMessage
