import gql from 'graphql-tag'
import duck from '../../duck'

const deleteWorkbook = async (id) => duck.query({
  query: gql`
      mutation {
        deleteWorkbook(id: "${id}") {
            id
        }
    }
  `,
  type: 'workbook/delete',
  key: 'workbooks',
})

export default deleteWorkbook
