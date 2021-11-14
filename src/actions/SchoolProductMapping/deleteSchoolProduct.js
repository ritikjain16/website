import gql from 'graphql-tag'
import duck from '../../duck'

const deleteSchoolProduct = (productId) => {
  duck.query({
    query: gql`
        mutation deleteProduct{
  deleteProduct(
  id:"${productId}"
  ){
    id
  }
}
        `,
    type: 'products/delete',
    key: 'products'
  })
}

export default deleteSchoolProduct
