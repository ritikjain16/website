// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'


const addProduct = (input, courseConnectId) =>
  duck.createQuery({
    query: gql`
      mutation($input:ProductInput!){
        addProduct(input: $input, courseConnectId: "${courseConnectId}") {
          id
          course {
            id
            title
          }
          title
          description
          features {
            statement
            order
          }
          showOnWebsite
          price {
            amount
            currency
          }
          status
          type
          userRole
          createdAt
          discounts {
            id
            isDefault
            percentage
            expiryDate
            createdAt
            code
          }
          country
        }
      }
    `,
    variables: {
      input
    },
    type: 'products/add',
    key: 'product'
  })

export default addProduct
