import gql from 'graphql-tag'
import duck from '../../duck'

const updateSchoolProduct = (input, productId) => {
  duck.query({
    query: gql`
    mutation updateProduct($input:ProductUpdate!){
  updateProduct(
    input:$input,
    id:"${productId}"
  ){
    id
    title
    price {
      amount
      currency
    }
    status
    type
  }
}
        `,
    variables: {
      input,
    },
    type: 'products/update',
    key: 'products'
  })
}

export default updateSchoolProduct
