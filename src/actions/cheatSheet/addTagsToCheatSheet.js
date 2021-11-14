import gql from 'graphql-tag'
import duck from '../../duck'


const addTagsToCheatSheet = async (
  input = {},
  cheatSheetId,
  contentTagId
) =>
  duck.query({
    query: gql`
      mutation {
        addToCheatSheetContentTag(cheatSheetId: "${cheatSheetId}", contentTagId: "${contentTagId}") {
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
    type: 'addToCheatSheetContentTag/add',
    key: 'addToCheatSheetContentTag',
  })

export default addTagsToCheatSheet
