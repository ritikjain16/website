import gql from 'graphql-tag'
import duck from '../../duck'


const addCheatSheet = async (input, topicId) =>
  duck.query({
    query: gql`
      mutation($input: CheatSheetInput!) {
        addCheatSheet(
          input: $input
          topicConnectId: "${topicId}"
        ) {
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
    type: 'cheatSheet/add',
    key: 'cheatSheets',
  })

export default addCheatSheet
