import gql from 'graphql-tag'
import duck from '../../../duck'

const removeFromChapterTopic = async (chapterId, topicId) => duck.query({
  query: gql`
    mutation {
      removeFromChapterTopic(chapterId: "${chapterId}", topicId: "${topicId}") {
        chapter {
          id
        }
      }
    }
  `,
  type: 'chapters/delete',
  key: 'removeFromChapterTopic',
})

export default removeFromChapterTopic
