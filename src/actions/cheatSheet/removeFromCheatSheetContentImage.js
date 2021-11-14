import gql from 'graphql-tag'
import duck from '../../duck'

const removeFromCheatSheetContentImage = async (cheatSheetId, fileId) => duck.query({
  query: gql`
    mutation {
    removeFromCheatSheetImage(
      cheatSheetContentId: "${cheatSheetId}"
      fileId: "${fileId}"
    ) {
      cheatSheetContent {
      id
    }
    }
  }
  `,
  type: 'cheatSheetContent/delete',
  key: 'removeFromCheatSheetContentImage',
})

export default removeFromCheatSheetContentImage
