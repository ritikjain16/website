import gql from 'graphql-tag'
import duck from '../../duck'

const deleteCheatSheet = async (id) => duck.query({
  query: gql`
      mutation {
      deleteCheatSheet(id: "${id}") {
        id
        title
      }
    }
  `,
  type: 'cheatSheet/delete',
  key: 'cheatSheets',
})

export default deleteCheatSheet
