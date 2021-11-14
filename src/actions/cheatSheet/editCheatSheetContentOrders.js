import gql from 'graphql-tag'
import duck from '../../duck'


const editCheatSheetContents = async (input) =>
  duck.query({
    query: gql`
      mutation($input: [CheatSheetContentsUpdate]!) {
        updateCheatSheetContents(input: $input) {
            id
            order
            type
            statement
            syntax
            emoji {
            id
            code
            image {
                id
                uri
            }
            }
            image {
            id
            uri
            }
            terminalInput
            terminalOutput
        }
      }
    `,
    variables: {
      input
    },
    type: 'updateCheatSheetContents/update',
    key: 'updateCheatSheetContents',
  })

export default editCheatSheetContents
