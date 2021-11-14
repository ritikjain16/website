import gql from 'graphql-tag'
import duck from '../../duck'

const deleteCheatSheetContent = async (id) => duck.query({
  query: gql`
    mutation {
      deleteCheatSheetContent(id: "${id}") {
        id
        type
        statement
      }
    }
  `,
  type: 'cheatSheetContent/delete',
  key: 'deleteCheatSheetContent',
})

export default deleteCheatSheetContent
