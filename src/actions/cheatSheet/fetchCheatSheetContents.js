import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_CHEAT_SHEET_CONTENT = cheatSheetId => gql`
{
  cheatSheet(id: "${cheatSheetId}") {
    id
    title
    description
    tags {
      id
      title
    }
    content {
      id
      order
      type
      statement
      syntax
      terminalInput
      terminalOutput
      image {
        id
        uri
      }
      emoji {
        id
        code
        image {
          id
          uri
        }
      }
    }
  }
}
`

function fetchCheatSheetContent(cheatSheetId) {
  return duck.query({
    query: FETCH_CHEAT_SHEET_CONTENT(cheatSheetId),
    type: 'cheatSheet/fetch',
    key: 'cheatSheet',
  })
}

export default fetchCheatSheetContent
