import gql from 'graphql-tag'
import duck from '../../duck'

const fetchExistingSchoolProduct = () => {
  duck.query({
    query: gql`
        query fetchExistingSchoolProduct{
  
  products(filter: {and: [
    {country: india},
    {targetUserType:b2c}
  ]}) {
    id
 
    title
    status
    price {
      amount
      currency
    }
 
    type
  
  }

}
        `,
    type: 'products/fetch',
    key: 'products'
  })
}

export default fetchExistingSchoolProduct
