import gql from 'graphql-tag'
import duck from '../../duck'


const updateCheatSheet = async (input, cheatSheetId) =>
  duck.query({
    query: gql`
      mutation($input: CheatSheetUpdate) {
      updateCheatSheet(id: "${cheatSheetId}", input: $input) {
        id
        title
        status
        order
        description
        createdAt
      }
    }
    `,
    variables: {
      input
    },
    type: 'cheatSheet/update',
    key: 'cheatSheets',
  })

export default updateCheatSheet
