import { notification } from 'antd'
import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const sendTransactionalMessage = async (userId, sessionLink, type, sessionId) => {
  if (type === 'sendSessionLink') {
    notification.info({
      message: 'Sending link...',
      key: 'sendingLink',
      duration: 0
    })
  }
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
      notification.close('sendingLink')
      if (result && type === 'sendSessionLink') {
        notification.success({
          message: 'Session link sent'
        })
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
