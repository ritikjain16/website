import gql from 'graphql-tag'
import duck from '../../../duck'

const removeFromMessageImage = async (messageId, imageId) => duck.query({
  query: gql`
  mutation {
    removeFromMessageImage(messageId: "${messageId}", fileId: "${imageId}") {
        message {
        id
        }
    }
  }
  `,
  type: 'messages/delete',
  key: 'removeFromMessageImage',
})

export default removeFromMessageImage
