import gql from 'graphql-tag'
import duck from '../../duck'

const deleteProduct = (id) =>
  duck.createQuery({
    query: gql`
      mutation {
        deleteProduct(id: "${id}") {
          id
        }
      }
    `,
    type: 'products/delete',
    key: 'deleteProduct'
  })

export default deleteProduct
