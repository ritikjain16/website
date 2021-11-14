import gql from 'graphql-tag'
import duck from '../../duck'


const removeTagFromCheatSheet = async (
  input = {},
  cheatSheetId,
  contentTagId
) =>
  duck.query({
    query: gql`
      mutation {
    removeFromCheatSheetContentTag(cheatSheetId: "${cheatSheetId}", contentTagId: "${contentTagId}") {
        contentTag {
          id
          title
        }
    }
    }
    `,
    variables: {
      input,
    },
    type: 'removeFromCheatSheetContentTag/fetch',
    key: 'removeFromCheatSheetContentTag',
  })

export default removeTagFromCheatSheet
