import gql from 'graphql-tag'
import duck from '../../../duck'

const removeFromTopicThumbnail = async (topicId, fileId, typeField) => duck.query({
  query: gql`
    mutation {
      ${
  typeField === 'thumbnail' ? `
    removeFromTopicThumbnail(topicId: "${topicId}", fileId: "${fileId}") {
        topic {
          id
        }
      }
    ` : `
    removeFromTopicThumbnailSmall(topicId: "${topicId}", fileId: "${fileId}") {
        topic {
          id
        }
      }`
}
    }
  `,
  type: 'topics/delete',
  key: 'removeFromTopicThumbnail',
})

export default removeFromTopicThumbnail
