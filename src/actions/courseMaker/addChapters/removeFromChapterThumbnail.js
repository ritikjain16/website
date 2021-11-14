import gql from 'graphql-tag'
import duck from '../../../duck'

const removeFromChapterThumbnail = async (chapterId, fileId) => duck.query({
  query: gql`
    mutation {
    removeFromChapterThumbnail(chapterId: "${chapterId}", fileId: "${fileId}") {
        chapter {
        id
        }
    }
    }
  `,
  type: 'chapters/delete',
  key: 'removeFromChapterThumbnail',
})

export default removeFromChapterThumbnail
